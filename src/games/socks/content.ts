import { byLanguage } from "@/content/texts";
import type { Localized } from "@/lib/language";

/** A sock colour: the knitted body and the lighter cuff, heel and toe. */
export interface SockColor {
  id: string;
  main: string;
  light: string;
}

export const SOCK_COLORS: SockColor[] = [
  { id: "red", main: "#e63946", light: "#ffd6d6" },
  { id: "orange", main: "#ff8c42", light: "#ffe0c2" },
  { id: "yellow", main: "#ffc300", light: "#fff3b0" },
  { id: "green", main: "#3ec300", light: "#d4f7c5" },
  { id: "blue", main: "#118ab2", light: "#c9ecff" },
  { id: "purple", main: "#8e7dff", light: "#e3ddff" },
  { id: "pink", main: "#ff7bd0", light: "#ffe0f4" },
  { id: "brown", main: "#a0673c", light: "#f0d9c4" },
];

/** What is knitted onto a sock; "plain" has nothing. */
export type SockPattern = "plain" | "stripes" | "dots" | "hearts" | "stars" | "zigzag";

export const SOCK_PATTERNS: SockPattern[] = ["plain", "stripes", "dots", "hearts", "stars", "zigzag"];

/** How one pair looks; both socks of a pair look exactly the same. */
export interface SockLook {
  color: SockColor;
  pattern: SockPattern;
}

/** The most pairs in one wash: 12 socks still fit on a phone, and every pattern is used once. */
export const MAX_PAIRS = SOCK_PATTERNS.length;

/**
 * What tells the pairs apart, from easy to hard:
 * colors – plain socks, every pair its own colour;
 * patterns – a pattern per pair, and every pair still its own colour, so the colour helps;
 * sameColor – a pattern per pair in few colours, so pairs of the same colour sit side by side and only the pattern tells;
 * mixed – two colours times a few patterns, so every pair has one twin with its pattern and others with its colour.
 */
export type SockKind = "colors" | "patterns" | "sameColor" | "mixed";

/**
 * One step of the difficulty: how many pairs in the wash, what tells them apart, and how many socks a laundry basket
 * covers once they lie (like memory: the child has to remember or look under it). Never anything faster.
 */
export interface SockLevel {
  pairs: number;
  kind: SockKind;
  covered: number;
}

/** The steps the game climbs (or goes back down) by how the child plays, see `nextLevel`; the first is where it begins. */
export const SOCK_LEVELS: SockLevel[] = [
  { pairs: 2, kind: "colors", covered: 0 },
  { pairs: 3, kind: "colors", covered: 0 },
  { pairs: 3, kind: "colors", covered: 1 },
  { pairs: 4, kind: "colors", covered: 2 },
  { pairs: 3, kind: "patterns", covered: 0 },
  { pairs: 4, kind: "patterns", covered: 1 },
  { pairs: 4, kind: "patterns", covered: 2 },
  { pairs: 3, kind: "sameColor", covered: 0 },
  { pairs: 4, kind: "sameColor", covered: 1 },
  { pairs: 4, kind: "sameColor", covered: 3 },
  { pairs: 5, kind: "sameColor", covered: 4 },
  { pairs: 4, kind: "mixed", covered: 1 },
  { pairs: 5, kind: "mixed", covered: 3 },
  { pairs: 6, kind: "mixed", covered: 4 },
  { pairs: 6, kind: "mixed", covered: 6 },
];

/** A new list with the same items in random order. */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** The pairs of one wash at `level`; no two look the same. */
export function dealPairs({ pairs, kind }: Pick<SockLevel, "pairs" | "kind">): SockLook[] {
  const colors = shuffle(SOCK_COLORS);
  const patterns = shuffle(SOCK_PATTERNS);
  if (kind === "colors") return colors.slice(0, pairs).map((color) => ({ color, pattern: "plain" }));
  if (kind === "patterns") return patterns.slice(0, pairs).map((pattern, i) => ({ color: colors[i], pattern }));
  if (kind === "sameColor") {
    // Every colour at least twice: 3 pairs in one colour, 4 in two, 5 in two.
    const used = Math.max(1, Math.floor(pairs / 2));
    return shuffle(patterns.slice(0, pairs).map((pattern, i) => ({ color: colors[i % used], pattern })));
  }
  return shuffle(Array.from({ length: pairs }, (_, i) => ({ color: colors[i % 2], pattern: patterns[Math.floor(i / 2)] })));
}

/** How one wash went: how many pairs, how often another sock was taken than the partner, and how long it took. */
export interface WashResult {
  pairs: number;
  /** Taps on a sock that wasn't the partner of the lifted one; never "wrong" for the child, only counted here. */
  misses: number;
  /** From the socks lying on the floor to the last pair found. */
  ms: number;
}

/**
 * Sure goes up, two steps when it was easy (no miss and quick); many misses or a very long search goes one step back;
 * else it stays. Time is only a hint how easy it was, never something to beat: the limits are generous.
 */
export function nextLevel(level: number, { pairs, misses, ms }: WashResult): number {
  const missesPerPair = misses / pairs;
  const secondsPerPair = ms / 1000 / pairs;
  let step = 0;
  if (misses === 0 && secondsPerPair <= 3) step = 2;
  else if (missesPerPair <= 0.5 && secondsPerPair <= 10) step = 1;
  else if (missesPerPair >= 1.5 || secondsPerPair >= 20) step = -1;
  return Math.max(0, Math.min(SOCK_LEVELS.length - 1, level + step));
}

/** One of `list`, at random. */
export const oneOf = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** What is said (only with "Vorlesen" on) and shown, in one language. */
export interface SockTexts {
  start: string;
  /** Praise for a pair found; one of them, at random. */
  pair: string[];
  done: string;
  /** For screen readers: the sock at place `n` (from 1) on the floor. */
  sock: (n: number) => string;
}

const GERMAN_TEXTS: SockTexts = {
  start: "Such zwei gleiche Socken!",
  pair: ["Ein Paar!", "Die passen zusammen!", "Gleich und gleich!", "Zwei gleiche!"],
  done: "Alle Socken hängen auf der Leine!",
  sock: (n) => `Socke ${n}`,
};

/** The texts by app language: `pick(SOCK_TEXTS, language.id)`; the others are in content.<language>.ts, German fills their gaps. */
export const SOCK_TEXTS: Localized<SockTexts> = byLanguage((texts) => texts.socks && { ...GERMAN_TEXTS, ...texts.socks }, GERMAN_TEXTS);
