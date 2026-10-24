/** One level of the game. */
export type MarbleLevel = "track" | "topple" | "machine" | "kitchen" | "garden" | "building" | "circus" | "space";

/**
 * Which levels to play: all in turn, or only one of them. (Older saves may
 * still say "both" or "machines"; they play all of them too.)
 */
export type MarbleLevels = "all" | MarbleLevel;

export interface MarbleSettings {
  levels: MarbleLevels;
  /** Say a short line when a level starts and when it is done. */
  speech: boolean;
  /** Kugelbahn: three spots on the run whose part a tap swaps (bell, trampoline, funnel, paddle wheel). */
  rebuild: boolean;
  /** Bell, xylophone and the knocks of falling things. */
  sounds: boolean;
}

export const DEFAULT_MARBLE_SETTINGS: MarbleSettings = {
  levels: "all",
  rebuild: true,
  speech: false,
  sounds: true,
};

export const MARBLE_SETTINGS_KEY = "tinytaps.marbles.v1";
