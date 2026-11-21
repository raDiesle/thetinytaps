import { readFileSync } from "node:fs";
import { describe, expect, it } from "bun:test";
import { dayKey, weekOf } from "@/lib/days";
import { SAID, STEPS } from "./content";
import { PARENTS_SCRIPT, sampleWeek, scriptMs, TARGET_SELECTORS } from "./parentsScript";

const play = readFileSync("src/games/potty/PottyPlay.tsx", "utf8");

describe("the parents' video of Aufs Töpfchen (Y-29)", () => {
  it("lasts one to two minutes, as the idea asks, with time for YouTube's end screen", () => {
    expect(scriptMs()).toBeGreaterThanOrEqual(60_000);
    expect(scriptMs()).toBeLessThanOrEqual(120_000);
  });

  it("goes through the story in its order, so no beat waits for a step already passed", () => {
    const order = PARENTS_SCRIPT.map((beat) => STEPS.findIndex((step) => step.id === beat.at));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("taps only buttons the game has, the 💧 first among what was said", () => {
    for (const selector of Object.values(TARGET_SELECTORS))
      for (const name of selector.match(/\.pt-[a-z-]+/g) ?? []) expect(play).toMatch(new RegExp(`["\`\\s]${name.slice(1)}(?![\\w-])`));
    expect(SAID[0]).toBe("pipi");
  });

  it("starts with a line and shows each line long enough to read", () => {
    expect(PARENTS_SCRIPT[0].line).toBeDefined();
    for (const beat of PARENTS_SCRIPT) if (beat.line) expect(beat.wait, beat.line.en).toBeGreaterThanOrEqual(2000);
  });

  it("shows a made-up week with stars only before today, never the stored one", () => {
    const today = new Date(2026, 10, 21);
    const log = sampleWeek(today);
    expect(log[dayKey(today)]).toBeUndefined();
    expect(Object.keys(log).length).toBe(weekOf(today).filter((day) => dayKey(day) < dayKey(today)).length);
  });
});
