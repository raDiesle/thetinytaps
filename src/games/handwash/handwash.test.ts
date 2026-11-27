import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
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

  test("every painted picture is made or waiting in the queue, and the built site leaves out the steps whose pictures aren't made", () => {
    const pictures = STEPS.flatMap((s) => s.pictures ?? []);
    const queued = HANDWASH_PICTURE_QUEUE.flatMap((q) => q.panels?.map((p) => p.file) ?? [q.file]);
    for (const id of pictures) {
      const file = `src/games/handwash/bilder/${id}.webp`;
      expect({ file, there: existsSync(file) || queued.includes(file) }).toEqual({ file, there: true });
    }
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

  test("the game's own class names carry its prefix, so no style of the menus or another game reaches them", () => {
    // Short modifiers (v-, f-, p-) only ever stand beside an hw- class. A bar segment called „room“ took the bookshelf room's full height (November 2026).
    const read = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");
    const source = ["./HandwashPlay.tsx", "./hands.tsx", "./sink.tsx"].map(read).join("\n");
    const literals = [...source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)].map((m) => (m[1] ?? m[2]).replace(/\$\{[^}]*\}/g, " "));
    const words = literals.flatMap((l) => l.split(/\s+/)).filter((w) => w && !w.endsWith("-"));
    for (const word of words) expect(word).toMatch(/^(hw-[\w-]+|[vfp]-\w+|past|now|paused|video)$/);
    const kinds = source.match(/const segmentKind = [^;]*;/)?.[0] ?? "";
    const named = [...kinds.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    expect(named.length).toBe(3);
    for (const name of named) expect(name).toMatch(/^hw-seg-/);
  });

  test("a tap on the picture pauses, and the controls are Zähne putzen's: pause, start again, the bar, the time", () => {
    const play = readFileSync(new URL("./HandwashPlay.tsx", import.meta.url), "utf8");
    expect(play).toMatch(/className=\{`hw-stage[\s\S]{0,400}onPointerDown=\{[\s\S]{0,200}togglePause\(\)/);
    for (const part of ["hw-controls", "hw-progress", "hw-time", "hw-paused", "ControlIcon"]) expect(play).toContain(part);
  });
});
