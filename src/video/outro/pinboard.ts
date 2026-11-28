// The motion of the outro „Pinnwand“ as plain numbers of its time, like every video's: each frame is a function of its
// second. A cork board fills the picture with every game's photo and the sheet with the address pinned on it from the
// first frame (user requests, 27 and 28 November 2026: pinned one after another, the board took too long to fill, and
// the sheet came too late); then the address is marked, the paw tracks walk along under it one print after another up
// to Papa Fox and his child on the o of „.com“, a red „Free“ stamp comes down under them, and
// everything stands still long enough to read it.

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

/** The photos held by a strip of washi tape instead of a pin, by their place in `PINBOARD`: a board pinned by hand mixes both. */
export const TAPED: ReadonlySet<number> = new Set([1, 4, 7, 10]);

/** The tapes' colours: soft, like a roll of washi tape. */
export const TAPE_COLORS = ["#f5c84c", "#7fb8e0", "#f19bb0", "#9fd39a"] as const;

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

/**
 * The paper in the middle with the address: its middle, size and turn – smaller than the name and address took, and
 * lower again once only the line over the address, the address, its tracks and the stamp under them were left (user
 * requests, 28 November 2026).
 */
export const NOTE = { x: 960, y: 540, width: 900, height: 300, turn: -1 };

/** When things happen, in seconds from the start: the photos and the sheet hang from the first frame on. */
export const PINBOARD_BEATS = {
  /** The highlighter stroke is drawn across the address. */
  mark: [0.3, 0.9],
  /** The paw prints appear one after another under the address, from its start up to the foxes on the o – quickly (user request, 28 November 2026). */
  paws: [0.9, 2.1],
  /** The red „Free“ stamp comes down onto the sheet and lands. */
  stamp: [2.3, 2.5],
} as const satisfies Record<string, readonly [number, number]>;

/** How long this outro lasts: the whole board stands still long enough to read the address (10 s, user request, 28 November 2026: a little longer). */
export const PINBOARD_SECONDS = 10;

/** One print of the paw tracks: where it stands, big (the grown-up's) or small (the child's), and how far it is turned. */
export interface PawPrint {
  /** Its middle along the tracks, in the tracks' units (`TRACK_UNITS` an em of the address). */
  x: number;
  /** Its middle across them, in the same units: the big tracks run above the small ones. */
  y: number;
  big: boolean;
  /** Degrees off the tracks' direction, as a foot is set down a little out or in. */
  turn: number;
}

/** The tracks' units in an em of the address. */
export const TRACK_UNITS = 100;

/** How long the tracks are, in ems of the address: from its first letter up to the o of „.com“ (measured in the font). */
export const TRACK_EMS = 12.2;

/** How deep the tracks are under the address, in ems of it: room for both tracks' feet set apart. */
export const TRACK_DEPTH = 0.85;

/**
 * The prints of one walker along the tracks: a step every `step` units from `start`, its feet set down by turns at `y`
 * (left) and `y + spread` (right), each foot turned a little outwards, with a touch of each step's own.
 */
const walk = (big: boolean, start: number, step: number, y: number, spread: number, turn: number): PawPrint[] =>
  Array.from({ length: Math.floor((TRACK_EMS * TRACK_UNITS - 30 - start) / step) + 1 }, (_, k) => ({
    x: start + k * step,
    y: y + (k % 2) * spread,
    big,
    turn: (k % 2 ? turn : -turn) + ((k * 7) % 5) - 2,
  }));

/**
 * Every print of the tracks, in the order they appear: from the address's start towards the o. Few and big, the feet
 * set clearly apart and filling the room under the address (user request, 28 November 2026: the many small prints in
 * one thin band were hardly seen) – the grown-up's long steps above, the child's short ones below.
 */
export const PAW_PRINTS: readonly PawPrint[] = [...walk(true, 34, 104, 18, 24, 7), ...walk(false, 66, 68, 60, 18, 10)].sort((a, b) => a.x - b.x);

/** How far print `k` of `PAW_PRINTS` has appeared at `t`: 0 not yet, 1 there. Each comes quickly, one after another. */
export function pawShown(k: number, t: number): number {
  const [from, to] = PINBOARD_BEATS.paws;
  const step = (to - from - PAW_APPEAR) / (PAW_PRINTS.length - 1);
  return easeOut(progress(t, [from + k * step, from + k * step + PAW_APPEAR]));
}

/** How long one print takes to appear, in seconds. */
const PAW_APPEAR = 0.12;

/** When print `k` lands, in seconds: its sound. */
export const pawLands = (k: number) => {
  const [from, to] = PINBOARD_BEATS.paws;
  return from + (k * (to - from - PAW_APPEAR)) / (PAW_PRINTS.length - 1);
};

/**
 * The red „Free“ stamp at `t`: nothing before it comes, then falling onto the sheet from above (bigger, nearer the eye)
 * faster and faster, squashed a little as it lands, then still.
 */
export function stampPose(t: number): { opacity: number; scale: number } {
  const [from, to] = PINBOARD_BEATS.stamp;
  if (t < from) return { opacity: 0, scale: 2.4 };
  const fall = progress(t, [from, to]);
  if (fall < 1) return { opacity: Math.min(1, fall * 2.5), scale: 1 + 1.4 * (1 - fall * fall) };
  const settle = progress(t, [to, to + 0.12]);
  return { opacity: 1, scale: 1 - 0.05 * Math.sin(Math.PI * settle) };
}

/** How much of the highlighter stroke across the address is drawn. */
export const markShown = (t: number) => easeInOut(progress(t, PINBOARD_BEATS.mark));

/** A thing lying on the board: how much it shows, how much bigger than flat it is, how high it is (0 flat). */
export interface PressPose {
  opacity: number;
  scale: number;
  lift: number;
  /** How far its pin is pushed in: 0 not there yet, 1 in. */
  pin: number;
}

/** A thing lying flat on the board, its pin in: every photo and the sheet, from the first frame on. */
export const FLAT: PressPose = { opacity: 1, scale: 1, lift: 0, pin: 1 };
