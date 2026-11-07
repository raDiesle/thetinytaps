import type { Localized } from "@/lib/language";
import type { TimerPicture } from "./settings";

/** The game's name, on its start screen, its spine on the shelf and in the browser tab. */
export const TIMER_TITLE: Localized = { de: "Timer", en: "Timer", zh: "计时器", hi: "टाइमर", es: "Temporizador", ar: "المؤقّت", ru: "Таймер" };

/** „Abwechseln“, the picture of two children taking turns, and its options behind ⚙️. */
export const SWAP_NAME: Localized = { de: "Abwechseln", en: "Taking Turns", zh: "轮流", hi: "बारी-बारी", es: "Por turnos", ar: "بالتناوب", ru: "По очереди" };

/** „Andere Zeit“: the sheet for a time of one's own, and the way back to it when a clock time has passed. */
export const OTHER_TIME: Localized = {
  de: "Andere Zeit",
  en: "Different time",
  zh: "换个时间",
  hi: "दूसरा समय",
  es: "Otro tiempo",
  ar: "وقت آخر",
  ru: "Другое время",
};

/** „Bis morgen um 17:30“, when the clock time asked for has passed today. */
export const tomorrowAt = (at: string): Localized => ({
  de: `Bis morgen um ${at}`,
  en: `Until tomorrow at ${at}`,
  zh: `到明天 ${at}`,
  hi: `कल ${at} बजे तक`,
  es: `Hasta mañana a las ${at}`,
  ar: `حتى الغد الساعة ${at}`,
  ru: `До завтра, ${at}`,
});

/** The pictures in their order on the start screen; „Weiter“ at the end goes on with the next, after the last the first. */
export const PICTURES: { id: TimerPicture; emoji: string; name: Localized }[] = [
  // „Abwechseln“ first, on its own above the others (user feedback, November 2026): it is not a time running out but
  // turns going on and on, so it stands apart with a line saying so (`TURNS_GROUP`).
  { id: "swap", emoji: "🔁", name: SWAP_NAME },
  {
    id: "train",
    emoji: "🚂",
    name: {
      de: "Zug zum Bahnhof",
      en: "Train to the Station",
      zh: "开往车站的火车",
      hi: "स्टेशन की ओर ट्रेन",
      es: "Tren a la estación",
      ar: "القطار إلى المحطة",
      ru: "Поезд на станцию",
    },
  },
  { id: "apple", emoji: "🍎", name: { de: "Apfelbaum", en: "Apple Tree", zh: "苹果树", hi: "सेब का पेड़", es: "Manzano", ar: "شجرة التفاح", ru: "Яблоня" } },
  {
    id: "sand",
    emoji: "⏳",
    name: { de: "Sanduhr", en: "Hourglass", zh: "沙漏", hi: "रेत घड़ी", es: "Reloj de arena", ar: "الساعة الرملية", ru: "Песочные часы" },
  },
  { id: "caterpillar", emoji: "🐛", name: { de: "Raupe", en: "Caterpillar", zh: "毛毛虫", hi: "इल्ली", es: "Oruga", ar: "اليرقة", ru: "Гусеница" } },
  { id: "flower", emoji: "🌸", name: { de: "Blume", en: "Flower", zh: "小花", hi: "फूल", es: "Flor", ar: "الزهرة", ru: "Цветок" } },
  { id: "candle", emoji: "🕯️", name: { de: "Kerze", en: "Candle", zh: "蜡烛", hi: "मोमबत्ती", es: "Vela", ar: "الشمعة", ru: "Свеча" } },
  {
    id: "sunset",
    emoji: "🌅",
    // Renamed from „Sonnenuntergang“ when the picture turned into a sunrise (November 2026); its id stays, so a kept choice
    // still finds it. The old translations meant a sunset and were dropped until translations are asked for.
    name: { de: "Sonnenaufgang" },
  },
  {
    id: "ants",
    emoji: "🐜",
    name: { de: "Ameisenstraße", en: "Ant Trail", zh: "蚂蚁搬家", hi: "चींटियों की कतार", es: "Hilera de hormigas", ar: "طابور النمل", ru: "Муравьиная тропа" },
  },
  {
    id: "disc",
    emoji: "🔴",
    name: { de: "Rote Scheibe", en: "Red Disc", zh: "红色圆盘", hi: "लाल चक्र", es: "Disco rojo", ar: "القرص الأحمر", ru: "Красный круг" },
  },
  { id: "pizza", emoji: "🍕", name: { de: "Pizza", en: "Pizza", zh: "披萨", hi: "पिज़्ज़ा", es: "Pizza", ar: "البيتزا", ru: "Пицца" } },
];

/**
 * The line on „Abwechseln“'s card, first on the start screen, for grown-ups: it runs on without an end, and each child
 * gets its turn (user feedback, November 2026).
 */
export const SWAP_NOTE: Localized = { de: "Läuft ohne Ende, jeder ist mal dran" };

/** The pictures that run until the time is up, in their order: all but „Abwechseln“. */
export const TIMED_PICTURES = PICTURES.filter((p) => p.id !== "swap");

/**
 * The picture after `id` for „Weiter“: the next one that runs until the time is up, after the last the first – never
 * „Abwechseln“, which goes on without an end; from „Abwechseln“ the first.
 */
export function nextPicture(id: TimerPicture): TimerPicture {
  const i = TIMED_PICTURES.findIndex((p) => p.id === id);
  return TIMED_PICTURES[(i + 1) % TIMED_PICTURES.length].id;
}
