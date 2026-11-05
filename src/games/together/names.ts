import type { Localized } from "@/lib/language";

// The game's name and its line for grown-ups, kept here rather than in `games.ts`: so the game's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`).

/** The game's name, in its book and in the browser tab. */
export const TOGETHER_TITLE: Localized = {
  de: "Was gehört zusammen?",
  ru: "Что подходит друг к другу?",
  en: "What goes together?",
  zh: "什么是一对？",
  hi: "किसके साथ क्या?",
  es: "¿Qué va junto?",
  ar: "ما الذي يتناسب معا؟",
};

/** Its line in the book's table of contents. */
export const TOGETHER_BLURB: Localized = {
  de: "Alltagsdinge, Helfer und ihr Werkzeug",
  ru: "Бытовые вещи, помощники и инструменты",
  en: "Everyday things, helpers and their tools",
  zh: "日常用品、帮手和他们的工具",
  hi: "रोज़ की चीज़ें, मददगार और उनके औज़ार",
  es: "Cosas de casa, ayudantes y herramientas",
  ar: "أشياء يومية، والمساعدون وأدواتهم",
};
