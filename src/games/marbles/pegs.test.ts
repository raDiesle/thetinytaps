import { describe, expect, test } from "bun:test";
import { BALL_R } from "./path";
import {
  BIN_TOP,
  BINS,
  BOARD,
  DIVIDER_R,
  DIVIDERS,
  fall,
  freeSlot,
  keySpot,
  LADYBUG,
  newFalling,
  PEG_R,
  PEGS,
  PILE_SLOTS,
  STAR,
  binAt,
  stepMovers,
  stillMovers,
} from "./pegs";

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

  test("the star and the ladybug leave a marble room to pass the nails, and never touch them", () => {
    for (const peg of PEGS) {
      expect(Math.hypot(peg.x - STAR.x, peg.y - STAR.y) - STAR.r - PEG_R).toBeGreaterThan(2 * BALL_R);
      expect(Math.abs(peg.y - LADYBUG.y)).toBeGreaterThan(PEG_R + LADYBUG.r);
    }
    expect(BIN_TOP - LADYBUG.y).toBeGreaterThan(DIVIDER_R + LADYBUG.r);
    expect(STAR.x - STAR.r).toBeGreaterThan(BOARD.left + 2 * BALL_R);
    expect(LADYBUG.left - LADYBUG.r).toBeGreaterThan(BOARD.left);
    expect(LADYBUG.right + LADYBUG.r).toBeLessThan(BOARD.right);
  });

  test("with the star turning and the ladybug crawling, every marble still gets down, and into every bin", () => {
    const random = seeded(11);
    const movers = stillMovers();
    movers.bug = true;
    const reached = new Set<number>();
    const knocked = new Set<string>();
    for (let n = 0; n < 400; n++) {
      const b = newFalling(BOARD.left + random() * (BOARD.right - BOARD.left), random);
      while (b.y < BIN_TOP + BALL_R && b.age < 6) {
        stepMovers(movers, 1 / 60, true);
        fall(
          b,
          1 / 60,
          random,
          () => {},
          movers,
          true,
          (part) => knocked.add(part),
        );
      }
      expect(b.age).toBeLessThan(6);
      expect(b.x).toBeGreaterThanOrEqual(BOARD.left + BALL_R);
      expect(b.x).toBeLessThanOrEqual(BOARD.right - BALL_R);
      for (const x of DIVIDERS) expect(Math.abs(b.x - x)).toBeGreaterThanOrEqual(BALL_R + DIVIDER_R - 0.01);
      reached.add(binAt(b.x));
    }
    expect(reached.size).toBe(BINS);
    expect([...knocked].sort()).toEqual(["bug", "star"]);
  });

  test("a marble knocks the star round, and the star slows down and stops by itself", () => {
    const random = seeded(5);
    const movers = stillMovers();
    let hits = 0;
    for (let n = 0; n < 20 && hits === 0; n++) {
      const b = newFalling(STAR.x + (random() - 0.5) * 60, random);
      while (b.y < BIN_TOP && b.age < 6)
        fall(
          b,
          1 / 60,
          random,
          () => {},
          movers,
          false,
          (part) => {
            if (part === "star") hits++;
          },
        );
    }
    expect(hits).toBeGreaterThan(0);
    expect(movers.starSpin).not.toBe(0);
    for (let i = 0; i < 60 * 12; i++) stepMovers(movers, 1 / 60, false);
    expect(movers.starSpin).toBe(0);
  });

  test("the ladybug crawls to and fro only while marbles fall", () => {
    const movers = stillMovers();
    movers.bug = true;
    const x = movers.bugX;
    stepMovers(movers, 1, false);
    expect(movers.bugX).toBe(x);
    const seen = new Set<number>();
    for (let i = 0; i < 60 * 20; i++) {
      stepMovers(movers, 1 / 60, true);
      seen.add(movers.bugDir);
      expect(movers.bugX).toBeGreaterThanOrEqual(LADYBUG.left);
      expect(movers.bugX).toBeLessThanOrEqual(LADYBUG.right);
    }
    expect(seen.size).toBe(2);
  });

  test("keys drop from left to right along their keyboard row", () => {
    expect(keySpot("KeyA")).toBeLessThan(keySpot("KeyG") ?? 0);
    expect(keySpot("KeyG")).toBeLessThan(keySpot("KeyL") ?? 0);
    expect(keySpot("Space")).toBeNull();
  });
});
