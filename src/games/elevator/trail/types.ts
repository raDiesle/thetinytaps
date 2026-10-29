import type { ComponentType } from "react";
import type { Outfit, Pose } from "../kid";
import type { GoalId, ItemId } from "./items";
import type { Worry } from "./worries";

// A trail level ("Weg-Abenteuer"): a long world seen from the side that scrolls along with the child.
// Something the child loves goes away at the start (the kite flies off), and the child follows it.
// On the way it finds things that go into its bag (three at most), and at every obstacle the bag
// opens: the child taps the thing to use, and the child uses it by itself; a thought bubble says why it helps.
// Walking on is one tap on the action button (or anywhere, or any key); only a thing to pick up is ringed.
// A wrong thing is tried, something funny happens, it comes back into the bag and the right one glows.

/** A point in the world: x to the right, y down; the ground at the start is at y = 740. */
export type Point = [number, number];

/** A sound at `ms` after something starts. */
export type Cue = [number, () => void];

/** What a level's drawing gets, to draw the world as far as the child has come. */
export interface SceneryProps {
  /** Ids of the stations already done: things picked up, obstacles solved. */
  done: string[];
  /** The station the child stands at now (an obstacle may look up, bark …). */
  here: string | null;
  /** A wrong thing was just tried at this station; a new `n` wiggles it again. */
  nope: { id: string; n: number } | null;
  /** The goal is back and everybody is happy (the end's party): the sandcastle gets built. */
  party: boolean;
}

interface StationBase {
  /** Unique in the level; the drawing reads it from `done`. */
  id: string;
  /** Where the child stands for it, on the ground. */
  x: number;
  /** Spoken when the child gets there (only with "Vorlesen"). */
  ask: string;
  /** Spoken when it is done. */
  done: string;
}

/** Something lying on the way: a tap puts it into the bag. */
export interface Pickup extends StationBase {
  kind: "pickup";
  item: ItemId;
  /** Where the thing is; it flies from there into the bag. */
  at: Point;
  sound: () => void;
}

/** Something in the way: the child picks from the bag what helps. */
export interface Obstacle extends StationBase {
  kind: "obstacle";
  /** The thing from the bag that helps. */
  need: ItemId;
  /** Where the thing flies to when it is used or tried. */
  at: Point;
  /** Sounds when the child arrives (a bark, a neigh). */
  meet: Cue[];
  /** Sounds while it is being solved, and how long that takes before going on. */
  sounds: Cue[];
  ms: number;
  /** The funny sound when a wrong thing is tried. */
  nope: () => void;
  /** Why the thing helps, in a thought bubble while the child chooses: a creature (or the flowers) thinks of the thing
   * it wants (`wants`: the bubble's tip, just above its head), or the child thinks of what would happen (`worry`). */
  why: { wants: Point } | { worry: Worry };
  /** Solving it gives the goal back: it comes into the child's hands. */
  frees?: boolean;
  /** Solved, the child floats down the ground points `to` by itself, slowly, and the thing goes along where it is, at
   * `at` above the child (the open umbrella over the waterfall); then the child puts it down at `put` from its feet
   * (the umbrella stuck into the raft), where the level's drawing shows it from then on. */
  float?: { to: Point[]; put: Point };
  /** What the child wears from when it is solved on (the flip-flops on the hot sand): the thing is put on, not given. */
  wear?: Outfit[];
}

/** Stairs or a ladder: the first tap climbs half of the steps, the second the rest (never more taps in a row). */
export interface Climb extends StationBase {
  kind: "climb";
  /** The steps, each a point of the ground, from the bottom up. */
  steps: Point[];
  /** A slide from the top: the child slides down these ground points by itself, fast. */
  slide?: Point[];
  /** What the child sits on to slide down (the sled waiting at the top), drawn under it standing on (0, 0). While it
   * rides, the climb's id is `here`; at the bottom it goes into `done`, so the scenery draws the sled at the top
   * before and at the bottom after. */
  sled?: ComponentType;
}

