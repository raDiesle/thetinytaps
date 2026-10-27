/** "story": Tapsi goes to the potty step by step; "party": the child went for real and gets a star. */
export type PottyMode = "story" | "party";

export interface PottySettings {
  mode: PottyMode;
  /** Says what happens at every step. */
  speech: boolean;
  /** Eating, drinking, the waiting scenes, trickle, flush and the applause. */
  sounds: boolean;
}

export const DEFAULT_POTTY_SETTINGS: PottySettings = {
  mode: "story",
  speech: false,
  sounds: true,
};

// v3: „Muss Pipi!“ and „Muss Kaka!“ became one story – an old "pipi" or "kaka" mode would match no mode.
export const POTTY_SETTINGS_KEY = "tinytaps.potty.v3";
