// Options every game shares: music, the child's figure and how a game is left, all set on the home page (🎵, 👦 / 👧,
// ⏳). Sounds and the browser's voice have no switch (root CLAUDE.md): sounds always play, and the browser's voice
// speaks only as the fallback of `recordedVoice` in the games told by their voice.

import { useCallback } from "react";
import { track } from "@/lib/analytics";
import { loadStored, useStoredSettings } from "@/lib/storage";
import { createStore, useStore } from "@/lib/store";

export interface CommonSettings {
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
  /**
   * How a game is left with its ✕ (the page's corner): one tap, or held for half a second, so a
   * child's tap can't end it. A tap by default (user decision, November 2026); grown-ups choose holding under ⏳.
   */
  leave: Leave;
}

/** Leaving a game with its ✕: a tap, or held for a moment. */
export type Leave = "tap" | "hold";

/** The child's own figure: a boy (as everything was drawn first) or a girl. */
export type Figure = "boy" | "girl";

const DEFAULT_COMMON_SETTINGS: CommonSettings = { music: true, figure: "boy", leave: "tap" };

export const COMMON_SETTINGS_KEY = "tinytaps.common.v1";

// One copy for the whole app, so a switch on the home page reaches the background song
// playing at the same time (src/components/BackgroundMusic.tsx) at once.
/** The shared options as saved, merged into the defaults. */
export const loadCommon = (): CommonSettings => loadStored(COMMON_SETTINGS_KEY, DEFAULT_COMMON_SETTINGS);
const common = createStore(() => showFigure(loadCommon()));

/** Puts the figure on the html element, where the menus' second family of colours hangs on it (`base.css`). */
function showFigure(settings: CommonSettings): CommonSettings {
  if (typeof document !== "undefined") {
    if (settings.figure === "girl") document.documentElement.dataset.figure = "girl";
    else delete document.documentElement.dataset.figure;
  }
  return settings;
}

/** Sets the colours of the saved figure before the first screen (`index.tsx`), so a menu never flashes the other ones. */
export const applySavedFigure = () => void common.get();

/** The shared options and their setter; every component using them sees a change at once. */
export function useCommonSettings() {
  const value = useStore(common);
  const update = useCallback((patch: Partial<Pick<CommonSettings, "music" | "figure" | "leave">>) => {
    const next = showFigure({ ...common.get(), ...patch });
    // Which options grown-ups choose for all games (analytics.ts).
    for (const [name, value] of Object.entries(patch))
      track("einstellung", { name, wert: typeof value === "boolean" ? (value ? "an" : "aus") : String(value) });
    try {
      localStorage.setItem(COMMON_SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // Storage full or disabled: the setting still applies for this visit.
    }
    common.set(next);
  }, []);
  return [value, update] as const;
}

/** The child's figure, boy or girl: every drawing that stands for the child asks this (`heroLook`, the mirror's face). */
export const useFigure = (): Figure => useCommonSettings()[0].figure;

/** A game's own settings, saved under `key` and merged into `defaults` (so new fields need no migration), and their setter. */
export function useGameSettings<T extends object>(key: string, defaults: T) {
  return useStoredSettings(key, defaults);
}
