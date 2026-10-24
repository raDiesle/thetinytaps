import { depthScale, float, ground } from "../layout";
import type { Box, Placement } from "../types";

// Placements of the winter picture: a village edge with a red wooden house, a frozen pond in the
// middle, the sledging hill on the right and a path where the horse sleigh drives.

/** The red wooden house; its drawing (and the icicles on its eaves) uses the coordinates of ../winterbaustelle's icicles. */
export const HOUSE = ground(1060, 700, 640, 520, 1.38);

/** The big snowy fir at the back left and the squirrel on its branch (as in the Winter-Baustelle). */
export const FIR = ground(0, 0, 80, 414, 1.7);
export const SQUIRREL = float(150, 494, 136, 330, 0.95);

/** The bird table and the blue tit sitting on it. */
export const BIRD_TABLE = ground(0, 0, 112, 690, 1.25);

/** The bench on the path and the hot cocoa standing on it. */
export const BENCH = ground(0, 0, 1460, 812, 1.1);

/** The pond: middle, half width, half height. */
export const POND = { cx: 440, cy: 646, rx: 270, ry: 52 };

/**
 * The sledging hill on the right. It is one big mound at the same distance everywhere, so
 * things on it all get its scale, wherever they stand on its slope.
 */
export const HILL_SCALE = depthScale(660);
export const onHill = (x: number, y: number, size = 1): Placement => float(0, 0, x, y, HILL_SCALE * size);
/** The slope runs down to the left at about this angle (the sledges tilt with it). */
export const SLOPE = -20;

/** The bounds of a box after rotating it by `deg` around (0, 0), for things tilted on the slope. */
export function rotatedBox([x, y, w, h]: Box, deg: number): Box {
  const a = (deg * Math.PI) / 180;
  const pts = [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ].map(([px, py]) => [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  return [Math.round(x0), Math.round(y0), Math.round(Math.max(...xs) - x0), Math.round(Math.max(...ys) - y0)];
}
