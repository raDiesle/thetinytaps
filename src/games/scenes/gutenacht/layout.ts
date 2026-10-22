import { ground } from "../layout";

// A child's room in the evening, seen from the middle of the room. The back wall stands on
// the horizon: the window with the moon in the middle, the bed against the wall at the left,
// the bookshelf, the doll's house and the door at the right. On the wooden floor in front:
// the round rug with the train, the rocking horse, the cat's basket and the cuddly toys.

/** The bed against the wall; the child, the blanket and the teddy lie in it. */
export const BED = ground(0, 0, 330, 520, 1.5);
/** The bedside table; the lamp and the alarm clock stand on it. */
export const NIGHTSTAND = ground(0, 0, 640, 468, 1.15);
/** The bookshelf (background); the book, the music box and the goldfish stand on it. */
export const SHELF = ground(0, 0, 990, 440, 1.25);
/** The doll's house against the wall. */
export const DOLLHOUSE = ground(0, 0, 1230, 462, 1.3);

/** Shelf boards, in the shelf's own coordinates: the top and the two boards things stand on. */
export const SHELF_TOP = -400;
export const SHELF_BOARD_1 = -270;
export const SHELF_BOARD_2 = -140;
/** The nightstand's top, in its own coordinates. */
export const NIGHTSTAND_TOP = -150;

/** The window in the back wall: the glass, where the moon, the stars and the owl are. */
export const WINDOW = { x: 604, y: 50, w: 232, h: 222 };
