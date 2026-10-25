import type { Point, Station, TrailLevel } from "./types";

// The ground line of a trail level, which the child walks along from point to point, and the ways through a level.

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

/** One way through a level: its stations in walking order (a fork replaced by the stations of one of its ways) and
 * the ground the child walks on along it. */
export interface Path {
  /** The ids of the ways taken at the forks, to tell the paths apart. */
  ways: string[];
  stations: Station[];
  ground: Point[];
}

/** Every way through `level`: one path per choice at each fork. */
export function pathsOf(level: TrailLevel): Path[] {
  let paths: Path[] = [{ ways: [], stations: [], ground: level.ground }];
  for (const station of level.stations) {
    if (station.kind !== "fork") {
      for (const path of paths) path.stations.push(station);
      continue;
    }
    paths = paths.flatMap((path) =>
      station.ways.map((way) => ({ ways: [...path.ways, way.id], stations: [...path.stations, ...way.stations], ground: way.ground ?? path.ground })),
    );
  }
  return paths;
}

/** Every station of `level`, those of all ways included. */
export const allStations = (level: TrailLevel): Station[] => level.stations.flatMap((s) => (s.kind === "fork" ? s.ways.flatMap((w) => w.stations) : [s]));
