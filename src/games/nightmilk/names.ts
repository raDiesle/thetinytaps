import type { EnglishFirst } from "@/lib/language";

// The story's name, its volume's name on the shelf and its line for grown-ups, kept here rather than in `games.ts`: the
// story's own row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first
// (root CLAUDE.md, user decision, 11 November 2026), translated into every app language (22 November 2026).

/** The story's name, in the browser tab and over its table of contents. */
export const NIGHT_MILK_TITLE: EnglishFirst = {
  en: "The Milk Sleeps at Night",
  de: "Die Milch schläft in der Nacht",
  zh: "夜里，奶要睡觉",
  hi: "रात में दूध सो जाता है",
  es: "La leche duerme de noche",
  ar: "الحليب ينام في الليل",
  ru: "Молочко спит ночью",
};

/** The name of its volume on the shelf, tied to the book „Abstillen“: what parents look for. */
export const NIGHT_MILK_BOOK: EnglishFirst = {
  en: "Night Weaning",
  de: "Nachts abstillen",
  zh: "夜间断奶",
  hi: "रात में दूध छुड़ाना",
  es: "Destete nocturno",
  ar: "الفطام الليلي",
  ru: "Ночное отлучение",
};

/** Its line for grown-ups. */
export const NIGHT_MILK_BLURB: EnglishFirst = {
  en: "Milk by day, sleep at night – in chapters",
  de: "Milch am Tag, Schlaf in der Nacht – in Kapiteln",
  zh: "白天喝奶，夜里睡觉——分章节讲",
  hi: "दिन में दूध, रात में नींद – अध्यायों में",
  es: "Leche de día, sueño de noche, en capítulos",
  ar: "حليب في النهار ونوم في الليل – على فصول",
  ru: "Молочко днём, сон ночью – по главам",
};
