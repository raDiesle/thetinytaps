// Data model of the movement library for "Bewegungsabenteuer": immersive
// stories in which a 3D guide shows a movement and the child in front of the
// screen does it along. There is no camera: the world reacts on a timer, as an
// invitation to join in, never as a check whether the child really moved.
//
// Kept apart on purpose, so each can be reused on its own:
// - Movement: what the body does (with the guide's 3D clip that shows it),
//   plus one default situation as an example.
// - World / Scenario: where a movement can happen and what it means there.
// - Sequence: movements in order with seconds and energy, i.e. the timing.
// - SituationIdea: when a child does a body movement anyway, per clip.
// The 3D story script (../stories/) adds camera and world animation on top of
// a sequence.

/** Stable ids; never rename one that is in use, add a new one instead. */
export type CategoryId =
  | "push_pull"
  | "dodge_lean"
  | "side_steps"
  | "hop_bounce"
  | "shake_dance"
  | "animal_mimicry"
  | "reach_point"
  | "throw_catch"
  | "stretch_curl"
  | "march_stomp"
  | "balance"
  | "turn"
  | "stop_go"
  | "travel_strokes"
  | "tool_mimicry";

export interface MovementCategory {
  id: CategoryId;
  name: string;
  emoji: string;
  /** What belongs here. */
  description: string;
  /** What does not, and where it goes instead. */
  notIncluded: string;
}

export type WorldId =
  | "space"
  | "underwater"
  | "jungle"
  | "construction"
  | "railway"
  | "fire_station"
  | "magic_castle"
  | "farm"
  | "pirate_island"
  | "cloud_world"
  | "winter_forest"
  | "garden"
  | "circus"
  | "dino_valley"
  | "crystal_cave"
  | "toy_town"
  | "beach"
  | "music_room";

export type BodyZone = "arms" | "upper_body" | "legs" | "full_body";

export type BodyPart = "hands" | "arms" | "shoulders" | "head" | "torso" | "hips" | "knees" | "legs" | "feet";

export type Difficulty = "easy" | "medium";

/** How lively the moment feels; sequences mix them. */
export type Energy = "calm" | "medium" | "lively";

/** Where the motion goes, as the child sees it on screen. */
export type MotionDirection =
  | "back_to_front"
  | "front_to_back"
  | "up"
  | "down"
  | "up_down"
  | "side_to_side"
  | "outwards"
  | "inwards"
  | "around"
  | "in_place";

export type CameraStyle = "stationary" | "slow_push_in" | "follow" | "orbit" | "first_person";

/**
 * Body animations of the 3D guide (../three/clips.ts). Many movements share
 * one clip: pushing a door and pushing a cloud look the same on the body, only
 * the world around differs.
 */
export type MotionClipId =
  | "idle"
  | "wave"
  | "push_forward"
  | "push_up"
  | "pull_rope"
  | "pull_down"
  | "heave"
  | "lean_side"
  | "lean_forward"
  | "duck"
  | "sway"
  | "step_side"
  | "march"
  | "stomp"
  | "high_knees"
  | "tiptoe"
  | "bounce"
  | "hop"
  | "shake"
  | "hip_circle"
  | "robot"
  | "waddle"
  | "snake"
  | "flutter"
  | "cheer"
  | "arms_wide"
  | "flap"
  | "paddle"
  | "row"
  | "swim"
  | "steer"
  | "reach_up"
  | "tap_forward"
  | "point"
  | "wipe"
  | "clap"
  | "throw_overhand"
  | "throw_underhand"
  | "cast"
  | "scatter"
  | "catch"
  | "stretch_up"
  | "curl_small"
  | "grow"
  | "star_shape"
  | "bloom"
  | "arc"
  | "turn_around"
  | "twist"
  | "look_around"
  | "freeze"
  | "melt"
  | "one_leg"
  | "balance_walk"
  | "carry"
  | "kite"
  | "trunk_swing"
  | "snap"
  | "scratch"
  | "hammer"
  | "dig"
  | "pour"
  | "stir"
  | "pump"
  | "drum"
  | "wand"
  | "ring_bell"
  | "press_button";

