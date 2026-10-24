/** How loud the child has to be for the lion: microphones and rooms differ a lot. */
export type Sensitivity = "low" | "mid" | "high";

/** One level of the game: the lion and the mouse, or blowing (idea X-06). */
export type LoudLevel = "voice" | "blow";

/** Which levels to play: both in turn, or only one. */
export type LoudLevels = "all" | LoudLevel;

export interface LoudSettings {
  levels: LoudLevels;
  sensitivity: Sensitivity;
  /** The animals say something, and a hint after a quiet while. */
  speech: boolean;
  /** Quieter sounds, no bursts, no idle wiggling. */
  calm: boolean;
}

export const DEFAULT_LOUD_SETTINGS: LoudSettings = {
  levels: "all",
  sensitivity: "mid",
  speech: false,
  calm: false,
};

export const LOUD_SETTINGS_KEY = "tinytaps.loud.v1";
