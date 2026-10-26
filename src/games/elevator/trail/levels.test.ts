import { describe, expect, test } from "@rstest/core";
import { allStations, groundY, pathsOf, route } from "./ground";
import type { ItemId } from "./items";
import { TRAIL_LEVELS } from "./levels";
import type { Fork } from "./types";

describe("ground", () => {
  const ground: [number, number][] = [
    [0, 100],
    [100, 100],
    [200, 0],
    [400, 0],
  ];

  test("heights between the points", () => {
    expect(groundY(ground, 50)).toBe(100);
    expect(groundY(ground, 150)).toBe(50);
    expect(groundY(ground, 500)).toBe(0);
  });

  test("a walk goes through the corners in between, both ways", () => {
    expect(route(ground, 50, 300)).toEqual([
      [100, 100],
      [200, 0],
      [300, 0],
    ]);
    expect(route(ground, 300, 50)).toEqual([
      [200, 0],
      [100, 100],
      [50, 100],
    ]);
  });
});

describe.each(TRAIL_LEVELS.map((level) => [level.id, level] as const))("trail level %s", (_, level) => {
  const forks = level.stations.filter((s): s is Fork => s.kind === "fork");

  test("station and way ids are unique", () => {
    const ids = [...allStations(level).map((s) => s.id), ...forks.flatMap((f) => [f.id, ...f.ways.map((w) => w.id)])];
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("a fork stands between the station before it and the first of each way", () => {
    for (const [i, fork] of level.stations.entries()) {
      if (fork.kind !== "fork") continue;
      expect(fork.x).toBeGreaterThan(i ? level.stations[i - 1].x : level.start);
      for (const way of fork.ways) expect(way.stations[0]?.x).toBeGreaterThan(fork.x);
    }
  });

  test("a way's own ground is the level's before the fork and after the way", () => {
    for (const [i, fork] of level.stations.entries()) {
      if (fork.kind !== "fork") continue;
      const before = level.stations.slice(0, i).map((s) => s.x);
      const after = level.stations.slice(i + 1).map((s) => s.x);
      for (const way of fork.ways) {
        if (!way.ground) continue;
        const end = way.stations[way.stations.length - 1].x;
        for (const x of [level.start, ...before, fork.x, ...after, end + 2000]) expect(groundY(way.ground, x)).toBe(groundY(level.ground, x));
      }
    }
  });

  describe.each(pathsOf(level).map((path) => [path.ways.join(" → ") || "the one way", path] as const))("along %s", (_, path) => {
    test("the ground and the stations go from left to right", () => {
      const xs = path.ground.map(([x]) => x);
      expect(xs).toEqual([...xs].sort((a, b) => a - b));
      const stops = [level.start, ...path.stations.map((s) => s.x)];
      for (let i = 1; i < stops.length; i++) expect(stops[i]).toBeGreaterThan(stops[i - 1]);
    });

    test("the bag never holds more than three things, and holds what each obstacle needs", () => {
      const bag: ItemId[] = [];
      for (const station of path.stations) {
        if (station.kind === "pickup") {
          bag.push(station.item);
          expect(bag.length).toBeLessThanOrEqual(3);
        } else if (station.kind === "obstacle") {
          expect(bag).toContain(station.need);
          bag.splice(bag.indexOf(station.need), 1);
        }
      }
    });

    test("a creature's why-bubble is above the ground next to the child, where the screen shows it", () => {
      for (const station of path.stations) {
        if (station.kind !== "obstacle" || !("wants" in station.why)) continue;
        const [x, y] = station.why.wants;
        // The child stands at 760 of 1600 on the screen, its feet at 740 of 900; the bubble grows 160 to the right
        // and 200 up from its tip.
        expect(x - station.x).toBeGreaterThan(40);
        expect(x - station.x).toBeLessThan(640);
        expect(groundY(path.ground, station.x) - y).toBeGreaterThan(0);
        expect(groundY(path.ground, station.x) - y).toBeLessThan(520);
      }
    });

    test("the last station gives the goal back, and only that one", () => {
      const freeing = path.stations.filter((s) => s.kind === "obstacle" && s.frees);
      expect(freeing).toEqual([path.stations[path.stations.length - 1]]);
    });

    test("the steps of stairs and slides lie on the ground", () => {
      for (const station of path.stations) {
        if (station.kind !== "climb") continue;
        expect(station.steps.length).toBeGreaterThan(0);
        for (const [x, y] of station.steps) expect(groundY(path.ground, x)).toBe(y);
        expect(station.steps[0][0]).toBeGreaterThan(station.x);
        for (const [x, y] of station.slide ?? []) expect(groundY(path.ground, x)).toBe(y);
      }
    });
  });
});
