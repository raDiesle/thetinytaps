import { depthScale, ground } from "../layout";
import type { Box } from "../types";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the tree, the bench, the climbing tower with its slide, the swing and
// the ice cream cart in front of the park fence; the seesaw, the dog with the ball, the
// roundabout, the spring horse and the bubbles on the lawn; the gravel path with the balance
// bike, the scooter, the pram and the pigeons; the sandpit with its toys, the water pump and
// the flower bed at the front.

/** Points the gravel path runs through: [x, y]. Lower on the left, so it runs a little uphill. */
const PATH = [
  [-40, 800],
  [420, 786],
  [820, 756],
  [1250, 732],
  [1640, 716],
];

/** Middle of the path at x, smoothly between its points. */
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
  return depthScale(pathY(x)) * 46;
}

/** Boxes that stay on the gravel path from the left edge to the right one, for a beetle on it. */
export const PATH_BOXES: Box[] = Array.from({ length: 10 }, (_, i) => {
  const [x1, x2] = [i * 160, (i + 1) * 160];
  const half = pathHalf((x1 + x2) / 2) * 0.9;
  const top = pathY(x1) - half;
  return [x1, top, 160, pathY(x2) + half - top];
});

/** The sandpit's wooden frame: back edge at SAND_TOP, running out of the picture at the bottom. */
export const SAND_TOP = 846;
export const SAND_LEFT = 250;
export const SAND_RIGHT = 1080;

/** The tree with the bird on its branch and the squirrel on its trunk. */
export const TREE = ground(0, 0, 118, 468, 1.9);
/** The climbing tower, its slide and the cat on the roof. */
export const TOWER = ground(0, 0, 500, 500, 1.5);
/** The swing frame with its two seats. */
export const SWING = ground(0, 0, 1090, 474, 1.45);
/** Mum and the pram she is pushing. */
export const PRAM_X = 1340;
export const PRAM = ground(0, 0, PRAM_X, pathY(PRAM_X) + 6, 1.05);
/** The water pump and the little stream it fills. */
export const PUMP = ground(0, 0, 1236, 900, 0.95);
/** The little stream's water below the pump, in picture units. */
export const STREAM: Box = [PUMP.x + 10 * PUMP.scale, PUMP.y, 90 * PUMP.scale, 1000 - PUMP.y];
/** The flower bed with the butterfly and the ladybird. */
export const FLOWERS = ground(0, 0, 1404, 946, 1);
