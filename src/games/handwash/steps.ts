import type { EnglishFirst } from "@/lib/language";

// The hand washing's steps in order, each as long as its verse will be – the way the user described it (25 November
// 2026): Mama calls that dinner is nearly ready, into the bathroom and up onto the step stool, sleeves up, soap into one
// hand and spread with the other everywhere (palm on palm, over each back, between the fingers), water on and feel how
// warm it is, rinse, water off, into the towel, and off to eat. Until the song is made (idea H-142, with Suno, in the
// same style as the Zahnputzlied, H-140) the steps last a fixed number of beats at the Zahnputzlied's tempo, 112 BPM,
// and a placeholder tune plays along: the rubbing lasts 40 beats, about 21 seconds – the 20 seconds of soap that hand
// washing asks for. Once the song is there, its .json of verse starts takes the place of `beats`.

/** One beat of the song to come, in ms (112 BPM, the tempo every sing-along helper shares, H-140). */
export const BEAT_MS = 60_000 / 112;

/** A step's id: also its part of the address (`?seite=`) and its class on the picture (`at-<id>`). */
export type StepId = "call" | "stool" | "sleeves" | "soap" | "palms" | "backs" | "backs2" | "between" | "water" | "rinse" | "off" | "towel" | "run";

/** A painted picture of the home, seen through the child's own eyes (`bilder/<id>.webp`, made by Gemini, H-141). */
export type PictureId = "ruf" | "bad" | "hocker" | "essen";

/** One step of the hand washing. */
export interface Step {
  id: StepId;
  /** How many beats it lasts, until the song's verses say. */
  beats: number;
  /** Its name, only in the progress bar's tooltip and read out – nothing is written on the picture. */
  name: EnglishFirst;
  /**
   * The painted pictures it shows instead of the close-up of the hands, in order (the second takes over halfway).
   * Without them the step plays at the basin.
   */
  pictures?: readonly PictureId[];
}

/** The rubbing steps: one hand soaps the other – palm on palm, over each back, between the fingers. */
export const RUB_STEPS: readonly StepId[] = ["palms", "backs", "backs2", "between"];

