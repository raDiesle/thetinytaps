/**
 * In menu order – Explore ("Freies Entdecken", the first and default): tap anything to see and hear it.
 * Colour: the picture starts grey, every tapped item gets its colour back.
 * Find: "Wo ist der Bagger?" Questions: "Was ist rot?", several right answers.
 */
export type SceneMode = "explore" | "colour" | "find" | "questions";

/** Modes in which the child looks for something that was asked. */
export const isQuestMode = (mode: SceneMode) => mode === "find" || mode === "questions";

/** Quest modes that can mark an answer; in find mode that would make it too easy. */
export const hasHints = (mode: SceneMode) => mode === "questions";

export interface ScenesSettings {
  /** Picked in the row above the pictures on `/bilder/`; a tap on a picture plays it in this mode. */
  mode: SceneMode;
  /** Speak names, sentences and questions. */
  speech: boolean;
  /** Engine noises, beeps and chimes. */
  sounds: boolean;
  /**
   * Every item has its own key, shown in the picture, wherever there is a keyboard (tapping still works).
   * Switched off and on with ⌨️ in the picture, and kept so for the next pictures.
   */
  keys: boolean;
}

export const DEFAULT_SCENES_SETTINGS: ScenesSettings = {
  mode: "explore",
  speech: false,
  sounds: true,
  keys: true,
};

// v2: speech is off and the picture stands still by default now, so old saved settings start fresh.
// v3: every picture is still and silent until the child does something.
export const SCENES_SETTINGS_KEY = "tinytaps.scenes.v3";
const OLD_SCENES_SETTINGS_KEY = "tinytaps.scenes.v2";

/** Takes over the settings saved under v2. Call before reading the settings. */
export function carryOverScenesSettings() {
  try {
    const old = localStorage.getItem(OLD_SCENES_SETTINGS_KEY);
    if (old === null || localStorage.getItem(SCENES_SETTINGS_KEY) !== null) return;
    localStorage.setItem(SCENES_SETTINGS_KEY, old);
    localStorage.removeItem(OLD_SCENES_SETTINGS_KEY);
  } catch {
    // Broken or unavailable storage: the defaults apply.
  }
}
