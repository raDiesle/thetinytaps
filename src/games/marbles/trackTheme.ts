// What makes one marble run look like a world of its own (K-18): the same way
// down the wall, the same parts and the same joining in, but its own wall, rails,
// things on the shelf and its own end. The wooden run is one of them
// (`TrackLevel.tsx`); the others each have a file (`snowTrack.tsx`, …).

import { type ComponentType, createContext } from "react";
import type { Localized } from "@/lib/language";
import type { BallLook } from "./parts";
import type { Pt } from "./path";
import type { MarbleLevel } from "./settings";
import type { Roller } from "./track";

/** The outline colour of every drawing on the run. */
export const INK = "#2a1e5c";

/** A thing on the run, drawn around 0, 0 as if it were the roller `kind` (same size, same way of rolling). */
export interface ThingProps {
  kind: Roller;
  color: string;
  look?: BallLook;
  /** How far it has rolled, in radians. */
  spin: number;
  /** How much of the run lies behind it, 0 at the hopper and 1 at the end (the snowball grows with it). */
  grow: number;
}

/** What the end of the run (the basket, the snowman, …) draws. */
export interface EndProps {
  /** Drawn behind the things that have landed, or in front of them. */
  layer: "back" | "front";
  /** When each thing that came down arrived, in order (ms, like `t`). */
  parts: number[];
  t: number;
  /** Seconds since the end was full; negative before. */
  fullAge: number;
  /** Seconds since the end was tapped. */
  tapAge: number;
}

/** One marble run's world. Everything not named here is the same on every run. */
export interface TrackTheme {
  /** The level it is, for its name. */
  level: MarbleLevel;
  /** The wall behind everything; it never changes, so it is drawn once (`memo`). */
  Backdrop: ComponentType;
  /** A rail just under the things' path from `a` to `b`. */
  Rail: ComponentType<{ a: Pt; b: Pt }>;
  /** The boards the spots sit on. */
  board: { fill: string; edge: string };
  /** The walls the things bounce off at the turns, and the beams. */
  post: string;
  /** The plank of the shelf, and the hopper. */
  shelf: string;
  hopper: string;
  tunnel: { fill: string; lines: string };
  /** Draws each of the five things. */
  Thing: ComponentType<ThingProps>;
  /** What each thing sounds like as it goes into the hopper, and as it lands at the end. */
  release: Record<Roller, () => void>;
  landSound: (kind: Roller) => void;
  /** Sound and line when the end is full. */
  fullSound: () => void;
  full: Localized;
  /** Who looks out of the tunnel. */
  peekers: string[];
  /** In the tunnel a marble changes colour and pattern (K-06); without this an animal looks out for every thing. */
  magic: boolean;
  End: ComponentType<EndProps>;
  /** Where the i-th thing to arrive goes; the basket's places if not given. */
  landAt?: (i: number) => Pt;
  /** Things that arrive become part of the end (the snowman) instead of lying there. */
  absorb?: boolean;
  /** How far the things lying at the end are lifted, `fullAge` seconds after it was full (the crane). */
  pileLift?: (fullAge: number) => number;
}

/** The run's world, for the drawings deep inside it. */
export const TrackLook = createContext<TrackTheme | null>(null);
