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

/**
 * „Lernspiele“, the picture books' group: on the shelf's sign under them (the everyday helpers' is their category's
 * title), and in the videos' outro beside „Alltagshelfer“.
 */
export const LEARNING_GAMES: Localized = {
  de: "Lernspiele",
  ru: "Развивающие игры",
  en: "Learning Games",
  zh: "益智游戏",
  hi: "सीखने के खेल",
  es: "Juegos para aprender",
  ar: "ألعاب تعليمية",
};

/** „Nochmal“: the same again (a level at its end, a page that failed to load). */
export const AGAIN: Localized = { de: "Nochmal", ru: "Ещё раз", en: "Again", zh: "再来一次", hi: "फिर से", es: "Otra vez", ar: "مرة أخرى" };

/** „Pause“: a game's pause button and the screen while it waits (Zähne putzen, Aufs Töpfchen). */
export const PAUSE: Localized = { de: "Pause", en: "Pause", zh: "暂停", hi: "रुकें", es: "Pausa", ar: "إيقاف مؤقت", ru: "Пауза" };

/** The pause button while paused: going on. */
export const GO_ON: Localized = { de: "Weiter", en: "Next", zh: "继续", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Дальше" };

/** Under „Pause“ on a touch screen: how to go on. */
export const TAP_TO_GO_ON: Localized = {
  de: "Tippen: weiter",
  en: "Tap: go on",
  zh: "点一下：继续",
  hi: "टैप: आगे",
  es: "Toca: seguir",
  ar: "لمسة: متابعة",
  ru: "Нажми — и дальше",
};

/** Under „Pause“ with a keyboard: how to go on. */
export const SPACE_OR_TAP_TO_GO_ON: Localized = {
  de: "Leertaste oder Tippen: weiter",
  en: "Space or tap: go on",
  zh: "空格键或点一下：继续",
  hi: "स्पेस या टैप: आगे",
  es: "Espacio o toque: seguir",
  ar: "المسافة أو لمسة: متابعة",
  ru: "Пробел или нажатие — и дальше",
};
