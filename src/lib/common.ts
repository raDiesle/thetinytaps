// Options most games share, the same for all of them: read aloud, sounds, music and the child's figure.
// Music (🎵) and the figure (👦 / 👧) are set on the home page; read aloud and sounds are decided once
// (FIXED). Each game keeps its own fields for read aloud and sounds and gets them filled
// in from here (see withCommon).

import { useCallback, useSyncExternalStore } from "react";
import { loadStored, useStoredSettings } from "@/lib/storage";

export interface CommonSettings {
  /** Speak names, sentences and questions with the browser's voice – always off (FIXED). */
  speech: boolean;
  /** Chimes, notes and noises – always on (FIXED). */
  sounds: boolean;
  /**
   * The background song in every game (`backgroundMusic.ts`); off also silences a game's
   * own music and keeps the song files from being downloaded at all. Not the song of
   * Zähne putzen: it sings the steps and sets how long the brushing lasts.
   */
  music: boolean;
  /**
   * Whether the figure that stands for the child is a boy or a girl (👦 / 👧 on the home page): the child
   * in Kleine Abenteuer, the face in Zähne putzen's mirror, and the menus' colours (`data-figure` on html).
   * Animals and the people in the pictures stay as they are.
   */
  figure: Figure;
}

/** The child's own figure: a boy (as everything was drawn first) or a girl. */
export type Figure = "boy" | "girl";

/**
 * No switch for these any more: the browser's voice sounds too poor to read to a child (spoken
 * lines come as ElevenLabs recordings instead, which play without a switch), and a game without
 * its sounds gives a tap no answer. Also over a value a grown-up once saved, when they were switches.
 */
const FIXED = { speech: false, sounds: true } as const;

export const DEFAULT_COMMON_SETTINGS: CommonSettings = { ...FIXED, music: true, figure: "boy" };

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
/** The shared options as saved, with read aloud and sounds always as FIXED says. */
export const loadCommon = (): CommonSettings => ({ ...loadStored(COMMON_SETTINGS_KEY, DEFAULT_COMMON_SETTINGS), ...FIXED });
const current = () => (common ??= showFigure(loadCommon()));

/** Puts the figure on the html element, where the menus' second family of colours hangs on it (`base.css`). */
function showFigure(settings: CommonSettings): CommonSettings {
  if (typeof document !== "undefined") {
    if (settings.figure === "girl") document.documentElement.dataset.figure = "girl";
    else delete document.documentElement.dataset.figure;
  }
  return settings;
}

/** Sets the colours of the saved figure before the first screen (`index.tsx`), so a menu never flashes the other ones. */
export const applySavedFigure = () => void current();

/** The shared options and their setter; every component using them sees a change at once. */
export function useCommonSettings() {
  const value = useSyncExternalStore(subscribe, current);
  const update = useCallback((patch: Partial<Pick<CommonSettings, "music" | "figure">>) => {
    common = showFigure({ ...current(), ...patch });
    try {
      localStorage.setItem(COMMON_SETTINGS_KEY, JSON.stringify(common));
    } catch {
      // Storage full or disabled: the setting still applies for this visit.
    }
    for (const listener of listeners) listener();
  }, []);
  return [value, update] as const;
}

/** The child's figure, boy or girl: every drawing that stands for the child asks this (`heroLook`, the mirror's face). */
export const useFigure = (): Figure => useCommonSettings()[0].figure;

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
