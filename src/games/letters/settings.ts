import type { ThemeId } from "@/content/types";

export type LetterCase = "upper" | "both" | "lower";

/** What is spoken for a letter: "Be, wie Bär!", "Bär!" or "Be!". */
export type Announce = "letterAndWord" | "word" | "letter";

export interface LettersSettings {
  letterCase: LetterCase;
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
  /** Ignore new letters/numbers until counting has finished. */
  finishCounting: boolean;
}

export const DEFAULT_LETTERS_SETTINGS: LettersSettings = {
  letterCase: "upper",
  showWord: true,
  speech: true,
  announce: "letterAndWord",
  theme: "all",
  sounds: true,
  calm: false,
  finishCounting: true,
};

export const LETTERS_SETTINGS_KEY = "tinytaps.letters.v1";
