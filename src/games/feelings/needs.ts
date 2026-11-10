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
export type NeedId = "kuscheln" | "allein" | "toben" | "pusten" | "trinken" | "essen" | "ausruhen" | "lied" | "toilette" | "waerme" | "pflaster" | "luft";

/** The game's name (C-31, a game of its own since November 2026). */
export const NEEDS_TITLE: Localized = {
  de: "Was brauche ich?",
  en: "What do I need?",
  zh: "我需要什么？",
  hi: "मुझे क्या चाहिए?",
  es: "¿Qué necesito?",
  ar: "ماذا أحتاج؟",
  ru: "Что мне нужно?",
};

/** Its line for grown-ups. */
export const NEEDS_BLURB: Localized = {
  de: "Kuscheln, toben, trinken – was guttut",
  en: "Cuddling, romping, a drink – what helps",
  zh: "抱抱、跑跑跳跳、喝水——什么让人舒服",
  hi: "गले लगना, उछल-कूद, पानी – जो अच्छा लगे",
  es: "Abrazos, correr, beber: lo que hace bien",
  ar: "عناق ولعب وشرب – ما يريحنا",
  ru: "Обнять, порезвиться, попить — что помогает",
};

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

// The „Grundbedürfnisse“ (user wish, 9 November 2026): what a child needs in the day besides eating and drinking.
// Translated on request on 10 November 2026; their recordings come when the user asks (`languageStatus.ts`).
const BASIC_NEEDS: Need[] = [
  {
    id: "toilette",
    caption: { de: "Aufs Töpfchen", en: "Go potty", zh: "坐便盆", hi: "पॉटी जाना", es: "Ir al orinal", ar: "الذهاب إلى النونية", ru: "На горшок" },
    answer: {
      de: "Aufs Töpfchen gehen tut gut.",
      en: "Going potty feels good.",
      zh: "坐便盆真舒服。",
      hi: "पॉटी जाना अच्छा लगता है।",
      es: "Ir al orinal hace bien.",
      ar: "الذهاب إلى النونية يريحنا.",
      ru: "Сходить на горшок — это хорошо.",
    },
  },
  {
    id: "waerme",
    caption: { de: "Warm anziehen", en: "Bundle up", zh: "穿暖和", hi: "गरम कपड़े पहनना", es: "Abrigarse", ar: "ارتداء ملابس دافئة", ru: "Одеться потеплее" },
    answer: {
      de: "Warme Sachen tun gut.",
      en: "Warm clothes feel good.",
      zh: "穿暖和真舒服。",
      hi: "गरम कपड़े अच्छे लगते हैं।",
      es: "La ropa calentita hace bien.",
      ar: "الملابس الدافئة تريحنا.",
      ru: "Тёплая одежда — это хорошо.",
    },
  },
  {
    id: "pflaster",
    caption: { de: "Ein Pflaster", en: "A bandage", zh: "创可贴", hi: "एक पट्टी", es: "Una curita", ar: "لاصقة جروح", ru: "Пластырь" },
    answer: {
      de: "Ein Pflaster hilft.",
      en: "A bandage helps.",
      zh: "贴上创可贴就好多了。",
      hi: "पट्टी से आराम मिलता है।",
      es: "Una curita ayuda.",
      ar: "اللاصقة تساعدنا.",
      ru: "Пластырь помогает.",
    },
  },
  {
    id: "luft",
    caption: { de: "Frische Luft", en: "Fresh air", zh: "出去透透气", hi: "ताज़ी हवा", es: "Aire fresco", ar: "هواء نقي", ru: "Свежий воздух" },
    answer: {
      de: "Frische Luft tut gut.",
      en: "Fresh air feels good.",
      zh: "透透气真舒服。",
      hi: "ताज़ी हवा अच्छी लगती है।",
      es: "El aire fresco hace bien.",
      ar: "الهواء النقي يريحنا.",
      ru: "Свежий воздух — это хорошо.",
    },
  },
];

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
    caption: {
      de: "Stampfen und pusten",
      en: "Stomp and blow",
      zh: "跺跺脚，呼呼气",
      hi: "पैर पटकना और फूँक मारना",
      es: "Pisar fuerte y soplar",
      ar: "ضرب الأرض بالقدم والنفخ",
      ru: "Потопать и подуть",
    },
    answer: {
      de: "Stampfen und pusten tut gut.",
      en: "Stomping and blowing feels good.",
      zh: "跺跺脚、呼呼气真舒服。",
      hi: "पैर पटकना और फूँक मारना अच्छा लगता है।",
      es: "Pisar fuerte y soplar hace bien.",
      ar: "ضرب الأرض بالقدم والنفخ يريحنا.",
      ru: "Потопать и подуть — это хорошо.",
    },
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
  {
    id: "essen",
    caption: { de: "Etwas essen", en: "Eat something", zh: "吃点东西", hi: "कुछ खाना", es: "Comer algo", ar: "أكل شيء", ru: "Поесть" },
    answer: {
      de: "Etwas essen tut gut.",
      en: "Something to eat feels good.",
      zh: "吃点东西真舒服。",
      hi: "कुछ खाना अच्छा लगता है।",
      es: "Comer algo hace bien.",
      ar: "الأكل يريحنا.",
      ru: "Поесть — это хорошо.",
    },
  },
  {
    id: "ausruhen",
    caption: { de: "Ausruhen", en: "Rest", zh: "休息一会儿", hi: "आराम करना", es: "Descansar", ar: "الاستراحة", ru: "Отдохнуть" },
    answer: {
      de: "Ausruhen tut gut.",
      en: "Resting feels good.",
      zh: "休息一会儿真舒服。",
      hi: "आराम करना अच्छा लगता है।",
      es: "Descansar hace bien.",
      ar: "الاستراحة تريحنا.",
      ru: "Отдохнуть — это хорошо.",
    },
  },
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
  ...BASIC_NEEDS,
];

/** Read aloud when the cards come. */
export const NEEDS_QUESTION: Localized = {
  de: "Was brauchst du jetzt?",
  en: "What do you need right now?",
  zh: "你现在需要什么？",
  hi: "तुम्हें अभी क्या चाहिए?",
  es: "¿Qué necesitas ahora?",
  ar: "ماذا نحتاج الآن؟",
  ru: "Что тебе сейчас нужно?",
};

/** Every line „Was brauche ich?“ says, in all its languages. */
export const NEEDS_SAID: Localized[] = [NEEDS_QUESTION, ...NEEDS.map((n) => n.answer), CALM_LINE, CALM_DONE];

/** Every line „Was brauche ich?“ says in German, for the recordings list. */
export const NEEDS_LINES: string[] = NEEDS_SAID.map((line) => line.de);
