// Each marble run's own stretch below row 9 (K-18): the six worlds share the
// upper run with its spots, switch and barrier, and then each goes its own way
// down the rest of the wall – the wooden run through a helix tower and a step
// lifter, the colours through hoops and over a rainbow, the snow over a ski jump
// and up a chair lift, space round a planet and through a wormhole, the water
// slide over waves, off a diving board into a whirlpool, and the building site down
// scaffold planks, up a bucket elevator and down a rubble chute. Plain numbers
// here, so the tests can check every way; each world draws its stretch along
// the same numbers (`TrackTheme.stretch`).

import { arc, BALL_R, line, type Pt, quad } from "./path";
import { BASKET, BASKET_IN, type Part, ROW9, type Row, rowParts, rowY, type Stretch, type TrackEvent, TURNS, type Turn, wallPart } from "./track";

/** Builds a stretch step by step from the end of row 9: each step starts where the one before ended. */
class Builder {
  parts: Part[] = [];
  turns: Turn[] = [];
  rails: Row[] = [];
  cues = 0;
  at: Pt = ROW9.to;

  /** The next cue's event. */
  cue(): TrackEvent {
    return { kind: "cue", cue: this.cues++ };
  }

  /** Along a straight rail to `to`, firing a cue at each x in `cues` (in the order they are passed). */
  row(to: Pt, cues: number[] = []) {
    const row = { from: this.at, to };
    this.rails.push(row);
    this.parts.push(
      ...rowParts(
        row,
        cues.map((x) => ({ x, event: this.cue() })),
      ),
    );
    this.at = to;
  }

  /** Against a wall standing at `x` and down onto the next row, which starts at `to`. */
  wall(x: number, to: Pt, bottom?: number) {
    const turn: Turn = { from: this.at, to, x, bottom };
    this.parts.push(wallPart(turn, TURNS.length + this.turns.length));
    this.turns.push(turn);
    this.at = to;
  }

  /** Along points that start where the last step ended (the first is left out if it is that same point). */
  go(pts: Pt[], extra: Omit<Part, "pts"> = {}) {
    const first = pts[0];
    const joined = Math.hypot(first.x - this.at.x, first.y - this.at.y) < 0.5 ? pts : [this.at, ...pts];
    this.parts.push({ pts: joined, ...extra });
    this.at = joined[joined.length - 1];
  }

  /** A curve from here past `c` to `b`. */
  curve(c: Pt, b: Pt, extra: Omit<Part, "pts"> = {}) {
    this.go(quad(this.at, c, b, 20), extra);
  }

  /** A straight line from here to `b`. */
  line(b: Pt, extra: Omit<Part, "pts"> = {}) {
    this.go(line(this.at, b, 12), extra);
  }

  done(): Stretch {
    return { parts: this.parts, turns: this.turns, rails: this.rails, cues: this.cues };
  }
}

/** Every stretch begins the same way: along a short row to the right wall and down onto a long row going left. */
function opening(b: Builder) {
  b.row({ x: 1530, y: 2152 });
  b.wall(1578, { x: 1550, y: 2230 });
}

/** A full turn, in radians. */
export const TAU = 2 * Math.PI;

/** How far under a thing's middle the rail it rolls on lies. */
export const UNDER = BALL_R + 7;

/** `n + 1` points of `f` from 0 to 1. */
export const sample = (n: number, f: (k: number) => Pt): Pt[] => Array.from({ length: n + 1 }, (_, i) => f(i / n));

/**
 * An SVG path along `pts`, each point moved `off` to the side of the way: to the right of the direction of travel for
 * `side` 1 (under a thing rolling to the right), to the left for -1 (under one rolling to the left) – a rail under a curve.
 */
