import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { bestFit, PICTURE_CARDS, packGroups, pictureWidth } from "./fitGrid";

describe("packGroups", () => {
  test("a small group sits beside an earlier one when the row has room", () => {
    // Three groups of 3, 8 and 1 cards.
    const { places, lines } = packGroups([3, 8, 1], 4);
    expect(lines).toEqual([1, 2]);
    expect(places[2]).toEqual({ column: 3, row: 0, line: 0, width: 1, height: 1 });
    expect(places[1]).toEqual({ column: 0, row: 1, line: 1, width: 4, height: 2 });
  });

  test("a group longer than a row has its lines to itself", () => {
    const { places, lines } = packGroups([3, 1, 5], 2);
    expect(lines).toEqual([2, 1, 3]);
    expect(places.map((p) => [p.row, p.column])).toEqual([
      [0, 0],
      [2, 0],
      [3, 0],
    ]);
  });

  test("with columns reserved, a one-row group after a long one stands beside it instead of below", () => {
    // The Timer: ten pictures, then „Abwechseln“ on its own.
    const { places, lines } = packGroups([10, 1], 5, 1);
    expect(lines).toEqual([3]);
    expect(places[0]).toEqual({ column: 0, row: 0, line: 0, width: 4, height: 3 });
    expect(places[1]).toEqual({ column: 4, row: 0, line: 0, width: 1, height: 1 });
    // Without a reserve it gets a line of its own below.
    expect(packGroups([10, 1], 5).lines).toEqual([2, 1]);
    // Two ways of taking turns stand one above the other in a reserved column.
    const two = packGroups([10, 2], 4, 1);
    expect(two.lines).toEqual([4]);
    expect(two.places[1]).toEqual({ column: 3, row: 0, line: 0, width: 1, height: 2 });
    // The last group has nothing to leave room for.
    expect(packGroups([1, 10], 5, 1).places[1].width).toBe(5);
  });

  test("every card has a cell, and no two groups overlap", () => {
    for (const sizes of [[3, 8, 1], [1, 1, 1, 1, 1], [7], [2, 5, 2, 1], [10, 1], [10, 2, 1], [10, 2], [6, 3, 2]])
      for (let columns = 1; columns <= 8; columns++)
        for (let reserve = 0; reserve < columns; reserve++) {
          const { places, lines } = packGroups(sizes, columns, reserve);
          const taken = new Set<string>();
          places.forEach((p, i) => {
            expect(p.width * p.height).toBeGreaterThanOrEqual(sizes[i]);
            expect(p.column + p.width).toBeLessThanOrEqual(columns);
            for (let r = p.row; r < p.row + p.height; r++)
              for (let c = p.column; c < p.column + p.width; c++) {
                expect(taken.has(`${r},${c}`)).toBe(false);
                taken.add(`${r},${c}`);
              }
          });
          expect(Math.max(...places.map((p) => p.row + p.height))).toBe(lines.reduce((a, b) => a + b, 0));
        }
  });
});

describe("bestFit", () => {
  test("the Timer's sixteen timed pictures and its three of taking turns fit a tablet's screen", () => {
    // Measured at 1024 × 768: the list 969 px wide, 424 px of room under the head above the families.
    const fit = bestFit(19, 969, 424, false, [16, 3], 1.6);
    expect(fit).toEqual({ columns: 7, row: 113, reserve: 1 });
  });

  test("cards with titles keep their wider minimum", () => {
    // The same room for nineteen cards with words: seven columns would leave each too narrow for its title.
    expect(bestFit(19, 969, 424, false, [16, 3])).toBeNull();
  });
});

describe("cards with a preview picture", () => {
  // User feedback, 25 November 2026, from Lebendige Welten's menus: the name stands in one line under a picture as big
  // as the room allows – never beside a small picture, broken into lines, or on the picture.
  test("are fitted for the biggest picture, never flat", () => {
    // Bewegungsabenteuer on a tablet: three cards in a row, each picture nearly the card's width.
    const fit = bestFit(3, 969, 450, false, undefined, PICTURE_CARDS);
    expect(fit?.columns).toBe(3);
    expect(pictureWidth((969 - 2 * 24) / 3, fit?.row ?? 0, false)).toBeGreaterThan(280);
  });

  test("take all the room on a phone or tablet, and stop growing only on a big screen", () => {
    // „Wie geht's dir?“ on a tablet: two cards, 969 × 390 px of room. Capped, their pictures were 333 px wide with a
    // third of the room left empty under and beside them (user request, November 2026).
    const tablet = bestFit(2, 969, 390, false, undefined, PICTURE_CARDS, false);
    const big = bestFit(2, 969, 390, false, undefined, PICTURE_CARDS, true);
    expect(tablet?.row).toBe(390);
    expect(big?.row).toBe(280);
    expect(pictureWidth((969 - 24) / 2, tablet?.row ?? 0, false)).toBeGreaterThan(450);
  });

  test("scroll rather than shrink their pictures past recognising", () => {
    // Kettenreaktion's 21 machines on a phone on its side: all at once only as pictures about 54 px wide.
    expect(bestFit(21, 805, 222, true, undefined, PICTURE_CARDS)).toBeNull();
  });

  test("keep their name in one line under the picture", () => {
    const css = readFileSync("src/styles/book.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const name = css.match(/:root \.game-card\.picture-card > \.game-title \{([^}]*)\}/)?.[1] ?? "";
    expect(name).toContain("white-space: nowrap");
    expect(name).not.toContain("position: absolute");
    // No rule lays the picture over the card (the name once lay on Kettenreaktion's pictures).
    expect(css).not.toMatch(/\.picture-card[^{]*\.with-picture\s*\{[^}]*position:\s*absolute/);
  });

  test("a table of contents shrinks its names alike rather than letting a long one push its line off the page", () => {
    // Bewegungsabenteuer on a phone on its side reached past the screen's edge once the lines grew (November 2026).
    const css = readFileSync("src/styles/book.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css.match(/\n\.toc-title \{([^}]*)\}/)?.[1]).toContain("max-width: 100%");
    expect(css.match(/\n\.toc-line \{([^}]*)\}/)?.[1]).toContain("min-width: 0");
    for (const size of css.matchAll(/\.toc-title \{[^}]*font-size:([^;]*);/g)) expect(size[1]).toContain("var(--name-fit, 1)");
    expect(readFileSync("src/components/BookContents.tsx", "utf8")).toContain('fitNames(list, ".toc-title")');
  });
});
