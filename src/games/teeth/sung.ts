import type { Localized } from "@/lib/language";
import { playLanguage } from "@/lib/locale";

// The sung brushing songs: musik/musik-zaehneputzen-lied-<lang>.mp3, one per language,
// with a .json of the same name saying where each verse begins. A new language needs
// only these two files (`yarn song:verses` makes both, see the /zahnputzlied skill) and,
// if missing here, a name in SUNG_LABELS.

/** Names of the languages a brushing song can be sung in, for the settings, in German and Russian (the app's languages). */
export const SUNG_LABELS: Record<string, Localized> = {
  de: { de: "🇩🇪 Deutsch", ru: "🇩🇪 Немецкий" },
  en: { de: "🇬🇧 Englisch", ru: "🇬🇧 Английский" },
  tr: { de: "🇹🇷 Türkisch", ru: "🇹🇷 Турецкий" },
  pl: { de: "🇵🇱 Polnisch", ru: "🇵🇱 Польский" },
  fr: { de: "🇫🇷 Französisch", ru: "🇫🇷 Французский" },
  es: { de: "🇪🇸 Spanisch", ru: "🇪🇸 Испанский" },
  it: { de: "🇮🇹 Italienisch", ru: "🇮🇹 Итальянский" },
  nl: { de: "🇳🇱 Niederländisch", ru: "🇳🇱 Нидерландский" },
  uk: { de: "🇺🇦 Ukrainisch", ru: "🇺🇦 Украинский" },
  ru: { de: "🇷🇺 Russisch", ru: "🇷🇺 Русский" },
  ar: { de: "🇸🇾 Arabisch", ru: "🇸🇾 Арабский" },
};

/**
 * The language the song is sung in for the setting `singing`, out of the languages
 * that have a song: "auto" (the default) is the app language when it is not German and
 * there is a song in it, else `fallback` (the browser's language, else English:
 * playLanguage) – German is also what the app shows every browser it doesn't speak, so
 * it says nothing about the family. A language is that one, and "off" or a language
 * without a song is the plain tune (null).
 */
export function sungLanguageFor(singing: string, appLanguage: string, available: readonly string[], fallback = playLanguage(available)): string | null {
  const wanted = singing !== "auto" ? singing : appLanguage !== "de" && available.includes(appLanguage) ? appLanguage : fallback;
  return wanted !== undefined && available.includes(wanted) ? wanted : null;
}

/** The language code in a sung song's file name, or null for any other file. */
export const sungLanguageOf = (file: string) => /musik-zaehneputzen-lied-([a-z]{2})\.mp3$/.exec(file)?.[1] ?? null;

/** The .json next to a sung song. */
export interface SungTimes {
  /** Where each part begins in the song, in seconds, a moment before its first word: one per step, then the finale. */
  verses: number[];
}
