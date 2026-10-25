// The languages the app wants to speak in every game, sooner or later: German,
// its own, the five most spoken languages of the world (Ethnologue 2025, first
// and second language together; French follows close behind Arabic), and
// Russian and Italian, which the family wants too. Not every game has to have
// them right away; the status per game is on the ideas page
// (ideas/languageStatus.ts).

/** A language the app wants to speak. */
export type TargetLanguageId = "de" | "en" | "zh" | "hi" | "es" | "ar" | "ru" | "it";

export interface TargetLanguage {
  id: TargetLanguageId;
  /** Flag and German name, for grown-ups: "🇪🇸 Spanisch". */
  label: string;
  /** Why it is on the list, shown under its name. */
  reason: string;
}

/** In the order they are wanted: German, then by number of speakers, then the wished-for ones. */
export const TARGET_LANGUAGES: TargetLanguage[] = [
  { id: "de", label: "🇩🇪 Deutsch", reason: "Sprache der App" },
  { id: "en", label: "🇺🇸 Englisch", reason: "Platz 1, 1,5 Mrd." },
  { id: "zh", label: "🇨🇳 Chinesisch", reason: "Platz 2, 1,2 Mrd. (Mandarin)" },
  { id: "hi", label: "🇮🇳 Hindi", reason: "Platz 3, 0,6 Mrd." },
  { id: "es", label: "🇪🇸 Spanisch", reason: "Platz 4, 0,56 Mrd." },
  { id: "ar", label: "🇸🇦 Arabisch", reason: "Platz 5, 0,33 Mrd. (Hocharabisch)" },
  { id: "ru", label: "🇷🇺 Russisch", reason: "gewünscht" },
  { id: "it", label: "🇮🇹 Italienisch", reason: "gewünscht" },
];
