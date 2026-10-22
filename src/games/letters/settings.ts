import type { TouchKeysMode } from "@/components/TouchKeyboard";
import type { ThemeId } from "@/content/types";

export type LetterCase = "upper" | "both" | "lower";

/**
 * "free": every key shows its letter or number. "find": a letter is shown and the child looks for its key.
 * "train": every key adds a wagon to a train.
 */
export type LettersMode = "free" | "find" | "train";

/** What is spoken for a letter: "Be, wie Bär!", "Bär!" or "Be!". */
export type Announce = "letterAndWord" | "word" | "letter";

export interface LettersSettings {
  mode: LettersMode;
  /** Find mode: after a few wrong keys, light up the wanted key on a little keyboard picture. */
  hints: boolean;
  letterCase: LetterCase;
  /** With "A a": the big letter holds the small one by the hand, both with eyes. */
  letterFamily: boolean;
  /** The capital turns into its animal for a moment: S slithers as a snake, M gets mouse ears. */
  livingLetters: boolean;
  /** The letter as big dots to trace with a finger or the mouse; stars appear along the way. */
  trace: boolean;
  /** Show the word under the picture, with its first letter highlighted. */
  showWord: boolean;
  /** Speak letters/words and count numbers aloud. */
  speech: boolean;
  announce: Announce;
  /** Prefer words and countables from this theme; letters without one fall back to all words. */
  theme: "all" | ThemeId;
  /** Chimes and notes. */
  sounds: boolean;
  /** Quieter sounds, no wiggling, softer shapes. */
  calm: boolean;
  /** Reveal number items one click at a time; each click on a letter brings its next word. */
  stepByStep: boolean;
  /** Numbers: the child taps every thing to count it; the digit appears after the last one. */
  countByTap: boolean;
  /** Automatic mode only: ignore new letters/numbers until counting has finished. */
  finishCounting: boolean;
  /** Big letter keys on the screen, for tablets without a keyboard. */
  touchKeys: TouchKeysMode;
}

export const DEFAULT_LETTERS_SETTINGS: LettersSettings = {
  mode: "free",
  hints: true,
  letterCase: "upper",
  letterFamily: true,
  livingLetters: true,
  trace: false,
  showWord: true,
  speech: false,
  announce: "letterAndWord",
  theme: "all",
  sounds: true,
  calm: false,
  stepByStep: true,
  countByTap: false,
  finishCounting: true,
  touchKeys: "auto",
};

// v2: speech is off by default now, so old saved settings start fresh.
export const LETTERS_SETTINGS_KEY = "tinytaps.letters.v2";
