import type { Localized } from "@/lib/language";

// Names kept here rather than in `games.ts`, so the game's own row in the language table answers for them, not the home
// page's (`inlineTexts.test.ts`).

/** „Wie lange warten?“ (H-05): a Countdown to a big day, beside the Zeitplan and the Belohnungstafel. */
export const WAIT_BOOK: Localized = {
  de: "Wie lange warten?",
  en: "How long to wait?",
  zh: "还要等多久？",
  hi: "कितना इंतज़ार?",
  es: "¿Cuánto falta?",
  ar: "كم ننتظر؟",
  ru: "Сколько ждать?",
};

/** The Zeitplan's name: a plan of the day in pictures, without stars (a volume on the shelf, a quick choice in the editor). */
export const SCHEDULE_BOOK: Localized = { de: "Zeitplan", en: "Schedule", zh: "时间表", hi: "समय-सारणी", es: "Horario", ar: "الجدول الزمني", ru: "Расписание" };

/** The Belohnungstafel's name: a chart that counts stars (a volume on the shelf, a quick choice in the editor). */
export const REWARD_BOOK: Localized = {
  de: "Belohnungstafel",
  en: "Reward chart",
  zh: "奖励表",
  hi: "इनाम चार्ट",
  es: "Tabla de premios",
  ar: "لوحة المكافآت",
  ru: "Таблица наград",
};
