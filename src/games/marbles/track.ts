// The marble run's route: where the middle of a marble goes, from the hopper
// at the top left down to the basket at the bottom right, in the coordinates
// of the 1600 × 900 picture. Three spots along the way hold a part that can be
// swapped by tapping it (X-08), so the route comes in sections: the fixed rows
// between the spots, and one section for every part in every spot. The
// drawing in TrackLevel.tsx is laid out along the same numbers.

export interface Pt {
  x: number;
  y: number;
}

export const BALL_R = 22;

/** The parts that fit into a spot. */
export type Piece = "bell" | "trampoline" | "funnel" | "wheel";

/** In the order a tap on a spot goes through them. */
export const PIECES: Piece[] = ["bell", "trampoline", "funnel", "wheel"];

/** Something along the way that sounds or moves when a marble gets there. */
export type TrackEvent =
  | { kind: "note"; bar: number }
  | { kind: Piece; slot: number }
  | { kind: "seesaw" }
  | { kind: "basket" };

/* ---------- Layout ---------- */

export const HOPPER = { x: 120, y: 22 };

export interface Row {
  from: Pt;
  to: Pt;
}

export const rowY = (row: Row, x: number) => row.from.y + ((x - row.from.x) * (row.to.y - row.from.y)) / (row.to.x - row.from.x);

/** Row 1 is cut in two by the first spot; each half carries four xylophone bars. */
export const ROW1A: Row = { from: { x: 145, y: 110 }, to: { x: 580, y: 133 } };
export const ROW1B: Row = { from: { x: 860, y: 283 }, to: { x: 1270, y: 305 } };

/** Xylophone bars lying in rows 1a and 1b. */
export const BARS = Array.from({ length: 8 }, (_, i) => ({ x: i < 4 ? 230 + i * 84 : 890 + (i - 4) * 84, w: 76, row: i < 4 ? ROW1A : ROW1B }));

/** After the second spot the marble hits the wall on the right and drops onto row 2. */
export const LEDGE = { x0: 1490, x1: 1552, y: 455 };
export const WALL = { x: 1578, top: 380, bottom: 530 };

export const ROW2: Row = { from: { x: 1550, y: 497 }, to: { x: 1000, y: 520 } };

export const ROW2B: Row = { from: { x: 720, y: 663 }, to: { x: 480, y: 683 } };

/** The seesaw's beam turns around its middle; positive tilt tips the right end down. */
export const SEESAW = { cx: 330, cy: 742, half: 140, rest: -12, tipped: 12 };

export const ROW3: Row = { from: { x: 530, y: 773 }, to: { x: 1255, y: 800 } };

export const TUNNEL = { x0: 800, x1: 1010 };

export const BASKET = { x0: 1300, x1: 1530, rimY: 840, bottomY: 895 };

/** Where marbles come to rest in the basket: four peeking over the rim, then piled on top. */
export const BASKET_SLOTS: Pt[] = [
  { x: 1345, y: 836 },
  { x: 1392, y: 838 },
  { x: 1439, y: 838 },
  { x: 1486, y: 836 },
  { x: 1368, y: 796 },
  { x: 1462, y: 796 },
  { x: 1415, y: 794 },
  { x: 1415, y: 756 },
];

/** Marbles in the basket that make it full. */
export const BASKET_FULL = 6;

/* ---------- Things that roll (K-07) ---------- */

/** Something that can roll down the run; with the shelf on, the child picks which. */
export type Roller = "marble" | "tennis" | "iron" | "apple" | "bubble";

export const ROLLERS: Roller[] = ["marble", "tennis", "iron", "apple", "bubble"];

/** How a thing rolls. */
export interface RollerKind {
  /** Radius on the run; bigger things are drawn a little higher, so they still sit on the rail. */
  r: number;
  /** How fast it goes compared to a marble, in the parts with a fixed speed too. */
  pace: number;
  /** Floats along at an even speed instead of rolling faster downhill. */
  float?: boolean;
}

export const ROLLER: Record<Roller, RollerKind> = {
  marble: { r: BALL_R, pace: 1 },
  tennis: { r: 24, pace: 1.1 },
  iron: { r: 25, pace: 0.55 },
  apple: { r: 24, pace: 0.85 },
  bubble: { r: 27, pace: 0.8, float: true },
};

