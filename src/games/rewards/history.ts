/**
 * ↶ Rückgängig and ↷ Wiederholen while a chart is made or changed (user feedback, November 2026): the charts before and
 * after the one shown, as pure stacks, so `ChartEditor` only keeps them and the rules can be tested.
 */

/** The charts before the one shown (`past`, newest last) and the ones undone after it (`future`, next last). */
export interface History<T> {
  past: T[];
  future: T[];
}

/** How many changes can be undone; older ones drop out. */
export const HISTORY_LIMIT = 60;

/** Nothing to undo or redo yet. */
export const emptyHistory = <T>(): History<T> => ({ past: [], future: [] });

/**
 * A change was made: `before` joins the past and nothing can be redone any more. With `merge` (the next letter typed
 * into the same name) the change joins the one before it, so one ↶ takes the whole word back, not a letter.
 */
export function record<T>(history: History<T>, before: T, merge = false): History<T> {
  if (merge && history.past.length > 0) return { past: history.past, future: [] };
  return { past: [...history.past, before].slice(-HISTORY_LIMIT), future: [] };
}

/** ↶: the chart before `current`, with `current` waiting to be redone; null when there is nothing to undo. */
export function undo<T>(history: History<T>, current: T): { history: History<T>; value: T } | null {
  const value = history.past.at(-1);
  if (value === undefined) return null;
  return { value, history: { past: history.past.slice(0, -1), future: [...history.future, current] } };
}

/** ↷: the chart undone last, with `current` back in the past; null when nothing was undone. */
export function redo<T>(history: History<T>, current: T): { history: History<T>; value: T } | null {
  const value = history.future.at(-1);
  if (value === undefined) return null;
  return { value, history: { past: [...history.past, current], future: history.future.slice(0, -1) } };
}
