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
  /**
   * The letters the word is typed and marked by, where they are not the written word itself: Chinese pinyin
   * with its tone marks ("bàba" for 爸爸), shown under the characters. Without it the word's own letters count.
   */
  spelling?: string;
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
  /**
   * No word starts with this letter (Russian Ъ, Ы, Ь): its words have it inside ("сыр"),
   * the card marks it there instead of the first letter, and the sentence says so.
   */
  inWord?: boolean;
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

/** What the games read of a key event. */
export type KeyPress = Pick<KeyboardEvent, "key" | "code"> & { shiftKey?: boolean };

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
  /**
   * For a script most keyboards don't print (Russian, Hindi, Arabic): the letter at the pressed key's
   * place, so any keyboard types it (Q = Й). Without it the key's own letter counts.
   */
  letterOfKey?: (e: KeyPress) => string | undefined;
  /**
   * For a keyboard where Shift gives a second letter on a key (Hindi K = क, Shift+K = ख): whether `key`
   * is the other letter of `letter`'s key. Then it counts for `letter` too – a toddler doesn't hold Shift.
   */
  sameKey?: (key: string, letter: string) => boolean;
  /** The letter of the examples on start screens („Be, wie Bär“); "B" when left out (Russian: Б). */
  exampleLetter?: string;
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
}
