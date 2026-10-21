import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const SHAPES = {
  star: "M50 5 L61 38 L96 38 L68 59 L79 93 L50 72 L21 93 L32 59 L4 38 L39 38 Z",
  heart: "M50 88 C20 65 5 48 5 30 C5 15 17 5 30 5 C40 5 47 11 50 18 C53 11 60 5 70 5 C83 5 95 15 95 30 C95 48 80 65 50 88 Z",
  circle: "M50 5 A45 45 0 1 1 49.9 5 Z",
  triangle: "M50 8 L94 90 L6 90 Z",
};
type ShapeName = keyof typeof SHAPES;
const SHAPE_NAMES = Object.keys(SHAPES) as ShapeName[];

export const BRIGHT_COLORS = ["#ff5d73", "#ffb703", "#3ec300", "#00b4d8", "#8e7dff", "#ff7bd0", "#ff8c42"];

const LIFETIME_MS = 1600;
const MAX_BURSTS = 40;

interface Burst {
  id: number;
  x: number;
  y: number;
  shape: ShapeName;
  color: string;
  size: number;
  rotate: number;
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Colourful shapes that pop up and float away, for "any other key" and taps. */
export function useBursts() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  /** Spawn a shape at (x, y) in pixels, or at a random spot. */
  const spawn = useCallback((x?: number, y?: number) => {
    const burst: Burst = {
      id: nextId.current++,
      x: x ?? Math.random() * window.innerWidth,
      y: y ?? Math.random() * window.innerHeight,
      shape: pick(SHAPE_NAMES),
      color: pick(BRIGHT_COLORS),
      size: 60 + Math.random() * 80,
      rotate: Math.random() * 60 - 30,
    };
    setBursts((prev) => [...prev.slice(-(MAX_BURSTS - 1)), burst]);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setBursts((prev) => prev.filter((b) => b.id !== burst.id));
    }, LIFETIME_MS);
    timers.current.add(timer);
  }, []);

  return { bursts, spawn };
}

export function BurstLayer({ bursts }: { bursts: Burst[] }) {
  return (
    <div className="burst-layer" aria-hidden>
      {bursts.map((b) => (
        <svg
          key={b.id}
          className="burst"
          viewBox="0 0 100 100"
          width={b.size}
          height={b.size}
          style={
            {
              left: b.x - b.size / 2,
              top: b.y - b.size / 2,
              "--rotate": `${b.rotate}deg`,
              "--lifetime": `${LIFETIME_MS}ms`,
            } as CSSProperties
          }
        >
          <path d={SHAPES[b.shape]} fill={b.color} />
        </svg>
      ))}
    </div>
  );
}
