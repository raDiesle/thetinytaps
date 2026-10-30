// The marble run's route: where the middle of a marble goes, from the hopper
// at the top left down to the basket at the bottom right, in the coordinates
// of a wall 1600 wide and two and a half screens tall (the camera follows the
// marbles down). Six spots along the way hold a part that can be swapped by
// tapping it (X-08), and a switch sends the marble one of two ways (K-01), so
// the route comes in sections: the fixed stretches between them, one section
// for every part in every spot, and one for each way at the switch. The
// drawing in TrackLevel.tsx is laid out along the same numbers.

import { arc, BALL_R, indexAt, line, quad, type Pt } from "./path";

/** The whole wall; the picture shows 1600 × 900 of it (more on a tall screen). */
export const TRACK_W = 1600;
export const TRACK_H = 2250;

/** The parts that fit into a spot. */
export type Piece = "bell" | "trampoline" | "funnel" | "wheel";

/** In the order a tap on a spot goes through them. */
export const PIECES: Piece[] = ["bell", "trampoline", "funnel", "wheel"];

/** Something along the way that sounds or moves when a marble gets there. */
export type TrackEvent =
  | { kind: "note"; bar: number }
  | { kind: Piece; slot: number }
  | { kind: "seesaw" }
  | { kind: "bump"; turn: number }
  | { kind: "loop" }
  | { kind: "drum"; drum: number }
  | { kind: "chime"; chime: number }
  | { kind: "tunnel" }
  | { kind: "flap"; fork: number }
  | { kind: "gate" }
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

/** After the second spot the marble rolls over a ledge, hits the wall on the right and drops onto row 2. */
export const LEDGE = { x0: 1490, x1: 1552, y: 455 };

export const ROW2: Row = { from: { x: 1550, y: 497 }, to: { x: 1000, y: 520 } };

/**
 * The barrier on row 2, just before the funnel (K-02): closed, the marbles wait
 * in a row behind it until the child taps it. `x` is where the first one stops.
 */
export const GATE = { x: 1090 };

export const ROW2B: Row = { from: { x: 720, y: 663 }, to: { x: 480, y: 683 } };

/** The seesaw's beam turns around its middle; positive tilt tips the right end down. */
export const SEESAW = { cx: 330, cy: 742, half: 140, rest: -12, tipped: 12 };

export const ROW3: Row = { from: { x: 530, y: 773 }, to: { x: 1255, y: 800 } };

export const TUNNEL = { x0: 800, x1: 1010 };

/** The middle of the tunnel, out of sight: here a marble changes (K-06). */
export const TUNNEL_MID = (TUNNEL.x0 + TUNNEL.x1) / 2;

/** Below the tunnel the marble zigzags down the right edge, hitting a wall at every turn, and goes on left on row 4. */
export const ZIGS: Row[] = [
  { from: { x: 1300, y: 868 }, to: { x: 1530, y: 888 } },
  { from: { x: 1550, y: 958 }, to: { x: 1300, y: 978 } },
  { from: { x: 1280, y: 1048 }, to: { x: 1530, y: 1068 } },
];
export const ROW4: Row = { from: { x: 1550, y: 1138 }, to: { x: 1060, y: 1160 } };

/** Where a switch can send the marble (K-01). */
export type Way = "left" | "right";

/**
 * The switch at the end of row 3 (K-01): a flap on a hinge with a thick lever.
 * Lifted, the marble rolls on to the right and zigzags down; hanging down, the
 * marble knocks against it (its face is at `face`) and drops onto the left way,
 * over a xylophone of its own, against the left wall and back. Both ways meet on
 * row 4 at `join`.
 */
export const SWITCH = { hinge: { x: 1300, y: 720 }, length: 100, face: 1291 };
export const LEFT1: Row = { from: { x: 1225, y: 880 }, to: { x: 420, y: 918 } };
export const LEFT2: Row = { from: { x: 445, y: 990 }, to: { x: 1200, y: 1028 } };
export const JOIN: Pt = { x: 1180, y: rowY(ROW4, 1180) };

/** After the fourth spot: once round the looping (the marble's middle goes round this circle), then on to the left edge. */
export const LOOP = { cx: 430, cy: 1230, r: 110 };
export const ROW4B: Row = { from: { x: 790, y: 1308 }, to: { x: LOOP.cx, y: LOOP.cy + LOOP.r } };
export const LOOP_OUT: Row = { from: ROW4B.to, to: { x: 110, y: 1356 } };

