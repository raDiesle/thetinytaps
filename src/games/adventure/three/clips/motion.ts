import type { MotionClipId } from "../../library/types";
import { type ArmPose, FOREARM, type Pose, restPose, SHOULDER, UPPER_ARM } from "../guide";

// Building blocks the clips are made of (phases, crouching, steps, jumps) and the
// timings stories match their world to (jump, brush, crank, key, stop dance).

export type Clip = (t: number, p: Pose) => void;

/** A group of clips by id; the ids come from the keys, so each clip gets its (t, p) types. */
export const clips = <K extends MotionClipId>(group: Record<K, Clip>) => group;

/** The pose of `clip`, `t` seconds after it started. */
export function posed(clip: Clip, t: number) {
  const p = restPose();
  clip(t, p);
  return p;
}

export const TAU = Math.PI * 2;
export const smooth = (k: number) => k * k * (3 - 2 * k);
export const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
/** 0..1 within the current loop of `period` seconds. */
export const phase = (t: number, period: number) => (t / period) % 1;
/** 0 → 1 → 0 once per period, smooth. */
export const swing = (t: number, period: number) => 0.5 - 0.5 * Math.cos(phase(t, period) * TAU);
/**
 * A wave (-1..1) that stays longer near its ends and passes the middle quicker, so each end of a
 * movement holds for a moment, like a pose to copy; it reaches the ends and the middle at the same
 * times as the plain wave, so the world stays in step.
 */
export const linger = (s: number) => Math.sign(s) * Math.abs(s) ** 0.55;
/** Goes up between `from` and `to` (0..1 of the loop), holds, and comes back down after `back`. */
export function hold(k: number, from: number, to: number, back: number, end: number) {
  if (k < from) return 0;
  if (k < to) return smooth((k - from) / (to - from));
  if (k < back) return 1;
  if (k < end) return 1 - smooth((k - back) / (end - back));
  return 0;
}

/** Knees bent and bottom down; 1 is a deep squat. */
export function crouch(p: Pose, c: number) {
  p.legL.lift = p.legR.lift = c * 1.05;
  p.legL.knee = p.legR.knee = c * 2.1;
  p.bend += c * 0.45;
}

/** Small steps on the spot, so turning or balancing looks like walking. */
export function steps(p: Pose, t: number, period: number, lift: number) {
  const s = Math.sin(phase(t, period) * TAU);
  p.legL.lift = Math.max(0, s) * lift;
  p.legL.knee = Math.max(0, s) * lift * 1.6;
  p.legR.lift = Math.max(0, -s) * lift;
  p.legR.knee = Math.max(0, -s) * lift * 1.6;
}

/** The fox's hips half apart, and the length of a straight leg (thigh and shin, see guide.ts). */
const HIP = 0.11;
const LEG = 0.48;

/**
 * Feet set down sideways at `footL` and `footR` (m from the middle, positive
 * to the fox's left) under hips shifted by `p.shift`: each leg spreads to reach
 * its foot, and the standing legs bend at the knees so both soles stay on the
 * ground in a wide stance. `upL`/`upR` (0..1) lift a foot off the ground.
 */
export function feetAt(p: Pose, footL: number, footR: number, upL: number, upR: number) {
  const reach = (offset: number) => Math.asin(Math.max(-0.9, Math.min(0.9, offset / LEG)));
  const spreadL = reach(footL - (p.shift + HIP));
  const spreadR = reach(-(footR - (p.shift - HIP)));
  // The hips sink to the lower of the two standing legs; a lifted foot does not hold them up.
  const height = (spread: number) => (LEG / 2) * (1 + Math.cos(spread));
  const hips = Math.min(height(spreadL) + upL * 0.2, height(spreadR) + upR * 0.2, LEG);
  const leg = (l: Pose["legL"], spread: number, up: number) => {
    const bend = Math.acos(Math.min(1, hips / height(spread)));
    l.spread = spread;
    l.lift = bend + up * 0.55;
    l.knee = bend * 2 + up * 1.1;
  };
  leg(p.legL, spreadL, upL);
  leg(p.legR, spreadR, upR);
}

