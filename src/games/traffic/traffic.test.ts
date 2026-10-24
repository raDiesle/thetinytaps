import { expect, test } from "@rstest/core";
import { busy, CAR_LENGTH, callDuck, createWorld, ROAD_BOTTOM, ROAD_TOP, SIDE_Y, step, toggle, ZEBRA_L, ZEBRA_R, type TrafficEvent, type World } from "./world";

// Plays the street through frame by frame and checks the one rule that matters:
// no car is ever on the zebra while an animal is on the road.

const FRAME = 16;

const onRoad = (y: number) => y > ROAD_TOP && y < ROAD_BOTTOM;

function carOnZebra(w: World) {
  return w.cars.some((c) => {
    const back = c.x - (c.lane === 0 ? 1 : -1) * CAR_LENGTH[c.kind];
    return Math.max(c.x, back) > ZEBRA_L && Math.min(c.x, back) < ZEBRA_R;
  });
}

/** Steps `ms` (or until nothing moves) and returns the events; fails if a car meets an animal. */
function play(w: World, ms = 30000) {
  const events: TrafficEvent[] = [];
  for (let t = 0; t < ms; t += FRAME) {
    events.push(...step(w, FRAME));
    if (w.animals.some((a) => onRoad(a.y))) expect(carOnZebra(w)).toBe(false);
    if (!busy(w)) break;
  }
  return events;
}

const types = (events: TrafficEvent[]) => events.map((e) => e.type);

test("green: every animal crosses to the far pavement, the cars wait at the line", () => {
  const w = createWorld(false);
  expect(toggle(w)).toHaveLength(1);
  play(w);
  expect(w.phase).toBe("walk");
  for (const a of w.animals) expect(a.y).toBe(SIDE_Y.far);
  expect(w.cars.length).toBeGreaterThan(0);
  expect(carOnZebra(w)).toBe(false);
  expect(busy(w)).toBe(false);
});

test("red: the cars drive off and the street is still again", () => {
  const w = createWorld(false);
  toggle(w);
  play(w);
  expect(types(toggle(w))).toEqual(["change"]);
  const events = play(w);
  expect(types(events)).toContain("stop");
  expect(w.phase).toBe("stop");
  expect(w.cars).toHaveLength(0);
  expect(busy(w)).toBe(false);
});

test("red while the animals are still crossing: they hurry on, the cars wait for them", () => {
  const w = createWorld(false);
  toggle(w);
  play(w, 2500);
  expect(toggle(w)).toHaveLength(1);
  play(w);
  for (const a of w.animals) expect(a.y === SIDE_Y.far || a.y === SIDE_Y.near).toBe(true);
  expect(w.cars).toHaveLength(0);
});

test("a tap right after a change does nothing", () => {
  const w = createWorld(false);
  toggle(w);
  expect(toggle(w)).toEqual([]);
  play(w, 500);
  expect(toggle(w)).toEqual([]);
});

test("the duck forgets to look at the first red, is called back and looks left and right", () => {
  const w = createWorld(true);
  toggle(w);
  play(w);
  const events = types([...toggle(w), ...play(w)]);
  const order = ["duckOut", "call", "look", "thanks"].map((type) => events.indexOf(type as TrafficEvent["type"]));
  expect(order.every((i) => i >= 0)).toBe(true);
  expect([...order].sort((a, b) => a - b)).toEqual(order);
  const duck = w.animals.find((a) => a.id === "ente")!;
  expect(duck.y).toBe(SIDE_Y.far);
  expect(w.duck).toBeNull();
});

test("tapping the duck on the road calls it back at once", () => {
  const w = createWorld(true);
  toggle(w);
  play(w);
  toggle(w);
  let events: TrafficEvent[] = [];
  for (let t = 0; t < 10000 && !events.length; t += FRAME) {
    step(w, FRAME);
    const duck = w.animals.find((a) => a.id === "ente")!;
    if (onRoad(duck.y)) events = callDuck(w);
  }
  expect(types(events)).toEqual(["call"]);
  play(w);
  expect(w.animals.find((a) => a.id === "ente")!.y).toBe(SIDE_Y.far);
});

test("without the duck's trick it stays on the pavement", () => {
  const w = createWorld(false);
  toggle(w);
  play(w);
  expect(types([...toggle(w), ...play(w)])).not.toContain("duckOut");
});
