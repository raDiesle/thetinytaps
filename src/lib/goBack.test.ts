import { afterEach, expect, test } from "bun:test";
import type { NavigateFunction } from "react-router";
import { backFrom, goBack, notePage, STEP_BACK_WAIT_MS } from "./goBack";

// A browser history as the router keeps it: entries with their `idx`, a step back arriving a moment later (popstate) –
// or never, with `lost`: the browser stays where it is and reports nothing.
function fakeBrowser({ lost = false } = {}) {
  const entries: string[] = [];
  let idx = -1;
  const listeners = new Set<() => void>();
  const history = {
    get state() {
      return { idx };
    },
    go(delta: number) {
      if (lost) return;
      idx += delta;
      for (const listener of [...listeners]) listener();
    },
  };
  globalThis.window = {
    history,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  } as unknown as Window & typeof globalThis;
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

// The trophy room's play sign opens a level (`BackVisit`); ✕ there goes back to the room opening on that trophy.
test("a way back to a page with a question steps back to the page before it all the same", () => {
  const browser = fakeBrowser();
  browser.open("/pokale/");
  browser.open("/timer/sand/");
  goBack(browser.navigate, "/pokale/?pokal=%2Ftimer%2F%23sand");
  expect(browser.depth()).toBe(0);
});

// The ribbon beside a deeper menu's corner goes straight onto the shelf (user request, 28 November 2026): it steps back
// over the book's pages, so the phone's back button afterwards doesn't lead into the book again.
test("a way back to a page further back steps back over the pages between", () => {
  const browser = fakeBrowser();
  browser.open("/");
  browser.open("/spiele/spielwelten/");
  browser.open("/kettenreaktion/");
  goBack(browser.navigate, "/");
  expect(browser.shown()).toBe("/");
  expect(browser.depth()).toBe(0);
});

test("a way back to a page not just before replaces the page left", () => {
  const browser = fakeBrowser();
  browser.open("/kettenreaktion/");
  goBack(browser.navigate, "/spiele/lebendige-welten/");
  expect(browser.shown()).toBe("/spiele/lebendige-welten/");
  expect(browser.depth()).toBe(0);
});

// Only the browser's popstate ended the wait for a step back: where none came (an installed app's first entry, a page
// restored from the browser's cache), ✕ and every corner did nothing more until a reload.
test("a step back that never lands holds the ways back only for a moment", async () => {
  const browser = fakeBrowser({ lost: true });
  browser.open("/");
  browser.open("/bilder/");
  browser.open("/bilder/baustelle/");
  goBack(browser.navigate, "/bilder/");
  // The page shown is the one gone back to, whether or not the history then steps back.
  expect(browser.shown()).toBe("/bilder/");
  // A second tap right away still does nothing: the step back may yet land.
  goBack(browser.navigate, "/kettenreaktion/");
  expect(browser.shown()).toBe("/bilder/");
  await Bun.sleep(STEP_BACK_WAIT_MS + 50);
  // To a page not just before, so this test leaves no step back on its way.
  goBack(browser.navigate, "/kettenreaktion/");
  expect(browser.shown()).toBe("/kettenreaktion/");
});

test("a game opened to come back leads only to a page of this app", () => {
  expect(backFrom({ backTo: "/pokale/?pokal=x" })).toBe("/pokale/?pokal=x");
  expect(backFrom({ backTo: "//evil.example/" })).toBeUndefined();
  expect(backFrom(null)).toBeUndefined();
});
