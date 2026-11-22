import type { EnglishFirst } from "@/lib/language";

// The story's name and its name in the book's choice of stories, kept here rather than in `games.ts`: the story's own
// row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first (root
// CLAUDE.md, user decision, 11 November 2026), translated into every app language (22 November 2026).

/** The story's name, in the browser tab and under its name in the book's choice of stories. */
export const NIGHT_MILK_TITLE: EnglishFirst = {
  en: "The Milk Sleeps at Night",
  de: "Die Milch schläft in der Nacht",
  zh: "夜里，奶要睡觉",
  hi: "रात में दूध सो जाता है",
  es: "La leche duerme de noche",
  ar: "الحليب ينام في الليل",
  ru: "Молочко спит ночью",
};

/**
 * Its name in the book „Abstillen“'s choice of stories (`WeaningBook` in `src/games/milkchain`), over its title: what
 * parents look for, beside the long story's „Ganz abstillen“.
 */
export const NIGHT_MILK_KIND: EnglishFirst = {
  en: "Night weaning",
  de: "Nachts abstillen",
  zh: "夜间断奶",
  hi: "रात में दूध छुड़ाना",
  es: "Destete nocturno",
  ar: "الفطام الليلي",
  ru: "Ночное отлучение",
};
