import type { EnglishFirst } from "@/lib/language";

// The Marble Run (H-117 with H-115, 24 November 2026): two to four children take turns, a marble rolling down a marble
// run the whole turn long into the cup of the child whose turn comes next. Written English first and translated into
// every app language in the same commit; its texts stand here on their own, so the language table
// (`languageStatus.ts`) can name them as a part of their own.

/** The picture's name, read out, as the card's tooltip and the trophy's. */
export const MARBLE_NAME: EnglishFirst = {
  en: "Marble Run",
  de: "Kugelbahn",
  zh: "弹珠轨道",
  hi: "कंचों की पटरी",
  es: "Pista de canicas",
  ar: "مسار البلي",
  ru: "Горка для шариков",
};

/** Behind ⚙️: how many children take turns (H-115). */
export const KIDS_LABEL: EnglishFirst = {
  en: "How many children?",
  de: "Wie viele Kinder?",
  zh: "几个孩子？",
  hi: "कितने बच्चे?",
  es: "¿Cuántos niños?",
  ar: "كم عدد الأطفال؟",
  ru: "Сколько детей?",
};

/** The third and fourth child's cups, as „Wer ist dran?“ names them behind ⚙️ (the fox's and the bear's are Abwechseln's). */
export const MORE_KID_NAMES: { rabbit: EnglishFirst; frog: EnglishFirst } = {
  rabbit: { en: "🐰 Little rabbit", de: "🐰 Hasenkind", zh: "🐰 小兔子", hi: "🐰 खरगोश का बच्चा", es: "🐰 Conejito", ar: "🐰 الأرنب الصغير", ru: "🐰 Зайчонок" },
  frog: { en: "🐸 Little frog", de: "🐸 Froschkind", zh: "🐸 小青蛙", hi: "🐸 मेंढक का बच्चा", es: "🐸 Ranita", ar: "🐸 الضفدع الصغير", ru: "🐸 Лягушонок" },
};

/** Said when the turn goes to the third or fourth child (H-72's „Tauschen! …“ for the fox and the bear stand in `voice.ts`). */
export const MORE_TURN_TO: { rabbit: EnglishFirst; frog: EnglishFirst } = {
  rabbit: {
    en: "Swap! Now it's the little rabbit's turn.",
    de: "Tauschen! Jetzt ist das Hasenkind dran.",
    zh: "换人！现在轮到小兔子了。",
    hi: "अदला-बदली! अब खरगोश के बच्चे की बारी है।",
    es: "¡Cambio! Ahora le toca al conejito.",
    ar: "تبديل! الآن دور الأرنب الصغير.",
    ru: "Меняемся! Теперь очередь зайчонка.",
  },
  frog: {
    en: "Swap! Now it's the little frog's turn.",
    de: "Tauschen! Jetzt ist das Froschkind dran.",
    zh: "换人！现在轮到小青蛙了。",
    hi: "अदला-बदली! अब मेंढक के बच्चे की बारी है।",
    es: "¡Cambio! Ahora le toca a la ranita.",
    ar: "تبديل! الآن دور الضفدع الصغير.",
    ru: "Меняемся! Теперь очередь лягушонка.",
  },
};
