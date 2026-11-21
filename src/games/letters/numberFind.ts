import type { EnglishFirst } from "@/lib/language";

// „Wo ist die 3?“ (L-17): Zählen's other way to play. Things appear, and the child finds the digit key for how many
// there are. It starts with 1–3 and finds its own pace: quick finds bring bigger numbers, a key it needed the hint for
// brings smaller ones again – never a clock (root CLAUDE.md: harder means more to see, never quicker).

/** The largest number each step asks for: first 1–3, then up to 5, then up to 9. */
export const FIND_REACHES = [3, 5, 9] as const;

/** Rounds in a row found with the first key before the numbers grow. */
export const STEP_UP_AFTER = 3;

/** After this many wrong keys, the wanted key lights up and the question is asked again. */
export const HINT_AFTER_WRONG = 3;

/** How the game stands: which step of `FIND_REACHES`, and how many rounds in a row were found with the first key. */
export type FindPace = { step: number; streak: number };

/** The pace a game starts with: numbers 1–3. */
export const START_PACE: FindPace = { step: 0, streak: 0 };

/**
 * The pace after a round found with `wrong` wrong keys before the right one: the first key `STEP_UP_AFTER` times in a
 * row brings the next step, a round that needed the hint (`HINT_AFTER_WRONG` wrong keys) the step before.
 */
export function nextPace({ step, streak }: FindPace, wrong: number): FindPace {
  if (wrong >= HINT_AFTER_WRONG) return { step: Math.max(0, step - 1), streak: 0 };
  if (wrong > 0) return { step, streak: 0 };
  if (streak + 1 >= STEP_UP_AFTER) return { step: Math.min(FIND_REACHES.length - 1, step + 1), streak: 0 };
  return { step, streak: streak + 1 };
}

/**
 * A number to look for at `step`, never the one just found. Right after a step up, the numbers new to it come first,
 * so the child meets them at once (`fresh`).
 */
export function drawNumber(step: number, last: number | null, fresh = false, random = Math.random): number {
  const reach = FIND_REACHES[step];
  const from = fresh && step > 0 ? FIND_REACHES[step - 1] + 1 : 1;
  const numbers = Array.from({ length: reach - from + 1 }, (_, i) => from + i).filter((n) => n !== last);
  return numbers[Math.floor(random() * numbers.length)];
}

/** The digit a key stands for: its character, or its place (top row or keypad) where the layout puts another sign there. */
export function digitOf(key: string, code: string | undefined): number | null {
  if (/^[0-9]$/.test(key)) return Number(key);
  const place = code?.match(/^(?:Digit|Numpad)([0-9])$/);
  return place ? Number(place[1]) : null;
}

/**
 * The question as a round starts – English first, the other languages when translations are asked for. It names no
 * number: the child counts the things and finds the digit itself. Not recorded yet, it stays silent.
 */
export const NUMBER_FIND_PROMPT: EnglishFirst = { en: "How many? Find the number!" };
