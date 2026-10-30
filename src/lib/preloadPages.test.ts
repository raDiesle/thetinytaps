import { expect, test } from "bun:test";
import "@/App";
import { CATEGORIES, categoryHref } from "@/content/games";
import { pagePaths } from "@/lib/preloadPages";

test("every card of the home and category menus leads to a page they can load before the tap", () => {
  const paths = new Set(pagePaths());
  const hrefs = CATEGORIES.flatMap((c) => [categoryHref(c), ...c.games.map((g) => g.href)]);
  // The home page and the category pages are part of the first chunk anyway.
  const lazy = hrefs.filter((href) => href !== "/" && !href.startsWith("/spiele/"));
  expect(lazy.filter((href) => !paths.has(href))).toEqual([]);
});
