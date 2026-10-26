export interface TeethSettings {
  /** At the end, a week with a star for every morning and evening brushed. */
  week: boolean;
  /** First fetch the brush and put toothpaste on it, shown and said. */
  prep: boolean;
  /** "Vorlesen" from the home page: says the prelude; the song sings the steps itself. */
  speech: boolean;
  /** A poof for every monster, a chime when it is time to move on. */
  sounds: boolean;
}

// No choices for the song or the daytime: the song always plays, sung in the app's
// language (it is the brushing), and the clock says whether it is morning or evening.
export const DEFAULT_TEETH_SETTINGS: TeethSettings = {
  week: true,
  prep: true,
  speech: false,
  sounds: true,
};

// v2: music became on by default; v3: speech became off by default. Saved older
// settings would have kept the old choice.
export const TEETH_SETTINGS_KEY = "tinytaps.teeth.v3";
