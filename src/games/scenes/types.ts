import type { ComponentType } from "react";

/** x, y, width, height in scene units. */
export type Box = [number, number, number, number];

/** Synthesized effect played with an item's animation, see lib/sfx. */
export type SceneSound =
  | "engine"
  | "beeps"
  | "tweet"
  | "boing"
  | "knocks"
  | "chime"
  | "drops"
  | "rattle"
  | "rotor"
  | "quack"
  | "bark"
  | "squeak"
  | "melody";

export interface SceneItem {
  id: string;
  /** With article, as used inside a sentence: "der Bagger". */
  name: string;
  /** Spoken when the item is tapped while exploring, one after the other: "Der Bagger baggert!" */
  sentences: string[];
  sound: SceneSound;
  /** Bounds of the drawing; used for the tap area, the hint ring and the thumbnail. */
  box: Box;
  /** Tap areas to use instead of `box` when it would cover other items (e.g. the crane). */
  hitAreas?: Box[];
  /** Length of the tap animation; taps on the same item are ignored meanwhile. */
  durationMs: number;
  /**
   * The drawing, in absolute scene coordinates. While the animation runs its
   * group has the class `playing`; the scene's CSS animates the parts.
   */
  Art: ComponentType;
}

/** A "living picture": a drawn scene whose items move and talk when tapped. */
export interface Scene {
  id: string;
  title: string;
  emoji: string;
  /** One line for the scene menu. */
  description: string;
  width: number;
  height: number;
  /** Colours above and below the picture when the screen has another aspect ratio. */
  sky: string;
  ground: string;
  /** Everything that is not tappable. Drawn first. */
  Background: ComponentType;
  /** Tappable items, in drawing order (later ones are on top). */
  items: SceneItem[];
}
