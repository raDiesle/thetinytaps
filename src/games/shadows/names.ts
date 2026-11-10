import type { Localized } from "@/lib/language";

// The game's name and its line for grown-ups, kept here rather than in `games.ts`: so the game's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). The game became „Erkennen“ in November 2026, when
// „Wer schaut da raus?“ moved in; translated on request on 10 November 2026.

/** The game's name, in its book and in the browser tab. */
export const SHADOWS_TITLE: Localized = {
  de: "Erkennen",
  en: "Recognize",
  zh: "认一认",
  hi: "पहचानो",
  es: "Reconocer",
  ar: "التعرّف",
  ru: "Узнаём",
};

/** Its line in the book's table of contents. */
export const SHADOWS_BLURB: Localized = {
  de: "Schatten finden und Tiere erkennen",
  en: "Find shadows and recognize animals",
  zh: "找影子，认动物",
  hi: "परछाईं ढूँढना और जानवर पहचानना",
  es: "Buscar sombras y reconocer animales",
  ar: "إيجاد الظلال والتعرّف على الحيوانات",
  ru: "Найти тени и узнать зверей",
};