/** Row 5 drops the marble onto three drums, big to small; it hops from one to the next. */
export const ROW5: Row = { from: { x: 66, y: 1425 }, to: { x: 250, y: 1440 } };
export const DRUMS = [
  { x: 350, top: 1520, r: 64, h: 74 },
  { x: 530, top: 1548, r: 54, h: 62 },
  { x: 700, top: 1576, r: 44, h: 52 },
];
/** Where the marble's middle is when it hits a drum's skin. */
export const drumHit = (i: number): Pt => ({ x: DRUMS[i].x, y: DRUMS[i].top - BALL_R - 2 });
export const ROW5B: Row = { from: { x: 850, y: 1598 }, to: { x: 1010, y: 1606 } };

export const ROW6: Row = { from: { x: 1280, y: 1754 }, to: { x: 1530, y: 1766 } };

/** Row 7 runs under hanging chimes, longest first; the marble knocks each one as it passes. */
export const ROW7: Row = { from: { x: 1550, y: 1836 }, to: { x: 620, y: 1862 } };
export const CHIME_BEAM = { x0: 664, x1: 976, y: 1700 };
export const CHIMES = [940, 880, 820, 760, 700].map((x, i) => ({ x, length: 118 - i * 14 }));

/** Rows 8 and 9: after the last spot to the left edge, then over a second xylophone into the basket. */
export const ROW8: Row = { from: { x: 350, y: 2010 }, to: { x: 110, y: 2022 } };
export const ROW9: Row = { from: { x: 66, y: 2090 }, to: { x: 1250, y: 2140 } };

/** Xylophone bars lying in rows 1a and 1b, a whole scale on row 9 just before the basket, and four on the switch's left way. */
export const BARS = Array.from({ length: 20 }, (_, i) => {
  if (i < 4) return { x: 230 + i * 84, w: 76, row: ROW1A };
  if (i < 8) return { x: 890 + (i - 4) * 84, w: 76, row: ROW1B };
  if (i < 16) return { x: 300 + (i - 8) * 84, w: 76, row: ROW9 };
  return { x: 470 + (i - 16) * 84, w: 76, row: LEFT1 };
});

/**
 * Where the marble rolls against a wall and drops onto the row below, going
 * back the other way: `x` is the wall's face, and every wall has a bumper.
 */
export interface Turn {
  from: Pt;
  to: Pt;
  x: number;
  /** Where the wall ends below, when a row passes under it; otherwise a little under `to`. */
  bottom?: number;
}

/** A wall on the right of the marble (1) or on its left (-1). */
export const turnSide = (turn: Turn) => (turn.x > turn.from.x ? 1 : -1);

/* The turns are listed after the spots, which the first one starts from. */

export const BASKET = { x0: 1300, x1: 1530, rimY: 2180, bottomY: 2235 };

/** Where marbles come to rest in the basket: four peeking over the rim, then piled on top. */
export const BASKET_SLOTS: Pt[] = [
  { x: 1345, y: 2176 },
  { x: 1392, y: 2178 },
  { x: 1439, y: 2178 },
  { x: 1486, y: 2176 },
  { x: 1368, y: 2136 },
  { x: 1462, y: 2136 },
  { x: 1415, y: 2134 },
  { x: 1415, y: 2096 },
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
  { from: ROW4.to, to: ROW4B.from, dir: -1 },
  { from: ROW5B.to, to: ROW6.from, dir: 1 },
  { from: ROW7.to, to: ROW8.from, dir: -1 },
];

/** What the run looks like before anyone swaps a part; the funnel is in the spot after the barrier. */
export const DEFAULT_BUILD: Piece[] = ["bell", "wheel", "funnel", "trampoline", "bell", "funnel"];

