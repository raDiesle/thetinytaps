import { ground } from "../layout";

// A bathroom, seen from the door. The back wall stands on the horizon: tiles below, the
// window, the mirror and the shelf above. Against it from left to right the bathtub, the
// washstand, the toilet and the washing machine, the door at the right. On the tiled floor
// in front: the bath mat with the cat, the stool with the hair dryer, the potty, the bin,
// the scale and the laundry basket, and at the front toys, slippers and the wet dog.

/** The bathtub; the child, the duck and the foam stand in it. */
export const BATH = ground(0, 0, 280, 500, 1.56);
/** The washstand; tap, toothbrush and toothpaste stand on it. */
export const SINK = ground(0, 0, 720, 450, 1.445);
/** The toilet. */
export const TOILET = ground(0, 0, 1060, 470, 1.32);
/** The washing machine. */
export const WASHER = ground(0, 0, 1290, 425, 1.4);