/** The shelf over row 1a with three things to pick from, drawn this much bigger than on the run. */
export const SHELF = { x0: 205, x1: 560, y: 74, things: [262, 382, 502], scale: 1.55 };

/** The middle of `kind` lying in the i-th place on the shelf. */
export const shelfSpot = (i: number, kind: Roller): Pt => ({ x: SHELF.things[i], y: SHELF.y - ROLLER[kind].r * SHELF.scale });

/* ---------- Spots ---------- */

/** A spot for a part: the marble comes in at `from` (top) and leaves at `to` (bottom), moving `dir` (1: to the right). */
export interface Slot {
  from: Pt;
  to: Pt;
  dir: 1 | -1;
}

export const SLOTS: Slot[] = [
  { from: ROW1A.to, to: ROW1B.from, dir: 1 },
  { from: ROW1B.to, to: { x: 1530, y: LEDGE.y }, dir: 1 },
  { from: ROW2.to, to: ROW2B.from, dir: -1 },
];

/** What the run looks like before anyone swaps a part: bell, funnel, paddle wheel. */
export const DEFAULT_BUILD: Piece[] = ["bell", "funnel", "wheel"];

export const slotMiddle = (slot: Slot): Pt => ({ x: (slot.from.x + slot.to.x) / 2, y: (slot.from.y + slot.to.y) / 2 });

/** The board behind a spot, which is also where a tap swaps the part. */
export function slotBoard(slot: Slot) {
  const x0 = Math.min(slot.from.x, slot.to.x);
  return { x: x0, y: slot.from.y - 70, w: Math.abs(slot.to.x - slot.from.x), h: slot.to.y - slot.from.y + 130 };
}

/** The bell hangs over the middle of a chute, low enough for the marble to touch it. */
export const bellIn = (slot: Slot) => {
  const m = slotMiddle(slot);
  return { pivot: { x: m.x, y: m.y - 80 } };
};

/** The marble drops onto the mat, a bit before the middle, and bounces over to the way out. */
export const trampolineIn = (slot: Slot) => {
  const m = slotMiddle(slot);
  return { x: m.x - slot.dir * 34, y: slot.to.y + BALL_R + 4, half: 70 };
};

export const funnelIn = (slot: Slot) => {
  const m = slotMiddle(slot);
  return { cx: m.x, rimY: slot.from.y + 25, rx: 105, ry: 24, spoutY: slot.to.y - 40, spoutW: 46 };
};

export const wheelIn = (slot: Slot) => {
  const m = slotMiddle(slot);
  return { cx: m.x, cy: m.y, r: 100, path: 75 };
};

/** Where the wheel picks the marble up and puts it down again, in SVG degrees; it carries it over the top. */
const wheelAngles = (slot: Slot) => (slot.dir > 0 ? [230, 410] : [310, 130]);

/* ---------- Seesaw ---------- */

const rad = (deg: number) => (deg * Math.PI) / 180;

/** The middle of a marble lying on the beam, `u` from its middle, while the beam is tilted by `tilt` degrees. */
export function onSeesaw(u: number, tilt: number): Pt {
  const a = rad(tilt);
  const lift = BALL_R + 8;
  return { x: SEESAW.cx + u * Math.cos(a) + lift * Math.sin(a), y: SEESAW.cy + u * Math.sin(a) - lift * Math.cos(a) };
}

/** Where the marble lands on the beam, and where it rolls off. */
const SEESAW_LAND = 122;
const SEESAW_OFF = 160;
/** Share of the seesaw part spent waiting for the beam to tip. */
const SEESAW_WAIT = 0.45;

/** Distance along the seesaw part (0–1) → spot on the beam, at the beam's current tilt. */
export function seesawSpot(k: number, tilt: number): Pt {
  const roll = Math.max(0, (k - SEESAW_WAIT) / (1 - SEESAW_WAIT));
  return onSeesaw(SEESAW_LAND + (SEESAW_OFF - SEESAW_LAND) * roll * roll, tilt);
}

