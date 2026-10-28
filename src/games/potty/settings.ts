/** The story has no modes (the star is its last step), so only the shared options are kept. */
export interface PottySettings {
  /** Says what happens at every step. */
  speech: boolean;
  /** Eating, drinking, the waiting scenes, trickle, flush and the applause. */
  sounds: boolean;
}

export const DEFAULT_POTTY_SETTINGS: PottySettings = {
  speech: false,
  sounds: true,
};

// v3: „Muss Pipi!“ and „Muss Kaka!“ became one story. An old saved mode is merged in and ignored.
export const POTTY_SETTINGS_KEY = "tinytaps.potty.v3";
