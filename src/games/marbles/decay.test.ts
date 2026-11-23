import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildBuilding } from "./building";
import { decay, wobble, WOBBLE_REST } from "./level";
import { hump } from "./machineKit";

const HERE = import.meta.dir;

// A plain exponential never reaches 0: what died away with it changed the picture by a fraction of a pixel in every
// frame for the rest of the level, and the phone painted it again each time (perf, November 2026). Only a step's
// share of the way (`dt`, a camera following) may use it.
test("what dies away comes to rest: decay(), never Math.exp(-…) of an age", () => {
  const plain = readdirSync(HERE)
    .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts") && f !== "level.ts")
    .flatMap((f) =>
      readFileSync(join(HERE, f), "utf8")
        .split("\n")
        .map((line, i) => ({ where: `${f}:${i + 1}`, line }))
        .filter(({ line }) => line.includes("Math.exp(-") && !/\bdt\b/.test(line)),
    )
    .map(({ where }) => where);
  expect(plain).toEqual([]);
});

// sin(π) is 1.2e-16, not 0: a half sine over a finished segment times a fast wiggle (the farm rooster's wing) kept
// changing by that much in every frame. `hump()` is exactly 0 outside its segment.
test("a half sine over a segment is hump(seg(…)), never Math.sin(Math.PI * seg(…))", () => {
  const plain = readdirSync(HERE)
    .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts"))
    .flatMap((f) =>
      readFileSync(join(HERE, f), "utf8")
        .split("\n")
        .map((line, i) => ({ where: `${f}:${i + 1}`, line }))
        .filter(({ line }) => line.includes("Math.sin(Math.PI * seg(")),
    )
    .map(({ where }) => where);
  expect(plain).toEqual([]);
  expect(hump(1)).toBe(0);
  expect(hump(0.5)).toBe(1);
});

test("decay() is Math.exp(-x) until it is too small to see, then 0", () => {
  expect(decay(0)).toBe(1);
  expect(decay(2)).toBeCloseTo(Math.exp(-2), 12);
  expect(decay(9.01)).toBe(0);
  expect(decay(1e6)).toBe(0);
});

// The building site's conveyor belt and mixer drum ran for the whole minute, repainting their part of the picture in
// every frame: they stop once the marble has left them.
test("the building site's belt and drum stand once the marble is past them", () => {
  const site = buildBuilding();
  const late = site.duration - 1;
  expect(site.beltTravel(late)).toBe(site.beltTravel(late - 10));
  expect(site.drumSpin(late)).toBe(site.drumSpin(late - 10));
  expect(site.beltTravel(2)).toBeGreaterThan(site.beltTravel(1));
});

test("a wobble is exactly 0 once it is too small to see, long before SETTLE_S", () => {
  // The barn's kick: 1.2° damped by 3.5 a second is under 0.006° after 1.6 s.
  expect(wobble(1.6, 1.2, 26, 3.5)).toBe(0);
  expect(wobble(0.3, 1.2, 26, 3.5)).not.toBe(0);
  const age = -Math.log(WOBBLE_REST) / 3.5;
  expect(wobble(age + 0.01, 5, 36, 3.5)).toBe(0);
});
