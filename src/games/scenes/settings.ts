/** Explore: tap anything to see and hear it. Find: "Wo ist der Bagger?" */
export type SceneMode = "explore" | "find";

/** What is spoken for a tapped item: "Der Bagger baggert!" or "Der Bagger!". */
export type SceneAnnounce = "sentence" | "name";

/** Tap: click or tap an item. Hover: resting the mouse on it, or sliding a finger over it, is enough. */
export type SceneTrigger = "tap" | "hover";

export interface ScenesSettings {
  mode: SceneMode;
  trigger: SceneTrigger;
  /** Speak names, sentences and questions. */
  speech: boolean;
  announce: SceneAnnounce;
  /** Engine noises, beeps and chimes. */
  sounds: boolean;
  /** Quieter sounds, no idle movement, softer shapes. */
  calm: boolean;
  /** Find mode: mark the item that is looked for after a while or a few wrong taps. */
  hints: boolean;
  /** When nobody taps for a while, items move by themselves (not in calm mode). */
  ambient: boolean;
}

export const DEFAULT_SCENES_SETTINGS: ScenesSettings = {
  mode: "explore",
  trigger: "tap",
  speech: true,
  announce: "sentence",
  sounds: true,
  calm: false,
  hints: true,
  ambient: true,
};

export const SCENES_SETTINGS_KEY = "tinytaps.scenes.v1";