/** What a movement asks of the room and the body, so parents and sequences can filter. */
export interface MovementNeeds {
  /** A real jump is part of it (always optional for the child, see adaptations.easier). */
  jump: boolean;
  /** Room around the child: small = standing on the spot, arms close; large = arms and steps wide. */
  space: "small" | "medium" | "large";
  /** Standing on one leg, on tiptoe or walking a line. */
  balance: boolean;
}

export interface Movement {
  /** Stable, snake_case. */
  id: string;
  /** German, short, for grown-ups and lists. */
  name: string;
  category: CategoryId;
  ageRange: { min: number; max: number };
  difficulty: Difficulty;
  bodyZone: BodyZone;
  bodyParts: BodyPart[];
  /** What the child physically does, in one sentence. */
  bodyMovement: string;
  startingPose: string;
  movementSteps: string[];
  /** One full go, in seconds, including time to understand it. */
  durationSeconds: number;
  repetitions: number;
  /** Said to the child; 2–5 words, German. */
  instruction: string;
  /** The guide's 3D clip that shows the movement. */
  motion: MotionClipId;
  /** How the guide shows it before and while the child does it. */
  demonstration: string;
  /** Default situation; the same movement can be used in other worlds (see scenarios). */
  scenario: {
    world: WorldId;
    /** The concrete pretend situation. */
    setup: string;
    /** What the child sees right before, that invites the movement. */
    trigger: string;
    /** What changes on screen while the child moves (timed, never "detected"). */
    reaction: string;
    /** The small reward at the end. */
    payoff: string;
  };
  audio: {
    voiceCue: string;
    soundEffects: string[];
    /** The motion follows the music's beat. */
    musicSync: boolean;
  };
  visualDirection: {
    camera: CameraStyle;
    movementDirection: MotionDirection;
    intensity: Energy;
  };
  variants: string[];
  adaptations: {
    easier: string;
    seated?: string;
    higherEnergy?: string;
  };
  needs: MovementNeeds;
  safetyNotes: string[];
  tags: string[];
}

export interface World {
  id: WorldId;
  name: string;
  emoji: string;
  /** Look and mood, as a brief for drawing it. */
  look: string;
}

/** One movement as it happens in a particular world. */
export interface ScenarioMoment {
  movement: string;
  /** The situation in this world. */
  situation: string;
  /** What the world does in return. */
  reaction: string;
}

/** Ideas for one world: which movements fit and what they mean there. */
export interface Scenario {
  id: string;
  world: WorldId;
  title: string;
  /** The adventure in one or two sentences. */
  premise: string;
  moments: ScenarioMoment[];
}

/**
 * A situation in which a body movement is the obvious thing to do, so a story
 * can ask for it without explaining it. Keyed by the guide's clip (the pure
 * body movement), so the idea fits every movement that uses that clip.
 */
export interface SituationIdea {
  /** What is there and calls for the movement: the thing the movement acts on. */
  situation: string;
  /** What the movement does to it (timed, never "detected"). */
  reaction: string;
  /** Known from the child's own day, so the movement needs no explanation. */
  everyday?: boolean;
  /** Worlds it fits; none = fits many. */
  worlds?: WorldId[];
}

/** One action of a sequence, in the order played. */
export interface SequenceStep {
  movement: string;
  /** Time for this action, including showing it and the world's reaction. */
  seconds: number;
  energy: Energy;
  /** What happens in the story right here. */
  situation: string;
  /** How the story leads into the next action. */
  transition: string;
}

/** A playable order of movements with a beginning, a middle and a happy end. */
export interface Sequence {
  id: string;
  title: string;
  world: WorldId;
  /** Said or shown before the first action. */
  opening: string;
  steps: SequenceStep[];
  /** The positive visual end. */
  finale: string;
}
