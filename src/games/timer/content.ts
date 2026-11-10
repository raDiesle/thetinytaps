import type { Localized } from "@/lib/language";
import type { TimerPicture, TurnPicture } from "./settings";

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
  // The order the user asked for (November 2026): the red disc Kitas know first, then the hourglass, the candle, the
  // apple tree, the flower and the pizza, then the alarm clock (H-70) and the rest; „Abwechseln“ last, in a group of its
  // own on the start screen (`TimerGame`).
  {
    id: "disc",
    emoji: "🔴",
    name: { de: "Rote Scheibe", en: "Red Disc", zh: "红色圆盘", hi: "लाल चक्र", es: "Disco rojo", ar: "القرص الأحمر", ru: "Красный круг" },
  },
  {
    id: "sand",
    emoji: "⏳",
    name: { de: "Sanduhr", en: "Hourglass", zh: "沙漏", hi: "रेत घड़ी", es: "Reloj de arena", ar: "الساعة الرملية", ru: "Песочные часы" },
  },
  { id: "candle", emoji: "🕯️", name: { de: "Kerze", en: "Candle", zh: "蜡烛", hi: "मोमबत्ती", es: "Vela", ar: "الشمعة", ru: "Свеча" } },
  { id: "apple", emoji: "🍎", name: { de: "Apfelbaum", en: "Apple Tree", zh: "苹果树", hi: "सेब का पेड़", es: "Manzano", ar: "شجرة التفاح", ru: "Яблоня" } },
  { id: "flower", emoji: "🌸", name: { de: "Blume", en: "Flower", zh: "小花", hi: "फूल", es: "Flor", ar: "الزهرة", ru: "Цветок" } },
  { id: "pizza", emoji: "🍕", name: { de: "Pizza", en: "Pizza", zh: "披萨", hi: "पिज़्ज़ा", es: "Pizza", ar: "البيتزا", ru: "Пицца" } },
  { id: "clock", emoji: "⏰", name: { de: "Wecker", en: "Alarm Clock", zh: "闹钟", hi: "अलार्म घड़ी", es: "Despertador", ar: "المنبّه", ru: "Будильник" } },
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
  { id: "caterpillar", emoji: "🐛", name: { de: "Raupe", en: "Caterpillar", zh: "毛毛虫", hi: "इल्ली", es: "Oruga", ar: "اليرقة", ru: "Гусеница" } },
  {
    id: "sunset",
    emoji: "🌅",
    // Renamed from „Sonnenuntergang“ when the picture turned into a sunrise (November 2026); its id stays, so a kept choice
    // still finds it. The old translations meant a sunset and were dropped; translated anew on 10 November 2026.
    name: { de: "Sonnenaufgang", en: "Sunrise", zh: "日出", hi: "सूर्योदय", es: "Amanecer", ar: "شروق الشمس", ru: "Восход" },
  },
  { id: "swap", emoji: "🔁", name: SWAP_NAME },
  // Taking turns at tennis (H-71, user request, November 2026), beside „Abwechseln“ in its group.
  { id: "tennis", emoji: "🎾", name: { de: "Tennis", en: "Tennis", zh: "网球", hi: "टेनिस", es: "Tenis", ar: "التنس", ru: "Теннис" } },
];

/**
 * The line on the cards of „Abwechseln“ and Tennis, last on the start screen, for grown-ups: they run on without an
 * end, and each child gets its turn (user feedback, November 2026).
 */
export const SWAP_NOTE: Localized = {
  de: "Läuft ohne Ende, jeder ist mal dran",
  en: "Runs without end, everyone gets a turn",
  zh: "不停地转，每人轮流",
  hi: "बिना रुके चलता है, सबकी बारी आती है",
  es: "Sigue sin parar, todos tienen su turno",
  ar: "يستمر بلا نهاية، ولكلٍّ دوره",
  ru: "Идёт без конца, каждый по очереди",
};

/** Whether a picture is one of taking turns, running on without end (`TurnPicture`). */
export const isTurns = (id: TimerPicture): id is TurnPicture => id === "swap" || id === "tennis";

/** The pictures that run until the time is up, in their order: all but those of taking turns. */
export const TIMED_PICTURES = PICTURES.filter((p) => !isTurns(p.id));

/**
 * The picture after `id` for „Weiter“: the next one that runs until the time is up, after the last the first – never
 * „Abwechseln“ or Tennis, which go on without an end; from them the first.
 */
export function nextPicture(id: TimerPicture): TimerPicture {
  const i = TIMED_PICTURES.findIndex((p) => p.id === id);
  return TIMED_PICTURES[(i + 1) % TIMED_PICTURES.length].id;
}
