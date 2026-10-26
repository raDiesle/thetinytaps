import type { Localized } from "@/lib/language";
import { RUSSIAN_TEXTS } from "./content.ru";
import type { SockMode } from "./settings";

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

/** In "Muster" only these colours are used, so two pairs share one and the pattern makes the difference. */
const PATTERN_COLORS = ["red", "blue", "green"];

/** A new list with the same items in random order. */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** `count` pairs that all look different from each other. */
export function dealPairs(mode: SockMode, count: number): SockLook[] {
  if (mode === "colors")
    return shuffle(SOCK_COLORS)
      .slice(0, count)
      .map((color) => ({ color, pattern: "plain" }));
  const colors = shuffle(SOCK_COLORS.filter((c) => PATTERN_COLORS.includes(c.id)));
  return shuffle(SOCK_PATTERNS)
    .slice(0, count)
    .map((pattern, i) => ({ color: colors[i % colors.length], pattern }));
}

/** One of `list`, at random. */
export const oneOf = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** What is said (only with "Vorlesen" on) and shown, in one language. */
export interface SockTexts {
  start: string;
  /** Praise for a pair found; one of them, at random. */
  pair: string[];
  done: string;
  /** "3 Paare", on the start screen and the „Weiter“ button. */
  pairs: (n: number) => string;
  /** For screen readers: the sock at place `n` (from 1) on the floor. */
  sock: (n: number) => string;
}

const GERMAN_TEXTS: SockTexts = {
  start: "Such zwei gleiche Socken!",
  pair: ["Ein Paar!", "Die passen zusammen!", "Gleich und gleich!", "Zwei gleiche!"],
  done: "Alle Socken hängen auf der Leine!",
  pairs: (n) => `${n} ${n === 1 ? "Paar" : "Paare"}`,
  sock: (n) => `Socke ${n}`,
};

/** The texts by app language: `pick(SOCK_TEXTS, language.id)`; the Russian ones are in content.ru.ts. */
export const SOCK_TEXTS: Localized<SockTexts> = { de: GERMAN_TEXTS, ru: RUSSIAN_TEXTS };
