import { readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { TURN_SECONDS } from "./look";

const css = readFileSync("src/styles/book.css", "utf8");

/** The number of seconds a `name: <n>s` (or a `const NAME = <n>`) in `text` gives. */
const seconds = (text: string, pattern: RegExp) => Number(text.match(pattern)?.[1]);

// The sound of a page lands when the page does: the turn on screen and its sound take the same time.
test("a page turns as long as its sound says", () => {
  expect(seconds(css, /--turn-time:\s*([\d.]+)s/)).toBe(TURN_SECONDS);
});

// A quick flick didn't look like a book's page, and 1.2 s was still too quick (user feedback, October 2026): a page
// takes its time to turn, as a grown-up turns it for a child.
test("a page turns slowly enough to be seen", () => {
  expect(TURN_SECONDS).toBeGreaterThanOrEqual(1.5);
});

// The page seen is always the book's left page (user feedback, October 2026): its spine on the right, so every page
// turns on the right edge – forward the next one comes over from the right, back this one turns over to the right.
test("the page seen is the left page, turning on the spine at its right", () => {
  const turning = [...css.matchAll(/\[data-turn="(forward|back)"\]::view-transition-(old|new)\((?:root|turn-page)\) \{([^}]*)\}/g)].filter((m) =>
    m[3].includes("book-turn-away"),
  );
  expect(turning.map((m) => m[1]).sort()).toEqual(["back", "forward"]);
  for (const m of turning) expect(m[3]).toContain("transform-origin: right center");
  // The outer edge has the wider margin, where the board and the pages under it show; the spine's side the narrow one.
  expect(Number(css.match(/--page-left:\s*(\d+)px/)?.[1])).toBeGreaterThan(Number(css.match(/--page-right:\s*(\d+)px/)?.[1]));
});
