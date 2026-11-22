import type { EnglishFirst } from "@/lib/language";

// The game's name and its line for grown-ups, kept here rather than in `games.ts`: the game's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). English first, in all seven app languages
// (root CLAUDE.md, user decision, 22 November 2026).

/** The game's name, in the browser tab and on its book. */
export const HANDWASH_TITLE: EnglishFirst = {
  en: "Washing Hands",
  de: "Hände waschen",
  zh: "洗手",
  hi: "हाथ धोना",
  es: "Lavarse las manos",
  ar: "غسل اليدين",
  ru: "Моем руки",
};

/** Its line for grown-ups. */
export const HANDWASH_BLURB: EnglishFirst = {
  en: "Washing hands step by step, to the beat",
  de: "Hände waschen Schritt für Schritt, im Takt",
  zh: "跟着节拍，一步一步洗手",
  hi: "ताल पर, एक-एक कदम हाथ धोना",
  es: "Lavarse las manos paso a paso, al ritmo",
  ar: "غسل اليدين خطوة بخطوة، على الإيقاع",
  ru: "Моем руки шаг за шагом, в ритме",
};
