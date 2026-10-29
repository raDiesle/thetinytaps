import { useCallback, useRef } from "react";

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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
