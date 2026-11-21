import { BLOCKS, type GoalId } from "./names";

export { BLOCKS };

// Where everything of the Counting Tower stands, in pixels of the stage, from its width and height. All ten blocks, the
// child on top and the goal above it are seen at once on every screen (a phone on its side too), so the child sees the
// tower grow towards its goal and the whole count stands there at the end. Pure numbers, so `layout.test.ts` checks
// that nothing leaves the stage.

/** A block's width for its height (the tower's step, `b`). */
export const BLOCK_WIDE = 1.8;

/** The child's height for one block, and its width for its height (`Mascot`'s 200 × 300). */
export const KID_TALL = 1.75;
export const KID_WIDE = 2 / 3;

/**
 * Where each block's middle stands beside the tower's line, in block widths: a little further off with every block, to
 * the left and the right in turn, so the tower looks ever less steady – each block brings more suspense.
 */
export const BLOCK_SHIFT = [0, 0.04, -0.03, 0.06, -0.05, 0.08, -0.06, 0.1, -0.08, 0.11];

/** How far the tower sways once after the k-th block landed (degrees, from its foot): more the higher it is. */
export const SWAY_DEG = [0, 0, 0.4, 0.6, 0.9, 1.2, 1.6, 2.1, 2.7, 3.2];

/** A point on the stage. */
export interface Point {
  x: number;
  y: number;
}

/** The stage measured: the block's height `b`, the meadow's line, the tower's foot and what stands round it. */
export interface TowerLayout {
  w: number;
  h: number;
  /** A block's height, the tower's step. */
  b: number;
  /** Where the tower and the child stand: the meadow's top line. */
  ground: number;
  /** The tower's line, the middle of its foot. */
  x: number;
  /** The child's height and width. */
  kidH: number;
  kidW: number;
  /** The middle of the next block, waiting on the meadow left of the tower. */
  waiting: Point;
  /** The middle of the big digit, right of the tower. */
  digit: Point;
  /** The digit's size (its font size). */
  digitSize: number;
}

/** Lays the stage out. */
export function towerLayout(w: number, h: number): TowerLayout {
  // 10 blocks, the child on top and the goal above it, with a little meadow under the tower.
  const b = Math.max(8, Math.min(h / 14.2, w / 9));
  const ground = h - 0.5 * b;
  const x = w * 0.4;
  const kidH = KID_TALL * b;
  return {
    w,
    h,
    b,
    ground,
    x,
    kidH,
    kidW: kidH * KID_WIDE,
    waiting: { x: x - 2.7 * b, y: ground - 0.5 * b },
    // Beside the tower on a wide screen; upright, where the goals reach far over to the right, up in the empty sky.
    digit: { x: w * 0.82, y: h > w ? h * 0.15 : h * 0.48 },
    digitSize: Math.min(h * 0.42, w * 0.22),
  };
}

/** The middle of the k-th block (1 to 10) on the tower. */
export function blockAt(l: TowerLayout, k: number): Point {
  return { x: l.x + BLOCK_SHIFT[k - 1] * BLOCK_WIDE * l.b, y: l.ground - (k - 0.5) * l.b };
}

/** Where the child's feet stand with `n` blocks under it: on the top block's middle, or on the meadow. */
export function feetAt(l: TowerLayout, n: number): Point {
  return n === 0 ? { x: l.x, y: l.ground } : { x: blockAt(l, n).x, y: l.ground - n * l.b };
}

