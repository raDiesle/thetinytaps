import { useEffect, useState } from "react";

/** What `later` hands back: `clearTimeout` takes it, to drop that one timeout early. */
export type Timer = ReturnType<typeof setTimeout>;

/** Timeouts kept together, so all that still wait can be dropped at once. */
export interface Timers {
  /** Calls `fn` after `ms`, unless `clearAll` (or `clearTimeout` of what it returns) comes first. */
  later: (fn: () => void, ms: number) => Timer;
  /** Drops every timeout still waiting. */
  clearAll: () => void;
}

/** A set of timeouts that remembers which still wait; the part of `useTimers` that needs no component. */
export function timerSet(): Timers {
  const pending = new Set<Timer>();
  return {
    later(fn, ms) {
      const timer = setTimeout(() => {
        pending.delete(timer);
        fn();
      }, ms);
      pending.add(timer);
      return timer;
    },
    clearAll() {
      pending.forEach(clearTimeout);
      pending.clear();
    },
  };
}

/**
 * Timeouts that end with the component: `later(fn, ms)` instead of a bare `setTimeout`, wherever what waits makes a
 * sound, says a line or ends a level. A bare one still fired after ✕ – a level's end tune and its trophy came in the
 * menu when a grown-up left right after the last ball. `later` and `clearAll` stay the same from render to render.
 */
export function useTimers(): Timers {
  const [timers] = useState(timerSet);
  useEffect(() => timers.clearAll, [timers]);
  return timers;
}
