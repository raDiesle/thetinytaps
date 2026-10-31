import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { pagesBetween } from "@/content/games";
import { putBookBack } from "@/lib/bookTravel";
import { playPageTurn } from "@/lib/sfx";

/**
 * The app's look: „Buch“ (picture books on a shelf – one to take out, paper pages, a page's edge round every game) or the
 * toy-block look it had before. The book is the default: `?buch=aus` turns it off, `?buch` on again, and the choice is
 * kept for the next visits. The look lives in CSS (`data-look` on html, `src/styles/book.css`), the home page's
 * bookshelf (Bookshelf.tsx) and the way a book is taken out and put back (bookTravel.ts).
 */
export type Look = "book" | "toy";

const KEY = "tinytaps.look.v1";

/** The look asked for in the address, saved for later visits; else the saved one; else the book. */
function chosenLook(): Look {
  const asked = new URLSearchParams(location.search).get("buch");
  try {
    if (asked !== null) {
      const look: Look = asked === "aus" || asked === "0" ? "toy" : "book";
      localStorage.setItem(KEY, look);
      return look;
    }
    return localStorage.getItem(KEY) === "toy" ? "toy" : "book";
  } catch {
    return "book";
  }
}

/** Puts the chosen look on html, before the first screen shows. */
export function applyLook() {
  document.documentElement.dataset.look = chosenLook();
}

/** Whether the app looks like a book. */
export const isBookLook = () => document.documentElement.dataset.look === "book";

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
 * Does `update` (a navigation, a game starting or ending) as the turn of a page in the book look: the sound comes at
 * once, the turn is a view transition round the change (`book.css`). In the toy look, or where a browser can't turn
 * pages, it just does it.
 *
 * `pages` more than one (from a game's page back to its book's table of contents, or on to a later game) turns them in
 * one go, as a grown-up takes a bundle of pages at once: under the page that turns, blank sheets of paper fan out a
 * little behind it. The turning page is the app (`#root`, `view-transition-name: turn-page`) in the state that turns – the
 * old one back, the new one forward – and the sheets (`.turn-sheet`) are there in that state only, so they lie between
 * it and the page beneath, which is the rest of the screen (`root`).
 */
export function turnPageWith(direction: TurnDirection, update: () => void, pages = 1) {
  if (!isBookLook() || !document.startViewTransition) {
    update();
    return;
  }
  playPageTurn(TURN_SECONDS);
  const html = document.documentElement;
  const turn = ++turning;
  html.dataset.turn = direction;
  const sheets = pageBundle(Math.min(pages, MOST_PAGES) - 1);
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
 * The click handler of a link to another menu, which turns the page there in the book look (the router's own
 * `viewTransition` works only with a data router): as many pages at once as lie between the two in their book
 * (`pagesBetween`). Back to the home page, the bookshelf, no page turns: the book closes and goes back on the shelf
 * (bookTravel.ts). A click that opens a new tab is left alone.
 */
export function useTurnPage(to: string, direction: TurnDirection) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (e: MouseEvent) => {
    if (!isBookLook() || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (to === "/") putBookBack(pathname, () => navigate(to));
    else turnPageWith(direction, () => navigate(to), pagesBetween(pathname, to));
  };
}
