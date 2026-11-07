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

/** The kind after `last` in `KIND_ORDER` when all take turns (the first to begin with), or the one kind chosen. */
export function nextKind(last: RoundKind | null, kinds: "all" | RoundKind): RoundKind {
  if (kinds !== "all") return kinds;
  return last === null ? KIND_ORDER[0] : KIND_ORDER[(KIND_ORDER.indexOf(last) + 1) % KIND_ORDER.length];
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
 * its own pair only (`pairs.tsx` keeps it so); the others come from other topics first and each from a topic of its
 * own where there are enough (a sock beside a toothbrush, not beside a shoe's laces), so a wrong one is clearly wrong.
 */
export function dealRound(pair: Pair, pool: Pair[], count: number): TogetherRound {
  // Never one whose partner would fit too, or which this one's partner fits (`alsoFits`, either way round).
  const fits = (a: Pair, b: Pair) => a.alsoFits?.includes(b.id) || b.alsoFits?.includes(a.id);
  const others = shuffle(pool.filter((p) => p !== pair && p.kind === pair.kind && !fits(pair, p)));
  const picked: Pair[] = [];
  const topics = new Set([pair.topic]);
  // First one per other topic, then any other topic, then the pair's own topic if nothing else is left.
  for (const fits of [(p: Pair) => !topics.has(p.topic), (p: Pair) => p.topic !== pair.topic, () => true]) {
    for (const p of others) {
      if (picked.length === count - 1) break;
      if (picked.includes(p) || !fits(p)) continue;
      picked.push(p);
      topics.add(p.topic);
    }
  }
  const choices = shuffle([pair, ...picked]);
  return { kind: pair.kind, pair, choices, correct: choices.indexOf(pair) };
}
