import type { EnglishFirst } from "@/lib/language";

// „Counting Tower“ (idea L-18), a game of the book „Buchstaben & Zahlen“: its name, its line, its goals' names and what
// grown-ups find behind ⚙️ stand here in its own folder, so its row in the language table answers for them. New, so
// English first and English only until translations are asked for (root CLAUDE.md, Language) – German included.

/** The game's name in the book's table of contents and in the browser tab. */
export const TOWER_TITLE: EnglishFirst = { en: "Counting Tower" };

/** Its line for grown-ups in the book's table of contents. */
export const TOWER_BLURB: EnglishFirst = { en: "Block by block up to a hundred" };

/** The count goes to a hundred, ten blocks a round. */
export const TOTAL = 100;
export const BLOCKS = 10;

/**
 * What waits up there in each round of ten, from the morning meadow to the night sky: each with its own end picture and
 * its own trophy. The higher the numbers, the higher and later it gets, up to the moon at a hundred.
 */
export type GoalId = "balloon" | "nest" | "plane" | "cloud" | "rainbow" | "kite" | "bird" | "hotair" | "owl" | "moon";

/** The goals of the rounds in order: blocks 1–10 the balloon, 11–20 the nest … 91–100 the moon. */
export const GOAL_ORDER: GoalId[] = ["balloon", "nest", "plane", "cloud", "rainbow", "kite", "bird", "hotair", "owl", "moon"];

/** Each goal's name, for „Weiter“ and the plate under its trophy. */
export const GOAL_NAMES: Record<GoalId, EnglishFirst> = {
  balloon: { en: "The red balloon" },
  nest: { en: "Back to the nest" },
  plane: { en: "The paper plane" },
  cloud: { en: "Onto a cloud" },
  rainbow: { en: "Down the rainbow" },
  kite: { en: "The kite" },
  bird: { en: "On the big bird" },
  hotair: { en: "The hot-air balloon" },
  owl: { en: "The little owl" },
  moon: { en: "Up to the moon" },
};

/** „one hundred!“, the last number word, which the two-digit words don't have. */
export const HUNDRED: EnglishFirst = { en: "one hundred!" };

/** Behind ⚙️ while playing: start again from 1, or start at any number and count on from there (user request). */
export const OPTION_TEXTS = {
  intro: { en: "Hold ⚙️ to start again or at any number" },
  group: { en: "Counting" },
  startAt: { en: "Start at" },
  again: { en: "Start again" },
  fromOne: { en: "From 1" },
} satisfies Record<string, EnglishFirst>;
