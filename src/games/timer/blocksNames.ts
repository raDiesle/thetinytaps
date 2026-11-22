import type { EnglishFirst } from "@/lib/language";

// The block house (H-125, 22 November 2026), the first timer that looks like a game played by itself: written English
// first and translated into every app language in the same commit. Its texts stand here on their own, so the language
// table (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out, as the card's tooltip and the trophy's. */
export const BLOCKS_NAME: EnglishFirst = {
  en: "Block House",
  de: "Klötzchenhaus",
  zh: "方块小屋",
  hi: "ब्लॉक का घर",
  es: "Casa de bloques",
  ar: "بيت المكعّبات",
  ru: "Домик из кубиков",
};

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const BLOCKS_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Let's build a house with all the blocks.",
    de: "Wir bauen mit allen Klötzen ein Haus.",
    zh: "我们用所有的方块盖一座房子。",
    hi: "चलो, सारे ब्लॉक से एक घर बनाते हैं।",
    es: "Vamos a hacer una casa con todos los bloques.",
    ar: "هيّا نبني بيتًا بكلّ المكعّبات.",
    ru: "Построим домик из всех кубиков.",
  },
  end: {
    en: "The house is built! The light is on.",
    de: "Das Haus ist fertig! Das Licht ist an.",
    zh: "房子盖好了！灯亮了。",
    hi: "घर बन गया! बत्ती जल गई।",
    es: "¡La casa está lista! La luz está encendida.",
    ar: "البيت جاهز! والنور مُضاء.",
    ru: "Домик готов! Свет горит.",
  },
};
