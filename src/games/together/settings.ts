import type { RoundKind } from "./levels";

/**
 * The game starts at once and takes turns between its two kinds of rounds, always finding the difficulty itself
 * (`levels.ts`; no „Schwierigkeit“ to fix, user decision, November 2026). Grown-ups pick what comes up right in the top
 * right corner while playing (`CornerChoices`).
 */
export interface TogetherSettings {
  /**
   * What comes up: all kinds taking turns, or just one of them – never a mix of some (user feedback, November 2026:
   * grown-ups pick everything or one thing, so the options stay plain).
   */
  kinds: "all" | RoundKind;
}

export const DEFAULT_TOGETHER_SETTINGS: TogetherSettings = {
  kinds: "all",
};

export const TOGETHER_SETTINGS_KEY = "tinytaps.together.v1";
