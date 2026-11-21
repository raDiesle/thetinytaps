import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../styles/bookshelf.css", import.meta.url), "utf8");

// The trophy sign's glints are the one thing on the shelf that moves by itself (user request, November 2026): only
// transform and opacity of their own tiny layers, so a phone never paints the sign or the shelf again for them.
test("the trophy sign's glints move only by transform and opacity", () => {
  const frames = css.match(/@keyframes trophy-glint \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(frames).not.toBe("");
  const properties = [...frames.matchAll(/^\s*([a-z-]+):/gm)].map((m) => m[1]);
  expect(new Set(properties)).toEqual(new Set(["opacity", "transform"]));
  expect(css).toMatch(/\.shelf-trophy-glint \{[^}]*will-change: transform, opacity;/);
});

// Percentages of padding measure the shelf, not the sign: the sign grew to twice its size with them.
test("the trophy sign is sized by its own width, never by the shelf's", () => {
  const sign = css.match(/\.shelf-trophy-sign \{([^}]*)\}/)?.[1] ?? "";
  expect(sign).toContain("--trophy-sign:");
  expect(sign).not.toMatch(/padding:[^;]*%/);
});
