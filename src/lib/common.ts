// Options most games share, chosen once on the home page for all of them:
// read aloud, sounds and the calm mode. Each game keeps its own fields of the
// same name and gets them filled in from here (see withCommon).

import { useStoredSettings } from "@/lib/storage";

export interface CommonSettings {
  /** Speak names, sentences and questions. */
  speech: boolean;
  /** Chimes, notes and noises. */
  sounds: boolean;
  /** Quieter sounds, less movement, slower. */
  calm: boolean;
}

export const DEFAULT_COMMON_SETTINGS: CommonSettings = { speech: false, sounds: true, calm: false };

export const COMMON_SETTINGS_KEY = "tinytaps.common.v1";

export function useCommonSettings() {
  return useStoredSettings(COMMON_SETTINGS_KEY, DEFAULT_COMMON_SETTINGS);
}

/** A game's own settings with the shared options put in, for the fields the game has. */
export function withCommon<T extends object>(settings: T, common: CommonSettings): T {
  const merged = { ...settings } as Record<string, unknown>;
  for (const key of Object.keys(common) as (keyof CommonSettings)[]) {
    if (key in settings) merged[key] = common[key];
  }
  return merged as T;
}

/** The game's settings with the shared options in, and the setter for its own ones. */
export function useGameSettings<T extends object>(key: string, defaults: T) {
  const [stored, update] = useStoredSettings(key, defaults);
  const [common] = useCommonSettings();
  return [withCommon(stored, common), update, stored] as const;
}
