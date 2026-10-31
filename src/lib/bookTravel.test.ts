import { expect, test } from "bun:test";
import { CATEGORIES, categoryHref } from "@/content/games";
import { shelfBookOf } from "./bookTravel";

// The way back puts the book into its own gap (a shelf book's `data-book` is its category's id): every page in a book
// finds it – the category's page and each of its games. A game standing apart has a book of its own.
test("every category's page and every game finds its book on the shelf", () => {
  for (const category of CATEGORIES) {
    if (!category.apart) expect(shelfBookOf(categoryHref(category))).toBe(category.id);
    for (const game of category.games) expect(shelfBookOf(game.href)).toBe(category.apart ? game.href.replaceAll("/", "") : category.id);
  }
});

test("the games standing apart are books of their own, each found by its pages", () => {
  const apart = CATEGORIES.filter((c) => c.apart).flatMap((c) => c.games);
  expect(apart.length).toBeGreaterThan(0);
  expect(new Set(apart.map((g) => shelfBookOf(g.href))).size).toBe(apart.length);
  for (const game of apart) for (const href of game.also ?? []) expect(shelfBookOf(href)).toBe(shelfBookOf(game.href));
});

test("a page outside any book has none", () => {
  expect(shelfBookOf("/management/")).toBeUndefined();
});
