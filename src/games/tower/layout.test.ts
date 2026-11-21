import { describe, expect, test } from "bun:test";
import { BLOCK_WIDE, BLOCKS, blockAt, digitLeft, fallenAt, feetAt, goalPlace, leafPile, treeAt, towerLayout } from "./layout";
import { GOAL_ORDER } from "./names";

// The whole tower, the child on top and the goal above it are seen at once on every screen: a phone on its side and
// upright, a tablet, a computer.
const SCREENS = [
  [844, 390],
  [640, 360],
  [390, 844],
  [1024, 768],
  [1280, 720],
  [1920, 1080],
] as const;

describe.each(SCREENS)("%i × %i", (w, h) => {
  const l = towerLayout(w, h);
  const inside = (x: number, y: number, what: string) => {
    expect(x, what).toBeGreaterThanOrEqual(0);
    expect(x, what).toBeLessThanOrEqual(w);
    expect(y, what).toBeGreaterThanOrEqual(0);
    expect(y, what).toBeLessThanOrEqual(h);
  };

  test("all ten blocks, the child on the tenth and the waiting block are on the screen", () => {
    for (let k = 1; k <= BLOCKS; k++) {
      const p = blockAt(l, k);
      inside(p.x - (BLOCK_WIDE * l.b) / 2, p.y - l.b / 2, `block ${k}`);
      inside(p.x + (BLOCK_WIDE * l.b) / 2, p.y + l.b / 2, `block ${k}`);
    }
    const top = feetAt(l, BLOCKS);
    inside(top.x - l.kidW / 2, top.y - l.kidH, "the child's head");
    inside(l.waiting.x - (BLOCK_WIDE * l.b) / 2 + 0.01, l.waiting.y - l.b / 2, "the waiting block");
  });

  test.each(GOAL_ORDER)("the %s is on the screen, out of reach at nine blocks and reached at ten", (goal) => {
    const { box, reach } = goalPlace(l, goal);
    inside(box.left, box.top, goal);
    inside(box.right, box.bottom, goal);
    // What of the child takes it: the raised paw a string or the plane, the head the nest and the hollow, the feet what
    // it climbs onto.
    const paw = 0.64 * l.kidH;
    const part: Record<typeof goal, number> = {
      balloon: paw,
      kite: paw,
      plane: paw,
      nest: l.kidH,
      owl: l.kidH,
      cloud: 0,
      rainbow: 0,
      bird: 0,
      hotair: 0,
      moon: 0,
    };
    const childAt = (n: number) => feetAt(l, n).y - part[goal];
    // At ten it is right there; at nine it is near, but plainly out of reach.
    expect(Math.abs(childAt(BLOCKS) - reach.y), goal).toBeLessThan(1.2 * l.b);
    expect(childAt(BLOCKS - 1) - reach.y, goal).toBeGreaterThan(0.6 * l.b);
  });

  test("the big number stays clear of the tower, the tree and the goals", () => {
    // „100“ is the widest, at three quarters of the size: three digits of about 0.6 of the font's size each.
    const digit = { left: digitLeft(l), right: l.digit.x + 0.68 * l.digitSize, top: l.digit.y - 0.5 * l.digitSize, bottom: l.digit.y + 0.5 * l.digitSize };
    if (l.h <= l.w) {
      inside(digit.left, digit.top, "the number");
      inside(digit.right, digit.bottom, "the number");
    }
    type Box = { left: number; right: number; top: number; bottom: number };
    const apart = (a: Box, b: Box) => a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top;
    // Upright, the number stands up in the sky, above everything the goals need.
    const number = l.h > l.w ? { left: l.digit.x - 0.68 * l.digitSize, right: l.digit.x + 0.68 * l.digitSize, top: digit.top, bottom: digit.bottom } : digit;
    for (const goal of GOAL_ORDER) {
      expect(apart(number, goalPlace(l, goal).box), goal).toBe(true);
    }
    // The tree stands only in rounds of two-digit numbers (11–20, 81–90).
    const tree = treeAt(l);
    const twoDigits = { ...number, left: Math.max(number.left, l.digit.x - 0.6 * l.digitSize) };
    expect(apart(twoDigits, { left: tree.trunk - 2 * l.b, right: tree.trunk + 2 * l.b, top: tree.top - 2 * l.b, bottom: l.ground }), "the tree").toBe(true);
    const top = blockAt(l, BLOCKS);
    expect(apart(number, { left: top.x - 2 * l.b, right: top.x + 2 * l.b, top: top.y - l.kidH, bottom: l.ground }), "the tower").toBe(true);
  });

  test("the tumbled blocks lie on the meadow on the screen, the leaf pile too", () => {
    for (let k = 1; k <= BLOCKS; k++) {
      const p = fallenAt(l, k);
      inside(p.x - (BLOCK_WIDE * l.b) / 2, p.y, `fallen block ${k}`);
      expect(p.y, `fallen block ${k}`).toBeLessThan(l.ground);
    }
    inside(leafPile(l).x, leafPile(l).y, "the leaf pile");
  });
});
