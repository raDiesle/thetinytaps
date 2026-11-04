import type { Localized } from "@/lib/language";
import type { TimerPicture } from "./settings";

/** The game's name, on its start screen, its spine on the shelf and in the browser tab. */
export const TIMER_TITLE: Localized = { de: "Timer", en: "Timer", zh: "计时器", hi: "टाइमर", es: "Temporizador", ar: "المؤقّت", ru: "Таймер" };

/** The pictures in their order on the start screen; „Weiter“ at the end goes on with the next, after the last the first. */
export const PICTURES: { id: TimerPicture; emoji: string; name: Localized }[] = [
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
  { id: "apple", emoji: "🍎", name: { de: "Apfelbaum" } },
  {
    id: "sand",
    emoji: "⏳",
    name: { de: "Sanduhr", en: "Hourglass", zh: "沙漏", hi: "रेत घड़ी", es: "Reloj de arena", ar: "الساعة الرملية", ru: "Песочные часы" },
  },
  { id: "caterpillar", emoji: "🐛", name: { de: "Raupe" } },
  { id: "candle", emoji: "🕯️", name: { de: "Kerze", en: "Candle", zh: "蜡烛", hi: "मोमबत्ती", es: "Vela", ar: "الشمعة", ru: "Свеча" } },
  { id: "disc", emoji: "🔴", name: { de: "Rote Scheibe" } },
];

/** The picture after `id`, after the last the first, for „Weiter“. */
export function nextPicture(id: TimerPicture): TimerPicture {
  const i = PICTURES.findIndex((p) => p.id === id);
  return PICTURES[(i + 1) % PICTURES.length].id;
}
