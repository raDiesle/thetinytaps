// Points along a way: what the machines (and the Kugelbahn game) build their
// routes from, in the coordinates of the picture.

export interface Pt {
  x: number;
  y: number;
}

/** A marble's radius. */
export const BALL_R = 22;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** A straight line from `a` to `b`, with a point every `step` px. */
export function line(a: Pt, b: Pt, step = 16): Pt[] {
  const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step));
  return Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
}

/** A curve from `a` to `b`, pulled towards `c`. */
export function quad(a: Pt, c: Pt, b: Pt, n = 12): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
  });
}

/** An arc around (cx, cy) from angle `a0` to `a1` in degrees (SVG angles: 90 is straight down). */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number): Pt[] {
  const n = Math.ceil(Math.abs(a1 - a0) / 4);
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

/** Index of the point at or before distance `d`. */
export function indexAt(route: { s: number[] }, d: number): number {
  let lo = 0;
  let hi = route.s.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (route.s[mid] <= d) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
