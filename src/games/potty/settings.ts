/** "pipi" and "kaka": Tapsi goes to the potty step by step; "party": the child went for real and gets a star. */
export type PottyMode = "pipi" | "kaka" | "party";

export interface PottySettings {
  mode: PottyMode;
  /** Says what happens at every step. */
  speech: boolean;
  /** Eating, drinking, the waiting scenes, trickle, flush and the applause. */
  sounds: boolean;
}

export const DEFAULT_POTTY_SETTINGS: PottySettings = {
  mode: "pipi",
  speech: false,
  sounds: true,
};

// v2: the story became two, „Pipi“ and „Kaka“ – an old "story" would match no mode.
export const POTTY_SETTINGS_KEY = "tinytaps.potty.v2";
