/** "feed": food to the hungry animal (N-08). "home": the animal to its home (N-09). "mix": one, then the other. */
export type AnimalsMode = "feed" | "home" | "mix";

/** How many things to choose from. */
export type ChoiceCount = "2" | "3" | "4";

export interface AnimalsSettings {
  mode: AnimalsMode;
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
  choices: "3",
  tap: true,
  names: false,
  speech: false,
  sounds: true,
};

export const ANIMALS_SETTINGS_KEY = "tinytaps.animals.v1";
