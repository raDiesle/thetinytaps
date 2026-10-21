import type { Placement } from "../types";

// Where things stand in the picture. The sky ends at the horizon; below it the
// ground runs from the fence (far, small) to the bottom edge (near, big). Every
// drawing is scaled by how far back it stands, so the picture looks deep.

/** Where the sky meets the fence. */
export const HORIZON = 330;
/** Lines on the ground (kerb joints, tyre tracks) run towards this point. */
export const VANISHING_X = 800;

/** How big something is when it stands at ground height y: half size at the fence, almost full size at the bottom. */
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

/** Placement as an SVG transform, for parts of the background that move along. */
export const transformOf = ({ x, y, scale }: Placement) => `translate(${x} ${y}) scale(${scale})`;

/** Where a line on the ground through (x, y) is at height y2, if it runs towards the vanishing point. */
export function towardsHorizon(x: number, y: number, y2: number) {
  return VANISHING_X + ((x - VANISHING_X) * (y2 - HORIZON)) / (y - HORIZON);
}
