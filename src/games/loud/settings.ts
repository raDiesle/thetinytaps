/** How loud the child has to be for the lion: microphones and rooms differ a lot. */
export type Sensitivity = "low" | "mid" | "high";

/** One level of the game: the lion and the mouse, or blowing (idea X-06). */
export type LoudLevel = "voice" | "blow";

export interface LoudSettings {
  /** The level to begin with; „Weiter“ at its end goes on with the other. Older saves may say "all": that begins with the first. */
  levels: LoudLevel;
  sensitivity: Sensitivity;
  /** The animals say something, and a hint after a quiet while. */
  speech: boolean;
}

export const DEFAULT_LOUD_SETTINGS: LoudSettings = {
  levels: "voice",
  sensitivity: "mid",
  speech: false,
};

export const LOUD_SETTINGS_KEY = "tinytaps.loud.v1";
