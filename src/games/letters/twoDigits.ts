import type { EnglishFirst } from "@/lib/language";

// Two-digit numbers (user request, November 2026): with „Zweistellige Zahlen“ on, Frei tippen and Zählen take two keys
// for one number – 2, then 3 is 23 – and show it as rows of ten things, so a child sees the tens it is made of.

/** The smallest and largest number two keys make (a leading 0 makes a one-digit number, shown as such). */
export const TWO_DIGIT_MIN = 10;
export const TWO_DIGIT_MAX = 99;

/** Things in a full row of a two-digit number: ten, in two groups of five, as on a counting frame. */
export const TENS_ROW = 10;

/** The rows a two-digit number's things stand in: its full tens, then the rest. */
export function tensRows(n: number): number[] {
  const rows = Array.from({ length: Math.floor(n / TENS_ROW) }, () => TENS_ROW);
  return n % TENS_ROW > 0 ? [...rows, n % TENS_ROW] : rows;
}

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/**
 * A two-digit number's word, said when it is shown – English first, the other languages when translations are asked
 * for. A line not recorded yet stays silent, and a language without its words says the English one's recording.
 */
export const TWO_DIGIT_WORDS: EnglishFirst<(n: number) => string> = {
  en: (n) => {
    const word = n < 20 ? TEENS[n - 10] : `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ""}`;
    return `${word}!`;
  },
};

/** Every number two keys make, for the voice list and loading ahead. */
export const TWO_DIGIT_NUMBERS = Array.from({ length: TWO_DIGIT_MAX - TWO_DIGIT_MIN + 1 }, (_, i) => TWO_DIGIT_MIN + i);
