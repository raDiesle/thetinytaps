import { expect, test } from "bun:test";
import { CATEGORIES, categoryHref, listedGames } from "@/content/games";
import { halfwayAt, putBookBack, shelfBookOf } from "./bookTravel";

// The way back puts the book into its own gap (a shelf book's `data-book` is its category's id): every page in a book
// finds it – the category's page and each of its games. A game standing apart has a book of its own; one still being
// built (`Game.unfinished`) has none, as it is not on the shelf.
test("every category's page and every game finds its book on the shelf", () => {
  // A toy (`Category.toy`) is no book: its game goes back to the shelf with no book to close.
  for (const game of CATEGORIES.filter((c) => c.toy).flatMap((c) => c.games)) expect(shelfBookOf(game.href), game.href).toBeUndefined();
  for (const category of CATEGORIES.filter((c) => !c.toy)) {
    if (!category.apart) expect(shelfBookOf(categoryHref(category))).toBe(category.id);
    for (const game of category.games.filter((g) => g.unfinished === true)) expect(shelfBookOf(game.href), game.href).toBeUndefined();
    for (const game of listedGames(category)) {
      // A bundle of volumes: the game's own address is the volume of that address, wherever it stands in the bundle.
      const own = game.volumes?.find((v) => v.href === game.href)?.href ?? game.volumes?.[0].href ?? game.href;
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

// A game standing as several books (Belohnungstafel & Zeitplan) has a book for each of its addresses: going back from a part puts
// that part's book back, not its neighbour.
test("each of a game's volumes is found by its own address", () => {
  const games = CATEGORIES.flatMap((c) => c.games).filter((g) => g.volumes);
  expect(games.length).toBeGreaterThan(0);
  for (const game of games) {
    const volumes = game.volumes ?? [];
    expect(volumes.map((v) => v.href).sort()).toEqual([game.href, ...(game.also ?? [])].sort());
    // A volume still being built is no book on the shelf (`shelfVolumes`): its page belongs to its game's book.
    for (const v of volumes) expect(shelfBookOf(v.href), v.href).toBe((v.unfinished ? game.href : v.href).replaceAll("/", ""));
  }
});

test("a page outside any book has none", () => {
  expect(shelfBookOf("/management/")).toBeUndefined();
});

// `putBookBack` once had no try/finally: a throw while the page was copied left the book „travelling“ for good, so no
// book opened again until a reload. A page that can't be copied still goes back, and the next way back travels again.
test("a way back that fails still goes back and leaves the next book free to travel", async () => {
  const names = ["document", "matchMedia"] as const;
  const real = names.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
  let layers = 0;
  const part = () => ({
    className: "",
    style: { setProperty: () => {}, pointerEvents: "" },
    classList: { add: () => {}, remove: () => {} },
    append: () => {},
    remove: () => {},
    animate: () => ({ finished: Promise.resolve() }),
  });
  const page = {
    documentElement: { dataset: {} },
    body: { append: () => layers++ },
    createElement: part,
    // Copying the page fails: the first thing the way back does after its layer is there.
    getElementById: () => {
      throw new Error("no page to copy");
    },
  };
  Object.assign(globalThis, { document: page, matchMedia: () => ({ matches: false }) });
  try {
    const from = categoryHref(CATEGORIES.find((c) => !c.apart && !c.toy) ?? CATEGORIES[0]);
    let went = 0;
    for (const round of [1, 2]) {
      expect(() => putBookBack(from, () => went++)).not.toThrow();
      expect(went).toBe(round);
      // A layer of its own each time: the second way back travels, it was not turned away as „still travelling“.
      expect(layers).toBe(round);
      // The failed move ends in a later step (its layer fades); only then the next may start.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  } finally {
    names.forEach((name, i) => {
      const was = real[i];
      if (was) Object.defineProperty(globalThis, name, was);
      else delete (globalThis as Record<string, unknown>)[name];
    });
  }
});

// The cover's two faces swap by an opacity step as it stands edge on (WebKit shows neither `backface-visibility` nor the
// faces' depth inside the turning cover): that moment is when its easing has gone half the way.
test("the cover's faces swap where its turn has gone half the way", () => {
  expect(halfwayAt([0, 0, 1, 1])).toBeCloseTo(0.5, 5);
  expect(halfwayAt([0.5, 0, 0.5, 1])).toBeCloseTo(0.5, 5);
  // The cover's turn eases out longer than it eases in: half open a little before half its time.
  expect(halfwayAt([0.5, 0, 0.35, 1])).toBeGreaterThan(0.4);
  expect(halfwayAt([0.5, 0, 0.35, 1])).toBeLessThan(0.5);
});
