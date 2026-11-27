/**
 * Which phases of the routine are shown, kept for every brushing (user request, November 2026: chosen behind ⚙️ on the
 * strip of controls): the story, getting the brush, spitting and putting the brush away can each be left out, the
 * brushing to the song never.
 */
export interface TeethSettings {
  /** At the end, a week with a star for every morning and evening brushed. */
  week: boolean;
  /** First a short story: sweets leave sugar on the teeth, and over the day (or night) it grows into the monsters. */
  origin: boolean;
  /** First fetch the brush and put toothpaste on it, shown and said. */
  prep: boolean;
  /**
   * After the song and the cheer, a phase of its own: spitting the foam out over the basin (user request, November 2026:
   * skippable, like putting the brush away, and independent of it).
   */
  spit: boolean;
  /** At the end, after the cheer and the spitting: rinse the brush and put it back in its cup. */
  tidy: boolean;
}

// No choices for the song or the daytime: the song always plays, sung in the app
// language (it is the brushing), and the clock says whether it is morning or evening.
export const DEFAULT_TEETH_SETTINGS: TeethSettings = {
  week: true,
  origin: true,
  prep: true,
  spit: true,
  tidy: true,
};

// v2: music became on by default; v3: speech became off by default. Saved older
// settings would have kept the old choice.
export const TEETH_SETTINGS_KEY = "tinytaps.teeth.v3";
