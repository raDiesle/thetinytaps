import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { SURPRISE } from "@/games/letters/Surprises";
import { freeSpot, type Placed } from "./place";
import { SHAPES } from "./shapes";
import { MAX_POPS, MAX_SPARKLES, POP_COLORS, POP_GAP_MS, POP_MS, RIPPLE_GAP_MS, SPARKLE_GAP_MS, SPARKLE_MS, TAP_AWAY_SURPRISES } from "./TapAwayPlay";

const css = readFileSync(new URL("./tapaway.css", import.meta.url), "utf8");

describe("Magic Keys shows several things at once, yet never a storm", () => {
  // Quick presses one after the other show several things at once (user request, 24 November 2026): the one game
  // where that is wanted. A held-down hand still can't flood the page.
  test("several letters and shapes at once, yet within limits", () => {
    expect(MAX_POPS).toBeGreaterThanOrEqual(6);
    expect(MAX_POPS).toBeLessThanOrEqual(10);
    expect(POP_GAP_MS).toBeGreaterThanOrEqual(60);
    expect(POP_GAP_MS).toBeLessThan(250);
    expect(POP_MS).toBeLessThanOrEqual(3000);
  });

  test("its surprises come quicker than Frei tippen's, still few at once", () => {
    expect(TAP_AWAY_SURPRISES.maxAtOnce).toBeGreaterThan(SURPRISE.maxAtOnce);
    expect(TAP_AWAY_SURPRISES.maxAtOnce).toBeLessThanOrEqual(6);
    expect(TAP_AWAY_SURPRISES.gapMs).toBeLessThan(SURPRISE.gapMs);
    expect(TAP_AWAY_SURPRISES.gapMs).toBeGreaterThanOrEqual(100);
  });

  // A smashing hand kept about 18 rings on the page, a fifth of an old phone's main thread: presses landing together
  // share one ripple, while a child's single taps (a few a second) each still get theirs.
  test("presses landing together share one ripple", () => {
    expect(RIPPLE_GAP_MS).toBeGreaterThanOrEqual(100);
    expect(RIPPLE_GAP_MS).toBeLessThanOrEqual(250);
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

describe("each new thing stands beside the others while there is room", () => {
  const room = { width: 1024, height: 700, top: 72 };
  /** A repeatable chance, so the test never flickers. */
  const seeded = (seed: number) => () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  test("three letters on a tablet's page never overlap", () => {
    for (let seed = 1; seed < 40; seed++) {
      const random = seeded(seed);
      const taken: Placed[] = [];
      for (let i = 0; i < 3; i++) taken.push({ ...freeSpot(room, 120, taken, random), reach: 120 });
      for (const a of taken) for (const b of taken) if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(240);
    }
  });

  test("on a full page it still lands inside, where it covers least", () => {
    const random = seeded(7);
    const taken: Placed[] = [];
    for (let i = 0; i < 12; i++) {
      const at = freeSpot(room, 150, taken, random);
      expect(at.x).toBeGreaterThanOrEqual(150);
      expect(at.x).toBeLessThanOrEqual(room.width - 150);
      expect(at.y).toBeGreaterThanOrEqual(room.top + 150);
      expect(at.y).toBeLessThanOrEqual(room.height - 150);
      taken.push({ ...at, reach: 150 });
    }
  });
});
