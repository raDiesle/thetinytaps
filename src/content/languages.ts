import { de } from "./de";
import { en } from "./en";
import { pl } from "./pl";
import type { LanguagePack, LetterEntry } from "./types";
import { tr } from "./tr";

export type LanguageId = "de" | "en" | "tr" | "pl";

export interface Language {
  id: LanguageId;
  /** For the (German) start screen: "🇺🇸 Englisch". */
  label: string;
  /** "Dieser Browser hat keine englische Stimme". */
  adjective: string;
  pack: LanguagePack;
}

/** Languages of the letters and words games; the other games are German only. */
export const LANGUAGES: Language[] = [
  { id: "de", label: "🇩🇪 Deutsch", adjective: "deutsche", pack: de },
  { id: "en", label: "🇺🇸 Englisch", adjective: "englische", pack: en },
  { id: "tr", label: "🇹🇷 Türkisch", adjective: "türkische", pack: tr },
  { id: "pl", label: "🇵🇱 Polnisch", adjective: "polnische", pack: pl },
];

/** The language with this id; German for anything unknown, e.g. an old saved setting. */
export const languageFor = (id: string) => LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];

export const toUpper = (text: string, pack: LanguagePack) => text.toLocaleUpperCase(pack.speechLang);
export const toLower = (text: string, pack: LanguagePack) => text.toLocaleLowerCase(pack.speechLang);

/** Letters without accents that NFD can't take apart. */
const BASE_LETTERS: Record<string, string> = { Ł: "L" };

/** "Ä" → "A", "Ş" → "S", "İ" → "I", "Ł" → "L". */
const base = (upper: string) => BASE_LETTERS[upper] ?? upper.normalize("NFD")[0];

/**
 * Whether `key` types `letter`, ignoring case. Accents don't count, so
 * keyboards without umlauts, Ş or Ł work too, and the "i" key also finds the
 * Turkish dotless I.
 */
export function keyMatches(key: string, letter: string, pack: LanguagePack) {
  if (key.length !== 1) return false;
  const k = toUpper(key, pack);
  const l = toUpper(letter, pack);
  return k === l || base(k) === base(l);
}

/** The letter for B, for examples on the start screen ("Be, wie Bär!"). */
export const sampleLetter = (pack: LanguagePack): LetterEntry => pack.letters.find((l) => l.upper === "B") ?? pack.letters[0];