/** Seconds of one jump of the jump clip: straight up, to bump the head on something above. */
export const JUMP_PERIOD = 1.6;
/** When the feet leave the ground and land again, as parts of one jump. */
const TAKE_OFF = 0.4;
const LANDING = 0.75;
/** How high the jumps go (m). */
export const JUMP_HEIGHT = 0.42;
/** Seconds into a jump when it is highest. */
export const JUMP_PEAK = ((TAKE_OFF + LANDING) / 2) * JUMP_PERIOD;
/** How far through the current jump of the jump clip `t` is: 0 until take-off, 1 from the landing on. */
export function jumpProgress(t: number) {
  return clamp01((phase(t, JUMP_PERIOD) - TAKE_OFF) / (LANDING - TAKE_OFF));
}
/** Seconds into a jump when the feet land. */
export const JUMP_LANDING = LANDING * JUMP_PERIOD;

/**
 * One jump, k 0..1 of it: dip into the knees with the arms swinging back,
 * push off onto the toes with the arms swinging up, fly with the knees a
 * little tucked, and land softly into the knees again. Returns the flight
 * (0..1) or -1 on the ground.
 */
export function jump(p: Pose, k: number, height: number, takeOff = TAKE_OFF, landing = LANDING) {
  const ready = takeOff * 0.7;
  const push = k > ready && k < takeOff ? (k - ready) / (takeOff - ready) : 0;
  const dip = k < ready ? smooth(k / ready) : k < takeOff ? 1 - smooth(push) : 0;
  const land = k > landing ? Math.sin(((k - landing) / (1 - landing)) * Math.PI) : 0;
  const flight = k > takeOff && k < landing ? (k - takeOff) / (landing - takeOff) : -1;
  crouch(p, dip * 0.5 + land * 0.4);
  p.toes = Math.max(push, flight >= 0 ? 1 - Math.sin(flight * Math.PI) * 0.4 : 0);
  if (flight >= 0) {
    p.lift = 4 * flight * (1 - flight) * height;
    const tuck = Math.sin(flight * Math.PI);
    p.legL.lift = p.legR.lift = tuck * 0.7;
    p.legL.knee = p.legR.knee = tuck * 1.45;
  }
  // Arms back while dipping, up with the push, down again to land.
  const armsUp = flight >= 0 ? 1 - flight * 0.6 : push;
  for (const a of [p.armL, p.armR]) {
    a.raise = -0.6 * dip + armsUp * 1.9 + land * 0.4;
    a.spread = 0.25;
    a.elbow = 0.35 + dip * 0.3;
  }
  p.headPitch = dip * 0.25 - armsUp * 0.1;
  return flight;
}

/** Seconds of one go of the brush clip: the left paw sweeps, then the right. */
export const BRUSH_PERIOD = 2.4;
/** Seconds into each half when the sweeping paw is fastest, right through the cobweb. */
export const BRUSH_HIT = 0.6;

/** Seconds of one duck: down, hold while something passes over, up again. */
export const DUCK_PERIOD = 3;
/** How far down the duck clip is, 0..1; stories time swinging branches by it. */
export const duckDepth = (t: number) => hold(phase(t, DUCK_PERIOD), 0.05, 0.28, 0.72, 0.92);

/** Seconds of one beat of the wings in the flap clip: up in the first half, down in the second. */
export const FLAP_PERIOD = 1.1;
/** Seconds of one tap of tap_forward: the left paw taps in the first one, the right in the next. */
export const TAP_PERIOD = 1.5;
/** Seconds into each tap when the paw is furthest forward. */
export const TAP_HIT = 0.43;
/** Seconds of one go of lean_side: over to the left, back, over to the right, back. */
export const LEAN_PERIOD = 3.4;
/** Seconds of one jump for joy in the cheer clip. */
export const CHEER_PERIOD = 0.8;
/** Seconds of one go of the arc clip: the left arm paints a band's left half up over the head, then the right one its right half. */
export const ARC_PERIOD = 4;
/**
 * The arc clip paints a rainbow with a long brush, one band each go, outer band first. The bristles go round one
 * circle standing upright in front of the fox, its middle on the fox's middle (hips space, the fox's units), so
 * the fox stands in the middle of the rainbow; a story puts its rainbow where that circle is seen from its camera.
 * Each band's circle is a little smaller than the one before.
 */
