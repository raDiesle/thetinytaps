// The intro's motion as plain numbers of its time: every frame is a function of the second it shows, so the page can
// play it live and `bun run video intro` can step through it frame by frame and get the same picture each time.

/** The intro is drawn on a canvas of this size and scaled to the screen; the video is made at exactly this size. */
export const CANVAS = { width: 1920, height: 1080 };

/** How long the intro lasts, in seconds; the sound rings out within it. */
export const INTRO_SECONDS = 7.5;

/** The Fun for Both book on the shelf, closed: its pages' box on the canvas (its cover lies over it). */
export const HERO = { x: 750, y: 410, width: 420, height: 315 };

/** When things happen, in seconds from the start. */
export const BEATS = {
  /** The picture fades in from paper. */
  fadeIn: [0, 0.5],
  /** The camera comes a little closer to the shelf. */
  push: [0, 2.6],
  /** The book tips forward on its board, as a hand takes it out. */
  tip: [0.6, 1.0],
  /** It comes off the board into the middle, big. */
  out: [1.0, 2.3],
  /** Its cover swings open to the left. */
  open: [2.35, 3.35],
  /** The camera goes into its first page until the paper is the whole screen. */
  zoom: [3.2, 4.0],
  /** The name is printed letter by letter. */
  letters: [4.0, 4.9],
  /** The big and the small paw track run along under it up to the o. */
  tracks: [4.4, 5.2],
  /** Papa Fox and his child sit down on the o. */
  foxes: [5.1, 5.6],
  /** The address comes under the name. */
  address: [5.65, 6.15],
} as const satisfies Record<string, readonly [number, number]>;

/** 0 before `from`, 1 after `to`, straight in between. */
export function progress(t: number, [from, to]: readonly [number, number]) {
  return Math.min(1, Math.max(0, (t - from) / (to - from)));
}

/** Slow at both ends, like a hand moving a book. */
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/** Fast at first, landing softly. */
export const easeOut = (p: number) => 1 - (1 - p) ** 3;

const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Where the book is and how it lies at time `t`. */
export interface BookPose {
  /** The centre of its pages on the canvas. */
  x: number;
  y: number;
  /** How big against its size on the shelf. */
  scale: number;
  /** How far its top tips towards the viewer, in degrees. */
  tip: number;
  /** How far the cover is open, in degrees (180: lying open to the left). */
  cover: number;
}

/** The scale at which the book, out of the shelf, is as tall as most of the screen. */
const OUT_SCALE = 1.9;
/** The scale at which its first page is as wide as the screen (and, being 4 : 3, taller than it). */
export const PAGE_SCALE = CANVAS.width / HERO.width;

/** The book's pose: on the shelf, coming out, opening, then the camera going into its first page. */
export function bookPose(t: number): BookPose {
  const tip = Math.sin(progress(t, BEATS.tip) * Math.PI * 0.5) * (1 - easeInOut(progress(t, BEATS.out))) * 14;
  const out = easeInOut(progress(t, BEATS.out));
  const open = easeInOut(progress(t, BEATS.open));
  const zoom = easeInOut(progress(t, BEATS.zoom));
  const home = { x: HERO.x + HERO.width / 2, y: HERO.y + HERO.height / 2 };
  const middle = { x: CANVAS.width / 2, y: CANVAS.height / 2 };
  // Out in the middle; while it opens it moves right by half a page, so the open spread stays in the middle; then the
  // first page comes to the middle and grows until it fills the screen.
  const outScale = mix(1, OUT_SCALE, out);
  const scale = mix(outScale, PAGE_SCALE, zoom);
  const spreadX = middle.x + (open * HERO.width * outScale) / 2;
  const x = mix(mix(home.x, spreadX, out), middle.x, zoom);
  const y = mix(home.y, middle.y, out);
  return { x, y, scale, tip, cover: open * 180 };
}

/** The camera on the shelf: a little closer, and the shelf going dim and soft behind the book that comes out. */
export function shelfPose(t: number) {
  const push = easeInOut(progress(t, BEATS.push));
  const out = easeInOut(progress(t, BEATS.out));
  return { scale: 1 + 0.08 * push, dim: 0.38 * out, blur: 7 * out };
}

/** How far each part of the title has come, 0 to 1. */
export function titlePose(t: number) {
  return {
    letters: progress(t, BEATS.letters),
    tracks: easeInOut(progress(t, BEATS.tracks)),
    foxes: easeOut(progress(t, BEATS.foxes)),
    address: easeOut(progress(t, BEATS.address)),
  };
}

/** How much of the picture shows through the paper it fades in from. */
export const fadeIn = (t: number) => easeOut(progress(t, BEATS.fadeIn));
