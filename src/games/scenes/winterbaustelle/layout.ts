import { float, ground } from "../layout";

// Placements of the winter site. The house with the crane (SITE) and the digger (DIGGER) stand where
// they stand in the Baustelle, so they are imported from there; everything else is placed here.

export { DIGGER, PAVEMENT, ROAD_BOTTOM, ROAD_TOP, SITE } from "../baustelle/layout";

/** The big snowy fir at the back left and the squirrel on its branch. */
export const FIR = ground(0, 0, 80, 414, 1.7);
export const SQUIRREL = float(150, 494, 136, 330, 0.95);
/** The bird table and the blue tit sitting on it. */
export const BIRD_TABLE = ground(0, 0, 1212, 616, 1.3);
