import type { Placement } from "./types";

// Where things stand in a picture. The sky ends at the horizon; below it the
// ground runs from the back (far, small) to the bottom edge (near, big). Every
// drawing is scaled by how far back it stands, so the picture looks deep.
// All scenes share the 1600 × 1000 canvas and this horizon.

/** Where the sky meets the ground. */
export const HORIZON = 330;
/** Lines on the ground (kerb joints, tyre tracks) run towards this point. */
export const VANISHING_X = 800;

/** How big something is when it stands at ground height y: half size at the horizon, almost full size at the bottom. */
export function depthScale(y: number) {
  return 0.45 + (0.5 * (y - HORIZON)) / (1000 - HORIZON);
}

/** Moves a drawing so that its point (fromX, fromY) lands on (toX, toY), at a fixed scale. For things in the sky. */
export function float(fromX: number, fromY: number, toX: number, toY: number, scale: number): Placement {
  return { x: toX - fromX * scale, y: toY - fromY * scale, scale };
}

/**
 * Stands a drawing on the ground: its foot point (fromX, fromY) lands on (toX, toY)
 * and it is scaled for that depth. `size` makes big things (a house) bigger than small ones.
 */
export function ground(fromX: number, fromY: number, toX: number, toY: number, size = 1): Placement {
  return float(fromX, fromY, toX, toY, depthScale(toY) * size);
}

/** Indoor pictures: where the floor's lines meet, the eye height of the picture (depthScale is 0 there). */
export const EYE_Y = HORIZON - (0.45 * (1000 - HORIZON)) / 0.5;

/** Indoor pictures: a point on the floor, world x (relative to the middle) at depth scale `s`. */
export function onFloor(worldX: number, s: number): [number, number] {
  return [VANISHING_X + worldX * s, EYE_Y + (1000 - EYE_Y) * (s / depthScale(1000))];
}

/** Placement as an SVG transform, for parts of the background that move along. */
export const transformOf = ({ x, y, scale }: Placement) => `translate(${x} ${y}) scale(${scale})`;

/** Where a line on the ground through (x, y) is at height y2, if it runs towards the vanishing point. */
export function towardsHorizon(x: number, y: number, y2: number) {
  return VANISHING_X + ((x - VANISHING_X) * (y2 - HORIZON)) / (y - HORIZON);
}
