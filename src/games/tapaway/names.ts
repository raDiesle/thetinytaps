// „Magic Keys“ (Zaubertasten): the toy keyboard on the bookshelf (user request, 24 November 2026). Its name and line
// stand here, in the game's folder, so its row in the language table answers for them. English first, then translated.
// It was „Tap Away“ / „Drauflos tippen“ at first, an instruction rather than a name: the poster above the toy keyboard
// asked for a good one (user request, 24 November 2026).

import type { EnglishFirst } from "@/lib/language";

/** The game's name: on the poster above the toy keyboard on the shelf, its label and the browser tab. */
export const TAP_AWAY_TITLE: EnglishFirst = {
  en: "Magic Keys",
  de: "Zaubertasten",
  ru: "Волшебные клавиши",
  zh: "神奇按键",
  hi: "जादुई बटन",
  es: "Teclas mágicas",
  ar: "الأزرار السحرية",
};

/** Its line for grown-ups (the toy keyboard's tooltip). */
export const TAP_AWAY_BLURB: EnglishFirst = {
  en: "Every key and every tap brings a surprise",
  de: "Jede Taste, jeder Tipp: eine Überraschung",
  ru: "Каждая клавиша и каждое касание – сюрприз",
  zh: "每个键、每次点击都有惊喜",
  hi: "हर बटन और हर टैप पर एक सरप्राइज़",
  es: "Cada tecla y cada toque trae una sorpresa",
  ar: "كل زر وكل لمسة تأتي بمفاجأة",
};
