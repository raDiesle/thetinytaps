import { describe, expect, test } from "bun:test";
import { FLOOR, KINDS, layOutRow, leavesOf, pickAnimals, plannedSeconds } from "./sneeze";

/** A repeatable stand-in for Math.random, so every test run sees the same rows. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

describe("Hatschi-Kette", () => {
  const rows = Array.from({ length: 40 }, (_, i) => pickAnimals(seeded(i + 1)));

  test("the row starts with the mouse, ends with the cow and the elephant, and grows from small to big", () => {
    for (const ids of rows) {
      expect(ids[0]).toBe("mouse");
      expect(ids.slice(-2)).toEqual(["cow", "elephant"]);
      expect(new Set(ids).size).toBe(ids.length);
      ids.slice(1).forEach((id, i) => {
        expect(KINDS[id].height).toBeGreaterThan(KINDS[ids[i]].height);
      });
    }
  });

  test("the animals don't overlap, and the tree stands after the elephant", () => {
    for (const ids of rows) {
      const { seats, tree, worldW } = layOutRow(ids);
      seats.slice(1).forEach((seat, i) => {
        const before = seats[i];
        expect(before.x + (before.kind.width * before.s) / 2).toBeLessThan(seat.x - (seat.kind.width * seat.s) / 2);
      });
      const elephant = seats[seats.length - 1];
      expect(tree.crown.x - tree.r).toBeGreaterThan(elephant.x + (elephant.kind.width * elephant.s) / 2);
      expect(tree.crown.x + tree.r).toBeLessThan(worldW);
      expect(tree.crown.y - tree.r).toBeGreaterThan(0);
    }
  });

  test("a round without joining in takes 20 to 30 seconds", () => {
    for (const ids of rows) {
      const seconds = plannedSeconds(layOutRow(ids));
      expect(seconds).toBeGreaterThan(20);
      expect(seconds).toBeLessThan(30);
    }
  });

  test("every leaf lands in the grass", () => {
    const { tree, worldW } = layOutRow(rows[0]);
    for (const leaf of leavesOf(tree)) {
      expect(leaf.to.y).toBeGreaterThan(FLOOR);
      expect(leaf.to.x).toBeGreaterThan(0);
      expect(leaf.to.x).toBeLessThan(worldW);
    }
  });
});
