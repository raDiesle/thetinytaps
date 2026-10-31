import { expect, test } from "bun:test";
import { CATEGORIES, categoryHref } from "@/content/games";
import { shelfBookOf } from "./bookTravel";

// The way back puts the book into its own gap (a shelf book's `data-book` is its category's id): every page in a book
// finds it – the category's page and each of its games.
test("every category's page and every game finds its book on the shelf", () => {
  for (const category of CATEGORIES) {
    expect(shelfBookOf(categoryHref(category))).toBe(category.id);
    for (const game of category.games) expect(shelfBookOf(game.href)).toBe(category.id);
  }
});

test("a page outside any book has none", () => {
  expect(shelfBookOf("/management/")).toBeUndefined();
});
