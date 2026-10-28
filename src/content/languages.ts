import { useAppLanguage } from "@/lib/language";
import { ar } from "./ar";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { hi } from "./hi";
import { pl } from "./pl";
import { ru } from "./ru";
import { spellingOf, textUnits, unitKey } from "./spelling";
import type { KeyPress, LanguagePack, LetterEntry, WordEntry } from "./types";
import { tr } from "./tr";
import { zh } from "./zh";

export type LanguageId = "de" | "en" | "tr" | "pl" | "ru" | "es" | "zh" | "hi" | "ar";

export interface Language {
  id: LanguageId;
  /** For German start screens: "🇺🇸 Englisch". */
  label: string;
  pack: LanguagePack;
}

/** Language packs of the letters and words games; they play in the pack of the app language (`useLanguagePack`). */
export const LANGUAGES: Language[] = [
  { id: "de", label: "🇩🇪 Deutsch", pack: de },
  { id: "en", label: "🇺🇸 Englisch", pack: en },
  { id: "tr", label: "🇹🇷 Türkisch", pack: tr },
  { id: "pl", label: "🇵🇱 Polnisch", pack: pl },
  { id: "ru", label: "🇷🇺 Russisch", pack: ru },
  { id: "es", label: "🇪🇸 Spanisch", pack: es },
  { id: "zh", label: "🇨🇳 Chinesisch", pack: zh },
  { id: "hi", label: "🇮🇳 Hindi", pack: hi },
  { id: "ar", label: "🇸🇦 Arabisch", pack: ar },
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
