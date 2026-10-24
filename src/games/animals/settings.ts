/**
 * "feed": food to the hungry animal (N-08). "home": the animal to its home (N-09).
 * "peek": "Wer schaut da raus?" (X-04), only a part of an animal peeks out and the child picks the whole one.
 */
export type AnimalsMode = "feed" | "home" | "peek";

/** How many things to choose from. */
export type ChoiceCount = "2" | "3" | "4";

export interface AnimalsSettings {
  mode: AnimalsMode;
  /** Feeding and homes take turns, whichever of the two is picked. */
  mix: boolean;
  choices: ChoiceCount;
  /** Tapping the right thing is enough; otherwise it has to be dragged there. */
  tap: boolean;
  /** Names under the animal and the things, for children who start to read (or for the grown-ups). */
  names: boolean;
  /** Speak the question, the thanks and the "Bäh!". */
  speech: boolean;
  /** Munching, animal noises and chimes. */
  sounds: boolean;
}

export const DEFAULT_ANIMALS_SETTINGS: AnimalsSettings = {
  mode: "feed",
  mix: false,
  choices: "3",
  tap: true,
  names: false,
  speech: false,
  sounds: true,
};

export const ANIMALS_SETTINGS_KEY = "tinytaps.animals.v2";