export const TURNS: Turn[] = [
  { from: SLOTS[1].to, to: ROW2.from, x: 1578 },
  { from: ZIGS[0].to, to: ZIGS[1].from, x: 1578 },
  { from: ZIGS[1].to, to: ZIGS[2].from, x: 1252 },
  { from: ZIGS[2].to, to: ROW4.from, x: 1578 },
  { from: LOOP_OUT.to, to: ROW5.from, x: 28 },
  { from: ROW6.to, to: ROW7.from, x: 1578 },
  { from: ROW8.to, to: ROW9.from, x: 28 },
  // The switch's left way: against the left wall, and against the zigzag's wall from the other side down onto row 4.
  { from: LEFT1.to, to: LEFT2.from, x: 385 },
  { from: LEFT2.to, to: JOIN, x: 1234, bottom: 1110 },
];

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

interface Part {
  pts: Pt[];
  /** Fired when a marble starts this part. */
  event?: TrackEvent;
  /** Fixed speed in px/s instead of rolling downhill. */
  speed?: number;
  /** The marble rides the seesaw; its spot depends on the beam's tilt. */
  seesaw?: boolean;
}

/** Along a row, split at each stop (in the order the marble passes them), which fires its event. */
function rowParts(row: Row, stops: { x: number; event: TrackEvent }[] = []): Part[] {
  const on = (x: number) => ({ x, y: rowY(row, x) });
  const xs = [row.from.x, ...stops.map((stop) => stop.x), row.to.x];
  return xs.slice(1).map((x, i) => ({ pts: line(on(xs[i]), on(x)), event: i ? stops[i - 1].event : undefined }));
}

/** Crossing bar i plays note i; on a row going left the bars come in the other order. */
function barStops(row: Row) {
  const right = row.to.x > row.from.x;
  const stops = BARS.flatMap((bar, i) =>
    bar.row === row ? [{ x: right ? bar.x + 8 : bar.x + bar.w - 8, event: { kind: "note", bar: i } as TrackEvent }] : [],
  );
  return right ? stops : stops.reverse();
}

/** Against the wall of turn `i` (its bumper sounds) and down onto the next row. */
function turnPart(i: number): Part {
  const turn = TURNS[i];
  return { pts: quad(turn.from, { x: turn.x - turnSide(turn) * 4, y: turn.from.y + 3 }, turn.to), event: { kind: "bump", turn: i } };
}

/** The fixed sections: hopper to the first spot, between the spots and the switch, and from the last spot to the basket. */
function fixedParts(): Part[][] {
  const start: Part[] = [
    { pts: [...line(HOPPER, { x: 120, y: 88 }), ...quad({ x: 120, y: 88 }, { x: 121, y: 108 }, ROW1A.from).slice(1)] },
    ...rowParts(ROW1A, barStops(ROW1A)),
  ];
  const middle = rowParts(ROW1B, barStops(ROW1B));
  // Against the wall, down onto row 2, past the barrier and along it to the third spot.
  const turn: Part[] = [turnPart(0), ...rowParts(ROW2, [{ x: GATE.x, event: { kind: "gate" } }])];
  // Row 2b to the seesaw, off it and through the tunnel to the switch.
  const land = seesawSpot(0, SEESAW.rest);
  const off = seesawSpot(1, SEESAW.tipped);
  const tunnel: Part[] = [
    { pts: [...line(ROW2B.from, ROW2B.to), ...line(ROW2B.to, land).slice(1)] },
    { pts: line(land, off, 4), event: { kind: "seesaw" }, speed: 140, seesaw: true },
    { pts: quad(off, { x: off.x + 20, y: ROW3.from.y - 8 }, ROW3.from) },
    ...rowParts(ROW3, [{ x: TUNNEL_MID, event: { kind: "tunnel" } }]),
  ];
  // Where both ways of the switch meet, along row 4 to the fourth spot.
  const afterSwitch: Part[] = rowParts({ from: JOIN, to: ROW4.to });
  // Once round the looping, against the left wall, and hop, hop, hop over the drums.
  const hop = (a: Pt, b: Pt): Pt[] => quad(a, { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 170 }, b, 20);
  const drums: Part[] = [
    ...rowParts(ROW4B),
    { pts: arc(LOOP.cx, LOOP.cy, LOOP.r, 90, 450), event: { kind: "loop" }, speed: 560 },
    ...rowParts(LOOP_OUT),
    turnPart(4),
    ...rowParts(ROW5),
    { pts: quad(ROW5.to, { x: ROW5.to.x + 50, y: ROW5.to.y }, drumHit(0)) },
    ...DRUMS.map((_, i): Part => ({ pts: hop(drumHit(i), i + 1 < DRUMS.length ? drumHit(i + 1) : ROW5B.from), event: { kind: "drum", drum: i } })),
    ...rowParts(ROW5B),
  ];
  // Against the right wall and under the chimes.
  const chimes: Part[] = [
    ...rowParts(ROW6),
    turnPart(5),
    ...rowParts(
      ROW7,
      CHIMES.map((chime, i) => ({ x: chime.x + 14, event: { kind: "chime", chime: i } })),
    ),
  ];
  // Against the left wall, over the last xylophone into the basket.
  const end: Part[] = [
    ...rowParts(ROW8),
    turnPart(6),
    ...rowParts(ROW9, barStops(ROW9)),
    { pts: quad(ROW9.to, { x: 1295, y: ROW9.to.y }, { x: 1322, y: BASKET.rimY - 22 }), event: { kind: "basket" } },
  ];
  return [start, middle, turn, tunnel, afterSwitch, drums, chimes, end];
}

