import type { Localized } from "@/lib/language";

/**
 * Short texts several shared parts say alike, kept once with all their languages so a new place reuses them instead of
 * copying (or writing a new line that would wait for its translations).
 */

/** The way back onto the shelf, read out for the ribbon's label (the corner at a game's end, „Menü“, the error page). */
export const BACK_TO_SHELF: Localized = {
  de: "Zurück zum Bücherregal",
  ru: "Назад к книжной полке",
  en: "Back to the bookshelf",
  zh: "返回书架",
  hi: "किताबों की अलमारी पर वापस",
  es: "Volver a la estantería",
  ar: "العودة إلى رف الكتب",
};

/** „Nochmal“: the same again (a level at its end, a page that failed to load). */
export const AGAIN: Localized = { de: "Nochmal", ru: "Ещё раз", en: "Again", zh: "再来一次", hi: "फिर से", es: "Otra vez", ar: "مرة أخرى" };
