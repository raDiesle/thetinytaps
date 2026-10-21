import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the farmhouse, the cornfield with the windmill on its hill and the
// barn; the meadow in front of the fence; the dirt track across the yard; the front with
// the pig's mud, the vegetable patch, the hay and the pond.

/** Where the farmhouse and the barn stand. */
export const HOF = 470;
/** The fence at the back of the meadow. */
export const FENCE = 500;
/** The dirt track across the yard. */
export const TRACK_TOP = 652;
export const TRACK_BOTTOM = 772;
/** The pond: centre x, centre y, radius x, radius y. */
export const POND = [1270, 886, 190, 62] as const;

/** The barn and the stork on its roof. */
export const SCHEUNE = ground(0, 0, 1020, HOF, 1.5);
/** The farmhouse; its front door is where the path starts. */
export const HAUS = ground(0, 0, 230, HOF - 4, 1.4);
/** The hen house and the rooster on its roof. */
export const STALL = ground(0, 0, 480, 586, 1.1);
/** The hay bales and the cat sleeping on them. */
export const HEU = ground(0, 0, 1050, 846, 1.1);
/** The beehive and its bee. */
export const BIENEN = ground(0, 0, 1505, 930);
/** Wild flowers and the butterfly. */
export const WIESE = ground(0, 0, 70, 950);