/** The two ways at the switch, from the end of row 3 to where they meet on row 4. */
function wayParts(way: Way): Part[] {
  if (way === "right") {
    // Under the lifted flap, zigzag down the right edge and along row 4.
    return [
      { pts: quad(ROW3.to, { x: 1290, y: ROW3.to.y }, ZIGS[0].from) },
      ...rowParts(ZIGS[0]),
      turnPart(1),
      ...rowParts(ZIGS[1]),
      turnPart(2),
      ...rowParts(ZIGS[2]),
      turnPart(3),
      ...rowParts({ from: ROW4.from, to: JOIN }),
    ];
  }
  // Knock against the flap, drop onto the left way, over its xylophone, and back.
  return [
    { pts: quad(ROW3.to, { x: SWITCH.face - 4, y: ROW3.to.y + 3 }, LEFT1.from), event: { kind: "flap", fork: 0 } },
    ...rowParts(LEFT1, barStops(LEFT1)),
    turnPart(7),
    ...rowParts(LEFT2),
    turnPart(8),
  ];
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

/** One stretch of the run: always the same, a spot with whatever part is in it, or the switch with the way it is set to. */
export type Section = { kind: "fixed"; route: Route } | { kind: "spot"; spot: number } | { kind: "switch" };

export interface Routes {
  /** In the order a marble goes through them, from the hopper to the basket. */
  sections: Section[];
  /** For every spot, the way through each part. */
  pieces: Record<Piece, Route>[];
  /** The two ways at the switch. */
  ways: Record<Way, Route>;
  /** The section with the barrier, the distance along it where the first waiting marble's front touches it, and where row 2 begins on it (the waiting row may reach back that far). */
  gate: { section: number; s: number; start: number };
}

/**
 * All sections of the run. A marble goes fixed, spot 0, fixed, spot 1, …, with
 * the switch between the third and the fourth spot; it takes whatever part is
 * in a spot, and the way the switch is set to, when it gets there.
 */
export function buildRoutes(): Routes {
  const fixed = fixedParts().map(toRoute);
  const sections: Section[] = [];
  fixed.forEach((route, i) => {
    sections.push({ kind: "fixed", route });
    // The switch sits between the stretch through the tunnel and the one after it.
    if (i === 3) sections.push({ kind: "switch" });
    else if (i < fixed.length - 1) sections.push({ kind: "spot", spot: i < 3 ? i : i - 1 });
  });
  const gateSection = sections.findIndex((sec) => sec.kind === "fixed" && sec.route.events.some((e) => e.event.kind === "gate"));
  const gateRoute = (sections[gateSection] as { route: Route }).route;
  return {
    sections,
    pieces: SLOTS.map((_, i) => Object.fromEntries(PIECES.map((piece) => [piece, toRoute(pieceParts(i, piece))])) as Record<Piece, Route>),
    ways: { left: toRoute(wayParts("left")), right: toRoute(wayParts("right")) },
    gate: {
      section: gateSection,
      s: gateRoute.events.find((e) => e.event.kind === "gate")?.s ?? 0,
      start: gateRoute.s[gateRoute.pts.findIndex((pt) => pt.x === ROW2.from.x && pt.y === ROW2.from.y)],
    },
  };
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
