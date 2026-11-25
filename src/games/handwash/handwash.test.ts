import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { APP_LANGUAGES } from "@/lib/language";
import { HANDWASH_PICTURE_QUEUE } from "./handwashPictures";
import { BEAT_MS, playedSteps, RUB_STEPS, STEPS, stepAt, stepStarts } from "./steps";

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

  test("the steps follow the way hands are washed: soap and rubbing before the water, then rinse, off, towel", () => {
    const order = STEPS.map((s) => s.id);
    const at = (id: (typeof order)[number]) => order.indexOf(id);
    expect(at("sleeves")).toBeLessThan(at("soap"));
    for (const id of RUB_STEPS) expect(at("soap")).toBeLessThan(at(id));
    expect(at("between")).toBeLessThan(at("water"));
    const rest = [at("water"), at("rinse"), at("off"), at("towel"), at("run")];
    expect(rest).toEqual([...rest].sort((a, b) => a - b));
  });

  test("every painted picture is waiting in the queue, and the built site leaves out the steps whose pictures aren't made", () => {
    const pictures = STEPS.flatMap((s) => s.pictures ?? []);
    const queued = HANDWASH_PICTURE_QUEUE.flatMap((q) => q.panels?.map((p) => p.file) ?? [q.file]);
    for (const id of pictures) expect(queued).toContain(`src/games/handwash/bilder/${id}.webp`);
    expect(playedSteps(STEPS, () => false, true)).toEqual(STEPS);
    const built = playedSteps(STEPS, () => false, false);
    expect(built.some((s) => s.pictures)).toBe(false);
    expect(built.filter((s) => RUB_STEPS.includes(s.id)).length).toBe(RUB_STEPS.length);
    expect(playedSteps(STEPS, () => true, false)).toEqual(STEPS);
  });

  test("the clock finds the step running at any moment", () => {
    const starts = stepStarts(STEPS);
    expect(starts[0]).toBe(0);
    expect(starts.length).toBe(STEPS.length + 1);
    expect(stepAt(starts, 0)).toBe(0);
    starts.slice(0, -1).forEach((start, i) => expect(stepAt(starts, start + 1)).toBe(i));
    expect(stepAt(starts, starts[starts.length - 1] + 1000)).toBe(STEPS.length - 1);
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
