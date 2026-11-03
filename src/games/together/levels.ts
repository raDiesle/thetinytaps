import { shuffle } from "@/games/shadows/deck";
import type { Pair } from "./pairs";
import type { Difficulty } from "./settings";

/** The two kinds of rounds: things of the day that belong together (Z-03), helpers and what they need (Z-13). */
export type RoundKind = "pair" | "helper";

/** The kinds take turns in this order. */
export const KIND_ORDER: RoundKind[] = ["pair", "helper"];

/**
 * How many to choose from on each step, which the game climbs (or goes back down) by how the child plays (`nextLevel`
 * from Schatten finden); every visit begins on the first. Harder means more to choose from, never quicker.
 */
export const TOGETHER_LEVELS: number[] = [2, 3, 3, 4, 4];

/** The step a fixed difficulty plays on (chosen behind ⚙️); „Von selbst“ climbs and falls instead. */
export const FIXED_LEVELS: Record<Exclude<Difficulty, "auto">, number> = { easy: 0, medium: 2, hard: TOGETHER_LEVELS.length - 1 };

/** Rounds that count as one game for the play-time limit: three of each kind. */
export const ROUNDS_PER_GAME = 6;

/** The kind after `last` among those switched on, in `KIND_ORDER`; the first one switched on to begin with (all if none is). */
export function nextKind(last: RoundKind | null, on: Record<RoundKind, boolean>): RoundKind {
  const kinds = KIND_ORDER.filter((k) => on[k]);
  const order = kinds.length > 0 ? kinds : KIND_ORDER;
  if (last === null) return order[0];
  const from = KIND_ORDER.indexOf(last);
  return [...KIND_ORDER.slice(from + 1), ...KIND_ORDER.slice(0, from + 1)].find((k) => order.includes(k))!;
}

/** One round: `pair` stands above, and one of `choices` (at `correct`) is its partner; each stands for its own pair. */
export interface TogetherRound {
  kind: RoundKind;
  pair: Pair;
  choices: Pair[];
  correct: number;
}

/**
 * `pair`'s partner among the partners of `count - 1` others of its kind, in random order. Each partner belongs to
 * its own pair only (`pairs.ts` keeps it so), so every other one is a clearly wrong choice.
 */
export function dealRound(pair: Pair, pool: Pair[], count: number): TogetherRound {
  const others = pool.filter((p) => p !== pair && p.kind === pair.kind);
  const choices = shuffle([pair, ...shuffle(others).slice(0, count - 1)]);
  return { kind: pair.kind, pair, choices, correct: choices.indexOf(pair) };
}
