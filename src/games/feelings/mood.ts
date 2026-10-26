// Wie geht's dir heute? The child picks the weather that fits how it feels; the
// bear says he knows that too, and then his own story with that feeling shows
// what helps. Grown-ups learn on the way how the child is doing.

import type { Localized } from "@/lib/language";
import type { FeelingId } from "./bear";

/** The mode on the start screen that begins with the weather pictures. */
export const MOOD_ID = "mood";

export type WeatherId = "sonne" | "wolke" | "regen" | "gewitter";

/** One weather card: the bear under that weather, feeling the same. */
export interface Weather {
  id: WeatherId;
  /** What the card shows, for grown-ups under it, in every language the game speaks. */
  caption: Localized;
  /** The bear's story that is played next. */
  feeling: FeelingId;
  /** Floats up when it is picked. */
  float: string;
}

export const WEATHERS: Weather[] = [
  { id: "sonne", caption: { de: "Sonne, fröhlich", ru: "Солнце, весело" }, feeling: "happy", float: "☀️" },
  { id: "wolke", caption: { de: "Wolke, müde", ru: "Облако, сонно" }, feeling: "tired", float: "☁️" },
  { id: "regen", caption: { de: "Regen, traurig", ru: "Дождь, грустно" }, feeling: "sad", float: "💧" },
  { id: "gewitter", caption: { de: "Gewitter, wütend", ru: "Гроза, сердито" }, feeling: "angry", float: "⚡" },
];

/** Read aloud when the weather cards come. */
export const MOOD_QUESTION: Localized = { de: "Wie geht's dir heute?", ru: "Как ты сегодня?" };

/** The bear's answer to any weather. */
export const MOOD_ANSWER: Localized = { de: "Das kenne ich auch!", ru: "Мне тоже так бывает!" };
