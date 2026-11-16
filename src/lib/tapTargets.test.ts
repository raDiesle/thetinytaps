import { describe, expect, test } from "bun:test";
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

describe("contactReach", () => {
  test("a finger or mouse adds nothing, a palm adds half its size, capped", async () => {
    const { contactReach, MAX_CONTACT_REACH_PX } = await import("./tapTargets");
    expect(contactReach({ width: 12, height: 12 })).toBe(0);
    expect(contactReach({})).toBe(0);
    expect(contactReach({ width: 80, height: 50 })).toBe(40);
    expect(contactReach({ width: 400, height: 400 })).toBe(MAX_CONTACT_REACH_PX);
  });
});
