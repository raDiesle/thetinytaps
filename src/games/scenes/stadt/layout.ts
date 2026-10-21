import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the row of houses, the back pavement and the park, the road
// with two lanes (far lane drives left, near lane drives right), the front pavement.

/** Where the houses stand. */
export const HOUSES = 468;
/** The road between its two kerbs. */
export const ROAD_TOP = 590;
export const ROAD_BOTTOM = 772;
/** Where the front pavement begins. */
export const PAVEMENT = 794;
/** The park on the right takes the back pavement from here on. */
export const PARK_X = 1075;
/** The zebra crossing, measured at the near kerb. */
export const ZEBRA = [770, 900] as const;

/** The house and the cat on its windowsill. */
export const HAUS = ground(0, 0, 390, HOUSES, 1.4);
/** The postbox and the sparrow sitting on it. */
export const POST = ground(0, 0, 252, 522, 1.2);
/** The park tree and the bird in it. */
export const TREE = ground(0, 0, 1440, 446, 1.9);
/** The flower tub and its butterfly. */
export const BEET = ground(0, 0, 60, 940);
