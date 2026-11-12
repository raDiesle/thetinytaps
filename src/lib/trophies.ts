import { useSyncExternalStore } from "react";
import { CATEGORIES, type Game } from "@/content/games";

/*
 * The trophies a child collects (user decision, November 2026): every level or story played to its end (`GameEnd`)
 * gives a trophy of its own, made for that game and level (Trophy.tsx), and the trophies won stand in the bookshelf on
 * the home page (TrophyShelf). Kept in this browser only, like the settings; nothing is sent anywhere.
 */

/** A trophy won: the game's address, the level's id within it ("" where the game has one level only), when it was first won. */
export interface TrophyWon {
  game: string;
  level: string;
  at: number;
}

const KEY = "tinytaps.trophies.v1";

function read(): TrophyWon[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as { won?: TrophyWon[] }).won : undefined;
    return Array.isArray(list) ? list.filter((t) => typeof t?.game === "string" && typeof t.level === "string") : [];
  } catch {
    return [];
  }
}

let won: TrophyWon[] | undefined;
const listeners = new Set<() => void>();

const current = () => {
  won ??= read();
  return won;
};

/** One trophy per game and level: the key both are stored and drawn by. */
export const trophyKey = (game: string, level: string) => `${game}#${level}`;

/** Whether the trophy of `game` and `level` was won before. */
export const hasTrophy = (game: string, level: string) => current().some((t) => t.game === game && t.level === level);

/**
 * Gives the trophy of `game` and `level`, once: winning it again changes nothing (no count – the child collects
 * different ones, never the same over and over). Returns whether it is new.
 */
export function awardTrophy(game: string, level: string, now = Date.now()): boolean {
  if (hasTrophy(game, level)) return false;
  won = [...current(), { game, level, at: now }];
  try {
    localStorage.setItem(KEY, JSON.stringify({ won }));
  } catch {
    // Storage full or disabled: the trophy still stands on the shelf for this visit.
  }
  for (const listener of listeners) listener();
  return true;
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** The trophies won, in the order they were won. */
export function useTrophies(): TrophyWon[] {
  return useSyncExternalStore(subscribe, current);
}

/** Every game on the shelf or in a book, with the addresses of its parts. */
const GAMES: Game[] = CATEGORIES.flatMap((category) => category.games);

/** The game an address belongs to: the one whose address it starts with, the longest where several do. */
export function gameOfPath(pathname: string): Game | undefined {
  return GAMES.filter((game) => pathname.startsWith(game.href)).sort((a, b) => b.href.length - a.href.length)[0];
}

/** The game a trophy was won in, by its stored address. */
export const gameOf = (href: string) => GAMES.find((game) => game.href === href);

/** Where a game stands among all games: trophies are shown in the shelf's order of the games. */
export const gameOrder = (href: string) => GAMES.findIndex((game) => game.href === href);

/** Forgets every trophy: only for tests. */
export function resetTrophiesForTest(list: TrophyWon[] = []) {
  won = list;
  for (const listener of listeners) listener();
}
