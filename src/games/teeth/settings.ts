import type { DaytimeChoice } from "./daytime";

/** How long the brushing takes; dentists recommend two minutes. */
export type BrushMinutes = "1" | "2" | "3";

export interface TeethSettings {
  minutes: BrushMinutes;
  /** Morning (sun, breakfast crumbs) or evening (moon, pyjamas, "Gute Nacht"); by the clock unless chosen. */
  daytime: DaytimeChoice;
  /** At the end, a week with a star for every morning and evening brushed. */
  week: boolean;
  /** First fetch the brush and put toothpaste on it, shown and said. */
  prep: boolean;
  /** Say where to brush next and how; the point of the game, so on by default. */
  speech: boolean;
  /** A little tune while brushing; off by default. */
  music: boolean;
  /** A poof for every monster, a chime when it is time to move on. */
  sounds: boolean;
}

export const DEFAULT_TEETH_SETTINGS: TeethSettings = {
  minutes: "2",
  daytime: "auto",
  week: true,
  prep: true,
  speech: true,
  music: false,
  sounds: true,
};

export const TEETH_SETTINGS_KEY = "tinytaps.teeth.v1";
