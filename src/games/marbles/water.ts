// „Wasserbahn“: a sunny hillside with a water run going down in steps from the
// upper left to the lower right – four stone basins, each closed by a wooden
// lock gate, and a paddling pool at the bottom. A yellow rubber duck waits at
// each closed gate until the child taps; then the gate lifts, the water rushes
// through and carries the duck down to the next basin, and on every stretch
// something new happens: a water wheel rings a bell, a fish leaps over the
// duck and a frog jumps in, a twisty slide, and a pipe the duck pops out of
// into the pool, where a fountain sprays and the ducklings wait.
// Each stretch is worked out ahead as a function of the seconds since its gate
// opened, so WaterLevel.tsx only asks where things are at a moment.
// Coordinates are those of the hillside, 6200 × 2000; the screen shows
// 1600 × 900 of it at a time.

import {
  playBlub,
  playCreak,
  playCroak,
  playDing,
  playDrops,
  playFlush,
  playGlug,
  playKnock,
  playPlop,
  playPop,
  playQuack,
  playSlide,
  playSplash,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { VIEW_H, wobble } from "./level";
import { along, cameraOn, clamp01, deg, easeIn, easeOut, hop, pathOf, rounded, seg, STEP, timeline, type MachineEvent, type Path } from "./machineKit";
import { arc, line, quad, type Pt } from "./path";

export const WORLD_W = 6200;
/** The bottom of the hillside; the camera never looks below it. */
export const WORLD_H = 2000;
/** The highest the camera looks, into the sky over the first basin. */
export const SKY_TOP = -260;

/** A stone basin dug into the hill: water from `x0` to `x1`, its surface at `y`, `depth` deep. */
export interface Basin {
  x0: number;
  x1: number;
  y: number;
  depth: number;
}

/** The four basins, from the top of the hill down; each ends in a lock gate on its right. */
export const BASINS: Basin[] = [
  { x0: 80, x1: 960, y: 330, depth: 110 },
  { x0: 1280, x1: 2080, y: 690, depth: 110 },
  { x0: 2800, x1: 3480, y: 1010, depth: 110 },
  { x0: 4060, x1: 4700, y: 1400, depth: 110 },
];

/** The paddling pool at the bottom, an oval seen from the side: water from `x0` to `x1`, its middle line at `y`, standing on the lawn at `lawn`. */
export const POOL = { x0: 5080, x1: 5980, y: 1700, ry: 50, lawn: 1770 };

/**
 * The lock gate, measured from the water surface of its basin: a board between two posts (closed from `top` to
 * `bottom`, lifted by `lift`), a beam over it and a big handwheel on the beam. The lifted board clears the duck.
 */
export const GATE = { w: 60, top: -40, bottom: 90, lift: 190, beam: -250, wheelY: -292, wheelR: 46 };
/** The middle of a basin's gate. */
export const gateX = (b: Basin) => b.x1 + GATE.w / 2;
/** Where the duck waits in a basin, its beak just before the gate. */
export const waitSpot = (b: Basin): Pt => ({ x: b.x1 - 90, y: b.y });

/** The top of the grass from one end of the hill to the other: a terrace for every basin, slopes and a cliff between. */
export const GROUND = rounded(
  [
    { x: -400, y: 310 },
    { x: 1030, y: 310 },
    { x: 1250, y: 670 },
    { x: 2150, y: 670 },
    { x: 2760, y: 880 },
    { x: 2790, y: 990 },
    { x: 3560, y: 990 },
    { x: 3640, y: 1380 },
    { x: 4770, y: 1380 },
    { x: 5060, y: POOL.lawn },
    { x: WORLD_W + 400, y: POOL.lawn },
  ],
  30,
);

/** The height of the grass at `x`. */
export function groundY(x: number) {
  const i = GROUND.findIndex((p) => p.x >= x);
  if (i <= 0) return GROUND[Math.max(0, i)].y;
  const a = GROUND[i - 1];
  const b = GROUND[i];
  return a.y + ((x - a.x) * (b.y - a.y)) / (b.x - a.x || 1);
}

/* ---------- The stretches between the basins ---------- */

/** Stretch 1: a wooden flume from the first gate to its lip, where the water falls onto the water wheel. */
export const FLUME = { from: { x: BASINS[0].x1 + GATE.w, y: 340 }, to: { x: 1400, y: 362 } };
/** The water wheel behind the waterfall, dipping into the second basin; `peg` is how far its four pegs reach out. */
export const WHEEL = { x: 1440, y: 562, r: 125, peg: 168 };
/** The bell on its post left of the wheel; a peg knocks it whenever it passes. */
export const BELL = { x: 1300, y: 470, post: 1238 };
/** Where the bell sits seen from the wheel's axle, in radians: a peg rings it when it gets there. */
export const BELL_ANGLE = Math.atan2(BELL.y - WHEEL.y, BELL.x - WHEEL.x);

/** Stretch 2: a brook down the bank from the second gate to its lip over the third basin. */
export const BROOK = { from: { x: BASINS[1].x1 + GATE.w, y: 700 }, to: { x: 2760, y: 905 }, depth: 40 };
/** The brook's surface at `x`. */
export const brookY = (x: number) => BROOK.from.y + ((x - BROOK.from.x) * (BROOK.to.y - BROOK.from.y)) / (BROOK.to.x - BROOK.from.x);
/** The fish leaps out of the brook ahead of the duck, over it, and dives back in behind it. */
export const FISH = { from: 2640, to: 2380, height: 230, duration: 1 };
/** The frog's lily pad, where it dives in, and the pad it climbs onto afterwards – all on the third basin. */
export const FROG = { pad: 3040, dive: 3200, rest: 3270 };

/** Stretch 3: the twisty slide down the cliff, three runs joined by two round bends. */
const SLIDE_RUNS = [
  [
    { x: 3550, y: 1020 },
    { x: 3890, y: 1085 },
  ],
  [
    { x: 3890, y: 1175 },
    { x: 3700, y: 1215 },
  ],
  [
    { x: 3700, y: 1305 },
    { x: 4000, y: 1345 },
  ],
];
/** The way along the slide, as the line its water's surface follows. */
export const SLIDE_LINE = [
  ...line(SLIDE_RUNS[0][0], SLIDE_RUNS[0][1]),
  ...arc(3890, 1130, 45, -90, 90),
  ...line(SLIDE_RUNS[1][0], SLIDE_RUNS[1][1]),
  ...arc(3700, 1260, 45, 270, 90),
  ...line(SLIDE_RUNS[2][0], SLIDE_RUNS[2][1]),
];
/** The slide's tower: a striped pole behind the bends, with a pointed roof. */
export const TOWER = { x: 3800, top: 950 };

/** Stretch 4: the big pipe from the last gate down into the paddling pool, as the line the duck's waterline follows inside it. */
export const PIPE_LINE = rounded(
  [
    { x: 4778, y: 1402 },
    { x: 4950, y: 1402 },
    { x: 4950, y: 1615 },
    { x: 5075, y: 1615 },
  ],
  60,
);
/** How far the pipe's middle is above the duck's waterline, and the pipe's outer radius. */
export const PIPE = { lift: 38, r: 64 };
/** The fountain in the pool and the three ducklings waiting there. */
export const FOUNTAIN = { x: 5660, y: POOL.y };
export const BABIES = [5770, 5850, 5930];
/** Where the duck ends up in the pool. */
export const POOL_SPOT = { x: 5440, y: POOL.y };

/* ---------- The duck's way ---------- */

/** Starts at half speed and ends at one and a half: for water picking the duck up. */
const speedUp = (k: number) => 0.5 * k + 0.5 * k * k;
const falling = (k: number) => 0.4 * k + 0.6 * k * k;

/** How a piece of the duck's way goes. */
interface LegSpec {
  pts: Pt[];
  duration: number;
  ease?: (k: number) => number;
  /** Bobbing on rushing water. */
  ride?: boolean;
  /** Stays level on calm water, whichever way the way points. */
  flat?: boolean;
  /** Turns once around itself on the way, by this many degrees. */
  spin?: number;
  /** Out of sight (inside the pipe). */
  hidden?: boolean;
  /** Grows from small to full size at the start: popping out of the pipe. */
  pop?: boolean;
}

/** One piece of the duck's way: along `path` from `start` for `duration` seconds. */
export interface Leg extends LegSpec {
  path: Path;
  start: number;
  ease: (k: number) => number;
}

function legs(t0: number, specs: LegSpec[]): Leg[] {
  let t = t0;
  return specs.map((spec) => {
    const leg = { ease: (k: number) => k, ...spec, path: pathOf(spec.pts), start: t };
    t += spec.duration;
    return leg;
  });
}

const legEnd = (leg: Leg) => leg.start + leg.duration;

/** The duck at a moment: where its waterline is, how it leans (degrees), which way it looks and how big it is. */
export interface Pose {
  pt: Pt;
  tilt: number;
  /** Looks left. */
  flip: boolean;
  hidden: boolean;
  scale: number;
  /** On its way (between the first leg's start and the last one's end). */
  moving: boolean;
}

/** The leg the duck is on at `t`, and how far along it (0 to 1). */
function legAt(all: Leg[], t: number) {
  let leg = all[0];
  for (const l of all) if (t >= l.start) leg = l;
  return { leg, k: clamp01((t - leg.start) / leg.duration) };
}

/** The duck's spot at `t`, without bobbing. */
function spotAt(all: Leg[], t: number) {
  const { leg, k } = legAt(all, t);
  return along(leg.path, leg.ease(k) * leg.path.total);
}

/** Seconds since the gate opened when the duck first gets to a spot where `reached` holds. */
function whenAt(all: Leg[], reached: (pt: Pt) => boolean) {
  const end = legEnd(all[all.length - 1]);
  for (let t = all[0].start; t < end; t += STEP) if (reached(spotAt(all, t).pt)) return t;
  return end;
}

/* ---------- Stretches ---------- */

/** Everything about one stretch, `t` seconds after its gate opened (below 0 while the duck waits at it). */
export interface Stretch {
  /** The basin the duck waits in, before the gate. */
  basin: Basin;
  legs: Leg[];
  /** When the duck splashes into the next water. */
  land: number;
  /** When the gate starts to close again (the water stops a little after). */
  close: number;
  /** When everything has settled and the duck waits at the next gate (or the level is done). */
  duration: number;
  events: MachineEvent[];
}

/** How far the gate is lifted, 0 shut to 1 open. */
export const gateAt = (s: Stretch, t: number) => easeOut(seg(t, 0, 0.6)) * (1 - easeIn(seg(t, s.close, s.close + 0.6)));
/** How much water rushes through, 0 to 1: it comes as the gate lifts and runs dry after it shuts. */
export const flowAt = (s: Stretch, t: number) => seg(t, 0.15, 0.6) * (1 - seg(t, s.close, s.close + 0.8));

/** The duck at `t` seconds into the stretch: still before its first leg, bobbing on the way, rocking after each splash. */
export function poseAt(s: Stretch, t: number): Pose {
  const first = s.legs[0];
  if (t <= first.start) return { pt: first.path.pts[0], tilt: 0, flip: false, hidden: false, scale: 1, moving: false };
  const { leg, k } = legAt(s.legs, t);
  const { pt, angle } = along(leg.path, leg.ease(k) * leg.path.total);
  const moving = t < legEnd(s.legs[s.legs.length - 1]);
  const flip = !leg.flat && Math.cos(angle) < -0.1;
  // Nose down where the way goes down: for a duck looking left that is turning the other way.
  const lean = flip ? deg(angle) - 180 : deg(angle);
  let tilt = leg.flat ? 0 : Math.max(-40, Math.min(40, ((lean + 540) % 360) - 180));
  let bob = 0;
  if (leg.spin) tilt += leg.spin * k;
  if (leg.ride && moving) {
    bob += 3 * Math.sin(t * 10);
    tilt += 4 * Math.sin(t * 7);
  }
  bob += wobble(t - s.land, 14, 11, 2.6);
  tilt += wobble(t - s.land - 0.08, 9, 9, 2.6);
  const scale = leg.pop ? 0.6 + 0.4 * easeOut(clamp01((t - leg.start) / 0.2)) : 1;
  return { pt: { x: pt.x, y: pt.y + bob }, tilt, flip, hidden: !!leg.hidden && k < 1, scale, moving };
}

/** A gate that opens at 0 and shuts `afterLand` seconds after the duck lands, with the sounds every gate makes. */
function stretch(
  basin: Basin,
  all: Leg[],
  land: number,
  afterLand: number,
  end: number,
  more: (at: (t: number, e: Omit<MachineEvent, "at">) => void) => void,
): Stretch {
  const { at, sorted } = timeline();
  const close = land + afterLand;
  at(0, { sound: playCreak });
  at(0.25, { sound: playFlush });
  at(land, { sound: playSplash });
  at(close + 0.6, { sound: () => playKnock(520) });
  more(at);
  const duration = Math.max(end, close + 0.9, legEnd(all[all.length - 1]) + 0.2);
  return { basin, legs: all, land, close, duration, events: sorted() };
}

/** How far a wheel has turned (radians) that speeds up from `t0` over `up` seconds to `w`, runs until `t1` and then slows down to a stop over `down`. */
function spun(t: number, t0: number, t1: number, w: number, up: number, down: number) {
  if (t <= t0) return 0;
  if (t < t0 + up) return (w * (t - t0) ** 2) / (2 * up);
  const atFull = (w * up) / 2;
  if (t < t1) return atFull + w * (t - t0 - up);
  const atStop = atFull + w * (t1 - t0 - up);
  const s = Math.min(t - t1, down);
  return atStop + w * s - (w * s * s) / (2 * down);
}

/** Builds the whole water run: the four stretches in turn, and where the things along them are at a moment. */
export function buildWater() {
  const [b0, b1, b2, b3] = BASINS;

  /* Stretch 1: along the flume, down the waterfall past the water wheel, which rings the bell. */
  const legs1 = legs(0.5, [
    { pts: [waitSpot(b0), FLUME.from, FLUME.to], duration: 2.2, ease: speedUp, ride: true },
    { pts: quad(FLUME.to, { x: 1480, y: FLUME.to.y }, { x: 1560, y: b1.y }, 16), duration: 0.7, ease: falling },
    { pts: [{ x: 1560, y: b1.y }, waitSpot(b1)], duration: 3.2, ease: easeOut, flat: true },
  ]);
  const land1 = legEnd(legs1[1]);
  const wheel = { from: 1, to: land1 + 1, w: 2.6, up: 0.8, down: 1.6 };
  /** How far the water wheel has turned, anticlockwise, `t` seconds into the first stretch. */
  const wheelAt = (t: number) => spun(t, wheel.from, wheel.to, wheel.w, wheel.up, wheel.down);
  // A peg passes the bell every quarter turn, the first one an eighth of a turn in.
  const rings: number[] = [];
  for (let t = 0, passed = 0; t < wheel.to + wheel.down; t += STEP) {
    const n = Math.floor((wheelAt(t) - Math.PI / 4) / (Math.PI / 2)) + 1;
    if (n > passed) {
      passed = n;
      rings.push(t);
    }
  }
  const s1 = stretch(b0, legs1, land1, 1, 0, (at) => {
    at(0.6, { sound: playWhoosh });
    rings.forEach((t) => at(t, { sound: playDing }));
    at(land1 + 0.6, { sound: playQuack });
  });
  /** How far the bell swings (degrees) after the last peg knocked it. */
  const bellAt = (t: number) => {
    const last = rings.filter((r) => r <= t).pop();
    return last === undefined ? 0 : wobble(t - last, 16, 16, 3.2);
  };

  /* Stretch 2: down the brook – a fish leaps over the duck – and into the third basin, where the frog jumps in. */
  const legs2 = legs(0.5, [
    { pts: [waitSpot(b1), BROOK.from, BROOK.to], duration: 3, ease: speedUp, ride: true },
    { pts: quad(BROOK.to, { x: 2830, y: BROOK.to.y }, { x: 2900, y: b2.y }, 14), duration: 0.55, ease: falling },
    { pts: [{ x: 2900, y: b2.y }, waitSpot(b2)], duration: 3.2, ease: easeOut, flat: true },
  ]);
  const land2 = legEnd(legs2[1]);
  const fishFrom = whenAt(legs2, (pt) => pt.x >= (FISH.from + FISH.to) / 2) - FISH.duration / 2;
  const frog = { jump: land2 + 0.15, splash: land2 + 0.7, climb: land2 + 1.05, rest: land2 + 1.45 };
  const s2 = stretch(b1, legs2, land2, 1, 0, (at) => {
    at(0.6, { sound: playWhoosh });
    at(fishFrom, { sound: playBlub });
    at(fishFrom + FISH.duration, { sound: playPlop });
    at(frog.jump, { sound: playCroak });
    at(frog.splash, { sound: playSplash });
    at(frog.rest, { sound: playPlop });
    at(frog.rest + 0.3, { sound: playCroak });
  });
  /** The fish in the air, `t` seconds into the second stretch: where it is and which way it points (radians), or null under water. */
  const fishAt = (t: number) => {
    const k = (t - fishFrom) / FISH.duration;
    if (k < 0 || k > 1) return null;
    const a = { x: FISH.from, y: brookY(FISH.from) };
    const b = { x: FISH.to, y: brookY(FISH.to) };
    const pt = hop(a, b, FISH.height, k);
    return { pt, angle: Math.atan2(b.y - a.y - 4 * FISH.height * (1 - 2 * k), b.x - a.x) };
  };
  /** The frog, `t` seconds into the second stretch: on a pad, in the air, or only its eyes over the water. */
  const frogAt = (t: number): { pt: Pt; look: "sit" | "leap" | "eyes" } => {
    const pad = { x: FROG.pad, y: b2.y - 6 };
    const dive = { x: FROG.dive, y: b2.y };
    const rest = { x: FROG.rest, y: b2.y - 6 };
    if (t < frog.jump) return { pt: pad, look: "sit" };
    if (t < frog.splash) return { pt: hop(pad, dive, 170, seg(t, frog.jump, frog.splash)), look: "leap" };
    if (t < frog.climb) return { pt: dive, look: "eyes" };
    if (t < frog.rest) return { pt: hop(dive, rest, 60, seg(t, frog.climb, frog.rest)), look: "leap" };
    return { pt: rest, look: "sit" };
  };

  /* Stretch 3: round and round the twisty slide, a spin through the air and into the last basin. */
  const lastRun = SLIDE_RUNS[2][1];
  const legs3 = legs(0.5, [
    { pts: [waitSpot(b2), ...SLIDE_LINE], duration: 3.4, ease: speedUp, ride: true },
    { pts: quad(lastRun, { x: 4080, y: 1310 }, { x: 4160, y: b3.y }, 16), duration: 0.75, spin: 360 },
    { pts: [{ x: 4160, y: b3.y }, waitSpot(b3)], duration: 3, ease: easeOut, flat: true },
  ]);
  const land3 = legEnd(legs3[1]);
  // A „whoosh“ at the start of every run: the first, and after each bend.
  const runStarts = SLIDE_RUNS.map((run, i) => whenAt(legs3, (pt) => (i === 0 ? pt.x >= run[0].x : pt.y >= run[0].y - 1)));
  const s3 = stretch(b2, legs3, land3, 1, 0, (at) => {
    runStarts.forEach((t) => at(t, { sound: playSlide }));
    at(legs3[1].start, { sound: playWhoosh });
    at(land3 + 0.6, { sound: playQuack });
  });

  /* Stretch 4: into the pipe, out with a pop into the paddling pool; the fountain sprays and the ducklings quack. */
  const legs4 = legs(0.5, [
    { pts: [waitSpot(b3), PIPE_LINE[0]], duration: 1, ease: speedUp, ride: true },
    { pts: PIPE_LINE, duration: 1.3, hidden: true },
    { pts: quad(PIPE_LINE[PIPE_LINE.length - 1], { x: 5190, y: 1490 }, { x: 5300, y: POOL.y }, 16), duration: 0.75, pop: true },
    { pts: [{ x: 5300, y: POOL.y }, POOL_SPOT], duration: 1.6, ease: easeOut, flat: true },
  ]);
  const land4 = legEnd(legs4[2]);
  const pool = {
    spray: land4 + 0.3,
    dry: land4 + 2.3,
    quacks: BABIES.map((_, i) => land4 + 0.8 + i * 0.35),
    sparkle: land4 + 1.9,
    done: land4 + 3.4,
  };
  const s4 = stretch(b3, legs4, land4, 0.4, pool.done, (at) => {
    at(legs4[1].start, { sound: playGlug });
    at(legs4[2].start, { sound: playPop });
    at(pool.spray, { sound: playDrops });
    at(pool.spray + 1.2, { sound: playDrops });
    pool.quacks.forEach((t) => at(t, { sound: playQuack }));
    at(pool.sparkle, { sound: playTwinkle, say: "Quak! Da sind die Entenbabys!" });
    at(pool.done, { done: true });
  });
  /** How high a duckling hops (0 to 1) when it quacks, `t` seconds into the last stretch. */
  const babyAt = (i: number, t: number) => {
    const k = (t - pool.quacks[i]) / 0.4;
    return k < 0 || k > 1 ? 0 : 4 * k * (1 - k);
  };
  /** The fountain's drops, `t` seconds into the last stretch: each leaves the spout, flies up and out and falls back. */
  const dropsAt = (t: number): Pt[] => {
    const out: Pt[] = [];
    // Up at `rise` px/s, pulled down by `pull`: back at the spout after `life` seconds, about 170 px high.
    const rise = 720;
    const pull = 760;
    const life = rise / pull;
    // One drop leaves every 0.04 s while the fountain runs, to the left and the right in turn.
    for (let i = 0, born = pool.spray; born <= pool.dry; i++, born = pool.spray + i * 0.04) {
      const age = t - born;
      if (age < 0 || age > life) continue;
      const vx = (i % 2 ? 1 : -1) * (50 + ((i * 37) % 16) * 10);
      out.push({ x: FOUNTAIN.x + vx * age, y: FOUNTAIN.y - 40 - rise * age + pull * age * age });
    }
    return out;
  };

  const stretches = [s1, s2, s3, s4];
  return {
    stretches,
    wheelAt,
    bellAt,
    fishAt,
    fishFrom,
    frogAt,
    frog,
    babyAt,
    dropsAt,
    pool,
  };
}

/** The whole water run, as `buildWater` makes it. */
export type Water = ReturnType<typeof buildWater>;

/** The camera's top left corner for looking at `focus`: a little left of the middle and a little above it, never past the hill's edges. */
export function cameraFor(focus: Pt): Pt {
  return { x: cameraOn(WORLD_W, focus.x), y: Math.min(WORLD_H - VIEW_H, Math.max(SKY_TOP, focus.y - VIEW_H * 0.56)) };
}

/** The water surface right above or below a tapped spot, or null when the spot is not on water. */
export function waterAt(p: Pt): Pt | null {
  for (const b of BASINS) {
    if (p.x >= b.x0 && p.x <= b.x1 + GATE.w / 2 && p.y >= b.y - 40 && p.y <= b.y + b.depth) return { x: p.x, y: b.y };
  }
  if (p.x >= FLUME.from.x && p.x <= FLUME.to.x) {
    const y = FLUME.from.y + ((p.x - FLUME.from.x) * (FLUME.to.y - FLUME.from.y)) / (FLUME.to.x - FLUME.from.x);
    if (p.y >= y - 40 && p.y <= y + 40) return { x: p.x, y };
  }
  if (p.x >= BROOK.from.x && p.x <= BROOK.to.x) {
    const y = brookY(p.x);
    if (p.y >= y - 40 && p.y <= y + BROOK.depth) return { x: p.x, y };
  }
  const cx = (POOL.x0 + POOL.x1) / 2;
  const rx = (POOL.x1 - POOL.x0) / 2;
  if (((p.x - cx) / rx) ** 2 + ((p.y - POOL.y) / (POOL.ry + 30)) ** 2 <= 1)
    return { x: p.x, y: Math.max(POOL.y - POOL.ry * 0.6, Math.min(POOL.y + POOL.ry * 0.6, p.y)) };
  return null;
}
