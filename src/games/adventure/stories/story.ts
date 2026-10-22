import type * as THREE from "three";
import type { Sequence } from "../library/types";
import type { Guide } from "../three/guide";
import type { Stage } from "../three/stage";

// What a 3D story adds on top of a sequence of the library: what the guide
// says, how long it travels before each movement, and the world that reacts.

/** What the guide says in one step; spoken in this order. */
export interface StepLines {
  /** Shown on the route at the bottom and next to the caption. */
  icon: string;
  /** At the start of the step, while walking there. */
  situation?: string;
  /** When the movement starts. */
  instruction: string;
  /** Halfway through, to keep going. */
  again: string;
  /** At the end. */
  praise: string;
}

/** Story time within one step, in seconds. */
export interface StoryFrame {
  step: number;
  /** Since the step began. */
  local: number;
  /** `local` one frame ago, to find events in between. */
  prevLocal: number;
  /** Walking or travelling before the movement. */
  lead: number;
  /** Since the movement began (negative while still travelling). */
  act: number;
  /** How long the movement lasts. */
  actLength: number;
  /** Since the praise began (negative before). */
  praise: number;
  /** Seconds since the story began, for idle motion like waves. */
  time: number;
  dt: number;
}

export interface FrameResult {
  /** The guide is walking (the march clip plays instead of standing still). */
  walking: boolean;
  /** White flash over the picture, 0..1, to jump to another place. */
  flash: number;
}

export interface StoryWorld {
  /** Places the guide and the camera and moves the world for this frame. */
  update(frame: StoryFrame): FrameResult;
  /** Where the camera's attention is, so shadows stay sharp there. */
  focus: THREE.Vector3;
}

/** Sounds a world can ask for. */
export type Cue = "splash" | "whoosh" | "rumble" | "chime" | "sparkle" | "pop" | "knock" | "tweet" | "drum";

export interface Story {
  sequence: Sequence;
  lines: StepLines[];
  /** Seconds of travel before each step's movement. */
  lead: number[];
  /** Seconds of praise at the end of each step. */
  praise: number;
  build(stage: Stage, guide: Guide, cue: (c: Cue) => void): StoryWorld;
}

/** True if `at` was passed between the last frame and this one. */
export const crossed = (f: StoryFrame, at: number) => f.prevLocal < at && f.local >= at;
