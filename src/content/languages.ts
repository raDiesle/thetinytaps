import { de } from "./de";
import { en } from "./en";
import { pl } from "./pl";
import { ru } from "./ru";
import type { LanguagePack, LetterEntry } from "./types";
import { tr } from "./tr";

export type LanguageId = "de" | "en" | "tr" | "pl" | "ru";

export interface Language {
  id: LanguageId;
  /** For German start screens: "🇺🇸 Englisch". */
  label: string;
  /** For Russian start screens: "🇺🇸 Английский". */
  russian: string;
  /** "Dieser Browser hat keine englische Stimme". */
  adjective: string;
  pack: LanguagePack;
}

/** Languages of the letters and words games; the home page's play language may also be one without a pack (`LanguageSetting.tsx`). */
export const LANGUAGES: Language[] = [
  { id: "de", label: "🇩🇪 Deutsch", russian: "🇩🇪 Немецкий", adjective: "deutsche", pack: de },
  { id: "en", label: "🇺🇸 Englisch", russian: "🇺🇸 Английский", adjective: "englische", pack: en },
  { id: "tr", label: "🇹🇷 Türkisch", russian: "🇹🇷 Турецкий", adjective: "türkische", pack: tr },
  { id: "pl", label: "🇵🇱 Polnisch", russian: "🇵🇱 Польский", adjective: "polnische", pack: pl },
  { id: "ru", label: "🇷🇺 Russisch", russian: "🇷🇺 Русский", adjective: "russische", pack: ru },
];

/** The language's name on screens in the app language: "🇷🇺 Russisch" on German ones, "🇷🇺 Русский" on Russian ones. */
export const languageName = (language: Language, appLanguageId: string) => (appLanguageId === "ru" ? language.russian : language.label);

/** The language with this id; German for anything unknown, e.g. an old saved setting. */
export const languageFor = (id: string) => LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];

export const toUpper = (text: string, pack: LanguagePack) => text.toLocaleUpperCase(pack.speechLang);
export const toLower = (text: string, pack: LanguagePack) => text.toLocaleLowerCase(pack.speechLang);

/** Letters without accents that NFD can't take apart, and Й, which is a letter and key of its own, not an И. */
const BASE_LETTERS: Record<string, string> = { Ł: "L", Й: "Й" };

/** "Ä" → "A", "Ş" → "S", "İ" → "I", "Ł" → "L", "Ё" → "Е". */
const base = (upper: string) => BASE_LETTERS[upper] ?? upper.normalize("NFD")[0];

/**
 * What a pressed key types in `pack`'s language: for Russian the letter at the
 * key's place (Q = Й, also on a German keyboard), otherwise the key itself.
 * The games pass every key event through this before looking at the key.
 */
export const keyOf = (e: Pick<KeyboardEvent, "key" | "code">, pack: LanguagePack) => pack.letterOfKey?.(e) ?? e.key;

/**
 * Whether `key` types `letter`, ignoring case. Accents don't count, so
 * keyboards without umlauts, Ş or Ł work too, the "i" key also finds the
 * Turkish dotless I, and Е finds Ё (its key, left of 1, is missing on many keyboards).
 */
export function keyMatches(key: string, letter: string, pack: LanguagePack) {
  if (key.length !== 1) return false;
  const k = toUpper(key, pack);
  const l = toUpper(letter, pack);
  return k === l || base(k) === base(l);
}

/** The letter for B (Russian Б), for examples on the start screen ("Be, wie Bär!"). */
export const sampleLetter = (pack: LanguagePack): LetterEntry => pack.letters.find((l) => l.upper === "B" || l.upper === "Б") ?? pack.letters[0];
