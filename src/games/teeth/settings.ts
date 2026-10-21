/** How long the brushing takes; dentists recommend two minutes. */
export type BrushMinutes = "1" | "2" | "3";

export interface TeethSettings {
  minutes: BrushMinutes;
  /** First fetch the brush and put toothpaste on it, shown and said. */
  prep: boolean;
  /** Say where to brush next and how; the point of the game, so on by default. */
  speech: boolean;
  /** Music while brushing, a poof for every monster, a chime when it is time to move on. */
  sounds: boolean;
  /** Quieter sounds, a slower brush, no wiggling. */
  calm: boolean;
}

export const DEFAULT_TEETH_SETTINGS: TeethSettings = {
  minutes: "2",
  prep: true,
  speech: true,
  sounds: true,
  calm: false,
};

export const TEETH_SETTINGS_KEY = "tinytaps.teeth.v1";
