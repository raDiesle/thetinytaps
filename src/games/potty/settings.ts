import type { AnimalId } from "./content";

/** "story": an animal goes to the potty step by step; "party": the child went for real and gets a star. */
export type PottyMode = "story" | "party";

export interface PottySettings {
  mode: PottyMode;
  /** Who goes to the potty first; „Weiter“ brings the next one. */
  animal: AnimalId;
  /** Says what happens at every step. */
  speech: boolean;
  /** Steps, trickle, flush, the waiting tune and the applause. */
  sounds: boolean;
}

export const DEFAULT_POTTY_SETTINGS: PottySettings = {
  mode: "story",
  animal: "fox",
  speech: false,
  sounds: true,
};

export const POTTY_SETTINGS_KEY = "tinytaps.potty.v1";
