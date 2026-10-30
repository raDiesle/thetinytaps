import type { ComponentType } from "react";
import type { Picture } from "../trail/items";
import type { Cue, Point } from "../trail/types";

/** A film's picture is 1600 × 900; the ground most scenes stand on. */
export const FILM_W = 1600;
export const FILM_H = 900;
export const GROUND = 780;

/** A box of the picture: left, top, width, height. */
export type Box = [number, number, number, number];

/** Where the child taps to set a beat off: it glows there, a circle round `at`. */
export interface Spot {
  at: Point;
  r: number;
}

/** One thing that happens in a scene: by itself, or after a tap. */
export interface Beat {
  /** Where the child taps for it; without it the beat happens by itself. */
  tap?: Spot;
  /** Said while the beat waits for its tap, and again as a reminder (only with „Vorlesen“). */
  ask?: string;
  /** Said as it happens. */
  say?: string;
  /** Sounds from the moment it starts. */
  sounds?: Cue[];
  /** How long it takes before the next beat. */
  ms: number;
}

/** A way the film can go on: what the child taps to pick it. */
export interface Option {
  id: string;
  /** Its picture: on a round sign at `at` (`sign`), or only in the strip when the scene draws the thing itself. */
  picture: Picture;
  at: Point;
  r: number;
  /** Draw it as a round picture sign; otherwise the scene draws it and only a glow goes round it. */
  sign?: boolean;
  /** Said when it is picked. */
  say: string;
}

/** After its beats, a scene may let the child pick how the film goes on. Every option is right. */
export interface Choice {
  ask: string;
  options: Option[];
}

/** What a scene's drawing gets: how many of its beats have started, whether the last of them is still going on,
 * and what the child has picked so far. */
export interface SceneProps {
  step: number;
  busy: boolean;
  picks: string[];
}

/** One place of the film, seen until the next cut. */
export interface Scene {
  id: string;
  /** A small picture of it, for the strip of scenes along the bottom. */
  icon: Picture;
  /** What has to be seen: it is zoomed to fill the screen above the strip. The drawing goes on round it, so a
   * screen of another shape sees more of it, never an empty edge. */
  focus: Box;
  Draw: ComponentType<SceneProps>;
  beats: Beat[];
  choice?: Choice;
}

/** A film: scenes that tell one story, cut from place to place. */
export interface Film {
  id: string;
  /** German; shown through `titleIn` in the app language. */
  title: string;
  /** Its picture, for the „Weiter“ button. */
  picture: Picture;
  /** The scenes, given what the child has picked so far: up to the next scene whose choice is not picked yet, or
   * all of them to the end. */
  scenes: (picks: string[]) => Scene[];
  /** Said at the end, while everybody is happy. */
  end: string;
}

/** The smallest box round both boxes. */
export function around(a: Box, b: Box): Box {
  const left = Math.min(a[0], b[0]);
  const top = Math.min(a[1], b[1]);
  return [left, top, Math.max(a[0] + a[2], b[0] + b[2]) - left, Math.max(a[1] + a[3], b[1] + b[3]) - top];
}
