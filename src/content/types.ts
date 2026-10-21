/** A word that starts with a given letter, with its picture. */
export interface WordEntry {
  word: string;
  /** Emoji used as the picture. Also the fallback when `image` is set. */
  emoji: string;
  /** Optional illustration in /public, used instead of the emoji. */
  image?: string;
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
}

export interface LanguagePack {
  /** BCP-47 tag used for speech synthesis, e.g. "de-DE". */
  speechLang: string;
  letters: LetterEntry[];
  /** Spoken number words for 0–9. */
  numberWords: string[];
  countables: Countable[];
  /** Shown for 0. */
  zero: { emoji: string; sentence: string };
  /** "A wie Affe" */
  letterSentence: (letter: LetterEntry, word: WordEntry) => string;
  /** "drei Äpfel" / "ein Apfel" */
  countSentence: (n: number, thing: Countable) => string;
}
