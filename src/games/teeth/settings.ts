/** How long the brushing takes; dentists recommend two minutes. */
export type BrushMinutes = "1" | "2" | "3";

export interface TeethSettings {
  minutes: BrushMinutes;
  /** First fetch the brush and put toothpaste on it, shown and said. */
  prep: boolean;
  /** Say where to brush next and how; the point of the game, so on by default. */
  speech: boolean;
  /** A little tune in the background while brushing; on by default, it makes the two minutes go by. */
  music: boolean;
  /** A poof for every monster, a chime when it is time to move on. */
  sounds: boolean;
}

export const DEFAULT_TEETH_SETTINGS: TeethSettings = {
  minutes: "2",
  prep: true,
  speech: true,
  music: true,
  sounds: true,
};

// v2: music became on by default; saved v1 settings would have kept it off.
export const TEETH_SETTINGS_KEY = "tinytaps.teeth.v2";
