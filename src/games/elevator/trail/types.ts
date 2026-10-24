import type { ComponentType } from "react";
import type { Pose } from "../kid";
import type { GoalId, ItemId } from "./items";

// A trail level ("Weg-Abenteuer"): a long world seen from the side that scrolls along with the child.
// Something the child loves goes away at the start (the kite flies off), and the child follows it.
// On the way it finds things that go into its bag (three at most), and at every obstacle the bag
// opens: the child taps the thing to use, and the child uses it by itself. A wrong thing is tried,
// something funny happens, it comes back into the bag and the right one glows.

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
  /** Where the thing is; the hand points there and it flies from there into the bag. */
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
  /** Solving it gives the goal back: it comes into the child's hands. */
  frees?: boolean;
}

/** Stairs or a ladder: every tap takes one step. */
export interface Climb extends StationBase {
  kind: "climb";
  /** The steps, each a point of the ground, from the bottom up. */
  steps: Point[];
}

export type Station = Pickup | Obstacle | Climb;

/** One trail level, with its world drawing and its stations in walking order. */
export interface TrailLevel {
  id: string;
  /** For the parents' start screen only; the child sees the picture. */
  title: string;
  /** What the level is about: shown on its card and in the thought bubble. */
  goal: GoalId;
  /** The world near the path, drawn in world points. */
  Scenery: ComponentType<SceneryProps>;
  /** Far hills and clouds; they move slower than the world, which makes it deep. */
  Backdrop: ComponentType;
  /** The ground line the child walks on, from left to right; stairs are one point per step. */
  ground: Point[];
  /** Where the child starts, on the ground. */
  start: number;
  /** At the start: the goal leaves the child's hands for `to` (where the last obstacle keeps it). */
  away: { to: Point; ms: number; pose: Pose; sounds: Cue[]; say: string };
  stations: Station[];
  /** At the end, with the goal back in hand: it goes to `to`, and everybody is happy. */
  finale: { to: Point; ms: number; say: string };
}
