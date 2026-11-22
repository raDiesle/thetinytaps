import type { EnglishFirst } from "@/lib/language";

// The road rug's name and lines (H-122, 22 November 2026), written English first and translated into every app
// language at once (root CLAUDE.md). Kept apart from `content.ts` and `voice.ts` like Tidy Up's, so its row in
// `languageStatus.ts` can name them as a part of their own.

/** The picture's name: a card's tooltip, read out, and the trophy's. */
export const ROAD_NAME: EnglishFirst = {
  en: "Road Rug",
  de: "Straßenteppich",
  zh: "道路地毯",
  hi: "सड़क वाला कालीन",
  es: "Alfombra de carreteras",
  ar: "سجادة الطرق",
  ru: "Ковёр с дорогой",
};

/** What it says as it starts and at the end (`PICTURE_LINES`). */
export const ROAD_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Let's clear the road for the little car.",
    de: "Wir räumen die Straße frei für das kleine Auto.",
    zh: "我们把路清出来，让小汽车开过去。",
    hi: "चलो, छोटी गाड़ी के लिए सड़क खाली करें।",
    es: "Vamos a despejar la calle para el cochecito.",
    ar: "هيّا نُخلي الطريق للسيارة الصغيرة.",
    ru: "Освободим дорогу для маленькой машинки.",
  },
  end: {
    en: "The road is clear! The car is home.",
    de: "Die Straße ist frei! Das Auto ist zu Hause.",
    zh: "路通了！小汽车到家了。",
    hi: "सड़क खाली हो गई! गाड़ी घर पहुँच गई।",
    es: "¡La calle está libre! El coche llegó a casa.",
    ar: "الطريق خالٍ! وصلت السيارة إلى البيت.",
    ru: "Дорога свободна! Машинка дома.",
  },
};
