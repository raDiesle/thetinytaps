// Piece by piece instead of flowing (H-45): the apples fall one by one, the train halts at a little stop every minute.
// A small child sees single things at once, where a flowing picture is hard to judge – and a long time still moves.

/** At most this many apples hang on the tree: each lies in the cart on its own, and the cart's heap holds this many. */
export const MAX_APPLES = 20;

/** At least this many apples, even for a few seconds: the tree is always full. */
export const MIN_APPLES = 6;

/**
 * How many apples hang on the tree for a run of `ms` (user feedback, November 2026): always a lot, also for a short
 * time – then they fall more often, one every few seconds for a minute, rather than a few apples one a minute.
 */
export function appleCount(ms: number): number {
  return Math.max(MIN_APPLES, Math.min(MAX_APPLES, Math.round(ms / 5000)));
}

/**
 * The Apfelbaum's year as shares of the run (user feedback, November 2026: the timer should show more progress): the
 * tree grows until `grown`, then the blossoms open one after the other until `bloomed`, then each blossom in turn becomes
 * an apple that swells and reddens until `ripe`, and in the rest of the time the apples fall one by one into the cart.
 */
export const APPLE_YEAR = { grown: 0.15, bloomed: 0.3, ripe: 0.45 } as const;

/** How long an apple falls from its branch into the cart, in ms (less when apples come quickly). */
export const APPLE_FALL_MS = 700;

/** How long the cart takes at most to go from one apple to the next, in ms. */
export const CART_MOVE_MS = 1500;

/** How long a blossom takes at most to open, in ms (less when blossoms come quickly, so one is open before the next). */
export const BLOSSOM_OPEN_MS = 600;

/** One apple's harvest, in ms after the start: it waits its turn swaying, the cart sets off to it, stands under it, the apple falls and lands. */
export interface AppleHarvest {
  /** The apple before has landed: this one is next and sways a second at a time until it falls. */
  sway: number;
  /** The cart sets off from the apple before (or from where it waited). */
  leave: number;
  /** The cart stands under the apple. */
  under: number;
  /** The apple lets go of its branch. */
  fall: number;
  /** The apple lies in the cart. */
  land: number;
}

/** When everything happens in the Apfelbaum's year for a run of `total` ms with `count` apples, in ms after the start. */
export interface AppleTimes {
  /** The tree is fully grown. */
  grown: number;
  /** When each apple's blossom starts to open (by the apple's index), one after the other. */
  bloom: number[];
  /** How long a blossom takes to open. */
  openMs: number;
  /** When each blossom turns into a small green apple that grows and reddens for `ripenMs` (by the apple's index), one after the other. */
  ripen: number[];
  ripenMs: number;
  /** The harvest, apple by apple in the order the apples are given (the cart's way). */
  harvest: AppleHarvest[];
}

/**
 * The rank at which apple `i` of `count` blossoms and ripens: spread over the crown (by the golden ratio), so blossoms
 * open here and there all over the tree rather than in a row.
 */
export function bloomRank(count: number): number[] {
  const keys = Array.from({ length: count }, (_, i) => ((i * 0.618034) % 1) + i * 1e-9);
  const sorted = [...keys].sort((a, b) => a - b);
  return keys.map((k) => sorted.indexOf(k));
}

/**
 * Works out the Apfelbaum's year (`APPLE_YEAR`) for a run of `total` ms with `count` apples; the last apple lands at the
 * end. Each blossom opens in its own slot and each apple comes out of its blossom in its own slot, never several at once
 * (user feedback, November 2026). In the harvest the cart rolls under the next apple just as it lets go, so it is under
 * the apple all through its fall; between apples it stands where it caught the last one.
 */
export function appleTimes(total: number, count: number): AppleTimes {
  const grown = total * APPLE_YEAR.grown;
  const bloomed = total * APPLE_YEAR.bloomed;
  const ripe = total * APPLE_YEAR.ripe;
  const rank = bloomRank(count);
  const bloomSlot = (bloomed - grown) / count;
  const ripenMs = (ripe - bloomed) / count;
  const unit = (total - ripe) / count;
  const fall = Math.min(APPLE_FALL_MS, unit * 0.35);
  const move = Math.min(CART_MOVE_MS, unit * 0.45);
  const pause = Math.min(200, unit * 0.05);
  const harvest = Array.from({ length: count }, (_, k) => {
    const sway = ripe + k * unit;
    const land = ripe + (k + 1) * unit;
    const under = land - fall - pause;
    return { sway, leave: Math.max(sway, under - move), under, fall: land - fall, land };
  });
  return {
    grown,
    bloom: rank.map((r) => grown + r * bloomSlot),
    openMs: Math.min(BLOSSOM_OPEN_MS, bloomSlot),
    ripen: rank.map((r) => bloomed + r * ripenMs),
    ripenMs,
    harvest,
  };
}

/** The whole seconds of a run, at least one: the caterpillar's bites, one a second. */
export function runSeconds(ms: number): number {
  return Math.max(1, Math.round(ms / 1000));
}

/** At most this many stretches between the train's stops, so the stops stand a finger apart on a phone. */
export const MAX_STOPS = 12;

/** How many pieces a run of `ms` is cut into: one a minute, at least one, at most `max`. */
export function pieceCount(ms: number, max: number): number {
  return Math.max(1, Math.min(max, Math.round(ms / 60_000)));
}

/** How long the train stands at each stop before the minute is over (a short halt, then on it rolls). */
export function haltMs(total: number, pieces: number): number {
  return Math.min(3000, total / pieces / 4);
}

