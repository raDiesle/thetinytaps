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

/** How one picture went: wrong shadows tapped before the right one, and the time it took. */
export interface RoundResult {
  misses: number;
  ms: number;
}

/** Quick enough for a step up, when no shadow was wrong. */
const QUICK_MS = 5000;
/** This slow, the step was too hard. */
const SLOW_MS = 15000;

/**
 * The step after a picture, from the pictures played on the current step (newest last): two quick ones without a
 * miss go one up; two wrong shadows, a long wait, or a miss in two pictures in a row go one down.
 */
export function nextLevel(level: number, results: RoundResult[]): number {
  const last = results.at(-1);
  if (!last) return level;
  const recent = results.slice(-2);
  let step = 0;
  if (last.misses >= 2 || last.ms >= SLOW_MS) step = -1;
  else if (recent.length === 2 && recent.every((r) => r.misses > 0)) step = -1;
  else if (recent.length === 2 && recent.every((r) => r.misses === 0 && r.ms <= QUICK_MS)) step = 1;
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
