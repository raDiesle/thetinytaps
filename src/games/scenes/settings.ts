/**
 * Explore: tap anything to see and hear it. Find: "Wo ist der Bagger?"
 * Sounds: only a sound is played, who made it? Questions: "Was ist rot?", several right answers.
 * Colour: the picture starts grey, every tapped item gets its colour back.
 */
export type SceneMode = "explore" | "find" | "sounds" | "questions" | "colour";

/** Modes in which the child looks for something that was asked. */
export const isQuestMode = (mode: SceneMode) => mode === "find" || mode === "sounds" || mode === "questions";

/** What is spoken for a tapped item: "Der Bagger baggert!" or "Der Bagger!". */
export type SceneAnnounce = "sentence" | "name";

/**
 * Tap: click or tap an item. Hover: resting the mouse on it, or sliding a finger over it, is enough.
 * Keys: every item has its own key (tapping still works).
 */
export type SceneTrigger = "tap" | "hover" | "keys";

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
  /** Explore and colour mode: count the discovered items and throw a party when all were tapped. */
  goal: boolean;
  /** Find, sounds and questions mode: mark an item that is looked for after a while or a few wrong taps. */
  hints: boolean;
  /**
   * The picture lives on its own (not in calm mode): clouds drift, rotors turn,
   * and when nobody taps for a while, items move by themselves. Off: nothing
   * moves unless the child does something.
   */
  ambient: boolean;
  /** Keys trigger: show each item's key in the picture. */
  showKeys: boolean;
  /** Explore mode: some vehicles drive into other pictures, and a sign at the edge follows them (see roads.ts). */
  roads: boolean;
}

export const DEFAULT_SCENES_SETTINGS: ScenesSettings = {
  mode: "explore",
  trigger: "tap",
  speech: false,
  announce: "sentence",
  sounds: true,
  calm: false,
  goal: true,
  hints: true,
  ambient: false,
  showKeys: true,
  roads: true,
};

// v2: speech is off and the picture stands still by default now, so old saved settings start fresh.
export const SCENES_SETTINGS_KEY = "tinytaps.scenes.v2";
