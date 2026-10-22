import { HORIZON, depthScale, float, ground } from "../layout";
import type { Placement } from "../types";

// A kitchen, seen from the doorway. The back wall stands on the horizon; in front of it runs
// the kitchen counter from the left edge to the fridge on the right: coffee machine, dishwasher,
// the sink under the window, a plain cupboard, the stove with the oven, the drawers and the
// toaster, kettle and mixer. Wall cupboards, the clock and the hood hang above it. On the floor
// in front: the table with the bowl of fruit and the bread basket, Papa on a chair at its left end,
// the child in its high chair at the right end, and the pets, the teddy and the shopping basket.

/** Where the counter's front stands on the floor, and where its worktop's front edge is. */
export const COUNTER_FOOT = 425;
/** Counter height in drawing units (about 85 cm). */
const COUNTER_HEIGHT = 312;
export const COUNTER_FRONT_SCALE = depthScale(COUNTER_FOOT);
/** Front and back edge of the worktop in the picture. */
export const WORKTOP_FRONT = Math.round(COUNTER_FOOT - COUNTER_HEIGHT * COUNTER_FRONT_SCALE);
export const WORKTOP_BACK = Math.round(HORIZON - COUNTER_HEIGHT * depthScale(HORIZON));
/** The counter's right end, where it meets the fridge (front and back). */
export const COUNTER_END = 1400;
export const COUNTER_END_BACK = Math.round(800 + ((COUNTER_END - 800) / COUNTER_FRONT_SCALE) * depthScale(HORIZON));

/**
 * Stands a drawing on the worktop: its foot (0, 0) lands on (x, y) with y between the worktop's back
 * and front edge, scaled for that depth.
 */
export function onCounter(x: number, y: number, size = 1): Placement {
  const t = (y - WORKTOP_BACK) / (WORKTOP_FRONT - WORKTOP_BACK);
  return float(0, 0, x, y, depthScale(HORIZON + t * (COUNTER_FOOT - HORIZON)) * size);
}

/** The table: front legs on the floor at TABLE_FOOT, back legs further back; its top's edges in the picture. */
export const TABLE_X = 760;
export const TABLE_FOOT = 820;
const TABLE_BACK_FOOT = 720;
const TABLE_HEIGHT = 276;
export const TABLE = ground(0, 0, TABLE_X, TABLE_FOOT);
export const TABLE_FRONT = Math.round(TABLE_FOOT - TABLE_HEIGHT * depthScale(TABLE_FOOT));
export const TABLE_BACK = Math.round(TABLE_BACK_FOOT - TABLE_HEIGHT * depthScale(TABLE_BACK_FOOT));

/** Stands a drawing on the table top: (x, y) between its back and front edge. */
export function onTable(x: number, y: number, size = 1): Placement {
  const t = (y - TABLE_BACK) / (TABLE_FRONT - TABLE_BACK);
  return float(0, 0, x, y, depthScale(TABLE_BACK_FOOT + t * (TABLE_FOOT - TABLE_BACK_FOOT)) * size);
}

/** Where the floor's lines meet: the eye height of the picture (depthScale is 0 there). */
export const EYE_Y = HORIZON - (0.45 * (1000 - HORIZON)) / 0.5;

/** Floor point: world x (relative to the middle) at depth scale `s`. */
export function onFloor(worldX: number, s: number): [number, number] {
  return [800 + worldX * s, EYE_Y + (1000 - EYE_Y) * (s / depthScale(1000))];
}

/** A point on the back wall's plane at the counter front's depth moved back to the wall: for side faces. */
export function toWall(x: number) {
  return 800 + ((x - 800) / COUNTER_FRONT_SCALE) * depthScale(HORIZON);
}
