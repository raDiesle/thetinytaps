import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the savanna (giraffe, ostrich, zebra), the elephants' pool and the
// monkey tree, the middle enclosures (panda, lion rock, rhino, kangaroo with the koala's
// tree, flamingo pond), the zoo path with the little train, and at the front the penguin
// pool, the seal, the crocodile and the hippo river.

/** The wooden fence behind the savanna and the elephants. */
export const BACK_FENCE = 430;
/** The low stone wall behind the middle enclosures. */
export const WALL = 556;
/** The paved zoo path between its two kerbs. */
export const PATH_TOP = 692;
export const PATH_BOTTOM = 810;
/** Water: centre x, centre y, radius x, radius y. */
export const ELEPHANT_POOL = [930, 500, 92, 18] as const;
export const FLAMINGO_POND = [1400, 612, 100, 20] as const;
export const PENGUIN_POOL = [270, 950, 270, 62] as const;
/** The hippo river along the front right: left bank x, top y. */
export const RIVER_X = 1010;
export const RIVER_TOP = 872;

/** The acacia tree the giraffe eats from. */
export const ACACIA = ground(0, 0, 96, 452, 1.7);
/** The monkey tree with its rope, the platform of the little monkey and the parrot's branch. */
export const MONKEY_TREE = ground(0, 0, 1330, 474, 1.6);
/** The rock the lion lies on. */
export const LION_ROCK = ground(0, 0, 410, 652, 1);
/** The eucalyptus tree with the koala. */
export const EUCALYPTUS = ground(0, 0, 1545, 600, 1.3);
/** The ice rock with the penguins' slide. */
export const ICE_ROCK = ground(0, 0, 96, 900, 0.85);
/** The flowers the butterfly flies over. */
export const FLOWERS = ground(0, 0, 772, 872);