/* ---------- Building the route ---------- */

export function line(a: Pt, b: Pt, step = 16): Pt[] {
  const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step));
  return Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
}

export function quad(a: Pt, c: Pt, b: Pt, n = 12): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
  });
}

/** An arc around (cx, cy) from angle `a0` to `a1` in degrees (SVG angles: 90 is straight down). */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number): Pt[] {
  const n = Math.ceil(Math.abs(a1 - a0) / 4);
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

interface Part {
  pts: Pt[];
  /** Fired when a marble starts this part. */
  event?: TrackEvent;
  /** Fixed speed in px/s instead of rolling downhill. */
  speed?: number;
  /** The marble rides the seesaw; its spot depends on the beam's tilt. */
  seesaw?: boolean;
}

/** Along a row, split at every xylophone bar on it: crossing bar i plays note i. */
function rowParts(row: Row): Part[] {
  const on = (x: number) => ({ x, y: rowY(row, x) });
  const bars = BARS.map((bar, i) => ({ ...bar, i })).filter((bar) => bar.row === row);
  const barStart = (k: number) => bars[k].x + 8;
  const last = bars[bars.length - 1];
  return [
    { pts: line(row.from, on(barStart(0))) },
    ...bars.map((bar, k): Part => {
      const end = k + 1 < bars.length ? barStart(k + 1) : bar.x + bar.w;
      return { pts: line(on(barStart(k)), on(end)), event: { kind: "note", bar: bar.i } };
    }),
    { pts: line(on(last.x + last.w), row.to) },
  ];
}

/** The fixed sections: hopper to the first spot, between the spots, and from the last spot to the basket. */
function fixedParts(): Part[][] {
  const start: Part[] = [
    { pts: [...line(HOPPER, { x: 120, y: 88 }), ...quad({ x: 120, y: 88 }, { x: 121, y: 108 }, ROW1A.from).slice(1)] },
    ...rowParts(ROW1A),
  ];
  const middle = rowParts(ROW1B);
  // Against the wall, down onto row 2 and along it to the last spot.
  const turn: Part[] = [{ pts: quad(SLOTS[1].to, { x: WALL.x - 4, y: LEDGE.y + 3 }, ROW2.from) }, { pts: line(ROW2.from, ROW2.to) }];
  // Row 2b to the seesaw, off it through the tunnel into the basket.
  const land = seesawSpot(0, SEESAW.rest);
  const off = seesawSpot(1, SEESAW.tipped);
  const end: Part[] = [
    { pts: [...line(ROW2B.from, ROW2B.to), ...line(ROW2B.to, land).slice(1)] },
    { pts: line(land, off, 4), event: { kind: "seesaw" }, speed: 140, seesaw: true },
    { pts: quad(off, { x: off.x + 20, y: ROW3.from.y - 8 }, ROW3.from) },
    { pts: line(ROW3.from, ROW3.to) },
    { pts: quad(ROW3.to, { x: 1295, y: ROW3.to.y }, { x: 1322, y: 818 }), event: { kind: "basket" } },
  ];
  return [start, middle, turn, end];
}

/** Round and round down the funnel: the circle shrinks, and its front half is lower (nearer). */
function spiral(slot: Slot): Pt[] {
  const f = funnelIn(slot);
  const turns = 2;
  const n = 120;
  const a0 = slot.dir > 0 ? Math.PI : 0;
  const y0 = f.rimY;
  const y1 = f.spoutY - 20;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const a = a0 - slot.dir * turns * 2 * Math.PI * t;
    const r = 85 * (1 - t) + 8 * t;
    return { x: f.cx + r * Math.cos(a), y: y0 + (y1 - y0) * t + r * 0.22 * Math.sin(a) };
  });
}

