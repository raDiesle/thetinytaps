import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playChime, playPop, playRandomNote } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { tapState } from "@/lib/tapTargets";
import { ITEMS, texts, type ShadowItem } from "./content";
import { shuffle, useDeck } from "./deck";
import type { ShadowsSettings } from "./settings";

/** A finger that moves less than this is a tap, not a drag. */
const TAP_PX = 12;
/** Time to watch the picture sit on its shadow before the next one comes. */
const CELEBRATE_MS = 2600;
/** Time a wrong shadow shows who it belongs to before the child can try again. */
const WRONG_MS = 1500;
/** Dropped this close to a shadow (as a share of its size) still counts: small fingers don't aim well. */
const SNAP = 0.3;

interface Round {
  id: number;
  item: ShadowItem;
  shadows: ShadowItem[];
  correct: number;
}

interface Offset {
  x: number;
  y: number;
  scale?: number;
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** Whether (x, y) lies on `r`, or no further than `SNAP` of its size away. */
function near(r: DOMRect, x: number, y: number) {
  const margin = SNAP * Math.max(r.width, r.height);
  return x > r.left - margin && x < r.right + margin && y > r.top - margin && y < r.bottom + margin;
}

/** "Schatten finden" (N-07): drag the picture onto its shadow, or tap the right shadow. */
export function ShadowsPlay({ lang, settings }: { lang: string; settings: ShadowsSettings }) {
  const [round, setRound] = useState<Round | null>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  /** The shadow the picture is dragged over, so it can grow a little. */
  const [hover, setHover] = useState<number | null>(null);
  /** The picture on its way onto the right shadow. */
  const [landed, setLanded] = useState<Offset | null>(null);
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** Bumped to make the picture hop again, e.g. "drag me" when tapping isn't enough. */
  const [nudge, setNudge] = useState(0);
  const [stars, setStars] = useState(0);
  const { bursts, spawn } = useBursts();

  const nextId = useRef(0);
  const pictureRef = useRef<HTMLSpanElement>(null);
  const shadowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
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
    (text: string, queue = false) => {
      if (settings.speech) speak(text, lang, { queue, rate: 0.85 });
    },
    [settings.speech, lang],
  );

  const pool = settings.theme === "all" ? ITEMS : ITEMS.filter((i) => i.theme === settings.theme);

  const drawItem = useDeck(pool);

  const nextRound = useCallback(() => {
    const item = drawItem();
    const count = Number(settings.choices);
    const shadows = shuffle([item, ...shuffle(pool.filter((i) => i !== item)).slice(0, count - 1)]);
    const next = { id: nextId.current++, item, shadows, correct: shadows.indexOf(item) };
    setRound(next);
    setDrag(null);
    setHover(null);
    setLanded(null);
    setOutcome(null);
    setFocus(null);
    focusRef.current = null;
    busy.current = false;
    say(texts.search(item));
    if (settings.sounds) later(400, () => item.sound?.());
  }, [settings.choices, settings.sounds, pool, drawItem, say, later]);

  // Start with a picture right away; settings can't change while playing.
  useEffect(() => nextRound(), []);

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  /** The child picked shadow `index`; `from` is how far the dragged picture already is from its place. */
  const choose = (index: number, from: Offset = { x: 0, y: 0 }) => {
    if (!round || busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });
    setDrag(null);
    setHover(null);

    if (!ok) {
      // The shadow lights up and shows who it really belongs to.
      const owner = round.shadows[index];
      if (settings.sounds) later(250, () => (owner.sound ?? playPop)());
      say(texts.thatIs(owner));
      say(texts.search(round.item), true);
      later(WRONG_MS, () => {
        busy.current = false;
        setOutcome(null);
      });
      return;
    }

