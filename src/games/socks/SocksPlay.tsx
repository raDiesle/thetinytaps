import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { playBoing, playCountNote, playKnock, playMelody, playPlop, playRandomNote, playWash } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { tapState } from "@/lib/tapTargets";
import { dealPairs, MAX_PAIRS, shuffle, texts, type SockLook } from "./content";
import { Peg, SockDrawing, WashingMachine } from "./drawings";
import type { SocksSettings } from "./settings";

/** How long the drum turns before the door opens; matches the drum animation in socks.css. */
const WASH_MS = 2400;
/** Between two socks falling out of the machine. */
const TUMBLE_STEP_MS = 110;
/** A pair's hop from the floor onto the line; matches `.sock.flying` in socks.css. */
const FLY_MS = 800;
/** After the last pair hangs: time for the party before „Nochmal / Weiter“ show. */
const END_DELAY_MS = 1800;
/** Width of the sock drawing as a share of its height (its viewBox is 64 × 96). */
const SOCK_ASPECT = 64 / 96;
/** The biggest a sock on the floor gets, on a large screen with few socks. */
const MAX_SOCK_PX = 170;

/** ready: the full machine waits for a tap; washing: the drum turns; sorting: socks on the floor; done: all on the line. */
type Phase = "ready" | "washing" | "sorting" | "done";

/** One sock lying on the floor, a little crooked. */
interface FloorSock {
  pair: number;
  rotate: number;
  /** Small shift inside its grid cell, in % of its own size, so the pile doesn't look like a grid. */
  shift: [number, number];
}

interface Round {
  id: number;
  looks: SockLook[];
  socks: FloorSock[];
}

/** Where a sock flies to on the line, relative to where it lies. */
interface Flight {
  x: number;
  y: number;
  scale: number;
}

function newRound(id: number, settings: SocksSettings, pairs: number): Round {
  const looks = dealPairs(settings.mode, pairs);
  const socks = shuffle(looks.flatMap((_, pair) => [pair, pair])).map((pair) => ({
    pair,
    rotate: Math.round(Math.random() * 60 - 30),
    shift: [Math.round(Math.random() * 20 - 10), Math.round(Math.random() * 16 - 8)] as [number, number],
  }));
  return { id, looks, socks };
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

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** "Socken-Paare" (N-45): the washing machine spins, socks tumble out, two same ones hop onto the line together. */
export function SocksPlay({ lang, settings }: { lang: string; settings: SocksSettings }) {
  const [pairs, setPairs] = useState(Number(settings.pairs));
  const [round, setRound] = useState(() => newRound(0, settings, pairs));
  const [phase, setPhase] = useState<Phase>("ready");
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
      if (settings.speech) speak(text, lang, { rate: 0.85 });
    },
    [settings.speech, lang],
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

  /** The child starts the machine; when it stops, the socks tumble out. */
  const wash = () => {
    setPhase("washing");
    if (settings.sounds) playWash();
    later(WASH_MS, () => {
      setPhase("sorting");
      say(texts.start);
      if (settings.sounds) round.socks.forEach((_, i) => later(200 + i * TUMBLE_STEP_MS, playPlop));
    });
  };

  const startRound = (count: number) => {
    setPairs(count);
    setRound((r) => newRound(r.id + 1, settings, count));
    setPhase("ready");
    setSelected(null);
    selectedRef.current = null;
    matchedRef.current = new Set();
    setLineOrder([]);
    setLanded([]);
    setFlights({});
    setFocus(null);
    focusRef.current = null;
  };

  /** Both socks of `pair` (found by the child) hop from the floor onto their place on the line. */
  const hang = (pair: number, a: number, b: number) => {
    matchedRef.current.add(pair);
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
      next[index] = { x: to.x - from.x, y: to.y - from.y, scale: target.offsetHeight / sock.offsetHeight };
    });
    setFlights((f) => ({ ...f, ...next }));
    if (settings.sounds) {
      playCountNote(pair);
      later(150, playBoing);
    }
    say(texts.pair());

    later(FLY_MS, () => {
      setLanded((l) => [...l, pair]);
      if (settings.sounds) {
        playKnock(1500);
        later(120, () => playKnock(1300));
      }
    });

    if (matchedRef.current.size === round.looks.length) {
      later(FLY_MS + 400, () => {
        setPhase("done");
        if (settings.sounds) playMelody();
        say(texts.done);
        for (let i = 0; i < 10; i++) later(i * 120, () => spawn());
      });
    }
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
    // A different one: the first goes back down, this one is lifted instead. No "wrong".
    selectedRef.current = index;
    setSelected(index);
  };

  const onSockDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    if (matchedRef.current.has(round.socks[index].pair)) funBurst(e.clientX, e.clientY);
    else pick(index);
  };

  const onBackgroundDown = (e: PointerEvent) => {
    if (phase === "ready") wash();
    else funBurst(e.clientX, e.clientY);
  };

  // Arrow keys (or any key) move the frame over the socks still on the floor, Space or Enter takes one, 1–9 straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (phase === "ready") {
        wash();
        return;
      }
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

  const next = pairs < MAX_PAIRS ? { emoji: "🧦", name: `${pairs + 1} Paare`, onNext: () => startRound(pairs + 1) } : undefined;

  return (
    <div className={`socks-play ${phase}`} onPointerDown={onBackgroundDown}>
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
        <div className={`sock-machine${phase === "ready" || phase === "washing" ? "" : " open"}`}>
          <WashingMachine looks={round.looks} />
        </div>
        <div className="sock-pile">
          <div ref={gridRef} className="sock-grid" style={{ "--cols": fit.columns, "--sock-h": `${fit.size}px` } as CSSProperties}>
            {phase !== "ready" &&
              phase !== "washing" &&
              round.socks.map((sock, i) => {
                const flight = flights[i];
                const gone = landed.includes(sock.pair);
                const translate = flight
                  ? `calc(${sock.shift[0]}% + ${flight.x}px) calc(${sock.shift[1]}% + ${flight.y}px)`
                  : `${sock.shift[0]}% ${sock.shift[1]}%`;
                return (
                  <div key={`${round.id}-${i}`} className="sock-cell" style={{ animationDelay: `${i * TUMBLE_STEP_MS}ms` }}>
                    <button
                      type="button"
                      ref={(el) => {
                        sockRefs.current[i] = el;
                      }}
                      className={`sock${selected === i ? ` selected nudge-${nudge % 2}` : ""}${focus === i ? " focused" : ""}${
                        flight ? " flying" : ""
                      }${gone ? " gone" : ""}`}
                      style={{ translate, rotate: flight ? "0deg" : `${sock.rotate}deg`, scale: flight ? `${flight.scale}` : undefined }}
                      aria-label={`Socke ${i + 1}`}
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

      {phase === "done" && <GameEnd delayMs={END_DELAY_MS} onAgain={() => startRound(pairs)} next={next} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
