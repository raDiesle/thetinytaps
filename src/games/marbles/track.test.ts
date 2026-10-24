import { expect, test } from "@rstest/core";
import { BALL_R, HOPPER, ROLLER, ROLLERS, ROW1A, rowY, SHELF, shelfSpot, SLOTS } from "./track";

// The shelf of things to pick from (K-07) is easy to break when a thing or a place is added.

test("a thing taken from the shelf always has something new to make room for", () => {
  // The taken one and the two left on the shelf are out; at least two others must be there to pick from.
  expect(ROLLERS.length).toBeGreaterThanOrEqual(SHELF.things.length + 2);
  expect(new Set(ROLLERS).size).toBe(ROLLERS.length);
  for (const kind of ROLLERS) expect(ROLLER[kind].pace, kind).toBeGreaterThan(0);
});

test("the shelf lies between the hopper and the first spot, over row 1a, with room for a finger", () => {
  const xs = SHELF.things;
  for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1], "places on the shelf").toBeGreaterThanOrEqual(110);
  expect(xs[0] - 58).toBeGreaterThan(HOPPER.x + 58);
  expect(xs[xs.length - 1] + 58).toBeLessThan(SLOTS[0].from.x);
  // The shelf stays above the marbles rolling along row 1a under it.
  for (const x of [SHELF.x0, SHELF.x1]) expect(SHELF.y + 13).toBeLessThan(rowY(ROW1A, x) - BALL_R);
  for (const kind of ROLLERS) expect(shelfSpot(0, kind).y).toBeLessThan(SHELF.y);
});
