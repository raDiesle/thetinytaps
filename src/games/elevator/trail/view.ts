import type { ComponentType } from "react";
import type { Outfit, Pose } from "../kid";
import type { FriendPose } from "./friends";
import { facing, groundY, placed } from "./ground";
import type { Goal, ItemId, Picture } from "./items";
import type { Point, Station, TrailLevel } from "./types";

// The state of a trail level as React draws it, and the plain sums the script moves things by. No drawing here:
// `TrailPlay.tsx` runs the script, `layers.tsx` draws.

/** The footprints to where the child goes next are this far apart. */
const PRINT_GAP = 62;
/** The backpack on the child's back while nothing goes in or out (the ghost wears it too). */
export const PACK_SHUT = { open: false, bump: 0 };

/** What the next tap does: the child walks along the footprints to its pale ghost and does what the ghost does
 * there; the button shows the thing it gets there, or feet or stairs. */
export interface Next {
  prints: Point[];
  ghost: Point;
  /** The way the ghost looks: in a world that turns, it may look left. */
  face: 1 | -1;
  pose: Pose;
  icon: ItemId | "walk" | "climb" | "paddle";
  /** Where the thing lies that the tap picks up: a yellow ring goes round it, and its pale picture waits in the
   * backpack where it will go. */
  at?: Point;
}

/** The thing the next tap picks up, if it picks one up. */
export const itemOf = (icon: Next["icon"]): ItemId | null => (icon === "walk" || icon === "climb" || icon === "paddle" ? null : icon);

/** The child in the world: where its feet are, how it walks and looks. */
export interface KidState {
  x: number;
  y: number;
  /** Length of the current walk (and scroll) in ms; 0 while standing. */
  walk: number;
  pose: Pose;
  face: 1 | -1;
  /** Bumped to make it hop when tapped. */
  hop: number;
}

/** The creature walking along with the child (G-10), drawn by its `FRIENDS` entry. */
export interface FriendState {
  /** Its picture in the bag, and the key of `FRIENDS`. */
  id: ItemId;
  x: number;
  y: number;
  /** Length of the current run in ms; 0 while it stays. */
  ms: number;
  face: 1 | -1;
  pose: FriendPose;
  /** Bumped to make it hop (joining, setting off, tapped). */
  hop: number;
}

/** Everything React draws of a level; the script changes it with `put` in `TrailPlay.tsx`. */
export interface View {
  picking: boolean;
  kid: KidState;
  /** The things in the bag, one per slot. */
  bag: (ItemId | null)[];
  /** The slot a thing is just dropping into, or rising out of, on the screen. */
  entering: number | null;
  leaving: number | null;
  /** Bumped to bounce the backpack on the screen when a thing goes in or out. */
  bagBump: number;
  /** The thing the child carries in the world, between where it lies, the hands and the backpack. */
  carry: ItemId | null;
  /** What the child wears (bare feet, flip-flops). */
  wear: Outfit[];
  /** The backpack on the child's back: its lid is open while a thing goes in or out; `bump` bounces it. */
  pack: { open: boolean; bump: number };
  done: string[];
  here: string | null;
  nope: { id: string; n: number } | null;
  /** The bag is open: the child picks a thing. */
  choosing: boolean;
  /** The thing that helps glows. */
  hint: ItemId | null;
  /** Bumped to bounce the slots. */
  shake: number;
  /** The action button waits for a tap; `nudge` makes it jump anew, `next` shows what the tap will do. */
  action: { nudge: number; next: Next } | null;
  /** The child tapped while something was still going on: the button stays lit, and the next walk goes by itself. */
  queued: boolean;
  /** A thought bubble: the child's (`at` null) with the goal when it goes away, or at an obstacle why a thing helps –
   * the child's worry, or the creature's wish above its head at `at`. `nudge` counts the reminders. */
  bubble: { picture: Picture; at: Point | null; nudge: number } | null;
  /** At a fork: the child picks a way by its sign; each shows where it goes first. `nudge` makes the signs hop. */
  fork: { id: string; ways: Next[]; nudge: number } | null;
  /** The friend walking along, once a creature has joined. */
  friend: FriendState | null;
  /** The goal is going away, with the level's thief round it (the hare). */
  away: boolean;
  /** The child sits on this while it slides down (the sled). */
  riding: ComponentType | null;
  party: boolean;
}

