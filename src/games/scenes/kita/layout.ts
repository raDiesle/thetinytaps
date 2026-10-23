import { depthScale, float, ground } from "../layout";
import type { Placement } from "../types";

// The group room of a Kita, seen from the middle of the room. The back wall stands on the
// horizon: the red entrance door and the coat hooks with their little pictures at the left,
// the big window in the middle, the craft cupboard with the hamster's cage and the window of
// the sleeping corner with its blind at the right. On the floor: the building corner at the
// left, the reading corner in the middle, the little lunch table at the front and the mats of
// the sleeping corner at the right.

/** The little lunch table: front legs on the floor at TABLE_FOOT, back legs further back. */
export const TABLE_X = 1010;
export const TABLE_FOOT = 905;
/** How far back the back legs stand, in the table's own units. */
const TABLE_DEPTH = 50;
/** Height of the top's front and back edge, in the table's own units. */
export const TABLE_TOP_FRONT = -190;
export const TABLE_TOP_BACK = -236;
export const TABLE = ground(0, 0, TABLE_X, TABLE_FOOT);
const TABLE_BACK_FOOT = TABLE_FOOT - TABLE_DEPTH * TABLE.scale;
/** The top's front and back edge in the picture. */
export const TABLE_FRONT = Math.round(TABLE_FOOT + TABLE_TOP_FRONT * TABLE.scale);
export const TABLE_BACK = Math.round(TABLE_FOOT + TABLE_TOP_BACK * TABLE.scale);

/** Stands a drawing on the table top: its foot (0, 0) lands on (x, y), y between the top's back and front edge. */
export function onTable(x: number, y: number, size = 1): Placement {
  const t = (y - TABLE_BACK) / (TABLE_FRONT - TABLE_BACK);
  return float(0, 0, x, y, depthScale(TABLE_BACK_FOOT + t * (TABLE_FOOT - TABLE_BACK_FOOT)) * size);
}

/** The big window in the back wall: its frame and the glass, where the garden, Papa and the bird are. */
export const WINDOW = { x: 618, y: 92, w: 364, h: 170 };
export const WINDOW_GLASS = { x: 632, y: 106, w: 336, h: 144 };

/** The window of the sleeping corner, with the blind. */
export const SLEEP_WINDOW = { x: 1292, y: 70, w: 248, h: 192 };
