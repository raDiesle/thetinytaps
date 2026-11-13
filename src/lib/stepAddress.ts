// Every page of a story and every scene or round of a game shows in the address as `?seite=…` (user request, November
// 2026: `/abenteuer/schatzinsel/?seite=7`), so a link names the very page and the grown-ups who make the app see how far
// a child got before leaving. The step only replaces the address in place (`history.replaceState`), never a new step in
// the history – the phone's back button still goes back to the menu, not through every page – and goes past the router,
// so turning a page draws nothing again. Umami ignores the part after „?“ (`data-exclude-search`), so a step costs no
// page view of the monthly allowance; instead the time-on-page event „seite“ says which step was shown last and how
// many were shown (`stepOf`, analytics.ts).

import { useEffect } from "react";
import { useLocation } from "react-router";

/** The part of the address that names the step. */
export const STEP_PARAM = "seite";

/** The step shown last on a page, and how many steps that page showed so far. */
interface ShownStep {
  /** The page's address below the router's base, as `PageTime` knows it. */
  pathname: string;
  step: string;
  /** How many steps this page showed, counting each change. */
  count: number;
  /** The game showing it was left: a game played again counts from 1. */
  left?: boolean;
}

let shown: ShownStep | undefined;

/**
 * A step was shown since the app started: the address's step is then the game's own, no longer a link to follow – a
 * game coming next (the next day after „Weiter“) reads the address before the one before has taken its step out.
 */
let linkFollowed = false;

/** The game showing steps on this page was left; its last step stays noted for the page's time. */
function leftSteps(pathname: string) {
  if (shown?.pathname === pathname) shown = { ...shown, left: true };
}

/** Puts `step` into the address in place of the one before (none takes it out), and notes it for the page's time. */
export function showStep(pathname: string, step: string | number | undefined) {
  const value = step === undefined ? undefined : String(step);
  if (value !== undefined) linkFollowed = true;
  if (value !== undefined && (shown?.pathname !== pathname || shown.left || shown.step !== value)) {
    shown = { pathname, step: value, count: shown?.pathname === pathname && !shown.left ? shown.count + 1 : 1 };
  }
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if ((url.searchParams.get(STEP_PARAM) ?? undefined) === value) return;
  if (value === undefined) url.searchParams.delete(STEP_PARAM);
  else url.searchParams.set(STEP_PARAM, value);
  // The router's own state stays, so its place in the history (goBack.ts) is kept.
  window.history.replaceState(window.history.state, "", url);
}

/** The step shown last on this page and how many it showed, for the time-on-page event; none where it showed no step. */
export const stepOf = (pathname: string) => (shown?.pathname === pathname ? { step: shown.step, count: shown.count } : undefined);

/**
 * The step the address named as the page opened (a link to a page of a story), to start there; none without one, and
 * none once a game has shown a step of its own.
 */
export function stepInAddress(): string | undefined {
  if (typeof window === "undefined" || linkFollowed) return undefined;
  return new URLSearchParams(window.location.search).get(STEP_PARAM) ?? undefined;
}

/** The step the address named, as a place from 1 to `count` (a page's number), turned into an index from 0. */
export function stepIndexInAddress(count: number): number | undefined {
  const n = Number(stepInAddress());
  return Number.isInteger(n) && n >= 1 && n <= count ? n - 1 : undefined;
}

/**
 * Keeps `?seite=` in the address on the step shown (a page's number from 1, a scene's id), while it is shown; taken
 * out again when the game is left. Every game that goes through pages, scenes or rounds calls it with the one on screen.
 */
export function useStepAddress(step: string | number | undefined) {
  const { pathname } = useLocation();
  useEffect(() => showStep(pathname, step), [pathname, step]);
  // Left (the game ends, ✕): the address no longer names a step. The step stays noted for the page's time.
  useEffect(
    () => () => {
      showStep(pathname, undefined);
      leftSteps(pathname);
    },
    [pathname],
  );
}
