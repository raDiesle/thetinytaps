import { expect, test } from "bun:test";
import { CATEGORIES, categoryHref, listedGames } from "@/content/games";
import { shelfBookOf } from "./bookTravel";

// The way back puts the book into its own gap (a shelf book's `data-book` is its category's id): every page in a book
// finds it – the category's page and each of its games. A game standing apart has a book of its own; one still being
// built (`Game.unfinished`) has none, as it is not on the shelf.
test("every category's page and every game finds its book on the shelf", () => {
  for (const category of CATEGORIES) {
    if (!category.apart) expect(shelfBookOf(categoryHref(category))).toBe(category.id);
    for (const game of category.games.filter((g) => g.unfinished)) expect(shelfBookOf(game.href), game.href).toBeUndefined();
    for (const game of listedGames(category)) {
      const own = game.volumes ? game.volumes[0].href : game.href;
      expect(shelfBookOf(game.href)).toBe(category.apart ? own.replaceAll("/", "") : category.id);
    }
  }
});

test("the games standing apart are books of their own, each found by its pages", () => {
  const apart = CATEGORIES.filter((c) => c.apart).flatMap(listedGames);
  expect(apart.length).toBeGreaterThan(0);
  expect(new Set(apart.map((g) => shelfBookOf(g.href))).size).toBe(apart.length);
  for (const game of apart.filter((g) => !g.volumes)) for (const href of game.also ?? []) expect(shelfBookOf(href)).toBe(shelfBookOf(game.href));
});

// A game in a slipcase (Belohnungstafel & Zeitplan) has a book for each of its addresses: going back from a part puts
// that part's book back, not its neighbour.
test("each volume in a slipcase is found by its own address", () => {
  const games = CATEGORIES.flatMap((c) => c.games).filter((g) => g.volumes);
  expect(games.length).toBeGreaterThan(0);
  for (const game of games) {
    const volumes = game.volumes ?? [];
    expect(volumes.map((v) => v.href).sort()).toEqual([game.href, ...(game.also ?? [])].sort());
    for (const v of volumes) expect(shelfBookOf(v.href)).toBe(v.href.replaceAll("/", ""));
  }
});

test("a page outside any book has none", () => {
  expect(shelfBookOf("/management/")).toBeUndefined();
});
