import { useAppLanguage } from "@/lib/language";
import { de } from "./de";
import { byLanguage } from "./texts";
import { spellingOf, textUnits, unitKey } from "./spelling";
import type { KeyPress, LanguagePack, LetterEntry, WordEntry } from "./types";

export type LanguageId = "de" | "en" | "tr" | "pl" | "ru" | "es" | "zh" | "hi" | "ar";

export interface Language {
  id: LanguageId;
  /** For German start screens: "🇺🇸 Englisch". */
  label: string;
  /** Its pack: German until the language's texts are loaded (`loadTexts`), so no screen ever waits for one. */
  readonly pack: LanguagePack;
}

/** The packs besides German, as their languages load (src/content/texts). */
const PACKS = byLanguage((texts) => texts.pack);

const language = (id: LanguageId, label: string): Language => ({
  id,
  label,
  get pack() {
    return (id === "de" ? undefined : PACKS[id]) ?? de;
  },
});

/** Language packs of the letters and words games; they play in the pack of the app language (`useLanguagePack`). */
export const LANGUAGES: Language[] = [
  language("de", "🇩🇪 Deutsch"),
  language("en", "🇺🇸 Englisch"),
  language("tr", "🇹🇷 Türkisch"),
  language("pl", "🇵🇱 Polnisch"),
  language("ru", "🇷🇺 Russisch"),
  language("es", "🇪🇸 Spanisch"),
  language("zh", "🇨🇳 Chinesisch"),
  language("hi", "🇮🇳 Hindi"),
  language("ar", "🇸🇦 Arabisch"),
];

/** The language with this id; German for anything unknown, e.g. an old saved setting. */
export const languageFor = (id: string) => LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];

/**
 * The pack the letters and words games play in: the one of the app language (🌐), so letters, words and voice
 * are always in the language of the menus, never another one next to it.
 */
export const useLanguagePack = () => languageFor(useAppLanguage().id).pack;

export const toUpper = (text: string, pack: LanguagePack) => text.toLocaleUpperCase(pack.speechLang);
export const toLower = (text: string, pack: LanguagePack) => text.toLocaleLowerCase(pack.speechLang);

/**
 * Letters without accents that NFD can't take apart, Й, which is a letter and key of its own, not an И,
 * and the Arabic forms written with a letter of the alphabet (ة with ت, ى with ي, ء on the alif key).
 */
const BASE_LETTERS: Record<string, string> = { Ł: "L", Й: "Й", ة: "ت", ى: "ي", ء: "ا" };

/** "Ä" → "A", "Ş" → "S", "İ" → "I", "Ł" → "L", "Ё" → "Е", "أ" → "ا", "ड़" → "ड". */
const base = (upper: string) => BASE_LETTERS[upper] ?? upper.normalize("NFD")[0];

/**
 * What a pressed key types in `pack`'s language: for Russian, Hindi and Arabic the letter at the
 * key's place (Q = Й, also on a German keyboard), otherwise the key itself.
 * The games pass every key event through this before looking at the key.
 */
export const keyOf = (e: KeyPress, pack: LanguagePack) => pack.letterOfKey?.(e) ?? e.key;

/**
 * Whether `key` types `letter`, ignoring case. Accents and marks don't count, so
 * keyboards without umlauts, Ş or Ł work too, the "i" key also finds the
 * Turkish dotless I, Е finds Ё (its key, left of 1, is missing on many keyboards),
 * the alif key finds أ and إ, and in Hindi a key counts for both its letters (क, ख).
 */
export function keyMatches(key: string, letter: string, pack: LanguagePack) {
  if (Array.from(key).length !== 1) return false;
  const k = toUpper(key, pack);
  const l = toUpper(letter, pack);
  return k === l || base(k) === base(l) || !!pack.sameKey?.(base(k), base(l));
}

/** Whether the pack's letters have a small form (A a, Б б); Hindi, Arabic have one form only. */
export const hasCase = (pack: LanguagePack) => pack.letters.some((l) => l.upper !== l.lower);

/** Whether the pack's script runs right to left (Arabic). */
export const isRightToLeftPack = (pack: LanguagePack) => /\p{Script=Arabic}/u.test(pack.letters[0]?.upper ?? "");

/** The letter of the examples on the start screen ("Be, wie Bär!"): B, Russian Б, or the pack's own (Hindi क). */
export const sampleLetter = (pack: LanguagePack): LetterEntry =>
  pack.letters.find((l) => l.upper === (pack.exampleLetter ?? "B") || l.upper === "Б") ?? pack.letters[0];

/**
 * Where `letter` is in `word`, counted in its pieces (textUnits of its spelling): 0 when the word starts with it,
 * further in for a letter no word starts with (Russian Ы in "Сыр"), -1 when it isn't there. Only the letter
 * itself or its plain form counts (أ for ا, Á for A), not another letter on its key: Ñ is not in "Nube".
 */
export function letterIndex(word: WordEntry, letter: LetterEntry, pack: LanguagePack): number {
  const units = textUnits(spellingOf(word));
  const isLetter = (unit: string) => {
    const k = toUpper(unitKey(unit), pack);
    return k === letter.upper || base(k) === letter.upper;
  };
  if (!letter.inWord) return units.length > 0 && isLetter(units[0]) ? 0 : -1;
  return units.findIndex((unit, i) => i > 0 && isLetter(unit));
}
