import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router";
import { playPageTurn } from "@/lib/sfx";

/**
 * The app's look: „Buch“ (a picture book – a cover to open, paper pages, a page's edge round every game) or the
 * toy-block look it had before. A design concept to try out: `?buch` turns it on, `?buch=aus` off, and the choice is
 * kept for the next visits. The look lives only in CSS (`data-look` on html, `src/styles/book.css`) and in the cover.
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

/**
 * In the book look, a tap that leads to another menu turns the page: forward over to the left, or `back` from the
 * left. The sound comes at once; the turn is a view transition (`book.css`) round the navigation, started here since
 * the router's own `viewTransition` works only with a data router. Returns the click handler for such a link.
 */
export function useTurnPage(to: string, direction: "forward" | "back") {
  const navigate = useNavigate();
  return (e: MouseEvent) => {
    if (!isBookLook()) return;
    playPageTurn();
    if (!document.startViewTransition || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    document.documentElement.dataset.turn = direction;
    // A skipped turn (a hidden page, a second tap mid-turn) still navigates; it only needs no error report.
    document.startViewTransition(() => flushSync(() => navigate(to))).ready.catch(() => {});
  };
}
