export interface FeelingsSettings {
  /** One story only (an id from `STORIES`, for a problem the child has right now), or "all" in turn. */
  story: string;
  /** Read the story, the bubbles and the praise aloud. */
  speech: boolean;
  /** Little sounds for hugs, stomping, lullabies. */
  sounds: boolean;
}

export const DEFAULT_FEELINGS_SETTINGS: FeelingsSettings = {
  story: "all",
  speech: false,
  sounds: true,
};

export const FEELINGS_SETTINGS_KEY = "tinytaps.feelings.v1";
