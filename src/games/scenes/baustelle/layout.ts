import { ground } from "../layout";

// Things that belong together share one placement, so they move along with each other.

/** House, crane, the pallet of bricks and everyone sitting on them move together. */
export const SITE = ground(1060, 600, 1000, 540, 1.3);
/** The digger and its dirt pile. */
export const DIGGER = ground(340, 718, 330, 580, 1.05);
/** The tree and its squirrel. */
export const TREE = ground(108, 572, 72, 410, 2);
/** The jackhammer worker and the hole he is making. */
export const HAMMER = ground(1192, 996, 1360, 920);
/** The flower bed and its butterfly. */
export const FLOWERS = ground(1548, 995, 1550, 900);
