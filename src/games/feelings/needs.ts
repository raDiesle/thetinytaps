// „Was brauche ich?“: the child shows what it needs or wants to do now – a hug, some time alone, romping, a drink …
// (user feedback, November 2026; before, C-31's three cards after a feeling). No card is wrong: the grown-up sees from
// the picture what to do, also when the child can't say it yet.

import type { Localized } from "@/lib/language";

/** One slow breath blown together: „Schon besser.“ comes after two of them. */
export const BREATH_MS = 5000;

/** Said when „Stampfen und pusten“ is picked: a breath blown together with the little bear. */
export const CALM_LINE: Localized = {
  de: "Komm, wir pusten zusammen. Puuuh.",
  en: "Come on, let's blow together. Phoooo.",
  zh: "来，我们一起呼气。呼——",
  hi: "आओ, साथ में फूँक मारें। फ़ूऊऊ।",
  es: "Ven, soplamos tú y yo. Fuuuh.",
  ar: "هيّا ننفخ معًا. فووو.",
  ru: "Давай подуем вместе. Фууух.",
};

/** Under the picture while breathing together. */
export const CALM_CAPTION: Localized = {
  de: "Zusammen pusten",
  en: "Blow together",
  zh: "一起呼气",
  hi: "साथ में फूँक मारना",
  es: "Soplar a la par",
  ar: "النفخ معًا",
  ru: "Подуть вместе",
};

/** Said after the breaths. */
export const CALM_DONE: Localized = {
  de: "Schon besser.",
  en: "That's better.",
  zh: "好多了。",
  hi: "अब बेहतर है।",
  es: "Ya está mejor.",
  ar: "أحسن الآن.",
  ru: "Уже лучше.",
};

/** What a child may need now; each has its card. */
export type NeedId = "kuscheln" | "allein" | "toben" | "pusten" | "trinken" | "essen" | "ausruhen" | "lied";

/** Its address. */
export const NEEDS_HREF = "/was-brauche-ich/";

/** The address of „Wie geht's dir?“, whose feeling screen links here and whose way back comes from here. */
export const MOOD_HREF = "/wie-gehts-dir/";

/** The router state „Wie geht's dir?“ passes when it opens this game: the page its way back leads to. */
export interface NeedsVisit {
  from: string;
}

/** Where this game's way back leads when „Wie geht's dir?“ opened it; none when opened from the book. */
export const needsCameFrom = (state: unknown): string | undefined => ((state as Partial<NeedsVisit> | null)?.from === MOOD_HREF ? MOOD_HREF : undefined);

/** The game's name (C-31, a game of its own since November 2026). German only so far: translations wait for the user. */
export const NEEDS_TITLE: Localized = { de: "Was brauche ich?" };

/** Its line for grown-ups. */
export const NEEDS_BLURB: Localized = { de: "Kuscheln, toben, trinken – was guttut" };

/** One thing the child may need or want to do. */
export interface Need {
  id: NeedId;
  /** What the card shows, as short as a button, for grown-ups under it. */
  caption: Localized;
  /** Said when it is picked: that it is a good idea. */
  answer: Localized;
  /** Done together rather than only said: `CALM_LINE`, two slow breaths, then `CALM_DONE` (stamping and blowing). */
  together?: boolean;
}

/** The needs in the order of their cards: comfort and quiet first, then moving, eating and drinking, resting, a song. */
export const NEEDS: Need[] = [
  {
    id: "kuscheln",
    caption: { de: "In den Arm nehmen", en: "A hug", zh: "抱一抱", hi: "गले लगाना", es: "Un abrazo", ar: "عناق", ru: "Обнять" },
    answer: {
      de: "Kuscheln tut gut.",
      en: "Cuddling feels good.",
      zh: "抱抱真舒服。",
      hi: "गले लगना अच्छा लगता है।",
      es: "Los abrazos hacen bien.",
      ar: "العناق يريحنا.",
      ru: "Обниматься — это хорошо.",
    },
  },
  {
    id: "allein",
    caption: {
      de: "Ein bisschen allein sein",
      en: "Some time alone",
      zh: "自己待一会儿",
      hi: "थोड़ी देर अकेले रहना",
      es: "Un ratito a solas",
      ar: "وقت قصير على انفراد",
      ru: "Немного уединиться",
    },
    answer: {
      de: "Ein bisschen Ruhe tut gut.",
      en: "A little quiet feels good.",
      zh: "安静一会儿真舒服。",
      hi: "थोड़ी शांति अच्छी लगती है।",
      es: "Un poco de calma hace bien.",
      ar: "قليل من الهدوء يريحنا.",
      ru: "Немного тишины — это хорошо.",
    },
  },
  {
    id: "toben",
    caption: { de: "Toben", en: "Romp around", zh: "跑跑跳跳", hi: "उछल-कूद", es: "Correr y brincar", ar: "اللعب والقفز", ru: "Порезвиться" },
    answer: {
      de: "Toben tut gut.",
      en: "Romping around feels good.",
      zh: "跑跑跳跳真舒服。",
      hi: "उछल-कूद करना अच्छा लगता है।",
      es: "Correr y brincar hace bien.",
      ar: "اللعب والقفز يريحنا.",
      ru: "Порезвиться — это хорошо.",
    },
  },
  {
    id: "pusten",
    // The bear stamps and blows the feeling out at once, the breath seen (user feedback, November 2026).
    caption: { de: "Stampfen und pusten" },
    answer: { de: "Stampfen und pusten tut gut." },
    together: true,
  },
  {
    id: "trinken",
    caption: { de: "Etwas trinken", en: "Have a drink", zh: "喝点水", hi: "कुछ पीना", es: "Tomar algo", ar: "شرب شيء", ru: "Попить" },
    answer: {
      de: "Ein Schluck Wasser tut gut.",
      en: "A sip of water feels good.",
      zh: "喝口水真舒服。",
      hi: "पानी का एक घूँट अच्छा लगता है।",
      es: "Un trago de agua hace bien.",
      ar: "رشفة ماء تريحنا.",
      ru: "Глоток воды — это хорошо.",
    },
  },
  { id: "essen", caption: { de: "Etwas essen" }, answer: { de: "Etwas essen tut gut." } },
  { id: "ausruhen", caption: { de: "Ausruhen" }, answer: { de: "Ausruhen tut gut." } },
  {
    id: "lied",
    caption: { de: "Ein Lied singen", en: "Sing a song", zh: "唱首歌", hi: "गाना गाना", es: "Cantar una canción", ar: "غناء أغنية", ru: "Спеть песенку" },
    answer: {
      de: "Ein Lied tut gut.",
      en: "A song feels good.",
      zh: "唱首歌真舒服。",
      hi: "गाना गाना अच्छा लगता है।",
      es: "Una canción hace bien.",
      ar: "الأغنية تريحنا.",
      ru: "Песенка — это хорошо.",
    },
  },
];

/** Read aloud when the cards come. */
export const NEEDS_QUESTION: Localized = { de: "Was brauchst du jetzt?" };

/** Every line „Was brauche ich?“ says in German, for the recordings list. */
export const NEEDS_LINES: string[] = [NEEDS_QUESTION.de, ...NEEDS.map((n) => n.answer.de), CALM_LINE.de, CALM_DONE.de];
