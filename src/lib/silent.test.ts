import { describe, expect, test } from "bun:test";
import { isClaudeBrowser } from "./silent";

const CLAUDE = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/4.16336.0 Chrome/152.0.7977.167 Safari/537.36";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36";
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const MAC_CHROME = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36";

describe("silent in Claude's browser", () => {
  test("Claude's own user agent", () => {
    expect(isClaudeBrowser(CLAUDE, "MacIntel", false)).toBe(true);
  });

  test("an upright phone emulated in Claude's pane stays silent (user feedback, November 2026)", () => {
    // The pane's phone sizes swap in an Android user agent: the tab remembers, and a phone on a Mac is emulated anyway.
    expect(isClaudeBrowser(ANDROID, "MacIntel", true)).toBe(true);
    expect(isClaudeBrowser(ANDROID, "MacIntel", false)).toBe(true);
    expect(isClaudeBrowser(ANDROID, "Win32", false)).toBe(true);
  });

  test("real phones, tablets and computers play their sounds", () => {
    expect(isClaudeBrowser(ANDROID, "Linux armv8l", false)).toBe(false);
    expect(isClaudeBrowser(IPHONE, "iPhone", false)).toBe(false);
    expect(isClaudeBrowser(MAC_CHROME, "MacIntel", false)).toBe(false);
  });
});