/** Every step, in order. */
export const STEPS: readonly Step[] = [
  {
    id: "call",
    beats: 8,
    pictures: ["ruf"],
    name: {
      en: "Dinner's nearly ready – wash your hands!",
      de: "Gleich gibt es Essen – Hände waschen!",
      zh: "快吃饭啦——去洗手！",
      hi: "खाना तैयार है – चलो हाथ धोएँ!",
      es: "¡Ya casi comemos! ¡A lavarse las manos!",
      ar: "الطعام جاهز تقريبًا – هيّا نغسل أيدينا!",
      ru: "Скоро кушать – моем руки!",
    },
  },
  {
    id: "stool",
    beats: 8,
    pictures: ["bad", "hocker"],
    name: {
      en: "Into the bathroom, up on the stool",
      de: "Ins Bad, auf den Tritthocker",
      zh: "去洗手间，站上小凳子",
      hi: "बाथरूम में, छोटे स्टूल पर चढ़ें",
      es: "Al baño y arriba al taburete",
      ar: "إلى الحمّام، ونصعد على الكرسي الصغير",
      ru: "В ванную, на стульчик",
    },
  },
  {
    id: "sleeves",
    beats: 4,
    name: { en: "Sleeves up", de: "Ärmel hoch", zh: "卷起袖子", hi: "बाँहें ऊपर करो", es: "Arriba las mangas", ar: "نرفع الأكمام", ru: "Рукава вверх" },
  },
  {
    id: "soap",
    beats: 6,
    name: {
      en: "Soap into one hand",
      de: "Seife in eine Hand",
      zh: "洗手液挤到手心",
      hi: "एक हथेली पर साबुन",
      es: "Jabón en una mano",
      ar: "صابون في يد واحدة",
      ru: "Мыло на ладошку",
    },
  },
  {
    id: "palms",
    beats: 12,
    name: {
      en: "Palm to palm",
      de: "Handflächen aneinander reiben",
      zh: "掌心搓掌心",
      hi: "हथेली से हथेली",
      es: "Palma con palma",
      ar: "كفّ على كفّ",
      ru: "Ладошка к ладошке",
    },
  },
  {
    id: "backs",
    beats: 8,
    name: {
      en: "Over the back of one hand",
      de: "Über den einen Handrücken",
      zh: "搓一只手背",
      hi: "एक हाथ का पिछला हिस्सा",
      es: "El dorso de una mano",
      ar: "على ظهر يد",
      ru: "Тыльная сторона одной ручки",
    },
  },
  {
    id: "backs2",
    beats: 8,
    name: {
      en: "Over the back of the other hand",
      de: "Über den anderen Handrücken",
      zh: "再搓另一只手背",
      hi: "दूसरे हाथ का पिछला हिस्सा",
      es: "El dorso de la otra mano",
      ar: "على ظهر اليد الأخرى",
      ru: "Тыльная сторона другой ручки",
    },
  },
  {
    id: "between",
    beats: 12,
    name: {
      en: "Between the fingers",
      de: "Zwischen den Fingern",
      zh: "搓指缝",
      hi: "उँगलियों के बीच",
      es: "Entre los dedos",
      ar: "بين الأصابع",
      ru: "Между пальчиками",
    },
  },
  {
    id: "water",
    beats: 10,
    name: {
      en: "Water on – feel how warm",
      de: "Wasser an – fühlen, wie warm",
      zh: "开水，摸摸水温",
      hi: "पानी चालू – देखें, कितना गरम",
      es: "Abrimos el agua: ¿está tibia?",
      ar: "نفتح الماء ونتحسّس حرارته",
      ru: "Включаем воду – тёплая?",
    },
  },
  {
    id: "rinse",
    beats: 10,
    name: { en: "Rinse off", de: "Abspülen", zh: "冲干净", hi: "धो डालो", es: "Enjuagamos", ar: "نشطف", ru: "Смываем" },
  },
  {
    id: "off",
    beats: 4,
    name: { en: "Water off", de: "Wasser aus", zh: "关水", hi: "पानी बंद", es: "Cerramos el agua", ar: "نغلق الماء", ru: "Выключаем воду" },
  },
  {
    id: "towel",
    beats: 10,
    name: {
      en: "Into the towel",
      de: "Ins Handtuch",
      zh: "用毛巾擦干",
      hi: "तौलिये से सुखाएँ",
      es: "A la toalla",
      ar: "نجفّف بالمنشفة",
      ru: "Вытираем полотенцем",
    },
  },
  {
    id: "run",
    beats: 8,
    pictures: ["essen"],
    name: { en: "Off to eat!", de: "Ab zum Essen!", zh: "去吃饭啦！", hi: "चलो खाना खाने!", es: "¡A comer!", ar: "هيّا نأكل!", ru: "Бежим кушать!" },
  },
];

/**
 * The steps played: in the built site a step whose painted pictures are not made yet is left out (players never see a
 * picture that isn't there, root CLAUDE.md), while the dev server plays it with its placeholder.
 */
export const playedSteps = (steps: readonly Step[], made: (picture: PictureId) => boolean, dev: boolean): readonly Step[] =>
  dev ? steps : steps.filter((step) => (step.pictures ?? []).every(made));

/** Where each step begins, in ms from the start, and the end of the last one after them. */
export const stepStarts = (steps: readonly Step[]): readonly number[] =>
  steps.reduce<number[]>((starts, step) => [...starts, starts[starts.length - 1] + step.beats * BEAT_MS], [0]);

/** The index of the step running at `ms` from the start (the last one once it is over). */
export const stepAt = (starts: readonly number[], ms: number) => {
  const next = starts.findIndex((start) => start > ms);
  return next < 0 ? starts.length - 2 : Math.max(0, next - 1);
};
