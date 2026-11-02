import { lookOf, type ShadowItem } from "@/games/shadows/content";
import { shuffle } from "@/games/shadows/deck";
import { wrongFoods, wrongHomes, type Animal, type Food } from "./content";
import { HOMES, type Home } from "./homes";
import type { Difficulty } from "./settings";

/** The three kinds of rounds: who peeks out of the bush (X-04), feeding (N-08), who lives where (N-09). */
export type RoundKind = "peek" | "feed" | "home";

/** The kinds take turns in this order, starting with the easiest: who peeks out. */
export const KIND_ORDER: RoundKind[] = ["peek", "feed", "home"];

/** How "Wer schaut da raus?" is played on a step. */
export interface PeekLevel {
  /** Whole animals to choose from below. */
  choices: number;
  /** The share of the animal that peeks out of the bush or the pond. */
  show: number;
  /** The other animals look like the hidden one (`PEEK_LOOKS`); else they look quite different. */
  alike: boolean;
  /**
   * The animal hides wholly behind the bush and shows only through this many round gaps in its leaves, `r` stage
   * units wide each. Out of the pond it still peeks out, by `show`.
   */
  holes?: { count: number; r: number };
}

/** One step of difficulty. */
export interface AnimalLevel {
  /** Foods or homes to choose from when feeding or looking for a home. */
  choices: number;
  peek: PeekLevel;
}

/**
 * The steps the game climbs (or goes back down) by how the child plays (`nextLevel` from Schatten finden: two rounds
 * without a wrong pick go up, a wrong pick in two rounds or two in one go down); every visit begins on the first.
 * Harder means more to choose from and less to see, never quicker.
 */
export const ANIMAL_LEVELS: AnimalLevel[] = [
  { choices: 2, peek: { choices: 2, show: 0.5, alike: false } },
  { choices: 3, peek: { choices: 3, show: 0.42, alike: false } },
  { choices: 3, peek: { choices: 3, show: 0.32, alike: true } },
  { choices: 4, peek: { choices: 4, show: 0.3, alike: true } },
  { choices: 4, peek: { choices: 4, show: 0.22, alike: true } },
  { choices: 4, peek: { choices: 5, show: 0.22, alike: true, holes: { count: 3, r: 34 } } },
  { choices: 4, peek: { choices: 5, show: 0.18, alike: true, holes: { count: 2, r: 30 } } },
];

/** The step a fixed difficulty plays on (chosen behind ⚙️); „Von selbst“ climbs and falls instead. */
export const FIXED_LEVELS: Record<Exclude<Difficulty, "auto">, number> = { easy: 0, medium: 3, hard: ANIMAL_LEVELS.length - 1 };

/** The kind after `last` among those switched on, in `KIND_ORDER`; the first one switched on to begin with (all if none is). */
export function nextKind(last: RoundKind | null, on: Record<RoundKind, boolean>): RoundKind {
  const kinds = KIND_ORDER.filter((k) => on[k]);
  const order = kinds.length > 0 ? kinds : KIND_ORDER;
  if (last === null) return order[0];
  const from = KIND_ORDER.indexOf(last);
  return [...KIND_ORDER.slice(from + 1), ...KIND_ORDER.slice(0, from + 1)].find((k) => order.includes(k))!;
}

/** A feeding round: `animal` is hungry, one of `foods` (at `correct`) is its own. */
export interface FeedRound {
  kind: "feed";
  animal: Animal;
  foods: Food[];
  correct: number;
}

/** A home round: `animal` looks for its home among `homes`. */
export interface HomeRound {
  kind: "home";
  animal: Animal;
  homes: Home[];
  correct: number;
}

/** The foods of a feeding round, `animal`'s own among `count` it doesn't eat (`wrongFoods`), in random order. */
export function dealFeed(animal: Animal, count: number): FeedRound {
  const right = animal.food!;
  const foods = shuffle([right, ...shuffle(wrongFoods(animal)).slice(0, count - 1)]);
  return { kind: "feed", animal, foods, correct: foods.indexOf(right) };
}

/** The homes of a home round, `animal`'s own among `count` it doesn't live in (`wrongHomes`), in random order. */
export function dealHome(animal: Animal, count: number): HomeRound {
  const right = HOMES[animal.home!];
  const homes = shuffle([right, ...shuffle(wrongHomes(animal)).slice(0, count - 1)]);
  return { kind: "home", animal, homes, correct: homes.indexOf(right) };
}

/** The whole animals to choose from when `item` peeks out, in random order; the others as `level` says. */
export function dealPeek(item: ShadowItem, pool: ShadowItem[], level: PeekLevel): ShadowItem[] {
  const others = pool.filter((i) => i !== item);
  const alike = shuffle(others.filter((i) => lookOf(i) === lookOf(item)));
  const unlike = shuffle(others.filter((i) => lookOf(i) !== lookOf(item)));
  return shuffle([item, ...(level.alike ? [...alike, ...unlike] : unlike).slice(0, level.choices - 1)]);
}
