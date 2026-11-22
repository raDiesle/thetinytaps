import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { APP_LANGUAGES } from "@/lib/language";
import { DIRT_MONSTERS } from "./hands";
import { BEAT_MS, RUB_STEPS, STEP_STARTS, STEPS, stepAt, TOTAL_MS } from "./steps";

describe("Hände waschen", () => {
  test("every step has its own id and a name in every app language", () => {
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
    for (const step of STEPS) {
      expect(step.beats).toBeGreaterThan(0);
      for (const lang of APP_LANGUAGES) expect({ step: step.id, lang, has: Boolean(step.name[lang]?.trim()) }).toEqual({ step: step.id, lang, has: true });
    }
  });

  test("the rubbing lasts at least the 20 seconds hand washing asks for", () => {
    const rubBeats = STEPS.filter((s) => RUB_STEPS.includes(s.id)).reduce((sum, s) => sum + s.beats, 0);
    expect(rubBeats * BEAT_MS).toBeGreaterThanOrEqual(20_000);
    expect(RUB_STEPS.every((id) => STEPS.some((s) => s.id === id))).toBe(true);
  });

  test("every dirt monster sits on a rubbing step and has its own id", () => {
    expect(new Set(DIRT_MONSTERS.map((m) => m.id)).size).toBe(DIRT_MONSTERS.length);
    for (const monster of DIRT_MONSTERS) expect(RUB_STEPS).toContain(monster.step);
  });

  test("the clock finds the step running at any moment", () => {
    expect(STEP_STARTS[0]).toBe(0);
    expect(stepAt(0)).toBe(0);
    STEP_STARTS.slice(0, -1).forEach((start, i) => expect(stepAt(start + 1)).toBe(i));
    expect(stepAt(TOTAL_MS + 1000)).toBe(STEPS.length - 1);
  });

  test("keyframes move only transform, opacity and filter, so a phone never paints the picture again", () => {
    const css = readFileSync(new URL("./handwash.css", import.meta.url), "utf8");
    const keyframes = [...css.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g)];
    expect(keyframes.length).toBeGreaterThan(0);
    for (const [, name, body] of keyframes) {
      const props = [...body.matchAll(/([\w-]+)\s*:/g)].map((m) => m[1]);
      for (const prop of props) expect(`${name}: ${prop}`).toMatch(/: (transform|opacity|filter|animation-timing-function)$/);
    }
  });
});
