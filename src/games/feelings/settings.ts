export interface FeelingsSettings {
  /** The story to begin with (an id from `STORIES`, or "mood"); „Weiter“ goes on with the next. Older saves may say "all": that begins with the first. */
  story: string;
  /** Read the story, the bubbles and the praise aloud. */
  speech: boolean;
  /** Little sounds for hugs, stomping, lullabies. */
  sounds: boolean;
}

export const DEFAULT_FEELINGS_SETTINGS: FeelingsSettings = {
  story: "mood",
  speech: false,
  sounds: true,
};

export const FEELINGS_SETTINGS_KEY = "tinytaps.feelings.v1";
