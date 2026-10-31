import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router";
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

/**
 * Does `update` (a navigation, a game starting or ending) as the turn of a page in the book look: the sound comes at
 * once, the turn is a view transition round the change (`book.css`). In the toy look, or where a browser can't turn
 * pages, it just does it.
 */
export function turnPageWith(direction: TurnDirection, update: () => void) {
  if (!isBookLook() || !document.startViewTransition) {
    update();
    return;
  }
  playPageTurn(TURN_SECONDS);
  document.documentElement.dataset.turn = direction;
  // A skipped turn (a hidden page, a second tap mid-turn) still makes the change; it only needs no error report.
  document.startViewTransition(() => flushSync(update)).ready.catch(() => {});
}

/**
 * The click handler of a link to another menu, which turns the page there in the book look (the router's own
 * `viewTransition` works only with a data router). Back to the home page, the bookshelf, no page turns: the book
 * closes and goes back on the shelf (bookTravel.ts). A click that opens a new tab is left alone.
 */
export function useTurnPage(to: string, direction: TurnDirection) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (e: MouseEvent) => {
    if (!isBookLook() || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (to === "/") putBookBack(pathname, () => navigate(to));
    else turnPageWith(direction, () => navigate(to));
  };
}
