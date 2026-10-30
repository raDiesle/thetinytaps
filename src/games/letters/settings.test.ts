import { describe, expect, test } from "bun:test";
import { DEFAULT_LETTERS_SETTINGS, type LettersSettings, upgradeLegacyMode } from "./settings";

const saved = (mode: string) => ({ ...DEFAULT_LETTERS_SETTINGS, mode }) as unknown as LettersSettings;

describe("upgradeLegacyMode", () => {
  test("Zählen becomes Frei tippen with only numbers", () => {
    expect(upgradeLegacyMode(saved("count"))).toEqual({ mode: "free", numbersOnly: true });
  });

  test("„Wo ist das B?“ becomes Wörter tippen with the first letter", () => {
    expect(upgradeLegacyMode(saved("find"))).toEqual({ mode: "words", wordTyping: "first" });
  });

  test("a mode taken away earlier (the Buchstaben-Zug) plays Frei tippen", () => {
    expect(upgradeLegacyMode(saved("train"))).toEqual({ mode: "free" });
  });

  test("the two ways to play stay as they are", () => {
    expect(upgradeLegacyMode(saved("free"))).toBeNull();
    expect(upgradeLegacyMode(saved("words"))).toBeNull();
  });
});
