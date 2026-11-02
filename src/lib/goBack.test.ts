import { afterEach, expect, test } from "bun:test";
import type { NavigateFunction } from "react-router";
import { goBack, notePage } from "./goBack";

// A browser history as the router keeps it: entries with their `idx`, a step back arriving a moment later (popstate).
function fakeBrowser() {
  const entries: string[] = [];
  let idx = -1;
  const listeners: (() => void)[] = [];
  const history = {
    get state() {
      return { idx };
    },
    go(delta: number) {
      idx += delta;
      for (const listener of listeners.splice(0)) listener();
    },
  };
  globalThis.window = { history, addEventListener: (_: string, listener: () => void) => listeners.push(listener) } as unknown as Window & typeof globalThis;
  /** Opens a page, as a link does. */
  const open = (path: string) => {
    entries.splice(++idx, entries.length, path);
    notePage(path, true);
  };
  const navigate = ((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) entries[idx] = to;
    else entries.splice(++idx, entries.length, to);
    notePage(to, !options?.replace);
  }) as NavigateFunction;
  return { open, navigate, shown: () => entries[idx], depth: () => idx };
}

const real = globalThis.window;
afterEach(() => {
  globalThis.window = real;
});

// The phone's back button after leaving a picture of Lebendige Bilder stayed on /bilder/: the game had replaced itself
// with the menu, which so stood twice in the history (user feedback, November 2026).
test("going back to the page before steps back in the history instead of adding to it", () => {
  const browser = fakeBrowser();
  browser.open("/");
  browser.open("/spiele/lebendige-welten/");
  browser.open("/bilder/");
  browser.open("/bilder/baustelle/");
  goBack(browser.navigate, "/bilder/");
  expect(browser.shown()).toBe("/bilder/");
  expect(browser.depth()).toBe(2);
  goBack(browser.navigate, "/spiele/lebendige-welten/");
  expect(browser.depth()).toBe(1);
  goBack(browser.navigate, "/");
  expect(browser.depth()).toBe(0);
});

test("a way back to a page not just before replaces the page left", () => {
  const browser = fakeBrowser();
  browser.open("/kettenreaktion/");
  goBack(browser.navigate, "/spiele/lebendige-welten/");
  expect(browser.shown()).toBe("/spiele/lebendige-welten/");
  expect(browser.depth()).toBe(0);
});
