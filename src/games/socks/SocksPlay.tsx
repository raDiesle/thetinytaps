import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playBoing, playCountNote, playKnock, playMelody, playPlop, playRandomNote, playTwinkle, playWash, playWhoosh } from "@/lib/sfx";
import { useAppLanguage, useT, voiceFor } from "@/lib/language";
import { countGame, gameEnded, isPlaytimeOver } from "@/lib/playtime";
import { speak } from "@/lib/speech";
import { tapState } from "@/lib/tapTargets";
import { dealPairs, nextLevel, oneOf, SOCK_LEVELS, SOCK_TEXTS, shuffle, type SockLook } from "./content";
import { Peg, SockDrawing, WashingMachine } from "./drawings";
import type { SocksSettings } from "./settings";

/** The full machine stands still for a moment before it starts on its own. */
const INTRO_MS = 600;
/** How long the drum turns before the door opens; matches the drum animation in socks.css. */
const WASH_MS = 2400;
/** Between two socks falling out of the machine, on the first step; it gets quicker as the child climbs. */
const TUMBLE_STEP_MS = 110;
/** How long one sock takes to tumble onto the floor; matches `.sock-cell` in socks.css. */
const TUMBLE_MS = 600;
/** A pair's hop from the floor onto the line, without any Schwung; matches `.sock` in socks.css. */
const FLY_MS = 800;
/** The quickest hop, with much Schwung. */
const FLY_MIN_MS = 420;
/** After the last pair hangs: they jump for joy before the line is pulled away. */
const CHEER_MS = 1500;
/** The line with all socks is pulled out of the picture; matches `sock-line-pull` in socks.css. */
const PULL_MS = 1000;
/** Width of the sock drawing as a share of its height (its viewBox is 64 × 96). */
const SOCK_ASPECT = 64 / 96;
/** The biggest a sock on the floor gets, on a large screen with few socks. */
const MAX_SOCK_PX = 170;

/**
 * intro: only the full machine; washing: the drum turns; sorting: socks on the floor; cheer: all on the line, they jump;
 * pull: the line is pulled out of the picture, then the next socks tumble out (sorting again).
 */
type Phase = "intro" | "washing" | "sorting" | "cheer" | "pull";

/** One sock lying on the floor, a little crooked. */
interface FloorSock {
  pair: number;
  rotate: number;
  /** Small shift inside its grid cell, in % of its own size, so the pile doesn't look like a grid. */
  shift: [number, number];
}

interface Round {
  id: number;
  /** The difficulty step it was dealt at (an index into `SOCK_LEVELS`). */
  level: number;
  looks: SockLook[];
  socks: FloorSock[];
}

/** Where a sock flies to on the line, relative to where it lies, and how long it takes. */
interface Flight {
  x: number;
  y: number;
  scale: number;
  ms: number;
}

function newRound(id: number, level: number): Round {
  const looks = dealPairs(SOCK_LEVELS[level]);
  const socks = shuffle(looks.flatMap((_, pair) => [pair, pair])).map((pair) => ({
    pair,
    rotate: Math.round(Math.random() * 60 - 30),
    shift: [Math.round(Math.random() * 20 - 10), Math.round(Math.random() * 16 - 8)] as [number, number],
  }));
  return { id, level, looks, socks };
}

/** Columns and sock height that give `count` socks the most room in a `width` × `height` box. */
function fitPile(count: number, width: number, height: number) {
  let best = { columns: 1, size: 0 };
  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const size = Math.min((height / rows) * 0.8, ((width / columns) * 0.8) / SOCK_ASPECT, MAX_SOCK_PX);
    if (size > best.size) best = { columns, size: Math.floor(size) };
  }
  return best;
}

/** Socks tumble out a little quicker on each step up. */
const tumbleStep = (level: number) => Math.max(60, TUMBLE_STEP_MS - level * 5);

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/**
 * "Socken-Paare" (N-45): the washing machine spins by itself, socks tumble out, two same ones hop onto the line
 * together. When all hang, the line is pulled away and the next wash tumbles out, harder or easier by how it went.
 */
