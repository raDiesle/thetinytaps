// What both parts of the feelings game are made of: short beats in which the
// animals move, change their face and say something.

import { playBoing, playChime, playMelody, playPop, playRumble, playHum, playYuck } from "@/lib/sfx";
import type { Mood } from "./Critter";

export type ActorId = "bear" | "fox" | "bunny" | "teacher";

/** Poses are CSS classes, see feelings.css. "slide" sits with the legs forward, "fall" stumbles. */
export type Pose =
  | "stand"
  | "walk"
  | "push"
  | "kick"
  | "stop"
  | "fall"
  | "reach"
  | "give"
  | "hug"
  | "hop"
  | "shake"
  | "stomp"
  | "breathe"
  | "slide";

export interface ActorState {
  /** Middle of the actor, in % of the stage width; below 0 or above 100 is off stage. */
  x: number;
  /** Feet above the bottom of the stage, in % of its height. */
  y: number;
  pose: Pose;
  mood: Mood;
  face: "left" | "right";
  /** An emoji in the paw; "" for nothing. */
  holds: string;
}

export type Cast = Partial<Record<ActorId, Partial<ActorState>>>;

export const SOUNDS = {
  pop: playPop,
  chime: playChime,
  boing: playBoing,
  rumble: playRumble,
  melody: playMelody,
  hum: playHum,
  yuck: playYuck,
};

export type SoundName = keyof typeof SOUNDS;

export interface Beat {
  /** Told from outside, shown big at the top. */
  narration?: string;
  /** Said by one of the animals, shown in a bubble. */
  line?: { who: ActorId; text: string };
  /** Changes to the actors; anything not given stays as it was. */
  cast?: Cast;
  /** A class on the stage for things that change, like the tower. */
  stage?: string;
  sound?: SoundName;
}

/** A big emoji drawn into a picture card, at x / y (from the bottom) in % of the card. */
export interface Sign {
  emoji: string;
  x: number;
  y: number;
  /** In % of the card height; default 30. */
  size?: number;
}

/**
 * What a choice looks like on its card, so children who can't read yet see
 * what the bear will do: the animals in their poses, plus a few signs like ✋
 * or 👣. Positions are in % of the card; every actor needs an x.
 */
export interface Picture {
  cast: Cast;
  signs?: Sign[];
  /** A blanket up to the chin, like the one on the stage. */
  blanket?: boolean;
}

/** The ground line, in % of the stage height. */
export const GROUND = 10;

export const DEFAULT_ACTOR: ActorState = { x: 120, y: GROUND, pose: "stand", mood: "neutral", face: "right", holds: "" };

export function applyCast(actors: Partial<Record<ActorId, ActorState>>, cast: Cast | undefined) {
  if (!cast) return actors;
  const next = { ...actors };
  for (const [id, patch] of Object.entries(cast) as [ActorId, Partial<ActorState>][]) {
    next[id] = { ...(next[id] ?? DEFAULT_ACTOR), ...patch };
  }
  return next;
}

/** How long a beat stays before the next one: long enough to read it out, or to have it read aloud. */
export function beatMs(beat: Beat, speech: boolean, calm: boolean) {
  const chars = (beat.narration?.length ?? 0) + (beat.line?.text.length ?? 0);
  const ms = speech ? 1100 + chars * 62 : 1400 + chars * 22;
  return Math.round(calm ? ms * 1.3 : ms);
}
