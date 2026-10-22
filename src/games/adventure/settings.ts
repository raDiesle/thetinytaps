/** How fast the story goes: "calm" leaves more time for every movement. */
export type AdventurePace = "normal" | "calm";

export interface AdventureSettings {
  /** The guide speaks every situation and movement; the point of the game, so on by default. */
  speech: boolean;
  /** Background music. */
  music: boolean;
  /** Splashes, whooshes and sparkles. */
  sounds: boolean;
  pace: AdventurePace;
  /** A glowing outline of a child shows the movement next to the fox. */
  outline: boolean;
  /** The fox's moving arms, legs or body get a glowing outline. */
  glow: boolean;
}

export const DEFAULT_ADVENTURE_SETTINGS: AdventureSettings = {
  speech: true,
  music: true,
  sounds: true,
  pace: "normal",
  outline: true,
  glow: true,
};

export const ADVENTURE_SETTINGS_KEY = "tinytaps.adventure.v1";

/** How much slower the calm pace runs. */
export const CALM_PACE = 1.3;
