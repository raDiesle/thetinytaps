// „Was ist passiert?“ (idea J-03, area J of /management/): a game of its own in the book „Gefühle“. Its name and line
// stand here, in the game's folder, so its row in the language table answers for them (translated 10 November 2026).

import type { Localized } from "@/lib/language";

/** The game's name on the shelf's table of contents and in the browser tab. */
export const CAUSE_TITLE: Localized = {
  de: "Was ist passiert?",
  en: "What Happened?",
  zh: "发生了什么？",
  hi: "क्या हुआ?",
  es: "¿Qué pasó?",
  ar: "ماذا حدث؟",
  ru: "Что случилось?",
};

/** The game's line for grown-ups, on the book's table of contents. */
export const CAUSE_BLURB: Localized = {
  de: "Warum fühlt sich das Kind so?",
  en: "Why does the child feel this way?",
  zh: "孩子为什么有这种感觉？",
  hi: "बच्चा ऐसा क्यों महसूस करता है?",
  es: "¿Por qué se siente así?",
  ar: "لماذا يشعر الطفل هكذا؟",
  ru: "Почему малыш так себя чувствует?",
};
