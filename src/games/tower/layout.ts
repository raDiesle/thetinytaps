import { ROW } from "./names";

// Where everything of the Counting Tower's house stands, in pixels of a tall world that the camera scrolls through,
// worked out from the screen's width and height. Pure numbers, so `layout.test.ts` checks every screen.
//
// A floor of ten blocks spans the screen's width (user request, 24 November 2026: use the width, a house built row by
// row, ten across, then the next ten on top), with a ledge on the left where the child waits for a floor's first block
// and the elevator panel on the right. The world is as tall as the whole house with its roof and a sky above it; the
// camera moves up a floor with each ten, as in a jump-and-run.

/** A block's width and height (it is square): `s`. The beam laid over a full floor is this much of it. */
export const BEAM = 0.22;
/** The ledge on the beam's left end, where the child stands before a floor's first block. */
export const LEDGE = 0.95;
/** How far the beam reaches past the floor's right end. */
export const OVERHANG = 0.2;
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
  /** The elevator panel on the right: its left edge, width and middle. */
  panel: { left: number; width: number; middle: number };
  /** The child's size. */
  kidW: number;
  kidH: number;
}

/** Lays the world out for a screen of `w` × `h`. */
export function houseLayout(w: number, h: number): HouseLayout {
  const panelW = Math.round(Math.min(170, Math.max(66, 0.12 * w)));
  const edge = Math.max(10, 0.015 * w);
  const gap = Math.max(10, 0.02 * w);
  // The house with its ledge and overhang in the room left of the panel; a floor at most a fifth of the screen high,
  // so the floor below and the hanging block above stay in view.
  const room = w - panelW - 2 * edge - gap;
  const s = Math.max(12, Math.min(room / (LEDGE + ROW + OVERHANG), 0.2 * h));
  const beamLeft = edge + (room - (LEDGE + ROW + OVERHANG) * s) / 2;
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
    panel: { left: w - edge - panelW, width: panelW, middle: h / 2 },
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
