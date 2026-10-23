import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`;
// things on the water stand on the water line. From back to front: the lighthouse, the
// sailing boat, the ferry, the dolphin, the rowing boat and the buoy far out on the sea; the
// swim ring, the inflatable duck, the air mattress and the waves at the water's edge; the
// lifeguard tower, the chip shop and the beach hut where the beach reaches further back on
// the right; the beach tent and the beach chair on the left; the towel under the sunshade
// with mum, the chips and the gull, the child and the dog in the middle; the sand castle,
// the toys, the treasure chest and the cool box at the front.

/** Points the water's edge runs through: [x, y]. The beach reaches further back on the right. */
const SHORE = [
  [-40, 604],
  [400, 588],
  [800, 552],
  [1200, 508],
  [1640, 474],
];

/** Where the water meets the sand at x, smoothly between the points. */
export function shoreY(x: number) {
  const next = SHORE.findIndex(([px]) => px > x);
  const i = next < 0 ? SHORE.length - 2 : Math.max(0, next - 1);
  const [x1, y1] = SHORE[i];
  const [x2, y2] = SHORE[i + 1];
  const t = Math.max(0, Math.min(1, (x - x1) / (x2 - x1)));
  return y1 + ((y2 - y1) * (1 - Math.cos(t * Math.PI))) / 2;
}

/** The towel under the sunshade: the sunshade, mum and her chips stand on it. */
export const TOWEL = ground(0, 0, 720, 772, 1);
/** The lighthouse on its rock. */
export const LIGHTHOUSE = ground(0, 0, 112, 426, 1.6);
/** The lifeguard tower on its stilts. */
export const LIFEGUARD = ground(0, 0, 1206, 560, 1.4);
