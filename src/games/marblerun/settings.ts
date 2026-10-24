export interface MarbleRunSettings {
  /** Tapping one of the six spots with 🔧 swaps its part (bell, trampoline, funnel, paddle wheel). */
  rebuild: boolean;
  /** „Was rollt denn da?“ (K-07): three things on a shelf to pick from instead of six marbles in a row. */
  pick: boolean;
  /** Say a short line when the run starts and when the basket is full. */
  speech: boolean;
  /** Xylophone, bell, drums, chimes and the other sounds along the run. */
  sounds: boolean;
}

export const DEFAULT_MARBLE_RUN_SETTINGS: MarbleRunSettings = {
  rebuild: true,
  pick: true,
  speech: false,
  sounds: true,
};

export const MARBLE_RUN_SETTINGS_KEY = "tinytaps.marblerun.v1";
