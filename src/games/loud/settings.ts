/** How loud the child has to be for the lion: microphones and rooms differ a lot. */
export type Sensitivity = "low" | "mid" | "high";

export interface LoudSettings {
  sensitivity: Sensitivity;
  /** The animals say something, and a hint after a quiet while. */
  speech: boolean;
  /** Quieter sounds, no bursts, no idle wiggling. */
  calm: boolean;
}

export const DEFAULT_LOUD_SETTINGS: LoudSettings = {
  sensitivity: "mid",
  speech: false,
  calm: false,
};

export const LOUD_SETTINGS_KEY = "tinytaps.loud.v1";
