import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { contentsGrid } from "@/components/BookContents";
import { CATEGORIES, hasPage, listedGames } from "@/content/games";

// A table of contents never stands as one long column of flat lines, where the pictures were far too small (user
// request, November 2026): its lines share the page in columns.
test("every book's table of contents lays its lines out in columns", () => {
  for (const category of CATEGORIES.filter(hasPage)) {
    const count = listedGames(category).length;
    const { cols, rows } = contentsGrid(count);
    expect(cols).toBeGreaterThan(1);
    expect(rows).toBeLessThanOrEqual(2);
    expect(cols * rows).toBeGreaterThanOrEqual(count);
    // No row left with more than one place empty.
    expect(cols * rows - count).toBeLessThan(cols);
  }
});

test("the table of contents is a grid of the columns BookContents sets", () => {
  const css = readFileSync("src/styles/book.css", "utf8");
  expect(css).toMatch(/\.toc \{[^}]*display: grid;[^}]*grid-template-columns: repeat\(var\(--toc-cols\)/);
});
