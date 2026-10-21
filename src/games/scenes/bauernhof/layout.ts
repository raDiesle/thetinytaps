import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the wheat field and the windmill on the hill, the barn and the
// farmhouse, the pasture (fence behind horse and cow) and the meadow, the dirt road,
// and the front with the mud puddle, the hens and the pond.

/** Where the barn and the farmhouse stand. */
export const FARM = 470;
/** The pasture fence, behind the horse and the cow; it ends at the rooster's post. */
export const FENCE = 548;
export const FENCE_END = 640;
/** The dirt road between its two grass edges. */
export const ROAD_TOP = 690;
export const ROAD_BOTTOM = 790;
/** The wheat field on the right, far back. */
export const FIELD_X = 1060;
/** The mud puddle of the pigs and the pond of the duck and frog: centre x, centre y, radius x, radius y. */
export const MUD = [215, 950, 190, 40] as const;
export const POND = [1440, 920, 210, 56] as const;

/** The barn and the owl in its hayloft. */
export const SCHEUNE = ground(0, 0, 280, FARM, 1.5);
/** The farmhouse, the stork on its chimney and the cat at its door. */
export const HOF = ground(0, 0, 720, 462, 1.4);
/** The apple tree. */
export const TREE = ground(0, 0, 985, 488, 1.75);
/** The sunflower in the front meadow; the bee flies around its head. */
export const SUNFLOWER = ground(0, 0, 1218, 985);
