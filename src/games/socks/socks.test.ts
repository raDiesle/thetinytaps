import { expect, test } from "bun:test";
import { APP_LANGUAGES, pick } from "@/lib/language";
import { dealPairs, MAX_PAIRS, SOCK_COLORS, SOCK_PATTERNS, SOCK_TEXTS } from "./content";

test("every wash has pairs that all look different", () => {
  for (const mode of ["colors", "patterns"] as const) {
    for (let count = 2; count <= MAX_PAIRS; count++) {
      const looks = dealPairs(mode, count);
      expect(looks, `${mode} ${count}`).toHaveLength(count);
      const keys = looks.map((l) => (mode === "colors" ? l.color.id : l.pattern));
      expect(new Set(keys).size, `${mode} ${count}`).toBe(count);
    }
  }
});

test("there are enough colours for the most pairs, and none twice", () => {
  expect(SOCK_COLORS.length).toBeGreaterThanOrEqual(MAX_PAIRS);
  expect(new Set(SOCK_COLORS.map((c) => c.id)).size).toBe(SOCK_COLORS.length);
  expect(new Set(SOCK_PATTERNS).size).toBe(SOCK_PATTERNS.length);
});

// Translations come only when asked for: a sentence missing in a language is said in German, but never empty.
test("every app language has every spoken sentence, with words", () => {
  for (const id of APP_LANGUAGES) {
    const texts = pick(SOCK_TEXTS, id);
    expect(texts.start.trim(), id).not.toBe("");
    expect(texts.done.trim(), id).not.toBe("");
    expect(texts.pair.length, id).toBeGreaterThan(0);
    for (const praise of texts.pair) expect(praise.trim(), id).not.toBe("");
  }
});

test("Russian counts the pairs with the right form", () => {
  const { pairs } = pick(SOCK_TEXTS, "ru");
  expect([2, 3, 4, 5, 6].map(pairs)).toEqual(["2 пары", "3 пары", "4 пары", "5 пар", "6 пар"]);
});
