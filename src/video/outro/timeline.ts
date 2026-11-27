// The outro's motion as plain numbers of its time, like the intro's: every frame is a function of its second.
// Its first part is the intro played backwards (the page, the book closing, going back into its gap), so both look like
// one book; its own parts follow – the other picture books lighting up in turn, then the card with the address.

import { COVERS } from "../intro/IntroScene";
import { type BookPose, bookPose, easeInOut, easeOut, progress, type ShelfPose, shelfPose } from "../intro/timeline";

/** How long the outro lasts, in seconds: long enough to read the card and scan its code (8–12 s, idea Y-04). */
export const OUTRO_SECONDS = 12;

/** When things happen, in seconds from the start. */
export const OUTRO_BEATS = {
  /** The picture fades in from paper onto the first page, the name printed on it as the intro left it. */
  fadeIn: [0, 0.35],
  /** The name fades from the page. */
  titleOut: [0.4, 0.8],
  /** The camera comes back out of the page until the open book lies in the middle. */
  zoomOut: [0.7, 1.5],
  /** Its cover swings shut. */
  close: [1.5, 2.4],
  /** It goes back into its gap on the shelf. */
  back: [2.4, 3.6],
  /** It stands upright again on its board. */
  settle: [3.6, 3.95],
  /** The other picture books light up one after another, each showing a picture of one of its games. */
  tour: [3.95, 7.55],
  /** The shelf goes dim and the card comes up from below. */
  card: [7.55, 8.35],
  /** Its signs (free, no ads, offline, languages, play time) come one after another. */
  signs: [8.25, 9.45],
  /** The code to scan comes. */
  code: [8.6, 9.1],
} as const satisfies Record<string, readonly [number, number]>;

/**
 * The intro's second to show at the outro's second `t` while the book goes back: its motion played backwards, piece by
 * piece, with the outro's own lengths. Before `zoomOut` the first page fills the screen, after `settle` the book stands
 * closed in its gap.
 */
const BACKWARDS: readonly (readonly [outro: number, intro: number])[] = [
  [OUTRO_BEATS.zoomOut[0], 4.0],
  [OUTRO_BEATS.close[0], 3.3],
  [OUTRO_BEATS.back[0], 2.33],
  [OUTRO_BEATS.settle[0], 1.0],
  [OUTRO_BEATS.settle[1], 0.6],
];

/** The intro's second whose pose the outro shows at `t`. */
export function introSecond(t: number) {
  const first = BACKWARDS[0]!;
  const last = BACKWARDS[BACKWARDS.length - 1]!;
  if (t <= first[0]) return first[1];
  if (t >= last[0]) return last[1];
  for (let i = 1; i < BACKWARDS.length; i++) {
    const [toT, toIntro] = BACKWARDS[i]!;
    const [fromT, fromIntro] = BACKWARDS[i - 1]!;
    if (t <= toT) return fromIntro + ((t - fromT) / (toT - fromT)) * (toIntro - fromIntro);
  }
  return last[1];
}

/** The Little Steps to Grow book's pose: the intro's, backwards. */
export const outroBookPose = (t: number): BookPose => bookPose(introSecond(t));

/** The camera on the shelf: the intro's backwards, then going dim and soft again behind the card. */
export function outroShelfPose(t: number): ShelfPose {
  const shelf = shelfPose(introSecond(t));
  const card = easeInOut(progress(t, OUTRO_BEATS.card));
  return { scale: shelf.scale, dim: shelf.dim + 0.3 * card, blur: shelf.blur + 6 * card };
}

/** How much of the printed name still shows on the page. */
export const titleLeft = (t: number) => 1 - easeInOut(progress(t, OUTRO_BEATS.titleOut));

/** The share of `tour` each picture book has: it lights up, holds a moment, and goes quiet as the next one comes. */
const TOUR_STEP = (OUTRO_BEATS.tour[1] - OUTRO_BEATS.tour[0]) / COVERS.length;

/** How much each picture book of the shelf is lit at `t`, 0 to 1, from left to right. */
export function glows(t: number) {
  return COVERS.map((_, k) => {
    const from = OUTRO_BEATS.tour[0] + k * TOUR_STEP;
    const up = easeOut(progress(t, [from, from + 0.3]));
    // It has gone quiet when the next one begins, so only one is ever lit (and the last one before the card comes).
    const down = easeInOut(progress(t, [from + TOUR_STEP - 0.3, from + TOUR_STEP]));
    return up * (1 - down);
  });
}

/** When the end card's parts come: the card, its signs one after another, the code. */
export type CardBeats = Record<"card" | "signs" | "code", readonly [number, number]>;

/** How far the end card has come, 0 to 1, and each of its parts – at the shelf outro's times, or another's `beats`. */
export function cardPose(t: number, signs: number, beats: CardBeats = OUTRO_BEATS) {
  // Each sign takes 1.6 steps to come, the next starting one step later: the last one has come at the end of `signs`.
  const signStep = (beats.signs[1] - beats.signs[0]) / (signs + 0.6);
  return {
    card: easeOut(progress(t, beats.card)),
    signs: Array.from({ length: signs }, (_, k) => easeOut(progress(t, [beats.signs[0] + k * signStep, beats.signs[0] + (k + 1.6) * signStep]))),
    code: easeOut(progress(t, beats.code)),
  };
}

/** How far the end card has come, as `cardPose` gives it. */
export type CardPose = ReturnType<typeof cardPose>;

/** How much of the picture shows through the paper it fades in from. */
export const outroFadeIn = (t: number) => easeOut(progress(t, OUTRO_BEATS.fadeIn));
