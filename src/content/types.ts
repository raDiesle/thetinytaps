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

/** A colour to type; when it is done the screen turns that colour and things of that colour hop in. */
export interface ColorWord extends WordEntry {
  /** CSS colour for the screen and the letters. */
  color: string;
  /** Emojis of things in that colour. */
  things: string[];
}

/** How the figure of a doing word moves once the word is done; see `.act-*` in globals.css. */
export type Action = "hop" | "run" | "sleep" | "dance" | "wave" | "spin" | "fly" | "swim" | "clap";

/** A doing word ("HÜPF"); once typed, its figure does it. */
export interface ActionWord extends WordEntry {
  action: Action;
}

/** Something that can be shown N times for the number keys. */
export interface Countable {
  emoji: string;
  singular: string;
  plural: string;
  theme?: ThemeId;
}

export interface LanguagePack {
  /** BCP-47 tag used for speech synthesis and for upper/lower case ("i" is "İ" in Turkish), e.g. "de-DE". */
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
  /** "Womit fängt Bär an?", asked when only the first letter is to be typed. */
  firstLetterPrompt: (word: WordEntry) => string;
  /** Colour words for the colour game. */
  colors: ColorWord[];
  /** Doing words that a figure acts out. */
  actions: ActionWord[];
  /** "Hüpf mit!", the invitation to join in once the figure acts. */
  joinIn: (word: ActionWord) => string;
  /** "Tschu-tschu!", said when the letter train leaves. */
  whistle: string;
  /**
   * Words by emoji for pictures that only other languages have (🐊 is no
   * German letter word), so a second language can always say what is shown.
   */
  moreWords?: Record<string, string>;
}
