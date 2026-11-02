/**
 * Nothing to choose: the game takes turns between its three kinds of rounds and finds the difficulty itself
 * (`levels.ts`). Only the shared options are filled in.
 */
export interface AnimalsSettings {
  /** Speak the question, the thanks and the "Bäh!". */
  speech: boolean;
  /** Munching, animal noises and chimes. */
  sounds: boolean;
}

export const DEFAULT_ANIMALS_SETTINGS: AnimalsSettings = {
  speech: false,
  sounds: true,
};

export const ANIMALS_SETTINGS_KEY = "tinytaps.animals.v2";
