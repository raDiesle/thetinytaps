import type { PointerEvent } from "react";
import { codeSoon } from "@/lib/lazyPart";

// Every game page is lazy-loaded (App.tsx), and a page's code is loaded only once the visitor shows they want it: as a
// finger lands on its card or book, as a mouse comes over it, or with the tap itself. Menus loaded the pages behind
// all their cards while they waited once – the shelf every everyday helper's game (about 320 KB gzip), the pictures'
// menu all 23 pictures (about 580 KB) – for every visitor, though most open one or two (user request, November 2026:
// load only what the child picks). The tap waits a moment for the code instead (`pageCodeSoon`), so the page turns to
// the game drawn, not to the loading paper.

/** The loaders of the lazy-loaded pages, by the address they open at (`/zaehne/`); filled by App.tsx. */
const loaders = new Map<string, () => Promise<unknown>>();

/** Tells which page `load` brings, for each of its addresses (with slashes, as the cards link them: `/zaehne/`). */
export function registerPage(paths: string[], load: () => Promise<unknown>) {
  for (const path of paths) loaders.set(path, load);
}

/** The addresses that have a lazy-loaded page. */
export const pagePaths = () => [...loaders.keys()];

/** The address without its query or hash, as pages are registered. */
const pathOf = (href: string) => href.replace(/[?#].*$/, "");

/** Starts loading the page at `href` (a card's link); a page loaded already, or none of ours, costs nothing. */
export function preloadPage(href: string): Promise<unknown> | undefined {
  const loading = loaders.get(pathOf(href))?.();
  loading?.catch(() => {
    // Offline before the worker is there: the tap will show it.
  });
  return loading;
}

/**
 * Resolves once the page at `href` has its code, or after `CODE_WAIT_MS` (lazyPart.ts) – whichever comes first. A tap
 * that turns the page to it waits for this, so the new page is drawn before the turn, and a slow network still gets its
 * turn soon, to the loading paper.
 */
export const pageCodeSoon = (href: string): Promise<unknown> => {
  const loading = preloadPage(href);
  return loading ? codeSoon(loading) : Promise.resolve();
};

/**
 * The handlers that load a card's page as the visitor shows they want it: a finger landing on it, or a mouse coming
 * over it (a touch's own pointerenter comes with the press). Spread onto the card's link.
 */
export function loadOnIntent(href: string) {
  return {
    onPointerDown: () => void preloadPage(href),
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") void preloadPage(href);
    },
  };
}
