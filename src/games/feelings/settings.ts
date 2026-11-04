export interface FeelingsSettings {
  /** The group of „Alltagssituationen“ played last (an id from `GROUPS`): its card comes first, and it goes on where it stopped. */
  group: string;
  /** The scene of `group` a pass goes on with, counted from 0: where the child stopped last time. */
  scene: number;
  /** Per story id, which of its choices comes next (0, 1, 2 …), so a scene asks its other choices when it comes again. */
  steps: Record<string, number>;
  /** Read the story, the bubbles and the praise aloud. */
  speech: boolean;
  /** Little sounds for hugs, stomping, lullabies. */
  sounds: boolean;
}

export const DEFAULT_FEELINGS_SETTINGS: FeelingsSettings = {
  group: "traurig",
  scene: 0,
  steps: {},
  speech: false,
  sounds: true,
};

export const FEELINGS_SETTINGS_KEY = "tinytaps.feelings.v1";
