import type { CSSProperties } from "react";
import { lookAlike, lookOf, PEEK_LOOKALIKES, SHADOW_LOOKALIKES, type ShadowItem } from "./content";
import { shuffle } from "./deck";

/**
 * How `n` choices lie in their rows, for the CSS sizing them as big as the room allows: all side by side (`--n`), and on
 * a phone held upright two to a row while that leaves at most two rows, else three (`--tall-cols`, `--tall-rows`).
 * Shared by Schatten finden and every round of „Was gehört zum Tier?“.
 */
export function choiceRows(n: number): CSSProperties {
  const tallCols = n > 4 ? 3 : Math.min(n, 2);
  return { "--n": n, "--tall-cols": tallCols, "--tall-rows": Math.ceil(n / tallCols) } as CSSProperties;
}

/** One step of difficulty: how many shadows to choose from, and what makes them harder to tell apart or to find. */
export interface ShadowLevel {
  shadows: number;
  /** The other shadows are of the same kind (a cow among animals), so their outlines are closer; else of other kinds. */
  alike: boolean;
  /** The shadows lie turned, each by up to this many degrees to one side or the other: the child has to see a shape turned. */
  turn?: number;
  /** Some shadows lie mirrored, facing the other way than the picture. */
  mirror?: boolean;
  /** The shadows lie under paper flaps, like memory cards: a tap lifts one flap and shows its shadow (the one lifted before
   * goes down again), a tap on the shadow lifted picks it. The child has to remember where it saw which. */
  covered?: boolean;
}

/**
 * The steps the game climbs (or goes back down) by how the child plays, see `nextLevel`; the first is where it begins.
 * First more shadows and closer ones, then new ways to look (user feedback, November 2026: harder, by itself): the
 * shadows lie turned, then mirrored too, then hidden under flaps to remember. Each new way starts again with fewer
 * shadows, so it is a new thing to learn rather than a wall.
 */
export const SHADOW_LEVELS: ShadowLevel[] = [
  { shadows: 2, alike: false },
  { shadows: 3, alike: false },
  { shadows: 3, alike: true },
  { shadows: 4, alike: true },
  { shadows: 5, alike: true },
  { shadows: 6, alike: true },
  { shadows: 4, alike: true, turn: 40 },
  { shadows: 5, alike: true, turn: 40, mirror: true },
  { shadows: 6, alike: true, turn: 60, mirror: true },
  { shadows: 3, alike: true, covered: true },
  { shadows: 4, alike: true, covered: true, turn: 40 },
  { shadows: 5, alike: true, covered: true, turn: 40, mirror: true },
  { shadows: 6, alike: true, covered: true, turn: 60, mirror: true },
];

/**
 * The first steps a child who knows the game leaves after one picture without a wrong shadow, not two: so it soon
 * reaches the steps that ask something of it, and the game finds where it stands by itself.
 */
export const QUICK_STEPS = 3;

/** How a shadow lies: turned by `angle` degrees, and mirrored or not. */
export interface ShadowPose {
  angle: number;
  flip: boolean;
}

/**
 * How each of `n` shadows lies on `level`: turned by at least half its `turn` and at most all of it, to either side
 * (so a turned one is plainly turned), and mirrored by chance where it says `mirror` – at least one of them, so the
 * step shows what it is about. Straight and unmirrored where the level says nothing.
 */
export function poseShadows(n: number, level: ShadowLevel, random = Math.random): ShadowPose[] {
  const poses = Array.from({ length: n }, () => {
    const turn = level.turn ?? 0;
    const angle = turn ? Math.round((turn / 2 + (random() * turn) / 2) * (random() < 0.5 ? -1 : 1)) : 0;
    return { angle, flip: !!level.mirror && random() < 0.5 };
  });
  if (level.mirror && n > 0 && !poses.some((p) => p.flip)) poses[Math.floor(random() * n)].flip = true;
  return poses;
}

/**
 * The step after a picture, from the wrong shadows tapped in each picture on the current step (newest last): two
 * pictures without one go one up; two in one picture, or one in each of two pictures in a row, go one down. Time
 * plays no part: a slow but sure child climbs too, and nothing asks it to be quick. `top` is the last step; "Was gehört
 * zum Tier?" climbs its own steps by the same rule. Below step `quick` one picture without a wrong shadow is enough.
 */
export function nextLevel(level: number, misses: number[], top = SHADOW_LEVELS.length - 1, quick = 0): number {
  const last = misses.at(-1);
  if (last === undefined) return level;
  if (level < quick && last === 0) return Math.min(top, level + 1);
  const recent = misses.slice(-2);
  let step = 0;
  if (last >= 2 || (recent.length === 2 && recent.every((m) => m > 0))) step = -1;
  else if (recent.length === 2 && recent.every((m) => m === 0)) step = 1;
  return Math.max(0, Math.min(top, level + step));
}

/**
 * The shadows of one round, `item`'s among them, in random order; the others from `pool` as `level` says, never one
 * whose shadow looks like `item`'s (`SHADOW_LOOKALIKES`).
 */
export function dealShadows(item: ShadowItem, pool: ShadowItem[], level: ShadowLevel): ShadowItem[] {
  const others = pool.filter((i) => i !== item && !lookAlike(SHADOW_LOOKALIKES, i, item));
  const alike = shuffle(others.filter((i) => i.theme === item.theme));
  const unlike = shuffle(others.filter((i) => i.theme !== item.theme));
  // With one theme only there are no others of another kind: then they come from the same one.
  const picks = (level.alike ? [...alike, ...unlike] : [...unlike, ...alike]).slice(0, level.shadows - 1);
  return shuffle([item, ...picks]);
}

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

/**
 * The steps of „Wer schaut da raus?“, climbed by the same rule as the shadows' (`nextLevel`, on the rounds of this
 * kind only) while the two kinds take turns: more animals to choose from and less to see, never quicker.
 */
export const PEEK_LEVELS: PeekLevel[] = [
  { choices: 2, show: 0.5, alike: false },
  { choices: 3, show: 0.42, alike: false },
  { choices: 3, show: 0.32, alike: true },
  { choices: 4, show: 0.3, alike: true },
  { choices: 4, show: 0.22, alike: true },
  { choices: 5, show: 0.22, alike: true, holes: { count: 3, r: 34 } },
  { choices: 5, show: 0.18, alike: true, holes: { count: 2, r: 30 } },
];

/**
 * The whole animals to choose from when `item` peeks out, in random order; the others as `level` says, never one whose
 * peeking part looks like `item`'s (`PEEK_LOOKALIKES`).
 */
export function dealPeek(item: ShadowItem, pool: ShadowItem[], level: PeekLevel): ShadowItem[] {
  const others = pool.filter((i) => i !== item && !lookAlike(PEEK_LOOKALIKES, i, item));
  const alike = shuffle(others.filter((i) => lookOf(i) === lookOf(item)));
  const unlike = shuffle(others.filter((i) => lookOf(i) !== lookOf(item)));
  return shuffle([item, ...(level.alike ? [...alike, ...unlike] : unlike).slice(0, level.choices - 1)]);
}
