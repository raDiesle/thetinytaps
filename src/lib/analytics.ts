// What grown-ups want to know about how the app is used – which games are played and liked, how long each page is
// looked at, which options are chosen – sent to Umami Cloud, which sets no cookies and needs no consent banner (user
// decision, November 2026; research „besucher-verhalten“). The build adds Umami's script (its website id in
// tools/build.ts), counting only on the site's own domain, so the dev server, the preview and local builds send
// nothing. Umami counts every page shown by itself (where visits begin and end, how many leave after one page, how
// long a visit lasts); the events here add what it can't see. Everything goes through `track`, so another tool could
// take Umami's place here alone. Only coarse facts are sent – which page or game, how long, which option – never
// anything a child typed or chose that could tell who it is. This file imports nothing of the app, so the language,
// options and install code can all report through it without a circle of imports.

import { useEffect } from "react";
import { useLocation } from "react-router";

/** Umami's tracker, there once its script has loaded. */
interface Umami {
  track(name: string, data?: Record<string, string | number>): void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

/** The kinds of event sent, each named in the Datenschutzerklärung; see `track`. */
export type EventName =
  /** How long a page was on screen: games and menus alike. */
  | "seite"
  /** The end of a level or story was reached (GameEnd shows). */
  | "ende"
  /** At the end, „Nochmal“ was tapped: the same level once more – a sign the child liked it. */
  | "nochmal"
  /** At the end, „Weiter“ was tapped: on to the next level. */
  | "weiter"
  /** The day's play time ran out while playing, and the game said good night. */
  | "gute-nacht"
  /** A grown-up gave a little more play time behind the lock. */
  | "mehr-spielzeit"
  /** A grown-up changed an option for all games (language, music, figure, how ✕ leaves, play time limit). */
  | "einstellung"
  /** The app was installed onto the home screen. */
  | "installiert";

/** Sends one event, when Umami is there; otherwise (dev server, blocked script) does nothing. */
export function track(name: EventName, data?: Record<string, string | number>) {
  try {
    window.umami?.track(name, data);
  } catch {
    // Counting must never break a game.
  }
}

/** Shorter stretches on a page are passing through (a menu tapped past, a game left at once) and not sent. */
export const MIN_PAGE_MS = 3_000;

/** A time in steps grown-ups can compare at a glance, the same in every report. */
export function durationStep(ms: number): string {
  const minutes = ms / 60_000;
  if (minutes < 1) return "unter 1 Min";
  if (minutes < 3) return "1–3 Min";
  if (minutes < 10) return "3–10 Min";
  if (minutes < 20) return "10–20 Min";
  return "über 20 Min";
}

/** Opened from the home screen rather than in a browser tab (as `isStandalone` in pwa.ts, which can't be imported here). */
const installed = () =>
  typeof matchMedia === "function" &&
  (matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

/**
 * Measures how long each page is on screen and sends it as one event „seite“ when the page changes – or when the app
 * goes into the background (a phone laid aside, a tab closed), since nothing may come after that. Time in the
 * background doesn't count; coming back starts a new stretch. Mounted once, inside the router (`index.tsx`).
 */
export function PageTime() {
  const { pathname } = useLocation();
  useEffect(() => {
    let since: number | undefined = document.visibilityState === "visible" ? performance.now() : undefined;
    const send = () => {
      if (since === undefined) return;
      const ms = performance.now() - since;
      since = undefined;
      if (ms < MIN_PAGE_MS) return;
      track("seite", {
        // Below the router's base (/en/…), so the same game is one page in every language; `sprache` tells them apart.
        seite: pathname,
        dauer: durationStep(ms),
        sekunden: Math.round(ms / 1000),
        sprache: document.documentElement.lang || "de",
        app: installed() ? "installiert" : "browser",
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") since ??= performance.now();
      else send();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      send();
    };
  }, [pathname]);
  return null;
}
