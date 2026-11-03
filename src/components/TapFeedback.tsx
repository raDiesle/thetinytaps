import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/** A five-pointed star in a 100 × 100 box, drawn in several games. */
export const STAR_PATH = "M50 5 L61 38 L96 38 L68 59 L79 93 L50 72 L21 93 L32 59 L4 38 L39 38 Z";

const HEART_PATH = "M50 88 C20 65 5 48 5 30 C5 15 17 5 30 5 C40 5 47 11 50 18 C53 11 60 5 70 5 C83 5 95 15 95 30 C95 48 80 65 50 88 Z";

/** The bright colours of keys, marbles and letters. */
export const BRIGHT_COLORS = ["#ff5d73", "#ffb703", "#3ec300", "#00b4d8", "#8e7dff", "#ff7bd0", "#ff8c42"];

/** What floats up when everyone is happy: hearts, stars and music notes – never loose shapes like triangles or squares. */
export type JoyThing = "heart" | "star" | "note";

/**
 * A celebration is a few things rising slowly, not a storm: a toddler sees the joy in the picture (everyone cheering),
 * and this only adds to it. `feedback.test.ts` keeps it calm.
 */
export const CELEBRATION = {
  /** How many things rise over the whole screen. */
  count: 7,
  /** How many rise from one spot (a small joy right there: a full day, a streak). */
  countAt: 3,
  /** How long one thing takes to rise and fade, in ms. */
  riseMs: 4200,
  /** The time between one thing starting and the next, in ms. */
  staggerMs: 260,
};

/** How long a ripple or a glow lasts, in ms. */
const RIPPLE_MS = 900;
const GLOW_MS = 800;
/** More effects than this at once drop the oldest, so mashing keys stays light. */
const MAX_EFFECTS = 24;

const JOY_COLORS: Record<JoyThing, string[]> = {
  heart: ["#ff6b8b", "#ff8fab", "#f25f5c"],
  star: ["#ffd23f", "#ffc23f", "#ffe066"],
  note: ["#7c8cff", "#5bb8e8", "#b07cff"],
};

interface Effect {
  id: number;
  kind: "ripple" | "glow" | JoyThing;
  x: number;
  y: number;
  /** Delay before it starts, in ms. */
  delay: number;
  color?: string;
  size?: number;
  /** Sideways sway of a rising thing, in px. */
  sway?: number;
  /** How far up a rising thing goes, in px. */
  rise?: number;
}

/** Options of a celebration. */
interface CelebrateOptions {
  /** Rise from this spot (a few things) instead of along the whole bottom of the screen. */
  at?: { x: number; y: number };
  /** What rises: all three by default, only stars for a calm good night. */
  things?: JoyThing[];
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/**
 * Feedback that fits what a tap did, drawn in one layer (`FeedbackLayer`) over the game:
 * - `ripple`: a tap or key that sets nothing off – soft rings, as if a finger touched water.
 * - `glow`: a tap that did set something off – a warm light where the finger was; the thing itself does the rest.
 * - `celebrate`: something done – a few hearts, stars and notes rise slowly while everyone in the picture cheers.
 */
export function useTapFeedback() {
  const [effects, setEffects] = useState<Effect[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const add = useCallback((added: Omit<Effect, "id">[], lifetime: number) => {
    const withIds = added.map((e) => ({ ...e, id: nextId.current++ }));
    const ids = new Set(withIds.map((e) => e.id));
    setEffects((prev) => [...prev, ...withIds].slice(-MAX_EFFECTS));
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setEffects((prev) => prev.filter((e) => !ids.has(e.id)));
    }, lifetime);
    timers.current.add(timer);
  }, []);

  /** Rings at (x, y) in pixels, or where a raindrop might fall, for a key. */
  const ripple = useCallback(
    (x?: number, y?: number) => {
      const at = { x: x ?? window.innerWidth * (0.2 + Math.random() * 0.6), y: y ?? window.innerHeight * (0.25 + Math.random() * 0.5) };
      add([{ kind: "ripple", ...at, delay: 0 }], RIPPLE_MS + 50);
    },
    [add],
  );

  /** A warm light at (x, y), or in the middle of the screen, for a key. */
  const glow = useCallback(
    (x?: number, y?: number) => {
      add([{ kind: "glow", x: x ?? window.innerWidth / 2, y: y ?? window.innerHeight / 2, delay: 0 }], GLOW_MS + 50);
    },
    [add],
  );

  /** A few hearts, stars and notes rising slowly. */
  const celebrate = useCallback(
    ({ at, things = ["heart", "star", "note"] }: CelebrateOptions = {}) => {
      const { count, countAt, riseMs, staggerMs } = CELEBRATION;
      const n = at ? countAt : count;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const rising = Array.from({ length: n }, (_, i) => {
        const kind = things[i % things.length];
        return {
          kind,
          // Spread evenly along the bottom, so they never clump; from a spot, side by side.
          x: at ? at.x + (i - (n - 1) / 2) * 36 : w * ((i + 0.5) / n) + (Math.random() - 0.5) * (w / n) * 0.4,
          y: at ? at.y : h * 0.92,
          delay: at ? i * staggerMs : pick([0, 1, 2, 3, 4]) * staggerMs,
          color: pick(JOY_COLORS[kind]),
          size: at ? 34 : 44 + Math.random() * 20,
          sway: (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 14),
          rise: at ? 140 : h * (0.45 + Math.random() * 0.2),
        };
      });
      add(rising, riseMs + 5 * staggerMs);
    },
    [add],
  );

  return { effects, ripple, glow, celebrate };
}

/** The layer the feedback is drawn in: put it last inside the game's play element. */
export function FeedbackLayer({ effects }: { effects: Effect[] }) {
  return (
    <div className="fx-layer" aria-hidden>
      {effects.map((e) => {
        const style = { left: e.x, top: e.y, "--delay": `${e.delay}ms` } as CSSProperties;
        if (e.kind === "ripple")
          return (
            <div key={e.id} className="fx-ripple-at" style={style}>
              <div className="fx-ripple" />
              <div className="fx-ripple late" />
            </div>
          );
        if (e.kind === "glow") return <div key={e.id} className="fx-glow" style={style} />;
        const size = e.size ?? 48;
        return (
          <div
            key={e.id}
            className="fx-rise"
            style={
              {
                ...style,
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                "--sway": `${e.sway}px`,
                "--rise": `${-(e.rise ?? 300)}px`,
                "--rise-ms": `${CELEBRATION.riseMs}ms`,
              } as CSSProperties
            }
          >
            {e.kind === "note" ? (
              <span className="fx-note" style={{ color: e.color, fontSize: size * 1.3 }}>
                ♪
              </span>
            ) : (
              <svg viewBox="0 0 100 100" width={size} height={size}>
                <path d={e.kind === "heart" ? HEART_PATH : STAR_PATH} fill={e.color} stroke="#00000022" strokeWidth="4" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