/** Something that happens by itself when the child gets there (the traffic light turns green): no bag, no extra tap. */
export interface Moment extends StationBase {
  kind: "moment";
  /** What the child does meanwhile (presses the button). */
  pose: Pose;
  /** Sounds while it happens, and how long it takes; then it is done. */
  sounds: Cue[];
  ms: number;
}

/** One of the two ways at a fork, with its own stations; both lead on to the same place. */
export interface Way {
  /** Unique in the level; it goes into `done` when the child takes this way. */
  id: string;
  /** The picture on its sign (stairs, a tunnel), drawn to fit about 120 × 120 around (0, 0). */
  Sign: ComponentType;
  /** Where its sign is in the world; a tap on it takes this way. */
  sign: Point;
  /** The ground line while on this way (with its stairs); it must be the level's ground before the fork and after the
   * way's last station. */
  ground?: Point[];
  /** Spoken when the child picks it. */
  say: string;
  /** Its stations, in walking order; the first one starts as soon as the way is picked. */
  stations: Station[];
}

/** Two ways, both to the goal: the child picks one by tapping its sign (or 1 / 2), and next time can take the other. */
export interface Fork extends Omit<StationBase, "done"> {
  kind: "fork";
  ways: [Way, Way];
}

export type Station = Pickup | Obstacle | Climb | Moment;

/** A way through the air or along the ground: points with the time to get to each, then `to` in `ms`. */
export interface Flight {
  via?: [Point, number][];
  to: Point;
  ms: number;
  /** How far it swings up and down on the way (the kite in the wind); 0 for a ball. */
  sway: number;
}

/** One trail level, with its world drawing and its stations in walking order. */
export interface TrailLevel {
  id: string;
  /** For the parents' start screen only; the child sees the picture. */
  title: string;
  /** What the level is about: shown on its card and in the thought bubble. */
  goal: GoalId;
  /** The world near the path, drawn in world points. */
  Scenery: ComponentType<SceneryProps>;
  /** Drawn in front of the goal (the sand that half hides the ball), behind the child. */
  Front?: ComponentType<SceneryProps>;
  /** A raft the child stands on from the start and paddles instead of walking, until it gets off at `until` (where the
   * raft stays behind). Its drawing stands on (0, 0) under the child's feet; `paddling` while it moves. */
  raft?: { Raft: ComponentType<{ paddling: boolean; done: string[] }>; until: number };
  /** Far hills and clouds; they move slower than the world, which makes it deep. */
  Backdrop: ComponentType;
  /** The ground line the child walks on, from left to right; stairs are one point per step. */
  ground: Point[];
  /** For a world that goes up instead of sideways (a stairwell): at each of these x of the ground the way turns round,
   * so the drawing zigzags up (`placed` in `ground.ts`). Then x in `ground`, `start`, the stations' `x` and the steps
   * is the way walked, while every other point (`at`, `wants`, flights) is where it is drawn; the drawing fits
   * between x 0 and 1600, and the camera follows only the height. Each turn is a point of `ground`. */
  turns?: number[];
  /** Where the child starts, on the ground. */
  start: number;
  /** What the child wears at the start (bare feet at the beach); shoes when left out. */
  wear?: Outfit[];
  /** At the start: the goal leaves the child's hands for `to` (where the last obstacle keeps it). */
  away: Flight & {
    pose: Pose;
    sounds: Cue[];
    say: string;
    /** Who takes the goal away (the hare with the carrot in its mouth): drawn round the goal while it goes, so the goal
     * is at (0, 0) of the drawing; it jumps up out of the snow. The scenery draws it again where it ends up. */
    thief?: ComponentType;
  };
  stations: (Station | Fork)[];
  /** At the end, with the goal back in hand: it goes to `to`, and everybody is happy. */
  finale: Flight & {
    say: string;
    /** The goal becomes part of the world where it lands (the nose on the snowman's face): there it is hidden and this
     * id goes into `done`, so the scenery draws it in place. */
    into?: string;
  };
}
