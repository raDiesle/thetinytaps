import { expect, test } from "bun:test";
import { digitOf, drawNumber, FIND_REACHES, HINT_AFTER_WRONG, nextPace, START_PACE, STEP_UP_AFTER } from "./numberFind";

test("„Wo ist die 3?“ starts with 1–3, then goes up to 5 and to 9", () => {
  expect(FIND_REACHES).toEqual([3, 5, 9]);
  for (let i = 0; i < 50; i++) {
    const n = drawNumber(START_PACE.step, null);
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(3);
  }
});

test("rounds found with the first key in a row bring bigger numbers, never past 9", () => {
  let pace = START_PACE;
  for (let i = 0; i < STEP_UP_AFTER; i++) pace = nextPace(pace, 0);
  expect(pace).toEqual({ step: 1, streak: 0 });
  for (let i = 0; i < STEP_UP_AFTER * 4; i++) pace = nextPace(pace, 0);
  expect(pace.step).toBe(FIND_REACHES.length - 1);
});

test("a wrong key starts the run anew, and a round that needed the hint brings smaller numbers again", () => {
  expect(nextPace({ step: 1, streak: 2 }, 1)).toEqual({ step: 1, streak: 0 });
  expect(nextPace({ step: 2, streak: 1 }, HINT_AFTER_WRONG)).toEqual({ step: 1, streak: 0 });
  expect(nextPace(START_PACE, HINT_AFTER_WRONG + 2)).toEqual(START_PACE);
});

test("never the same number twice in a row, and right after a step up the new numbers first", () => {
  for (let i = 0; i < 50; i++) expect(drawNumber(0, 2)).not.toBe(2);
  for (let i = 0; i < 50; i++) expect(drawNumber(1, null, true)).toBeGreaterThan(3);
  for (let i = 0; i < 50; i++) expect(drawNumber(2, 7, true)).toBeOneOf([6, 8, 9]);
});

test("a digit key counts by its character or, where a layout puts another sign there, by its place", () => {
  expect(digitOf("3", "Digit3")).toBe(3);
  expect(digitOf("3", "Numpad3")).toBe(3);
  // A French keyboard's top row without Shift.
  expect(digitOf('"', "Digit3")).toBe(3);
  expect(digitOf("a", "KeyA")).toBeNull();
  expect(digitOf("Enter", "Enter")).toBeNull();
});
