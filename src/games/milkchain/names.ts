import type { Localized } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`).

/** The story's name, in the browser tab and over its table of contents. */
export const MILK_CHAIN_TITLE: Localized = {
  de: "Tapsis Milchkette",
  en: "Tapsi's Milk Chain",
  zh: "塔普西的奶滴链",
  hi: "टैप्सी की दूध-माला",
  es: "La cadena de leche de Tapsi",
  ar: "سلسلة حليب تابسي",
  ru: "Молочная цепочка Тапси",
};

/** The name of its book on the shelf, among the Alltagshelfer: what parents look for. */
export const MILK_CHAIN_BOOK: Localized = {
  de: "Abstillen",
  ru: "Отлучение от груди",
  en: "Weaning",
  zh: "断奶",
  hi: "दूध छुड़ाना",
  es: "El destete",
  ar: "الفطام",
};

/** Its line for grown-ups. */
export const MILK_CHAIN_BLURB: Localized = {
  de: "Tapsis Milchkette, in Kapiteln",
  en: "Tapsi's Milk Chain, in chapters",
  zh: "塔普西的奶滴链，分章节",
  hi: "टैप्सी की दूध-माला, अध्यायों में",
  es: "La cadena de leche de Tapsi, por capítulos",
  ar: "سلسلة حليب تابسي، في فصول",
  ru: "Молочная цепочка Тапси, по главам",
};
