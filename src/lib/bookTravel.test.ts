import { expect, test } from "bun:test";
import { CATEGORIES, categoryHref, listedGames, shelfVolumes } from "@/content/games";
import { putBookBack, renameIdRefs, shelfBookOf } from "./bookTravel";

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
      // A bundle of volumes: the game's own address is the volume of that address, wherever it stands in the bundle; a
      // calendar (`Game.calendar`) is one thing, found by the game's own address.
      const volumes = shelfVolumes(game);
      const own = volumes?.find((v) => v.href === game.href)?.href ?? volumes?.[0].href ?? game.href;
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

// A game standing as several books has a book for each of its addresses: going back from a part puts that part's book
// back, not its neighbour. A game standing as one calendar (Belohnungstafel & Zeitplan, `Game.calendar`) goes back into
// that calendar's gap from every part.
test("each of a game's volumes is found by its own address", () => {
  const games = CATEGORIES.flatMap((c) => c.games).filter((g) => g.volumes);
  expect(games.length).toBeGreaterThan(0);
  for (const game of games) {
    const volumes = game.volumes ?? [];
    expect(volumes.map((v) => v.href).sort()).toEqual([game.href, ...(game.also ?? [])].sort());
    // A volume still being built is no book on the shelf (`shelfVolumes`): its page belongs to its game's book.
    for (const v of volumes) expect(shelfBookOf(v.href), v.href).toBe((game.calendar || v.unfinished ? game.href : v.href).replaceAll("/", ""));
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

// While a book flies, the screen is copied onto its page: with the page's own ids the document held each id twice, and
// the brushing's story lost the clip its face hangs on – only the eyes and the mouth were left (user feedback, November
// 2026). The copy's ids get a tag, and every reference in the copy follows them.
test("a copy of the screen points its references at its own ids", () => {
  const ids = new Set(["origin-skin", "label"]);
  expect(renameIdRefs("url(#origin-skin)", ids, "--copy1", "fill")).toBe("url(#origin-skin--copy1)");
  expect(renameIdRefs('fill: url("#origin-skin"); stroke: url(#other)', ids, "--copy1", "style")).toBe('fill: url("#origin-skin--copy1"); stroke: url(#other)');
  expect(renameIdRefs("#origin-skin", ids, "--copy1", "href")).toBe("#origin-skin--copy1");
  expect(renameIdRefs("/zaehne/#top", ids, "--copy1", "href")).toBe("/zaehne/#top");
  expect(renameIdRefs("label other", ids, "--copy1", "aria-labelledby")).toBe("label--copy1 other");
  expect(renameIdRefs("#fff", ids, "--copy1", "fill")).toBe("#fff");
});

test("every copy of the screen gets ids of its own", async () => {
  const source = await Bun.file("src/lib/bookTravel.ts").text();
  expect(/function seenCopy[\s\S]*?\n}/.exec(source)?.[0]).toContain("ownIds(copy)");
});
