import type { WordEntry } from "./types";

// How a word is cut into the pieces a child types and the card marks, in every script:
// one letter with whatever is written on it. Latin and Cyrillic: a letter (with its accent).
// Hindi: an akshara – a consonant or vowel with its vowel sign and dots (कि, अं), and a
// consonant joined by a virama goes with the next one (ट्र, ङ्खा), so a piece is never
// drawn half. Arabic: a letter; pieces drawn apart keep their joined shape (joinedForms).
// Chinese words are typed and marked by their pinyin (WordEntry.spelling).

/** The Devanagari virama: the consonant before it joins the next one. */
const VIRAMA = "्";
/** Zero-width joiner: makes an Arabic letter take its joined shape when the letter next to it is drawn apart. */
const ZWJ = "‍";

/** The letters a word is typed and marked by: its pinyin for Chinese, else the word itself. */
export const spellingOf = (word: WordEntry) => word.spelling ?? word.word;

/** The word cut into pieces of one letter each, with the marks written on it: "किताब" → कि, ता, ब. */
export function textUnits(text: string): string[] {
  const units: string[] = [];
  for (const char of text.normalize("NFC")) {
    const last = units[units.length - 1];
    if (last !== undefined && (/[\p{M}‌‍]/u.test(char) || last.endsWith(VIRAMA))) units[units.length - 1] = last + char;
    else units.push(char);
  }
  return units;
}

/** The letter a piece is typed with: its first one, "कि" → क, "Á" → Á (keyMatches lets A count for it). */
export const unitKey = (unit: string) => Array.from(unit)[0] ?? unit;

/** Arabic letters that join only to the letter before them, never to the next one (and ء, which joins to none). */
const NOT_TO_NEXT = new Set([..."اأإآٱدذرزوؤةء"]);
const isArabic = (char: string | undefined) => char !== undefined && /\p{Script=Arabic}/u.test(char);
/** Whether two Arabic pieces are joined in the word: the first can reach on to the next, the next can take it. */
const joins = (first: string | undefined, next: string | undefined) => {
  const end = first === undefined ? undefined : Array.from(first).at(-1);
  return isArabic(end) && !NOT_TO_NEXT.has(end ?? "") && isArabic(next?.[0]) && next?.[0] !== "ء";
};

/**
 * The pieces as they are drawn one by one (in their own boxes or colours): an Arabic letter
 * keeps the shape it has inside the word (بـ, ـطـ, ـة) by a zero-width joiner on the joined side.
 * Other scripts stay as they are.
 */
export function joinedForms(units: string[]): string[] {
  return units.map((unit, i) => `${joins(units[i - 1], unit) ? ZWJ : ""}${unit}${joins(unit, units[i + 1]) ? ZWJ : ""}`);
}

/** Whether the text is written right to left (Arabic). */
export const isRightToLeft = (text: string) => /\p{Script=Arabic}/u.test(text);