/** A rectangle on the stage. */
export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * What each goal needs placed: the spot the child reaches with ten blocks under it (its raised paw for a string or the
 * paper plane, its head for the nest and the owl's hollow, its feet for what it climbs onto), and the goal's own middle,
 * size and box (its HTML layer).
 */
export interface GoalPlace {
  /** The goal's middle. */
  at: Point;
  /** Its size (the balloon's, kite's and moon's height, the nest's, plane's, cloud's and rainbow's width). */
  size: number;
  /** Where the child takes it: the end of the string, the nest's hollow, where its feet go onto it. */
  reach: Point;
  /** The goal's layer. */
  box: Box;
  /** Where the rainbow's slide ends, on the meadow. */
  end?: Point;
}

/** A box of `w` × `h` round `at`. */
const around = (at: Point, w: number, h: number): Box => ({ left: at.x - w / 2, top: at.y - h / 2, right: at.x + w / 2, bottom: at.y + h / 2 });

/** The left edge of the big digit with „100“ in it, the widest it gets. */
export const digitLeft = (l: TowerLayout) => (l.h > l.w ? l.w : l.digit.x - 0.68 * l.digitSize);

/** The rainbow's bands, top to bottom, and each band's width in blocks. */
export const RAINBOW = ["#ff6b6b", "#ffa94d", "#ffe066", "#8ce99a", "#74c0fc", "#b197fc"];
export const BAND = 0.17;

/** Where the goal waits, from where the child will stand on the tenth block. */
export function goalPlace(l: TowerLayout, goal: GoalId): GoalPlace {
  const { b, kidH, kidW } = l;
  const top = feetAt(l, BLOCKS);
  const head = top.y - kidH;
  // The raised right paw (`Mascot`'s cheering pose).
  const paw = { x: top.x + 0.36 * kidW, y: head + 0.36 * kidH };
  switch (goal) {
    case "balloon":
    case "kite": {
      // A string's end just above the raised paw: out of reach at nine, in the paw at ten. The kite flies further out.
      const size = goal === "balloon" ? 1.45 * b : 1.5 * b;
      const at = goal === "balloon" ? { x: paw.x + 1.15 * b, y: paw.y - 1.55 * b } : { x: paw.x + 1.7 * b, y: paw.y - 1.45 * b };
      const w = (size * 100) / 120;
      return { at, size, reach: paw, box: { left: at.x - w / 2, top: at.y - size / 2, right: at.x + w / 2, bottom: paw.y + 0.1 * b } };
    }
    case "plane": {
      // The paper plane hangs in the air just past the paw, its tail where the paw will close round it.
      const size = 1.5 * b;
      const at = { x: paw.x + 0.95 * b, y: paw.y - 0.3 * b };
      return { at, size, reach: paw, box: around(at, size, size * 0.6) };
    }
    case "nest":
    case "owl": {
      // The nest (or the owl's hollow) on the branch's end, just above the child's head on the tenth block.
      const reach = { x: top.x + 0.9 * b, y: head - 0.15 * b };
      const size = 1.5 * b;
      return { at: reach, size, reach, box: around(reach, size, size / 2) };
    }
    case "cloud": {
      // A cloud low beside the top: one step over, and the child stands on it.
      const reach = { x: top.x + 1.75 * b, y: top.y - 0.45 * b };
      const size = 3 * b;
      const at = { x: reach.x, y: reach.y + 0.35 * b };
      return { at, size, reach, box: around(at, size, size / 2) };
    }
    case "rainbow": {
      // The rainbow starts at the tower's top and arcs down to the meadow on the right: a slide.
      const reach = { x: top.x + 0.75 * b, y: top.y - 0.1 * b };
      const end = { x: Math.min(l.x + 8 * b, digitLeft(l) - 0.8 * b), y: l.ground };
      const box = { left: reach.x - 0.6 * b, top: reach.y - 1.6 * b, right: end.x + 0.6 * b, bottom: l.ground };
      return { at: { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 }, size: box.right - box.left, reach, box, end };
    }
    case "bird": {
      // The big bird circles up right; at ten it lands beside the top, its back where the child's feet are.
      const size = 2.4 * b;
      const at = { x: top.x + 2.9 * b, y: head - 0.1 * b };
      return { at, size, reach: { x: top.x + 1.15 * b, y: top.y - 0.05 * b }, box: around(at, size, size * 0.8) };
    }
    case "hotair": {
      // The hot-air balloon waits beside the top, its basket's floor a step above the tenth block (100 × 150, the floor
      // at 140).
      const reach = { x: top.x + 1.6 * b, y: top.y - 0.35 * b };
      const size = 2.2 * b;
      const height = size * 1.5;
      const bottom = reach.y + (10 / 150) * height;
      const box = { left: reach.x - size / 2, top: bottom - height, right: reach.x + size / 2, bottom };
      return { at: { x: reach.x, y: bottom - height / 2 }, size, reach, box };
    }
    case "moon": {
      // The crescent hangs right of the tower, low enough for the child to climb into its hollow.
      const size = 3 * b;
      const at = { x: top.x + 1.7 * b, y: head - 0.05 * b };
      return { at, size, reach: { x: at.x - 0.09 * size, y: at.y + 0.23 * size }, box: around(at, size, size) };
    }
  }
}

/** The tree that holds the nest: its trunk's middle and the top of its trunk, right of the tower. */
export function treeAt(l: TowerLayout): { trunk: number; top: number } {
  return { trunk: l.x + 3.4 * l.b, top: l.ground - 11.3 * l.b };
}

/** The leaf pile at the tree's foot the child jumps into at the nest's end. */
export function leafPile(l: TowerLayout): Point {
  return { x: l.x + 2.4 * l.b, y: l.ground };
}

/**
 * Where the k-th block lies once the tower has tumbled: in a heap on the meadow to the left, the top ones furthest, each
 * lying on its side or tipped (degrees).
 */
export function fallenAt(l: TowerLayout, k: number): Point & { turn: number } {
  // The bottom block only tips over where it stood; the higher a block, the further it rolls.
  const reach = Math.min(6 * l.b, l.x - 1.3 * l.b);
  const turn = FALLEN_TURN[k - 1];
  const r = (turn * Math.PI) / 180;
  // Half its height as it lies, so it rests on the meadow whether flat, tipped or on its side.
  const half = (Math.abs(Math.cos(r)) * l.b + Math.abs(Math.sin(r)) * BLOCK_WIDE * l.b) / 2;
  return { x: l.x - 0.3 * l.b - ((k - 1) / (BLOCKS - 1)) * reach, y: l.ground - half, turn };
}

/** How each block lies after the tumble: some flat, some tipped, some on their side. */
const FALLEN_TURN = [-12, 90, 8, -90, 14, 270, -6, 96, 180, -84];
