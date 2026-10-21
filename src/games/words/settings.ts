import type { ThemeId } from "@/content/types";

/** "BÄR", "Bär" or "bär". */
export type WordCase = "upper" | "word" | "lower";

export type WordLength = "short" | "medium" | "long";

/** Longest word per length setting. */
export const MAX_LETTERS: Record<WordLength, number> = { short: 3, medium: 4, long: 7 };

export interface WordsSettings {
  letterCase: WordCase;
  length: WordLength;
  /** Prefer words from this theme; falls back to all words if none fit. */
  theme: "all" | ThemeId;
  /** Show the picture from the start as a hint, instead of only when the word is done. */
  showPicture: boolean;
  /** Every key types the next letter, for children who can't find keys yet. */
  anyKey: boolean;
  /** Speak the word, each typed letter and a cheer at the end. */
  speech: boolean;
  /** Notes and chimes. */
  sounds: boolean;
  /** Quieter sounds, no wiggling, softer shapes. */
  calm: boolean;
}

export const DEFAULT_WORDS_SETTINGS: WordsSettings = {
  letterCase: "upper",
  length: "medium",
  theme: "all",
  showPicture: true,
  anyKey: false,
  speech: false,
  sounds: true,
  calm: false,
};

// v2: speech is off by default now, so old saved settings start fresh.
export const WORDS_SETTINGS_KEY = "tinytaps.words.v2";
