import { afterEach, describe, expect, test } from "bun:test";
import { COMMON_SETTINGS_KEY, loadCommon, withCommon } from "./common";

const real = globalThis.localStorage;
const storing = (saved: object) => {
  const values = new Map([[COMMON_SETTINGS_KEY, JSON.stringify(saved)]]);
  globalThis.localStorage = { getItem: (key: string) => values.get(key) ?? null } as Storage;
};

afterEach(() => {
  globalThis.localStorage = real;
});

describe("shared options", () => {
  // Read aloud and sounds were switches once; what a grown-up saved then must not silence a game or start the browser's voice.
  test("sounds are always on and the browser's voice always off, whatever was saved", () => {
    storing({ speech: true, sounds: false, music: false });
    expect(loadCommon()).toEqual({ speech: false, sounds: true, music: false, figure: "boy" });
  });

  // Saved before there was a figure: everything stays as it was drawn first, the boy.
  test("the figure is a boy unless a girl was chosen", () => {
    storing({ music: true });
    expect(loadCommon().figure).toBe("boy");
    storing({ figure: "girl" });
    expect(loadCommon().figure).toBe("girl");
  });

  test("a game's own read aloud and sounds fields are filled in from them", () => {
    storing({ speech: true, sounds: false });
    expect(withCommon({ speech: true, sounds: false, story: "x" }, loadCommon())).toEqual({ speech: false, sounds: true, story: "x" });
  });
});
