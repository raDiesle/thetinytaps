import type { RoundKind } from "./levels";

/**
 * The game starts at once and takes turns between its five kinds of rounds, finding the difficulty itself
 * (`levels.ts`). Grown-ups may pick one kind while playing, in the top right corner (`KindCorner`).
 */
export interface AnimalsSettings {
  /**
   * What comes up: all kinds taking turns, or just one of them – never a mix of some (user feedback, November 2026:
   * grown-ups pick everything or one thing, so the options stay plain).
   */
  kinds: "all" | RoundKind;
  /** Speak the question, the thanks and the "Bäh!". */
  speech: boolean;
  /** Munching, animal noises and chimes. */
  sounds: boolean;
}

export const DEFAULT_ANIMALS_SETTINGS: AnimalsSettings = {
  kinds: "all",
  speech: false,
  sounds: true,
};

export const ANIMALS_SETTINGS_KEY = "tinytaps.animals.v3";
