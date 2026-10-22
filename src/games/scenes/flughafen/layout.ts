import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`
// (things in the sky with `float`). From back to front: the airfield with the runway, the
// tower and the hangar; the railway with the train; the platform with the clock and the
// conductor; the apron on the left (the planes' helpers) and the forecourt road on the right.

/** The runway across the airfield. */
export const RUNWAY_TOP = 374;
export const RUNWAY_BOTTOM = 404;
/** Where the airfield's grass ends at the railway fence. */
export const FENCE = 512;
/** The rails, where the train's wheels stand. */
export const TRACK = 560;
/** The platform in front of the train, from its edge to the railing. */
export const PLATFORM_TOP = 574;
export const PLATFORM_BOTTOM = 664;
/** Where the apron (left) and the forecourt road (right) meet. */
export const FORECOURT_X = 880;

/** The train: locomotive and two coaches, each placed on the track. */
export const trainAt = (x: number) => ground(0, 0, x, TRACK, 1.15);
/** The station clock and the sparrow on top of it. */
export const UHR = ground(0, 0, 562, 644, 1.1);
/** The luggage trolley and the cat in its carrier box on top. */
export const KULI = ground(0, 0, 1112, 950);
/** The pilot and her dog on its lead. */
export const PILOT = ground(0, 0, 1446, 958);
