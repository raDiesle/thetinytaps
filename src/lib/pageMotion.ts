import { useSyncExternalStore } from "react";

/*
 * While a book is taken out of the shelf and opens (bookTravel.ts) or a page turns (look.ts), the game or menu it leads
 * to is already drawn underneath, so the page shows it as it moves – but nothing of it may start yet: no voice, no
 * song, no animation, no story running on (user feedback, November 2026: Aufs Töpfchen and Zähne putzen talked and
 * moved while the book was still opening). Everything that starts by itself waits here until the page lies still.
 * The CSS half is `html[data-page-moving] .play-area *` in book.css, which holds a game's CSS animations meanwhile –
 * all but the pictures' entrances (`pop-in`), which are shown over at once, so the page moves in whole: a picture held
 * invisible on its first frame left its question and names standing alone on the page (`isEntrance`).
 */

/** The longest a motion can hold things back, should its end never be reported (a skipped view transition). */
const LONGEST_MS = 5000;

/** Motions running now; nothing starts while there is one. */
let running = 0;
const listeners = new Set<() => void>();

/** An animation this short (delay and run together) that starts invisible is a picture coming in, not a story. */
export const ENTRANCE_MS = 1000;

/** What `isEntrance` needs of an animation's effect: its timing and its first keyframe. */
export interface EffectLike {
  getComputedTiming: () => { endTime?: number | CSSNumericValue };
  getKeyframes: () => Record<string, unknown>[];
}

/**
 * Whether an animation (its `effect`) brings a picture in: it starts invisible (`opacity: 0`, as `pop-in` does) and is
 * over within `ENTRANCE_MS`. Held on its first frame while the page moves, the picture would be missing from the page,
 * while the texts round it (a question under it, the note in the corner) stand there already (user feedback, November
 * 2026, Was gehört zum Tier?).
 */
export function isEntrance(effect: EffectLike | null) {
  if (!effect) return false;
  const end = Number(effect.getComputedTiming().endTime);
  return Number.isFinite(end) && end <= ENTRANCE_MS && String(effect.getKeyframes()[0]?.opacity) === "0";
}

/** Shows the pictures of a game's page whole while it moves: their entrances are over at once, never played after it. */
function showEntrances() {
  if (typeof document === "undefined" || typeof document.getAnimations !== "function") return;
  for (const animation of document.getAnimations()) {
    const effect = animation.effect as KeyframeEffect | null;
    if (animation.playState !== "finished" && effect?.target?.closest(".play-area") && isEntrance(effect)) animation.finish();
  }
}

/** While the page moves, every frame shows what has just come onto it whole (a round may come mid-motion). */
function showEntrancesWhileMoving() {
  if (running === 0 || typeof requestAnimationFrame !== "function") return;
  showEntrances();
  requestAnimationFrame(showEntrancesWhileMoving);
}

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
  if (running === 1) showEntrancesWhileMoving();
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
