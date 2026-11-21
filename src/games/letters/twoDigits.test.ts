import { expect, test } from "bun:test";
import { TENS_ROW, TWO_DIGIT_NUMBERS, TWO_DIGIT_WORDS, tensRows } from "./twoDigits";

test("a two-digit number stands in its full tens and the rest", () => {
  expect(tensRows(23)).toEqual([10, 10, 3]);
  expect(tensRows(10)).toEqual([10]);
  expect(tensRows(99)).toEqual([10, 10, 10, 10, 10, 10, 10, 10, 10, 9]);
  for (const n of TWO_DIGIT_NUMBERS) {
    const rows = tensRows(n);
    expect(rows.reduce((a, b) => a + b, 0)).toBe(n);
    expect(Math.max(...rows)).toBeLessThanOrEqual(TENS_ROW);
  }
});

test("every two-digit number has its own English word", () => {
  expect(TWO_DIGIT_WORDS.en(13)).toBe("thirteen!");
  expect(TWO_DIGIT_WORDS.en(40)).toBe("forty!");
  expect(TWO_DIGIT_WORDS.en(87)).toBe("eighty-seven!");
  const words = TWO_DIGIT_NUMBERS.map(TWO_DIGIT_WORDS.en);
  expect(new Set(words).size).toBe(TWO_DIGIT_NUMBERS.length);
  for (const word of words) expect(word).toMatch(/^[a-z]+(-[a-z]+)?!$/);
});
