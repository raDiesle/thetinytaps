import type { TouchKeysMode } from "@/components/TouchKeyboard";
import type { ThemeId } from "@/content/types";

/** "BÄR", "Bär" or "bär". */
export type WordCase = "upper" | "word" | "lower";

export type WordLength = "short" | "medium" | "long";

/**
 * "spell": type the whole word. "first": only the first letter, the rest flies in by itself.
 * "colors": colour words that colour the screen. "actions": doing words that a figure acts out.
 */
export type WordsMode = "spell" | "first" | "colors" | "actions";

/** "now": picture from the start as a hint. "puzzle": every letter uncovers a piece. "end": only when done. */
export type PictureReveal = "now" | "puzzle" | "end";

/** Longest word per length setting. */
export const MAX_LETTERS: Record<WordLength, number> = { short: 3, medium: 4, long: 7 };

export interface WordsSettings {
  mode: WordsMode;
  letterCase: WordCase;
  length: WordLength;
  /** Prefer words from this theme; falls back to all words if none fit. */
  theme: "all" | ThemeId;
  /** When the picture shows; the "first" mode always shows it, it is the only clue there. */
  picture: PictureReveal;
  /** Every key types the next letter, for children who can't find keys yet. */
  anyKey: boolean;
  /** Speak the word, each typed letter and a cheer at the end. */
  speech: boolean;
  /** Notes and chimes. */
  sounds: boolean;
  /** Quieter sounds, no wiggling, softer shapes. */
  calm: boolean;
  /** Big letter keys on the screen, for tablets without a keyboard. */
  touchKeys: TouchKeysMode;
}

export const DEFAULT_WORDS_SETTINGS: WordsSettings = {
  mode: "spell",
  letterCase: "upper",
  length: "medium",
  theme: "all",
  picture: "now",
  anyKey: false,
  speech: false,
  sounds: true,
  calm: false,
  touchKeys: "auto",
};

// v2: speech is off by default now, so old saved settings start fresh.
export const WORDS_SETTINGS_KEY = "tinytaps.words.v2";
