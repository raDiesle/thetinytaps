import type { TouchKeysMode } from "@/components/TouchKeyboard";
import type { ThemeId } from "@/content/types";

export type LetterCase = "upper" | "both" | "lower";

/**
 * "free": every key shows its letter or number (with `numbersOnly` only numbers). "words": a picture's word is typed
 * letter by letter, or with `wordTyping: "first"` a letter is shown and the child looks for its key („Wo ist das B?“).
 */
export type LettersMode = "free" | "words";

/** Which words „Wörter tippen“ plays: picture words, colour words, doing words, or all of them mixed. */
export type WordKind = "nouns" | "all" | "colors" | "actions";

/** „Wörter tippen“: type the whole word, or find the key of the first letter („Wo ist das B?“). */
export type WordTyping = "spell" | "first";

/** The longest picture word „Wörter tippen“ asks for, in letters; shown as that number on the start screen. */
export type WordLength = "3" | "4" | "7";

/**
 * How a number comes in. "all": the things and the digit at once. "count": the things pop in
 * one by one while being counted aloud, then the digit. "step": each click shows the next thing,
 * and each click on a letter brings its next word. "tap": the child taps every thing to count it;
 * the digit appears after the last one.
 */
export type NumberReveal = "all" | "count" | "step" | "tap";

/** What is spoken for a letter: "Be, wie Bär!", "Bär!" or "Be!". */
export type Announce = "letterAndWord" | "word" | "letter";

export interface LettersSettings {
  mode: LettersMode;
  /** „Wo ist das B?“: after a few wrong keys, light up the wanted key on a little keyboard picture. */
  hints: boolean;
  letterCase: LetterCase;
  /** With "A a": the big letter holds the small one by the hand, both with eyes. */
  letterFamily: boolean;
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
  /** How a number comes in, see NumberReveal. */
  numbers: NumberReveal;
  /** "count" only: ignore new letters/numbers until counting has finished. */
  finishCounting: boolean;
  /** Frei tippen with numbers only (Zählen): any key that is no digit and has no meaning of its own brings a number. */
  numbersOnly: boolean;
  /** "all" and "count": a number shows its things first, its digit only when the same number is pressed again. */
  digitOnRepeat: boolean;
  /** Big letter keys on the screen, for tablets without a keyboard. */
  touchKeys: TouchKeysMode;
  /** „Wörter tippen“: which words. */
  wordKind: WordKind;
  /** „Wörter tippen“: whole word, or the first letter's key („Wo ist das B?“). */
  wordTyping: WordTyping;
  /** „Wörter tippen“: the longest picture word; colour and doing words are short fixed lists and always all play. */
  wordLength: WordLength;
}

export const DEFAULT_LETTERS_SETTINGS: LettersSettings = {
  mode: "free",
  hints: true,
  letterCase: "upper",
  letterFamily: true,
  trace: false,
  showWord: true,
  speech: false,
  announce: "letterAndWord",
  theme: "all",
  sounds: true,
  numbers: "all",
  finishCounting: true,
  numbersOnly: false,
  digitOnRepeat: false,
  touchKeys: "auto",
  wordKind: "nouns",
  wordTyping: "spell",
  wordLength: "4",
};

// v2: speech is off by default now, so old saved settings start fresh.
export const LETTERS_SETTINGS_KEY = "tinytaps.letters.v2";

/**
 * Settings saved while Zählen and „Wo ist das B?“ were ways to play of their own: now they are Frei tippen with
 * `numbersOnly` and Wörter tippen's first letter. Returns the change to save, or null when there is none.
 */
export function upgradeLegacyMode(settings: LettersSettings): Partial<LettersSettings> | null {
  const mode: string = settings.mode;
  if (mode === "count") return { mode: "free", numbersOnly: true };
  if (mode === "find") return { mode: "words", wordTyping: "first" };
  if (mode !== "free" && mode !== "words") return { mode: "free" };
  return null;
}
