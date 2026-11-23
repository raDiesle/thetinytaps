import type { EnglishFirst } from "@/lib/language";

// Up to the Moon (H-127: first „Hop to the Flag“ on one screen, 22 November 2026, rebuilt as a climb through a world many
// screens tall on 23 November 2026), a timer that looks like a game played by itself: written English first and
// translated into every app language in the same commit. Its texts stand here on their own, so the language table
// (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out, as the card's tooltip and the trophy's. */
export const JUMP_NAME: EnglishFirst = {
  en: "Up to the Moon",
  de: "Hoch bis zum Mond",
  zh: "一直到月亮",
  hi: "चाँद तक ऊपर",
  es: "Arriba hasta la luna",
  ar: "صعودًا إلى القمر",
  ru: "Вверх до луны",
};

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const JUMP_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Swim, hop, climb and fly – all the way up to the moon!",
    de: "Schwimmen, hüpfen, klettern, fliegen – bis hoch zum Mond!",
    zh: "游呀、跳呀、爬呀、飞呀——一直到月亮！",
    hi: "चलो, चाँद तक चलते हैं – तैरकर, कूदकर, चढ़कर और उड़कर!",
    es: "¡Nadar, saltar, trepar y volar, hasta la luna!",
    ar: "هيّا نسبح ونقفز ونتسلّق ونطير حتى القمر!",
    ru: "Плывём, прыгаем, лезем и летим – до самой луны!",
  },
  end: {
    en: "Splash! Right into the cake.",
    de: "Platsch! Mitten in die Torte.",
    zh: "扑通！正好掉进蛋糕里。",
    hi: "छपाक! सीधे केक के अंदर।",
    es: "¡Plaf! Justo dentro de la tarta.",
    ar: "بلوب! مباشرة في الكعكة.",
    ru: "Плюх! Прямо в торт!",
  },
};
