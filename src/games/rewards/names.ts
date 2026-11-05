import type { Localized } from "@/lib/language";

// Names kept here rather than in `games.ts`, so the game's own row in the language table answers for them, not the home
// page's (`inlineTexts.test.ts`).

/** The third book in the slipcase of Belohnungstafel and Zeitplan (H-05): it opens on a Countdown to a big day. */
export const WAIT_BOOK: Localized = {
  de: "Wie lange warten?",
  en: "How long to wait?",
  zh: "还要等多久？",
  hi: "कितना इंतज़ार?",
  es: "¿Cuánto falta?",
  ar: "كم ننتظر؟",
  ru: "Сколько ждать?",
};
