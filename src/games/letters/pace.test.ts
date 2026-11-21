import { readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { REPEAT_PAUSE_MS } from "@/lib/spacing";
import { MIN_CHANGE_MS, SAME_KEY_PAUSE_MS } from "./pace";
import { SURPRISE } from "./Surprises";

// Frei tippen answered a new key only after a second and the same key after three, which felt as if presses were lost
// (user feedback, November 2026). The gates stay short enough that every deliberate press answers.

test("a new letter, number or surprise comes quickly", () => {
  expect(MIN_CHANGE_MS).toBeLessThanOrEqual(300);
  expect(SURPRISE.gapMs).toBeLessThanOrEqual(300);
});

test("the same key again waits less than elsewhere, but still waits", () => {
  expect(SAME_KEY_PAUSE_MS).toBeLessThan(REPEAT_PAUSE_MS);
  expect(SAME_KEY_PAUSE_MS).toBeGreaterThanOrEqual(1000);
});

test("Space and Enter open a surprise in Frei tippen, their own effect only when none can come", () => {
  const play = readFileSync("src/games/letters/LettersPlay.tsx", "utf8");
  expect(play).toContain(`if ((key === " " || key === "Enter") && !numbersOnly && trySurprise()) return true;`);
});
