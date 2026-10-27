import { expect, test } from "bun:test";
import { BALL_R, type Pt } from "./path";
import {
  BASKET_FULL,
  BASKET_SLOTS,
  buildRoutes,
  DEFAULT_BUILD,
  HOPPER,
  PIECES,
  ROLLER,
  ROLLERS,
  ROW1A,
  rowY,
  SHELF,
  shelfSpot,
  slotBoard,
  SLOTS,
  TRACK_H,
  TRACK_W,
  TURNS,
} from "./track";

// The run is many hand-placed numbers; these checks catch a marble that would
// jump between sections or roll off the wall when one of them changes.

const routes = buildRoutes();
const near = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y) < 1;
const first = (route: { pts: Pt[] }) => route.pts[0];
const last = (route: { pts: Pt[] }) => route.pts[route.pts.length - 1];

test("every spot has a default part, and the basket has room for a full load", () => {
  expect(DEFAULT_BUILD).toHaveLength(SLOTS.length);
  expect(routes.fixed).toHaveLength(SLOTS.length + 1);
  expect(BASKET_SLOTS.length).toBeGreaterThanOrEqual(BASKET_FULL);
});

test("the sections join up: every part of every spot starts where the run before it ends", () => {
  SLOTS.forEach((slot, i) => {
    expect(near(last(routes.fixed[i]), slot.from), `fixed ${i} ends at spot ${i}`).toBe(true);
    expect(near(first(routes.fixed[i + 1]), slot.to), `fixed ${i + 1} starts after spot ${i}`).toBe(true);
    for (const piece of PIECES) {
      const route = routes.pieces[i][piece];
      expect(near(first(route), slot.from), `${piece} in spot ${i} starts at its top`).toBe(true);
      expect(near(last(route), slot.to), `${piece} in spot ${i} ends at its bottom`).toBe(true);
    }
  });
});

test("the whole run stays on the wall, and no step is a jump", () => {
  for (const route of [...routes.fixed, ...routes.pieces.flatMap((p) => Object.values(p))]) {
    route.pts.forEach((pt, i) => {
      expect(pt.x).toBeGreaterThanOrEqual(BALL_R);
      expect(pt.x).toBeLessThanOrEqual(TRACK_W - BALL_R);
      expect(pt.y).toBeLessThanOrEqual(TRACK_H - BALL_R);
      if (i) expect(Math.hypot(pt.x - route.pts[i - 1].x, pt.y - route.pts[i - 1].y)).toBeLessThan(80);
    });
  }
});

test("spot boards don't overlap, so a tap swaps one part only", () => {
  const boards = SLOTS.map(slotBoard);
  boards.forEach((a, i) =>
    boards.slice(i + 1).forEach((b, k) => {
      const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y;
      expect(apart, `spots ${i} and ${i + k + 1}`).toBe(true);
    }),
  );
});

test("at every turn the wall is on the far side of where the marble comes from", () => {
  for (const turn of TURNS) {
    expect(Math.sign(turn.x - turn.from.x)).toBe(Math.sign(turn.x - turn.to.x));
    expect(turn.to.y).toBeGreaterThan(turn.from.y + BALL_R);
  }
});

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
