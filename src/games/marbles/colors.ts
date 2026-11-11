// „Farbenbahn“ (K-10): the three colours a marble can have, its tube at the end
// of the run and what the voice says as one lands there. Plain data, so the
// management page and the recording script read the lines without the drawing.

import type { Localized } from "@/lib/language";
import { BALL_R, type Pt } from "./path";
import { TRACK_H } from "./track";

/** One colour of the run: what it looks like, and its word in „Drei rote!“. */
export interface SortColor {
  id: "red" | "yellow" | "blue";
  /** The marble's colour. */
  fill: string;
  /** A light tint of it, for the inside of its tube. */
  tint: string;
  /** „rote“ in „Drei rote!“ (eine Kugel). */
  word: string;
}

/** Red, yellow and blue, in their order on the shelf and in the tubes, left to right. */
export const SORT_COLORS: SortColor[] = [
  { id: "red", fill: "#ff4d4d", tint: "#ffd9d9", word: "rote" },
  { id: "yellow", fill: "#ffd23f", tint: "#fff3c4", word: "gelbe" },
  { id: "blue", fill: "#3a86ff", tint: "#d6e6ff", word: "blaue" },
];

/** Marbles of one colour that fill its tube; the first full tube ends the run. */
export const TUBE_FULL = 5;

/** The tubes at the bottom right of the wall, where the wooden run has its basket: their middles, bottoms and tops. */
export const TUBES = {
  x: [1338, 1424, 1510],
  /** The inside's bottom, well above the wall's lower edge, which the screen's frame and corners cut on some screens. */
  bottom: TRACK_H - 60,
  /** Inner half width: a marble and a little room. */
  half: 28,
  /** One marble on top of the other. */
  step: 2 * BALL_R + 1,
};

/** The tubes' rim, with room for `TUBE_FULL` marbles and a little more. */
export const TUBE_TOP = TUBES.bottom - TUBE_FULL * TUBES.step - 14;

/** Where the n-th marble (0 first) of the i-th colour comes to rest in its tube; more than fit pile up out of its top. */
export const tubeSlot = (tube: number, n: number): Pt => ({ x: TUBES.x[tube], y: TUBES.bottom - BALL_R - 1 - n * TUBES.step });

const NUMBERS = ["Eine", "Zwei", "Drei", "Vier", "Fünf"];

/** What the voice says as the n-th marble (from 1) of the i-th colour lands: „Drei rote!“. Past five it says nothing. */
export const countLine = (tube: number, n: number): Localized | null =>
  n >= 1 && n <= NUMBERS.length ? { de: `${NUMBERS[n - 1]} ${SORT_COLORS[tube].word}!` } : null;

/** Every counting line, for the recordings (`voiceLines.ts`). */
export const COUNT_LINES: Localized[] = SORT_COLORS.flatMap((_, tube) => NUMBERS.map((_, n) => countLine(tube, n + 1))).filter((l): l is Localized => !!l);

/** Said once a tube is full, after its last count. */
export const TUBE_FULL_LINE: Localized = { de: "Die Röhre ist voll!" };
