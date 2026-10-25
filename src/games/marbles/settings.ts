/** One level of the game. */
export type MarbleLevel = "track" | "pegs" | "sneeze" | "water" | "topple" | "machine" | "kitchen" | "garden" | "building" | "circus" | "space" | "light";

/**
 * Which level to begin with: the first, or the one picked; „Weiter“ goes on with
 * the ones after it. (Older saves may still say "both" or "machines"; they begin with the first.)
 */
export type MarbleLevels = "all" | MarbleLevel;

export interface MarbleSettings {
  levels: MarbleLevels;
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
  levels: "all",
  rebuild: true,
  pick: true,
  speech: false,
  sounds: true,
};

export const MARBLE_SETTINGS_KEY = "tinytaps.marbles.v1";
