import { ground } from "../layout";

// Every drawing of this scene has its foot point at (0, 0) and is placed with `ground`.
// From back to front: the fence with its gate, the tower and the swing, the
// sandy path across the playground, and the sandpit and the mud table in front.

/** Where the wooden fence stands at the back. */
export const FENCE = 400;
/** The gap in the fence where the gate hangs. */
export const GATE_X = 560;
/** The sandy path: its far and near edge at the left, it bends a little towards the right. */
export const PATH_TOP = 712;
export const PATH_BOTTOM = 796;

/** The big tree and the squirrel on its trunk. */
export const TREE = ground(0, 0, 92, 432, 2);
/** Climbing tower with the slide on its right and the wobbly bridge on its left. */
export const TOWER = ground(0, 0, 400, 548, 1.3);
/** The sandpit and everything in it: moulds, toy digger, bucket and spade. */
export const SANDPIT = ground(0, 0, 300, 966, 1);
/** The water pump and the mud table it fills. */
export const MUD = ground(0, 0, 760, 906, 1);
/** The flower bed and its butterfly. */
export const FLOWERS = ground(0, 0, 1470, 968, 1);
