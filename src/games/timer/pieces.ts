// Piece by piece instead of flowing (H-45): an apple falls every minute, the train halts at a little stop every minute.
// A small child sees single things at once, where a flowing picture is hard to judge – and a long time still moves.

/** At most this many apples hang on the tree: beyond 30 minutes each apple stands for a little more than a minute. */
export const MAX_APPLES = 30;

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

/** The moments (ms after the start) when a piece is done before the end: an apple lands in the basket, the train reaches a stop. */
export function pieceMoments(total: number, pieces: number, early = 0): number[] {
  const unit = total / pieces;
  return Array.from({ length: pieces - 1 }, (_, i) => (i + 1) * unit - early);
}

/**
 * Where `count` apples hang in a crown of radii `rx` × `ry` round 0 0, spread evenly (each next one as far as it can be
 * from those before), returned from left to right – the order they fall in, so the tree empties in one direction.
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
  return chosen.sort((a, b) => a.x - b.x || a.y - b.y);
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