export function SocksPlay({ settings }: { settings: SocksSettings }) {
  const language = useAppLanguage();
  const texts = useT()(SOCK_TEXTS);
  const [round, setRound] = useState(() => newRound(0, 0));
  const [phase, setPhase] = useState<Phase>("intro");
  const [selected, setSelected] = useState<number | null>(null);
  /** Bumped to make the selected sock wiggle again when it is tapped once more. */
  const [nudge, setNudge] = useState(0);
  /** Pairs in the order they were found; the k-th one hangs in the k-th place on the line. */
  const [lineOrder, setLineOrder] = useState<number[]>([]);
  /** Pairs that have arrived on the line (their floor socks are gone). */
  const [landed, setLanded] = useState<number[]>([]);
  /** Socks on their way to the line, by their index on the floor. */
  const [flights, setFlights] = useState<Record<number, Flight>>({});
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const [fit, setFit] = useState({ columns: 2, size: 100 });
  const { bursts, spawn } = useBursts();

  const gridRef = useRef<HTMLDivElement>(null);
  const sockRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Refs as well as state: a fast second tap or key can come before React has rendered the first.
  const selectedRef = useRef<number | null>(null);
  const matchedRef = useRef(new Set<number>());
  const focusRef = useRef<number | null>(null);
  /** For the difficulty: when the socks of this wash lay on the floor, and how often another sock than the partner came. */
  const sortStartRef = useRef(0);
  const missesRef = useRef(0);
  /** Schwung: pairs found one after the other without another sock in between, over the washes. */
  const streakRef = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const say = useCallback(
    (text: string) => {
      // A sentence not translated yet comes in German, and the German voice reads it.
      const voice = voiceFor(text, language);
      if (settings.speech) speak(text, voice, { rate: 0.85 });
    },
    [settings.speech, language.id, language.speechLang],
  );

  // The socks get as big as the floor allows, also when the screen turns.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const next = fitPile(round.socks.length, grid.clientWidth, grid.clientHeight);
      setFit((prev) => (prev.columns === next.columns && prev.size === next.size ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [round.socks.length]);

  const funBurst = (x?: number, y?: number) => {
    spawn(x, y);
    if (settings.sounds) playRandomNote();
  };

  /** The socks of `next` tumble out of the machine onto the floor. */
  const tumble = (next: Round) => {
    setPhase("sorting");
    const step = tumbleStep(next.level);
    if (settings.sounds) next.socks.forEach((_, i) => later(200 + i * step, playPlop));
    // The clock for the difficulty starts once the last sock lies; a toddler can't pick one still in the air.
    sortStartRef.current = performance.now() + (next.socks.length - 1) * step + TUMBLE_MS;
    missesRef.current = 0;
  };

  // The game starts on its own (its card was the tap): the full machine, a moment later it washes, then the socks.
  // Everything goes through `later`, so React's second mount while developing doesn't wash twice.
  useEffect(() => {
    later(INTRO_MS, () => {
      setPhase("washing");
      if (settings.sounds) playWash();
    });
    later(INTRO_MS + WASH_MS, () => {
      say(texts.start);
      tumble(round);
    });
  }, []);

  /** The next wash: a fresh floor and an empty line, at the difficulty `level`. */
  const startRound = (level: number) => {
    const next = newRound(round.id + 1, level);
    setRound(next);
    setSelected(null);
    selectedRef.current = null;
    matchedRef.current = new Set();
    setLineOrder([]);
    setLanded([]);
    setFlights({});
    setFocus(null);
    focusRef.current = null;
    tumble(next);
  };

  /** All pairs hang: they jump for joy, then the line is pulled out of the picture and the next wash comes. */
  const finish = () => {
    const level = nextLevel(round.level, { pairs: round.looks.length, misses: missesRef.current, ms: performance.now() - sortStartRef.current });
    setPhase("cheer");
    if (settings.sounds) playMelody();
    say(texts.done);
    for (let i = 0; i < 10; i++) later(i * 120, () => spawn());
    later(CHEER_MS, () => {
      // Every wash is a game for a game limit: with the last one played, the game says good night (GameShell).
      gameEnded();
      if (isPlaytimeOver()) return;
      countGame();
      setPhase("pull");
      if (settings.sounds) playWhoosh();
      later(PULL_MS, () => startRound(level));
    });
  };

  /** Both socks of `pair` (found by the child) hop from the floor onto their place on the line. */
  const hang = (pair: number, a: number, b: number) => {
    matchedRef.current.add(pair);
    const streak = ++streakRef.current;
    // The more Schwung, the quicker the hop.
    const ms = Math.max(FLY_MIN_MS, FLY_MS - (streak - 1) * 80);
    const slot = matchedRef.current.size - 1;
    setLineOrder((order) => [...order, pair]);
    const next: Record<number, Flight> = {};
    [a, b].forEach((index, j) => {
      const sock = sockRefs.current[index];
      const target = slotRefs.current[slot * 2 + j];
      const cell = sock?.parentElement;
      if (!sock || !target || !cell) return;
      // From its cell, not its own box: the first sock is still lifted, and that lift goes away during the flight.
      const [shiftX, shiftY] = round.socks[index].shift;
      const middle = centre(cell.getBoundingClientRect());
      const from = { x: middle.x + (shiftX / 100) * sock.offsetWidth, y: middle.y + (shiftY / 100) * sock.offsetHeight };
      const to = centre(target.getBoundingClientRect());
      next[index] = { x: to.x - from.x, y: to.y - from.y, scale: target.offsetHeight / sock.offsetHeight, ms };
    });
    setFlights((f) => ({ ...f, ...next }));
    if (settings.sounds) {
      // Each pair in a row a note higher up the scale, so a quick run climbs like a tune.
      later(120, () => playCountNote(Math.min(streak - 1, 7)));
      later(150, playBoing);
    }
    say(oneOf(texts.pair));

    later(ms, () => {
      setLanded((l) => [...l, pair]);
      if (settings.sounds) {
        playKnock(1500);
        later(120, () => playKnock(1300));
        if (streak >= 3) playTwinkle();
      }
      // Stars at the line from the third pair in a row on.
      if (streak >= 3) {
        const target = slotRefs.current[slot * 2]?.getBoundingClientRect();
        if (target) for (let i = 0; i < Math.min(streak - 1, 5); i++) spawn(target.right, target.top + target.height / 2);
      }
    });

    if (matchedRef.current.size === round.looks.length) later(ms + 300, finish);
  };

  /** The child tapped (or chose by key) the sock at `index` on the floor. */
  const pick = (index: number) => {
    const sock = round.socks[index];
    if (phase !== "sorting" || matchedRef.current.has(sock.pair)) return;
    const before = selectedRef.current;
    if (settings.sounds) playCountNote(sock.pair);
    if (before === index) {
      setNudge((n) => n + 1);
      return;
    }
    if (before !== null && round.socks[before].pair === sock.pair) {
      selectedRef.current = null;
      setSelected(null);
      hang(sock.pair, before, index);
      return;
    }
    // A different one: the first goes back down, this one is lifted instead. No "wrong" for the child; only the
    // difficulty and the Schwung take note.
    if (before !== null) {
      missesRef.current++;
      streakRef.current = 0;
    }
    selectedRef.current = index;
    setSelected(index);
  };

  const onSockDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    if (matchedRef.current.has(round.socks[index].pair)) funBurst(e.clientX, e.clientY);
    else pick(index);
  };

  const onBackgroundDown = (e: PointerEvent) => funBurst(e.clientX, e.clientY);

  // Arrow keys (or any key) move the frame over the socks still on the floor, Space or Enter takes one, 1–9 straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (phase !== "sorting") {
        funBurst();
        return;
      }
      const left = round.socks.map((s, i) => (matchedRef.current.has(s.pair) ? -1 : i)).filter((i) => i >= 0);
      if (left.length === 0) return;
      const move = (to: number) => {
        focusRef.current = to;
        setFocus(to);
      };
      const current = focusRef.current !== null && left.includes(focusRef.current) ? focusRef.current : null;
      const at = current === null ? -1 : left.indexOf(current);
      const digit = Number(e.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= round.socks.length) {
        const index = digit - 1;
        if (left.includes(index)) {
          move(index);
          pick(index);
        } else funBurst();
      } else if (e.key === "Enter" || e.key === " ") {
        if (current === null) move(left[0]);
        else pick(current);
      } else {
        const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
        const to = left[current === null ? 0 : (at + (back ? -1 : 1) + left.length) % left.length];
        move(to);
        if (settings.sounds) playCountNote(round.socks[to].pair);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const machineShut = phase === "intro" || phase === "washing";

  return (
    <div className={`socks-play ${phase}`} onPointerDown={onBackgroundDown} style={{ "--pull-ms": `${PULL_MS}ms` } as CSSProperties}>
      <div className="sock-line" style={{ "--pairs": round.looks.length } as CSSProperties}>
        <span className="sock-post left" />
        <span className="sock-post right" />
        <span className="sock-rope" />
        <div className="sock-slots">
          {round.looks.map((_, slot) => {
            const pair = lineOrder[slot];
            const shown = pair !== undefined && landed.includes(pair);
            return (
              <div key={`${round.id}-${slot}`} className={`sock-hang${shown ? " shown" : ""}`} style={{ "--slot": slot } as CSSProperties}>
                {[0, 1].map((j) => (
                  <span
                    key={j}
                    ref={(el) => {
                      slotRefs.current[slot * 2 + j] = el;
                    }}
                    className="sock-hang-sock"
                  >
                    {shown && (
                      <>
                        <SockDrawing look={round.looks[pair]} />
                        <Peg />
                      </>
                    )}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="sock-floor">
        <div className={`sock-machine${machineShut ? "" : " open"}`}>
          <WashingMachine looks={round.looks} />
        </div>
        <div className="sock-pile">
          <div ref={gridRef} className="sock-grid" style={{ "--cols": fit.columns, "--sock-h": `${fit.size}px` } as CSSProperties}>
            {!machineShut &&
              round.socks.map((sock, i) => {
                const flight = flights[i];
                const gone = landed.includes(sock.pair);
                const translate = flight
                  ? `calc(${sock.shift[0]}% + ${flight.x}px) calc(${sock.shift[1]}% + ${flight.y}px)`
                  : `${sock.shift[0]}% ${sock.shift[1]}%`;
                return (
                  <div key={`${round.id}-${i}`} className="sock-cell" style={{ animationDelay: `${i * tumbleStep(round.level)}ms` }}>
                    <button
                      type="button"
                      ref={(el) => {
                        sockRefs.current[i] = el;
                      }}
                      className={`sock${selected === i ? ` selected nudge-${nudge % 2}` : ""}${focus === i ? " focused" : ""}${
                        flight ? " flying" : ""
                      }${gone ? " gone" : ""}`}
                      style={
                        {
                          translate,
                          rotate: flight ? "0deg" : `${sock.rotate}deg`,
                          scale: flight ? `${flight.scale}` : undefined,
                          "--fly-ms": flight ? `${flight.ms}ms` : undefined,
                        } as CSSProperties
                      }
                      aria-label={texts.sock(i + 1)}
                      // With one sock in hand, its partner is the right one.
                      data-tap={tapState({ goal: selected !== null && selected !== i && round.socks[selected].pair === sock.pair, done: gone })}
                      onPointerDown={onSockDown(i)}
                    >
                      <SockDrawing look={round.looks[sock.pair]} />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <BurstLayer bursts={bursts} />
    </div>
  );
}
