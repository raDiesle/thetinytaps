import { afterEach, describe, expect, test } from "bun:test";
import { COMMON_SETTINGS_KEY, loadCommon } from "./common";

const real = globalThis.localStorage;
const storing = (saved: object) => {
  const values = new Map([[COMMON_SETTINGS_KEY, JSON.stringify(saved)]]);
  globalThis.localStorage = { getItem: (key: string) => values.get(key) ?? null } as Storage;
};

afterEach(() => {
  globalThis.localStorage = real;
});

describe("shared options", () => {
  // Read aloud and sounds were switches once and may still be saved: nothing reads them, the rest loads as saved.
  test("an old save with read aloud and sounds still loads its options", () => {
    storing({ speech: true, sounds: false, music: false });
    expect(loadCommon()).toMatchObject({ music: false, figure: "boy", leave: "tap" });
  });

  // Holding ✕ to leave was the only way once; a tap is the default now (user decision, November 2026), holding a choice.
  test("a game is left with a tap unless holding was chosen", () => {
    storing({ music: true });
    expect(loadCommon().leave).toBe("tap");
    storing({ leave: "hold" });
    expect(loadCommon().leave).toBe("hold");
  });

  // Saved before there was a figure: everything stays as it was drawn first, the boy.
  test("the figure is a boy unless a girl was chosen", () => {
    storing({ music: true });
    expect(loadCommon().figure).toBe("boy");
    storing({ figure: "girl" });
    expect(loadCommon().figure).toBe("girl");
  });
});
