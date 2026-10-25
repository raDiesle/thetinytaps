// The sung brushing songs: musik/musik-zaehneputzen-lied-<lang>.mp3, one per language,
// with a .json of the same name saying where each verse begins. A new language needs
// only these two files (`yarn song:verses` makes both, see the /zahnputzlied skill) and,
// if missing here, a name in SUNG_LABELS.

/** Names of the languages a brushing song can be sung in, for the settings. */
export const SUNG_LABELS: Record<string, string> = {
  de: "🇩🇪 Deutsch",
  en: "🇬🇧 Englisch",
  tr: "🇹🇷 Türkisch",
  pl: "🇵🇱 Polnisch",
  fr: "🇫🇷 Französisch",
  es: "🇪🇸 Spanisch",
  it: "🇮🇹 Italienisch",
  nl: "🇳🇱 Niederländisch",
  uk: "🇺🇦 Ukrainisch",
  ru: "🇷🇺 Russisch",
  ar: "🇸🇾 Arabisch",
};

/** The language code in a sung song's file name, or null for any other file. */
export const sungLanguageOf = (file: string) => /musik-zaehneputzen-lied-([a-z]{2})\.mp3$/.exec(file)?.[1] ?? null;

/** The .json next to a sung song. */
export interface SungTimes {
  /** Where each part begins in the song, in seconds, a moment before its first word: one per step, then the finale. */
  verses: number[];
}
