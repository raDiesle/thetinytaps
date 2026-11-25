import { ROW } from "./names";

// Where everything of the Counting Tower's house stands, in pixels of a tall world that the camera scrolls through,
// worked out from the screen's width and height. Pure numbers, so `layout.test.ts` checks every screen.
//
// A floor of ten blocks spans the screen's width (user request, 24 November 2026: use the width, a house built row by
// row, ten across, then the next ten on top), with a ledge on the left where the child waits for a floor's first block
// and, on the right, a narrow strip for the small plus that adds the next row. The blocks are as big as that allows
// (user feedback, 25 November 2026: bigger blocks – the elevator panel that took a column of its own went for the plus).
// The world is as tall as the whole house with its roof and a sky above it; the camera moves up a floor with each ten,
// as in a jump-and-run, and can be swiped along it.

/** A block's width and height (it is square): `s`. The beam laid over a full floor is this much of it. */
export const BEAM = 0.22;
/** The ledge on the beam's left end, where the child stands before a floor's first block. */
export const LEDGE = 0.9;
/** How far the beam reaches past the floor's right end. */
export const OVERHANG = 0.15;
/** The strip right of the beam for the plus that adds the next row, and the plus's size, in blocks. */
export const PLUS_ROOM = 0.45;
export const PLUS = 0.34;
/** The roof's height and how far it reaches past the floor on each side. */
export const ROOF = 2.4;
export const EAVE = 0.3;
/** The child's height (Mascot's 200 × 300, so its width is two thirds of it). */
export const KID = 1.25;
/** How far above a floor's top the hanging block's bottom waits: beside the child's head, clear of its paws. */
export const HANG = 0.3;

/** A point. */
export interface Point {
  x: number;
  y: number;
}

/** The world measured for one screen. */
export interface HouseLayout {
  /** The screen. */
  w: number;
  h: number;
  /** A block's side. */
  s: number;
  /** A floor's height: a block and its beam. */
  floorH: number;
  /** The left edge of each floor's first block. */
  x0: number;
  /** The beam's left end (the ledge's) and its width. */
  beamLeft: number;
  beamW: number;
  /** The meadow's line, where the first floor stands, in world pixels from the world's top. */
  ground: number;
  /** The world's height: the sky over the roof, the house, the meadow under it. */
  worldH: number;
  /** Where a floor's top stands on the screen while it is built (pixels from the screen's top). */
  anchor: number;
  /** The child's size. */
  kidW: number;
  kidH: number;
}

/**
 * Lays the world out for a screen of `w` × `h`, whose edges the book's paper margin covers by `frame` pixels (`--frame`:
 * the plus at the right end hid under it).
 */
export function houseLayout(w: number, h: number, frame = 0): HouseLayout {
  const edge = frame + Math.max(4, 0.006 * w);
  // The house with its ledge, overhang and the plus's strip across the screen; a floor at most a fifth of the screen
  // high, so the floor below and the hanging block above stay in view.
  const room = w - 2 * edge;
  const across = LEDGE + ROW + OVERHANG + PLUS_ROOM;
  const s = Math.max(12, Math.min(room / across, 0.2 * h));
  const beamLeft = edge + (room - across * s) / 2;
  const x0 = beamLeft + LEDGE * s;
  const floorH = s * (1 + BEAM);
  // Over the roof a sky as high as the screen, the moon in it; under the meadow's line a strip of meadow.
  const sky = Math.max(h, 4 * s);
  const ground = sky + ROOF * s + ROW * floorH;
  const meadow = Math.max(0.12 * h, 0.6 * s);
  // A floor's top a little above the screen's middle: the hanging block and the child's head above it, below the top
  // corner's notes, and as much as fits of the floors already built below.
  const anchor = Math.max(0.4 * h, (KID + 0.2) * s + 0.08 * h);
  return {
    w,
    h,
    s,
    floorH,
    x0,
    beamLeft,
    beamW: (LEDGE + ROW + OVERHANG) * s,
    ground,
    worldH: ground + meadow,
    anchor,
    kidW: (KID * s * 2) / 3,
    kidH: KID * s,
  };
}

/** The bottom of floor `f` (0 for 1–10), where its blocks stand: the meadow, or the beam of the floor below. */
export const floorBottom = (l: HouseLayout, f: number) => l.ground - f * l.floorH;

/** The top of floor `f`'s blocks, where the child walks and the beam is laid. */
export const floorTop = (l: HouseLayout, f: number) => floorBottom(l, f) - l.s;

/** The middle of the block at place `k` (1 to 10) of floor `f`. */
export const slotAt = (l: HouseLayout, f: number, k: number): Point => ({ x: l.x0 + (k - 0.5) * l.s, y: floorBottom(l, f) - l.s / 2 });

/** The middle of the plus beside floor `f`'s right end, which adds that floor: where its row would go. */
export const plusAt = (l: HouseLayout, f: number): Point => ({ x: l.x0 + (ROW + OVERHANG + PLUS_ROOM / 2) * l.s, y: floorBottom(l, f) - l.s / 2 });

/** The camera's reach while a floor is built and the house is swiped along: from a little over it down to the meadow. */
export function lookRange(l: HouseLayout, f: number): { top: number; bottom: number } {
  return { top: Math.max(0, cameraAt(l, f) - 0.35 * l.h), bottom: Math.max(cameraAt(l, f), l.worldH - l.h) };
}

/** The middle of the block waiting on the crane's hook above place `k` of floor `f`. */
export const hangingAt = (l: HouseLayout, f: number, k: number): Point => ({ x: l.x0 + (k - 0.5) * l.s, y: floorTop(l, f) - HANG * l.s - l.s / 2 });

/** Where the child's feet stand on floor `f` with `k` of its blocks laid: on the ledge for none, else on the k-th. */
export const feetAt = (l: HouseLayout, f: number, k: number): Point =>
  k === 0 ? { x: l.beamLeft + (LEDGE * l.s) / 2, y: floorBottom(l, f) } : { x: l.x0 + (k - 0.5) * l.s, y: floorTop(l, f) };

/** The camera (the world's pixel at the screen's top) while floor `f` is built: its top at `anchor`, never past the meadow. */
export function cameraAt(l: HouseLayout, f: number): number {
  return Math.min(l.worldH - l.h, Math.max(0, floorTop(l, f) - l.anchor));
}

/** The roof's top (its ridge) and the flag's top above it. */
export const roofTop = (l: HouseLayout) => floorBottom(l, ROW) - ROOF * l.s;
export const flagTop = (l: HouseLayout) => roofTop(l) - 1.1 * l.s;

/** The camera on the roof going on: the roof and the child on the ledge under it in view. */
export const cameraAtRoof = (l: HouseLayout) => Math.max(0, Math.min(cameraAt(l, ROW - 1), roofTop(l) - 0.3 * l.h));

/**
 * The whole house at the end: the world scaled down (`scale`) and moved (`x`, `y`, screen pixels of the world's top left
 * corner) so the house from the flag to the meadow stands in the middle of the screen.
 */
export function wholeHouse(l: HouseLayout): { scale: number; x: number; y: number } {
  const top = flagTop(l) - 0.3 * l.s;
  const bottom = l.ground + 0.4 * l.s;
  const left = l.beamLeft - EAVE * l.s;
  const right = l.x0 + (ROW + EAVE + OVERHANG) * l.s;
  const scale = Math.min(1, (0.84 * l.h) / (bottom - top), (0.9 * l.w) / (right - left));
  return { scale, x: l.w / 2 - scale * ((left + right) / 2), y: 0.06 * l.h - scale * top };
}
