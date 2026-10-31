import { expect, test } from "bun:test";
import { CATEGORIES, categoryHref } from "@/content/games";
import { shelfBookOf } from "./bookTravel";

/** The `data-book` of the shelf's books (Bookshelf.tsx): a category's id, or a game's address for „Weitere“'s games. */
const SHELF = new Set(CATEGORIES.flatMap((c) => (c.onHome ? c.games.map((g) => g.href) : [c.id])));

// The way back puts the book into its own gap: every page in a book finds a book that stands on the shelf.
test("every category's page and every game finds its book on the shelf", () => {
  for (const category of CATEGORIES) {
    if (!category.onHome) expect(shelfBookOf(categoryHref(category))).toBe(category.id);
    for (const game of category.games) {
      const book = shelfBookOf(game.href);
      expect(book && SHELF.has(book)).toBe(true);
      expect(book).toBe(category.onHome ? game.href : category.id);
    }
  }
});

test("a page outside any book has none", () => {
  expect(shelfBookOf("/management/")).toBeUndefined();
});
