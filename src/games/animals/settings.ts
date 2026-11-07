import type { RoundKind } from "./levels";

/** How hard the rounds are: found by how the child plays („Von selbst“), or fixed by a grown-up. */
export type Difficulty = "auto" | "easy" | "medium" | "hard";

/**
 * The game starts at once and takes turns between its four kinds of rounds, finding the difficulty itself
 * (`levels.ts`). Grown-ups may change both while playing, behind ⚙️ held in the corner (`PlayOptions`).
 */
export interface AnimalsSettings {
  /**
   * What comes up: all kinds taking turns, or just one of them – never a mix of some (user feedback, November 2026:
   * grown-ups pick everything or one thing, so the options stay plain).
   */
  kinds: "all" | RoundKind;
  /** Fixed or found by how the child plays. */
  difficulty: Difficulty;
  /** Speak the question, the thanks and the "Bäh!". */
  speech: boolean;
  /** Munching, animal noises and chimes. */
  sounds: boolean;
}

export const DEFAULT_ANIMALS_SETTINGS: AnimalsSettings = {
  kinds: "all",
  difficulty: "auto",
  speech: false,
  sounds: true,
};

export const ANIMALS_SETTINGS_KEY = "tinytaps.animals.v3";
