/** One level of the game. */
export type MarbleLevel = "track" | "topple" | "machine" | "kitchen" | "garden" | "building" | "circus" | "space";

/**
 * Which levels to play: all in turn, only the Rube Goldberg machines in turn,
 * or only one of them. ("both" is what it was called when there were two.)
 */
export type MarbleLevels = "all" | "both" | "machines" | MarbleLevel;

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
