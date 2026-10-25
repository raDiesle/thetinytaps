import { expect, test } from "@rstest/core";
import { dealPairs, MAX_PAIRS, SOCK_COLORS, SOCK_PATTERNS, texts } from "./content";

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

test("every spoken sentence has words", () => {
  expect(texts.start.trim()).not.toBe("");
  expect(texts.done.trim()).not.toBe("");
  for (let i = 0; i < 20; i++) expect(texts.pair().trim()).not.toBe("");
});
