import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * The brighter light on the carved words under the app's sign lies round all of the words, evenly, and fades out softly
 * well inside the compartment: lighting the whole compartment, it reached the post and was cut off there, and an
 * ellipse round the words ended too hard and left their corners dim (user feedback, 25 November 2026).
 */
const books = readFileSync(new URL("./styles/bookshelf-books.css", import.meta.url), "utf8");
const shelf = readFileSync(new URL("./styles/bookshelf.css", import.meta.url), "utf8");
const component = readFileSync(new URL("./components/Bookshelf.tsx", import.meta.url), "utf8");

test("the carved words' light lies on the words, never on the whole compartment", () => {
  expect(component).not.toContain("shelf-light lead");
  expect(shelf).not.toContain(".shelf-light.lead");
  const rule = books.match(/\.shelf-carving-text::before \{([^}]*)\}/)?.[1] ?? "";
  // A little past the words, no further.
  const inset =
    rule
      .match(/inset:\s*([^;]+);/)?.[1]
      .trim()
      .split(/\s+/) ?? [];
  expect(inset.length).toBeGreaterThan(0);
  for (const value of inset) expect(value).toMatch(/^-?(0|0?\.\d+|1)em$/);
  // One even light over all the words, soft at its rim: a blurred rounded box (an ellipse round a block of text left its
  // corners dim and ended hard; user feedback, 25 November 2026).
  expect(rule).toMatch(/filter: blur\((1(\.\d+)?|0\.\d+)em\)/);
  expect(rule).toContain("border-radius");
});
