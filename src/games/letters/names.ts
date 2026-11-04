import type { Localized } from "@/lib/language";

// The names of the book's four games and their lines in its table of contents, kept here rather than in `games.ts`:
// what is new comes German only, so the games' own rows in the language table say it is missing (`inlineTexts.test.ts`).

/** The four games of the book „Buchstaben & Zahlen“, each on a page of its own (user feedback, November 2026). */
export type LettersWay = "free" | "count" | "move" | "words";

/** Frei tippen: every key shows its letter or number. */
export const FREE_TITLE: Localized = {
  de: "Frei tippen",
  ru: "Печатать что хочешь",
  en: "Free typing",
  zh: "随便按",
  hi: "आज़ाद टाइपिंग",
  es: "Teclear libre",
  ar: "كتابة حرة",
};

/** Its line in the book's table of contents. */
export const FREE_BLURB: Localized = { de: "Jede Taste zeigt Buchstabe, Bild und Wort" };

/** Zählen: only numbers come, with things to count. */
export const COUNT_TITLE: Localized = { de: "Zählen" };

/** Its line in the book's table of contents. */
export const COUNT_BLURB: Localized = { de: "Zahlen mit Dingen zum Zählen" };

/** Mitmachen: a number is hopped, clapped or stamped as often as it says, counted aloud, and the child joins in (L-15). */
export const MOVE_TITLE: Localized = { de: "Mitmachen" };

/** Its line in the book's table of contents. */
export const MOVE_BLURB: Localized = { de: "Zahlen hüpfen, klatschen und stampfen" };

/** Wörter tippen: a picture's word letter by letter, or the first letter's key („Wo ist das B?“). */
export const WORDS_TITLE: Localized = {
  de: "Wörter tippen",
  ru: "Печатаем слова",
  en: "Typing words",
  zh: "拼词语",
  hi: "शब्द टाइपिंग",
  es: "Escribir palabras",
  ar: "كتابة كلمات",
};

/** Its line in the book's table of contents. */
export const WORDS_BLURB: Localized = { de: "Erste Wörter und Buchstaben suchen" };

/** Each game's name, by the way it plays. */
export const WAY_TITLES: Record<LettersWay, Localized> = { free: FREE_TITLE, count: COUNT_TITLE, move: MOVE_TITLE, words: WORDS_TITLE };
