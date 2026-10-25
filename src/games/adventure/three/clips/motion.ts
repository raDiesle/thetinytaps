import type { MotionClipId } from "../../library/types";
import { restPose, type Pose } from "../guide";

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

/** How far down the duck clip is, 0..1; stories time swinging branches by it. */
export const duckDepth = (t: number) => hold(phase(t, 3), 0.05, 0.28, 0.72, 0.92);

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
/** How far a cast is swung back over the right shoulder and out ahead (0..1 each), `t` seconds into the cast clip. */
export function castSwing(t: number) {
  const k = phase(t, CAST_PERIOD);
  return { back: hold(k, 0.05, 0.35, 0.42, 0.5), out: hold(k, 0.42, 0.55, 0.85, 1) };
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
/** Seconds of one push of both arms up into the sky. */
export const PUSH_PERIOD = 2.6;

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
