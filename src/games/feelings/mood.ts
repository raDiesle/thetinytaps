// Wie geht's dir heute? The child picks the card that shows how it feels: the little bear alone with the feeling, in a
// moment that brings it (a birthday cake, a tower built, lightning outside – user feedback, November 2026), the
// pleasant feelings apart from the unpleasant ones. Picked, the bear stands big and the child slides how strong it is:
// his gestures grow with it (C-36). Copying the faces („Gefühle nachmachen“) and what helps („Was brauche ich?“) are
// games of their own in the book.

import type { MascotBrows, MascotEyes, MascotMouth } from "@/components/Mascot";
import { type Daytime, dayKey, daytimeOf } from "@/games/teeth/daytime";
import type { Localized } from "@/lib/language";

export type MoodId = "froh" | "stolz" | "aufgeregt" | "ruhig" | "muede" | "traurig" | "wuetend" | "angst";

/** The face the little bear makes, drawn with the shared `MascotHead`: to copy, and on the slider's figure at its strongest. */
export interface MoodFace {
  eyes: MascotEyes;
  mouth: MascotMouth;
  brows: MascotBrows;
  /** Degrees the head tips: a proud chin goes up. */
  tilt?: number;
}

/** One feeling to pick. Every feeling is shown by the same little bear (user feedback, November 2026). */
export interface Mood {
  id: MoodId;
  /** A pleasant feeling (glad, proud, excited, calm) or an unpleasant one (tired, sad, angry, scared): two groups on the screen. */
  pleasant: boolean;
  /** Its name, for grown-ups under the card. */
  caption: Localized;
  face: MoodFace;
  /** The moment its picture shows, in German for grown-ups looking at the card's idea (bilder/README.md). */
  moment: string;
}

/** The feelings in the order of their cards: the pleasant ones first, then the unpleasant ones. */
export const MOODS: Mood[] = [
  {
    id: "froh",
    pleasant: true,
    caption: { de: "Fröhlich", en: "Happy", zh: "开心", hi: "खुश", es: "Alegría", ar: "فرح", ru: "Радость" },
    face: { eyes: "happy", mouth: "open", brows: "soft" },
    moment: "Ein Geburtstagskuchen steht vor ihm",
  },
  {
    id: "stolz",
    pleasant: true,
    caption: { de: "Stolz", en: "Proud", zh: "骄傲", hi: "गर्व", es: "Orgullo", ar: "فخر", ru: "Гордость" },
    face: { eyes: "happy", mouth: "smile", brows: "up", tilt: -12 },
    moment: "Neben dem Turm, den er gebaut hat",
  },
  {
    id: "aufgeregt",
    pleasant: true,
    caption: { de: "Aufgeregt", en: "Excited", zh: "激动", hi: "उत्साह", es: "Emoción", ar: "حماس", ru: "Волнение" },
    face: { eyes: "wide", mouth: "open", brows: "up" },
    moment: "Er wartet an der offenen Haustür",
  },
  {
    id: "ruhig",
    pleasant: true,
    caption: { de: "Ruhig", en: "Calm", zh: "平静", hi: "शांत", es: "Calma", ar: "هدوء", ru: "Спокойствие" },
    face: { eyes: "shut", mouth: "smile", brows: "soft" },
    moment: "Er sitzt auf der Wiese, ein Schmetterling auf seiner Pfote",
  },
  {
    id: "muede",
    pleasant: false,
    caption: { de: "Müde", en: "Tired", zh: "困了", hi: "थकान", es: "Cansancio", ar: "تعب", ru: "Усталость" },
    face: { eyes: "half", mouth: "o", brows: "soft" },
    moment: "Er liegt auf dem Bett und gähnt",
  },
  {
    id: "traurig",
    pleasant: false,
    caption: { de: "Traurig", en: "Sad", zh: "难过", hi: "उदास", es: "Tristeza", ar: "حزن", ru: "Грусть" },
    face: { eyes: "open", mouth: "frown", brows: "sad" },
    moment: "Sein Spielzeugflugzeug ist kaputtgegangen",
  },
  {
    id: "wuetend",
    pleasant: false,
    caption: { de: "Wütend", en: "Angry", zh: "生气", hi: "गुस्सा", es: "Enojo", ar: "غضب", ru: "Злость" },
    face: { eyes: "open", mouth: "frown", brows: "angry" },
    moment: "Der Lutscher liegt oben im Regal, zu hoch für ihn",
  },
  {
    id: "angst",
    pleasant: false,
    caption: { de: "Ängstlich", en: "Scared", zh: "害怕", hi: "डर", es: "Miedo", ar: "خوف", ru: "Страх" },
    face: { eyes: "wide", mouth: "o", brows: "sad" },
    moment: "Draußen blitzt und donnert es",
  },
];

/** Over the pleasant feelings' group, small, for grown-ups. */
export const PLEASANT: Localized = { de: "Angenehme Gefühle" };
/** Over the unpleasant feelings' group. */
export const UNPLEASANT: Localized = { de: "Unangenehme Gefühle" };

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

/** How many steps the slider of „Wie doll ist es?“ has (C-36): from a little (0) to a whole lot (`STRENGTH_STEPS - 1`). */
export const STRENGTH_STEPS = 5;

/** Said when the slider is let go: a little, quite a lot or a whole lot, no numbers. */
export const STRENGTH_ANSWERS: [Localized, Localized, Localized] = [
  { de: "Ein bisschen.", en: "A little.", zh: "有一点点。", hi: "थोड़ा-सा।", es: "Un poquito.", ar: "قليلًا.", ru: "Чуть-чуть." },
  { de: "Schon ziemlich.", en: "Quite a lot.", zh: "挺强的。", hi: "काफ़ी ज़्यादा।", es: "Bastante.", ar: "إلى حدّ ما.", ru: "Довольно сильно." },
  { de: "Ganz doll!", en: "A whole lot!", zh: "特别强！", hi: "बहुत ज़्यादा!", es: "¡Muchísimo!", ar: "كثيرًا جدًّا!", ru: "Очень сильно!" },
];

/** The answer for slider step `step`: the two lowest a little, the middle quite a lot, the two highest a whole lot. */
export const strengthAnswer = (step: number) => STRENGTH_ANSWERS[step <= 1 ? 0 : step === 2 ? 1 : 2];

/** Read aloud when a feeling is picked and its slider comes. */
export const STRENGTH_QUESTION: Localized = {
  de: "Wie doll ist es?",
  en: "How strong is it?",
  zh: "有多强烈？",
  hi: "यह कितना ज़्यादा है?",
  es: "¿Qué tan fuerte es?",
  ar: "كم هو قوي؟",
  ru: "Насколько сильно?",
};

/** Every line „Wie geht's dir?“ says in German, for the recordings list. */
export const MOOD_LINES: string[] = [MOOD_QUESTION.de, STRENGTH_QUESTION.de, ...STRENGTH_ANSWERS.map((a) => a.de)];

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

/** On the card of the feeling picked this morning, in the evening, for grown-ups (in its caption): feelings come and go (C-33). */
export const THIS_MORNING: Localized = {
  de: "Heute früh",
  en: "This morning",
  zh: "今天早上",
  hi: "आज सुबह",
  es: "Esta mañana",
  ar: "صباح اليوم",
  ru: "Сегодня утром",
};
