// The motion of the outro „Pinnwand“ as plain numbers of its time, like every video's: each frame is a function of its
// second. A cork board fills the picture; the games' photos are pinned onto it one after another, each pressed on from
// a little above and held by a pin pushed in last, until the board is full; then the paper with the address is pinned
// into the middle, and everything stands still long enough to read it.

import { easeInOut, easeOut, progress } from "../intro/timeline";
import { PINBOARD } from "./content";

/** How many photos hang on the board. */
export const PHOTO_COUNT = PINBOARD.length;

/** A photo in its white frame on the canvas: the picture's size and the frame round it, wider below for its word. */
export const PHOTO = { picture: { width: 312, height: 208 }, border: 14, foot: 58 };

/** The whole framed photo's width and height. */
export const FRAME = {
  width: PHOTO.picture.width + 2 * PHOTO.border,
  height: PHOTO.picture.height + PHOTO.border + PHOTO.foot,
};

/** Where a photo hangs: its middle on the canvas and how far it is turned, in degrees. */
export interface Slot {
  x: number;
  y: number;
  turn: number;
}

/** The pins' colours, one after another, as a box of pins mixes them. */
export const PIN_COLORS = ["#d8402f", "#2f7fd8", "#f2b632", "#3aa35a", "#c04fa8"] as const;

/**
 * Where each photo of `PINBOARD` hangs, in its order: five across the top, one left and one right of the address in
 * the middle, five across the bottom – each a little askew, as pinned by hand.
 */
export const PIN_SLOTS: readonly Slot[] = [
  { x: 236, y: 196, turn: -3 },
  { x: 596, y: 182, turn: 2 },
  { x: 960, y: 200, turn: -1.5 },
  { x: 1324, y: 184, turn: 2.5 },
  { x: 1684, y: 198, turn: -2 },
  { x: 250, y: 540, turn: 2 },
  { x: 1670, y: 540, turn: -2.5 },
  { x: 236, y: 884, turn: 1.5 },
  { x: 596, y: 898, turn: -2.5 },
  { x: 960, y: 882, turn: 2 },
  { x: 1324, y: 896, turn: -1.5 },
  { x: 1684, y: 884, turn: 3 },
];

/** The paper with the address in the middle: its middle, size and turn. */
export const NOTE = { x: 960, y: 540, width: 1000, height: 300, turn: -1 };

/** How long one photo takes from coming to lying flat, and how long after it the next one comes, in seconds. */
const PRESS = 0.4;
const EVERY = 0.28;

/** When the first photo comes. */
const FIRST = 0.5;

/** When things happen, in seconds from the start. */
export const PINBOARD_BEATS = {
  /** The board fades in from paper. */
  fadeIn: [0, 0.4],
  /** The photos come one after another. */
  photos: [FIRST, FIRST + EVERY * (PHOTO_COUNT - 1) + PRESS],
  /** The paper with the address is pinned into the middle once the last photo lies flat. */
  note: [FIRST + EVERY * (PHOTO_COUNT - 1) + PRESS + 0.25, FIRST + EVERY * (PHOTO_COUNT - 1) + PRESS + 0.75],
  /** The short line under the address is written on. */
  line: [FIRST + EVERY * (PHOTO_COUNT - 1) + PRESS + 0.85, FIRST + EVERY * (PHOTO_COUNT - 1) + PRESS + 1.35],
} as const satisfies Record<string, readonly [number, number]>;

/** How long this outro lasts: the full board stands still a few seconds, long enough to read the address. */
export const PINBOARD_SECONDS = Math.ceil((PINBOARD_BEATS.line[1] + 4) * 2) / 2;

/** When the `k`-th photo comes and when it lies flat on the board. */
export const photoBeat = (k: number): readonly [number, number] => [FIRST + EVERY * k, FIRST + EVERY * k + PRESS];

/** When a thing pressed on during `beat` has its pin pushed in: the last third of it. */
const pinBeat = ([from, to]: readonly [number, number]): readonly [number, number] => [from + (to - from) * 0.62, to];

/** A thing pressed onto the board: how much it shows, how much bigger than flat it still is, how high it still is (0 flat). */
export interface PressPose {
  opacity: number;
  scale: number;
  lift: number;
  /** How far its pin is pushed in: 0 not there yet, 1 in. */
  pin: number;
}

/** A thing pressed onto the board during `beat`, at `t`: it comes from a little above, bigger, and lies down flat. */
export function pressPose(beat: readonly [number, number], t: number): PressPose {
  const p = easeOut(progress(t, beat));
  const pin = easeInOut(progress(t, pinBeat(beat)));
  return { opacity: Math.min(1, progress(t, beat) * 3), scale: 1 + 0.14 * (1 - p), lift: 1 - p, pin };
}

/** The `k`-th photo's pose at `t`. */
export const photoPose = (k: number, t: number) => pressPose(photoBeat(k), t);

/** The paper with the address's pose at `t`. */
export const notePose = (t: number) => pressPose(PINBOARD_BEATS.note, t);

/** How much of the line under the address shows. */
export const lineShown = (t: number) => easeOut(progress(t, PINBOARD_BEATS.line));

/** How much of the board shows through the paper it fades in from. */
export const pinboardFadeIn = (t: number) => easeOut(progress(t, PINBOARD_BEATS.fadeIn));
