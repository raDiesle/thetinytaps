// Wie geht's dir heute? The child picks the face that shows how it feels: a fox or bear child with Mama or Papa
// beside it (idea C-30), eight feelings (C-29). The grown-up in the picture takes it in its arms, the little one shows
// the face big to copy (C-35), the child shows how strong it is on a weather sign in three sizes (C-36) – a big hard
// feeling first gets a breath blown together –, then picks what helps (C-31), and the scenes of that feeling follow.
// Grown-ups learn on the way how the child is doing.

import type { MascotBrows, MascotEyes, MascotKind, MascotMouth } from "@/components/Mascot";
import { type Daytime, dayKey, daytimeOf } from "@/games/teeth/daytime";
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
  /** Its name, for grown-ups under the card. */
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
    caption: { de: "Fröhlich", en: "Happy", zh: "开心", hi: "खुश", es: "Alegría", ar: "فرح", ru: "Радость" },
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
    caption: { de: "Stolz", en: "Proud", zh: "骄傲", hi: "गर्व", es: "Orgullo", ar: "فخر", ru: "Гордость" },
    face: { eyes: "happy", mouth: "smile", brows: "up", tilt: -12 },
    sky: "regenbogen",
    hard: false,
    group: "freude",
    helps: ["toben", "lied", "kuscheln"],
  },
  {
    id: "aufgeregt",
    kind: "fox",
    caption: { de: "Aufgeregt", en: "Excited", zh: "激动", hi: "उत्साह", es: "Emoción", ar: "حماس", ru: "Волнение" },
    face: { eyes: "wide", mouth: "open", brows: "up" },
    sky: "wind",
    hard: true,
    group: "freude",
    helps: ["toben", "trinken", "allein"],
  },
  {
    id: "ruhig",
    kind: "bear",
    caption: { de: "Ruhig", en: "Calm", zh: "平静", hi: "शांत", es: "Calma", ar: "هدوء", ru: "Спокойствие" },
    face: { eyes: "shut", mouth: "smile", brows: "soft" },
    sky: "schnee",
    hard: false,
    group: "freude",
    helps: ["kuscheln", "lied", "allein"],
  },
  {
    id: "muede",
    kind: "bear",
    caption: { de: "Müde", en: "Tired", zh: "困了", hi: "थकान", es: "Cansancio", ar: "تعب", ru: "Усталость" },
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
    caption: { de: "Traurig", en: "Sad", zh: "难过", hi: "उदास", es: "Tristeza", ar: "حزن", ru: "Грусть" },
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
    caption: { de: "Wütend", en: "Angry", zh: "生气", hi: "गुस्सा", es: "Enojo", ar: "غضب", ru: "Злость" },
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
    caption: { de: "Ängstlich", en: "Scared", zh: "害怕", hi: "डर", es: "Miedo", ar: "خوف", ru: "Страх" },
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
export const HUG_CAPTION: Localized = { de: "In den Arm nehmen", en: "A hug", zh: "抱一抱", hi: "गले लगाना", es: "Un abrazo", ar: "عناق", ru: "Обнять" };

/** Said while the little one shows the face big (C-35): the child copies it, for a mirror or the grown-up. */
export const FACE_LINE: Localized = {
  de: "Kannst du auch so gucken?",
  en: "Can you make this face too?",
  zh: "你也能做这个表情吗？",
  hi: "चलो, तुम भी ऐसा चेहरा बनाओ!",
  es: "¿Puedes poner esta cara tú también?",
  ar: "هيّا نصنع هذا الوجه نحن أيضًا!",
  ru: "А ты так можешь?",
};

/** Under the big face. */
export const FACE_CAPTION: Localized = {
  de: "Gesicht nachmachen",
  en: "Copy the face",
  zh: "学一学表情",
  hi: "चेहरे की नकल करना",
  es: "Imitar la cara",
  ar: "تقليد الوجه",
  ru: "Сделать такое же лицо",
};

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
  {
    id: "klein",
    scale: 0.42,
    caption: { de: "Ein bisschen", en: "A little", zh: "一点点", hi: "थोड़ा-सा", es: "Un poquito", ar: "قليلًا", ru: "Чуть-чуть" },
    answer: { de: "Ein bisschen.", en: "A little.", zh: "有一点点。", hi: "थोड़ा-सा।", es: "Un poquito.", ar: "قليلًا.", ru: "Чуть-чуть." },
  },
  {
    id: "mittel",
    scale: 0.68,
    caption: { de: "Mittel", en: "In between", zh: "中等", hi: "बीच का", es: "Más o menos", ar: "متوسط", ru: "Средне" },
    answer: { de: "Schon ziemlich.", en: "Quite a lot.", zh: "挺强的。", hi: "काफ़ी ज़्यादा।", es: "Bastante.", ar: "إلى حدّ ما.", ru: "Довольно сильно." },
  },
  {
    id: "gross",
    scale: 1,
    caption: { de: "Ganz doll", en: "A lot", zh: "特别强", hi: "बहुत ज़्यादा", es: "Muchísimo", ar: "كثيرًا جدًّا", ru: "Очень сильно" },
    answer: { de: "Ganz doll!", en: "A whole lot!", zh: "特别强！", hi: "बहुत ज़्यादा!", es: "¡Muchísimo!", ar: "كثيرًا جدًّا!", ru: "Очень сильно!" },
  },
];

