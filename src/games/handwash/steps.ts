import type { EnglishFirst } from "@/lib/language";

// The hand washing's steps in order, each as long as its verse will be. Until the song is made (idea H-142, with Suno,
// in the same style as the Zahnputzlied, H-140) the steps last a fixed number of beats at the Zahnputzlied's tempo,
// 112 BPM, and a placeholder tune plays along: the rubbing lasts 40 beats, about 21 seconds – the 20 seconds of soap
// that hand washing asks for. Once the song is there, its .json of verse starts takes the place of `beats`.

/** One beat of the song to come, in ms (112 BPM, the tempo every sing-along helper shares, H-140). */
export const BEAT_MS = 60_000 / 112;

/** A step's id: also its part of the address (`?seite=`) and its class on the picture (`at-<id>`). */
export type StepId = "sleeves" | "water" | "wet" | "soap" | "palms" | "backs" | "between" | "thumbs" | "tips" | "rinse" | "towel" | "shine";

/** One step of the hand washing. */
export interface Step {
  id: StepId;
  /** How many beats it lasts, until the song's verses say. */
  beats: number;
  /** Its name, only in the progress bar's tooltip and read out – nothing is written on the picture. */
  name: EnglishFirst;
}

/** The rubbing steps, as learned in the Kita: palms, backs, between the fingers, thumbs, fingertips. */
export const RUB_STEPS: readonly StepId[] = ["palms", "backs", "between", "thumbs", "tips"];

/** Every step, in order. */
export const STEPS: readonly Step[] = [
  {
    id: "sleeves",
    beats: 4,
    name: { en: "Sleeves up", de: "Ärmel hoch", zh: "卷起袖子", hi: "बाँहें ऊपर करो", es: "Arriba las mangas", ar: "نرفع الأكمام", ru: "Рукава вверх" },
  },
  {
    id: "water",
    beats: 4,
    name: { en: "Water on", de: "Wasser an", zh: "打开水龙头", hi: "पानी चालू", es: "Abrimos el agua", ar: "نفتح الماء", ru: "Включаем воду" },
  },
  {
    id: "wet",
    beats: 4,
    name: { en: "Hands wet", de: "Hände nass machen", zh: "把手弄湿", hi: "हाथ गीले करो", es: "Mojamos las manos", ar: "نبلّل اليدين", ru: "Мочим ручки" },
  },
  {
    id: "soap",
    beats: 4,
    name: { en: "Some soap", de: "Seife drauf", zh: "挤点洗手液", hi: "थोड़ा साबुन", es: "Un poco de jabón", ar: "قليل من الصابون", ru: "Немного мыла" },
  },
  {
    id: "palms",
    beats: 8,
    name: {
      en: "Palm to palm",
      de: "Handflächen reiben",
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
      en: "Backs of the hands",
      de: "Handrücken",
      zh: "搓手背",
      hi: "हाथ का पिछला हिस्सा",
      es: "El dorso de las manos",
      ar: "ظهر اليدين",
      ru: "Тыльная сторона",
    },
  },
  {
    id: "between",
    beats: 8,
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
    id: "thumbs",
    beats: 8,
    name: { en: "Thumbs", de: "Daumen", zh: "搓大拇指", hi: "अँगूठे", es: "Los pulgares", ar: "الإبهامان", ru: "Большие пальчики" },
  },
  {
    id: "tips",
    beats: 8,
    name: {
      en: "Fingertips",
      de: "Fingerspitzen",
      zh: "搓指尖",
      hi: "उँगलियों के सिरे",
      es: "Las puntas de los dedos",
      ar: "أطراف الأصابع",
      ru: "Кончики пальчиков",
    },
  },
  {
    id: "rinse",
    beats: 8,
    name: { en: "Rinse off", de: "Abspülen", zh: "冲干净", hi: "धो डालो", es: "Enjuagamos", ar: "نشطف", ru: "Смываем" },
  },
  {
    id: "towel",
    beats: 6,
    name: {
      en: "Water off, towel",
      de: "Wasser aus, abtrocknen",
      zh: "关水，擦干",
      hi: "पानी बंद, तौलिया",
      es: "Cerramos el agua, toalla",
      ar: "نغلق الماء، والمنشفة",
      ru: "Воду выключаем, вытираем",
    },
  },
  {
    id: "shine",
    beats: 8,
    name: { en: "Clean hands!", de: "Saubere Hände!", zh: "小手干净啦！", hi: "साफ़ हाथ!", es: "¡Manos limpias!", ar: "يدان نظيفتان!", ru: "Чистые ручки!" },
  },
];

/** Where each step begins, in ms from the start, and the end of the last one after them. */
export const STEP_STARTS: readonly number[] = STEPS.reduce<number[]>((starts, step) => [...starts, starts[starts.length - 1] + step.beats * BEAT_MS], [0]);

/** How long the whole washing lasts, in ms. */
export const TOTAL_MS = STEP_STARTS[STEPS.length];

/** The index of the step running at `ms` from the start (the last one once it is over). */
export const stepAt = (ms: number) => {
  const next = STEP_STARTS.findIndex((start) => start > ms);
  return next < 0 ? STEPS.length - 1 : Math.max(0, next - 1);
};
