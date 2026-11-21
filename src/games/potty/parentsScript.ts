import { dayKey, weekOf } from "@/lib/days";
import type { EnglishFirst } from "@/lib/language";
import type { StepId } from "./content";
import type { StarLog } from "./stars";

// The parents' video of Aufs Töpfchen (idea Y-29): the real game on a drawn tablet, a grown-up's drawn hand tapping
// through it after a fixed script, and a short line for the grown-ups beside the tablet at every part. For YouTube as a
// video for grown-ups („not made for kids“), so it may end on a slate with the address, under YouTube's end screen.

/** What the hand taps in the game: its button for that, found by its class (PottyPlay.tsx). */
export type HandTarget = "next" | "said-pipi" | "pause" | "check-pipi";

/** The button of each target (the first of its kind: the 💧 comes first among what was said and among the ✓). */
export const TARGET_SELECTORS: Record<HandTarget, string> = {
  next: ".pt-next",
  "said-pipi": ".pt-said",
  pause: ".pt-pause",
  "check-pipi": ".pt-finish:not(.pt-nothing)",
};

/** One beat of the script: once the story is at `at`, its line shows, and `wait` ms later the hand taps `tap`. */
export interface Beat {
  /** The step the beat waits for (PottyPlay's root carries `pt-at-<step>`). */
  at: StepId;
  /** How long the picture is looked at, from the step's start (or the beat before), before the hand has tapped. */
  wait: number;
  /** The button the hand taps at the end of the beat; none: the beat only waits (the last one, on the stars). */
  tap?: HandTarget;
  /** The line for grown-ups beside the tablet from this beat on; none keeps the line before. */
  line?: EnglishFirst;
}

/**
 * The parents' video, about a minute and a half: the story starts at once, the hand taps on, picks what the child said,
 * lets Tapsi sit with the song and the thoughts, pauses and goes on, taps the ✓ of what came, and goes on to the week's
 * star. Lines for grown-ups, short enough to read while the picture plays (English first, root CLAUDE.md).
 */
export const PARENTS_SCRIPT: Beat[] = [
  { at: "eat", wait: 5500, tap: "next", line: { en: "Your child has to go? Open Potty Time – the story starts at once." } },
  { at: "need", wait: 4500, tap: "next", line: { en: "Tapsi the fox has to go too. One tap on the picture or ▶ goes on." } },
  { at: "call", wait: 5500, tap: "said-pipi", line: { en: "Tapsi calls Mama and Papa. You tap what your child said: pee, poop or both." } },
  { at: "go", wait: 4000, tap: "next", line: { en: "Off to the bathroom together – at your child's pace." } },
  { at: "down", wait: 4500, tap: "next", line: { en: "Trousers down. Your child does it too, Tapsi shows how." } },
  { at: "sit", wait: 18000, tap: "pause", line: { en: "While your child sits, a song plays and Tapsi thinks of things that help to let go." } },
  { at: "sit", wait: 4500, tap: "pause", line: { en: "Need a moment? The waiting pauses and goes on where it stopped." } },
  { at: "sit", wait: 8000, tap: "check-pipi", line: { en: "Something came? Tap the ✓ of what is really in the potty – or “nothing”." } },
  { at: "wipe", wait: 2600, tap: "next", line: { en: "Wipe, trousers up, flush, wash hands – one tap for each." } },
  { at: "up", wait: 2200, tap: "next" },
  { at: "flush", wait: 3200, tap: "next" },
  { at: "wash", wait: 3200, tap: "next" },
  { at: "party", wait: 3200, tap: "next" },
  { at: "stars", wait: 6500, line: { en: "A star for this week – only for what really came." } },
];

/** The slate at the end, under YouTube's end screen (which may stand 5 to 20 s): the name and the game's address. */
export const END_SLATE_MS = 15_000;

/** How long the hand takes to come to a button from below the picture; it comes that long before its tap. */
export const HAND_IN_MS = 900;
/** How long a finger rests on the button. */
export const PRESS_MS = 220;

/** The video's length without the waits that follow the game (its steps' own pauses): for the check that it stays 1–2 minutes. */
export const scriptMs = (script: Beat[] = PARENTS_SCRIPT) => script.reduce((sum, beat) => sum + beat.wait + (beat.tap ? PRESS_MS : 0), 0) + END_SLATE_MS;

/**
 * The week shown at the end: a star or two on every day before today, as a family a few days into potty training would
 * have, so the new star lands on a filled week. Never the stored week of whoever records.
 */
export function sampleWeek(today: Date): StarLog {
  const log: StarLog = {};
  for (const [i, day] of weekOf(today).entries()) {
    if (dayKey(day) >= dayKey(today)) break;
    log[dayKey(day)] = i % 3 === 1 ? 2 : 1;
  }
  return log;
}
