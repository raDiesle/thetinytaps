import { useEffect } from "react";
import { savesData } from "@/lib/pwa";

// Every game page is lazy-loaded (App.tsx), so tapping its card used to download and run its whole chunk first, while
// the menu stood still. A menu loads the pages behind its cards while it waits for the tap instead.

/** The loaders of the lazy-loaded pages, by the address they open at (`/zaehne/`); filled by App.tsx. */
const loaders = new Map<string, () => Promise<unknown>>();

/** Tells which page `load` brings, for each of its addresses (with slashes, as the cards link them: `/zaehne/`). */
export function registerPage(paths: string[], load: () => Promise<unknown>) {
  for (const path of paths) loaders.set(path, load);
}

/** The addresses that have a lazy-loaded page. */
export const pagePaths = () => [...loaders.keys()];

/** Starts loading the page at `href` (a card's link); a page loaded already, or none of ours, costs nothing. */
export function preloadPage(href: string) {
  void loaders
    .get(href)?.()
    .catch(() => {
      // Offline before the worker is there: the tap will show it.
    });
}

/** Until when nothing is preloaded (`performance.now()` ms): while a book flies or a page turns. */
let quietUntil = 0;

/**
 * Holds preloading back for `ms` while something moves across the screen: running a page's code takes the main thread
 * for a long frame (a game's chunk took 50–60 ms on a slow phone), which stuttered a book taken out of the shelf.
 */
export function holdPreloads(ms: number) {
  quietUntil = Math.max(quietUntil, performance.now() + ms);
}

/**
 * For menus: once the menu is shown and the browser has nothing else to do, loads the pages behind its cards one
 * by one, each in an idle moment of its own, so a tap shows the next screen at once and never waits long for one.
 */
export function usePreloadPages(hrefs: string[]) {
  const key = hrefs.join(" ");
  useEffect(() => {
    let handle = 0;
    let timer = 0;
    const queue = key.split(" ").filter((href) => loaders.has(href));
    const idle = (task: () => void) =>
      typeof requestIdleCallback === "function" ? requestIdleCallback(task, { timeout: 2000 }) : window.setTimeout(task, 200);
    const cancel = (id: number) => (typeof cancelIdleCallback === "function" ? cancelIdleCallback(id) : clearTimeout(id));
    const next = () => {
      const wait = quietUntil - performance.now();
      if (wait > 0) {
        timer = window.setTimeout(() => (handle = idle(next)), wait);
        return;
      }
      const href = queue.shift();
      if (!href) return;
      void loaders
        .get(href)?.()
        .catch(() => {})
        .finally(() => {
          handle = idle(next);
        });
    };
    const start = () => {
      // Saving data, only the card tapped loads its page (preloadPage, as the finger lands).
      if (!savesData()) handle = idle(next);
    };
    // Not before the page has loaded: on a first visit the menu itself comes first.
    if (document.readyState === "complete") start();
    else addEventListener("load", start, { once: true });
    return () => {
      removeEventListener("load", start);
      cancel(handle);
      clearTimeout(timer);
      queue.length = 0;
    };
  }, [key]);
}
