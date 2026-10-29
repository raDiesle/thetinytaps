import { afterAll, beforeEach, describe, expect, test } from "bun:test";

// No DOM in the tests: a page already in fullscreen, a keyboard that counts its locks, and a pointer of our choice.
let coarseOnly = true;
const calls: string[] = [];
const saved = { document: globalThis.document, navigator: globalThis.navigator, matchMedia: globalThis.matchMedia };
Object.assign(globalThis, {
  document: { fullscreenElement: {}, fullscreenEnabled: true },
  matchMedia: (query: string) => ({ matches: query.includes("coarse") ? coarseOnly : !coarseOnly }),
});
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { keyboard: { lock: async () => void calls.push("lock"), unlock: () => void calls.push("unlock") } },
});
const { enterKidMode, exitKidMode } = await import("./fullscreen");

afterAll(() => {
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: saved.navigator });
  Object.assign(globalThis, { document: saved.document, matchMedia: saved.matchMedia });
});

beforeEach(() => {
  calls.length = 0;
});

describe("kid mode", () => {
  // Chrome shows its "how to leave fullscreen" note on every keyboard lock and unlock.
  test("a phone or tablet already in fullscreen starts and leaves a game without touching the keyboard", async () => {
    coarseOnly = true;
    expect(await enterKidMode()).toBe(true);
    exitKidMode();
    expect(calls).toEqual([]);
  });

  test("a computer locks the keyboard while playing and unlocks it once afterwards", async () => {
    coarseOnly = false;
    await enterKidMode();
    exitKidMode();
    exitKidMode();
    expect(calls).toEqual(["lock", "unlock"]);
  });
});
