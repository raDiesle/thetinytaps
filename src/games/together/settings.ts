import type { RoundKind } from "./levels";

/** How hard the rounds are: found by how the child plays („Von selbst“), or fixed by a grown-up. */
export type Difficulty = "auto" | "easy" | "medium" | "hard";

/**
 * The game starts at once and takes turns between its two kinds of rounds, finding the difficulty itself
 * (`levels.ts`). Grown-ups may change both while playing, behind ⚙️ held in the corner (`PlayOptions`).
 */
export interface TogetherSettings extends Record<RoundKind, boolean> {
  /** Fixed or found by how the child plays. */
  difficulty: Difficulty;
  /** Speak the question and what belongs to what (off for good until its lines are recorded). */
  speech: boolean;
  /** The pairs' and helpers' sounds and chimes. */
  sounds: boolean;
}

export const DEFAULT_TOGETHER_SETTINGS: TogetherSettings = {
  pair: true,
  helper: true,
  difficulty: "auto",
  speech: false,
  sounds: true,
};

export const TOGETHER_SETTINGS_KEY = "tinytaps.together.v1";