export const ARC = {
  /** The middle of the circles: a little above the hips, in front of the body. */
  y: 0.2,
  z: 0.3,
  /** The outer edge of the outer band, and how wide each band is. */
  radius: 0.96,
  band: 0.02,
  bands: 6,
  /** How far (rad) the ends of the bands reach below the middle's height. */
  below: 0.2,
  /** The brush, from the wrist along the forearm to the tip of its bristles. */
  brush: 0.43,
};
/** How far round its half band the brush is, 0 at the band's end and 1 at its top, `along` 0..1. */
export const arcAngle = (along: number) => -ARC.below + along * (Math.PI / 2 + ARC.below);
/** The middle of band `band`'s circle. */
export const arcRadius = (band: number) => ARC.radius - (band + 0.5) * ARC.band;
/** Where in each half of the arc clip the brush is at the top: there that half of the band is finished. */
export const ARC_TOP = 0.66;
/**
 * The arc clip `t` s in: which arm paints (true: the left one) the band `band`, how far the arm has come out to
 * the band's end (`reach`), how far round the brush has painted (`along`), and how far it has dropped back after.
 */
export function arcDraw(t: number) {
  const k = phase(t, ARC_PERIOD);
  const left = k < 0.5;
  const half = left ? k * 2 : k * 2 - 1;
  const band = Math.min(ARC.bands - 1, Math.max(0, Math.floor(t / ARC_PERIOD)));
  // Out to the band's end, slowly round and up, a moment at the top, and back down quickly.
  return {
    left,
    band,
    reach: smooth(clamp01((half - 0.02) / 0.1)),
    along: smooth(clamp01((half - 0.12) / (ARC_TOP - 0.12))),
    down: smooth(clamp01((half - 0.74) / 0.22)),
  };
}
/** How far the body leans (to the fox's left) while the arm on `side` (1 left, -1 right) paints at `angle`: out with the arm, then over to the other side. */
export const arcLean = (side: number, angle: number) => side * (0.1 * Math.cos(angle) - 0.2 * Math.sin(angle));

/** How far ahead of the need (fox units²) and how softly the upper arm starts rolling in `brushArm`. */
const ROLL_MARGIN = 0;
const ROLL_SOFT = 0.05;

/**
 * The arm on `side` (1 left, -1 right) reaching the brush's tip to (x, y, z) in hips space (x to the fox's left),
 * the upper body leaning by `lean`: the elbow bends forwards as far as the distance needs, then the shoulder
 * turns the arm out and forwards onto the point. Where turning out alone can't bring the tip that far to the side
 * (the arm out level, the forearm bent forwards), the upper arm also rolls round itself, so the bend points out.
 */
