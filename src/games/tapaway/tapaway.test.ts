import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { MIN_CHANGE_MS } from "@/games/letters/pace";
import { MAX_POPS, MAX_SPARKLES, POP_COLORS, POP_MS, SPARKLE_GAP_MS, SPARKLE_MS } from "./TapAwayPlay";
import { SHAPES } from "./shapes";

const css = readFileSync(new URL("./tapaway.css", import.meta.url), "utf8");

describe("Drauflos tippen stays calm", () => {
  // Wild hammering must never become a storm (root CLAUDE.md): few things at once, each gone again soon.
  test("only a few letters and shapes at once, one at most every MIN_CHANGE_MS", () => {
    expect(MAX_POPS).toBeLessThanOrEqual(5);
    expect(MIN_CHANGE_MS).toBeGreaterThanOrEqual(200);
    expect(POP_MS).toBeLessThanOrEqual(3000);
  });

  test("a mouse's sparkles stay a short trail", () => {
    expect(MAX_SPARKLES).toBeLessThanOrEqual(12);
    expect(SPARKLE_GAP_MS).toBeGreaterThanOrEqual(50);
    expect((SPARKLE_MS * (1000 / SPARKLE_GAP_MS)) / 1000).toBeLessThanOrEqual(MAX_SPARKLES);
  });

  // Phones must keep up: what moves is a small HTML layer moved by transform and opacity alone.
  test("its keyframes animate only transform and opacity", () => {
    for (const [, body] of css.matchAll(/@keyframes [\w-]+ \{([\s\S]*?)\n\}/g)) {
      const props = [...body.matchAll(/^\s+([\w-]+):/gm)].map((m) => m[1]);
      expect(
        props.every((p) => p === "transform" || p === "opacity"),
        props.join(),
      ).toBe(true);
    }
  });

  test("its classes and keyframes carry the game's prefix", () => {
    for (const [, name] of css.matchAll(/^\.([\w-]+)/gm)) expect(name.startsWith("tw-"), name).toBe(true);
    for (const [, name] of css.matchAll(/@keyframes ([\w-]+)/g)) expect(name.startsWith("tw-"), name).toBe(true);
  });

  test("its shapes and colours are distinct", () => {
    expect(new Set(SHAPES).size).toBe(SHAPES.length);
    expect(new Set(POP_COLORS).size).toBe(POP_COLORS.length);
  });
});
