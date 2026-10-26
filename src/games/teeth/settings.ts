import type { DaytimeChoice } from "./daytime";

export interface TeethSettings {
  /** Morning (sun, breakfast crumbs) or evening (moon, pyjamas, "Gute Nacht"); by the clock unless chosen. */
  daytime: DaytimeChoice;
  /** At the end, a week with a star for every morning and evening brushed. */
  week: boolean;
  /** First a short story: sweets leave sugar on the teeth, and over the day (or night) it grows into the monsters. */
  origin: boolean;
  /** First fetch the brush and put toothpaste on it, shown and said. */
  prep: boolean;
  /** Say where to brush next and how; off by default, the pictures and music carry the brushing. */
  speech: boolean;
  /** A little tune in the background while brushing; on by default, it makes the two minutes go by. */
  music: boolean;
  /**
   * The song sung in this language (see sung.ts) instead of the plain tune, and the brushing lasts as long as it;
   * "auto" sings in the app language when it isn't German and has a song, else in the browser's language or English (sungLanguageFor);
   * "off" (or no song in the chosen language) keeps the plain tune and two minutes.
   */
  singing: string;
  /** A poof for every monster, a chime when it is time to move on. */
  sounds: boolean;
}

export const DEFAULT_TEETH_SETTINGS: TeethSettings = {
  daytime: "auto",
  week: true,
  origin: true,
  prep: true,
  speech: false,
  music: true,
  // "auto" rather than a fixed language: it follows the app language when the parents switch it to one with a song,
  // otherwise the browser's language or English (sungLanguageFor).
  singing: "auto",
  sounds: true,
};

// v2: music became on by default; v3: speech became off by default. Saved older
// settings would have kept the old choice.
export const TEETH_SETTINGS_KEY = "tinytaps.teeth.v3";
