// Play-time limit: the grown-up picks a number of minutes, the game winds
// down towards the end and then says good night by itself. The end time lives
// in sessionStorage, so it keeps running when the child-friendly home page
// switches between games (and survives a reload).

import { useEffect, useState } from "react";

export const PLAYTIME_SETTINGS_KEY = "tt-playtime";

export interface PlaytimeSettings {
  /** 0: no limit. */
  minutes: number;
}

export const DEFAULT_PLAYTIME_SETTINGS: PlaytimeSettings = { minutes: 0 };

export const PLAYTIME_OPTIONS = [0, 5, 10, 15, 20, 30];

const END_KEY = "tt-playtime-end";

/** The last stretch in which everything slowly gets calmer. */
const WIND_DOWN_MS = 60_000;

function readEnd(): number | null {
  try {
    const raw = sessionStorage.getItem(END_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

/** Starts the clock; without minutes any running clock is cleared. */
export function startPlaytime(minutes: number) {
  try {
    if (minutes > 0) sessionStorage.setItem(END_KEY, String(Date.now() + minutes * 60_000));
    else sessionStorage.removeItem(END_KEY);
  } catch {
    // Without storage there is simply no limit.
  }
}

export function clearPlaytime() {
  startPlaytime(0);
}

export function isPlaytimeOver() {
  const end = readEnd();
  return end !== null && Date.now() >= end;
}

export interface Playtime {
  /** 0 while playing normally, rising to 1 over the last minute. */
  dusk: number;
  over: boolean;
}

/** Re-reads the clock every second while a game runs. */
export function usePlaytime(): Playtime {
  const [now, setNow] = useState(() => Date.now());
  const end = readEnd();

  useEffect(() => {
    if (end === null) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [end]);

  if (end === null) return { dusk: 0, over: false };
  const left = end - now;
  if (left <= 0) return { dusk: 1, over: true };
  return { dusk: Math.max(0, 1 - left / WIND_DOWN_MS), over: false };
}
