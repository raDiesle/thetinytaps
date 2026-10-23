/** How fast the story goes: "calm" leaves more time for every movement. */
export type AdventurePace = "normal" | "calm";

export interface AdventureSettings {
  /** The guide speaks every situation and movement; off by default, the fox shows everything. */
  speech: boolean;
  /** Background music. */
  music: boolean;
  /** Splashes, whooshes and sparkles. */
  sounds: boolean;
  pace: AdventurePace;
  /** A glowing outline of a child shows the movement next to the fox. */
  outline: boolean;
  /** The body part the movement is about (arms, legs or body) gets a glowing outline while it moves. */
  glow: boolean;
}

export const DEFAULT_ADVENTURE_SETTINGS: AdventureSettings = {
  speech: false,
  music: true,
  sounds: true,
  pace: "normal",
  outline: true,
  glow: true,
};

// v2: speech is off by default now, so old saved settings start fresh.
export const ADVENTURE_SETTINGS_KEY = "tinytaps.adventure.v2";

/** How much slower the calm pace runs. */
export const CALM_PACE = 1.3;
