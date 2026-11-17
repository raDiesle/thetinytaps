import { type CSSProperties, useCallback, useRef } from "react";
import { shuffle } from "./random";

/**
 * What the games of rounds share – a picture, a few things to choose from, then the next (Erkennen, Was gehört zum
 * Tier?, Was gehört zusammen?): what comes next, how hard it is, and how the choices lie. It began in Erkennen and lives
 * here so no game has to import another one for it.
 */

/**
 * Draws from `pool` in random order: all of them before one comes again, and never the same one twice in a row.
 * A new `pool` (another kind of pictures) starts a new deck, so nothing of the old one comes any more.
 */
export function useDeck<T>(pool: T[]) {
  const deck = useRef<T[]>([]);
  const last = useRef<T | null>(null);
  const dealtFrom = useRef(pool);

  return useCallback(() => {
    if (dealtFrom.current !== pool) {
      dealtFrom.current = pool;
      deck.current = [];
    }
    if (deck.current.length === 0) deck.current.push(...shuffle(pool));
    let next = deck.current.pop()!;
    if (next === last.current && deck.current.length > 0) {
      const other = deck.current.pop()!;
      deck.current.unshift(next);
      next = other;
    }
    last.current = next;
    return next;
  }, [pool]);
}

/**
 * The step after a round, from the wrong choices tapped in each round on the current step (newest last): two rounds
 * without one go one up; two in one round, or one in each of two rounds in a row, go one down. Time plays no part: a
 * slow but sure child climbs too, and nothing asks it to be quick. `top` is the game's last step. Below step `quick`
 * one round without a wrong choice is enough.
 */
export function nextLevel(level: number, misses: number[], top: number, quick = 0): number {
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
 * How `n` choices lie in their rows, for the CSS sizing them as big as the room allows: all side by side (`--n`), and on
 * a phone held upright two to a row while that leaves at most two rows, else three (`--tall-cols`, `--tall-rows`).
 */
export function choiceRows(n: number): CSSProperties {
  const tallCols = n > 4 ? 3 : Math.min(n, 2);
  return { "--n": n, "--tall-cols": tallCols, "--tall-rows": Math.ceil(n / tallCols) } as CSSProperties;
}
