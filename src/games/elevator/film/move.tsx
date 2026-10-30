import { type ReactNode, useLayoutEffect, useRef } from "react";
import type { Point } from "../trail/types";

/** The path someone takes at `step`: the one for the highest step in `table` not above it. */
export function route<T>(step: number, table: [number, T][]): T {
  let found = table[0][1];
  for (const [from, value] of table) if (from <= step) found = value;
  return found;
}

/**
 * Something in a scene that moves along `path` (points of the picture) in `ms` whenever its path changes, and then
 * stays at the path's last point. The first path it is drawn with only places it, so a scene starts still. The time
 * on each part of the way follows its length, so it moves at an even pace.
 */
export function Go({ path, ms, delay = 0, className, children }: { path: Point[]; ms: number; delay?: number; className?: string; children: ReactNode }) {
  const el = useRef<SVGGElement>(null);
  const placed = useRef(false);
  const key = path.join(";");
  useLayoutEffect(() => {
    if (!placed.current) {
      placed.current = true;
      return;
    }
    if (path.length < 2 || !el.current?.animate) return;
    const lengths = path.slice(1).map(([x, y], i) => Math.hypot(x - path[i][0], y - path[i][1]));
    const total = lengths.reduce((a, b) => a + b, 0) || 1;
    let gone = 0;
    const frames = path.map(([x, y], i) => {
      if (i > 0) gone += lengths[i - 1];
      return { transform: `translate(${x}px, ${y}px)`, offset: gone / total };
    });
    el.current.animate(frames, { duration: ms, delay, easing: "ease-in-out", fill: "backwards" });
  }, [key]);
  const [x, y] = path[path.length - 1];
  return (
    <g ref={el} className={className} style={{ transform: `translate(${x}px, ${y}px)` }}>
      {children}
    </g>
  );
}
