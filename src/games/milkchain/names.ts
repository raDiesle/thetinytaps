import type { Localized } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`).

/** The story's name, in the browser tab and on the management page. */
export const MILK_CHAIN_TITLE: Localized = {
  de: "Tapsis Milchkette",
  en: "Tapsi's Milk Chain",
  zh: "塔普西的奶滴链",
  hi: "टैप्सी की दूध-माला",
  es: "La cadena de leche de Tapsi",
  ar: "سلسلة حليب تابسي",
  ru: "Молочная цепочка Тапси",
};

/** Its line for grown-ups. */
export const MILK_CHAIN_BLURB: Localized = {
  de: "Abstillen in Kapiteln",
  en: "Weaning in chapters",
  zh: "分章节断奶",
  hi: "अध्यायों में दूध छुड़ाना",
  es: "El destete en capítulos",
  ar: "الفطام في فصول",
  ru: "Отлучение по главам",
};
