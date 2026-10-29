import { describe, expect, test } from "bun:test";
import { FRIENDS } from "./friends";
import { allStations, facing, groundY, pathsOf, placed, route } from "./ground";
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

  test("a way that turns round is drawn zigzagging back, facing the way it goes", () => {
    const turns = [100, 300];
    expect(placed(turns, [50, 7])).toEqual([50, 7]);
    expect(placed(turns, [100, 7])).toEqual([100, 7]);
    expect(placed(turns, [160, 7])).toEqual([40, 7]);
    expect(placed(turns, [350, 7])).toEqual([-50, 7]);
    expect([50, 100, 160, 300, 350].map((x) => facing(turns, x))).toEqual([1, 1, -1, -1, 1]);
    expect(placed(undefined, [500, 7])).toEqual([500, 7]);
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

  test("a world going up turns at points of its ground, and stays inside its drawing", () => {
    if (!level.turns) return;
    const xs = level.ground.map(([x]) => x);
    expect(level.turns).toEqual([...level.turns].sort((a, b) => a - b));
    for (const turn of level.turns) expect(xs).toContain(turn);
    for (const point of [...level.ground, ...allStations(level).map((s): [number, number] => [s.x, 0])]) {
      const [x] = placed(level.turns, point);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(1600);
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
          // A creature that joins puts its picture into the bag (G-10).
          if (station.befriends) bag.push(station.befriends.friend);
          expect(bag.length).toBeLessThanOrEqual(3);
        }
      }
    });

    test("a friend joins once, is a friend, and is never something to pick up", () => {
      const joins = path.stations.flatMap((s) => (s.kind === "obstacle" && s.befriends ? [s.befriends] : []));
      // TrailPlay walks with one friend at a time.
      expect(joins.length).toBeLessThanOrEqual(1);
      for (const { friend, from } of joins) {
        expect(FRIENDS[friend]).toBeDefined();
        expect(groundY(path.ground, from[0])).toBe(from[1]);
      }
      for (const station of path.stations) if (station.kind === "pickup") expect(FRIENDS[station.item]).toBeUndefined();
    });

    test("a creature's why-bubble is above the ground next to the child, where the screen shows it", () => {
      for (const station of path.stations) {
        if (station.kind !== "obstacle" || !("wants" in station.why)) continue;
        const [x, y] = station.why.wants;
        // The child stands at 760 of 1600 on the screen, its feet at 740 of 900 (in a world going up the screen shows
        // the drawing's x 0–1600); the bubble grows 160 away from the child and 200 up from its tip.
        const ahead = (x - placed(level.turns, [station.x, 0])[0]) * facing(level.turns, station.x);
        expect(ahead).toBeGreaterThan(40);
        expect(ahead).toBeLessThan(640);
        if (level.turns) {
          expect(x).toBeGreaterThan(200);
          expect(x).toBeLessThan(1400);
        }
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

    test("a float goes down the ground, and a raft is left where stairs or a ladder go up", () => {
      for (const station of path.stations) {
        if (station.kind !== "obstacle" || !station.float) continue;
        for (const [x, y] of station.float.to) expect(groundY(path.ground, x)).toBe(y);
        expect(station.float.to[0][0]).toBeGreaterThan(station.x);
      }
      if (!level.raft) return;
      const until = level.raft.until;
      // The child gets off at a climb, so it never walks on the water; nothing stops on the water after that.
      expect(path.stations.find((s) => s.x === until)?.kind).toBe("climb");
      for (const station of path.stations) if (station.x > until && station.kind === "climb") expect(station.steps[0][0]).toBeGreaterThan(until);
    });
  });
});
