// The sung brushing songs: musik/musik-zaehneputzen-lied-<lang>.mp3, one per language.
// A new language needs only its file (made with `yarn song:stretch … --lead 0.2`, see
// the /zahnputzlied skill) and, if missing here, a name in SUNG_LABELS.

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

/** Where the first part of every sung song starts, in seconds: `yarn song:stretch --lead` puts it here. */
export const SUNG_LEAD = 0.2;
/** One part of a sung song: 8 bars at 112 BPM, exactly one step of the two-minute brushing. */
export const SUNG_PART = (8 * 4 * 60) / 112;
