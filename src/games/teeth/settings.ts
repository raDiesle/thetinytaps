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
  /** Say where to brush next and how; off by default, the pictures and music carry the brushing. */
  speech: boolean;
  /** A little tune in the background while brushing; on by default, it makes the two minutes go by. */
  music: boolean;
  /** In two-minute brushing, the song sung in this language (see sung.ts) instead of the plain tune; "off" keeps the plain tune. */
  singing: string;
  /** A poof for every monster, a chime when it is time to move on. */
  sounds: boolean;
}

export const DEFAULT_TEETH_SETTINGS: TeethSettings = {
  minutes: "2",
  daytime: "auto",
  week: true,
  prep: true,
  speech: false,
  music: true,
  singing: "de",
  sounds: true,
};

// v2: music became on by default; v3: speech became off by default. Saved older
// settings would have kept the old choice.
export const TEETH_SETTINGS_KEY = "tinytaps.teeth.v3";
