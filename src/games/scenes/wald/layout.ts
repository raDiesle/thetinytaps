import { HORIZON, depthScale, ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the big trees at the edge of the clearing with the stag behind
// the brook; the clearing with deer, wild boars and the beaver's dam; the forest path
// over the little bridge; the front with mushrooms, the stump, the berry bush and the
// brook running out of the picture on the right.

/** Where the brook starts, far back between the trees. */
const BROOK_TOP = HORIZON + 15;

/** Middle of the brook at ground height y: it winds from the back towards the front right. */
export function brookX(y: number) {
  const t = Math.max(0, (y - BROOK_TOP) / (1000 - BROOK_TOP));
  return 1000 + 440 * (1 - (1 - t) ** 1.6) + 16 * Math.sin(t * 9);
}

/** Half the width of the brook at ground height y: narrow far back, wide in front. */
export function brookHalf(y: number) {
  return Math.max(6, (depthScale(y) * 340 - 120) / 2);
}

export { BROOK_TOP };

/** Points the forest path runs through: [x, y]. It crosses the brook on the bridge. */
const PATH = [
  [-40, 792],
  [450, 782],
  [800, 738],
  [1290, 698],
  [1640, 668],
];

/** Middle of the forest path at x, smoothly between its points. */
export function pathY(x: number) {
  const next = PATH.findIndex(([px]) => px > x);
  const i = next < 0 ? PATH.length - 2 : Math.max(0, next - 1);
  const [x1, y1] = PATH[i];
  const [x2, y2] = PATH[i + 1];
  const t = Math.max(0, Math.min(1, (x - x1) / (x2 - x1)));
  return y1 + ((y2 - y1) * (1 - Math.cos(t * Math.PI))) / 2;
}

/** Half the height of the path at x. */
export function pathHalf(x: number) {
  return depthScale(pathY(x)) * 44;
}

/** The bridge over the brook, where the path crosses it. */
export const BRIDGE_Y = 690;
export const BRUECKE = ground(0, 0, brookX(BRIDGE_Y), BRIDGE_Y + 10, 0.85);

/** The fir on the left and the cuckoo on its branch. */
export const TANNE = ground(0, 0, 122, 470, 1.45);
/** The oak with the owl in its hollow. */
export const EICHE = ground(0, 0, 560, 450, 1.5);
/** The birch with the woodpecker on its trunk and the nest in its fork. */
export const BIRKE = ground(0, 0, 900, 420, 1.4);
/** The signpost and the raven sitting on it. */
export const WEGWEISER = ground(0, 0, 700, 724, 0.95);
/** The log pile and the stag beetle on top. */
export const HOLZ = ground(0, 0, 140, 705, 1.05);
/** The tree stump and the mouse in its hole. */
export const STUMPF = ground(0, 0, 770, 900, 1.05);
/** The berry bush and the butterfly above it. */
export const BEEREN = ground(0, 0, 1080, 904);
/** The fern and the ladybird on its leaf. */
export const FARN = ground(0, 0, 80, 966);
/** The beaver on its dam across the brook. */
export const DAMM_Y = 548;
export const BIBER = ground(0, 0, brookX(DAMM_Y) - brookHalf(DAMM_Y) - 22, DAMM_Y + 4, 0.9);
