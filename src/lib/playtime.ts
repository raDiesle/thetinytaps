// Play-time limit for all games together: the grown-up sets on the home page
// either minutes per day or a number of games per day. Every second a game is
// on screen counts towards the minutes, whichever game it is; every game
// started (also „Nochmal“ and „Weiter“ at the end of a level) counts as one.
// When it is over, the game says good night, and every menu stays locked
// until a grown-up holds the unlock button (PlaytimeLock). What was played is
// kept per day in localStorage, so switching games or reloading doesn't start
// it afresh.

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";

const PLAYTIME_SETTINGS_KEY = "tt-playtime";

/** What the limit counts: nothing, minutes or games. */
export type PlaytimeLimit = "none" | "time" | "games";

export interface PlaytimeSettings {
  /** Which of the two limits applies. */
  by: PlaytimeLimit;
  /** Minutes per day, when `by` is "time"; kept while another limit is chosen. */
  minutes: number;
  /** Games per day, when `by` is "games"; kept while another limit is chosen. */
  games: number;
}

export const DEFAULT_PLAYTIME_SETTINGS: PlaytimeSettings = { by: "none", minutes: 15, games: 3 };

/** The slider for minutes: from, to and step. */
export const MINUTES_RANGE = { min: 5, max: 90, step: 5 };

/** The slider for games. */
export const GAMES_RANGE = { min: 1, max: 10, step: 1 };

/** What a grown-up adds with one tap when the time is over. */
export const EXTRA_MINUTES = 5;

const PLAYED_KEY = "tt-playtime-played";

/** The last stretch in which everything slowly gets calmer. */
const WIND_DOWN_MS = 60_000;

/** Longest step counted at once, so a sleeping tablet doesn't eat the time. */
const MAX_STEP_MS = 2000;

/**
 * How often the time counted while playing is written to localStorage: every second was a write a second for nothing.
 * It is also written when the page is hidden or closed, when a game starts or ends and when it is left, so at most
 * this much is lost when a tab is killed outright.
 */
export const SAVE_EVERY_MS = 10_000;

/** Whether the time counted since `lastSaved` is due to be written at `now`. */
export const dueToSave = (lastSaved: number, now: number) => now - lastSaved >= SAVE_EVERY_MS;

/** What was played today. */
export interface Played {
  day: string;
  /** Milliseconds a game was on screen. */
  ms: number;
  /** Games started. */
  games: number;
}

const today = () => new Date().toDateString();

/** The kinds of limit, to check what storage holds. */
const LIMITS: readonly PlaytimeLimit[] = ["none", "time", "games"];

/** `value` when it is a number above zero (minutes, games), else `fallback`. */
const positive = (value: unknown, fallback: number) => (typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback);

/** `value` when it is a count of zero or more (milliseconds, games played), else 0. */
const count = (value: unknown) => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0);

/** What `raw` holds as JSON when it is an object, else nothing: storage may hold anything another version or a hand wrote. */
function savedObject(raw: string | null): Record<string, unknown> {
  try {
    const saved: unknown = raw ? JSON.parse(raw) : null;
    if (saved && typeof saved === "object" && !Array.isArray(saved)) return saved as Record<string, unknown>;
  } catch {
    // Broken storage: as if nothing was saved.
  }
  return {};
}

/**
 * The saved settings, each field checked: one of the wrong type falls back to its default. Before there was a choice
 * of limit, only `minutes` was saved, 0 meaning none: such a value still means a time limit (or none).
 */
export function parseSettings(raw: string | null): PlaytimeSettings {
  const saved = savedObject(raw);
  const minutes = positive(saved.minutes, DEFAULT_PLAYTIME_SETTINGS.minutes);
  if (LIMITS.includes(saved.by as PlaytimeLimit))
    return { by: saved.by as PlaytimeLimit, minutes, games: positive(saved.games, DEFAULT_PLAYTIME_SETTINGS.games) };
  if (positive(saved.minutes, 0)) return { ...DEFAULT_PLAYTIME_SETTINGS, by: "time", minutes };
  return DEFAULT_PLAYTIME_SETTINGS;
}

/** What was played today as saved, each field checked; saved on another day, or broken, nothing was played yet. */
export function parsePlayed(raw: string | null): Played {
  const saved = savedObject(raw);
  if (saved.day === today()) return { day: today(), ms: count(saved.ms), games: count(saved.games) };
  return { day: today(), ms: 0, games: 0 };
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: object) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Without storage it counts for this page only.
  }
}

// One copy for the whole app, so the lock over the menus, the game and the options on the
// home page all see a change at once.
let settings: PlaytimeSettings | null = null;
let played: Played | null = null;
/** Whether a game is on screen: then the game shows its own good night, not the lock. */
let inGame = false;
/** The last game allowed ended while it was on screen; cleared when the game is left. */
let lastGameEnded = false;
let state: PlaytimeState | null = null;

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const currentSettings = () => (settings ??= parseSettings(read(PLAYTIME_SETTINGS_KEY)));

function currentPlayed(): Played {
  played ??= parsePlayed(read(PLAYED_KEY));
  // A new day starts afresh, also on a tablet left on overnight.
  if (played.day !== today()) played = { day: today(), ms: 0, games: 0 };
  return played;
}

/** Re-reads everything and tells every component using it. */
function changed() {
  state = null;
  for (const listener of listeners) listener();
}

/** Counted time not yet written to localStorage (`flushPlayed`). */
let unsaved = false;

function savePlayed(next: Played) {
  played = next;
  unsaved = false;
  write(PLAYED_KEY, next);
  changed();
}

