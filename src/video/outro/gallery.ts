// The motion of the outro „Bilder aus den Spielen“ as plain numbers of its time, like every video's: each frame is a
// function of its second. It opens on the two categories side by side, each with the first picture of its games; then
// the pictures come one after another out of the depth into the middle, big, and fly on past the camera as the next
// one comes – the everyday helpers first, then the learning games – and it ends on the same card as the shelf's outro.

import { easeInOut, easeOut, progress } from "../intro/timeline";
import { GALLERY } from "./content";

/** How many pictures each category shows, and where the games' first one stands in the run of all of them. */
export const HELPER_COUNT = GALLERY.helpers.length;
export const PICTURE_COUNT = HELPER_COUNT + GALLERY.games.length;

/** How long each picture has in the middle, coming and standing, in seconds. */
export const STEP = 0.8;

/** The share of a step a picture stands still in the middle before the next one comes. */
const HOLD = 0.45;

/** When the run of pictures begins: the helpers' first stands big in the middle. */
const RUN = 2.6;

/** When the last picture has come to the middle. */
const LAST = RUN + STEP * (PICTURE_COUNT - 1);

/** When things happen, in seconds from the start. */
export const GALLERY_BEATS = {
  /** The picture fades in from paper. */
  fadeIn: [0, 0.35],
  /** The two categories come out of the depth side by side, each with its first picture and its name under it. */
  categories: [0.15, 1.05],
  /** The helpers' picture comes into the middle, big, its name going up as the heading; the games' goes back into the depth. */
  split: [1.9, RUN],
  /** The pictures come one after another. */
  run: [RUN, LAST],
  /** The last one flies on past the camera. */
  out: [LAST + STEP * HOLD, LAST + STEP],
  /** The card comes up from below, once the last picture is nearly gone (over it, the card looked muddy). */
  card: [LAST + STEP * HOLD + 0.3, LAST + STEP * HOLD + 1.1],
  /** Its signs (free, no ads, offline, languages, play time) come one after another. */
  signs: [LAST + STEP * HOLD + 1.0, LAST + STEP * HOLD + 2.2],
  /** The code to scan comes. */
  code: [LAST + STEP * HOLD + 1.35, LAST + STEP * HOLD + 1.85],
} as const satisfies Record<string, readonly [number, number]>;

/** How long this outro lasts: the card stands whole long enough to read it and scan its code. */
export const GALLERY_SECONDS = Math.ceil((GALLERY_BEATS.signs[1] + 3) * 2) / 2;

/**
 * Where the run of pictures stands at `t`: 0 while the first is in the middle, 1 when the second is, … and
 * `PICTURE_COUNT` once the last has flown past. Each step stands a moment, then moves on smoothly.
 */
export function queuePosition(t: number) {
  if (t >= GALLERY_BEATS.out[0]) return PICTURE_COUNT - 1 + easeInOut(progress(t, GALLERY_BEATS.out));
  const u = Math.max(0, (t - RUN) / STEP);
  const step = Math.min(Math.floor(u), PICTURE_COUNT - 1);
  if (step >= PICTURE_COUNT - 1) return PICTURE_COUNT - 1;
  return step + easeInOut(Math.min(1, Math.max(0, (u - step - HOLD) / (1 - HOLD))));
}

