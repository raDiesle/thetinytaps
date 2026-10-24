import { float, ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0). From back to front: the
// ploughed field with the tractor behind the shed and the pumpkin stall; the meadow
// with the big trees, the leaf pile, the boy with the kite on his little hill and the
// bench; the sandy path; the front with the puddle, the lantern and the pumpkin.
// Things that belong together share one placement.

/** The windy cloud, top left. */
export const WIND = float(0, 0, 112, 92, 0.72);
/** The wild geese flying south. */
export const GEESE = float(0, 0, 452, 96, 0.72);

/** Far back, on the ploughed field. */
export const TRACTOR = ground(0, 0, 486, 376, 1.15);
/** The crow on its fence post. */
export const CROW = ground(0, 0, 1176, 404, 1.1);
/** The garden shed and, next to it, the fence with the spider's web. */
export const SHED = ground(0, 0, 640, 424, 1.3);
export const WEB = ground(0, 0, 752, 432, 1.15);
/** The pumpkin stall; the farmer stands behind its counter. */
export const STAND = ground(0, 0, 906, 448, 1.3);
export const BASKET = ground(0, 0, 1052, 506, 1.35);
/** The red maple at the back right. */
export const MAPLE = ground(0, 0, 1338, 478, 1.5);

/** The chestnut tree on the left with its squirrel and a chestnut on the ground. */
export const CHESTNUT_TREE = ground(0, 0, 160, 616, 1.5);
export const SQUIRREL = ground(0, 0, 316, 636, 1.15);
export const CHESTNUT = ground(0, 0, 372, 704, 1.25);

/** Grandpa rakes the leaves into the pile, the hedgehog sleeps next to it. */
export const GRANDPA = ground(0, 0, 452, 600, 1.05);
export const PILE = ground(0, 0, 596, 610, 1.15);
export const HEDGEHOG = ground(0, 0, 726, 640, 1.15);

/** The boy with the kite stands on a little hill; the kite string ends in his hand. */
export const BOY = ground(0, 0, 1086, 596, 1);
/** Where the boy holds the string, in his own coordinates. */
export const BOY_HAND: [number, number] = [34, -128];

/** The bench with grandma and the cat. */
export const BENCH = ground(0, 0, 1452, 616, 1.05);
export const CART = ground(0, 0, 1236, 676, 1.1);
export const DOG = ground(0, 0, 860, 694, 1);

/** Front, spread over different depths. */
export const MUSHROOMS = ground(0, 0, 82, 780, 1.2);
export const CONKER_MAN = ground(0, 0, 452, 818, 1.2);
export const PINWHEEL = ground(0, 0, 1352, 830, 1.1);
export const BUSH = ground(0, 0, 1530, 860, 1.15);
export const PUMPKIN = ground(0, 0, 246, 880, 1.25);
export const LANTERN = ground(0, 0, 668, 872, 1);
export const PUDDLE = ground(0, 0, 1000, 912, 1);
export const GIRL = ground(0, 0, 1010, 902, 1);
export const APPLE = ground(0, 0, 556, 966, 1.3);
export const BOOTS = ground(0, 0, 1210, 972, 1.2);
export const SNAIL = ground(0, 0, 1424, 968, 1.2);