/** Writes the time counted since the last write, if any. */
function flushPlayed() {
  if (!unsaved || !played) return;
  unsaved = false;
  write(PLAYED_KEY, played);
}

// A page hidden (another app, the screen off) or closed may never come back: what was counted is written then.
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushPlayed);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushPlayed();
  });
}

/**
 * What the play time's components show of a state: whole minutes (PlaytimeOptions, PlaytimeNote), whether anything
 * was played, the lock, good night and the dusk. A second counted that changes none of these tells nobody.
 */
const shownOf = (state: PlaytimeState) => `${Math.floor(state.played.ms / 60_000)} ${state.played.ms > 0} ${state.over} ${state.goodNight} ${state.dusk}`;

/** Whether the components would show `after` differently from `before`. */
export const shownChanged = (before: PlaytimeState, after: PlaytimeState) => shownOf(before) !== shownOf(after);

/** Where the play time stands right now. */
export interface PlaytimeState {
  settings: PlaytimeSettings;
  played: Played;
  /** The limit is reached: nothing more is started today. */
  over: boolean;
  /** A game is on screen. */
  inGame: boolean;
  /** The game on screen says good night: the time ran out, or the last game allowed ended. */
  goodNight: boolean;
  /** 0 while playing normally, rising to 1 over the last minute of a time limit. */
  dusk: number;
}

/** Whether the limit is reached, for these settings and what was played. */
export function limitReached(s: PlaytimeSettings, p: Played): boolean {
  if (s.by === "time") return p.ms >= s.minutes * 60_000;
  if (s.by === "games") return p.games >= s.games;
  return false;
}

function computeState(): PlaytimeState {
  const s = currentSettings();
  const p = currentPlayed();
  const over = limitReached(s, p);
  const left = s.minutes * 60_000 - p.ms;
  const dusk = s.by === "time" ? Math.min(1, Math.max(0, 1 - left / WIND_DOWN_MS)) : 0;
  // A game limit lets the last game play to its end; a time limit stops it.
  const goodNight = inGame && (s.by === "time" ? over : over && lastGameEnded);
  return { settings: s, played: p, over, inGame, goodNight, dusk };
}

const currentState = () => (state ??= computeState());

/** The play time, updated whenever it changes anywhere in the app. */
export function usePlaytimeState(): PlaytimeState {
  return useSyncExternalStore(subscribe, currentState);
}

/** Whether the limit is reached right now, for a check outside React. */
export const isPlaytimeOver = () => currentState().over;

/** The settings and their setter; every component using them sees a change at once. */
export function usePlaytimeSettings() {
  const { settings: value } = usePlaytimeState();
  const update = useCallback((patch: Partial<PlaytimeSettings>) => {
    settings = { ...currentSettings(), ...patch };
    // Which kind of limit grown-ups set (analytics.ts) – not each step of its slider, which would be one event per step.
    if (patch.by) track("einstellung", { name: "spielzeit", wert: patch.by });
    write(PLAYTIME_SETTINGS_KEY, settings);
    changed();
  }, []);
  return [value, update] as const;
}

/** Starts today's play time afresh. */
export function resetPlaytime() {
  savePlayed({ day: today(), ms: 0, games: 0 });
}

/** A little more for today, when the limit is reached: a few minutes, or one more game. */
export function morePlaytime() {
  const s = currentSettings();
  track("mehr-spielzeit", { grenze: s.by });
  const p = currentPlayed();
  if (s.by === "time") savePlayed({ ...p, ms: Math.max(0, (s.minutes - EXTRA_MINUTES) * 60_000) });
  else if (s.by === "games") savePlayed({ ...p, games: Math.max(0, s.games - 1) });
}

/** A game starts, from a start screen or with „Nochmal“ / „Weiter“ at the end of a level. */
export function countGame() {
  lastGameEnded = false;
  const p = currentPlayed();
  savePlayed({ ...p, games: p.games + 1 });
}

/** A level ended (GameEnd shows): with a game limit used up, the game says good night instead of offering the next. */
export function gameEnded() {
  if (lastGameEnded) return;
  lastGameEnded = true;
  flushPlayed();
  changed();
}

/** What a game on screen needs to know: whether to say good night, and how dark the dusk is. */
export interface GamePlaytime {
  goodNight: boolean;
  dusk: number;
}

/**
 * Marks a game as on screen while `active` and counts the time meanwhile, every second – kept in memory, written every
 * SAVE_EVERY_MS (`dueToSave`), and told to the components only when what they show changes (`shownChanged`).
 * Only a change of good night or dusk re-renders the game, not every second counted.
 */
export function usePlaytime(active: boolean): GamePlaytime {
  useEffect(() => {
    if (!active) return;
    inGame = true;
    lastGameEnded = false;
    changed();
    let last = performance.now();
    let lastSaved = last;
    const timer = setInterval(() => {
      const now = performance.now();
      const p = currentPlayed();
      const before = currentState();
      // Counted until good night, also through the last game of a game limit.
      if (document.visibilityState === "visible" && !before.goodNight) {
        played = { ...p, ms: p.ms + Math.min(now - last, MAX_STEP_MS) };
        unsaved = true;
        if (dueToSave(lastSaved, now)) {
          flushPlayed();
          lastSaved = now;
        }
        state = null;
        if (shownChanged(before, currentState())) changed();
      }
      last = now;
    }, 1000);
    return () => {
      clearInterval(timer);
      flushPlayed();
      inGame = false;
      lastGameEnded = false;
      changed();
    };
  }, [active]);

  const goodNight = useSyncExternalStore(subscribe, () => currentState().goodNight);
  const dusk = useSyncExternalStore(subscribe, () => currentState().dusk);
  return { goodNight, dusk };
}