/**
 * The train's way piece by piece, as keyframes: `at` is a share of the run (0–1), `part` how far along the track the
 * train is then (0–1). It rolls each stretch, arrives at the stop `halt` ms before the stretch's minute is over, stands
 * there and rolls on; the last stop is the station, reached as the time is up.
 */
export function trainSteps(total: number, pieces: number, halt: number): { at: number; part: number }[] {
  const unit = total / pieces;
  const steps = [{ at: 0, part: 0 }];
  for (let k = 1; k < pieces; k++) {
    steps.push({ at: (k * unit - halt) / total, part: k / pieces });
    steps.push({ at: (k * unit) / total, part: k / pieces });
  }
  steps.push({ at: 1, part: 1 });
  return steps;
}

/** The moments (ms after the start) when a piece is done before the end: a slice is lifted off, the train reaches a stop. */
export function pieceMoments(total: number, pieces: number, early = 0): number[] {
  const unit = total / pieces;
  return Array.from({ length: pieces - 1 }, (_, i) => (i + 1) * unit - early);
}

/**
 * Where `count` apples hang in a crown of radii `rx` × `ry` round 0 0, spread evenly (each next one as far as it can be
 * from those before), from right to left (`harvestOrder` puts them in the order they fall).
 */
export function applePlaces(count: number, rx: number, ry: number): { x: number; y: number }[] {
  const grid: { x: number; y: number }[] = [];
  const step = Math.min(rx, ry) / 6;
  for (let y = -ry; y <= ry; y += step) {
    for (let x = -rx; x <= rx; x += step) {
      if ((x / rx) ** 2 + (y / ry) ** 2 <= 1) grid.push({ x, y });
    }
  }
  const chosen = [grid.reduce((best, p) => (Math.hypot(p.x, p.y) > Math.hypot(best.x, best.y) ? p : best))];
  while (chosen.length < Math.min(count, grid.length)) {
    let far = grid[0];
    let farDistance = -1;
    for (const p of grid) {
      const d = Math.min(...chosen.map((c) => Math.hypot(c.x - p.x, c.y - p.y)));
      if (d > farDistance) {
        far = p;
        farDistance = d;
      }
    }
    chosen.push(far);
  }
  return chosen.sort((a, b) => b.x - a.x || a.y - b.y);
}

/**
 * The order apples of radius `r` are harvested in: the cart goes back and forth (user feedback, November 2026), each
 * time to the apple farthest from where it stands, starting from `start` (the cart's middle at rest, right of the tree)
 * – but never to one with another apple still hanging below it, which it would fall through on its way straight down
 * (user feedback, November 2026: apples fall straight down, naturally).
 */
export function harvestOrder<P extends { x: number; y: number }>(places: P[], r: number, start: number): P[] {
  const left = [...places];
  const order: P[] = [];
  let at = start;
  while (left.length > 0) {
    const free = left.filter((p) => !left.some((q) => q !== p && q.y > p.y && Math.abs(q.x - p.x) < 2 * r));
    const next = free.reduce((best, p) => (Math.abs(p.x - at) > Math.abs(best.x - at) ? p : best));
    order.push(next);
    left.splice(left.indexOf(next), 1);
    at = next.x;
  }
  return order;
}

/**
 * Gleich ist es so weit (H-49): how long before the end the bell rings once and the family waves – a minute, or for a
 * short time its last fifth, so a child can still finish what it is playing.
 */
export function soonMs(total: number): number {
  return Math.min(60_000, total / 5);
}

/** At most this many dots the ladybug leaves round the red disc (H-67), 12° apart, so they go once round at most. */
export const MAX_DOTS = 30;

/**
 * The ladybug's rounds on the red disc (H-67): it goes round about once a minute, like a clock's second hand, and leaves
 * a dot after every `every` rounds – after each one up to 30 minutes, after every second or more beyond, so the dots
 * never go further than once round. The rounds fit the time exactly, so a dot always comes as it is back at the top.
 */
export function ladybugLaps(ms: number): { dots: number; every: number; laps: number } {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  const every = Math.ceil(minutes / MAX_DOTS);
  const dots = Math.max(1, Math.round(minutes / every));
  return { dots, every, laps: dots * every };
}

/**
 * What a tally mark can stand for, from short to long; the shortest is taken that needs no more than `MAX_MARKS`, so
 * a short timer starts with many marks too (10 s: ten marks of a second, not a single one).
 */
export const MARK_UNITS = [1000, 2000, 5000, 10_000, 30_000, 60_000, 5 * 60_000, 10 * 60_000, 15 * 60_000] as const;

/** At most this many tally marks stand at the start, so they fit in a row of six bundles of five. */
export const MAX_MARKS = 30;

/**
 * How many tally marks stand at the start with „Striche in %“: many, a full row (ten were too few, user feedback,
 * November 2026), but never more than one per second of the run, so none goes quicker than a second.
 */
export function percentMarks(total: number): number {
  return Math.max(1, Math.min(MAX_MARKS, Math.round(total / 1000)));
}

/** How long one tally mark stands for in a run of `total` ms („Zeit im Bild: Striche in Zeit“). */
export function markUnit(total: number): number {
  return MARK_UNITS.find((unit) => Math.ceil(total / unit) <= MAX_MARKS) ?? MARK_UNITS[MARK_UNITS.length - 1];
}

/** How many tally marks stand while `left` ms are left: each mark still begun counts, none once the time is up. */
export function marksLeft(left: number, unit: number): number {
  return left > 0 ? Math.ceil(left / unit) : 0;
}
