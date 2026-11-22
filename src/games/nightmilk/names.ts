import type { EnglishFirst } from "@/lib/language";

// The story's name and its name in the book's choice of stories, kept here rather than in `games.ts`: the story's own
// row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). Written English first and
// translated into every app language (root CLAUDE.md, Language); the story's pages are still English only.

/** The story's name, in the browser tab and under its name in the book's choice of stories. */
export const NIGHT_MILK_TITLE: EnglishFirst = {
  en: "The Milk Sleeps at Night",
  de: "Nachts schläft die Milch",
  zh: "月亮出来，奶就睡了",
  hi: "रात में दूध सो जाता है",
  es: "La leche duerme de noche",
  ar: "الحليب ينام في الليل",
  ru: "Ночью молочко спит",
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
