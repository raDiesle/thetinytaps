import { expect, test } from "bun:test";
import { APP_LANGUAGES, pick } from "@/lib/language";
import { dealPairs, MAX_PAIRS, nextLevel, SOCK_COLORS, SOCK_LEVELS, SOCK_PATTERNS, SOCK_TEXTS, type SockLook } from "./content";

const key = (l: SockLook) => `${l.color.id} ${l.pattern}`;

test("every wash has pairs that all look different, and what tells them apart is what its step says", () => {
  for (const level of SOCK_LEVELS) {
    for (let run = 0; run < 20; run++) {
      const looks = dealPairs(level);
      const name = `${level.kind} ${level.pairs}`;
      expect(looks, name).toHaveLength(level.pairs);
      expect(new Set(looks.map(key)).size, name).toBe(level.pairs);
      const colors = new Set(looks.map((l) => l.color.id)).size;
      const patterns = new Set(looks.map((l) => l.pattern)).size;
      if (level.kind === "colors") {
        expect(colors, name).toBe(level.pairs);
        expect(patterns, name).toBe(1);
      }
      if (level.kind === "patterns") expect([colors, patterns], name).toEqual([level.pairs, level.pairs]);
      if (level.kind === "sameColor") {
        // Only the pattern tells them apart, and every colour is there at least twice.
        expect(patterns, name).toBe(level.pairs);
        for (const color of new Set(looks.map((l) => l.color.id))) expect(looks.filter((l) => l.color.id === color).length, name).toBeGreaterThan(1);
      }
      if (level.kind === "mixed") {
        expect(colors, name).toBe(2);
        expect(patterns, name).toBeLessThan(level.pairs);
      }
    }
  }
});

test("the steps start easy, never ask for more pairs than fit, and get harder only in what is seen", () => {
  expect(SOCK_LEVELS[0]).toEqual({ pairs: 2, kind: "colors", covered: 0 });
  for (const level of SOCK_LEVELS) {
    expect(level.pairs).toBeLessThanOrEqual(MAX_PAIRS);
    expect(level.covered).toBeGreaterThanOrEqual(0);
    expect(level.covered).toBeLessThanOrEqual(level.pairs * 2);
  }
  const kinds = SOCK_LEVELS.map((l) => ["colors", "patterns", "sameColor", "mixed"].indexOf(l.kind));
  expect(kinds).toEqual([...kinds].sort((a, b) => a - b));
  // A new kind starts with few baskets; within a kind they only get more.
  for (let i = 1; i < SOCK_LEVELS.length; i++) {
    const [before, level] = [SOCK_LEVELS[i - 1], SOCK_LEVELS[i]];
    if (before.kind === level.kind) expect(level.covered, `step ${i}`).toBeGreaterThanOrEqual(before.covered);
    else expect(level.covered, `step ${i}`).toBeLessThanOrEqual(1);
  }
});

test("sure goes up, many misses or a very long search goes down, and it stays within the steps", () => {
  const last = SOCK_LEVELS.length - 1;
  expect(nextLevel(0, { pairs: 2, misses: 0, ms: 4000 })).toBe(2);
  expect(nextLevel(0, { pairs: 2, misses: 1, ms: 9000 })).toBe(1);
  // Slow but sure still goes up: harder never means faster.
  expect(nextLevel(3, { pairs: 3, misses: 0, ms: 27000 })).toBe(4);
  expect(nextLevel(3, { pairs: 3, misses: 2, ms: 24000 })).toBe(3);
  expect(nextLevel(3, { pairs: 3, misses: 5, ms: 9000 })).toBe(2);
  expect(nextLevel(3, { pairs: 3, misses: 0, ms: 70000 })).toBe(2);
  expect(nextLevel(0, { pairs: 2, misses: 9, ms: 60000 })).toBe(0);
  expect(nextLevel(last, { pairs: 6, misses: 0, ms: 6000 })).toBe(last);
});

test("there are enough colours and patterns for every step, and none twice", () => {
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

test("Chinese, Hindi and Arabic sentences have no Latin letters", () => {
  for (const id of ["zh", "hi", "ar"] as const) {
    const texts = pick(SOCK_TEXTS, id);
    for (const line of [texts.start, texts.done, ...texts.pair, texts.sock(1)]) expect(line, id).toMatch(/^[^A-Za-z]*$/);
  }
});
