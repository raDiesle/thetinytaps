// Play-time limit for all games together: the grown-up picks a number of
// minutes on the home page, and every second a game is on screen counts
// towards it, whichever game it is. Towards the end the game winds down and
// then says good night by itself. The time played is kept per day in
// localStorage, so switching games or reloading doesn't start it afresh.

import { useEffect, useState } from "react";
import { loadStored } from "@/lib/storage";

export const PLAYTIME_SETTINGS_KEY = "tt-playtime";

export interface PlaytimeSettings {
  /** 0: no limit. */
  minutes: number;
}

export const DEFAULT_PLAYTIME_SETTINGS: PlaytimeSettings = { minutes: 0 };

export const PLAYTIME_OPTIONS = [0, 5, 10, 15, 20, 30, 45, 60];

const PLAYED_KEY = "tt-playtime-played";

/** The last stretch in which everything slowly gets calmer. */
const WIND_DOWN_MS = 60_000;

/** Longest step counted at once, so a sleeping tablet doesn't eat the time. */
const MAX_STEP_MS = 2000;

const today = () => new Date().toDateString();

/** Milliseconds played today, in all games together. */
export function playedToday(): number {
  const played = loadStored(PLAYED_KEY, { day: "", ms: 0 });
  return played.day === today() ? played.ms : 0;
}

function savePlayed(ms: number) {
  try {
    localStorage.setItem(PLAYED_KEY, JSON.stringify({ day: today(), ms }));
  } catch {
    // Without storage the time counts for this page only.
  }
}

/** Starts today's play time afresh. */
export function resetPlaytime() {
  savePlayed(0);
}

/** The limit in milliseconds, or null without one. */
function limitMs(): number | null {
  const { minutes } = loadStored(PLAYTIME_SETTINGS_KEY, DEFAULT_PLAYTIME_SETTINGS);
  return minutes > 0 ? minutes * 60_000 : null;
}

export function isPlaytimeOver() {
  const limit = limitMs();
  return limit !== null && playedToday() >= limit;
}

export interface Playtime {
  /** 0 while playing normally, rising to 1 over the last minute. */
  dusk: number;
  over: boolean;
}

function playtimeNow(): Playtime {
  const limit = limitMs();
  if (limit === null) return { dusk: 0, over: false };
  const left = limit - playedToday();
  if (left <= 0) return { dusk: 1, over: true };
  return { dusk: Math.max(0, 1 - left / WIND_DOWN_MS), over: false };
}

/** Counts the time while `active` (a game is on screen and visible) and re-reads the clock every second. */
export function usePlaytime(active: boolean): Playtime {
  const [playtime, setPlaytime] = useState(playtimeNow);

  useEffect(() => {
    if (!active) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      if (document.visibilityState === "visible" && !isPlaytimeOver()) {
        savePlayed(playedToday() + Math.min(now - last, MAX_STEP_MS));
      }
      last = now;
      // Same values: no re-render of the game.
      const next = playtimeNow();
      setPlaytime((prev) => (prev.dusk === next.dusk && prev.over === next.over ? prev : next));
    }, 1000);
    return () => clearInterval(timer);
  }, [active]);

  return playtime;
}
