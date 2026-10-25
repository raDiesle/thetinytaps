// „Nagelbrett“ (K-13): the board's numbers and the marbles' simple physics, kept
// free of React so the test can drop many marbles and check none gets stuck.

import { BALL_R, type Pt } from "./path";

/** The inside of the board, between its two side walls, in the picture's pixels. */
export const BOARD = { left: 160, right: 1440, top: 40 } as const;
/** Where a new marble appears, above the nails. */
export const SPAWN_Y = 86;
/** A new marble never starts closer than this to a side wall. */
export const SPAWN_MARGIN = 40;

/** Rows of nails, top to bottom. */
export const PEG_ROWS = 7;
/** Height of the first row and the distance between rows. */
export const PEG_TOP = 176;
export const PEG_ROW_STEP = 66;
/** Distance between nails in a row; every other row is shifted by half of it. */
export const PEG_STEP = 128;
/** A nail's head. */
export const PEG_R = 9;

/** The five bins at the bottom, each with an animal waiting in it. */
export const BINS = 5;
export const BIN_W = (BOARD.right - BOARD.left) / BINS;
/** Where the dividers between the bins start, and the bins' floor. */
export const BIN_TOP = 640;
export const FLOOR = 870;
/** Half the thickness of a divider. */
export const DIVIDER_R = 7;

/** A nail: where it is and which row it's in (the row picks its note). */
export interface Peg extends Pt {
  row: number;
}

/**
 * The nails, row by row. Rows with an odd number also get a nail in each side
 * wall, so a marble that slides down along the wall is pushed back in.
 */
export const PEGS: Peg[] = Array.from({ length: PEG_ROWS }, (_, row) => {
  const y = PEG_TOP + row * PEG_ROW_STEP;
  const count = (BOARD.right - BOARD.left) / PEG_STEP;
  return row % 2 === 0
    ? Array.from({ length: count }, (_, k) => ({ x: BOARD.left + PEG_STEP * (k + 0.5), y, row }))
    : Array.from({ length: count + 1 }, (_, k) => ({ x: BOARD.left + PEG_STEP * k, y, row }));
}).flat();

/** The dividers between the bins: x of each, running from `BIN_TOP` to the floor. */
export const DIVIDERS = Array.from({ length: BINS - 1 }, (_, j) => BOARD.left + BIN_W * (j + 1));

/** The middle of bin `i`. */
export const binCenter = (i: number) => BOARD.left + BIN_W * (i + 0.5);

/** Which bin is under `x`. */
export const binAt = (x: number) => Math.max(0, Math.min(BINS - 1, Math.floor((x - BOARD.left) / BIN_W)));

/** Keeps a drop point inside the board, away from the walls. */
export const clampDrop = (x: number) => Math.max(BOARD.left + SPAWN_MARGIN, Math.min(BOARD.right - SPAWN_MARGIN, x));

/** Marbles in a bin lie in rows on its floor: five, then four in the dips between them. */
export const PILE_ROWS = [5, 4] as const;
/** Every place a marble can lie in a bin, relative to the bin's middle and the floor; lowest row first. */
export const PILE_SLOTS: Pt[] = PILE_ROWS.flatMap((n, r) =>
  Array.from({ length: n }, (_, c) => ({ x: (c - (n - 1) / 2) * (BALL_R * 2 + 2), y: -BALL_R - r * (BALL_R * 1.7) })),
);

/**
 * The free place in a bin a marble at `x` (relative to the bin's middle) rolls
 * to: the nearest one in the lowest row with room, or -1 when the bin is full.
 */
export function freeSlot(taken: boolean[], x: number) {
  let start = 0;
  for (const n of PILE_ROWS) {
    let best = -1;
    for (let k = start; k < start + n; k++) {
      if (!taken[k] && (best < 0 || Math.abs(PILE_SLOTS[k].x - x) < Math.abs(PILE_SLOTS[best].x - x))) best = k;
    }
    if (best >= 0) return best;
    start += n;
  }
  return -1;
}

/** Gravity, slower than real so the child can follow the marble down. */
const GRAVITY = 1500;
/** How much of its speed into a nail a marble keeps when it bounces off. */
const PEG_BOUNCE = 0.45;
const WALL_BOUNCE = 0.4;
/** A random sideways push on every bounce, so a marble never balances on top of a nail. */
const NUDGE = 60;
const MAX_SPEED = 1000;
/** Small fixed steps, so a fast marble can't jump through a nail. */
const SUBSTEP = 1 / 240;
/** A nail rings only when hit at least this hard, and not again right after (while the marble rolls over it). */
const RING_SPEED = 70;
const RING_AGAIN_S = 0.15;

/** A marble on its way down. */
export interface Falling extends Pt {
  vx: number;
  vy: number;
  /** Seconds since it appeared. */
  age: number;
  /** The nail it hit last (an index into `PEGS`), and when. */
  lastPeg: number;
  lastPegAt: number;
}

