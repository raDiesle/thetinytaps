import type { Localized, Texts } from "@/lib/language";
import type { TimerPicture, TurnPicture } from "./settings";
import { BLOCKS_NAME } from "./blocksNames";
import { TUNNEL_NAME } from "./tunnelNames";
import { LIFT_NAME } from "./liftNames";
import { JAR_NAME } from "./jarNames";
import { MARBLE_NAME } from "./marbleNames";
import { RACE_NAME } from "./raceNames";
import { TIDY_NAME } from "./tidyNames";

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
export const PICTURES: { id: TimerPicture; emoji: string; name: Texts }[] = [
  // The order the user asked for (November 2026, last changed 25 November 2026): the red disc Kitas know first, then the
  // hourglass, the apple tree, the alarm clock (H-70), the flower, Lift to the Top, the pizza, the candle, Tidy Up and
  // the rest; „Abwechseln“ last, in a group of its own on the start screen (`TimerGame`).
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
  { id: "apple", emoji: "🍎", name: { de: "Apfelbaum", en: "Apple Tree", zh: "苹果树", hi: "सेब का पेड़", es: "Manzano", ar: "شجرة التفاح", ru: "Яблоня" } },
  { id: "clock", emoji: "⏰", name: { de: "Wecker", en: "Alarm Clock", zh: "闹钟", hi: "अलार्म घड़ी", es: "Despertador", ar: "المنبّه", ru: "Будильник" } },
  { id: "flower", emoji: "🌸", name: { de: "Blume", en: "Flower", zh: "小花", hi: "फूल", es: "Flor", ar: "الزهرة", ru: "Цветок" } },
  // Lift to the Top (H-127, id `jump`: „Up to the Moon“ until 26 November 2026; sixth, so it starts the second row of five most screens show, user request, 25 November 2026): one tower with a big glass lift riding up, its red dot-matrix display counting the floors up to a hundred, never more than one a second, and the top floor's door opening at the end (its flag taken out, 27 November 2026).
  { id: "jump", emoji: "🛗", name: LIFT_NAME },
  { id: "pizza", emoji: "🍕", name: { de: "Pizza", en: "Pizza", zh: "披萨", hi: "पिज़्ज़ा", es: "Pizza", ar: "البيتزا", ru: "Пицца" } },
  { id: "candle", emoji: "🕯️", name: { de: "Kerze", en: "Candle", zh: "蜡烛", hi: "मोमबत्ती", es: "Vela", ar: "الشمعة", ru: "Свеча" } },
  // Tidy Up (H-118): a toy crane puts the toys into the box, best at five minutes; written English first, translated on 22 November 2026.
  { id: "tidy", emoji: "🧸", name: TIDY_NAME },
  // Five Boxes (H-120) stood here and was taken out again (user request, 25 November 2026).
  // The block house (H-125, 22 November 2026), the first timer like a game played by itself: blocks hop out of a jumble into a house.
  { id: "blocks", emoji: "🧱", name: BLOCKS_NAME },
  // The treasure tunnel (H-126, 22 November 2026), the second like a block world played by itself: a tunnel dug block by block to a chest.
  { id: "tunnel", emoji: "⛏️", name: TUNNEL_NAME },
  // „Zug zum Bahnhof“ stood here and was taken out (user request, 25 November 2026).
  { id: "caterpillar", emoji: "🐛", name: { de: "Raupe", en: "Caterpillar", zh: "毛毛虫", hi: "इल्ली", es: "Oruga", ar: "اليرقة", ru: "Гусеница" } },
  {
    id: "sunset",
    emoji: "🌅",
    // Renamed from „Sonnenuntergang“ when the picture turned into a sunrise (November 2026); its id stays, so a kept choice
    // still finds it. The old translations meant a sunset and were dropped; translated anew on 10 November 2026.
    name: { de: "Sonnenaufgang", en: "Sunrise", zh: "日出", hi: "सूर्योदय", es: "Amanecer", ar: "شروق الشمس", ru: "Восход" },
  },
  // Marble Jar (H-149, 24 November 2026): marbles bounce down a pegboard like Kettenreaktion's and fill a glass jar.
  { id: "jar", emoji: "🫙", name: JAR_NAME },
  { id: "swap", emoji: "🔁", name: SWAP_NAME },
  // Tennis (H-71) and the Wippe (H-109) stood here and were taken out again (user requests, 21 and 25 November 2026).
  // The Kugelbahn (H-117 with H-115, 24 November 2026): two to four children, a marble rolling into the next one's cup.
  { id: "marblerun", emoji: "🎱", name: MARBLE_NAME },
  // The Rennstrecke (user request, 24 November 2026): the fox and the bear child drive a lap of an eight in turns.
  { id: "race", emoji: "🏎️", name: RACE_NAME },
];

/**
 * The line on the card of „Abwechseln“, last on the start screen, for grown-ups: it runs on without an
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
export const isTurns = (id: TimerPicture): id is TurnPicture => id === "swap" || id === "marblerun" || id === "race";

/** The pictures that run until the time is up, in their order: all but those of taking turns. */
export const TIMED_PICTURES = PICTURES.filter((p) => !isTurns(p.id));

/**
 * The picture after `id` for „Weiter“: the next one that runs until the time is up, after the last the first – never
 * „Abwechseln“, the Kugelbahn or the Rennstrecke, which go on without an end; from them the first.
 */
export function nextPicture(id: TimerPicture): TimerPicture {
  const i = TIMED_PICTURES.findIndex((p) => p.id === id);
  return TIMED_PICTURES[(i + 1) % TIMED_PICTURES.length].id;
}
