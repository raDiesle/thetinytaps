import { ground, onFloor } from "../layout";

// A supermarket, seen from the checkout. The back wall stands on the horizon: from left to
// right the entrance with the sliding door, the bakery, the cheese and the fish counter, the
// cooling shelf, the milk and the bottle machine. Two shelf aisles run from the wall towards
// us. On the floor in front: the fruit stand, the scale, the can tower, the freezer, the
// shopping carts, and at the front the checkout with the belt and the cashier.

/** The two shelf aisles: world x of their sides, how far they reach towards us, and their height. */
export const GONDOLA = { inner: 460, outer: 700, front: 0.6, height: 240 };

/** Front face of a shelf aisle (end cap) in picture coordinates: x1, x2, top, bottom. */
export function endCap(side: -1 | 1) {
  const [xa, bottom] = onFloor(side * GONDOLA.outer, GONDOLA.front);
  const [xb] = onFloor(side * GONDOLA.inner, GONDOLA.front);
  return { x1: Math.min(xa, xb), x2: Math.max(xa, xb), top: bottom - GONDOLA.height * GONDOLA.front, bottom };
}

/** The fruit and vegetable stand; apples, bananas, carrots, tomatoes and the melon lie on it. */
export const STAND = ground(0, 0, 225, 640, 1);
/** The shopping cart; the child sits in it. */
export const CART = ground(0, 0, 650, 830, 1);
/** The checkout counter with belt, till, egg carton and the cashier behind it. */
export const CHECKOUT = ground(0, 0, 1305, 975, 1);