/** A new marble above `x`, about to fall. */
export const newFalling = (x: number, random: () => number): Falling => ({
  x: clampDrop(x),
  y: SPAWN_Y,
  vx: (random() - 0.5) * 20,
  vy: 0,
  age: 0,
  lastPeg: -1,
  lastPegAt: -1,
});

/** Pushes the marble out of a round thing at `c` (a nail, the top of a divider) and bounces it off; the speed it hit with, or 0. */
function bounceOff(b: Falling, c: Pt, r: number, bounce: number, random: () => number) {
  const dx = b.x - c.x;
  const dy = b.y - c.y;
  const reach = BALL_R + r;
  const d2 = dx * dx + dy * dy;
  if (d2 >= reach * reach) return 0;
  const d = Math.sqrt(d2);
  // Exactly on top: pick a side, so it can't stay there.
  const nx = d > 0.01 ? dx / d : random() < 0.5 ? -1 : 1;
  const ny = d > 0.01 ? dy / d : 0;
  b.x = c.x + nx * reach;
  b.y = c.y + ny * reach;
  const vn = b.vx * nx + b.vy * ny;
  if (vn >= 0) return 0;
  b.vx -= (1 + bounce) * vn * nx;
  b.vy -= (1 + bounce) * vn * ny;
  // A little push along the surface, more to the side the marble is already on.
  const side = Math.abs(nx) < 0.15 ? (random() < 0.5 ? -1 : 1) : Math.sign(nx);
  b.vx += side * NUDGE * (0.3 + random() * 0.7);
  return -vn;
}

/**
 * Moves a falling marble on by `dt` seconds: gravity, the nails, the side walls
 * and the dividers. `onPeg` hears each nail that rings, with how hard it was hit.
 */
export function fall(b: Falling, dt: number, random: () => number, onPeg: (peg: number, speed: number) => void) {
  const steps = Math.max(1, Math.ceil(dt / SUBSTEP));
  const h = dt / steps;
  for (let s = 0; s < steps; s++) {
    b.age += h;
    b.vy += GRAVITY * h;
    const speed = Math.hypot(b.vx, b.vy);
    if (speed > MAX_SPEED) {
      b.vx *= MAX_SPEED / speed;
      b.vy *= MAX_SPEED / speed;
    }
    b.x += b.vx * h;
    b.y += b.vy * h;
    // Only the nails in the rows next to the marble can touch it.
    const row = Math.round((b.y - PEG_TOP) / PEG_ROW_STEP);
    if (row >= -1 && row <= PEG_ROWS) {
      for (let i = 0; i < PEGS.length; i++) {
        const peg = PEGS[i];
        if (Math.abs(peg.row - row) > 1) continue;
        const hit = bounceOff(b, peg, PEG_R, PEG_BOUNCE, random);
        if (hit > RING_SPEED && (i !== b.lastPeg || b.age - b.lastPegAt > RING_AGAIN_S)) onPeg(i, hit);
        if (hit > 0) {
          b.lastPeg = i;
          b.lastPegAt = b.age;
        }
      }
    }
    // The dividers: a round top, then a straight wall down to the floor.
    if (b.y > BIN_TOP - BALL_R) {
      for (const x of DIVIDERS) {
        if (b.y < BIN_TOP) bounceOff(b, { x, y: BIN_TOP }, DIVIDER_R, WALL_BOUNCE, random);
        else if (Math.abs(b.x - x) < BALL_R + DIVIDER_R) {
          const side = b.x < x ? -1 : 1;
          b.x = x + side * (BALL_R + DIVIDER_R);
          if (b.vx * side < 0) b.vx = -b.vx * WALL_BOUNCE;
        }
      }
    }
    if (b.x < BOARD.left + BALL_R) {
      b.x = BOARD.left + BALL_R;
      b.vx = Math.abs(b.vx) * WALL_BOUNCE;
    } else if (b.x > BOARD.right - BALL_R) {
      b.x = BOARD.right - BALL_R;
      b.vx = -Math.abs(b.vx) * WALL_BOUNCE;
    }
  }
}

/** Physical keyboard rows (by `KeyboardEvent.code`, so the same place on any layout), top to bottom. */
const KEY_ROWS = [
  ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"],
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  ["IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"],
];

/**
 * Where on the board a key drops its marble, from 0 (left) to 1 (right): as far
 * along as the key sits in its keyboard row. Null for keys outside the rows.
 */
export function keySpot(code: string): number | null {
  for (const row of KEY_ROWS) {
    const i = row.indexOf(code);
    if (i >= 0) return (i + 0.5) / row.length;
  }
  return null;
}

/** The x a key drops its marble at; keys outside the letter rows drop at a random place. */
export function keyDropX(code: string, random: () => number) {
  const spot = keySpot(code) ?? random();
  return BOARD.left + SPAWN_MARGIN + spot * (BOARD.right - BOARD.left - 2 * SPAWN_MARGIN);
}
