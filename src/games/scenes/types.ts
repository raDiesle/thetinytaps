import type { ComponentType } from "react";

/** x, y, width, height in scene units. */
export type Box = [number, number, number, number];

/**
 * Moves a drawing to where it stands in the picture: translate(x, y) scale(scale).
 * Smaller further back, so the picture gets depth without redrawing anything.
 */
export interface Placement {
  x: number;
  y: number;
  scale: number;
}

/** The box as it appears in the picture once the placement is applied. */
export function placeBox([x, y, w, h]: Box, place?: Placement): Box {
  if (!place) return [x, y, w, h];
  const { x: dx, y: dy, scale: s } = place;
  return [dx + x * s, dy + y * s, w * s, h * s];
}

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
  | "melody"
  | "sniff"
  | "pop"
  | "buzz"
  | "rumble"
  | "hum"
  | "saw"
  | "honk"
  | "siren"
  | "bells"
  | "ring"
  | "coo"
  | "meow"
  | "moo"
  | "oink"
  | "baa"
  | "cluck"
  | "crow"
  | "neigh"
  | "hoot"
  | "croak"
  | "roar"
  | "trumpet"
  | "chatter"
  | "squawk"
  | "munch"
  | "snap"
  | "blub"
  | "whale"
  | "ping"
  | "dolphin"
  | "launch"
  | "twinkle"
  | "beam"
  | "robot"
  | "alien"
  | "alarm"
  | "trill"
  | "whoosh"
  | "flush"
  | "blow"
  | "scrub"
  | "splash"
  | "tick"
  | "peck"
  | "cuckoo"
  | "kettle"
  | "sizzle"
  | "crunch"
  | "sleigh"
  | "crackle"
  | "yawn"
  | "musicbox"
  | "train"
  | "jet"
  | "giggle"
  | "creak"
  | "rustle"
  | "heartbeat";

/** What an item is like, for the questions "Was ist rot?", "Wer kann fliegen?" (see quests.ts). */
export type SceneTrait = "red" | "yellow" | "blue" | "green" | "flies" | "big" | "small" | "animal" | "wheels";

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
  /** Where the drawing stands in the picture; box, hit areas and shadow move along. */
  place?: Placement;
  /** Shadow on the ground below the item: centre x, centre y, radius x. */
  shadow?: [number, number, number];
  /** Keys mode: the key this item should get, e.g. "B" for the digger; else its first letter if free. */
  key?: string;
  /** Questions mode: what the item is like. Only clear cases, so every answer is obviously right. */
  traits?: SceneTrait[];
  /** The name is a plural ("die Küken"), so questions say "Wo sind …?". */
  plural?: boolean;
  /** Length of the tap animation; taps on the same item are ignored meanwhile. */
  durationMs: number;
  /**
   * The drawing, in its own scene coordinates (before `place`). While the animation runs its
   * group has the class `playing`; the scene's CSS animates the parts.
   */
  Art: ComponentType;
}

/**
 * A little chain reaction: when `start` is tapped while exploring, the steps
 * react one after another ("Der Hund bellt → die Katze erschrickt → der Vogel fliegt weg").
 */
export interface SceneChain {
  start: string;
  steps: { item: string; sentence: string }[];
}

/** Where a seasonal extra stands: its foot point on the ground and how big it is (see `ground` in layout.ts). */
export type SeasonSpot = [x: number, y: number, size?: number];

/** The scene's seasonal extras (seasonal.tsx); an extra without a spot is left out. */
export interface SceneSeasons {
  /** Fallen leaves in autumn, snow in winter; not indoors, under water or in space. */
  weather?: boolean;
  pumpkin?: SeasonSpot;
  tree?: SeasonSpot;
  snowman?: SeasonSpot;
  egg?: SeasonSpot;
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
  /** Two or three chain reactions between items. */
  chains?: SceneChain[];
  /**
   * Bedtime picture (explore mode): a tapped item says good night and stays asleep (class `asleep`),
   * and once all are asleep the room goes dark (class `night` on the scene) instead of the party.
   */
  bedtime?: boolean;
  /** Drawn above the items and not tappable, e.g. falling snow. */
  Overlay?: ComponentType;
  /** Where the seasonal extras go in this scene. */
  seasons?: SceneSeasons;
}
