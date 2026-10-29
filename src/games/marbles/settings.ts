/** One level of the game. */
export type MarbleLevel =
  | "track"
  | "pegs"
  | "sneeze"
  | "water"
  | "topple"
  | "machine"
  | "kitchen"
  | "garden"
  | "building"
  | "circus"
  | "space"
  | "light"
  | "bath"
  | "farm"
  | "night"
  | "tidy";

export interface MarbleSettings {
  /**
   * The level to begin with; „Weiter“ goes on with the ones after it. (Older saves may still
   * say "all", "both" or "machines"; they begin with the first.)
   */
  levels: MarbleLevel;
  /** Say a short line when a level starts and when it is done. */
  speech: boolean;
  /** Bell, xylophone, the knocks of falling things and the sounds along the marble run. */
  sounds: boolean;
}

export const DEFAULT_MARBLE_SETTINGS: MarbleSettings = {
  levels: "track",
  speech: false,
  sounds: true,
};

export const MARBLE_SETTINGS_KEY = "tinytaps.marbles.v1";