export function railPath(pts: Pt[], off: number, side: 1 | -1 = 1): string {
  return pts
    .map((p, i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(pts.length - 1, i + 1)];
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const x = p.x - (side * off * (b.y - a.y)) / len;
      const y = p.y + (side * off * (b.x - a.x)) / len;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/* ---------- The wooden run: helix tower, step lifter, tipping troughs ---------- */

/** The helix tower: the marble runs round a pole four times on its way down, the near half of each round lower. */
export const HELIX = { cx: 560, top: 2340, r: 160, tilt: 0.25, turns: 4, drop: 840, speed: 320 };

/** The marble's middle `u` radians round the helix from where it enters, in front of the pole. */
export function helixAt(u: number): Pt {
  const a = Math.PI / 2 + u;
  return { x: HELIX.cx + HELIX.r * Math.cos(a), y: HELIX.top + (HELIX.drop * u) / (HELIX.turns * TAU) + HELIX.r * HELIX.tilt * Math.sin(a) };
}

/**
 * The step lifter, a wooden stair of upright slats that lift the marble one step
 * each and hand it on to the next: step i's slat stands at `x0 + i · run` and lifts
 * the marble from its own height `rise` up, where it rolls onto the next, a little higher.
 */
export const LIFTER = { x0: 990, y0: 3460, steps: 11, rise: 60, run: 28, speed: 150 };

/** Where the marble sits on slat i before it lifts (i = steps: on top, where it rolls off). */
export const lifterAt = (i: number): Pt => ({ x: LIFTER.x0 + i * LIFTER.run, y: LIFTER.y0 - i * (LIFTER.rise - 4) });

/** Six tipping troughs down the right edge: the marble rolls in at the high end and the trough tips it down to the next. */
export const TROUGHS: { high: Pt; low: Pt }[] = [0, 1, 2, 3, 4, 5].map((i) => {
  const y = 2900 + i * 105;
  return i % 2 === 0 ? { high: { x: 1345, y }, low: { x: 1500, y: y + 20 } } : { high: { x: 1510, y }, low: { x: 1355, y: y + 20 } };
});

/** Cues of the wooden stretch: a knock for each round of the helix, a step of the lifter, a trough tipping. */
export const WOOD_CUES = { helix: 0, lifter: HELIX.turns, troughs: HELIX.turns + LIFTER.steps };

function woodStretch(): Stretch {
  const b = new Builder();
  opening(b);
  b.row({ x: 820, y: 2262 });
  // Into the helix in front of its pole, four times round and out in front again.
  b.curve({ x: 650, y: 2268 }, helixAt(0));
  for (let turn = 0; turn < HELIX.turns; turn++) {
    b.go(
      sample(48, (k) => helixAt((turn + k) * TAU)),
      { event: b.cue(), speed: HELIX.speed },
    );
  }
  b.row({ x: 110, y: helixAt(HELIX.turns * TAU).y + 25 });
  b.wall(28, { x: 90, y: 3420 });
  b.row(lifterAt(0));
  // Up the step lifter, slat by slat.
  for (let i = 0; i < LIFTER.steps; i++) {
    const p = lifterAt(i);
    b.line({ x: p.x, y: p.y - LIFTER.rise }, { event: b.cue(), speed: LIFTER.speed });
    b.line(lifterAt(i + 1));
  }
  // Off the top and down from trough to trough into the basket.
  const top = lifterAt(LIFTER.steps);
  b.line({ x: top.x + 20, y: top.y + 1 });
  b.curve({ x: TROUGHS[0].high.x - 10, y: top.y + 6 }, TROUGHS[0].high);
  TROUGHS.forEach((trough, i) => {
    b.line(trough.low);
    const next = TROUGHS[i + 1];
    const dir = Math.sign(trough.low.x - trough.high.x);
    if (next) b.curve({ x: trough.low.x + dir * 22, y: trough.low.y + 16 }, next.high, { event: b.cue() });
    else b.curve({ x: trough.low.x + dir * 30, y: trough.low.y + 10 }, { x: 1400, y: BASKET_IN.y }, { event: b.cue() });
  });
  return b.done();
}

/* ---------- Colours: colour hoops and a rainbow ---------- */

/** The hoops the marbles roll through, red, yellow and blue (`SORT_COLORS` order), three on each of two long rows. */
export const HOOPS = { first: [1250, 850, 450], second: [400, 800, 1200], ry: 54 };

/** The rainbow the marbles roll up and over: a piece of a circle from `a0` to `a1` (SVG degrees). */
export const RAINBOW = { cx: 760, cy: 2900, r: 320, a0: 215, a1: 325 };

export const rainbowAt = (a: number): Pt => ({
  x: RAINBOW.cx + RAINBOW.r * Math.cos((a * Math.PI) / 180),
  y: RAINBOW.cy + RAINBOW.r * Math.sin((a * Math.PI) / 180),
});

/** Cues of the colour stretch: the six hoops, then the top of the rainbow. */
export const COLOR_CUES = { hoops: 0, rainbow: 6 };

/** Where the rainbow lets the marbles down again. */
const RAINBOW_OFF = rainbowAt(RAINBOW.a1);

/** The two long rows with the hoops, the first going left above the rainbow and the second going left below it. */
export const HOOP_ROWS: Row[] = [
  { from: { x: 1550, y: 2230 }, to: { x: 110, y: 2290 } },
  { from: { x: 1550, y: RAINBOW_OFF.y + 205 }, to: { x: 110, y: RAINBOW_OFF.y + 260 } },
];

/** The middle of a marble passing each hoop, in the order it passes them. */
export const HOOP_SPOTS: Pt[] = [...HOOPS.first.map((x) => ({ x, y: rowY(HOOP_ROWS[0], x) })), ...HOOPS.second.map((x) => ({ x, y: rowY(HOOP_ROWS[1], x) }))];

/** The ramp down to the rainbow's foot and the curve from its other foot to the row below, as the marble goes. */
const along = (a: number) => ({ x: -Math.sin((a * Math.PI) / 180), y: Math.cos((a * Math.PI) / 180) });
export const RAINBOW_RAMP: Pt[] = quad(
  { x: 90, y: 2370 },
  { x: rainbowAt(RAINBOW.a0).x - along(RAINBOW.a0).x * 300, y: rainbowAt(RAINBOW.a0).y - along(RAINBOW.a0).y * 300 },
  rainbowAt(RAINBOW.a0),
  20,
);
export const RAINBOW_DOWN: Pt[] = quad(
  RAINBOW_OFF,
  { x: RAINBOW_OFF.x + along(RAINBOW.a1).x * 110, y: RAINBOW_OFF.y + along(RAINBOW.a1).y * 110 },
  { x: 1180, y: RAINBOW_OFF.y + 110 },
  20,
);

/** Where a marble leaves the colour run and hops into its tube. */
export const COLOR_END: Pt = { x: 1250, y: 3372 };

function colorStretch(): Stretch {
  const b = new Builder();
  opening(b);
  b.row(HOOP_ROWS[0].to, HOOPS.first);
  b.wall(28, RAINBOW_RAMP[0]);
  // Down a ramp, through the dip and up the rainbow, along the tangent where it starts, and down from its other foot.
  b.go(RAINBOW_RAMP);
  b.go(arc(RAINBOW.cx, RAINBOW.cy, RAINBOW.r, RAINBOW.a0, 270));
  b.go(arc(RAINBOW.cx, RAINBOW.cy, RAINBOW.r, 270, RAINBOW.a1), { event: b.cue() });
  b.go(RAINBOW_DOWN);
  const end = RAINBOW_OFF;
  b.row({ x: 1530, y: end.y + 125 });
  b.wall(1578, HOOP_ROWS[1].from);
  b.row(HOOP_ROWS[1].to, HOOPS.second);
  b.wall(28, { x: 90, y: end.y + 340 });
  b.row({ x: 1530, y: end.y + 390 });
  b.wall(1578, { x: 1550, y: end.y + 470 });
  b.row({ x: 500, y: end.y + 500 });
  b.wall(452, { x: 490, y: end.y + 580 });
  b.row(COLOR_END);
  // The hoops' cues come first, the rainbow's after them.
  return renumber(b.done(), (cue) => (cue < 3 ? cue : cue === 3 ? COLOR_CUES.rainbow : cue - 1));
}

/** The same stretch with its cues numbered anew. */
function renumber(stretch: Stretch, to: (cue: number) => number): Stretch {
  return {
    ...stretch,
    parts: stretch.parts.map((part) => (part.event?.kind === "cue" ? { ...part, event: { kind: "cue", cue: to(part.event.cue) } } : part)),
  };
}

/* ---------- Snow: ski jump, chair lift and bobsleigh run ---------- */

/** The ski jump: down the inrun, off the lip, through the air and onto the landing hill. */
export const JUMP = {
  start: { x: 180, y: 2376 },
  lip: { x: 560, y: 2680 },
  land: { x: 1000, y: 2790 },
  hillEnd: { x: 1200, y: 2915 },
  flight: 700,
};

/** The inrun from the top of the jump down to its lip, and the landing hill from where they land to the flat. */
export const INRUN: Pt[] = quad(JUMP.start, { x: 380, y: 2720 }, JUMP.lip, 20);
export const OUTRUN: Pt[] = quad(JUMP.hillEnd, { x: 1300, y: 2978 }, { x: 1420, y: 2985 }, 20);

/** The chair lift: a chair takes the snowball from the bottom station up to the top one. */
export const CHAIRLIFT = { from: { x: 160, y: 3560 }, to: { x: 900, y: 3240 }, speed: 90, hang: 58 };

/** The bobsleigh run's two steep curves, each half round a circle. */
export const BOB = {
  r: 60,
  curves: [
    { x: 1180, y: 3315 },
    { x: 980, y: 3450 },
  ],
  speed: 420,
};

/** Cues of the snow stretch. */
export const SNOW_CUES = { takeoff: 0, landing: 1, chairOn: 2, chairOff: 3, bob: 4 };

function snowStretch(): Stretch {
  const b = new Builder();
  opening(b);
  b.row({ x: 130, y: 2290 });
  b.wall(28, { x: 90, y: 2370 });
  b.row(JUMP.start);
  b.go(INRUN);
  b.curve({ x: 760, y: 2638 }, JUMP.land, { event: b.cue(), speed: JUMP.flight });
  b.line(JUMP.hillEnd, { event: b.cue() });
  b.go(OUTRUN);
  b.row({ x: 1530, y: 2990 });
  b.wall(1578, { x: 1550, y: 3070 });
  b.row({ x: 110, y: 3120 });
  b.wall(28, { x: 90, y: CHAIRLIFT.from.y - 30 });
  b.row({ x: CHAIRLIFT.from.x - 40, y: CHAIRLIFT.from.y - 4 });
  b.line(CHAIRLIFT.from);
  b.line(CHAIRLIFT.to, { event: b.cue(), speed: CHAIRLIFT.speed, carry: true });
  // Off the chair at the top and down the bobsleigh run.
  const [c0, c1] = BOB.curves;
  b.row({ x: c0.x, y: c0.y - BOB.r }, [CHAIRLIFT.to.x + 20]);
  b.go(arc(c0.x, c0.y, BOB.r, 270, 450), { event: b.cue(), speed: BOB.speed });
  b.row({ x: c1.x, y: c1.y - BOB.r });
  b.go(arc(c1.x, c1.y, BOB.r, 270, 90), { event: b.cue(), speed: BOB.speed });
  b.row({ x: 1250, y: 3540 });
  b.curve({ x: 1300, y: 3545 }, BASKET_IN);
  return b.done();
}

/* ---------- Space: round a planet and through a wormhole ---------- */

/** The orbit round the planet: twice round and a quarter, the far half behind the planet. */
export const ORBIT = { cx: 640, cy: 2560, rx: 320, ry: 95, planet: 115, laps: 2.25, speed: 440 };

export const orbitAt = (a: number): Pt => ({ x: ORBIT.cx + ORBIT.rx * Math.cos(a), y: ORBIT.cy + ORBIT.ry * Math.sin(a) });

/** The curve from the row above down onto the orbit. */
export const ORBIT_IN: Pt[] = quad({ x: 1060, y: 2250 }, { x: ORBIT.cx + ORBIT.rx + 30, y: 2262 }, orbitAt(0), 20);

/** The wormhole: in at one swirl, gone, and out of the other. */
export const WORMHOLE = { in: { x: 940, y: 2826 }, out: { x: 360, y: 3200 }, through: 600, swirl: 220 };

/** Cues of the space stretch: each time round the planet, then into and out of the wormhole. */
export const SPACE_CUES = { orbit: 0, wormIn: 3, wormOut: 4 };

function spaceStretch(): Stretch {
  const b = new Builder();
  opening(b);
  b.row(ORBIT_IN[0]);
  b.go(ORBIT_IN);
  const laps = [0, 1, 2].map((i) => [i, Math.min(i + 1, ORBIT.laps)]);
  for (const [a, z] of laps)
    b.go(
      sample(Math.round(64 * (z - a)), (k) => orbitAt((a + (z - a) * k) * TAU)),
      { event: b.cue(), speed: ORBIT.speed },
    );
  // Flung off the orbit onto a rail to the left wall.
  b.row({ x: 110, y: 2700 });
  b.wall(28, { x: 90, y: 2780 });
  b.row({ x: 860, y: 2820 });
  b.line(WORMHOLE.in, { event: b.cue(), speed: WORMHOLE.swirl, scale: [1, 0] });
  b.line(WORMHOLE.out, { speed: WORMHOLE.through, scale: [0, 0] });
  b.line({ x: WORMHOLE.out.x + 80, y: WORMHOLE.out.y + 5 }, { event: b.cue(), speed: WORMHOLE.swirl, scale: [0, 1] });
  b.row({ x: 1530, y: 3255 });
  b.wall(1578, { x: 1550, y: 3335 });
  b.row({ x: 300, y: 3370 });
  b.wall(252, { x: 290, y: 3450 });
  b.row({ x: 1250, y: 3485 });
  b.curve({ x: 1300, y: 3490 }, BASKET_IN);
  return b.done();
}

/* ---------- Water slide: waves, a diving board and a whirlpool ---------- */

/** The wave slides: humps along a long row, up and down and up again; the first with four, the second with three. */
export const WAVES: { from: Pt; to: Pt; humps: number; height: number }[] = [
  { from: { x: 1550, y: 2230 }, to: { x: 120, y: 2300 }, humps: 4, height: 34 },
  { from: { x: 90, y: 3090 }, to: { x: 1530, y: 3150 }, humps: 3, height: 30 },
];

/** The middle of a thing `k` (0–1) along wave slide `w`. */
export const waveAt = (w: (typeof WAVES)[number], k: number): Pt => ({
  x: w.from.x + (w.to.x - w.from.x) * k,
  y: w.from.y + (w.to.y - w.from.y) * k - w.height * Math.sin(k * w.humps * TAU),
});

/** The diving board the things dive off, into the whirlpool. */
export const BOARD = { x0: 640, x1: 820, y: 2410 };

/**
 * The whirlpool, a round basin seen a little from above: a thing lands in it at its left edge and circles round
 * `laps` times, closer to the middle and lower each time, until the drain in its middle swallows it.
 */
export const WHIRL = { cx: 1150, cy: 2760, rx: 250, ry: 60, laps: 2.25, sink: 70, shrink: 0.45, speed: 230, drain: 2930 };

/** Where a thing is `k` (0–1) of the way round the whirlpool: from its left edge, the near side first. */
export function whirlAt(k: number): Pt {
  const a = Math.PI - k * WHIRL.laps * TAU;
  const r = 1 - WHIRL.shrink * k;
  return { x: WHIRL.cx + WHIRL.rx * r * Math.cos(a), y: WHIRL.cy + WHIRL.sink * k + WHIRL.ry * r * Math.sin(a) };
}

/** The dive off the board's tip, up and down into the whirlpool. */
export const DIVE: Pt[] = quad({ x: BOARD.x1, y: BOARD.y + 4 }, { x: 880, y: 2250 }, whirlAt(0), 20);

/** The drain under the whirlpool's middle, and the pipe from it onto the row below. */
export const DRAIN: Pt[] = [
  ...line(whirlAt(1), { x: WHIRL.cx, y: WHIRL.drain }, 12),
  ...quad({ x: WHIRL.cx, y: WHIRL.drain }, { x: WHIRL.cx, y: 2992 }, { x: 1020, y: 2994 }, 20).slice(1),
];

/** Cues of the water slide: each hump of the first wave slide, the board, the splash, the drain, each hump of the second. */
export const SLIDE_CUES = { waves: [0, WAVES[0].humps + 3], board: WAVES[0].humps, splash: WAVES[0].humps + 1, drain: WAVES[0].humps + 2 };

/** Over the humps of wave slide `w`, each hump a part of its own with a cue at its start. */
function waves(b: Builder, w: (typeof WAVES)[number]) {
  for (let i = 0; i < w.humps; i++)
    b.go(
      sample(40, (k) => waveAt(w, (i + k) / w.humps)),
      { event: b.cue() },
    );
}

function slideStretch(): Stretch {
  const b = new Builder();
  opening(b);
  waves(b, WAVES[0]);
  b.wall(28, { x: 90, y: 2380 });
  b.row({ x: BOARD.x0, y: BOARD.y });
  b.line({ x: BOARD.x1 - 30, y: BOARD.y + 3 });
  b.line({ x: BOARD.x1, y: BOARD.y + 4 }, { event: b.cue() });
  // Off the board, up and down into the whirlpool, round and round and down its drain.
  b.go(DIVE, { speed: 650 });
  b.go(sample(140, whirlAt), { event: b.cue(), speed: WHIRL.speed });
  b.line({ x: WHIRL.cx, y: WHIRL.drain }, { event: b.cue(), speed: 300, scale: [1, 0.7] });
  b.curve({ x: WHIRL.cx, y: 2992 }, { x: 1020, y: 2994 }, { scale: [0.7, 1] });
  b.row({ x: 110, y: 3010 });
  b.wall(28, WAVES[1].from);
  waves(b, WAVES[1]);
  b.wall(1578, { x: 1550, y: 3230 });
  b.row({ x: 700, y: 3262 });
  b.wall(652, { x: 690, y: 3342 });
  b.row({ x: 1250, y: 3380 });
  b.curve({ x: 1300, y: 3390 }, BASKET_IN);
  return b.done();
}

/* ---------- Building site: scaffold planks, bucket elevator, rubble chute ---------- */

/** Scaffold planks, a stair of them down to the bucket elevator; each bends a little as a thing lands on it. */
export const PLANKS: { x0: number; x1: number; y: number }[] = Array.from({ length: 8 }, (_, i) => ({
  x0: 80 + i * 86,
  x1: 80 + i * 86 + 96,
  y: 2700 + i * 92,
}));

/** The bucket elevator: buckets on a chain carry the things up, and tip them out at the top. */
export const ELEVATOR = { x: 860, bottom: 3450, top: 2750, speed: 120 };

/** The rubble chute: a tube of stacked funnels straight down into the skip, each knocked on the way through. */
export const CHUTE = { x: 1415, top: 2840, bottom: 3540, segments: 7, speed: 400 };

/** Cues of the building site: each plank, the bucket at the bottom and at the top, each funnel of the chute. */
export const SITE_CUES = { planks: 0, bucketOn: PLANKS.length, bucketOff: PLANKS.length + 1, chute: PLANKS.length + 2 };

function siteStretch(): Stretch {
  const b = new Builder();
  opening(b);
  // Along three belts, left, right and left again.
  b.row({ x: 110, y: 2290 });
  b.wall(28, { x: 90, y: 2370 });
  b.row({ x: 1530, y: 2430 });
  b.wall(1578, { x: 1550, y: 2510 });
  b.row({ x: 110, y: 2570 });
  b.wall(28, { x: 90, y: PLANKS[0].y - 40 });
  // Down the planks, step by step.
  PLANKS.forEach((plank, i) => {
    const on = { x: Math.max(plank.x0 + 30, b.at.x + 12), y: plank.y - BALL_R - 4 };
    b.curve({ x: on.x - 6, y: b.at.y + 4 }, on, { event: b.cue() });
    b.line({ x: plank.x1 - 4, y: on.y + 3 });
    if (i < PLANKS.length - 1) b.line({ x: plank.x1 + 6, y: on.y + 5 });
  });
  // Into a bucket at the bottom, up, and tipped out at the top.
  b.curve({ x: ELEVATOR.x - 20, y: b.at.y }, { x: ELEVATOR.x, y: ELEVATOR.bottom }, { event: b.cue() });
  b.line({ x: ELEVATOR.x, y: ELEVATOR.top }, { speed: ELEVATOR.speed, carry: true });
  b.curve({ x: ELEVATOR.x + 40, y: ELEVATOR.top - 40 }, { x: ELEVATOR.x + 90, y: ELEVATOR.top + 10 }, { event: b.cue() });
  b.row({ x: 1280, y: ELEVATOR.top + 40 });
  // Down the rubble chute into the skip.
  b.curve({ x: CHUTE.x, y: ELEVATOR.top + 42 }, { x: CHUTE.x, y: CHUTE.top });
  const step = (CHUTE.bottom - CHUTE.top) / CHUTE.segments;
  for (let i = 0; i < CHUTE.segments; i++) b.line({ x: CHUTE.x, y: CHUTE.top + (i + 1) * step }, { event: b.cue(), speed: CHUTE.speed });
  b.line({ x: CHUTE.x, y: BASKET.rimY - 22 });
  return b.done();
}

/** The six worlds' stretches, built once. */
export const STRETCHES = {
  wood: woodStretch(),
  color: colorStretch(),
  snow: snowStretch(),
  space: spaceStretch(),
  slide: slideStretch(),
  site: siteStretch(),
};
