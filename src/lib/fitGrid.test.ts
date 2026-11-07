import { describe, expect, test } from "bun:test";
import { packGroups } from "./fitGrid";

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
