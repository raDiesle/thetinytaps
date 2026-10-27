import type { Said } from "./content";

/** "story": Tapsi goes to the potty step by step; "party": the child went for real and gets a star. */
export type PottyMode = "story" | "party";

export interface PottySettings {
  mode: PottyMode;
  /** What the child said it has to do, chosen by a grown-up on the start screen; what came is chosen at the ✓. */
  said: Said;
  /** Says what happens at every step. */
  speech: boolean;
  /** Eating, drinking, the waiting scenes, trickle, flush and the applause. */
  sounds: boolean;
}

export const DEFAULT_POTTY_SETTINGS: PottySettings = {
  mode: "story",
  said: "unsure",
  speech: false,
  sounds: true,
};

// v3: „Muss Pipi!“ and „Muss Kaka!“ became one story – an old "pipi" or "kaka" mode would match no mode.
export const POTTY_SETTINGS_KEY = "tinytaps.potty.v3";
