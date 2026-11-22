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
 * The wooden star in the middle of the board, turning on its axle: a marble
 * that hits one of its five arms knocks it round, and a turning star flicks
 * the marble off to the side. For the marbles it is a round thing as big as
 * its arms reach (`r`); the nails that would stand in its way are left out.
 */
export const STAR = { x: 800, y: PEG_TOP + 3 * PEG_ROW_STEP, r: 58 } as const;
/** How many arms the star has. */
export const STAR_ARMS = 5;

/**
 * The ladybug that comes once the board has started to fill: it crawls to and
 * fro along a painted vine below the last row of nails, over the bins' tops,
 * and a marble landing on its back bounces off with a „boing“ – often into
 * the next bin. Round for the marbles; `r` is its shell.
 */
export const LADYBUG = { y: 611, r: 20, left: BOARD.left + 60, right: BOARD.right - 60, speed: 130 } as const;

/** Whether a nail at `p` would stand too close to the star for a marble to pass between. */
const besideStar = (p: Pt) => Math.hypot(p.x - STAR.x, p.y - STAR.y) < STAR.r + 2 * BALL_R + PEG_R + 8;

/**
 * The nails, row by row. Rows with an odd number also get a nail in each side
 * wall, so a marble that slides down along the wall is pushed back in. Round
 * the star in the middle there are none.
 */
export const PEGS: Peg[] = Array.from({ length: PEG_ROWS }, (_, row) => {
  const y = PEG_TOP + row * PEG_ROW_STEP;
  const count = (BOARD.right - BOARD.left) / PEG_STEP;
  return row % 2 === 0
    ? Array.from({ length: count }, (_, k) => ({ x: BOARD.left + PEG_STEP * (k + 0.5), y, row }))
    : Array.from({ length: count + 1 }, (_, k) => ({ x: BOARD.left + PEG_STEP * k, y, row }));
})
  .flat()
  .filter((p) => !besideStar(p));

/** What moves on the board besides the marbles: the star's turn and the ladybug on its vine. */
export interface Movers {
  /** The star's angle (radians) and how fast it turns (radians a second, + clockwise in the picture). */
  starAngle: number;
  starSpin: number;
  /** Whether the ladybug is on its vine yet, where it is, and which way it crawls (+1 right, -1 left). */
  bug: boolean;
  bugX: number;
  bugDir: 1 | -1;
}

/** The board as it stands before the first tap: the star still, no ladybug yet. */
export const stillMovers = (): Movers => ({ starAngle: 0, starSpin: 0, bug: false, bugX: (LADYBUG.left + LADYBUG.right) / 2, bugDir: 1 });

/** How fast the star slows down by itself, per second. */
const STAR_FRICTION = 1.1;
/** The star never turns faster than this, however many marbles hit it. */
const STAR_MAX_SPIN = 9;

/**
 * Moves the star and the ladybug on by `dt` seconds. The ladybug crawls only
 * while marbles fall (`busy`), so the board is still again once they all lie.
 */
export function stepMovers(m: Movers, dt: number, busy: boolean) {
  m.starAngle += m.starSpin * dt;
  m.starSpin *= Math.exp(-dt * STAR_FRICTION);
  if (Math.abs(m.starSpin) < 0.05) m.starSpin = 0;
  if (m.bug && busy) {
    m.bugX += m.bugDir * LADYBUG.speed * dt;
    if (m.bugX > LADYBUG.right) {
      m.bugX = LADYBUG.right;
      m.bugDir = -1;
    } else if (m.bugX < LADYBUG.left) {
      m.bugX = LADYBUG.left;
      m.bugDir = 1;
    }
  }
}

/** Whether the star or the ladybug is moving (the level draws on while they do). */
export const moversMoving = (m: Movers, busy: boolean) => m.starSpin !== 0 || (m.bug && busy);

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

/** A marble hit the star or the ladybug, this hard. */
export type OnMover = (part: "star" | "bug", speed: number) => void;

/** The star: bounce off its round reach, turn it by the push along its rim, and let a turning star carry the marble along. */
function hitStar(b: Falling, m: Movers, random: () => number) {
  const vx = b.vx;
  const vy = b.vy;
  const hit = bounceOff(b, STAR, STAR.r, 0.35, random);
  if (hit === 0) return 0;
  // Along the rim, clockwise in the picture (y points down).
  const reach = STAR.r + BALL_R;
  const nx = (b.x - STAR.x) / reach;
  const ny = (b.y - STAR.y) / reach;
  const along = vx * -ny + vy * nx;
  m.starSpin = Math.max(-STAR_MAX_SPIN, Math.min(STAR_MAX_SPIN, m.starSpin + (along / STAR.r) * 0.6));
  const rim = m.starSpin * STAR.r * 0.35;
  b.vx += -ny * rim;
  b.vy += nx * rim;
  return hit;
}

/** The ladybug: bounce off its shell as it crawls, with a spring in it. */
function hitBug(b: Falling, m: Movers, busy: boolean, random: () => number) {
  const bugV = busy ? m.bugDir * LADYBUG.speed : 0;
  b.vx -= bugV;
  const hit = bounceOff(b, { x: m.bugX, y: LADYBUG.y }, LADYBUG.r, 0.75, random);
  b.vx += bugV;
  return hit;
}

/**
 * Moves a falling marble on by `dt` seconds: gravity, the nails, the star and
 * the ladybug (`movers` as they stand; `busy` while the ladybug crawls), the
 * side walls and the dividers. `onPeg` hears each nail that rings, with how
 * hard it was hit, and `onMover` each knock on the star or the ladybug.
 */
export function fall(
  b: Falling,
  dt: number,
  random: () => number,
  onPeg: (peg: number, speed: number) => void,
  movers?: Movers,
  busy = true,
  onMover?: OnMover,
) {
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
    if (movers) {
      const star = hitStar(b, movers, random);
      if (star > RING_SPEED) onMover?.("star", star);
      if (movers.bug) {
        const bug = hitBug(b, movers, busy, random);
        if (bug > RING_SPEED) onMover?.("bug", bug);
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
