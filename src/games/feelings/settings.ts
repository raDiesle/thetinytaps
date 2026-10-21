import type { SituationId } from "./kita";

/** "bear": comfort the bear until he is happy again. "kita": what to do when someone pushes, kicks or grabs. */
export type FeelingsMode = "bear" | "kita";

/** "show": the good steps come one after another. "choose": the first step has a not-so-good idea next to it. */
export type KitaAnswers = "show" | "choose";

export interface FeelingsSettings {
  mode: FeelingsMode;
  /** One situation only, for a problem the child has right now, or all in turn. */
  situation: "all" | SituationId;
  answers: KitaAnswers;
  /** Read the story, the bubbles and the praise aloud. */
  speech: boolean;
  /** Little sounds for hugs, stomping, lullabies. */
  sounds: boolean;
  /** Quieter sounds, no wiggling, slower moves. */
  calm: boolean;
}

export const DEFAULT_FEELINGS_SETTINGS: FeelingsSettings = {
  mode: "bear",
  situation: "all",
  answers: "show",
  speech: false,
  sounds: true,
  calm: false,
};

export const FEELINGS_SETTINGS_KEY = "tinytaps.feelings.v1";
