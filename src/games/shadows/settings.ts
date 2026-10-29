/** Which pictures look for their shadow; "all" mixes them. Chosen while playing, mixed at the start of every visit. */
export type ShadowTheme = "all" | "animals" | "vehicles" | "food" | "things";

export interface ShadowsSettings {
  /** Speak the question, the "Das ist …" and the praise. */
  speech: boolean;
  /** Animal and vehicle noises and chimes. */
  sounds: boolean;
}

export const DEFAULT_SHADOWS_SETTINGS: ShadowsSettings = {
  speech: false,
  sounds: true,
};

export const SHADOWS_SETTINGS_KEY = "tinytaps.shadows.v1";
