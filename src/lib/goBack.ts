import { useEffect } from "react";
import { type NavigateFunction, useLocation, useNavigationType } from "react-router";

// Every way back in the app (✕, „Menü“, a menu's arrow, page corner or ribbon) goes to a page the child came from. A
// plain link there would add a new step to the browser's history, so the phone's own back button afterwards led
// forward again, into the game just left – or, after a game replaced itself with its menu, to the same menu once more,
// so that it seemed not to work. So a way back steps back in the history when the page before is where it leads.

/** The pages of this visit by their place in the browser's history (the router's `idx`), kept over a reload. */
const TRAIL_KEY = "tinytaps.trail";

function readTrail(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(TRAIL_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

let trail = readTrail();

/** A step back is on its way (the browser moves through its history a moment later). */
let stepping = false;

/**
 * How long a step back is waited for before the ways back work again without it. The browser reports it (popstate)
 * within a few frames, some ten ms even on a slow phone; half a second is well past that and past a child's hand
 * landing twice, which the wait is there for, and short enough that a grown-up's next tap on ✕ is not lost.
 */
export const STEP_BACK_WAIT_MS = 500;

/** The router's place of the current entry in the browser's history; none outside the router. */
const place = (): number | undefined => {
  const idx = (window.history.state as { idx?: unknown } | null)?.idx;
  return typeof idx === "number" ? idx : undefined;
};

/** Notes the page shown at its place in the history; `pushed` when it was newly opened, which drops what lay ahead of it. */
export function notePage(pathname: string, pushed: boolean) {
  const idx = place();
  if (idx === undefined) return;
  if (pushed) trail = trail.slice(0, idx);
  trail[idx] = pathname;
  try {
    sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail));
  } catch {
    // Storage unavailable: the trail still holds for this page's life.
  }
}

/** Notes each page shown (mounted once, in `App`), so a way back knows the page before. */
export function useHistoryTrail() {
  const { pathname } = useLocation();
  const type = useNavigationType();
  useEffect(() => notePage(pathname, type === "PUSH"), [pathname, type]);
}

/**
 * How many steps back in the history the page `to` lies – the page just before (1), or one further back where a way
 * back skips pages between (the book's ribbon in a menu deeper in a book goes straight back onto the shelf, user
 * request, 28 November 2026) –, or 0 when it isn't there. The trail keeps pages by their path, so a `to` with a question
 * (the trophy room opening on a trophy, `?pokal=`) is matched by its path.
 */
const stepsTo = (to: string) => {
  const idx = place();
  if (idx === undefined) return 0;
  const path = to.replace(/[?#].*$/, "");
  for (let before = idx - 1; before >= 0; before--) if (trail[before] === path) return idx - before;
  return 0;
};

/**
 * The router state a page passes when it opens a game that is to lead back to it, not to the game's own menu: the
 * trophy room's play sign opens a trophy's level (user request, November 2026), and ✕ there goes back into the room,
 * the screen seen before. Unlike a routine's step (`RoutineVisit`) the game plays as it always does, with play time.
 */
export interface BackVisit {
  /** The page to go back to, a path of this app, with its question where it opens on something. */
  backTo: string;
}

/** Where a game opened with `BackVisit` goes back to (from the router's `location.state`); none otherwise. */
export function backFrom(state: unknown): string | undefined {
  const to = (state as Partial<BackVisit> | null)?.backTo;
  // Only a path inside the app: never another site (`//host`).
  return typeof to === "string" && to.startsWith("/") && !to.startsWith("//") ? to : undefined;
}

/**
 * Goes back to `to`, a page the child came from. It replaces the current page at once, so a page turn sees the new
 * page in the same moment, and where `to` lies before in the history, it then steps back onto it (over the pages
 * between, where it lies further back): the page shown stays the same, and the history ends there, as if the pages
 * left had never been opened.
 */
export function goBack(navigate: NavigateFunction, to: string) {
  // A second tap before the step back has landed would step back twice, out of the app.
  if (stepping) return;
  const steps = stepsTo(to);
  navigate(to, { replace: true });
  if (!steps) return;
  stepping = true;
  const landed = () => {
    stepping = false;
    clearTimeout(lost);
    window.removeEventListener("popstate", landed);
  };
  window.addEventListener("popstate", landed);
  // A step back that never lands (no entry before this one after all, a page restored from the browser's cache) must
  // not hold every later way back: ✕ and the corner then did nothing until a reload. The page shown is `to` already
  // (replaced above), so nothing is navigated again – by then the child may have gone on from there.
  const lost = setTimeout(landed, STEP_BACK_WAIT_MS);
  window.history.go(-steps);
}
