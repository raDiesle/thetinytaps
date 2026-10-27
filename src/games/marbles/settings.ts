/** One level of the game. */
export type MarbleLevel = "track" | "pegs" | "sneeze" | "water" | "topple" | "machine" | "kitchen" | "garden" | "building" | "circus" | "space" | "light";

export interface MarbleSettings {
  /**
   * The level to begin with; „Weiter“ goes on with the ones after it. (Older saves may still
   * say "all", "both" or "machines"; they begin with the first.)
   */
  levels: MarbleLevel;
  /** Klingende Kugelbahn: tapping one of the six spots with 🔧 swaps its part (bell, trampoline, funnel, paddle wheel). */
  rebuild: boolean;
  /** Klingende Kugelbahn, „Was rollt denn da?“ (K-07): three things on a shelf to pick from instead of six marbles in a row. */
  pick: boolean;
  /** Say a short line when a level starts and when it is done. */
  speech: boolean;
  /** Bell, xylophone, the knocks of falling things and the sounds along the marble run. */
  sounds: boolean;
}

export const DEFAULT_MARBLE_SETTINGS: MarbleSettings = {
  levels: "track",
  rebuild: true,
  pick: true,
  speech: false,
  sounds: true,
};

export const MARBLE_SETTINGS_KEY = "tinytaps.marbles.v1";
