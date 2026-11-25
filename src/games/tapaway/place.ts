// Where the next letter, number or shape of „Magic Keys“ lands: quick presses one after the other show several things
// at once (user request, 24 November 2026), and each stands beside the others as long as there is room – only a full
// page lets a new one overlap, where it covers the least.

/** Something on the page: its middle and how far it reaches round it, in px. */
export interface Placed {
  x: number;
  y: number;
  reach: number;
}

/** The room to place in: its width and height, and a strip kept free at its top, in px. */
export interface Room {
  width: number;
  height: number;
  top: number;
}

/** How many places are tried for each new thing. */
const TRIES = 60;

/** A middle inside the room for something reaching `reach` round it: (u, v) from 0 to 1 across what is free. */
function inRoom(room: Room, reach: number, u: number, v: number) {
  const span = (from: number, to: number, t: number) => (to > from ? from + (to - from) * t : (from + to) / 2);
  return { x: span(reach, room.width - reach, u), y: span(room.top + reach, room.height - reach, v) };
}

/** How far `x, y` keeps clear of everything `taken` (negative: it overlaps by that much). */
function clearance(x: number, y: number, reach: number, taken: readonly Placed[]) {
  let least = Number.POSITIVE_INFINITY;
  for (const t of taken) least = Math.min(least, Math.hypot(t.x - x, t.y - y) - reach - t.reach);
  return least;
}

/**
 * A place for something reaching `reach` round its middle: by chance among the places clear of everything `taken`, else
 * the one that overlaps least. `random` is `Math.random` unless a test passes its own.
 */
export function freeSpot(room: Room, reach: number, taken: readonly Placed[], random: () => number = Math.random) {
  let best = inRoom(room, reach, random(), random());
  let bestClear = clearance(best.x, best.y, reach, taken);
  for (let i = 1; i < TRIES && bestClear < 0; i++) {
    const at = inRoom(room, reach, random(), random());
    const clear = clearance(at.x, at.y, reach, taken);
    if (clear > bestClear) [best, bestClear] = [at, clear];
  }
  return best;
}
