import { afterAll, expect, test } from "bun:test";
import { showStep, stepIndexInAddress, stepInAddress, stepOf } from "./stepAddress";

// A browser whose address only changes in place, as `history.replaceState` does.
const real = globalThis.window;
let href = "https://www.funforboth.com/abstillen/?seite=5";
const replaced: string[] = [];
globalThis.window = {
  location: {
    get href() {
      return href;
    },
    get search() {
      return new URL(href).search;
    },
  },
  history: {
    state: { idx: 3 },
    replaceState(_: unknown, __: string, url: URL) {
      href = String(url);
      replaced.push(href);
    },
  },
} as unknown as Window & typeof globalThis;
afterAll(() => {
  globalThis.window = real;
});

// The module notes what was shown for the whole visit, so these run in order, as a visit would.
test("a link's step is followed once, then the game's own steps go into the address in place", () => {
  expect(stepInAddress()).toBe("5");
  expect(stepIndexInAddress(10)).toBe(4);
  expect(stepIndexInAddress(3)).toBeUndefined();
  showStep("/abstillen/", 5);
  // The address already says it: nothing replaced.
  expect(replaced).toEqual([]);
  showStep("/abstillen/", 6);
  expect(href).toBe("https://www.funforboth.com/abstillen/?seite=6");
  expect(stepOf("/abstillen/")).toEqual({ step: "6", count: 2 });
  // Once a step was shown, the address is the game's own: a game coming next doesn't start from it.
  expect(stepInAddress()).toBeUndefined();
});

test("leaving takes the step out of the address and keeps it for the page's time", () => {
  showStep("/abstillen/", undefined);
  expect(href).toBe("https://www.funforboth.com/abstillen/");
  expect(stepOf("/abstillen/")).toEqual({ step: "6", count: 2 });
  expect(stepOf("/zaehne/")).toBeUndefined();
  // Another page counts from 1.
  showStep("/zaehne/", "lower-top");
  expect(stepOf("/zaehne/")).toEqual({ step: "lower-top", count: 1 });
  expect(stepOf("/abstillen/")).toBeUndefined();
});

/**
 * Games without steps in the address, and why: what they show is no row of pages or rounds a child goes through.
 * A game of scenes, pages or rounds is never added here; it calls `useStepAddress` with the one on screen.
 */
const WITHOUT_STEPS: Record<string, string> = {
  marbles: "each level is one chain set off by one tap, and has its own address already",
  scenes: "a picture tapped freely, in any order",
  timer: "a tool for the day, counting down",
};

test("every game with scenes, rounds or an end shows the one on screen as `?seite=`", async () => {
  const folders = new Map<string, string>();
  for await (const path of new Bun.Glob("src/games/*/**/*.tsx").scan(".")) {
    if (path.endsWith(".test.tsx")) continue;
    const folder = path.split("/")[2];
    folders.set(folder, (folders.get(folder) ?? "") + (await Bun.file(path).text()));
  }
  const missing = [...folders]
    .filter(([, code]) => /<(GameEnd|DevTag)\b/.test(code))
    .filter(([folder, code]) => !code.includes("useStepAddress(") && !code.includes("<ChapterBook") && !(folder in WITHOUT_STEPS))
    .map(([folder]) => folder);
  expect(missing).toEqual([]);
  for (const folder of Object.keys(WITHOUT_STEPS)) expect(folders.has(folder)).toBe(true);
});