/** How a level starts: the child at `start`, the bag empty, nothing done. */
export const startView = (level: TrailLevel): View => {
  const [x, y] = placed(level.turns, [level.start, groundY(level.ground, level.start)]);
  return {
    picking: false,
    kid: { x, y, walk: 0, pose: "stand", face: facing(level.turns, level.start), hop: 0 },
    bag: [null, null, null],
    entering: null,
    leaving: null,
    bagBump: 0,
    carry: null,
    wear: level.wear ?? [],
    pack: PACK_SHUT,
    done: [],
    here: null,
    nope: null,
    choosing: false,
    hint: null,
    shake: 0,
    action: null,
    queued: false,
    bubble: null,
    fork: null,
    friend: null,
    away: false,
    riding: null,
    party: false,
  };
};

/** The hand of the child reaching out (pose "reach"), where the string is held. */
export const handOf = (kid: KidState): Point => [kid.x + 62 * kid.face, kid.y - 112];
/** Where the goal is while the child holds it: high up on its string, or in the reaching hand. */
export const heldOf = (kid: KidState, goal: Goal): Point =>
  goal.carry === "string" ? [kid.x + 140 * kid.face, kid.y - 250] : [kid.x + 66 * kid.face, kid.y - 78];

/** Eases in and out: slow at the start and the end of a move, quick in its middle (`t` and the result from 0 to 1). */
export const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Where the goal is at `t` (0–1) of its move from `from` to `to`, eased, swaying up and down by `sway` on the way
 * (three times, less and less). */
export const goalAt = ([x0, y0]: Point, to: Point, t: number, sway = 0): Point => {
  const e = ease(t);
  const side = Math.sin(t * Math.PI * 3) * sway * (1 - t);
  return [x0 + (to[0] - x0) * e, y0 + (to[1] - y0) * e + side];
};

/** Where the carried thing is, and how big, at `t` (0–1) of its move from `from` (size `s0`) to `to` (size `s`): along
 * a bow `arc` points high, eased – or at an even pace with `linear`, to keep step with the child walking or floating. */
export const carryAt = ([x0, y0]: Point, s0: number, to: Point, s: number, t: number, arc = 0, linear = false): { at: Point; s: number } => {
  const e = linear ? t : ease(t);
  return { at: [x0 + (to[0] - x0) * e, y0 + (to[1] - y0) * e - arc * 4 * t * (1 - t)], s: s0 + (s - s0) * e };
};

/** On the raft here: from the start until the child gets off at `raft.until`. */
export const afloatAt = ({ raft }: TrailLevel, x: number) => !!raft && x <= raft.until;

/**
 * What the tap at `station` does, shown before the tap, for a child standing at `from` along the ground `on` (the
 * level's, or a fork's way): footprints there, the ghost where it ends up and the picture on the button. For stairs,
 * walking there and up all the steps.
 */
export const nextFrom = (level: TrailLevel, from: number, station: Station, on = level.ground): Next => {
  const place = (p: Point) => placed(level.turns, p);
  /** Footprints along `on` (the ground) from the child to `x`, then one on each of `steps`, where they are drawn. */
  const printsTo = (x: number, steps: Point[] = []): Point[] => {
    const prints: Point[] = [];
    for (let px = from + PRINT_GAP; px < x - PRINT_GAP / 2; px += PRINT_GAP) prints.push([px, groundY(on, px)]);
    return [...prints, ...steps].map(place);
  };
  /** Walking on to `x` and doing `pose` there, shown before the tap. */
  const nextAt = (x: number, pose: Pose, icon: Next["icon"]): Next => ({
    prints: printsTo(x),
    ghost: place([x, groundY(on, x)]),
    face: facing(level.turns, x),
    pose,
    icon: icon === "walk" && afloatAt(level, x) ? "paddle" : icon,
  });
  if (station.kind === "pickup") return { ...nextAt(station.x, "take", station.item), at: station.at };
  if (station.kind === "moment") return nextAt(station.x, station.pose, "walk");
  if (station.kind === "obstacle") return nextAt(station.x, "stand", "walk");
  const top = station.steps[station.steps.length - 1];
  return { prints: printsTo(station.x, station.steps), ghost: place(top), face: facing(level.turns, top[0]), pose: "stand", icon: "climb" };
};
