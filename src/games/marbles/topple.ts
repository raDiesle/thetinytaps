// „Alles fällt um“: everyday things stand in seven runs, small to tall, and topple onto each other; between two runs
// a link of another kind carries the fall on – a bolster that rolls along a bench onto a pop-up tent, a space hopper
// that bounces away, a toy hot-air balloon whose sandbag drifts into the next run, a skateboard kicked by a roly-poly
// toy, a sailboat on wheels blown by a fan, a hanging egg chair that flings its teddy. The toppling is worked out frame
// by frame (each round brings other things, so it can't be worked out ahead); each link is worked out ahead as a
// function of the seconds since the last thing of its run fell against it, like a machine.

import { decay } from "./level";
import {
  playBlow,
  playBoing,
  playClick,
  playClonk,
  playCreak,
  playKnock,
  playPlop,
  playPop,
  playPuff,
  playRattle,
  playRustle,
  playSlide,
  playSqueak,
  playThump,
  playTrill,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { clamp01, deg, easeIn, easeInOut, easeOut, hop, lerp, seg, turn } from "./machineKit";
import type { Pt } from "./path";
import type { Thing } from "./things";

export const FLOOR = 790;
/** Gravity for the tipping, slower than real so the child can follow. */
export const TIP_GRAVITY = 1000;
/** The first push, in radians per second. */
export const PUSH = 1.3;
/** How fast a link sets the first thing of the next run tipping, in radians per second. */
export const LINK_PUSH = 1.4;
/** Each thing stands this share of its height away from the next, so it can reach it. */
export const SPACING = 0.45;
export const DRUM = { w: 150, h: 110 };
/** Runs of small-to-tall things in the long row (the last one ends with the broom). */
export const GROUPS = 7;
/** The things are drawn this much bigger than their own numbers. */
export const SCALE = 1.3;
/** Room before the first thing and after the drum, in the picture's pixels. */
export const MARGIN = 260;
/** From the drum's bang to the end of the level. */
export const DONE_AFTER_DRUM_S = 2.6;
/** The room's ceiling in the row's units (the row stands on the floor at y = 0, up is negative). */
export const CEILING = -FLOOR / SCALE;
/** Gravity for what flies in a link, in the row's units. */
const G = 1500;

/** Where a spot of the row is in the room. */
export const roomX = (x: number) => MARGIN + x * SCALE;

// ---------------------------------------------------------------------------------------------------------------
// Tipping

/** Corners of a thing standing with its left edge at `left`, tipped by `angle` around its bottom right corner. */
export function corners(left: number, w: number, h: number, angle: number): Pt[] {
  const px = left + w;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    { x: -w, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: -h },
    { x: -w, y: -h },
  ].map((p) => ({ x: px + p.x * c - p.y * s, y: p.x * s + p.y * c }));
}

/** Do two convex shapes overlap? (Separating axis test; it runs for every falling thing in every frame, so it makes no arrays.) */
export function overlaps(a: Pt[], b: Pt[]) {
  return !separates(a, a, b) && !separates(b, a, b);
}

