import { float, ground } from "../layout";
import type { Placement } from "../types";

// In space, on a friendly moon. Above the horizon is deep blue space with the planets, the
// comet, the ufo, the space station and the astronaut floating on a line. Below it the moon
// runs to the front. From back to front: the flag, the solar panels, the dish, the lander, the
// moon base and the rocket on its launch pad at the horizon; in the middle the greenhouse, the
// moon digger, the aliens, the rover and the space flower; then the crater, the robot dog, the
// moon rabbit and the crystal; at the front the astronaut, the ball, the helmet, the crate, the
// cheese with the mouse, the telescope and the robot.

/** Things in space: the drawing's middle (0, 0) lands on (x, y) at a fixed size. */
export function space(x: number, y: number, scale = 1): Placement {
  return float(0, 0, x, y, scale);
}

/** The rocket and its launch pad with the tower. */
export const ROCKET = ground(0, 0, 310, 480, 1.6);
