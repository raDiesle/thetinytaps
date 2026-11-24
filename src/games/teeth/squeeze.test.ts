import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { squeezedBy } from "./mouth";

// A monster the brush catches is squeezed out past the head on both sides, so it is seen under the brush that lies in
// front of it (user request, November 2026).

/** How far the squeezed monster (about 15 of its units each way) reaches on the screen, in the picture's units. */
const reachOf = (by: number, size: number) => 15 * size * by;

test("a caught monster reaches past the brush's head on both sides", () => {
  for (const size of [0.5, 1, 2])
    for (const head of [4, 8, 12].map((r) => r * size)) {
      const { by } = squeezedBy({ angle: 90, reach: head }, "", size);
      expect(reachOf(by, size)).toBeGreaterThan(head);
    }
});

test("facing us, it is squeezed out the way the head is thinnest", () => {
  expect(squeezedBy({ angle: 30, reach: 8 }, "", 1).angle).toBe(30);
});

test("on a face turned away the squeeze is turned back through the lean, and stretched by as much as the lean squashes", () => {
  // Squashed to half its height: squeezed upwards on the screen it must stretch twice as far in the sprite.
  const flat = squeezedBy({ angle: 90, reach: 8 }, "1 0 0 0.5", 1);
  const facing = squeezedBy({ angle: 90, reach: 8 }, "", 1);
  expect(Math.abs(flat.angle)).toBe(90);
  expect(flat.by).toBeGreaterThan(facing.by);
});

test("the squeeze is the dissolve's first beat, a transform of the sprite's HTML", () => {
  const css = readFileSync(new URL("./teeth.css", import.meta.url), "utf8");
  const keyframes = css.slice(css.indexOf("@keyframes teeth-monster-dissolve"), css.indexOf("/* The grains"));
  expect(keyframes).toContain("scale(var(--squeeze-k");
  expect(keyframes).toContain("rotate(var(--squeeze-a");
  const mouth = readFileSync(new URL("./mouth.tsx", import.meta.url), "utf8");
  expect(mouth).toMatch(/"--squeeze-a": `\$\{squeezeAngle\}deg`/);
});
