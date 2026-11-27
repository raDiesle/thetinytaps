import type { EnglishFirst } from "@/lib/language";

// Lift to the Top (id `jump`, H-127; a tower with one big lift since 26 November 2026, before that „Up to the Moon“), a
// timer that looks like a lift ride: written English first and translated into every app language in the same commit.
// Its texts stand here on their own, so the language table (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out, as the card's tooltip and the trophy's. */
export const LIFT_NAME: EnglishFirst = {
  en: "Lift to the Top",
  de: "Mit dem Aufzug nach oben",
  zh: "坐电梯到楼顶",
  hi: "लिफ़्ट से छत तक",
  es: "En ascensor hasta arriba",
  ar: "بالمصعد إلى السطح",
  ru: "На лифте наверх",
};

/** What it says as it starts, where it goes, and at the end, what is there now (H-72). */
export const LIFT_LINES: { start: EnglishFirst; end: EnglishFirst } = {
  start: {
    en: "Up we go in the lift – all the way to the top!",
    de: "Mit dem Aufzug fahren wir hoch – bis ganz nach oben!",
    zh: "坐电梯往上走——一直到最高层！",
    hi: "चलो, लिफ़्ट से सबसे ऊपर तक चलते हैं!",
    es: "¡Subimos en ascensor hasta arriba del todo!",
    ar: "هيّا نصعد بالمصعد حتى الأعلى!",
    ru: "Едем на лифте вверх – до самого верха!",
  },
  end: {
    en: "Ding! All the way up – and the door opens!",
    de: "Ding! Ganz oben – und die Tür geht auf!",
    zh: "叮！到最高层啦——门开了！",
    hi: "टिंग! सबसे ऊपर पहुँच गए – और दरवाज़ा खुल गया!",
    es: "¡Ding! Arriba del todo, ¡y se abre la puerta!",
    ar: "دينغ! وصلنا إلى الأعلى، والباب ينفتح!",
    ru: "Дзинь! Мы на самом верху – и двери открываются!",
  },
};
