/** Language-independent theme ids; labels live in the language pack. */
export type ThemeId = "animals" | "vehicles" | "food" | "body" | "clothes" | "family" | "music" | "nature" | "holidays";

export interface Theme {
  id: ThemeId;
  label: string;
  emoji: string;
}

/** A word that starts with a given letter, with its picture. */
export interface WordEntry {
  word: string;
  /** Emoji used as the picture. Also the fallback when `image` is set. */
  emoji: string;
  /** Optional illustration in /public, used instead of the emoji. */
  image?: string;
  theme?: ThemeId;
}

export interface LetterEntry {
  /** Upper-case form, e.g. "A". */
  upper: string;
  /** Lower-case form, e.g. "a". */
  lower: string;
  /** How the letter name should be spoken, e.g. "Be" for B. */
  spoken: string;
  /** Words starting with this letter; cycled through on repeated presses. */
  words: WordEntry[];
}

/** Something that can be shown N times for the number keys. */
export interface Countable {
  emoji: string;
  singular: string;
  plural: string;
  theme?: ThemeId;
}

export interface LanguagePack {
  /** BCP-47 tag used for speech synthesis, e.g. "de-DE". */
  speechLang: string;
  themes: Theme[];
  letters: LetterEntry[];
  /** Spoken number words for 0–9. */
  numberWords: string[];
  countables: Countable[];
  /** Shown for 0; the sentence is spoken when the empty picture appears. */
  zero: { emoji: string; sentence: string };
  /** "A wie Affe" */
  letterSentence: (letter: LetterEntry, word: WordEntry) => string;
  /** "Wo ist das Be?", asked when a letter is to be found on the keyboard. */
  findPrompt: (letter: LetterEntry) => string;
  /** The keyboard as printed on the keys, one string per row from the top. */
  keyboardRows: string[];
  /** "drei Äpfel" / "ein Apfel" */
  countSentence: (n: number, thing: Countable) => string;
  /** Short cheers, one is picked when a word has been typed. */
  praise: string[];
}
