import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

/**
 * The brighter light on the carved words under the app's sign lies close round the words only and fades out well inside
 * the compartment: lighting the whole compartment, it reached the post and was cut off there (user feedback, November
 * 2026).
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
  // Faded out inside its own box, so no edge of it is ever seen.
  expect(rule).toMatch(/radial-gradient\(closest-side,[^;]*#0000\)/);
});
