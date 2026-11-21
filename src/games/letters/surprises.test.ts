import { readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { SURPRISE, SURPRISE_KINDS } from "./Surprises";

// Frei tippen's surprises (user request, November 2026) stay a few at a time and light for old phones: each a few
// small layers moved only by transform and opacity, running once and gone again by themselves.

const css = readFileSync("src/games/letters/surprises.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

test("surprises never pile up", () => {
  expect(SURPRISE.maxAtOnce).toBeLessThanOrEqual(3);
  expect(SURPRISE.gapMs).toBeGreaterThanOrEqual(500);
});

test("every kind has its lifetime, and there are many kinds to take turns", () => {
  expect(SURPRISE_KINDS.length).toBeGreaterThanOrEqual(5);
  for (const kind of SURPRISE_KINDS) expect(SURPRISE.lifeMs[kind]).toBeGreaterThan(0);
});

test("surprises move only by transform and opacity", () => {
  for (const [, name, body] of css.matchAll(/@keyframes (ft-[\w-]+) \{([\s\S]*?)\n\}/g)) {
    const properties = [...body.matchAll(/^\s+([\w-]+):/gm)].map(([, p]) => p);
    expect({ name, others: properties.filter((p) => p !== "transform" && p !== "opacity") }).toEqual({ name, others: [] });
  }
});

/** The classes each kind draws, to find its animations in the stylesheet. */
const CLASSES: Record<(typeof SURPRISE_KINDS)[number], RegExp> = {
  firework: /^\.ft-(rocket|flash|spark)/,
  gift: /^\.ft-gift/,
  egg: /^\.ft-egg/,
  balloons: /^\.ft-balloon/,
  flowers: /^\.ft-(stem|head)/,
  bubbles: /^\.ft-bubble/,
  rainbow: /^\.ft-rainbow/,
};

/**
 * How late an animation of each kind may start (`--delay` in Surprises.tsx): the firework's bang after its rocket, the
 * last of three bursts and a spiral's last spark; the third flower; the latest bubble. A longer delay there needs its
 * kind's `lifeMs` raised too.
 */
const LATEST_START_MS: Record<(typeof SURPRISE_KINDS)[number], number> = {
  firework: 450 + 440,
  gift: 0,
  egg: 0,
  balloons: 0,
  flowers: 300,
  bubbles: 350,
  rainbow: 0,
};

test("every surprise animation runs once and ends before its surprise is removed", () => {
  expect(css).not.toMatch(/\binfinite\b/);
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const seconds = body.match(/animation:\s*[\w-]+\s+([\d.]+)s/)?.[1];
    if (!seconds) continue;
    const kind = SURPRISE_KINDS.find((k) => CLASSES[k].test(selector.trim()));
    expect({ selector: selector.trim(), kind }).toEqual({ selector: selector.trim(), kind: expect.any(String) });
    if (kind) expect(Number(seconds) * 1000 + LATEST_START_MS[kind]).toBeLessThanOrEqual(SURPRISE.lifeMs[kind]);
  }
});
