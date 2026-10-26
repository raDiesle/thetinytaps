/** A sound of a prelude part: it plays when the brushing clock passes `at` ms after the part's start. */
export interface Cue {
  at: number;
  play: () => void;
}
