/** Which levels to play: both in turn, or only one of them. */
export type MarbleLevels = "both" | "track" | "topple";

export interface MarbleSettings {
  levels: MarbleLevels;
  /** Say a short line when a level starts and when it is done. */
  speech: boolean;
  /** Bell, xylophone and the knocks of falling things. */
  sounds: boolean;
}

export const DEFAULT_MARBLE_SETTINGS: MarbleSettings = {
  levels: "both",
  speech: false,
  sounds: true,
};

export const MARBLE_SETTINGS_KEY = "tinytaps.marbles.v1";
