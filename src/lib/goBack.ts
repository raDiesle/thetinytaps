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

/** Whether the page before this one in the history is `to`, so going back there is a step back. */
export const cameFrom = (to: string) => {
  const idx = place();
  return idx !== undefined && idx > 0 && trail[idx - 1] === to;
};

/**
 * Goes back to `to`, a page the child came from. It replaces the current page at once, so a page turn sees the new
 * page in the same moment, and where the page before in the history is `to`, it then steps back onto it: the page
 * shown stays the same, and the history ends there, as if the page left had never been opened.
 */
export function goBack(navigate: NavigateFunction, to: string) {
  // A second tap before the step back has landed would step back twice, out of the app.
  if (stepping) return;
  const step = cameFrom(to);
  navigate(to, { replace: true });
  if (!step) return;
  stepping = true;
  window.addEventListener("popstate", () => (stepping = false), { once: true });
  window.history.go(-1);
}
