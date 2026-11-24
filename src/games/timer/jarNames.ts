import type { EnglishFirst } from "@/lib/language";

// „Marble Jar“ (H-149, 24 November 2026): marbles fall through a pegboard into a glass jar until it is full. Written
// English first and translated into every app language in the same commit; its texts stand here on their own, so the
// language table (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out and as the card's tooltip. */
export const JAR_NAME: EnglishFirst = {
  en: "Marble Jar",
  de: "Kugelglas",
  zh: "弹珠罐",
  hi: "कंचों का जार",
  es: "Tarro de canicas",
  ar: "مرطبان الكُرات",
  ru: "Банка с шариками",
};

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const JAR_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "The marbles roll into the jar.",
    de: "Die Kugeln rollen ins Glas.",
    zh: "弹珠滚进罐子里。",
    hi: "कंचे जार में लुढ़कते हैं।",
    es: "Las canicas ruedan al tarro.",
    ar: "الكُرات تتدحرج إلى المرطبان.",
    ru: "Шарики катятся в банку.",
  },
  end: {
    en: "The jar is full!",
    de: "Das Glas ist voll!",
    zh: "罐子装满了！",
    hi: "जार भर गया!",
    es: "¡El tarro está lleno!",
    ar: "امتلأ المرطبان!",
    ru: "Банка полная!",
  },
};