/** A picture's place on the canvas: its middle's offset from the canvas's middle, its scale, how much shows, its blur. */
export interface PicturePose {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  blur: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * A picture `depth` steps behind the one in the middle (0): further back smaller, higher, fainter and softer, so the
 * next one is seen waiting; below 0 it has passed and flies on, growing, down past the camera and gone.
 */
export function depthPose(depth: number): PicturePose {
  if (depth >= 0) {
    return { x: 0, y: -70 * Math.min(depth, 2), scale: 1 / (1 + 0.85 * depth), opacity: clamp01(1 - 0.55 * depth), blur: 5 * depth };
  }
  // Gone quickly: fading slowly, it lay over the next one as a pale double picture.
  const gone = -depth;
  return { x: 0, y: 90 * gone, scale: 1 + gone, opacity: clamp01(1 - 4 * gone), blur: 6 * gone };
}

/** Where each category's first picture stands at the start, side by side: the helpers left, the games right. */
const SLOTS = [
  { x: -480, y: -40, scale: 0.6 },
  { x: 480, y: -40, scale: 0.6 },
];

/** How far the two categories have come out of the depth at the start, 0 to 1. */
const categoriesIn = (t: number) => easeOut(progress(t, GALLERY_BEATS.categories));

/** How far the helpers' first picture has gone from its place at the side into the middle, 0 to 1. */
export const splitDone = (t: number) => easeInOut(progress(t, GALLERY_BEATS.split));

const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** The `k`-th picture's pose at `t`, counting the helpers' first and then the games'. */
export function picturePose(k: number, t: number): PicturePose {
  const inRun = depthPose(k - queuePosition(t));
  const slot = k === 0 ? SLOTS[0] : k === HELPER_COUNT ? SLOTS[1] : undefined;
  // The others wait unseen until the helpers' first stands in the middle, hiding them.
  if (!slot) return { ...inRun, opacity: inRun.opacity * splitDone(t) };
  // Out of the depth into its place at the side, then from there to its place in the run.
  const come = categoriesIn(t);
  const side = { x: slot.x, y: slot.y, scale: slot.scale * (0.35 + 0.65 * come), opacity: come, blur: 8 * (1 - come) };
  const p = splitDone(t);
  return {
    x: mix(side.x, inRun.x, p),
    y: mix(side.y, inRun.y, p),
    scale: mix(side.scale, inRun.scale, p),
    opacity: mix(side.opacity, inRun.opacity, p),
    blur: mix(side.blur, inRun.blur, p),
  };
}

/** A category's name: where it stands (its middle, on the canvas) and how much of it shows. */
export interface HeadingPose {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

/** Under the categories' pictures at the start, and over the run's picture as its heading. */
const UNDER = 300;
const ABOVE = -455;

/**
 * Where the name of the helpers (`category` 0) or of the games (1) stands at `t`: under its picture at the start; then
 * the helpers' fades there and comes again as the heading over the run (moving up, it crossed the growing picture),
 * while the games' goes back with its picture, and comes back as the heading when the run passes from the last helper
 * to the first game.
 */
export function headingPose(category: 0 | 1, t: number): HeadingPose {
  const come = categoriesIn(t);
  const p = splitDone(t);
  const slot = SLOTS[category]!;
  // How much the run shows the games: the heading changes in the middle of the step from the last helper to the first game.
  const games = clamp01((queuePosition(t) - (HELPER_COUNT - 1) - 0.25) / 0.5);
  const atEnd = 1 - easeInOut(progress(t, GALLERY_BEATS.out));
  if (category === 0) {
    if (p < 0.5) return { x: slot.x, y: UNDER, scale: 1, opacity: come * (1 - 2 * p) };
    return { x: 0, y: ABOVE, scale: 0.9, opacity: (2 * p - 1) * (1 - games) * atEnd };
  }
  if (t < GALLERY_BEATS.split[1]) return { x: slot.x, y: UNDER, scale: 1, opacity: come * clamp01(1 - 2 * p) };
  return { x: 0, y: ABOVE, scale: 0.9, opacity: games * atEnd };
}

/** How much of a game's name shows under the picture in the middle: only while it stands there, never at the start. */
export function nameShown(k: number, t: number) {
  if (t < GALLERY_BEATS.split[1] - 0.15) return 0;
  return clamp01(1 - 2.5 * Math.abs(k - queuePosition(t)));
}

/** How much of the categories' colour shows behind everything: 0 the helpers' warm light, 1 the games' blue. */
export const backgroundGames = (t: number) => clamp01((queuePosition(t) - (HELPER_COUNT - 1) - 0.1) / 0.8);

/** How much of the picture shows through the paper it fades in from. */
export const galleryFadeIn = (t: number) => easeOut(progress(t, GALLERY_BEATS.fadeIn));
