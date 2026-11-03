import type { Localized } from "@/lib/language";
import type { TimerPicture } from "./settings";

/** The game's name, on its start screen, its spine on the shelf and in the browser tab. */
export const TIMER_TITLE: Localized = { de: "Timer" };

/** The pictures in their order on the start screen; „Weiter“ at the end goes on with the next, after the last the first. */
export const PICTURES: { id: TimerPicture; emoji: string; name: Localized }[] = [
  { id: "train", emoji: "🚂", name: { de: "Zug zum Bahnhof" } },
  { id: "sand", emoji: "⏳", name: { de: "Sanduhr" } },
  { id: "candle", emoji: "🕯️", name: { de: "Kerze" } },
];

/** The picture after `id`, after the last the first, for „Weiter“. */
export function nextPicture(id: TimerPicture): TimerPicture {
  const i = PICTURES.findIndex((p) => p.id === id);
  return PICTURES[(i + 1) % PICTURES.length].id;
}