export function brushArm(side: number, x: number, y: number, z: number, lean: number): ArmPose {
  // Into the space of the spine, which leans round the hips (Guide.apply: spine.rotation.z = -lean), and
  // mirrored onto the left arm: the right one is its mirror image (spread and twist count outwards on both).
  const c = Math.cos(lean);
  const s = Math.sin(lean);
  const dx = (x * c - y * s) * side - SHOULDER.x;
  const dy = x * s + y * c - SHOULDER.y;
  const dz = z;
  const reach = FOREARM + ARC.brush;
  const d = Math.hypot(dx, dy, dz);
  const elbow = Math.acos(Math.max(-1, Math.min(1, (d * d - UPPER_ARM ** 2 - reach ** 2) / (2 * UPPER_ARM * reach))));
  // The tip in the upper arm's space: down the upper arm and on along the bent forearm.
  const down = UPPER_ARM + reach * Math.cos(elbow);
  const ahead = reach * Math.sin(elbow);
  // The shoulder turns the arm as Rx(-raise) · Rz(spread) · Ry(twist) (Guide.apply). Rolling (twist) swings the
  // forearm's bend outwards, turning out (spread) brings x to dx, turning forwards (raise) then y and z.
  // Roll about as far as x needs, eased in and out (a soft maximum of 0 and the need), so the arm never snaps.
  const need = dx * dx - down * down + ROLL_MARGIN;
  const sideways = Math.sqrt((need + Math.sqrt(need * need + ROLL_SOFT ** 2)) / 2);
  const twist = Math.asin(Math.min(1, sideways / Math.max(ahead, 1e-6)));
  const px = ahead * Math.sin(twist);
  const pz = ahead * Math.cos(twist);
  // px·cos(spread) + down·sin(spread) = dx, always on the way that lifts the arm out and up beside the head
  // (the other way would swing it up in front), so one stroke never jumps between the two.
  const spread = Math.atan2(down, px) + Math.acos(Math.max(-1, Math.min(1, dx / Math.hypot(px, down))));
  const y0 = px * Math.sin(spread) - down * Math.cos(spread);
  const forwards = Math.atan2(dz, dy) - Math.atan2(pz, y0);
  return { raise: -Math.atan2(Math.sin(forwards), Math.cos(forwards)), spread, elbow, twist };
}

/** Seconds of one turn of the crank clip; stories turn their crank with it. */
export const CRANK_PERIOD = 2.4;
/** Seconds of each shape (tall, wide, small) in the shapes clip. */
export const SHAPE_SECONDS = 4;
/** The key clip: picking the key up takes this long, then each turn this long. */
export const KEY_PICKUP = 2;
export const KEY_TURN = 1.6;
/** How far the key is turned, 0..1 (a quarter turn), at `t` seconds into the key clip. */
export const keyTurn = (t: number) => (t < KEY_PICKUP ? 0 : hold(phase(t - KEY_PICKUP, KEY_TURN), 0.08, 0.38, 0.66, 0.92));

/** Seconds of one cast of the fishing rod: swinging back over the shoulder, then out. */
export const CAST_PERIOD = 3.2;
/**
 * How far a cast is swung back over the right shoulder, out ahead and followed through (0..1 each), `t`
 * seconds into the cast clip. Like a real overhead cast: lifted back slowly, a moment's pause, then snapped
 * forwards quickly and stopped high – the float lets go there – and the rod follows it down towards the water.
 */
export function castSwing(t: number) {
  const k = phase(t, CAST_PERIOD);
  return { back: hold(k, 0.05, 0.32, 0.42, 0.49), out: hold(k, 0.42, 0.5, 0.85, 1), follow: hold(k, 0.5, 0.64, 0.85, 1) };
}
/** Sitting down or getting up takes this long, from this many seconds into the sit clip; stories sit the guide down with it. */
export const SIT_FROM = 0.2;
export const SIT_TIME = 2.2;
/** How far the guide has sat down (or got up), 0..1, `t` seconds into the sit clip. */
export const sitProgress = (t: number) => smooth(clamp01((t - SIT_FROM) / SIT_TIME));
/** Seconds of one go of the drum clip: the left paw beats, then the right. */
export const DRUM_PERIOD = 1.6;
/** Seconds into each half when the beating paw comes down on the drum. */
export const DRUM_HIT = 0.4;
/**
 * Seconds of one go of the side step, the leg lift and the straddle: out, hold while something rolls
 * past, back; and seconds into a go when the step is furthest out, the leg highest and the feet widest.
 */
