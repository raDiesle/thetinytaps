// The marble run's route: where the middle of a marble goes, from the hopper
// at the top left down to the basket at the bottom right, in the coordinates
// of the 1600 × 900 picture. The drawing in TrackLevel.tsx is laid out along
// the same numbers.

export interface Pt {
  x: number;
  y: number;
}

export const BALL_R = 22;

/** Something along the way that sounds or moves when a marble gets there. */
export type TrackEvent =
  | { kind: "note"; bar: number }
  | { kind: "bell" }
  | { kind: "swirl" }
  | { kind: "wheel" }
  | { kind: "seesaw" }
  | { kind: "basket" };

/* ---------- Layout ---------- */

export const HOPPER = { x: 120, y: 22 };

/** Row 1, from the hopper down to the bell. */
export const ROW1 = { from: { x: 145, y: 123 }, to: { x: 1488, y: 205 } };
export const row1Y = (x: number) => ROW1.from.y + ((x - ROW1.from.x) * (ROW1.to.y - ROW1.from.y)) / (ROW1.to.x - ROW1.from.x);

/** Xylophone bars lying in row 1. */
export const BARS = Array.from({ length: 8 }, (_, i) => ({ x: 420 + i * 94, w: 86 }));

export const BELL = { pivot: { x: 1542, y: 146 } };

export const FUNNEL = { cx: 1400, rimY: 300, rx: 116, ry: 26, spoutY: 420, spoutW: 46 };

export const ROW2 = { from: { x: 1440, y: 482 }, to: { x: 930, y: 505 } };

export const WHEEL = { cx: 820, cy: 590, r: 100, path: 75 };

export const ROW2B = { from: { x: 735, y: 663 }, to: { x: 480, y: 683 } };

/** The seesaw's beam turns around its middle; positive tilt tips the right end down. */
export const SEESAW = { cx: 330, cy: 742, half: 140, rest: -12, tipped: 12 };

export const ROW3 = { from: { x: 530, y: 773 }, to: { x: 1255, y: 800 } };

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

function line(a: Pt, b: Pt, step = 16): Pt[] {
  const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step));
  return Array.from({ length: n + 1 }, (_, i) => ({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n }));
}

function quad(a: Pt, c: Pt, b: Pt, n = 12): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
  });
}

/** An arc around (cx, cy) from angle `a0` to `a1` in degrees (SVG angles: 90 is straight down). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number): Pt[] {
  const n = Math.ceil(Math.abs(a1 - a0) / 4);
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

/** Round and round down the funnel: the circle shrinks, and its front half is lower (nearer). */
function spiral(): Pt[] {
  const turns = 2.5;
  const n = 150;
  const y0 = FUNNEL.rimY;
  const y1 = FUNNEL.spoutY - 28;
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const a = turns * 2 * Math.PI * t;
    const r = 90 * (1 - t) + 8 * t;
    return { x: FUNNEL.cx + r * Math.cos(a), y: y0 + (y1 - y0) * t + r * 0.22 * Math.sin(a) };
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

function parts(): Part[] {
  const p: Part[] = [];
  // Out of the hopper and onto row 1.
  p.push({ pts: [...line(HOPPER, { x: 120, y: 100 }), ...quad({ x: 120, y: 100 }, { x: 121, y: 122 }, ROW1.from).slice(1)] });
  // Row 1, split at every xylophone bar: crossing bar i plays note i.
  const on1 = (x: number) => ({ x, y: row1Y(x) });
  const barStart = (i: number) => BARS[i].x + 8;
  p.push({ pts: line(ROW1.from, on1(barStart(0))) });
  BARS.forEach((bar, i) => {
    const end = i + 1 < BARS.length ? barStart(i + 1) : bar.x + bar.w;
    p.push({ pts: line(on1(barStart(i)), on1(end)), event: { kind: "note", bar: i } });
  });
  const last = BARS[BARS.length - 1];
  p.push({ pts: line(on1(last.x + last.w), on1(1466)) });
  // Ding! into the bell, then down to the funnel.
  p.push({ pts: line(on1(1466), ROW1.to), event: { kind: "bell" } });
  p.push({ pts: [...quad(ROW1.to, { x: 1492, y: 212 }, { x: 1491, y: 240 }), ...line({ x: 1491, y: 240 }, { x: 1490, y: FUNNEL.rimY }).slice(1)] });
  // Round and round the funnel.
  const swirl = spiral();
  p.push({ pts: swirl, event: { kind: "swirl" }, speed: 430 });
  const out = swirl[swirl.length - 1];
  p.push({ pts: [...line(out, { x: FUNNEL.cx, y: FUNNEL.spoutY + 10 }), ...line({ x: FUNNEL.cx, y: FUNNEL.spoutY + 10 }, { x: FUNNEL.cx, y: 484 }).slice(1)] });
  // Row 2 to the left, onto the paddle wheel, which carries it round.
  p.push({ pts: line({ x: FUNNEL.cx, y: 484 }, ROW2.to) });
  const wheelIn = arc(WHEEL.cx, WHEEL.cy, WHEEL.path, 290, 135);
  p.push({ pts: line(ROW2.to, wheelIn[0]) });
  p.push({ pts: wheelIn, event: { kind: "wheel" }, speed: 170 });
  const wheelOut = wheelIn[wheelIn.length - 1];
  p.push({ pts: quad(wheelOut, { x: wheelOut.x - 16, y: ROW2B.from.y - 6 }, ROW2B.from) });
  // Row 2b to the seesaw.
  const land = seesawSpot(0, SEESAW.rest);
  p.push({ pts: [...line(ROW2B.from, ROW2B.to), ...line(ROW2B.to, land).slice(1)] });
  p.push({ pts: line(land, seesawSpot(1, SEESAW.tipped), 4), event: { kind: "seesaw" }, speed: 140, seesaw: true });
  // Off the seesaw, through the tunnel, into the basket.
  const off = seesawSpot(1, SEESAW.tipped);
  p.push({ pts: quad(off, { x: off.x + 20, y: ROW3.from.y - 8 }, ROW3.from) });
  p.push({ pts: line(ROW3.from, ROW3.to) });
  p.push({ pts: quad(ROW3.to, { x: 1295, y: ROW3.to.y }, { x: 1322, y: 818 }), event: { kind: "basket" } });
  return p;
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

/** All parts as one list of points with their distance along the way. */
export function buildRoute(): Route {
  const pts: Pt[] = [];
  const s: number[] = [];
  const events: Route["events"] = [];
  const zones: Route["zones"] = [];
  let total = 0;
  for (const part of parts()) {
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

/** Index of the point at or before distance `d`. */
export function indexAt(route: Route, d: number): number {
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
