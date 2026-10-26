import { describe, expect, test } from "@rstest/core";
import { distanceToRect, pickTap, tapState } from "./tapTargets";

describe("tap targets", () => {
  const box = { left: 10, top: 10, right: 50, bottom: 30 };

  test("the distance is 0 inside and to the nearest edge or corner outside", () => {
    expect(distanceToRect(20, 20, box)).toBe(0);
    expect(distanceToRect(60, 20, box)).toBe(10);
    expect(distanceToRect(20, 0, box)).toBe(10);
    expect(distanceToRect(53, 34, box)).toBe(5);
  });

  test("the right answer wins, then one not tapped yet, then the nearest", () => {
    const tap = (target: string, state: string, distance: number) => ({ target, state, distance });
    expect(pickTap([tap("dog", "done", 0), tap("cat", "", 20)])?.target).toBe("cat");
    expect(pickTap([tap("dog", "", 0), tap("cow", "goal", 25)])?.target).toBe("cow");
    expect(pickTap([tap("dog", "", 12), tap("cat", "", 4)])?.target).toBe("cat");
    expect(pickTap([tap("dog", "", 0), tap("cat", "", 0)])?.target).toBe("dog");
    expect(pickTap([])).toBeUndefined();
  });

  test("a thing tapped already is no longer the right answer", () => {
    expect(tapState({ goal: true, done: true })).toBe("done");
    expect(tapState({ goal: true })).toBe("goal");
    expect(tapState({})).toBe("");
  });
});
