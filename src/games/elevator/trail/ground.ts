import type { Point } from "./types";

// The ground line of a trail level: the child walks along it from point to point.

/** The height of the ground at `x`, between the two ground points around it. */
export function groundY(ground: Point[], x: number) {
  for (let i = 1; i < ground.length; i++) {
    const [x0, y0] = ground[i - 1];
    const [x1, y1] = ground[i];
    if (x <= x1) return x1 === x0 ? y1 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return ground[ground.length - 1][1];
}

/** The points to walk through from `from` to `to`: the corners of the ground in between, then the end. */
export function route(ground: Point[], from: number, to: number): Point[] {
  const corners = ground.filter(([x]) => (to > from ? x > from && x < to : x < from && x > to));
  if (to < from) corners.reverse();
  return [...corners, [to, groundY(ground, to)]];
}
