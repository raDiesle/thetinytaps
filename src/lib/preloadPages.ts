import { useEffect } from "react";

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

/**
 * For menus: once the menu is shown and the browser has nothing else to do, loads the pages behind its cards one
 * by one, each in an idle moment of its own, so a tap shows the next screen at once and never waits long for one.
 */
export function usePreloadPages(hrefs: string[]) {
  const key = hrefs.join(" ");
  useEffect(() => {
    let handle = 0;
    const queue = key.split(" ").filter((href) => loaders.has(href));
    const idle = (task: () => void) =>
      typeof requestIdleCallback === "function" ? requestIdleCallback(task, { timeout: 2000 }) : window.setTimeout(task, 200);
    const cancel = (id: number) => (typeof cancelIdleCallback === "function" ? cancelIdleCallback(id) : clearTimeout(id));
    const next = () => {
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
      handle = idle(next);
    };
    // Not before the page has loaded: on a first visit the menu itself comes first.
    if (document.readyState === "complete") start();
    else addEventListener("load", start, { once: true });
    return () => {
      removeEventListener("load", start);
      cancel(handle);
      queue.length = 0;
    };
  }, [key]);
}
