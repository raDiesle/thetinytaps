import { readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { TURN_SECONDS } from "./look";

const css = readFileSync("src/styles/book.css", "utf8");
const cover = readFileSync("src/components/BookCover.tsx", "utf8");

/** The number of seconds a `name: <n>s` (or a `const NAME = <n>`) in `text` gives. */
const seconds = (text: string, pattern: RegExp) => Number(text.match(pattern)?.[1]);

// The sound of a page lands when the page does: the turn on screen and its sound take the same time.
test("a page turns as long as its sound says", () => {
  expect(seconds(css, /--turn-time:\s*([\d.]+)s/)).toBe(TURN_SECONDS);
});

// A quick flick didn't look like a book's page (user feedback, October 2026): a page takes its time to turn.
test("a page turns slowly enough to be seen", () => {
  expect(TURN_SECONDS).toBeGreaterThanOrEqual(1);
});

// The cover's screen goes away when its animation ends, and its board lands with the sound.
test("the cover opens as long as BookCover waits for it", () => {
  expect(seconds(css, /\.book-cover-screen\.opening \{\s*animation: book-reveal ([\d.]+)s/)).toBe(seconds(cover, /const OPEN_MS = (\d+);/) / 1000);
  expect(seconds(css, /\.opening \.book-cover \{\s*animation: book-cover-open ([\d.]+)s/)).toBe(seconds(cover, /const SWING_SECONDS = ([\d.]+);/));
});
