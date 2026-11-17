import { describe, expect, test } from "bun:test";
import { groundY, placed } from "./ground";
import { TRAIL_LEVELS } from "./levels";
import { carryAt, ease, goalAt, nextFrom } from "./view";

describe("how the goal and the carried thing move", () => {
  test("a move eases in and out and ends where it should", () => {
    expect(ease(0)).toBe(0);
    expect(ease(0.5)).toBe(0.5);
    expect(ease(1)).toBe(1);
    expect(ease(0.1)).toBeLessThan(0.1);
    expect(ease(0.9)).toBeGreaterThan(0.9);
  });

  test("the goal starts and lands on its points, and sways only on the way", () => {
    expect(goalAt([0, 0], [100, 200], 0, 40)).toEqual([0, 0]);
    const [x, y] = goalAt([0, 0], [100, 200], 1, 40);
    expect(x).toBe(100);
    expect(y).toBeCloseTo(200);
    expect(goalAt([0, 0], [100, 0], 1 / 6, 40)[1]).toBeGreaterThan(20);
  });

  test("the carried thing goes along a bow and grows to its new size", () => {
    expect(carryAt([0, 0], 1, [100, 0], 0.5, 0, 60)).toEqual({ at: [0, 0], s: 1 });
    expect(carryAt([0, 0], 1, [100, 0], 0.5, 1, 60)).toEqual({ at: [100, 0], s: 0.5 });
    // Half way it is `arc` above the straight line.
    expect(carryAt([0, 0], 1, [100, 0], 1, 0.5, 60).at[1]).toBe(-60);
    // `linear` keeps an even pace.
    expect(carryAt([0, 0], 1, [100, 0], 1, 0.25, 0, true).at[0]).toBe(25);
  });
});

describe("what the next tap shows before it is pressed", () => {
  for (const level of TRAIL_LEVELS) {
    const first = level.stations[0];
    if (first.kind === "fork") continue;
    test(`${level.id}: footprints lead from the child to its ghost at the first station`, () => {
      const next = nextFrom(level, level.start, first);
      expect(next.prints.length).toBeGreaterThan(0);
      if (first.kind === "climb") expect(next.icon).toBe("climb");
      else expect(next.ghost).toEqual(placed(level.turns, [first.x, groundY(level.ground, first.x)]));
      if (first.kind === "pickup") expect(next.at).toEqual(first.at);
    });
  }
});
