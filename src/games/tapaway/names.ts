// „Tap Away“ (Drauflos tippen): the toy keyboard on the bookshelf (user request, 24 November 2026). Its name and line
// stand here, in the game's folder, so its row in the language table answers for them. English first, then translated.

import type { EnglishFirst } from "@/lib/language";

/** The game's name: the toy keyboard's label on the shelf and the browser tab. */
export const TAP_AWAY_TITLE: EnglishFirst = {
  en: "Tap Away",
  de: "Drauflos tippen",
  ru: "Жми и смотри",
  zh: "随便按按",
  hi: "दबाओ और देखो",
  es: "Toca y mira",
  ar: "اضغط وانظر",
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
