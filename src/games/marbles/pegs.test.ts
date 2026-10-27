import { describe, expect, test } from "bun:test";
import { BALL_R } from "./path";
import { BIN_TOP, BINS, BOARD, DIVIDER_R, DIVIDERS, fall, freeSlot, keySpot, newFalling, PEG_R, PEGS, PILE_SLOTS, binAt } from "./pegs";

/** A repeatable stand-in for Math.random. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

describe("Nagelbrett", () => {
  test("a marble fits between any two nails, and between a nail and a wall", () => {
    for (const [i, a] of PEGS.entries()) {
      for (const b of PEGS.slice(i + 1)) expect(Math.hypot(a.x - b.x, a.y - b.y) - 2 * PEG_R).toBeGreaterThan(2 * BALL_R);
      const wall = Math.min(a.x - BOARD.left, BOARD.right - a.x);
      if (wall > 0) expect(wall - PEG_R).toBeGreaterThan(2 * BALL_R);
    }
  });

  test("every marble gets down into a bin in a few seconds, wherever it starts", () => {
    const random = seeded(7);
    const reached = new Set<number>();
    for (let n = 0; n < 300; n++) {
      const b = newFalling(BOARD.left + random() * (BOARD.right - BOARD.left), random);
      while (b.y < BIN_TOP + BALL_R && b.age < 6) fall(b, 1 / 60, random, () => {});
      expect(b.age).toBeLessThan(6);
      expect(b.x).toBeGreaterThanOrEqual(BOARD.left + BALL_R);
      expect(b.x).toBeLessThanOrEqual(BOARD.right - BALL_R);
      for (const x of DIVIDERS) expect(Math.abs(b.x - x)).toBeGreaterThanOrEqual(BALL_R + DIVIDER_R - 0.01);
      reached.add(binAt(b.x));
    }
    expect(reached.size).toBe(BINS);
  });

  test("the nails ring on the way down", () => {
    const random = seeded(3);
    const rows = new Set<number>();
    const b = newFalling(800, random);
    while (b.y < BIN_TOP) fall(b, 1 / 60, random, (peg) => rows.add(PEGS[peg].row));
    expect(rows.size).toBeGreaterThan(3);
  });

  test("a bin fills from the floor up, nearest place first, then says it is full", () => {
    const taken = PILE_SLOTS.map(() => false);
    const first = freeSlot(taken, 200);
    expect(first).toBe(4);
    for (let n = 0; n < PILE_SLOTS.length; n++) {
      const k = freeSlot(taken, 0);
      expect(k).toBeGreaterThanOrEqual(0);
      expect(PILE_SLOTS[k].y).toBeGreaterThanOrEqual(Math.min(...PILE_SLOTS.filter((_, j) => !taken[j]).map((s) => s.y)));
      taken[k] = true;
    }
    expect(freeSlot(taken, 0)).toBe(-1);
  });

  test("keys drop from left to right along their keyboard row", () => {
    expect(keySpot("KeyA")).toBeLessThan(keySpot("KeyG") ?? 0);
    expect(keySpot("KeyG")).toBeLessThan(keySpot("KeyL") ?? 0);
    expect(keySpot("Space")).toBeNull();
  });
});
