import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the fire station with its hose tower and flag, the garden with the
// big tree on the right; the yard in front of the station with the vehicles; the lawn at
// the front with the firefighters, the dog and the visitors.

/** Where the station and its tower stand. */
export const STATION_Y = 480;
/** The yard (asphalt) in front of the station, down to the lawn at the front. */
export const YARD_BOTTOM = 812;

/** The station building: the gate, the helmets bay, the pole, the alarm bell and the pigeon belong to it. */
export const STATION = ground(0, 0, 610, STATION_Y);
/** The hose tower and the siren on top. */
export const TOWER = ground(0, 0, 122, STATION_Y, 0.85);
/** The flag pole and the bird sitting on top. */
export const FLAG = ground(0, 0, 1062, 488);
/** The big tree with the cat on its branch and the squirrel at its trunk. */
export const TREE = ground(0, 0, 1430, 545, 1.7);
/** The flower box in front of the tower and its butterfly. */
export const BEET = ground(0, 0, 62, 534);
/** The ladder truck: its ladder reaches up to the cat in the tree. */
export const TRUCK = ground(0, 0, 1050, 700, 1.05);
/** The hydrant and the firefighter whose hose it feeds. */
export const HYDRANT = ground(0, 0, 792, 640, 1.2);
export const FIREWOMAN = ground(0, 0, 1342, 792, 1.05);
/** The puddle with the duckling, where the hose has sprayed. */
export const PUDDLE = ground(0, 0, 1190, 948);
/** The boots and the mouse peeking out of one of them. */
export const BOOTS = ground(0, 0, 128, 962);
