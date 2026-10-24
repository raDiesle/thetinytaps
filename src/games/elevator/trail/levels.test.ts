import { describe, expect, test } from "@rstest/core";
import { groundY, route } from "./ground";
import type { ItemId } from "./items";
import { TRAIL_LEVELS } from "./levels";

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
  test("station ids are unique", () => {
    const ids = level.stations.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("the ground and the stations go from left to right", () => {
    const xs = level.ground.map(([x]) => x);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
    const stops = [level.start, ...level.stations.map((s) => s.x)];
    for (let i = 1; i < stops.length; i++) expect(stops[i]).toBeGreaterThan(stops[i - 1]);
  });

  test("the bag never holds more than three things, and holds what each obstacle needs", () => {
    const bag: ItemId[] = [];
    for (const station of level.stations) {
      if (station.kind === "pickup") {
        bag.push(station.item);
        expect(bag.length).toBeLessThanOrEqual(3);
      } else if (station.kind === "obstacle") {
        expect(bag).toContain(station.need);
        bag.splice(bag.indexOf(station.need), 1);
      }
    }
  });

  test("the last station gives the goal back, and only that one", () => {
    const freeing = level.stations.filter((s) => s.kind === "obstacle" && s.frees);
    expect(freeing).toEqual([level.stations[level.stations.length - 1]]);
  });

  test("the steps of stairs lie on the ground, going up", () => {
    for (const station of level.stations) {
      if (station.kind !== "climb") continue;
      expect(station.steps.length).toBeGreaterThan(0);
      for (const [x, y] of station.steps) expect(groundY(level.ground, x)).toBe(y);
      expect(station.steps[0][0]).toBeGreaterThan(station.x);
    }
  });
});