    // The picture flies onto its shadow and shrinks to fit it exactly.
    const picture = pictureRef.current;
    const shadow = shadowRefs.current[index];
    if (picture && shadow) {
      const start = centre(picture.getBoundingClientRect());
      const end = centre(shadow.getBoundingClientRect());
      setLanded({
        x: end.x - start.x + from.x,
        y: end.y - start.y + from.y,
        scale: shadow.offsetHeight / picture.offsetHeight,
      });
    }
    if (settings.sounds) {
      later(200, playChime);
      later(700, () => round.item.sound?.());
    }
    say(texts.found(round.item));
    setStars((n) => n + 1);
    later(700, () => {
      for (let i = 0; i < 8; i++) spawn();
    });
    later(CELEBRATE_MS, nextRound);
  };

  /** Tapping the picture asks again; it makes its noise and hops. */
  const askAgain = () => {
    if (!round) return;
    say(texts.search(round.item));
    if (settings.sounds) round.item.sound?.();
    setNudge((n) => n + 1);
  };

  /** The shadow the picture would land on if let go at (x, y). */
  const shadowAt = (x: number, y: number): number | null => {
    let best: number | null = null;
    let bestDistance = Infinity;
    optionRefs.current.forEach((el, i) => {
      const box = el?.getBoundingClientRect();
      if (!box || !near(box, x, y)) return;
      const c = centre(box);
      const distance = Math.hypot(c.x - x, c.y - y);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    });
    return best;
  };

  const onPictureDown = (e: PointerEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (!round || busy.current || pointer.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
  };

  const onPictureMove = (e: PointerEvent<HTMLSpanElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const x = e.clientX - p.x;
    const y = e.clientY - p.y;
    if (!p.moved && Math.hypot(x, y) < TAP_PX) return;
    p.moved = true;
    setDrag({ x, y });
    setHover(shadowAt(e.clientX, e.clientY));
  };

  const onPictureUp = (e: PointerEvent<HTMLSpanElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    pointer.current = null;
    if (!p.moved) {
      askAgain();
      return;
    }
    const target = shadowAt(e.clientX, e.clientY);
    if (target === null) {
      // Back to its place.
      setDrag(null);
      setHover(null);
    } else choose(target, { x: e.clientX - p.x, y: e.clientY - p.y });
  };

  const onPictureCancel = () => {
    pointer.current = null;
    setDrag(null);
    setHover(null);
  };

  const onShadowDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    if (settings.tap) choose(index);
    else setNudge((n) => n + 1);
  };

  // Arrow keys (or any key) move the frame, Space or Enter picks, 1–4 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || !round || e.key === "Escape") return;
      if (outcome) {
        funBurst();
        return;
      }
      const count = round.shadows.length;
      const digit = Number(e.key);
      // Read and set through the ref: fast key presses come before React has rendered the last one.
      const move = (to: number) => {
        focusRef.current = to;
        setFocus(to);
      };
      const current = focusRef.current;
      if (Number.isInteger(digit) && digit >= 1 && digit <= count) {
        move(digit - 1);
        choose(digit - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        if (current === null) move(0);
        else choose(current);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        move(((current ?? 0) - 1 + count) % count);
      } else {
        move(current === null ? 0 : (current + 1) % count);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!round) return null;

  const won = outcome?.ok === true;
  const offset = landed ?? drag;

  return (
    <div className={`shadows-play`} onPointerDown={(e) => funBurst(e.clientX, e.clientY)}>
      <p key={`${round.id}-${won}`} className="sh-prompt">
        {won ? texts.found(round.item) : texts.search(round.item)}
      </p>
      <div className="sh-top">
        <div key={`picture-${round.id}`} className="sh-picture-box">
          <span
            ref={pictureRef}
            className={`sh-picture sh-emoji${drag ? " dragging" : ""}${landed ? " landed" : ""}${
              outcome?.ok === false ? " wrong" : ""
            }${!drag && !outcome && nudge ? ` nudge-${nudge % 2}` : ""}`}
            style={offset ? { translate: `${offset.x}px ${offset.y}px`, scale: landed?.scale?.toString() } : undefined}
            role="img"
            aria-label={round.item.name}
            data-tap
            onPointerDown={onPictureDown}
            onPointerMove={onPictureMove}
            onPointerUp={onPictureUp}
            onPointerCancel={onPictureCancel}
          >
            {round.item.emoji}
          </span>
          {settings.names && <span className={`sh-name${landed ? " gone" : ""}`}>{round.item.name}</span>}
        </div>
      </div>
      <div className="sh-ground">
        <div className="sh-options" style={{ "--n": round.shadows.length } as CSSProperties}>
          {round.shadows.map((s, i) => {
            const peek = outcome?.pick === i && !outcome.ok;
            return (
              <div
                key={`${round.id}-${s.id}`}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                className={`sh-option${focus === i ? " focused" : ""}${hover === i ? " near" : ""}${
                  won && outcome.pick === i ? " matched" : ""
                }${peek ? " peek" : ""}`}
                role="button"
                aria-label={peek ? s.name : `Schatten ${i + 1}`}
                data-tap={tapState({ goal: i === round.correct })}
                onPointerDown={onShadowDown(i)}
              >
                <span
                  ref={(el) => {
                    shadowRefs.current[i] = el;
                  }}
                  className="sh-shadow sh-emoji"
                  aria-hidden
                >
                  {s.emoji}
                </span>
                {peek && settings.names && <span className="sh-bubble">{s.name}</span>}
              </div>
            );
          })}
        </div>
      </div>
      {stars > 0 && (
        <div className="find-stars" aria-label={`${stars} geschafft`}>
          {"⭐".repeat(Math.min(stars, 10))}
          {stars > 10 && <span className="find-count">{stars}</span>}
        </div>
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
