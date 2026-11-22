import type { EnglishFirst } from "@/lib/language";

// The story's name and its name in the book's choice of stories, kept here rather than in `games.ts`: the story's own
// row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first, translated
// into every app language (root CLAUDE.md, user decision, 22 November 2026).

/** The story's name, in the browser tab and under its name in the book's choice of stories. */
export const GOODBYE_MILK_TITLE: EnglishFirst = {
  en: "Three More Sleeps",
  de: "Noch dreimal schlafen",
  zh: "再睡三觉",
  hi: "बस तीन बार और सोना",
  es: "Tres noches más",
  ar: "ثلاث ليالٍ أخرى",
  ru: "Ещё три ночки",
};

/**
 * Its name in the book „Abstillen“'s choice of stories (`WeaningBook` in `src/games/milkchain`), over its title: how it
 * weans, beside „Ganz abstillen“ (one milk time after the other) and „Nachts abstillen“ – on one day, with a party.
 */
export const GOODBYE_MILK_KIND: EnglishFirst = {
  en: "With a goodbye party",
  de: "Mit Abschiedsfest",
  zh: "办个告别会",
  hi: "विदाई की पार्टी के साथ",
  es: "Con fiesta de despedida",
  ar: "مع حفلة وداع",
  ru: "С прощальным праздником",
};