export const DODGE_PERIOD = 3;
export const DODGE_PASS = 1.4;
/** Seconds of one pull of each paw on the rope, hand over hand: the left paw pulls in the first half, the right in the second. */
export const PULL_PERIOD = 1.8;
/** How far out the left paw is on the rope `t` s into pull_rope: 0 at the body, 1 reached out; the right paw is at 1 minus this. */
export const pullReach = (t: number) => 0.5 + linger(Math.sin(phase(t, PULL_PERIOD) * TAU)) / 2;
/**
 * How much rope the paws have pulled in `t` s into pull_rope, in reaches: a paw only pulls while it comes
 * back to the body, so the rope comes in tug by tug, two in each period, and stops a moment between them.
 */
export function pulledIn(t: number) {
  const k = phase(t, PULL_PERIOD);
  const r = pullReach(t);
  const sofar = k < 0.25 ? r - 0.5 : k < 0.75 ? 1.5 - r : 1.5 + r;
  return Math.floor(t / PULL_PERIOD) * 2 + sofar;
}
/** Seconds of one push of both arms up into the sky. */
export const PUSH_PERIOD = 2.6;
/** Seconds of one go of scoop_toss: down into the chest, up, and the coins thrown. */
export const TOSS_PERIOD = 3;
/** Seconds into each go of scoop_toss when the coins leave the paws, the arms flying up. */
export const TOSS_AT = 1.65;

/** How Tapsi stands still in the stop dance. */
type Statue = "wobbly" | "one_leg" | "funny";

/**
 * The stop dance: dance, then everyone holds still until the music comes
 * back. The pauses differ, so nobody can count along; stories stop their
 * music and freeze their animals with it (`stopDance`).
 */
export const STOP_DANCE: { dance: number; hold: number; statue: Statue }[] = [
  { dance: 3, hold: 2.2, statue: "wobbly" },
  { dance: 3.6, hold: 3, statue: "one_leg" },
  { dance: 2.4, hold: 1.5, statue: "funny" },
  { dance: 4, hold: 2.6, statue: "wobbly" },
];
const STOP_DANCE_LOOP = STOP_DANCE.reduce((sum, r) => sum + r.dance + r.hold, 0);

/** Where the stop dance is at `t` seconds into its clip: the round, and since when everyone is still (null while dancing) or dancing. */
export function stopDance(t: number): { round: number; still: number | null; dancing: number } {
  let k = ((t % STOP_DANCE_LOOP) + STOP_DANCE_LOOP) % STOP_DANCE_LOOP;
  for (const [round, r] of STOP_DANCE.entries()) {
    if (k < r.dance) return { round, still: null, dancing: k };
    k -= r.dance;
    if (k < r.hold) return { round, still: k, dancing: 0 };
    k -= r.hold;
  }
  return { round: 0, still: null, dancing: 0 };
}

const STATUES: Record<Statue, Clip> = {
  // Arms out like on a wobbly bridge, one foot a little up; the body tips to and fro.
  wobbly: (t, p) => {
    const s = Math.sin(t * 4.2);
    p.lean = s * 0.13;
    p.headTilt = -s * 0.12;
    p.armL.spread = 1.45 + s * 0.3;
    p.armR.spread = 1.45 - s * 0.3;
    p.armL.elbow = p.armR.elbow = 0.15;
    p.legR.lift = 0.3;
    p.legR.knee = 0.7;
  },
  // A statue on one leg with the arms up high.
  one_leg: (_t, p) => {
    p.legL.lift = 0.75;
    p.legL.knee = 1.7;
    p.armL.spread = p.armR.spread = 2.7;
    p.armL.elbow = p.armR.elbow = 0.35;
    p.lean = -0.05;
    p.headPitch = -0.1;
  },
  // A funny statue: one arm up, one out, a little tilt.
  funny: (_t, p) => {
    p.armL.raise = 0.3;
    p.armL.spread = 2.6;
    p.armL.elbow = 0.2;
    p.armR.spread = 1.3;
    p.armR.elbow = 0.8;
    p.lean = 0.12;
    p.headTilt = 0.2;
  },
};

/** The pose of a statue, `still` seconds after the music stopped. */
export const statuePose = (statue: Statue, still: number) => posed(STATUES[statue], still);

/** Hands come together in front at this spread. */
export const TOGETHER = -0.42;
