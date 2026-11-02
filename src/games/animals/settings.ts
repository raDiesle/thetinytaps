import type { RoundKind } from "./levels";

/** How hard the rounds are: found by how the child plays („Von selbst“), or fixed by a grown-up. */
export type Difficulty = "auto" | "easy" | "medium" | "hard";

/**
 * The game starts at once and takes turns between its five kinds of rounds, finding the difficulty itself
 * (`levels.ts`). Grown-ups may change both while playing, behind ⚙️ held in the corner (`PlayOptions`).
 */
export interface AnimalsSettings extends Record<RoundKind, boolean> {
  /** Fixed or found by how the child plays. */
  difficulty: Difficulty;
  /** Speak the question, the thanks and the "Bäh!". */
  speech: boolean;
  /** Munching, animal noises and chimes. */
  sounds: boolean;
}

export const DEFAULT_ANIMALS_SETTINGS: AnimalsSettings = {
  peek: true,
  feed: true,
  gift: true,
  home: true,
  grow: true,
  difficulty: "auto",
  speech: false,
  sounds: true,
};

export const ANIMALS_SETTINGS_KEY = "tinytaps.animals.v3";
