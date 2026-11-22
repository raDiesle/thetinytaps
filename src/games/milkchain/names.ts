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

/** Its line for grown-ups: the book's stories. */
export const MILK_CHAIN_BLURB: Localized = {
  de: "Ganz, nur nachts oder mit Abschiedsfest",
  en: "Fully, by night or with a goodbye party",
  zh: "完全断奶、只在夜里或办告别派对",
  hi: "पूरी तरह, सिर्फ़ रात में या विदाई दावत से",
  es: "Del todo, de noche o con fiesta de adiós",
  ar: "كليًا، أو في الليل فقط، أو مع حفلة وداع",
  ru: "Совсем, ночью или с прощальным праздником",
};

/**
 * Its name in the book's choice of stories (`WeaningBook`), over its title: what it is for, beside the night story's
 * „Nachts abstillen“ – weaning by day and at night, the long story.
 */
export const MILK_CHAIN_KIND: Localized = {
  de: "Ganz abstillen",
  en: "Weaning completely",
  zh: "完全断奶",
  hi: "पूरी तरह दूध छुड़ाना",
  es: "Destete completo",
  ar: "الفطام الكامل",
  ru: "Полное отлучение",
};