/** Does one of `poly`'s edges have both shapes on either side of it? */
function separates(poly: Pt[], a: Pt[], b: Pt[]) {
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const nx = q.y - p.y;
    const ny = p.x - q.x;
    let aMin = Infinity;
    let aMax = -Infinity;
    for (const r of a) {
      const v = r.x * nx + r.y * ny;
      if (v < aMin) aMin = v;
      if (v > aMax) aMax = v;
    }
    let bMin = Infinity;
    let bMax = -Infinity;
    for (const r of b) {
      const v = r.x * nx + r.y * ny;
      if (v < bMin) bMin = v;
      if (v > bMax) bMax = v;
    }
    if (aMax <= bMin || bMax <= aMin) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------------
// Links

/** Width and height of the thing a link pushes over. */
interface Size {
  w: number;
  h: number;
}

/** How high up a link pushes the next run's first thing: well above its middle, so it tips away. */
export const hitHeight = (next: Size) => Math.min(next.h * 0.72, next.h - 16);

const flightTime = (h: number) => 2 * Math.sqrt((2 * h) / G);
const rect = (w: number, h: number): Pt[] => [
  { x: 0, y: 0 },
  { x: w, y: 0 },
  { x: w, y: -h },
  { x: 0, y: -h },
];
const ellipse = (c: Pt, rx: number, ry: number, n = 12): Pt[] =>
  Array.from({ length: n }, (_, i) => ({ x: c.x + rx * Math.cos((i / n) * 2 * Math.PI), y: c.y + ry * Math.sin((i / n) * 2 * Math.PI) }));
/** A short shake of something that was knocked, `age` seconds after the knock. */
const jolt = (age: number, amp = 3) => (age > 0 && age < 1 ? amp * decay(age * 6) * Math.sin(age * 40) : 0);

export type LinkKind = "bench" | "hopper" | "balloon" | "skate" | "fan" | "chair";
/** The links between the runs, in this order: each one is another way of moving on. */
export const LINK_KINDS: LinkKind[] = ["bench", "hopper", "balloon", "skate", "fan", "chair"];

interface LinkBase {
  /** From the link's left edge (where the run before ends) to the next run's first thing. */
  width: number;
  /** What the last thing of the run before falls against, in the link's own units: x from its left edge, y up from the floor (negative). */
  stand: Pt[];
  /** The stand moves away once it is hit, so the thing that hit it falls on to the floor. */
  releases: boolean;
  /** Seconds after the hit when the link pushes the next run's first thing. */
  hitAt: number;
  /** Sounds, seconds after the hit; one of them comes at `hitAt`. */
  sounds: { at: number; play: () => void }[];
  /** Where the camera looks (x), seconds after the hit. */
  focus: (age: number) => number;
  /** The front of what pushes the next thing, seconds after the hit: it gets to x = `width` at `hitAt`, not before. */
  pusher: (age: number) => Pt;
}

/** A bench with a bolster on it and a folded pop-up tent after it. */
export const BENCH = { w: 820, h: 96, seat: 18 };
export const BOLSTER_R = 30;
export const TENT = { flat: 22, w: 230, h: 150 };
export interface BenchPose {
  bolster: Pt;
  /** How far the bolster has turned, radians. */
  spin: number;
  /** The folded tent pressed down by the bolster landing on it, 0–1. */
  press: number;
  /** The tent springing open, 0 folded – 1 open. */
  tent: number;
  jolt: number;
}
export interface BenchLink extends LinkBase {
  kind: "bench";
  tentX: number;
  pose: (age: number) => BenchPose;
}

/**
 * The bench jolts, and the bolster lying on it rolls along it, slower and slower, drops off its end onto the folded
 * pop-up tent and presses it flat; the tent springs open, boing, and throws the bolster in a high arc against the next
 * thing's top.
 */
function benchLink(next: Size): BenchLink {
  const r = BOLSTER_R;
  const start = { x: 170, y: -BENCH.h - r };
  const rollFrom = 0.35;
  const v0 = 160;
  const slow = 12;
  const edge = BENCH.w + 4;
  const off = edge - start.x;
  const rollT = (v0 - Math.sqrt(v0 * v0 - 2 * slow * off)) / slow;
  const vOff = v0 - slow * rollT;
  const landY = -TENT.flat - r;
  const dropT = Math.sqrt((2 * (landY - start.y)) / G);
  const land = { x: edge + vOff * dropT, y: landY };
  const tOff = rollFrom + rollT;
  const tLand = tOff + dropT;
  const tSpring = tLand + 0.3;
  const hitAt = tSpring + 1.4;
  const width = Math.round(land.x + 340);
  const target = { x: width - r, y: -hitHeight(next) };
  const rest = { x: width - r - 10, y: -r };
  const landed = (off + vOff * dropT) / r;
  const pose = (age: number): BenchPose => {
    let bolster: Pt;
    let spin: number;
    if (age < tOff) {
      const t = Math.max(0, age - rollFrom);
      const d = v0 * t - (slow / 2) * t * t;
      bolster = { x: start.x + d, y: start.y };
      spin = d / r;
    } else if (age < tLand) {
      const t = age - tOff;
      bolster = { x: edge + vOff * t, y: start.y + 0.5 * G * t * t };
      spin = (off + vOff * t) / r;
    } else if (age < tSpring) {
      bolster = { x: land.x, y: land.y + 8 * easeOut(seg(age, tLand, tLand + 0.12)) };
      spin = landed;
    } else if (age < hitAt) {
      const k = seg(age, tSpring, hitAt);
      bolster = hop(land, target, 260, k);
      spin = landed + 4 * k;
    } else {
      const k = seg(age, hitAt, hitAt + 0.3);
      bolster = { x: lerp(target.x, rest.x, k), y: lerp(target.y, rest.y, easeIn(k)) };
      spin = landed + 4 - 0.6 * k;
    }
    const press = age >= tLand && age < tSpring ? easeOut(seg(age, tLand, tLand + 0.12)) : 0;
    return { bolster, spin, press, tent: easeOut(seg(age, tSpring, tSpring + 0.22)), jolt: jolt(age) };
  };
  return {
    kind: "bench",
    width,
    stand: rect(BENCH.w, BENCH.h),
    releases: false,
    hitAt,
    sounds: [
      { at: rollFrom, play: playRustle },
      { at: tLand, play: playPlop },
      { at: tSpring, play: playBoing },
      { at: hitAt, play: playThump },
    ],
    focus: (age) => pose(age).bolster.x,
    pusher: (age) => {
      const p = pose(age).bolster;
      return { x: p.x + r, y: p.y };
    },
    tentX: land.x,
    pose,
  };
}

/** A space hopper: a big rubber ball with two horns to hold. */
export const HOPPER_R = 64;
/** Its bounces: how high, how far. */
const HOPS = [
  [360, 200],
  [300, 190],
  [240, 175],
  [190, 160],
  [150, 145],
] as const;
export interface HopperPose {
  ball: Pt;
  /** Squashed on the floor, 0–1. */
  squash: number;
  /** Leaning into its jump, degrees. */
  tilt: number;
}
export interface HopperLink extends LinkBase {
  kind: "hopper";
  pose: (age: number) => HopperPose;
}

/** The space hopper is knocked off its spot and bounces away, boing, boing, lower each time, until a last little hop knocks the next thing's top. */
function hopperLink(next: Size): HopperLink {
  const r = HOPPER_R;
  let t = 0;
  let x = r;
  const arcs = HOPS.map(([h, dx]) => {
    const arc = { t0: t, t1: t + flightTime(h), x0: x, x1: x + dx, h };
    t = arc.t1;
    x = arc.x1;
    return arc;
  });
  const lastFloor = { x, y: -r };
  const hitAt = t + 0.5;
  const width = Math.round(x + 120 + r);
  const target = { x: width - r, y: -hitHeight(next) };
  const back = { x: target.x - 70, y: -r };
  const pose = (age: number): HopperPose => {
    const squash = Math.max(0, ...arcs.map((a) => 1 - Math.abs(age - a.t1) / 0.07), 1 - Math.abs(age) / 0.07);
    if (age <= 0) return { ball: { x: r, y: -r }, squash: 0, tilt: 0 };
    const arc = arcs.find((a) => age < a.t1);
    if (arc) {
      const k = seg(age, arc.t0, arc.t1);
      return { ball: { x: lerp(arc.x0, arc.x1, k), y: -r - 4 * arc.h * k * (1 - k) }, squash, tilt: 10 * Math.sin(Math.PI * k) };
    }
    if (age < hitAt) return { ball: hop(lastFloor, target, 70, seg(age, t, hitAt)), squash, tilt: 8 };
    const k = seg(age, hitAt, hitAt + 0.45);
    return { ball: hop(target, back, 40, k), squash: 0, tilt: 8 * (1 - k) };
  };
  return {
    kind: "hopper",
    width,
    stand: ellipse({ x: r, y: -r }, r, r),
    releases: true,
    hitAt,
    sounds: [
      { at: 0, play: playBoing },
      ...arcs.map((a) => ({ at: a.t1, play: playBoing })),
      { at: hitAt, play: () => playKnock(500) },
      { at: hitAt + 0.45, play: playPlop },
    ],
    focus: (age) => pose(age).ball.x,
    pusher: (age) => {
      const p = pose(age).ball;
      return { x: p.x + r, y: p.y };
    },
    pose,
  };
}

/** A pouf with a toy hot-air balloon tied to it; a sandbag hangs from the balloon's basket on a rope. */
export const POUF = { w: 150, h: 92 };
export const BALLOON = { rx: 62, ry: 74, basket: 44, basketH: 30, lines: 40, rope: 210, bag: 20 };
export interface BalloonPose {
  /** The middle of the basket's bottom. */
  basket: Pt;
  bag: Pt;
  /** The rope still hangs slack. */
  slack: boolean;
  /** The ribbon still ties it to the pouf. */
  tied: boolean;
  /** The pouf squashed by the knock, 0–1. */
  puff: number;
}
export interface BalloonLink extends LinkBase {
  kind: "balloon";
  pose: (age: number) => BalloonPose;
}

/**
 * The pouf is knocked, the ribbon holding the toy balloon comes loose, pop, and the balloon rises slowly and drifts
 * to the right, lifting its sandbag off the floor; the sandbag swings along under it and knocks the next thing's top.
 * Then the balloon floats on up under the ceiling.
 */
function balloonLink(next: Size): BalloonLink {
  const liftAt = 0.4;
  const riseT = 3.4;
  const vx = 52;
  const hitAt = 8.7;
  const x0 = 80;
  const rope = BALLOON.rope;
  const half = BALLOON.bag / 2;
  const top = -hitHeight(next) - rope;
  const bagRest = { x: POUF.w + 18, y: -half };
  const after = (age: number) => Math.max(0, age - hitAt);
  const basketAt = (age: number): Pt => {
    const drift = vx * (Math.max(0, Math.min(age, hitAt) - liftAt) + (1 - decay(after(age))));
    const bob = 5 * Math.sin(2.4 * Math.max(0, age - liftAt - riseT)) * seg(age, liftAt + riseT - 0.6, liftAt + riseT);
    const y = lerp(lerp(-POUF.h, top, easeInOut(seg(age, liftAt, liftAt + riseT))), -380, easeInOut(seg(age, hitAt, hitAt + 3)));
    return { x: x0 + drift, y: y + bob };
  };
  // When the rope first comes taut, and at what angle it then hangs.
  let tLift = liftAt;
  while (tLift < hitAt && Math.hypot(bagRest.x - basketAt(tLift).x, bagRest.y - basketAt(tLift).y) < rope) tLift += 0.005;
  const b0 = basketAt(tLift);
  const phi0 = Math.atan2(bagRest.x - b0.x, bagRest.y - b0.y);
  /** Trailing a little behind as it drifts right. */
  const phiDrift = -0.07;
  const pose = (age: number): BalloonPose => {
    const basket = basketAt(age);
    const puff = Math.max(0, 1 - age / 0.4) * (age > 0 ? 1 : 0);
    if (age < tLift) return { basket, bag: bagRest, slack: true, tied: age < liftAt, puff };
    const u = age - tLift;
    const phi = phiDrift + (phi0 - phiDrift) * decay(1.1 * u) * Math.cos(2.6 * u);
    const bag = { x: basket.x + rope * Math.sin(phi), y: Math.min(-half, basket.y + rope * Math.cos(phi)) };
    return { basket, bag, slack: false, tied: false, puff };
  };
  const width = Math.round(pose(hitAt).bag.x + half);
  return {
    kind: "balloon",
    width,
    stand: rect(POUF.w, POUF.h),
    releases: false,
    hitAt,
    sounds: [
      { at: 0, play: playPuff },
      { at: liftAt, play: playPop },
      { at: liftAt + 0.2, play: playWhoosh },
      { at: tLift, play: playRustle },
      { at: hitAt, play: () => playKnock(520) },
    ],
    focus: (age) => pose(age).basket.x,
    pusher: (age) => {
      const p = pose(age).bag;
      return { x: p.x + half, y: p.y };
    },
    pose,
  };
}

/** A roly-poly toy, a skateboard, a play tunnel the board rolls through, and a ramp. */
export const ROLY = { r: 52, head: 32, x: 58 };
export const BOARD = { len: 150, deck: 10, wheel: 9 };
export const TUNNEL = { len: 300, h: 120, x: 560 };
export const RAMP = { len: 150, angle: 0.4 };
const DECK_Y = -2 * BOARD.wheel - BOARD.deck / 2;
export interface SkatePose {
  /** The roly-poly rocking, radians (right is positive). */
  roly: number;
  /** The middle of the board's deck. */
  board: Pt;
  /** The board's tilt, degrees (nose up is negative). */
  tilt: number;
}
export interface SkateLink extends LinkBase {
  kind: "skate";
  rampX: number;
  pose: (age: number) => SkatePose;
}

/**
 * The roly-poly toy rocks over, its tune trilling, and bumps the skateboard's tail; the board rattles off across the
 * floor, through the play tunnel and out again, up the ramp, and jumps against the next thing's top. The roly-poly
 * rocks on and comes to rest upright.
 */
function skateLink(next: Size): SkateLink {
  const kickAt = 0.25;
  const start = { x: 200, y: DECK_Y };
  const v0 = 260;
  const slow = 14;
  const run = 900;
  const rollT = (v0 - Math.sqrt(v0 * v0 - 2 * slow * run)) / slow;
  const rampFrom = { x: start.x + run, y: DECK_Y };
  const rampTo = { x: rampFrom.x + RAMP.len * Math.cos(RAMP.angle), y: DECK_Y - RAMP.len * Math.sin(RAMP.angle) };
  const tRamp = kickAt + rollT;
  const tFly = tRamp + 0.8;
  const hitAt = tFly + 0.6;
  const width = Math.round(rampTo.x + 230);
  const target = { x: width - BOARD.len / 2, y: -hitHeight(next) };
  const rest = { x: target.x - 14, y: DECK_Y };
  const rampDeg = -deg(RAMP.angle);
  const pose = (age: number): SkatePose => {
    const roly = age <= 0 ? 0 : 0.42 * decay(1.3 * age) * Math.sin((2 * Math.PI * age) / 1.0);
    if (age < tRamp) {
      const t = Math.max(0, age - kickAt);
      return { roly, board: { x: start.x + v0 * t - (slow / 2) * t * t, y: DECK_Y }, tilt: 0 };
    }
    if (age < tFly) {
      const k = seg(age, tRamp, tFly);
      return { roly, board: { x: lerp(rampFrom.x, rampTo.x, k), y: lerp(rampFrom.y, rampTo.y, k) }, tilt: rampDeg * clamp01(k * 6) };
    }
    if (age < hitAt) {
      const k = seg(age, tFly, hitAt);
      return { roly, board: hop(rampTo, target, 80, k), tilt: lerp(rampDeg, -4, k) };
    }
    const k = seg(age, hitAt, hitAt + 0.35);
    return { roly, board: { x: lerp(target.x, rest.x, k), y: lerp(target.y, rest.y, easeIn(k)) }, tilt: -4 * (1 - k) };
  };
  const tTunnel = kickAt + (v0 - Math.sqrt(v0 * v0 - 2 * slow * (TUNNEL.x - BOARD.len / 2 - start.x))) / slow;
  return {
    kind: "skate",
    width,
    stand: [
      { x: ROLY.x, y: -2 * ROLY.r - 2 * ROLY.head },
      { x: ROLY.x + 30, y: -2 * ROLY.r - ROLY.head - 14 },
      { x: ROLY.x + ROLY.r, y: -ROLY.r - 20 },
      { x: ROLY.x + ROLY.r, y: -ROLY.r + 10 },
      { x: ROLY.x + 22, y: -2 },
      { x: ROLY.x - 22, y: -2 },
      { x: ROLY.x - ROLY.r, y: -ROLY.r + 10 },
      { x: ROLY.x - ROLY.r, y: -ROLY.r - 20 },
      { x: ROLY.x - 30, y: -2 * ROLY.r - ROLY.head - 14 },
    ],
    releases: false,
    hitAt,
    sounds: [
      { at: 0, play: playTrill },
      { at: kickAt, play: playClick },
      { at: kickAt + 0.05, play: playRattle },
      { at: tTunnel, play: playRustle },
      { at: tRamp, play: playSlide },
      { at: tFly, play: playWhoosh },
      { at: hitAt, play: playClonk },
      { at: hitAt + 0.35, play: () => playKnock(320) },
    ],
    focus: (age) => pose(age).board.x,
    pusher: (age) => {
      const { board, tilt } = pose(age);
      return turn({ x: board.x + BOARD.len / 2, y: board.y }, board, (tilt * Math.PI) / 180);
    },
    rampX: rampFrom.x,
    pose,
  };
}

/** A stool with a big button on its side and a fan on it; a toy sailboat on wheels stands in front of it. */
export const STOOL = { w: 180, h: 120 };
export const FAN = { x: 125, neck: 72, r: 54 };
export const BOAT = { x: 330, len: 124, mast: 170 };
/** How far the bowsprit reaches past the boat's bow. */
export const SPRIT = 36;
export interface FanPose {
  /** How far the blades have turned, degrees. */
  blades: number;
  /** How strong the wind blows, 0–1. */
  wind: number;
  /** The middle of the boat's keel, on the floor. */
  boat: number;
  /** The button pressed in, 0–1. */
  button: number;
}
export interface FanLink extends LinkBase {
  kind: "fan";
  spritY: number;
  pose: (age: number) => FanPose;
}

/**
 * The knock presses the big button on the stool, click: the fan on it whirrs up, and its wind fills the sail of the
 * toy boat on wheels, which rolls away faster and faster until its bowsprit pokes the next thing's top. The fan
 * runs down again.
 */
function fanLink(next: Size): FanLink {
  const goAt = 1.15;
  const a = 48;
  const run = 780;
  const hitAt = goAt + Math.sqrt((2 * run) / a);
  const stopAt = hitAt + 0.6;
  const full = 18;
  const spin = (age: number) => {
    if (age <= 0) return 0;
    if (age < 1) return (full / 2) * age * age;
    if (age < stopAt) return full / 2 + full * (age - 1);
    const u = Math.min(2, age - stopAt);
    return full / 2 + full * (stopAt - 1) + full * u - (full / 4) * u * u;
  };
  const boatX = (age: number) => {
    if (age < hitAt) return BOAT.x + 0.5 * a * Math.max(0, age - goAt) ** 2;
    return BOAT.x + run - 24 * easeOut(seg(age, hitAt, hitAt + 0.35));
  };
  const pose = (age: number): FanPose => ({
    blades: deg(spin(age)),
    wind: seg(age, 0.3, 1) * (1 - seg(age, stopAt, stopAt + 1.5)),
    boat: boatX(age),
    button: age > 0 ? 1 - seg(age, stopAt, stopAt + 0.3) : 0,
  });
  const spritY = -hitHeight(next);
  return {
    kind: "fan",
    width: Math.round(BOAT.x + run + BOAT.len / 2 + SPRIT),
    stand: rect(STOOL.w, STOOL.h),
    releases: false,
    hitAt,
    sounds: [
      { at: 0, play: playClick },
      { at: 0.1, play: playWhirr },
      { at: 0.9, play: playBlow },
      { at: goAt + 0.2, play: playRustle },
      { at: hitAt, play: () => playKnock(650) },
    ],
    focus: (age) => boatX(age),
    pusher: (age) => ({ x: boatX(age) + BOAT.len / 2 + SPRIT, y: spritY }),
    spritY,
    pose,
  };
}

/** An egg chair hanging from the ceiling on a rope, with a teddy sitting in it. */
export const EGG = { x: 88, w: 170, h: 190, bottom: -100 };
export const TEDDY = { w: 56, h: 64 };
export interface ChairPose {
  /** How far the chair has swung out, radians (right is positive). */
  swing: number;
  /** Where the teddy is: in the chair (in the chair's own frame, unswung) or flying. */
  teddy: Pt;
  /** The teddy has left the chair. */
  free: boolean;
  /** The teddy's turn, degrees. */
  roll: number;
}
export interface ChairLink extends LinkBase {
  kind: "chair";
  hook: Pt;
  pose: (age: number) => ChairPose;
}

/**
 * The thing falls into the hanging egg chair, which swings away, creak, and back, and out again; the teddy in it slides
 * to the front a little at each swing, and as the chair swings out the third time it tumbles out, squeak, and lands
 * against the next thing's top.
 */
function chairLink(next: Size): ChairLink {
  const hook = { x: EGG.x, y: CEILING };
  const centre = { x: EGG.x, y: EGG.bottom - EGG.h / 2 };
  const L = centre.y - hook.y;
  const T = 2 * Math.PI * Math.sqrt(L / G);
  const swing = (age: number) => (age <= 0 ? 0 : 0.45 * decay(0.08 * age) * Math.sin((2 * Math.PI * age) / T));
  const flingAt = 2 * T;
  const hitAt = flingAt + 0.9;
  const seat = (age: number) => ({ x: centre.x - 10 + 36 * easeInOut(seg(age, 0.2, flingAt)), y: centre.y + 30 });
  const from = turn(seat(flingAt), hook, -swing(flingAt));
  const width = Math.round(from.x + 300);
  const target = { x: width - TEDDY.w / 2, y: -hitHeight(next) };
  const rest = { x: target.x - 8, y: -TEDDY.h / 2 };
  const pose = (age: number): ChairPose => {
    const s = swing(age);
    if (age < flingAt) return { swing: s, teddy: seat(age), free: false, roll: 0 };
    if (age < hitAt) {
      const k = seg(age, flingAt, hitAt);
      return { swing: s, teddy: hop(from, target, 90, k), free: true, roll: 360 * easeOut(k) };
    }
    const k = seg(age, hitAt, hitAt + 0.35);
    return { swing: s, teddy: { x: lerp(target.x, rest.x, k), y: lerp(target.y, rest.y, easeIn(k)) }, free: true, roll: 360 };
  };
  return {
    kind: "chair",
    width,
    stand: ellipse(centre, EGG.w / 2, EGG.h / 2, 10),
    releases: true,
    hitAt,
    sounds: [
      { at: T / 4, play: playCreak },
      { at: (5 * T) / 4, play: playCreak },
      { at: flingAt, play: playSqueak },
      { at: hitAt, play: playThump },
    ],
    focus: (age) => (age < flingAt ? turn(centre, hook, -swing(age)).x : pose(age).teddy.x),
    pusher: (age) => {
      const p = pose(age);
      const at = p.free ? p.teddy : turn(p.teddy, hook, -p.swing);
      return { x: at.x + TEDDY.w / 2, y: at.y };
    },
    hook,
    pose,
  };
}

export type Link = BenchLink | HopperLink | BalloonLink | SkateLink | FanLink | ChairLink;

const MAKERS: Record<LinkKind, (next: Size) => Link> = {
  bench: benchLink,
  hopper: hopperLink,
  balloon: balloonLink,
  skate: skateLink,
  fan: fanLink,
  chair: chairLink,
};

// ---------------------------------------------------------------------------------------------------------------
// The row

export interface PlacedLink {
  link: Link;
  /** Its left edge in the row. */
  left: number;
  /** The thing that falls against it (the last of its run) and the one it pushes (the first of the next). */
  from: number;
  to: number;
}

export interface Layout {
  things: Thing[];
  /** Left edge of each thing, before scaling. */
  lefts: number[];
  links: PlacedLink[];
  drumLeft: number;
  /** The whole room, in the picture's pixels. */
  worldW: number;
}

/** The runs one after the other with a link between each two, and the drum after the last. */
export function layOut(runs: Thing[][]): Layout {
  const things: Thing[] = [];
  const lefts: number[] = [];
  const links: PlacedLink[] = [];
  let x = 0;
  runs.forEach((run, r) => {
    for (const t of run) {
      things.push(t);
      lefts.push(x);
      x += t.w + Math.max(16, t.h * SPACING);
    }
    if (r === runs.length - 1) return;
    const link = MAKERS[LINK_KINDS[r % LINK_KINDS.length]](runs[r + 1][0]);
    links.push({ link, left: x, from: things.length - 1, to: things.length });
    x += link.width;
  });
  return { things, lefts, links, drumLeft: x, worldW: roomX(x + DRUM.w) + MARGIN };
}

interface Tipping {
  /** Angle in radians, 0 standing, π/2 lying on the floor. */
  angle: number;
  /** Angular speed, radians per second. */
  spin: number;
  started: boolean;
  /** Has already hit what stands after it. */
  touched: boolean;
}

/** The row while it falls: each thing's tipping, when each link was hit, and the clock since the push. */
export interface Sim {
  layout: Layout;
  tips: Tipping[];
  /** Seconds since the push when each link was hit, or null. */
  linkHit: (number | null)[];
  /** Seconds since the push. */
  t: number;
  /** When the broom hit the drum, or null. */
  drumAt: number | null;
}

export function createSim(layout: Layout): Sim {
  return {
    layout,
    tips: layout.things.map(() => ({ angle: 0, spin: 0, started: false, touched: false })),
    linkHit: layout.links.map(() => null),
    t: 0,
    drumAt: null,
  };
}

/** The tap: the first thing starts to tip. */
export function pushFirst(sim: Sim) {
  sim.tips[0].started = true;
  sim.tips[0].spin = PUSH;
}

/** Seconds since its hit for each link (0 before it is hit, so it stands still). */
export const linkAge = (sim: Sim, k: number) => {
  const hit = sim.linkHit[k];
  return hit === null ? 0 : sim.t - hit;
};

/** One step of `dt` seconds; returns the sounds to play and whether the broom just hit the drum. */
export function stepSim(sim: Sim, dt: number): { sounds: (() => void)[]; drum: boolean } {
  const { things, lefts, links, drumLeft } = sim.layout;
  const sounds: (() => void)[] = [];
  let drum = false;
  sim.t += dt;
  const tips = sim.tips;
  tips.forEach((o, i) => {
    if (!o.started) return;
    const thing = things[i];
    const k = links.findIndex((l) => l.from === i);
    let next: Pt[] | null;
    if (k >= 0) {
      const { link, left } = links[k];
      next = link.releases && sim.linkHit[k] !== null ? null : link.stand.map((p) => ({ x: left + p.x, y: p.y }));
    } else if (i + 1 < things.length) next = corners(lefts[i + 1], things[i + 1].w, things[i + 1].h, tips[i + 1].angle);
    else next = rect(DRUM.w, DRUM.h).map((p) => ({ x: drumLeft + p.x, y: p.y }));
    o.spin += ((1.5 * TIP_GRAVITY) / thing.h) * Math.sin(Math.max(o.angle, 0.02)) * dt;
    let angle = Math.min(Math.PI / 2, o.angle + o.spin * dt);
    if (next && overlaps(corners(lefts[i], thing.w, thing.h, angle), next)) {
      // Lean on what stands next: the furthest angle that doesn't go into it.
      let lo = o.angle;
      let hi = angle;
      for (let n = 0; n < 14; n++) {
        const mid = (lo + hi) / 2;
        if (overlaps(corners(lefts[i], thing.w, thing.h, mid), next)) hi = mid;
        else lo = mid;
      }
      angle = lo;
      if (!o.touched) {
        o.touched = true;
        sounds.push(thing.sound);
        if (k >= 0) sim.linkHit[k] = sim.t;
        else if (i + 1 < things.length) {
          const n = tips[i + 1];
          n.started = true;
          n.spin = Math.max(1.2, (o.spin * thing.h * 0.8) / things[i + 1].h);
        } else {
          sim.drumAt = sim.t;
          drum = true;
        }
      }
      o.spin = 0;
    }
    if (angle >= Math.PI / 2) o.spin = o.spin > 2 ? -o.spin * 0.2 : 0;
    o.angle = angle;
  });
  links.forEach(({ link, to }, k) => {
    const hit = sim.linkHit[k];
    if (hit === null) return;
    const age = sim.t - hit;
    for (const s of link.sounds) if (s.at > age - dt && s.at <= age) sounds.push(s.play);
    if (age >= link.hitAt && !tips[to].started) {
      tips[to].started = true;
      tips[to].spin = LINK_PUSH;
    }
  });
  return { sounds, drum };
}

/** Where the camera looks in the row: at the drum at the end, at a link while it carries the fall, else at the one falling furthest along. */
export function focusX(sim: Sim) {
  const { things, lefts, links, drumLeft } = sim.layout;
  if (sim.drumAt !== null) return drumLeft + DRUM.w / 2;
  let front = -1;
  sim.tips.forEach((o, i) => {
    if (o.started) front = i;
  });
  if (front < 0) return 0;
  const k = links.findIndex((l) => l.from === front);
  if (k >= 0 && sim.linkHit[k] !== null) return links[k].left + links[k].link.focus(linkAge(sim, k));
  return lefts[front] + things[front].w;
}

/** All the links' seconds, for a limit on how long the row may take before it ends anyway. */
export const linksSeconds = (layout: Layout) => layout.links.reduce((s, l) => s + l.link.hitAt, 0);
