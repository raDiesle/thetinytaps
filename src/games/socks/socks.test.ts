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

test("the other languages count the pairs with the right form", () => {
  const counts = (id: Parameters<typeof pick>[1]) => [1, 2, 3, 6].map(pick(SOCK_TEXTS, id).pairs);
  expect(counts("en")).toEqual(["1 pair", "2 pairs", "3 pairs", "6 pairs"]);
  expect(counts("es")).toEqual(["1 par", "2 pares", "3 pares", "6 pares"]);
  expect(counts("zh")).toEqual(["1双", "2双", "3双", "6双"]);
  expect(counts("hi")).toEqual(["1 जोड़ा", "2 जोड़े", "3 जोड़े", "6 जोड़े"]);
  expect(counts("ar")).toEqual(["زوج واحد", "زوجان", "3 أزواج", "6 أزواج"]);
});

test("Chinese, Hindi and Arabic sentences have no Latin letters", () => {
  for (const id of ["zh", "hi", "ar"] as const) {
    const texts = pick(SOCK_TEXTS, id);
    for (const line of [texts.start, texts.done, ...texts.pair, texts.sock(1)]) expect(line, id).toMatch(/^[^A-Za-z]*$/);
  }
});