/** The way through `piece` in spot `index`, from the spot's `from` to its `to`. */
function pieceParts(index: number, piece: Piece): Part[] {
  const slot = SLOTS[index];
  const { from, to, dir } = slot;
  const event: TrackEvent = { kind: piece, slot: index };
  switch (piece) {
    case "bell": {
      // Down a chute under the bell; it rings as the marble touches it.
      const ring = { x: from.x + (to.x - from.x) * 0.42, y: from.y + (to.y - from.y) * 0.42 };
      return [{ pts: line(from, ring) }, { pts: line(ring, to), event }];
    }
    case "trampoline": {
      // Off the edge, down onto the mat and up in a big hop to the way out.
      const tr = trampolineIn(slot);
      const mat = { x: tr.x, y: to.y };
      return [{ pts: quad(from, { x: from.x + dir * 60, y: from.y }, mat, 16) }, { pts: quad(mat, { x: (mat.x + to.x) / 2, y: to.y - 230 }, to, 24), event }];
    }
    case "funnel": {
      const f = funnelIn(slot);
      const swirl = spiral(slot);
      const out = swirl[swirl.length - 1];
      return [
        { pts: quad(from, { x: from.x + dir * 30, y: from.y }, swirl[0]) },
        { pts: swirl, event, speed: 430 },
        { pts: [...line(out, { x: f.cx, y: f.spoutY + 10 }), ...line({ x: f.cx, y: f.spoutY + 10 }, { x: f.cx + dir * 6, y: to.y }).slice(1)] },
        { pts: line({ x: f.cx + dir * 6, y: to.y }, to) },
      ];
    }
    case "wheel": {
      const w = wheelIn(slot);
      const [a0, a1] = wheelAngles(slot);
      const ride = arc(w.cx, w.cy, w.path, a0, a1);
      const off = ride[ride.length - 1];
      return [{ pts: line(from, ride[0]) }, { pts: ride, event, speed: 170 }, { pts: quad(off, { x: off.x + dir * 16, y: to.y - 6 }, to) }];
    }
  }
}

export interface Route {
  pts: Pt[];
  /** Distance along the route at every point. */
  s: number[];
  total: number;
  events: { s: number; event: TrackEvent }[];
  /** Parts with a fixed speed or a moving seesaw, and what they are. */
  zones: { s0: number; s1: number; speed?: number; seesaw?: boolean; kind?: TrackEvent["kind"] }[];
}

/** Parts as one list of points with their distance along the way. */
function toRoute(parts: Part[]): Route {
  const pts: Pt[] = [];
  const s: number[] = [];
  const events: Route["events"] = [];
  const zones: Route["zones"] = [];
  let total = 0;
  for (const part of parts) {
    const s0 = total;
    part.pts.forEach((pt, i) => {
      if (pts.length && i === 0) return;
      if (pts.length) total += Math.hypot(pt.x - pts[pts.length - 1].x, pt.y - pts[pts.length - 1].y);
      pts.push(pt);
      s.push(total);
    });
    if (part.event) events.push({ s: s0, event: part.event });
    if (part.speed || part.seesaw) zones.push({ s0, s1: total, speed: part.speed, seesaw: part.seesaw, kind: part.event?.kind });
  }
  return { pts, s, total, events, zones };
}

export interface Routes {
  /** The fixed sections, one more than there are spots. */
  fixed: Route[];
  /** For every spot, the way through each part. */
  pieces: Record<Piece, Route>[];
}

/**
 * All sections of the run. A marble goes fixed 0, spot 0, fixed 1, spot 1, …;
 * it takes whatever part is in a spot when it gets there.
 */
export function buildRoutes(): Routes {
  return {
    fixed: fixedParts().map(toRoute),
    pieces: SLOTS.map((_, i) => Object.fromEntries(PIECES.map((piece) => [piece, toRoute(pieceParts(i, piece))])) as Record<Piece, Route>),
  };
}

/** Index of the point at or before distance `d`. */
export function indexAt(route: Pick<Route, "s">, d: number): number {
  let lo = 0;
  let hi = route.s.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (route.s[mid] <= d) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Spot and downhill slope (dy/ds) at distance `d`. */
export function pointAt(route: Route, d: number): { pt: Pt; slope: number } {
  const i = Math.min(indexAt(route, d), route.pts.length - 2);
  const a = route.pts[i];
  const b = route.pts[i + 1];
  const len = route.s[i + 1] - route.s[i] || 1;
  const k = Math.min(1, Math.max(0, (d - route.s[i]) / len));
  return { pt: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }, slope: (b.y - a.y) / len };
}
