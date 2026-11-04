// Wie geht's dir heute? The child picks the face that shows how it feels: a fox or bear child with Mama or Papa
// beside it (idea C-30), eight feelings (C-29). The grown-up in the picture takes it in its arms, the little one shows
// the face big to copy (C-35), the child shows how strong it is on a weather sign in three sizes (C-36) – a big hard
// feeling first gets a breath blown together –, then picks what helps (C-31), and the scenes of that feeling follow.
// Grown-ups learn on the way how the child is doing.

import type { MascotBrows, MascotEyes, MascotKind, MascotMouth } from "@/components/Mascot";
import type { Localized } from "@/lib/language";

export type MoodId = "froh" | "stolz" | "aufgeregt" | "ruhig" | "muede" | "traurig" | "wuetend" | "angst";

/** The weather that goes with a feeling, drawn in three sizes for „Wie doll ist es?“ (`SkySign`). */
export type SkyId = "sonne" | "regenbogen" | "wind" | "schnee" | "wolke" | "regen" | "gewitter" | "wald";

/** The face the little one makes big to copy, drawn with the shared `MascotHead`. */
export interface MoodFace {
  eyes: MascotEyes;
  mouth: MascotMouth;
  brows: MascotBrows;
  /** Degrees the head tips: a proud chin goes up. */
  tilt?: number;
}

/** One feeling to pick. */
export interface Mood {
  id: MoodId;
  /** Who shows it on its card and makes its face: the fox child or the bear child, both found in every game. */
  kind: MascotKind;
  /** Its name, for grown-ups under the card. German only so far (translations only on request). */
  caption: Localized;
  face: MoodFace;
  /** Its weather, the sign of „Wie doll ist es?“. */
  sky: SkyId;
  /** A feeling that is hard to bear when big: „Ganz doll“ first brings a breath blown together. */
  hard: boolean;
  /** The group of scenes played next (`GROUPS`). */
  group: string;
  /** The three things offered in „Was hilft dir jetzt?“, the one that fits this feeling best first. */
  helps: [HelpId, HelpId, HelpId];
  /**
   * The weather card it had before the faces (`wetter-…`, with its translated caption): the built site shows these four
   * until every face's pictures are made.
   */
  weather?: { picture: string; caption: Localized };
}

/** The feelings in the order of their cards: the glad ones first, then the hard ones. */
export const MOODS: Mood[] = [
  {
    id: "froh",
    kind: "bear",
    caption: { de: "Fröhlich" },
    face: { eyes: "happy", mouth: "open", brows: "soft" },
    sky: "sonne",
    hard: false,
    group: "freude",
    helps: ["toben", "lied", "kuscheln"],
    weather: {
      picture: "sonne",
      caption: { de: "Sonne, fröhlich", ru: "Солнце, весело", en: "Sun, happy", zh: "太阳，开心", hi: "धूप, खुश", es: "Sol, alegre", ar: "شمس، فرح" },
    },
  },
  {
    id: "stolz",
    kind: "fox",
    caption: { de: "Stolz" },
    face: { eyes: "happy", mouth: "smile", brows: "up", tilt: -12 },
    sky: "regenbogen",
    hard: false,
    group: "freude",
    helps: ["toben", "lied", "kuscheln"],
  },
  {
    id: "aufgeregt",
    kind: "fox",
    caption: { de: "Aufgeregt" },
    face: { eyes: "wide", mouth: "open", brows: "up" },
    sky: "wind",
    hard: true,
    group: "freude",
    helps: ["toben", "trinken", "allein"],
  },
  {
    id: "ruhig",
    kind: "bear",
    caption: { de: "Ruhig" },
    face: { eyes: "shut", mouth: "smile", brows: "soft" },
    sky: "schnee",
    hard: false,
    group: "freude",
    helps: ["kuscheln", "lied", "allein"],
  },
  {
    id: "muede",
    kind: "bear",
    caption: { de: "Müde" },
    face: { eyes: "half", mouth: "o", brows: "soft" },
    sky: "wolke",
    hard: false,
    group: "muede",
    helps: ["kuscheln", "trinken", "allein"],
    weather: {
      picture: "wolke",
      caption: { de: "Wolke, müde", ru: "Облако, сонно", en: "Cloud, tired", zh: "多云，困了", hi: "बादल, थकान", es: "Nube, sueño", ar: "غيمة، تعب" },
    },
  },
  {
    id: "traurig",
    kind: "fox",
    caption: { de: "Traurig" },
    face: { eyes: "open", mouth: "frown", brows: "sad" },
    sky: "regen",
    hard: true,
    group: "traurig",
    helps: ["kuscheln", "lied", "allein"],
    weather: {
      picture: "regen",
      caption: { de: "Regen, traurig", ru: "Дождь, грустно", en: "Rain, sad", zh: "下雨，难过", hi: "बारिश, उदास", es: "Lluvia, triste", ar: "مطر، حزن" },
    },
  },
  {
    id: "wuetend",
    kind: "bear",
    caption: { de: "Wütend" },
    face: { eyes: "open", mouth: "frown", brows: "angry" },
    sky: "gewitter",
    hard: true,
    group: "wuetend",
    helps: ["toben", "allein", "trinken"],
    weather: {
      picture: "gewitter",
      caption: {
        de: "Gewitter, wütend",
        ru: "Гроза, сердито",
        en: "Storm, angry",
        zh: "打雷，生气",
        hi: "तूफ़ान, गुस्सा",
        es: "Tormenta, enojo",
        ar: "عاصفة، غضب",
      },
    },
  },
  {
    id: "angst",
    kind: "fox",
    caption: { de: "Ängstlich" },
    face: { eyes: "wide", mouth: "o", brows: "sad" },
    sky: "wald",
    hard: true,
    group: "angst",
    helps: ["kuscheln", "lied", "trinken"],
  },
];

