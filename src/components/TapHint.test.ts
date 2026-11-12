import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { Glob } from "bun";
import { TAP_HINT_STAGES_MS } from "./TapHint";

// What a child taps to go on is marked by the one shared TapHint, a golden ring and a drawn hand that get clearer the
// longer the child waits (user feedback, November 2026: the still 👆 and yellow ring of Kettenreaktion and Kleine
// Abenteuer were too plain and looked poor).

describe("TapHint", () => {
  test("its stages come one after the other, the first after a few seconds", () => {
    expect(TAP_HINT_STAGES_MS[0]).toBeGreaterThanOrEqual(2000);
    for (let i = 1; i < TAP_HINT_STAGES_MS.length; i++) expect(TAP_HINT_STAGES_MS[i]).toBeGreaterThan(TAP_HINT_STAGES_MS[i - 1]);
  });

  test("the games that use it point with its drawn hand, never with an emoji finger", () => {
    const files = [
      ...new Glob("src/games/marbles/*.tsx").scanSync("."),
      ...new Glob("src/games/elevator/film/*.tsx").scanSync("."),
      // The start screen's choice „👆 Kind tippt“ is a label, not a hint.
    ].filter((file) => !file.endsWith("MarbleGame.tsx"));
    expect(files.length).toBeGreaterThan(10);
    const fingers = files.filter((file) => /[👆👇👈👉☝]/u.test(readFileSync(file, "utf8")));
    expect(fingers).toEqual([]);
  });
});
