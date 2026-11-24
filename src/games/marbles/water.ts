// „Wasserbahn“: a sunny hillside with a water run going down in steps from the
// upper left to the lower right – four stone basins, each closed by a wooden
// lock gate, three wild ponds between them and a paddling pool at the bottom.
// A yellow rubber duck waits at a closed gate; then the gate lifts, the water
// rushes through and carries the duck down to the next basin, and on every
// stretch something new happens: a water wheel rings a bell and a stork flies
// the duck out of the reeds, a fish leaps over the duck and a turtle ferries
// it across its pond, a twisty slide and a geyser that shoots it into the air,
// and a pipe the duck pops out of into the pool, where the ducklings wait and
// follow it in a row.
// Each stretch is worked out ahead as a function of the seconds since its gate
// opened, so WaterLevel.tsx only asks where things are at a moment.
// Coordinates are those of the hillside, 9700 × 2400; the screen shows
// 1600 × 900 of it at a time.

import {
  playBlub,
  playCreak,
  playDing,
  playDrops,
  playGlug,
  playKnock,
  playPeck,
  playPlop,
  playPop,
  playRumble,
  playRustle,
  playSlide,
  playThump,
  playTrickle,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { playCroak, playFlush, playQuack, playSplash } from "@/lib/realSounds";
import { VIEW_H, wobble } from "./level";
import {
  along,
  cameraOn,
  clamp01,
  deg,
  easeIn,
  easeInOut,
  easeOut,
  hop,
  lerp,
  pathOf,
  rounded,
  seg,
  STEP,
  timeline,
  type MachineEvent,
  type Path,
  hump,
} from "./machineKit";
import { arc, line, quad, type Pt } from "./path";

export const WORLD_W = 9700;
/** The bottom of the hillside; the camera never looks below it. */
export const WORLD_H = 2400;
/** The highest the camera looks, into the sky over the first basin. */
export const SKY_TOP = -260;

/** A stone basin (or a pond) dug into the hill: water from `x0` to `x1`, its surface at `y`, `depth` deep. */
export interface Basin {
  x0: number;
  x1: number;
  y: number;
  depth: number;
}

/** The four basins, from the top of the hill down; each ends in a lock gate on its right. */
export const BASINS: Basin[] = [
  { x0: 80, x1: 960, y: 330, depth: 110 },
  { x0: 2700, x1: 3500, y: 830, depth: 110 },
  { x0: 5460, x1: 6140, y: 1270, depth: 110 },
  { x0: 7560, x1: 8200, y: 1790, depth: 110 },
];

/** The reed pond under the water wheel, where the stork stands. */
export const REED_POND: Basin = { x0: 1280, x1: 2400, y: 690, depth: 110 };
/** The still pond where the turtle lives, below the brook. */
export const TURTLE_POND: Basin = { x0: 4220, x1: 5300, y: 1150, depth: 110 };
/** The warm spring at the foot of the slide, ringed by round stones, with the geyser's vent in its middle. */
export const HOT_SPRING: Basin = { x0: 6720, x1: 7360, y: 1660, depth: 110 };
/** The three wild ponds between the basins: no gate, only grass or stones round them. */
export const PONDS = [REED_POND, TURTLE_POND, HOT_SPRING];

/** The paddling pool at the bottom, an oval seen from the side: water from `x0` to `x1`, its middle line at `y`, standing on the lawn at `lawn`. */
export const POOL = { x0: 8580, x1: 9480, y: 2090, ry: 50, lawn: 2160 };

/**
 * The lock gate, measured from the water surface of its basin: a board between two posts (closed from `top` to
 * `bottom`, lifted by `lift`), a beam over it and a big handwheel on the beam. The lifted board clears the duck.
 */
export const GATE = { w: 60, top: -40, bottom: 90, lift: 190, beam: -250, wheelY: -292, wheelR: 46 };
/** The middle of a basin's gate. */
export const gateX = (b: Basin) => b.x1 + GATE.w / 2;
/** Where the duck waits in a basin, its beak just before the gate. */
export const waitSpot = (b: Basin): Pt => ({ x: b.x1 - 90, y: b.y });

/** The top of the grass from one end of the hill to the other: a terrace for every basin and pond, slopes and cliffs between. */
export const GROUND = rounded(
  [
    { x: -400, y: 310 },
    { x: 1030, y: 310 },
    { x: 1250, y: 670 },
    { x: 2420, y: 670 },
    { x: 2640, y: 810 },
    { x: 3570, y: 810 },
    { x: 4180, y: 1020 },
    { x: 4210, y: 1130 },
    { x: 5360, y: 1130 },
    { x: 5440, y: 1250 },
    { x: 6220, y: 1250 },
    { x: 6300, y: 1640 },
    { x: 7400, y: 1640 },
    { x: 7520, y: 1770 },
    { x: 8270, y: 1770 },
    { x: 8560, y: POOL.lawn },
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
/** The water wheel behind the waterfall, dipping into the reed pond; `peg` is how far its four pegs reach out. */
export const WHEEL = { x: 1440, y: 562, r: 125, peg: 168 };
/** The bell on its post left of the wheel; a peg knocks it whenever it passes. */
export const BELL = { x: 1300, y: 470, post: 1238 };
/** Where the bell sits seen from the wheel's axle, in radians: a peg rings it when it gets there. */
export const BELL_ANGLE = Math.atan2(BELL.y - WHEEL.y, BELL.x - WHEEL.x);
/** The stork standing in the reed pond (`x`, its feet), where the duck gets stuck in the reeds, and the nest on its pole behind the second basin. */
export const STORK = { x: 1960, stop: 2090, nest: { x: 3180, y: 480 } };
/** The reeds at the reed pond's right end, where the duck drifts in. */
export const REEDS = [2125, 2170, 2205, 2245, 2290, 2330, 2370];
/** Where the stork lets the duck go, over the second basin. */
export const STORK_DROP = { x: 2880, y: 560 };

/** Stretch 2: a brook down the bank from the second gate to its lip over the turtle's pond. */
export const BROOK = { from: { x: BASINS[1].x1 + GATE.w, y: 840 }, to: { x: 4180, y: 1045 }, depth: 40 };
/** The brook's surface at `x`. */
export const brookY = (x: number) => BROOK.from.y + ((x - BROOK.from.x) * (BROOK.to.y - BROOK.from.y)) / (BROOK.to.x - BROOK.from.x);
/** The fish leaps out of the brook ahead of the duck, over it, and dives back in behind it. */
export const FISH = { from: 4060, to: 3800, height: 230, duration: 1 };
/**
 * The turtle: it comes up under the duck where it stops on the still pond, carries it on its shell to the far shore
 * (`shore`), climbs onto the flat rock there (its shell's top then at `sit` plus `shell`) and bows, so the duck slides
 * off into the third basin. The duck rides `ride` above the pond.
 */
export const TURTLE = { stop: 4470, shore: 5190, sit: { x: 5290, y: 1072 }, ride: 50, shell: 14, rock: { x0: 5230, x1: 5390, y: 1142 } };
/** The frog's lily pad, where it dives in, and the pad it climbs onto afterwards – all on the third basin. */
export const FROG = { pad: 5700, dive: 5860, rest: 5930 };

/** Stretch 3: the twisty slide down the cliff, three runs joined by two round bends. */
const SLIDE_RUNS = [
  [
    { x: 6210, y: 1280 },
    { x: 6550, y: 1345 },
  ],
  [
    { x: 6550, y: 1435 },
    { x: 6360, y: 1475 },
  ],
  [
    { x: 6360, y: 1565 },
    { x: 6660, y: 1605 },
  ],
];
/** The way along the slide, as the line its water's surface follows. */
export const SLIDE_LINE = [
  ...line(SLIDE_RUNS[0][0], SLIDE_RUNS[0][1]),
  ...arc(6550, 1390, 45, -90, 90),
  ...line(SLIDE_RUNS[1][0], SLIDE_RUNS[1][1]),
  ...arc(6360, 1520, 45, 270, 90),
  ...line(SLIDE_RUNS[2][0], SLIDE_RUNS[2][1]),
];
/** The slide's tower: a striped pole behind the bends, with a pointed roof. */
export const TOWER = { x: 6460, top: 1210 };
/** The geyser's vent in the warm spring, and how high its column throws the duck. */
export const GEYSER = { x: 7080, top: 1260 };
/** Where the duck comes down from the geyser, in the last basin. */
const GEYSER_LANDING = { x: 7640, y: BASINS[3].y };

/** Stretch 4: the big pipe from the last gate down into the paddling pool, as the line the duck's waterline follows inside it. */
export const PIPE_LINE = rounded(
  [
    { x: 8278, y: 1792 },
    { x: 8450, y: 1792 },
    { x: 8450, y: 2005 },
    { x: 8575, y: 2005 },
  ],
  60,
);
/** How far the pipe's middle is above the duck's waterline, and the pipe's outer radius. */
export const PIPE = { lift: 38, r: 64 };
/** The fountain in the pool and the three ducklings waiting there. */
export const FOUNTAIN = { x: 9160, y: POOL.y };
export const BABIES = [9270, 9350, 9430];
/** Where the duck ends up in the pool once it has popped out of the pipe. */
export const POOL_SPOT = { x: 8940, y: POOL.y };
/** The duck swims over to its ducklings (`turn`), and leads them back in a row to `end`, each `gap` behind the one before. */
export const PARADE = { turn: 9180, end: 8760, gap: 80 };

/* ---------- The duck's way ---------- */

/** Starts at half speed and ends at one and a half: for water picking the duck up. */
const speedUp = (k: number) => 0.5 * k + 0.5 * k * k;
const falling = (k: number) => 0.4 * k + 0.6 * k * k;

/** How a piece of the duck's way goes. */
interface LegSpec {
  pts: Pt[];
  duration: number;
  ease?: (k: number) => number;
  /** Bobbing on rushing or bubbling water. */
  ride?: boolean;
  /** Stays level, whichever way the way points (on calm water, on a shell, in a beak). */
  flat?: boolean;
  /** Dangling from the stork's beak: it sways a little. */
  swing?: boolean;
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

/** A moment's pause for the duck while something happens round it: it nudges `dx` to the right. */
const nudge = (p: Pt, dx = 6): Pt[] => [p, { x: p.x + dx, y: p.y }];

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

/** The top of the duck's head when its waterline is at `p` and it sits upright, looking right: where a beak takes hold of it. */
export const duckTop = (p: Pt): Pt => ({ x: p.x + 20, y: p.y - 88 });

/* ---------- Stretches ---------- */

/** Something hitting the water at `pt`, `at` seconds into its stretch: drops fly and a ring spreads; `duck` when it is the duck landing. */
export interface SplashSpot {
  at: number;
  pt: Pt;
  size: number;
  duck?: boolean;
}

/** Everything about one stretch, `t` seconds after its gate opened (below 0 while the duck waits at it). */
export interface Stretch {
  /** The basin the duck waits in, before the gate. */
  basin: Basin;
  legs: Leg[];
  /** When the duck splashes into the water below the gate's rush (the gate shuts a little after). */
  land: number;
  /** When the gate starts to close again (the water stops a little after). */
  close: number;
  /** When everything has settled and the duck waits at the next gate (or the level is done). */
  duration: number;
  /** Every splash on the stretch in order, the duck's own landings among them. */
  splashes: SplashSpot[];
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
  const flip = Math.cos(angle) < -0.1;
  // Nose down where the way goes down: for a duck looking left that is turning the other way.
  const lean = flip ? deg(angle) - 180 : deg(angle);
  let tilt = leg.flat ? 0 : Math.max(-40, Math.min(40, ((lean + 540) % 360) - 180));
  let bob = 0;
  if (leg.spin) tilt += leg.spin * k;
  if (leg.ride && moving) {
    bob += 3 * Math.sin(t * 10);
    tilt += 4 * Math.sin(t * 7);
  }
  if (leg.swing) tilt += 9 * Math.sin((t - leg.start) * 5) * Math.min(1, (t - leg.start) * 3);
  // It rocks after its last splash so far.
  let landed = s.land;
  for (const sp of s.splashes) if (sp.duck && sp.at <= t) landed = sp.at;
  bob += wobble(t - landed, 14, 11, 2.6);
  tilt += wobble(t - landed - 0.08, 9, 9, 2.6);
  const scale = leg.pop ? 0.6 + 0.4 * easeOut(clamp01((t - leg.start) / 0.2)) : 1;
  return { pt: { x: pt.x, y: pt.y + bob }, tilt, flip, hidden: !!leg.hidden && k < 1, scale, moving };
}

/** A gate that opens at 0 and shuts `afterLand` seconds after the duck lands, with the sounds every gate makes and a splash for each of the duck's landings. */
function stretch(
  basin: Basin,
  all: Leg[],
  land: number,
  afterLand: number,
  end: number,
  splashes: SplashSpot[],
  more: (at: (t: number, e: Omit<MachineEvent, "at">) => void) => void,
): Stretch {
  const { at, sorted } = timeline();
  const close = land + afterLand;
  at(0, { sound: playCreak });
  at(0.25, { sound: playFlush });
  for (const sp of splashes) if (sp.duck) at(sp.at, { sound: playSplash });
  at(close + 0.6, { sound: () => playKnock(520) });
  more(at);
  const duration = Math.max(end, close + 0.9, legEnd(all[all.length - 1]) + 0.2);
  return { basin, legs: all, land, close, duration, splashes: [...splashes].sort((a, b) => a.at - b.at), events: sorted() };
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

/** A bubble rising to the water's surface: where it is and how big. */
export interface Bubble {
  pt: Pt;
  r: number;
}

/** Bubbles coming up at `x` to the surface `y`, one leaving the depth at each of `times`: each rises for half a second, wobbling. */
function bubblesAt(times: number[], x: number, y: number, t: number): Bubble[] {
  const out: Bubble[] = [];
  times.forEach((born, i) => {
    const k = (t - born) / 0.5;
    if (k < 0 || k > 1) return;
    out.push({ pt: { x: x + ((i * 23) % 40) - 20 + 6 * Math.sin(k * 9), y: y + 60 - 60 * k }, r: 7 + 5 * k + (i % 2) * 3 });
  });
  return out;
}

/** How the stork stands or flies at a moment: its body's middle, its head, its beak's tip, its wings (null while folded, else -1 down to 1 up) and its legs. */
export interface StorkPose {
  body: Pt;
  head: Pt;
  tip: Pt;
  wing: number | null;
  legs: "stand" | "trail" | "tuck";
}

const add = (p: Pt, dx: number, dy: number): Pt => ({ x: p.x + dx, y: p.y + dy });
const mix = (a: Pt, b: Pt, k: number): Pt => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) });

/** Builds the whole water run: the four stretches in turn, and where the things along them are at a moment. */
export function buildWater() {
  const [b0, b1, b2, b3] = BASINS;

  /* Stretch 1: along the flume, down the waterfall past the water wheel, which rings the bell; into the reeds, where
     the stork picks the duck up, flies it over the hill and drops it into the second basin. */
  const stuck = { x: STORK.stop, y: REED_POND.y };
  const pulled = { x: STORK.stop + 8, y: REED_POND.y };
  const lifted = { x: STORK.stop + 30, y: REED_POND.y - 70 };
  const intoBasin1 = { x: 2960, y: b1.y };
  const legs1 = legs(0.5, [
    { pts: [waitSpot(b0), FLUME.from, FLUME.to], duration: 2.2, ease: speedUp, ride: true },
    { pts: quad(FLUME.to, { x: 1480, y: FLUME.to.y }, { x: 1560, y: REED_POND.y }, 16), duration: 0.7, ease: falling },
    { pts: [{ x: 1560, y: REED_POND.y }, stuck], duration: 2.8, ease: easeOut, flat: true },
    { pts: nudge(stuck, pulled.x - stuck.x), duration: 0.7, ease: easeOut, flat: true },
    { pts: [pulled, lifted], duration: 0.6, ease: easeOut, flat: true, swing: true },
    { pts: quad(lifted, { x: 2450, y: 300 }, STORK_DROP, 24), duration: 3.2, ease: easeInOut, flat: true, swing: true },
    { pts: quad(STORK_DROP, { x: 2930, y: STORK_DROP.y }, intoBasin1, 14), duration: 0.6, ease: falling },
    { pts: [intoBasin1, waitSpot(b1)], duration: 2.8, ease: easeOut, flat: true },
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
  const stork = {
    bump: legs1[3].start,
    grab: legs1[4].start,
    takeoff: legs1[5].start,
    release: legs1[6].start,
    nest: legs1[6].start + 1.3,
    clatter: legs1[6].start + 1.45,
  };
  const s1 = stretch(
    b0,
    legs1,
    land1,
    1,
    stork.clatter + 1.2,
    [
      { at: land1, pt: { x: 1500, y: REED_POND.y }, size: 1, duck: true },
      { at: stork.takeoff, pt: { x: STORK.x, y: REED_POND.y }, size: 0.5 },
      { at: legEnd(legs1[6]), pt: intoBasin1, size: 1, duck: true },
    ],
    (at) => {
      at(0.6, { sound: playWhoosh });
      rings.forEach((t) => at(t, { sound: playDing }));
      at(land1 + 0.6, { sound: playQuack });
      at(stork.bump, { sound: playRustle });
      at(stork.grab, { sound: playPeck });
      at(stork.grab + 0.35, { sound: playQuack });
      at(stork.takeoff, { sound: playWhoosh });
      at(stork.release, { sound: playWhoosh });
      at(stork.nest, { sound: playThump });
      at(stork.clatter, { sound: playPeck });
    },
  );
  /** How far the bell swings (degrees) after the last peg knocked it. */
  const bellAt = (t: number) => {
    const last = rings.filter((r) => r <= t).pop();
    return last === undefined ? 0 : wobble(t - last, 16, 16, 3.2);
  };
  /** How far the reeds sway (degrees) once the duck has bumped into them. */
  const reedsAt = (t: number) => wobble(t - stork.bump, 10, 9, 2.4) + wobble(t - stork.grab - 0.4, 6, 9, 2.4);

  // The stork's poses, facing right: standing in the pond, bent down to the duck, flying with it, sitting in its nest.
  const standBody = { x: STORK.x, y: 520 };
  const standHead = add(standBody, 40, -120);
  const standTip = add(standHead, 56, 16);
  const grabTip = duckTop(pulled);
  const bentHead = add(grabTip, -44, -30);
  const bentBody = add(standBody, 14, 12);
  /** Flying, the head sits this far from the beak's tip and the body this far behind the head. */
  const flightHead = (tip: Pt) => add(tip, -34, -40);
  const flightBody = (head: Pt) => add(head, -108, 6);
  const releaseTip = duckTop(STORK_DROP);
  const releaseBody = flightBody(flightHead(releaseTip));
  const nestBody = { x: STORK.nest.x - 10, y: STORK.nest.y - 38 };
  const flap = (t: number) => Math.sin((t - stork.takeoff) * Math.PI * 2 * 2.2 + Math.PI / 2);
  /** The stork, `t` seconds into the first stretch. */
  const storkAt = (t: number): StorkPose => {
    if (t < stork.grab) {
      const k = easeInOut(seg(t, stork.bump + 0.1, stork.grab));
      return { body: mix(standBody, bentBody, k), head: mix(standHead, bentHead, k), tip: mix(standTip, grabTip, k), wing: null, legs: "stand" };
    }
    if (t < stork.release) {
      const tip = duckTop(spotAt(legs1, t).pt);
      const k = easeInOut(seg(t, stork.grab, stork.takeoff));
      const head = mix(add(tip, -44, -30), flightHead(tip), k);
      const body = mix(bentBody, flightBody(head), k);
      return t < stork.takeoff ? { body, head, tip, wing: null, legs: "stand" } : { body, head, tip, wing: flap(t), legs: "trail" };
    }
    const k = seg(t, stork.release, stork.nest);
    const body = hop(releaseBody, nestBody, 70, easeInOut(k));
    if (k < 1) {
      // The head comes up from the beak's hold as it lands.
      const up = easeInOut(seg(k, 0.6, 1));
      const head = add(body, lerp(108, 40, up), lerp(-6, -120, up));
      return { body, head, tip: add(head, lerp(34, 56, up), lerp(40, 16, up)), wing: flap(t) * (1 - up * 0.6), legs: "trail" };
    }
    // In the nest it throws its head back and clatters its beak, then stands still.
    const back = hump(seg(t, stork.clatter, stork.clatter + 1));
    const head = add(body, lerp(40, 16, back), lerp(-120, -132, back));
    const chatter = back > 0 ? 6 * Math.sin((t - stork.clatter) * 38) * back : 0;
    return { body, head, tip: add(head, lerp(56, 18, back), lerp(16, -56, back) + chatter), wing: null, legs: "tuck" };
  };

  /* Stretch 2: down the brook – a fish leaps over the duck – onto the turtle's still pond. The turtle comes up under
     the duck, carries it across, climbs onto the rock and bows, and the duck slides off into the third basin, where the
     frog jumps in. */
  const pond2 = TURTLE_POND;
  const stop2 = { x: TURTLE.stop, y: pond2.y };
  const under = { x: TURTLE.stop + 6, y: pond2.y };
  const onShell = { x: under.x, y: pond2.y - TURTLE.ride };
  const atShore = { x: TURTLE.shore, y: onShell.y };
  const slipped = { x: TURTLE.sit.x + 10, y: TURTLE.sit.y + 2 };
  const intoBasin2 = { x: 5520, y: b2.y };
  const legs2 = legs(0.5, [
    { pts: [waitSpot(b1), BROOK.from, BROOK.to], duration: 3, ease: speedUp, ride: true },
    { pts: quad(BROOK.to, { x: 4250, y: BROOK.to.y }, { x: 4320, y: pond2.y }, 14), duration: 0.55, ease: falling },
    { pts: [{ x: 4320, y: pond2.y }, stop2], duration: 1, ease: easeOut, flat: true },
    { pts: [stop2, under], duration: 1.05, flat: true, ride: true },
    { pts: [under, onShell], duration: 1, ease: easeOut, flat: true },
    { pts: [onShell, atShore], duration: 4.4, ease: easeInOut, flat: true },
    { pts: [atShore, TURTLE.sit], duration: 0.6, ease: easeInOut },
    { pts: [TURTLE.sit, slipped], duration: 0.4, ease: easeIn },
    { pts: quad(slipped, { x: 5380, y: 1078 }, intoBasin2, 16), duration: 0.75, ease: falling },
    { pts: [intoBasin2, waitSpot(b2)], duration: 3.2, ease: easeOut, flat: true },
  ]);
  const land2 = legEnd(legs2[1]);
  const turtle = {
    bubbles: legs2[3].start,
    rise: legs2[4].start,
    swim: legs2[5].start,
    climb: legs2[6].start,
    bow: legs2[7].start,
    off: legs2[8].start,
  };
  const basin2At = legEnd(legs2[8]);
  const fishFrom = whenAt(legs2, (pt) => pt.x >= (FISH.from + FISH.to) / 2) - FISH.duration / 2;
  const frog = { jump: basin2At + 0.15, splash: basin2At + 0.7, climb: basin2At + 1.05, rest: basin2At + 1.45 };
  const strokes = [0.7, 2.1, 3.5].map((dt) => turtle.swim + dt);
  const s2 = stretch(
    b1,
    legs2,
    land2,
    1,
    0,
    [
      { at: fishFrom, pt: { x: FISH.from, y: brookY(FISH.from) }, size: 0.6 },
      { at: land2, pt: { x: 4320, y: pond2.y }, size: 1, duck: true },
      { at: fishFrom + FISH.duration, pt: { x: FISH.to, y: brookY(FISH.to) }, size: 0.6 },
      { at: basin2At, pt: intoBasin2, size: 1, duck: true },
      { at: frog.splash, pt: { x: FROG.dive, y: b2.y }, size: 0.8 },
    ],
    (at) => {
      at(0.6, { sound: playWhoosh });
      at(fishFrom, { sound: playBlub });
      at(fishFrom + FISH.duration, { sound: playPlop });
      at(turtle.bubbles + 0.1, { sound: playBlub });
      at(turtle.rise, { sound: playTrickle });
      strokes.forEach((t) => at(t, { sound: playPlop }));
      at(turtle.climb + 0.5, { sound: playThump });
      at(turtle.off, { sound: playSlide });
      at(frog.jump, { sound: playCroak });
      at(frog.splash, { sound: playSplash });
      at(frog.rest, { sound: playPlop });
      at(frog.rest + 0.3, { sound: playCroak });
    },
  );
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
  const sitTop = { x: TURTLE.sit.x, y: TURTLE.sit.y + TURTLE.shell };
  /**
   * The turtle, `t` seconds into the second stretch: the top of its shell, how it leans (degrees, nose down) and how
   * its flippers swing (-1 to 1), or null while it is still down in the pond.
   */
  const turtleAt = (t: number): { top: Pt; tilt: number; paddle: number } | null => {
    if (t < turtle.rise) return null;
    if (t < turtle.bow) {
      const { pt } = spotAt(legs2, t);
      // Nose up while it climbs onto the rock.
      const tilt = -14 * hump(seg(t, turtle.climb, turtle.bow));
      const paddle = t >= turtle.swim ? Math.sin((t - turtle.swim) * 4.5) : 0;
      return { top: { x: pt.x, y: pt.y + TURTLE.shell }, tilt, paddle };
    }
    // It bows so the duck slides off, then lifts its head again and stays on the rock in the sun.
    const tilt = 16 * easeOut(seg(t, turtle.bow, turtle.off)) * (1 - easeInOut(seg(t, turtle.off + 0.4, turtle.off + 1)));
    return { top: sitTop, tilt, paddle: 0 };
  };
  /** The bubbles that come up before the turtle does. */
  const turtleBubbles = (t: number) =>
    bubblesAt(
      [0.05, 0.4, 0.7, 0.9].map((dt) => turtle.bubbles + dt),
      under.x,
      pond2.y,
      t,
    );

  /* Stretch 3: round and round the twisty slide, a spin through the air and into the warm spring; it bubbles, rumbles,
     and the geyser throws the duck up high and over into the last basin. */
  const lastRun = SLIDE_RUNS[2][1];
  const spring = HOT_SPRING;
  const vent = { x: GEYSER.x, y: spring.y };
  const ventNudged = { x: GEYSER.x + 6, y: spring.y };
  const hiccup = { x: ventNudged.x, y: spring.y - 70 };
  const top = { x: ventNudged.x + 1, y: GEYSER.top };
  const topNudged = { x: top.x + 6, y: top.y };
  const legs3 = legs(0.5, [
    { pts: [waitSpot(b2), ...SLIDE_LINE], duration: 3.4, ease: speedUp, ride: true },
    { pts: quad(lastRun, { x: 6740, y: 1570 }, { x: 6820, y: spring.y }, 16), duration: 0.75, spin: 360 },
    { pts: [{ x: 6820, y: spring.y }, vent], duration: 1.8, ease: easeOut, flat: true },
    { pts: [vent, ventNudged], duration: 1.2, flat: true, ride: true },
    { pts: [ventNudged, hiccup], duration: 0.3, ease: easeOut, flat: true },
    { pts: [hiccup, ventNudged], duration: 0.35, ease: easeIn, flat: true },
    { pts: [ventNudged, { x: ventNudged.x + 1, y: ventNudged.y }], duration: 0.6, flat: true, ride: true },
    { pts: [{ x: ventNudged.x + 1, y: ventNudged.y }, top], duration: 0.7, ease: easeOut, flat: true },
    { pts: [top, topNudged], duration: 0.8, flat: true, ride: true },
    { pts: Array.from({ length: 25 }, (_, i) => hop(topNudged, GEYSER_LANDING, 150, i / 24)), duration: 1.1 },
    { pts: [GEYSER_LANDING, waitSpot(b3)], duration: 3, ease: easeOut, flat: true },
  ]);
  const land3 = legEnd(legs3[1]);
  const geyser = {
    bubbles: legs3[3].start,
    hiccup: legs3[4].start,
    back: legEnd(legs3[5]),
    shoot: legs3[7].start,
    jump: legs3[9].start,
    fallen: legs3[9].start + 0.9,
  };
  // A „whoosh“ at the start of every run: the first, and after each bend.
  const runStarts = SLIDE_RUNS.map((run, i) => whenAt(legs3, (pt) => (i === 0 ? pt.x >= run[0].x : pt.y >= run[0].y - 1)));
  const s3 = stretch(
    b2,
    legs3,
    land3,
    1,
    0,
    [
      { at: land3, pt: { x: 6820, y: spring.y }, size: 1, duck: true },
      { at: geyser.back, pt: ventNudged, size: 0.5, duck: true },
      { at: legEnd(legs3[9]), pt: GEYSER_LANDING, size: 1, duck: true },
    ],
    (at) => {
      runStarts.forEach((t) => at(t, { sound: playSlide }));
      at(legs3[1].start, { sound: playWhoosh });
      at(land3 + 0.6, { sound: playQuack });
      at(geyser.bubbles + 0.1, { sound: playBlub });
      at(geyser.hiccup, { sound: playPop });
      at(geyser.back + 0.25, { sound: playBlub });
      at(geyser.shoot - 0.35, { sound: playRumble });
      at(geyser.shoot, { sound: playWhoosh });
      at(geyser.shoot + 0.75, { sound: playQuack });
      at(geyser.jump + 0.1, { sound: playDrops });
    },
  );
  /** The geyser's bubbles before it shoots. */
  const geyserBubbles = (t: number) =>
    bubblesAt(
      [0.05, 0.35, 0.6, 0.85, 1.05, 2.0, 2.15, 2.3, 2.45].map((dt) => geyser.bubbles + dt),
      vent.x,
      spring.y,
      t,
    );
  /** The top of the geyser's water column, `t` seconds into the third stretch, or null while there is none. */
  const geyserAt = (t: number): number | null => {
    // First only a hiccup lifts the duck a little, then the column shoots it up high.
    if (t >= geyser.hiccup && t < geyser.back) return Math.min(spring.y, spotAt(legs3, t).pt.y + 8);
    if (t < geyser.shoot || t >= geyser.fallen) return null;
    if (t < geyser.jump) return spotAt(legs3, t).pt.y + 8;
    return lerp(top.y + 8, spring.y, easeIn(seg(t, geyser.jump, geyser.fallen)));
  };

  /* Stretch 4: into the pipe, out with a pop into the paddling pool; the fountain sprays and the ducklings quack. The
     duck swims over to them, turns, and leads them back in a row; the fountain sprays again. */
  const turnSpot = { x: PARADE.turn, y: POOL.y + 12 };
  const legs4 = legs(0.5, [
    { pts: [waitSpot(b3), PIPE_LINE[0]], duration: 1, ease: speedUp, ride: true },
    { pts: PIPE_LINE, duration: 1.3, hidden: true },
    { pts: quad(PIPE_LINE[PIPE_LINE.length - 1], { x: 8690, y: 1880 }, { x: 8800, y: POOL.y }, 16), duration: 0.75, pop: true },
    { pts: [{ x: 8800, y: POOL.y }, POOL_SPOT], duration: 1.6, ease: easeOut, flat: true },
    { pts: [POOL_SPOT, turnSpot], duration: 2.2, ease: easeInOut, flat: true },
    { pts: [turnSpot, { x: PARADE.end, y: POOL.y }], duration: 3.4, ease: easeInOut, flat: true },
  ]);
  const land4 = legEnd(legs4[2]);
  const turn = legs4[5].start;
  const follow = BABIES.map((_, i) => turn + 0.35 + i * 0.3);
  const followFor = 3.4;
  const home = Math.max(...follow) + followFor;
  const pool = {
    spray: land4 + 0.3,
    dry: land4 + 2.3,
    quacks: BABIES.map((_, i) => land4 + 0.8 + i * 0.35),
    sparkle: land4 + 1.9,
    turn,
    follow,
    arrive: follow.map((t) => t + followFor),
    again: home + 0.5,
    againDry: home + 2.1,
    done: home + 1.6,
  };
  const s4 = stretch(b3, legs4, land4, 0.4, pool.done, [{ at: land4, pt: { x: 8800, y: POOL.y }, size: 1, duck: true }], (at) => {
    at(legs4[1].start, { sound: playGlug });
    at(legs4[2].start, { sound: playPop });
    at(pool.spray, { sound: playDrops });
    at(pool.spray + 1.2, { sound: playDrops });
    pool.quacks.forEach((t) => at(t, { sound: playQuack }));
    at(pool.sparkle, {
      sound: playTwinkle,
      say: {
        de: "Quak! Da sind die Entenbabys!",
        en: "Quack! Here are the ducklings!",
        zh: "嘎嘎！小鸭子们来啦！",
        hi: "क्वैक! ये रहे बत्तख के बच्चे!",
        es: "¡Cuac! ¡Ahí están los patitos!",
        ar: "كواك! ها هي البطّات الصغيرة!",
        ru: "Кря! А вот и утята!",
      },
    });
    at(pool.turn, { sound: playQuack });
    pool.follow.forEach((t) => at(t, { sound: playPlop }));
    pool.arrive.forEach((t) => at(t, { sound: playQuack }));
    at(pool.again, { sound: playDrops });
    at(pool.again + 0.4, { sound: playTwinkle });
    at(pool.done, { done: true });
  });
  /** A duckling, `t` seconds into the last stretch: where it swims and how high it hops (0 to 1) when it quacks – hello, and once it is in the row. Each looks left, at the duck. */
  const babyAt = (i: number, t: number) => {
    const x = lerp(BABIES[i], PARADE.end + (i + 1) * PARADE.gap, easeInOut(seg(t, pool.follow[i], pool.follow[i] + followFor)));
    const hopAt = (from: number) => {
      const k = (t - from) / 0.4;
      return k < 0 || k > 1 ? 0 : 4 * k * (1 - k);
    };
    return { x, hop: Math.max(hopAt(pool.quacks[i]), hopAt(pool.arrive[i])) };
  };
  /** The fountain's drops, `t` seconds into the last stretch: each leaves the spout, flies up and out and falls back. */
  const dropsAt = (t: number): Pt[] => {
    const out: Pt[] = [];
    // Up at `rise` px/s, pulled down by `pull`: back at the spout after `life` seconds, about 170 px high.
    const rise = 720;
    const pull = 760;
    const life = rise / pull;
    // One drop leaves every 0.04 s while the fountain runs, to the left and the right in turn.
    for (const [from, to] of [
      [pool.spray, pool.dry],
      [pool.again, pool.againDry],
    ]) {
      for (let i = 0, born = from; born <= to; i++, born = from + i * 0.04) {
        const age = t - born;
        if (age < 0 || age > life) continue;
        const vx = (i % 2 ? 1 : -1) * (50 + ((i * 37) % 16) * 10);
        out.push({ x: FOUNTAIN.x + vx * age, y: FOUNTAIN.y - 40 - rise * age + pull * age * age });
      }
    }
    return out;
  };

  const stretches = [s1, s2, s3, s4];
  return {
    stretches,
    wheelAt,
    bellAt,
    reedsAt,
    storkAt,
    stork,
    fishAt,
    frogAt,
    frog,
    turtleAt,
    turtleBubbles,
    turtle,
    geyserAt,
    geyserBubbles,
    geyser,
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
  for (const b of PONDS) {
    if (p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y - 40 && p.y <= b.y + b.depth) return { x: p.x, y: b.y };
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
