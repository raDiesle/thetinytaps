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
  /** When the guide starts to show the movement. */
  instruction: string;
  /** When the child joins in, after the guide showed it once. */
  turn?: string;
  /** Halfway through, to keep going. */
  again: string;
  /** More lines during the movement, `at` seconds after the child joined in. */
  more?: { at: number; text: string }[];
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
  /** Seconds before the movement: travelling there, then showing it once. */
  lead: number;
  /** The last part of `lead`, in which the guide shows the movement alone. */
  demo: number;
  /** Since the movement began (negative while still travelling). */
  act: number;
  /** How long the movement lasts. */
  actLength: number;
  /** Since the praise began (negative before). */
  praise: number;
  /** Seconds into the opening while it runs (the step is then 0 at its start), else null. */
  opening: number | null;
  /** Seconds since the story began, for idle motion like waves. */
  time: number;
  dt: number;
}

export interface FrameResult {
  /** The guide is walking (the march clip plays instead of standing still). */
  walking: boolean;
  /** White flash over the picture, 0..1, to jump to another place. */
  flash: number;
  /** During the opening: the step whose place the map is showing. */
  pointing?: number;
  /** How much the guide sits (0 stands, 1 sits, e.g. in the canoe); arms and body keep moving. */
  sitting?: number;
  /** Bending forwards on top of the movement (rad), e.g. to put something down. */
  bend?: number;
  /** The music stops for a moment, e.g. for everyone to freeze in the stop dance. */
  quiet?: boolean;
}

export interface StoryWorld {
  /** Places the guide and the camera and moves the world for this frame. */
  update(frame: StoryFrame): FrameResult;
  /** After the guide took its pose: what it holds follows its paws, and the paws hold on to it. */
  afterPose?(frame: StoryFrame): void;
  /** Where the camera's attention is, so shadows stay sharp there. */
  focus: THREE.Vector3;
}

/** Sounds a world can ask for. */
export type Cue = "splash" | "whoosh" | "rumble" | "chime" | "sparkle" | "pop" | "knock" | "tweet" | "drum";

export interface Story {
  sequence: Sequence;
  lines: StepLines[];
  /** Before the first step: what the story is about, e.g. the way on a map. */
  opening?: { seconds: number; lines: { at: number; text: string }[] };
  /** Seconds before each step's movement: travel, then showing it (`demo`). */
  lead: number[];
  /** Seconds the guide shows each movement alone before the child joins in. */
  demo: number[];
  /** Seconds of praise at the end of each step. */
  praise: number;
  build(stage: Stage, guide: Guide, cue: (c: Cue) => void): StoryWorld;
}

/** True if `at` was passed between the last frame and this one. */
export const crossed = (f: StoryFrame, at: number) => f.prevLocal < at && f.local >= at;
