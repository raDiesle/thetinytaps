/**
 * Explore: tap anything to see and hear it. Find: "Wo ist der Bagger?"
 * Sounds: only a sound is played, who made it? Questions: "Was ist rot?", several right answers.
 * Colour: the picture starts grey, every tapped item gets its colour back.
 */
export type SceneMode = "explore" | "find" | "sounds" | "questions" | "colour";

/** Modes in which the child looks for something that was asked. */
export const isQuestMode = (mode: SceneMode) => mode === "find" || mode === "sounds" || mode === "questions";

/** Quest modes that can mark an answer; in find mode that would make it too easy. */
export const hasHints = (mode: SceneMode) => mode === "sounds" || mode === "questions";

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
  /** Explore and colour mode: count the discovered items and throw a party when all were tapped. */
  goal: boolean;
  /** Sounds and questions mode: mark an item that is looked for after a while or a few wrong taps. */
  hints: boolean;
  /**
   * The picture lives on its own: clouds drift, rotors turn,
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
  goal: true,
  hints: true,
  ambient: false,
  showKeys: true,
  roads: true,
};

// v2: speech is off and the picture stands still by default now, so old saved settings start fresh.
// v3: every picture is still and silent until the child does something, so a "lively" picture
// saved before is switched off once; all other choices are carried over.
export const SCENES_SETTINGS_KEY = "tinytaps.scenes.v3";
const OLD_SCENES_SETTINGS_KEY = "tinytaps.scenes.v2";

/** Takes over the settings saved under v2, without the picture moving by itself. Call before reading the settings. */
export function carryOverScenesSettings() {
  try {
    const old = localStorage.getItem(OLD_SCENES_SETTINGS_KEY);
    if (old === null || localStorage.getItem(SCENES_SETTINGS_KEY) !== null) return;
    const { ambient: _, ...rest } = JSON.parse(old) as Partial<ScenesSettings>;
    localStorage.setItem(SCENES_SETTINGS_KEY, JSON.stringify(rest));
    localStorage.removeItem(OLD_SCENES_SETTINGS_KEY);
  } catch {
    // Broken or unavailable storage: the defaults apply.
  }
}
