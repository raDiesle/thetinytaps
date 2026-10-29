import type { ShadowItem } from "./content";
import { shuffle } from "./deck";

/** One step of difficulty: how many shadows to choose from, and whether the others come from the picture's own theme. */
export interface ShadowLevel {
  shadows: number;
  /** The other shadows are of the same kind (a cow among animals), so their outlines are closer; else of other kinds. */
  alike: boolean;
}

/** The steps the game climbs (or goes back down) by how the child plays, see `nextLevel`; the first is where it begins. */
export const SHADOW_LEVELS: ShadowLevel[] = [
  { shadows: 2, alike: false },
  { shadows: 3, alike: false },
  { shadows: 3, alike: true },
  { shadows: 4, alike: true },
  { shadows: 5, alike: true },
  { shadows: 6, alike: true },
];

/**
 * The step after a picture, from the wrong shadows tapped in each picture on the current step (newest last): two
 * pictures without one go one up; two in one picture, or one in each of two pictures in a row, go one down. Time
 * plays no part: a slow but sure child climbs too, and nothing asks it to be quick.
 */
export function nextLevel(level: number, misses: number[]): number {
  const last = misses.at(-1);
  if (last === undefined) return level;
  const recent = misses.slice(-2);
  let step = 0;
  if (last >= 2 || (recent.length === 2 && recent.every((m) => m > 0))) step = -1;
  else if (recent.length === 2 && recent.every((m) => m === 0)) step = 1;
  return Math.max(0, Math.min(SHADOW_LEVELS.length - 1, level + step));
}

/** The shadows of one round, `item`'s among them, in random order; the others from `pool` as `level` says. */
export function dealShadows(item: ShadowItem, pool: ShadowItem[], level: ShadowLevel): ShadowItem[] {
  const others = pool.filter((i) => i !== item);
  const alike = shuffle(others.filter((i) => i.theme === item.theme));
  const unlike = shuffle(others.filter((i) => i.theme !== item.theme));
  // With one theme only there are no others of another kind: then they come from the same one.
  const picks = (level.alike ? [...alike, ...unlike] : [...unlike, ...alike]).slice(0, level.shadows - 1);
  return shuffle([item, ...picks]);
}
