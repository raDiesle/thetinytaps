import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { pagesBetween } from "@/content/games";
import { putBookBack } from "@/lib/bookTravel";
import { goBack } from "@/lib/goBack";
import { pageMoves } from "@/lib/pageMotion";
import { holdPreloads } from "@/lib/preloadPages";
import { playPageTurn } from "@/lib/sfx";

/**
 * The way the app's pages turn. The app looks like a picture book, and only like that (user decision, November 2026: the
 * toy-block look it had before is gone, with the address switch and the stored choice that brought it back): its CSS is in
 * `src/styles/book.css`, the home page's bookshelf in Bookshelf.tsx and the way a book is taken out and put back in
 * bookTravel.ts.
 */

/** Where an old visit kept the look it chose (the toy look, or the book): no longer read, removed. */
const OLD_LOOK_KEY = "tinytaps.look.v1";

/** Forgets the look an old visit chose, so nothing saved is left over from the toy look. */
export function forgetOldLook() {
  try {
    localStorage.removeItem(OLD_LOOK_KEY);
  } catch {}
}

/** How long a page takes to turn: as long as `--turn-time` in `book.css` (`look.test.ts` checks), so its sound lands with it. */
export const TURN_SECONDS = 1.6;

/**
 * Which way a page turns. The page seen is always the book's left page, the spine on its right: `forward` (on into a
 * menu or a game) the next page comes over from the right and lies down on it, `back` it lifts at its left edge and
 * turns over to the right, showing the page before.
 */
export type TurnDirection = "forward" | "back";

/** The most pages drawn turning together: a thicker bundle would tell no more. */
const MOST_PAGES = 6;

/** The turn running now, so that a turn cut short by the next one doesn't clear what the next one set. */
let turning = 0;

/**
 * Does `update` (a navigation, a game starting or ending) as the turn of a page: the sound comes at once, the turn is a
 * view transition round the change (`book.css`). Where a browser can't turn pages, it just does it.
 *
 * `pages` more than one (from a game's page back to its book's table of contents, or on to a later game) turns them in
 * one go, as a grown-up takes a bundle of pages at once: under the page that turns, blank sheets of paper fan out a
 * little behind it. The turning page is the app (`#root`, `view-transition-name: turn-page`) in the state that turns – the
 * old one back, the new one forward – and the sheets (`.turn-sheet`) are there in that state only, so they lie between
 * it and the page beneath, which is the rest of the screen (`root`).
 */
export function turnPageWith(direction: TurnDirection, update: () => void, pages = 1) {
  if (!document.startViewTransition) {
    update();
    return;
  }
  playPageTurn(TURN_SECONDS);
  holdPreloads(TURN_SECONDS * 1000 + 200);
  // The page it turns to waits with its voice, songs and animations until it lies still (pageMotion.ts).
  const still = pageMoves();
  const html = document.documentElement;
  const turn = ++turning;
  html.dataset.turn = direction;
  // The shadow band on the page beneath (`.turn-shade`) turns with the page and the sheets, in the same state.
  const shade = document.createElement("div");
  shade.className = "turn-shade";
  const sheets = [shade, ...pageBundle(Math.min(pages, MOST_PAGES) - 1)];
  const show = (on: boolean) => {
    if (on) html.dataset.turning = "";
    else delete html.dataset.turning;
    for (const sheet of sheets) on ? document.body.append(sheet) : sheet.remove();
  };
  show(direction === "back");
  const transition = document.startViewTransition(() => {
    flushSync(update);
    show(direction === "forward");
  });
  // A skipped turn (a hidden page, a second tap mid-turn) still makes the change; it only needs no error report.
  transition.ready.catch(() => {});
  transition.finished.finally(() => {
    for (const sheet of sheets) sheet.remove();
    if (turn === turning) delete html.dataset.turning;
    still();
  });
}

/**
 * The blank sheets turning under the page, `count` of them: the one right under it first, painted last, so it lies on
 * top of the others (each sheet's place in the bundle is its name, `turn-sheet-<n>`, which book.css lags by).
 */
function pageBundle(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const sheet = document.createElement("div");
    sheet.className = "turn-sheet";
    sheet.style.viewTransitionName = `turn-sheet-${count - i}`;
    return sheet;
  });
}

/**
 * The click handler of a link to another menu, which turns the page there (the router's own `viewTransition` works only
 * with a data router): as many pages at once as lie between the two in their book (`pagesBetween`). Back to the home
 * page, the bookshelf, no page turns: the book closes and goes back on the shelf (bookTravel.ts). A way back steps back
 * in the browser's history (`goBack`). A click that opens a new tab is left alone.
 */
export function useTurnPage(to: string, direction: TurnDirection) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    const go = direction === "back" ? () => goBack(navigate, to) : () => navigate(to);
    e.preventDefault();
    if (to === "/") putBookBack(pathname, go);
    else turnPageWith(direction, go, pagesBetween(pathname, to));
  };
}
