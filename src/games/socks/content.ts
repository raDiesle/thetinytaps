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

/** What is knitted onto a sock; "plain" has nothing, "foxes" and "bears" are the app's mascots' heads (D-18). */
export type SockPattern = "plain" | "stripes" | "dots" | "hearts" | "stars" | "zigzag" | "foxes" | "bears";

export const SOCK_PATTERNS: SockPattern[] = ["plain", "stripes", "dots", "hearts", "stars", "zigzag", "foxes", "bears"];

/**
 * What hangs on the line: socks, and the new laundry of idea Z-10 – mittens, rain boots and slippers, which come as a
 * left and a right that mirror each other.
 */
export type Garment = "sock" | "mitten" | "boot" | "slipper";

/** The garments with a left and a right one. */
export const MIRRORED: Garment[] = ["mitten", "boot", "slipper"];

/** Which of a pair: a sock's two are the same, a mitten's or boot's right one is the left one mirrored. */
export type Side = "left" | "right";

/** How one pair looks; its two pieces look exactly the same (a mirrored garment's right one mirrored). */
export interface SockLook {
  garment: Garment;
  color: SockColor;
  pattern: SockPattern;
}

/** Two pairs with the same key look alike: only a left and a right of them belong together. */
export const lookKey = (l: SockLook) => `${l.garment} ${l.color.id} ${l.pattern}`;

/** The most pairs in one wash: 12 socks still fit on a phone; a wash never shows a pattern on two pairs of one colour. */
export const MAX_PAIRS = 6;

/**
 * What tells the pairs apart, from easy to hard:
 * colors – plain socks, every pair its own colour;
 * patterns – a pattern per pair, and every pair still its own colour, so the colour helps;
 * sameColor – a pattern per pair in few colours, so pairs of the same colour sit side by side and only the pattern tells;
 * mixed – two colours times a few patterns, so every pair has one twin with its pattern and others with its colour;
 * mirror – the new laundry (mittens, boots, slippers), a left and a right one per pair, every pair its own colour;
 * twins – the new laundry with every look twice, so two left and two right ones lie alike and only mirrored they fit.
 */
export type SockKind = "colors" | "patterns" | "sameColor" | "mixed" | "mirror" | "twins";

/** The kinds from easy to hard, the order `SOCK_LEVELS` climbs them in. */
export const SOCK_KINDS: SockKind[] = ["colors", "patterns", "sameColor", "mixed", "mirror", "twins"];

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
  { pairs: 3, kind: "mirror", covered: 0 },
  { pairs: 4, kind: "mirror", covered: 1 },
  { pairs: 5, kind: "mirror", covered: 3 },
  { pairs: 4, kind: "twins", covered: 0 },
  { pairs: 4, kind: "twins", covered: 2 },
  { pairs: 6, kind: "twins", covered: 2 },
  { pairs: 6, kind: "twins", covered: 4 },
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

/** The pairs of one wash at `level`; no two look the same, except in `twins`, where every look comes twice. */
export function dealPairs({ pairs, kind }: Pick<SockLevel, "pairs" | "kind">): SockLook[] {
  const colors = shuffle(SOCK_COLORS);
  // Foxes or bears, never both: the two faces are alike enough on a small sock that only one may be in a wash.
  const left = oneOf(["foxes", "bears"] as const);
  const patterns = shuffle(SOCK_PATTERNS.filter((p) => p !== left));
  const sock = (color: SockColor, pattern: SockPattern): SockLook => ({ garment: "sock", color, pattern });
  if (kind === "colors") return colors.slice(0, pairs).map((color) => sock(color, "plain"));
  if (kind === "patterns") return patterns.slice(0, pairs).map((pattern, i) => sock(colors[i], pattern));
  if (kind === "sameColor") {
    // Every colour at least twice: 3 pairs in one colour, 4 in two, 5 in two.
    const used = Math.max(1, Math.floor(pairs / 2));
    return shuffle(patterns.slice(0, pairs).map((pattern, i) => sock(colors[i % used], pattern)));
  }
  if (kind === "mixed") return shuffle(Array.from({ length: pairs }, (_, i) => sock(colors[i % 2], patterns[Math.floor(i / 2)])));
  // The new laundry: its own colour per look, and the garments taking turns, so a wash has mittens, boots and slippers.
  const garments = shuffle(MIRRORED);
  const looks = (count: number) => colors.slice(0, count).map((color, i) => ({ garment: garments[i % garments.length], color, pattern: patterns[i] }));
  if (kind === "mirror") return looks(pairs);
  const twice = looks(pairs / 2);
  return shuffle([...twice, ...twice]);
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
