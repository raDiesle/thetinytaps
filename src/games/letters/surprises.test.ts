import { readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { ART_KINDS } from "./SurpriseArt";
import { SURPRISE, SURPRISE_KINDS } from "./Surprises";
import {
  CANVAS_KINDS,
  CANVAS_MAX_DPR,
  CANVAS_SECONDS,
  type CanvasParams,
  canvasEffect,
  canvasParams,
  MAX_SPARKS,
  ROCKET_BURSTS,
  SPARKLER_FIGURES,
} from "./surpriseCanvas";

// Frei tippen's surprises (user request, November 2026) stay a few at a time and light for old phones: each a few
// small layers moved only by transform and opacity, or one small canvas drawn by its own loop, running once and gone
// again by themselves. The later kinds are drawn by the app itself, never emojis (user request, November 2026).

const css = readFileSync("src/games/letters/surprises.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

type Kind = (typeof SURPRISE_KINDS)[number];

test("surprises never pile up", () => {
  expect(SURPRISE.maxAtOnce).toBeLessThanOrEqual(3);
  expect(SURPRISE.gapMs).toBeGreaterThanOrEqual(200);
});

test("every kind has its lifetime, and there are many kinds to take turns", () => {
  expect(SURPRISE_KINDS.length).toBeGreaterThanOrEqual(14);
  expect(new Set(SURPRISE_KINDS).size).toBe(SURPRISE_KINDS.length);
  for (const kind of SURPRISE_KINDS) expect(SURPRISE.lifeMs[kind]).toBeGreaterThan(0);
});

test("the rainbow stays out (user feedback, November 2026: not cool)", () => {
  expect(SURPRISE_KINDS as readonly string[]).not.toContain("rainbow");
  expect(css).not.toMatch(/rainbow/);
});

test("every surprise is drawn by the app itself, never with emojis – the present's toy and the egg's baby too", () => {
  for (const file of ["Surprises.tsx", "SurpriseArt.tsx", "SurpriseFigures.tsx", "surpriseCanvas.ts", "surprises.css"]) {
    const source = readFileSync(`src/games/letters/${file}`, "utf8");
    expect({ file, emojis: source.match(/\p{Extended_Pictographic}/gu) ?? [] }).toEqual({ file, emojis: [] });
  }
});

test("surprises move only by transform and opacity", () => {
  for (const [, name, body] of css.matchAll(/@keyframes (ft-[\w-]+) \{([\s\S]*?)\n\}/g)) {
    const properties = [...body.matchAll(/^\s+([\w-]+):/gm)].map(([, p]) => p);
    // A keyframe's own easing only times the move, it paints nothing.
    const others = properties.filter((p) => p !== "transform" && p !== "opacity" && p !== "animation-timing-function");
    expect({ name, others }).toEqual({ name, others: [] });
  }
});

/** The classes each kind draws, to find its animations in the stylesheet (canvas kinds animate none). */
const CLASSES: Record<Kind, RegExp | null> = {
  firework: /^\.ft-(rocket|flash|spark)/,
  gift: /^\.ft-gift/,
  egg: /^\.ft-egg/,
  balloons: /^\.ft-balloon/,
  flowers: /^\.ft-(stem|head)/,
  bubbles: /^\.ft-bubble/,
  comet: /^\.ft-comet/,
  snowflake: /^\.ft-snowflake/,
  mandala: /^\.ft-mandala/,
  splash: /^\.ft-splash/,
  pinwheel: /^\.ft-pinwheel/,
  balls: /^\.ft-ball/,
  skyrocket: null,
  fountain: null,
  swirl: null,
  sparkler: null,
};

/**
 * The latest `--delay` each kind sets in its TSX (an animation with a delay written in the stylesheet is read from
 * there): the firework's bang after its rocket plus the last of three bursts and a spiral's last spark; the third
 * flower; the latest bubble; the third ring; the fifth ball. A longer delay there needs its kind's `lifeMs` raised too.
 */
const LATEST_DELAY_MS: Record<Kind, number> = {
  firework: 450 + 440,
  gift: 0,
  egg: 0,
  balloons: 0,
  flowers: 300,
  bubbles: 350,
  comet: 0,
  snowflake: 0,
  mandala: 240,
  splash: 0,
  pinwheel: 0,
  balls: 4 * 90,
  skyrocket: 0,
  fountain: 0,
  swirl: 0,
  sparkler: 0,
};

test("every surprise animation runs once and ends before its surprise is removed", () => {
  expect(css).not.toMatch(/\binfinite\b/);
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const value = body.match(/animation:\s*([^;]+);/)?.[1];
    const seconds = value?.match(/^[\w-]+\s+([\d.]+)s/)?.[1];
    if (!value || !seconds) continue;
    const delayMs = /var\(--delay\)/.test(value) ? null : Number(value.match(/\s([\d.]+)s\s+both/)?.[1] ?? 0) * 1000;
    const kind = SURPRISE_KINDS.find((k) => CLASSES[k]?.test(selector.trim()));
    expect({ selector: selector.trim(), kind }).toEqual({ selector: selector.trim(), kind: expect.any(String) });
    if (kind) expect(Number(seconds) * 1000 + (delayMs ?? LATEST_DELAY_MS[kind])).toBeLessThanOrEqual(SURPRISE.lifeMs[kind]);
  }
});

test("a surprise's wrapper carries its kind as an attribute, never as a class its drawing animates", () => {
  const source = readFileSync("src/games/letters/Surprises.tsx", "utf8");
  expect(source).not.toMatch(/ft-\$\{s\.kind\}/);
  expect(source).toMatch(/className="ft-at" data-kind=\{s\.kind\}/);
});

test("every kind is either drawn in the stylesheet or on a canvas", () => {
  for (const kind of SURPRISE_KINDS)
    expect({ kind, canvas: CLASSES[kind] === null }).toEqual({ kind, canvas: (CANVAS_KINDS as readonly string[]).includes(kind) });
  for (const kind of ART_KINDS) {
    const classes = new RegExp(`^\\s*${(CLASSES[kind]?.source ?? "^-").slice(1)}`, "m");
    expect({ kind, styled: classes.test(css) }).toEqual({ kind, styled: true });
  }
});

/** Every look a canvas kind can have, so each is run once. */
function everyCanvasLook(): CanvasParams[] {
  const looks: CanvasParams[] = [];
  for (const kind of CANVAS_KINDS) {
    const p = canvasParams(kind);
    if (p.kind === "skyrocket") for (const burst of ROCKET_BURSTS) looks.push({ ...p, burst });
    else if (p.kind === "sparkler") for (const figure of SPARKLER_FIGURES) looks.push({ ...p, figure });
    else looks.push(p);
  }
  return looks;
}

test("a canvas surprise keeps its sparks few and ends before its surprise is removed", () => {
  expect(CANVAS_MAX_DPR).toBeLessThanOrEqual(1.5);
  for (const look of everyCanvasLook()) {
    const effect = canvasEffect(look, 300);
    const dt = 1 / 60;
    let seconds = 0;
    let most = 0;
    while (effect.step(dt)) {
      seconds += dt;
      most = Math.max(most, effect.count());
      if (seconds > 10) break;
    }
    const name = "burst" in look ? look.burst : "figure" in look ? look.figure : look.kind;
    expect({ name, ends: seconds <= CANVAS_SECONDS[look.kind] }).toEqual({ name, ends: true });
    expect({ name, within: seconds * 1000 < SURPRISE.lifeMs[look.kind] }).toEqual({ name, within: true });
    expect({ name, sparks: most <= MAX_SPARKS, some: most > 10 }).toEqual({ name, sparks: true, some: true });
  }
});
