/** One level of the game. */
export type MarbleLevel =
  | "track"
  | "colortrack"
  | "snowtrack"
  | "spacetrack"
  | "slidetrack"
  | "sitetrack"
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
}

export const DEFAULT_MARBLE_SETTINGS: MarbleSettings = {
  levels: "track",
};

export const MARBLE_SETTINGS_KEY = "tinytaps.marbles.v1";
