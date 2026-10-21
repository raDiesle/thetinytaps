export type LetterCase = "upper" | "both" | "lower";

export interface LettersSettings {
  letterCase: LetterCase;
  /** Show the word under the picture, with its first letter highlighted. */
  showWord: boolean;
  /** Speak "A wie Affe" and count numbers aloud. */
  speech: boolean;
  /** Chimes and notes. */
  sounds: boolean;
}

export const DEFAULT_LETTERS_SETTINGS: LettersSettings = {
  letterCase: "upper",
  showWord: true,
  speech: true,
  sounds: true,
};

export const LETTERS_SETTINGS_KEY = "tinytaps.letters.v1";
