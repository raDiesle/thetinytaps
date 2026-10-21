/** Which pictures look for their shadow; "all" mixes them. */
export type ShadowTheme = "all" | "animals" | "vehicles" | "food" | "things";

/** How many shadows to choose from. */
export type ChoiceCount = "2" | "3" | "4";

export interface ShadowsSettings {
  theme: ShadowTheme;
  choices: ChoiceCount;
  /** Tapping the right shadow is enough; otherwise the picture has to be dragged onto it. */
  tap: boolean;
  /** The name under the picture, for children who start to read (or for the grown-ups). */
  names: boolean;
  /** Speak the question, the "Das ist …" and the praise. */
  speech: boolean;
  /** Animal and vehicle noises and chimes. */
  sounds: boolean;
  /** Quieter sounds, less bouncing. */
  calm: boolean;
}

export const DEFAULT_SHADOWS_SETTINGS: ShadowsSettings = {
  theme: "all",
  choices: "3",
  tap: true,
  names: false,
  speech: false,
  sounds: true,
  calm: false,
};

export const SHADOWS_SETTINGS_KEY = "tinytaps.shadows.v1";
