/** One level of the game. */
export type MarbleLevel = "topple" | "machine" | "kitchen" | "garden" | "building" | "circus" | "space" | "light";

/**
 * Which levels to play: all in turn, or only one of them. (Older saves may
 * still say "both", "machines" or "track", the marble run that is a game of
 * its own now; they play all of them too.)
 */
export type MarbleLevels = "all" | MarbleLevel;

export interface MarbleSettings {
  levels: MarbleLevels;
  /** Say a short line when a level starts and when it is done. */
  speech: boolean;
  /** Bell, xylophone and the knocks of falling things. */
  sounds: boolean;
}

export const DEFAULT_MARBLE_SETTINGS: MarbleSettings = {
  levels: "all",
  speech: false,
  sounds: true,
};

export const MARBLE_SETTINGS_KEY = "tinytaps.marbles.v1";
