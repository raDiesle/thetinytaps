import type { Localized } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). Translated on request on 19 November 2026.

/** The story's name, in the browser tab and over its table of contents. */
export const KITA_STORY_TITLE: Localized = {
  de: "Tapsi geht in die Kita",
  en: "Tapsi Starts Daycare",
  zh: "塔普西上托儿所",
  hi: "टैप्सी डेकेयर जाता है",
  es: "Tapsi va a la guardería",
  ar: "تابسي يذهب إلى الحضانة",
  ru: "Тапси идёт в садик",
};

/** The name of its book on the shelf, among the Alltagshelfer beside „Schnullerfee“: what parents look for. */
export const KITA_STORY_BOOK: Localized = {
  de: "Kita-Start",
  en: "Starting Daycare",
  zh: "上托儿所",
  hi: "डेकेयर की शुरुआत",
  es: "Empezar la guardería",
  ar: "بداية الحضانة",
  ru: "Первый раз в садик",
};

/** Its line for grown-ups. */
export const KITA_STORY_BLURB: Localized = {
  de: "Eingewöhnung und Tschüss – in Kapiteln",
  en: "Settling in and saying bye – in chapters",
  zh: "适应和道别——分章节",
  hi: "घुलना-मिलना और टाटा – अध्यायों में",
  es: "Adaptación y despedida, por capítulos",
  ar: "التأقلم والوداع، في فصول",
  ru: "Привыкание и прощание, по главам",
};
