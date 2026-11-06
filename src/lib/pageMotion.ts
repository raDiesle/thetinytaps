import { useSyncExternalStore } from "react";

/*
 * While a book is taken out of the shelf and opens (bookTravel.ts) or a page turns (look.ts), the game or menu it leads
 * to is already drawn underneath, so the page shows it as it moves – but nothing of it may start yet: no voice, no
 * song, no animation, no story running on (user feedback, November 2026: Aufs Töpfchen and Zähne putzen talked and
 * moved while the book was still opening). Everything that starts by itself waits here until the page lies still.
 * The CSS half is `html[data-page-moving] .play-area *` in book.css, which holds a game's CSS animations meanwhile.
 */

/** The longest a motion can hold things back, should its end never be reported (a skipped view transition). */
const LONGEST_MS = 5000;

/** Motions running now; nothing starts while there is one. */
let running = 0;
const listeners = new Set<() => void>();

function changed() {
  const html = typeof document === "undefined" ? null : document.documentElement;
  if (html) {
    if (running > 0) html.dataset.pageMoving = "";
    else delete html.dataset.pageMoving;
  }
  for (const listener of [...listeners]) listener();
}

/**
 * Marks a book or page as moving from now on; call the returned function when it lies still again (once is enough,
 * more calls do nothing). Call it before the change of screen it moves round, so the new screen already waits.
 */
export function pageMoves(): () => void {
  running++;
  changed();
  let ended = false;
  const end = () => {
    if (ended) return;
    ended = true;
    clearTimeout(cap);
    running--;
    changed();
  };
  const cap = setTimeout(end, LONGEST_MS);
  return end;
}

/** True while a book opens or closes or a page turns. */
export const pageMoving = () => running > 0;

/**
 * Runs `run` once nothing moves: at once when nothing does, else when the motion has ended. Returns a function that
 * cancels it (an effect's cleanup).
 */
export function afterPageMotion(run: () => void): () => void {
  if (!pageMoving()) {
    run();
    return () => {};
  }
  const listener = () => {
    if (pageMoving()) return;
    listeners.delete(listener);
    run();
  };
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Resolves once nothing moves (at once when nothing does). */
export const pageStill = () => new Promise<void>((resolve) => afterPageMotion(resolve));

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** For components: false while a book or page moves, true once it lies still. */
export function usePageStill() {
  return useSyncExternalStore(
    subscribe,
    () => !pageMoving(),
    () => true,
  );
}
