import type { FeelingId } from "./bear";
import type { SituationId } from "./kita";

export interface FeelingsSettings {
  /** Zu Hause: one feeling of the bear only, or all in turn. */
  feeling: "all" | FeelingId;
  /** Im Kindergarten: one situation only, for a problem the child has right now, or all in turn. */
  situation: "all" | SituationId;
  /** Read the story, the bubbles and the praise aloud. */
  speech: boolean;
  /** Little sounds for hugs, stomping, lullabies. */
  sounds: boolean;
}

export const DEFAULT_FEELINGS_SETTINGS: FeelingsSettings = {
  feeling: "all",
  situation: "all",
  speech: false,
  sounds: true,
};

export const FEELINGS_SETTINGS_KEY = "tinytaps.feelings.v1";
