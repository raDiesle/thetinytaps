// Options most games share, chosen once on the home page for all of them:
// read aloud, sounds and music. Each game keeps its own fields for read aloud
// and sounds and gets them filled in from here (see withCommon).

import { useCallback, useSyncExternalStore } from "react";
import { loadStored, useStoredSettings } from "@/lib/storage";

export interface CommonSettings {
  /** Speak names, sentences and questions. */
  speech: boolean;
  /** Chimes, notes and noises. */
  sounds: boolean;
  /**
   * The background song in every game (`backgroundMusic.ts`); off also silences a game's
   * own music and keeps the song files from being downloaded at all. Not the song of
   * Zähne putzen: it sings the steps and sets how long the brushing lasts.
   */
  music: boolean;
}

export const DEFAULT_COMMON_SETTINGS: CommonSettings = { speech: false, sounds: true, music: true };

/**
 * The options filled into a game's fields of the same name. Not music: a game with
 * its own music keeps its own switch for it, which only counts while music is on here.
 */
const FILLED_IN = ["speech", "sounds"] as const;

export const COMMON_SETTINGS_KEY = "tinytaps.common.v1";

// One copy for the whole app, so a switch on the home page reaches the background song
// playing at the same time (src/components/BackgroundMusic.tsx) at once.
let common: CommonSettings | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const current = () => (common ??= loadStored(COMMON_SETTINGS_KEY, DEFAULT_COMMON_SETTINGS));

/** The shared options and their setter; every component using them sees a change at once. */
export function useCommonSettings() {
  const value = useSyncExternalStore(subscribe, current);
  const update = useCallback((patch: Partial<CommonSettings>) => {
    common = { ...current(), ...patch };
    try {
      localStorage.setItem(COMMON_SETTINGS_KEY, JSON.stringify(common));
    } catch {
      // Storage full or disabled: the setting still applies for this visit.
    }
    for (const listener of listeners) listener();
  }, []);
  return [value, update] as const;
}

/** A game's own settings with the shared options put in, for the fields the game has. */
export function withCommon<T extends object>(settings: T, common: CommonSettings): T {
  const merged = { ...settings } as Record<string, unknown>;
  for (const key of FILLED_IN) {
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
