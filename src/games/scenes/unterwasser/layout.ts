import { depthScale, float, ground } from "../layout";
import type { Placement } from "../types";

// Under the sea, seen from the side. A thin strip of sky with the lighthouse, the boat and
// the gull sits above the water surface; below it the open water, and from the horizon the
// sea floor runs to the front. From back to front: the whale, the dolphin and the ray in the
// open water, the shipwreck and the submarine at the back, the reef in the middle (mermaid,
// coral, anemone, octopus), the open sand with the treasure chest and at the front seagrass,
// fish and bubbles.

/** Where the water ends and the air begins. */
export const SURFACE = 96;

/**
 * Swimming things: the drawing's centre (0, 0) lands on (x, y) and is sized as if it swam
 * above the sea floor at `floorY`, so something high up near the back is small.
 */
export function swim(x: number, y: number, floorY: number, size = 1): Placement {
  return float(0, 0, x, y, depthScale(floorY) * size);
}

/** The boat on the surface; the anchor's chain hangs down from it. */
export const BOAT = float(0, 0, 640, SURFACE + 2, 0.55);
/** The anchor on the sea floor below the boat. */
export const ANCHOR = ground(0, 0, 650, 445, 1.2);
/** The rock the mermaid sits on. */
export const MERMAID_ROCK = ground(0, 0, 230, 690);
/** The rock the octopus sits on. */
export const OCTO_ROCK = ground(0, 0, 1185, 625);
/** The stone the sea snail crawls on. */
export const SNAIL_STONE = ground(0, 0, 650, 700);
