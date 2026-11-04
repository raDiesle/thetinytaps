// Wie geht's dir heute? The child picks the weather that fits how it feels; the
// bear says he knows that too, and then the scenes of that feeling show what
// helps. Grown-ups learn on the way how the child is doing.

import type { Localized } from "@/lib/language";

export type WeatherId = "sonne" | "wolke" | "regen" | "gewitter";

/** One weather card: the bear under that weather, feeling the same. */
export interface Weather {
  id: WeatherId;
  /** What the card shows, for grown-ups under it, in every language the game speaks. */
  caption: Localized;
  /** The group of scenes played next (`GROUPS`). */
  group: string;
  /** The three things offered after it in „Was hilft dir jetzt?“, the one that fits this feeling best first. */
  helps: [HelpId, HelpId, HelpId];
}

export const WEATHERS: Weather[] = [
  {
    id: "sonne",
    caption: { de: "Sonne, fröhlich", ru: "Солнце, весело", en: "Sun, happy", zh: "太阳，开心", hi: "धूप, खुश", es: "Sol, alegre", ar: "شمس، فرح" },
    group: "freude",
    helps: ["toben", "lied", "kuscheln"],
  },
  {
    id: "wolke",
    caption: { de: "Wolke, müde", ru: "Облако, сонно", en: "Cloud, tired", zh: "多云，困了", hi: "बादल, थकान", es: "Nube, sueño", ar: "غيمة، تعب" },
    group: "muede",
    helps: ["kuscheln", "trinken", "allein"],
  },
  {
    id: "regen",
    caption: { de: "Regen, traurig", ru: "Дождь, грустно", en: "Rain, sad", zh: "下雨，难过", hi: "बारिश, उदास", es: "Lluvia, triste", ar: "مطر، حزن" },
    group: "traurig",
    helps: ["kuscheln", "lied", "allein"],
  },
  {
    id: "gewitter",
    caption: { de: "Gewitter, wütend", ru: "Гроза, сердито", en: "Storm, angry", zh: "打雷，生气", hi: "तूफ़ान, गुस्सा", es: "Tormenta, enojo", ar: "عاصفة، غضب" },
    group: "wuetend",
    helps: ["toben", "allein", "trinken"],
  },
];

/** Read aloud when the weather cards come. */
export const MOOD_QUESTION: Localized = {
  de: "Wie geht's dir heute?",
  ru: "Как ты сегодня?",
  en: "How are you today?",
  zh: "你今天心情怎么样？",
  hi: "आज तुम्हारा मन कैसा है?",
  es: "¿Cómo estás hoy?",
  ar: "كيف حالك اليوم؟",
};

/** The bear's answer to any weather. */
export const MOOD_ANSWER: Localized = {
  de: "Das kenne ich auch!",
  ru: "Мне тоже так бывает!",
  en: "I know that feeling too!",
  zh: "我也有过这种感觉！",
  hi: "मुझे भी ऐसा लगता है!",
  es: "¡A mí también me pasa!",
  ar: "أنا أيضا أعرف هذا الشعور!",
};

/** What can help a child now; each has its card in „Was hilft dir jetzt?“ (`moodImages.help`). */
export type HelpId = "kuscheln" | "toben" | "trinken" | "allein" | "lied";

/**
 * One thing that can help: there is no wrong one, so the child shows what it needs, and the grown-up sees from the
 * card's caption what to do – also when the child can't say it yet (idea C-31).
 */
export interface Help {
  id: HelpId;
  /** What the card shows, as short as a button, for grown-ups under it. */
  caption: Localized;
  /** Said when it is picked: that it is a good idea. */
  answer: Localized;
}

/** The things that can help, by id. German only so far (November 2026): translations come when the user asks. */
export const HELPS: Record<HelpId, Help> = {
  kuscheln: { id: "kuscheln", caption: { de: "Kuscheln" }, answer: { de: "Kuscheln tut gut." } },
  toben: { id: "toben", caption: { de: "Toben" }, answer: { de: "Toben tut gut." } },
  trinken: { id: "trinken", caption: { de: "Etwas trinken" }, answer: { de: "Ein Schluck Wasser tut gut." } },
  allein: { id: "allein", caption: { de: "Ein bisschen allein sein" }, answer: { de: "Ein bisschen Ruhe tut gut." } },
  lied: { id: "lied", caption: { de: "Ein Lied singen" }, answer: { de: "Ein Lied tut gut." } },
};

/** Read aloud when the three cards of what helps come, after the weather. */
export const HELP_QUESTION: Localized = { de: "Was hilft dir jetzt?" };