/** Read aloud when the cards of the feelings come. */
export const MOOD_QUESTION: Localized = {
  de: "Wie geht's dir heute?",
  ru: "Как ты сегодня?",
  en: "How are you today?",
  zh: "你今天心情怎么样？",
  hi: "आज तुम्हारा मन कैसा है?",
  es: "¿Cómo estás hoy?",
  ar: "كيف حالك اليوم؟",
};

/** Said when a feeling is picked, while the grown-up in its picture takes the little one in its arms. */
export const MOOD_ANSWER: Localized = {
  de: "Das kenne ich auch!",
  ru: "Мне тоже так бывает!",
  en: "I know that feeling too!",
  zh: "我也有过这种感觉！",
  hi: "मुझे भी ऐसा लगता है!",
  es: "¡A mí también me pasa!",
  ar: "أنا أيضا أعرف هذا الشعور!",
};

/** Under the picture of the grown-up's hug. */
export const HUG_CAPTION: Localized = { de: "In den Arm nehmen" };

/** Said while the little one shows the face big (C-35): the child copies it, for a mirror or the grown-up. */
export const FACE_LINE: Localized = { de: "Kannst du auch so gucken?" };

/** Under the big face. */
export const FACE_CAPTION: Localized = { de: "Gesicht nachmachen" };

/** How strong a feeling is (C-36): its weather small, middling or big, no numbers. */
export type StrengthId = "klein" | "mittel" | "gross";

/** One size of the weather sign. */
export interface Strength {
  id: StrengthId;
  /** How big the sign is drawn on its card, 1 filling it. */
  scale: number;
  /** For grown-ups under the card. */
  caption: Localized;
  /** Said when it is picked. */
  answer: Localized;
}

export const STRENGTHS: Strength[] = [
  { id: "klein", scale: 0.42, caption: { de: "Ein bisschen" }, answer: { de: "Ein bisschen." } },
  { id: "mittel", scale: 0.68, caption: { de: "Mittel" }, answer: { de: "Schon ziemlich." } },
  { id: "gross", scale: 1, caption: { de: "Ganz doll" }, answer: { de: "Ganz doll!" } },
];

/** Read aloud when the three sizes come. */
export const STRENGTH_QUESTION: Localized = { de: "Wie doll ist es?" };

/** One slow breath, as long as the circle in `.mood-breath` (feelings.css) takes to grow and shrink. */
export const BREATH_MS = 5000;

/** Said when a hard feeling is big: first a breath together, before anything else. */
export const CALM_LINE: Localized = { de: "Komm, wir pusten zusammen. Puuuh." };

/** Under the picture while breathing together. */
export const CALM_CAPTION: Localized = { de: "Zusammen pusten" };

/** Said after the breaths. */
export const CALM_DONE: Localized = { de: "Schon besser." };

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

/** Read aloud when the three cards of what helps come. */
export const HELP_QUESTION: Localized = { de: "Was hilft dir jetzt?" };

/** Every line „Wie geht's dir?“ says in German, for the recordings list. */
export const MOOD_LINES: string[] = [
  MOOD_QUESTION.de,
  MOOD_ANSWER.de,
  FACE_LINE.de,
  STRENGTH_QUESTION.de,
  ...STRENGTHS.map((s) => s.answer.de),
  CALM_LINE.de,
  CALM_DONE.de,
];
