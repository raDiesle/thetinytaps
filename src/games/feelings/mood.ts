// Wie geht's dir heute? The child picks the weather that fits how it feels; the
// bear says he knows that too, and then his own story with that feeling shows
// what helps. Grown-ups learn on the way how the child is doing.

import type { FeelingId } from "./bear";

/** The mode on the start screen that begins with the weather pictures. */
export const MOOD_ID = "mood";

export type WeatherId = "sonne" | "wolke" | "regen" | "gewitter";

/** One weather card: the bear under that weather, feeling the same. */
export interface Weather {
  id: WeatherId;
  /** What the card shows, for grown-ups under it. */
  caption: string;
  /** The bear's story that is played next. */
  feeling: FeelingId;
  /** Floats up when it is picked. */
  float: string;
}

export const WEATHERS: Weather[] = [
  { id: "sonne", caption: "Sonne, fröhlich", feeling: "happy", float: "☀️" },
  { id: "wolke", caption: "Wolke, müde", feeling: "tired", float: "☁️" },
  { id: "regen", caption: "Regen, traurig", feeling: "sad", float: "💧" },
  { id: "gewitter", caption: "Gewitter, wütend", feeling: "angry", float: "⚡" },
];

/** Read aloud when the weather cards come. */
export const MOOD_QUESTION = "Wie geht's dir heute?";

/** The bear's answer to any weather. */
export const MOOD_ANSWER = "Das kenne ich auch!";
