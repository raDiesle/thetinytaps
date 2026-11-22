import type { EnglishFirst } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). English first (root CLAUDE.md, user decision,
// 11 November 2026), translated on request (22 November 2026).

/** The story's name, in the browser tab and over its table of contents. */
export const BED_STORY_TITLE: EnglishFirst = {
  en: "Tapsi's Big Bed",
  de: "Tapsis großes Bett",
  zh: "塔普西的大床",
  hi: "टैप्सी का बड़ा बिस्तर",
  es: "La cama grande de Tapsi",
  ar: "سرير تابسي الكبير",
  ru: "Большая кровать Тапси",
};

/** The name of its book on the shelf, among the Alltagshelfer beside „Hair Washing“: what parents look for. */
export const BED_STORY_BOOK: EnglishFirst = {
  en: "Big Bed",
  de: "Großes Bett",
  zh: "大床",
  hi: "बड़ा बिस्तर",
  es: "Cama grande",
  ar: "السرير الكبير",
  ru: "Большая кровать",
};

/** Its line for grown-ups. */
export const BED_STORY_BLURB: EnglishFirst = {
  en: "From the cot into a big bed, in chapters",
  de: "Vom Gitterbett ins große Bett, in Kapiteln",
  zh: "从小床搬进大床——分章节讲",
  hi: "पालने से बड़े बिस्तर तक – अध्यायों में",
  es: "De la cuna a la cama grande, en capítulos",
  ar: "من السرير الصغير إلى الكبير – على فصول",
  ru: "Из кроватки в большую кровать – по главам",
};