/** Read aloud when the three sizes come. */
export const STRENGTH_QUESTION: Localized = {
  de: "Wie doll ist es?",
  en: "How strong is it?",
  zh: "有多强烈？",
  hi: "यह कितना ज़्यादा है?",
  es: "¿Qué tan fuerte es?",
  ar: "كم هو قوي؟",
  ru: "Насколько сильно?",
};

/** One slow breath, as long as the circle in `.mood-breath` (feelings.css) takes to grow and shrink. */
export const BREATH_MS = 5000;

/** Said when a hard feeling is big: first a breath together, before anything else. */
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

/** The things that can help, by id. */
export const HELPS: Record<HelpId, Help> = {
  kuscheln: {
    id: "kuscheln",
    caption: { de: "Kuscheln", en: "Cuddle", zh: "抱抱", hi: "गले लगना", es: "Abrazos", ar: "العناق", ru: "Обниматься" },
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
  toben: {
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
  trinken: {
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
  allein: {
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
  lied: {
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
};

/** Read aloud when the three cards of what helps come. */
export const HELP_QUESTION: Localized = {
  de: "Was hilft dir jetzt?",
  en: "What helps you now?",
  zh: "现在什么能帮到你？",
  hi: "अभी तुम्हें किससे मदद मिलेगी?",
  es: "¿Qué te ayuda ahora?",
  ar: "ما الذي يساعدنا الآن؟",
  ru: "Что тебе сейчас поможет?",
};

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

/** The feelings picked today, in the morning and in the evening (C-33): kept on this device only, today's alone. */
export type MoodDay = { day: string } & Partial<Record<Daytime, MoodId>>;

/** v2 since the eight feelings: v1 kept the four weathers' ids. */
const MOOD_DAY_KEY = "tinytaps.mood.day.v2";

/** Today with `mood` picked at `now`'s time of day (before two o'clock the morning, as for brushing); yesterday is dropped. */
export function withMood(day: MoodDay | undefined, mood: MoodId, now: Date): MoodDay {
  const today = dayKey(now);
  return { ...(day?.day === today ? day : { day: today }), [daytimeOf(now)]: mood };
}

/** In the evening, the feeling picked this morning – shown beside the evening's, so the child sees feelings come and go. */
export const morningMood = (day: MoodDay | undefined, now: Date): MoodId | undefined =>
  daytimeOf(now) === "evening" && day?.day === dayKey(now) ? day.morning : undefined;

/** Today's feelings as saved, if any. */
export function loadMoodDay(): MoodDay | undefined {
  try {
    const raw = localStorage.getItem(MOOD_DAY_KEY);
    return raw ? (JSON.parse(raw) as MoodDay) : undefined;
  } catch {
    return undefined;
  }
}

/** Keeps today's feelings for the evening. */
export function saveMoodDay(day: MoodDay) {
  try {
    localStorage.setItem(MOOD_DAY_KEY, JSON.stringify(day));
  } catch {
    // No storage: the evening then shows only its own feeling.
  }
}

/** Over the morning's feeling in the evening, for grown-ups (the captions under the cards). */
export const THIS_MORNING: Localized = {
  de: "Heute früh",
  en: "This morning",
  zh: "今天早上",
  hi: "आज सुबह",
  es: "Esta mañana",
  ar: "صباح اليوم",
  ru: "Сегодня утром",
};
/** Over the feeling just picked, beside the morning's. */
export const NOW: Localized = { de: "Jetzt", en: "Now", zh: "现在", hi: "अभी", es: "Ahora", ar: "الآن", ru: "Сейчас" };
