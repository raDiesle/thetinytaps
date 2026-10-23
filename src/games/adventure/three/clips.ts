import type { MotionClipId } from "../library/types";
import type { ContourPart } from "./contour";
import { restPose, type Pose } from "./guide";

// The guide's body animations, one per MotionClipId. A clip turns the time
// since it started (s) into a pose; it loops by itself. Everything is slow and
// exaggerated, so a two-year-old can see what to do.

type Clip = (t: number, p: Pose) => void;

const TAU = Math.PI * 2;
const smooth = (k: number) => k * k * (3 - 2 * k);
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
/** 0..1 within the current loop of `period` seconds. */
const phase = (t: number, period: number) => (t / period) % 1;
/** 0 → 1 → 0 once per period, smooth. */
const swing = (t: number, period: number) => 0.5 - 0.5 * Math.cos(phase(t, period) * TAU);
/** Goes up between `from` and `to` (0..1 of the loop), holds, and comes back down after `back`. */
function hold(k: number, from: number, to: number, back: number, end: number) {
  if (k < from) return 0;
  if (k < to) return smooth((k - from) / (to - from));
  if (k < back) return 1;
  if (k < end) return 1 - smooth((k - back) / (end - back));
  return 0;
}

/** Knees bent and bottom down; 1 is a deep squat. */
function crouch(p: Pose, c: number) {
  p.legL.lift = p.legR.lift = c * 1.05;
  p.legL.knee = p.legR.knee = c * 2.1;
  p.bend += c * 0.45;
}

/** Small steps on the spot, so turning or balancing looks like walking. */
function steps(p: Pose, t: number, period: number, lift: number) {
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
function feetAt(p: Pose, footL: number, footR: number, upL: number, upR: number) {
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

/** Seconds of one jump of the jump clip; every third one goes straight up, to bump the head. */
export const JUMP_PERIOD = 1.6;
/** When the feet leave the ground and land again, as parts of one jump. */
const TAKE_OFF = 0.4;
const LANDING = 0.75;
/** How high the jumps go (m): forwards from stone to stone, and straight up to bump the head. */
export const JUMP_HEIGHT = 0.3;
export const BUMP_HEIGHT = 0.42;
/** Seconds into a jump when it is highest. */
export const JUMP_PEAK = ((TAKE_OFF + LANDING) / 2) * JUMP_PERIOD;
/** True if jump number `n` (from 0) of the jump clip is the one up to bump the head. */
export const isBump = (n: number) => n % 3 === 2;
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
function jump(p: Pose, k: number, height: number, takeOff = TAKE_OFF, landing = LANDING) {
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
    p.legL.lift = p.legR.lift = tuck * 0.55;
    p.legL.knee = p.legR.knee = tuck * 1.15;
  }
  // Arms back while dipping, up with the push, down again to land.
  const armsUp = flight >= 0 ? 1 - flight * 0.6 : push;
  for (const a of [p.armL, p.armR]) {
    a.raise = -0.45 * dip + armsUp * 1.5 + land * 0.4;
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
export const keyTurn = (t: number) => (t < KEY_PICKUP ? 0 : hold(phase(t - KEY_PICKUP, KEY_TURN), 0.1, 0.45, 0.6, 0.9));

/** Hands come together in front at this spread. */
const TOGETHER = -0.42;

const CLIPS: Record<MotionClipId, Clip> = {
  idle: (t, p) => {
    p.lean = Math.sin(t * 0.9) * 0.03;
    p.headYaw = Math.sin(t * 0.5) * 0.15;
    p.headTilt = Math.sin(t * 0.7) * 0.06;
  },

  wave: (t, p) => {
    p.armR.spread = 2.5 + Math.sin(t * 9) * 0.3;
    p.armR.raise = 0.25;
    p.armR.elbow = 0.5;
    p.headTilt = 0.12;
    p.lean = -0.05;
    p.lift = Math.abs(Math.sin(t * 4.5)) * 0.015;
  },

  push_forward: (t, p) => {
    const k = hold(phase(t, 2.6), 0.05, 0.4, 0.65, 0.95);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.1 + k * 0.45;
      a.spread = 0.05;
      a.elbow = 2.0 - k * 1.9;
    }
    p.bend = 0.1 + k * 0.25;
    p.legR.lift = -0.35 * k;
    p.legL.lift = 0.15 * k;
    p.legL.knee = 0.3 * k;
    p.headPitch = 0.1;
  },

  push_up: (t, p) => {
    const k = hold(phase(t, 2.6), 0.05, 0.4, 0.65, 0.95);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.2 + k * 1.3;
      a.spread = 0.15;
      a.elbow = 2.0 - k * 1.9;
    }
    p.toes = k * 0.6;
    p.headPitch = -0.35 * k;
  },

  pull_rope: (t, p) => {
    const s = Math.sin(phase(t, 1.8) * TAU);
    const reach = (a: Pose["armL"], k: number) => {
      a.raise = 0.7 + k * 0.9;
      a.spread = -0.15;
      a.elbow = 1.7 - k * 1.5;
    };
    reach(p.armL, 0.5 + s / 2);
    reach(p.armR, 0.5 - s / 2);
    p.bend = -0.08 + Math.abs(s) * 0.05;
    p.twist = s * 0.12;
    p.legL.lift = 0.35;
    p.legL.knee = 0.25;
    p.legR.lift = -0.2;
  },

  pull_down: (t, p) => {
    const k = hold(phase(t, 2.6), 0.0, 0.35, 0.55, 0.9);
    for (const a of [p.armL, p.armR]) {
      a.raise = 2.9 - k * 2.3;
      a.spread = 0.2;
      a.elbow = 0.2 + k * 1.8;
    }
    crouch(p, k * 0.25);
    p.headPitch = -0.35 + k * 0.4;
  },

  heave: (t, p) => {
    const k = hold(phase(t, 3.2), 0.1, 0.5, 0.7, 0.95);
    crouch(p, 0.55 - k * 0.4);
    p.bend += 0.25 - k * 0.6;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.9 + k * 0.4;
      a.spread = -0.2;
      a.elbow = 0.3 + k * 0.5;
    }
    p.headPitch = 0.3 - k * 0.5;
  },

  lean_side: (t, p) => {
    const s = Math.sin(phase(t, 3.4) * TAU);
    p.lean = s * 0.42;
    p.armL.spread = 0.5 + Math.max(0, -s) * 0.6;
    p.armR.spread = 0.5 + Math.max(0, s) * 0.6;
    p.headTilt = -s * 0.1;
    p.shift = s * 0.04;
  },

  lean_forward: (t, p) => {
    const k = hold(phase(t, 3.4), 0.05, 0.4, 0.65, 0.95);
    p.bend = k * 0.6;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.3 + k * 1.3;
      a.spread = 0.1;
      a.elbow = 0.6 - k * 0.55;
    }
    p.legR.lift = -0.25 * k;
    p.headPitch = -0.35 * k;
  },

  duck: (t, p) => {
    const k = duckDepth(t);
    crouch(p, k * 0.9);
    p.headPitch = k * 0.3;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.1 + k * 2.2;
      a.spread = 0.3;
      a.elbow = 0.3 + k * 1.6;
    }
  },

  sway: (t, p) => {
    const s = Math.sin(t * 1.5);
    p.lean = s * 0.25;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.3;
      a.spread = 2.5;
      a.elbow = 0.35;
    }
    p.armL.spread += s * 0.2;
    p.armR.spread -= s * 0.2;
    p.headTilt = s * 0.15;
  },

  step_side: (t, p) => {
    // A real step to the side and back, one foot after the other: the left foot steps out, the
    // weight shifts over, the right foot follows; back the other way round.
    const k = phase(t, 3);
    const part = (from: number, to: number) => clamp01((k - from) / (to - from));
    const lift = (u: number) => Math.sin(u * Math.PI);
    const outL = smooth(part(0.05, 0.2));
    const outR = smooth(part(0.25, 0.4));
    const backR = smooth(part(0.55, 0.7));
    const backL = smooth(part(0.75, 0.9));
    p.shift = (smooth(part(0.14, 0.32)) - smooth(part(0.64, 0.82))) * 0.28;
    const upL = lift(part(0.05, 0.2)) + lift(part(0.75, 0.9));
    const upR = lift(part(0.25, 0.4)) + lift(part(0.55, 0.7));
    feetAt(p, 0.13 + (outL - backL) * 0.3, -0.13 + (outR - backR) * 0.28, upL, upR);
    // Over the standing leg, arms a little out for balance.
    p.lean = (upR - upL) * 0.07;
    p.armL.spread = 0.35 + upR * 0.25;
    p.armR.spread = 0.35 + upL * 0.25;
    p.armL.elbow = p.armR.elbow = 0.5;
    p.headPitch = 0.1;
  },

  march: (t, p) => {
    steps(p, t, 1.1, 0.95);
    const s = Math.sin(phase(t, 1.1) * TAU);
    p.armL.raise = 0.6 - s * 0.55;
    p.armR.raise = 0.6 + s * 0.55;
    p.armL.elbow = p.armR.elbow = 1.5;
    p.lift = Math.abs(s) * 0.02;
    p.headPitch = -0.05;
  },

  stomp: (t, p) => {
    // One foot after the other, right on the beat: whipped up and slammed down hard – the left foot
    // lands at 0.8 s, the right at 1.6 s. The knee gives a little after each stamp.
    const foot = (impact: number) => {
      let d = (((t - impact) % 1.6) + 1.6) % 1.6;
      if (d > 0.8) d -= 1.6;
      const up = d < -0.3 || d >= 0 ? 0 : d < -0.13 ? smooth((d + 0.3) / 0.17) : d < -0.07 ? 1 : 1 - smooth((d + 0.07) / 0.07);
      const give = d >= 0 && d < 0.3 ? Math.sin((d / 0.3) * Math.PI) : 0;
      return { up, give };
    };
    const l = foot(0.8);
    const r = foot(1.6);
    crouch(p, 0.1 + (l.give + r.give) * 0.14);
    p.legL.lift += l.up * 1.1;
    p.legL.knee += l.up * 1.6;
    p.legR.lift += r.up * 1.1;
    p.legR.knee += r.up * 1.6;
    // Over the standing leg; the arms pump with it.
    p.lean = (r.up - l.up) * 0.1;
    p.armL.raise = 0.7 + r.up * 0.5;
    p.armR.raise = 0.7 + l.up * 0.5;
    p.armL.spread = p.armR.spread = 0.35;
    p.armL.elbow = p.armR.elbow = 1.5;
    p.headPitch = 0.25;
  },

  high_knees: (t, p) => {
    steps(p, t, 2, 1.3);
    p.armL.spread = p.armR.spread = 0.7;
    p.armL.elbow = p.armR.elbow = 0.6;
    const s = Math.sin(phase(t, 2) * TAU);
    p.lean = -s * 0.08;
    p.headPitch = 0.15;
  },

  tiptoe: (t, p) => {
    steps(p, t, 1.6, 0.35);
    p.toes = 1;
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.1;
      a.spread = 0.1;
      a.elbow = 1.9;
    }
    p.bend = 0.12;
    p.headYaw = Math.sin(t * 0.8) * 0.4;
  },

  bounce: (t, p) => {
    const c = swing(t, 0.9);
    crouch(p, c * 0.3);
    p.armL.raise = p.armR.raise = 0.4 + c * 0.4;
    p.armL.elbow = p.armR.elbow = 1.2;
    p.headPitch = c * 0.05;
  },

  hop: (t, p) => {
    const k = phase(t, 1.8);
    const down = hold(k, 0, 0.25, 0.3, 0.4) + hold(k, 0.6, 0.7, 0.72, 0.9);
    crouch(p, Math.min(1, down) * 0.5);
    const air = k > 0.38 && k < 0.66 ? Math.sin(((k - 0.38) / 0.28) * Math.PI) : 0;
    p.lift = air * 0.16;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.2 + air * 2.3 - down * 0.4;
      a.spread = 0.35;
      a.elbow = 0.4;
    }
  },

  shake: (t, p) => {
    const s = Math.sin(t * 11);
    p.lean = Math.sin(t * 5.5) * 0.08;
    p.twist = s * 0.08;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.6 + Math.sin(t * 13) * 0.25;
      a.spread = 0.8 + s * 0.2;
      a.elbow = 0.8 + Math.sin(t * 17) * 0.3;
    }
    crouch(p, 0.1 + Math.abs(Math.sin(t * 5.5)) * 0.1);
    p.headTilt = Math.sin(t * 5.5) * 0.15;
  },

  hip_circle: (t, p) => {
    const a = t * 3.2;
    p.shift = Math.cos(a) * 0.06;
    p.lean = -Math.cos(a) * 0.12;
    p.bend = Math.sin(a) * 0.08;
    for (const arm of [p.armL, p.armR]) {
      arm.raise = 0.25;
      arm.spread = 0.75;
      arm.elbow = 1.9;
      arm.twist = -1.2;
    }
    p.headTilt = Math.cos(a) * 0.1;
  },

  robot: (t, p) => {
    // Stiff poses, one after the other, each held for a beat.
    const n = Math.floor(t / 0.6) % 6;
    p.armL.elbow = p.armR.elbow = Math.PI / 2;
    p.armL.raise = n === 1 || n === 4 ? Math.PI / 2 : 0.1;
    p.armR.raise = n === 2 || n === 4 ? Math.PI / 2 : 0.1;
    p.armL.spread = n === 3 ? Math.PI / 2 : 0.25;
    p.armR.spread = n === 5 ? Math.PI / 2 : 0.25;
    p.headYaw = n === 3 ? 0.4 : n === 5 ? -0.4 : 0;
    p.twist = n === 1 ? 0.2 : n === 2 ? -0.2 : 0;
  },

  waddle: (t, p) => {
    const s = Math.sin(phase(t, 1) * TAU);
    p.lean = s * 0.18;
    p.shift = s * 0.04;
    p.legL.lift = Math.max(0, s) * 0.25;
    p.legR.lift = Math.max(0, -s) * 0.25;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0;
      a.spread = 0.5;
      a.elbow = 0;
    }
    p.headTilt = s * 0.1;
  },

  snake: (t, p) => {
    const s = Math.sin(t * 2.6);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.45 + Math.sin(t * 5.2) * 0.12;
      a.elbow = 0.25;
    }
    p.armL.spread = TOGETHER + s * 0.35;
    p.armR.spread = TOGETHER - s * 0.35;
    p.twist = s * 0.15;
    p.lean = -s * 0.06;
  },

  flutter: (t, p) => {
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.3;
      a.spread = 0.75 + Math.sin(t * 28) * 0.18;
      a.elbow = 2.3;
    }
    steps(p, t, 1.4, 0.25);
    p.toes = 0.4;
    p.headYaw = Math.sin(t * 0.9) * 0.3;
  },

  cheer: (t, p) => {
    // Jumping for joy with both arms up: into the knees, off the toes, land softly.
    jump(p, phase(t, 0.8), 0.14, 0.35, 0.72);
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.4;
      a.spread = 2.65 + Math.sin(t * 10) * 0.12;
      a.elbow = 0.2;
    }
    p.headPitch = -0.2;
  },

  arms_wide: (t, p) => {
    const s = Math.sin(t * 0.8);
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.15;
      a.spread = Math.PI / 2;
      a.elbow = 0.05;
    }
    p.lean = s * 0.3;
    p.bend = 0.15;
    p.headTilt = s * 0.15;
  },

  flap: (t, p) => {
    const k = swing(t, 1.1);
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.1;
      a.spread = 0.6 + k * 1.6;
      a.elbow = 0.25 - k * 0.15;
    }
    p.toes = k * 0.4;
    p.headPitch = -0.1;
  },

  paddle: (t, p) => {
    // A double paddle in both hands: the first half of the loop the right blade
    // pulls through the water from front to back, the second half the left one.
    const k = phase(t, 2.8) * TAU;
    const s = Math.sin(k);
    p.twist = Math.cos(k) * 0.45;
    p.lean = -s * 0.2;
    p.bend = 0.15;
    p.armL.raise = 1.15 + s * 0.5;
    p.armR.raise = 1.15 - s * 0.5;
    p.armL.spread = p.armR.spread = 0.25;
    p.armL.elbow = 0.9 - s * 0.35;
    p.armR.elbow = 0.9 + s * 0.35;
    p.headYaw = -s * 0.15;
  },

  row: (t, p) => {
    const k = hold(phase(t, 2.4), 0.05, 0.45, 0.55, 0.95);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.55 - k * 1.1;
      a.spread = 0.05;
      a.elbow = 0.1 + k * 1.9;
    }
    p.bend = 0.35 - k * 0.5;
  },

  swim: (t, p) => {
    const k = phase(t, 2.4);
    const open = hold(k, 0.1, 0.45, 0.45, 0.7);
    const reach = 1 - hold(k, 0.4, 0.65, 0.8, 1);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.0 + reach * 0.5;
      a.spread = TOGETHER + 0.1 + open * 1.2;
      a.elbow = 0.15 + (1 - reach) * 1.8;
    }
    p.bend = 0.15;
    p.headPitch = -0.1;
  },

  steer: (t, p) => {
    const s = Math.sin(t * 1.2);
    p.armL.raise = 1.25 + s * 0.3;
    p.armR.raise = 1.25 - s * 0.3;
    p.armL.spread = p.armR.spread = -0.05;
    p.armL.elbow = p.armR.elbow = 0.9;
    p.lean = s * 0.15;
    p.headTilt = s * 0.1;
  },

  reach_up: (t, p) => {
    // Stretching the whole body, one side after the other: up on the toes, the paw as high as it
    // goes, the side long, the other arm and leg reaching away, the head looking up.
    const s = Math.sin(phase(t, 2.6) * TAU);
    const l = Math.max(0, s);
    const r = Math.max(0, -s);
    const reach = (a: Pose["armL"], up: number, other: number) => {
      a.raise = 0.3 + up * 2.85 - other * 0.4;
      a.spread = 0.25 + up * 0.1 + other * 0.25;
      a.elbow = 0.5 - up * 0.48;
    };
    reach(p.armL, l, r);
    reach(p.armR, r, l);
    p.toes = Math.abs(s);
    p.lift = Math.abs(s) * 0.02;
    p.shift = s * 0.04;
    p.lean = -s * 0.14;
    p.bend = -0.12 * Math.abs(s);
    p.legL.spread = 0.04 + r * 0.22;
    p.legR.spread = 0.04 + l * 0.22;
    p.legL.lift = -r * 0.12;
    p.legR.lift = -l * 0.12;
    p.headPitch = -0.45 * Math.abs(s);
    p.headTilt = s * 0.12;
  },

  tap_forward: (t, p) => {
    const k = phase(t, 1.5);
    const tap = hold(k, 0.1, 0.25, 0.32, 0.5);
    const hand = Math.floor(t / 1.5) % 2 === 0 ? p.armL : p.armR;
    hand.raise = 0.9 + tap * 0.65;
    hand.spread = 0.1;
    hand.elbow = 1.5 - tap * 1.45;
    p.bend = tap * 0.1;
  },

  point: (t, p) => {
    p.armL.raise = 1.7 + Math.sin(t * 0.9) * 0.6;
    p.armL.spread = 0.5 + Math.sin(t * 0.6) * 0.6;
    p.armL.elbow = 0.05;
    p.headYaw = Math.sin(t * 0.6) * 0.4;
    p.headPitch = -Math.sin(t * 0.9) * 0.3;
    p.lean = Math.sin(t * 0.6) * 0.1;
  },

  wipe: (t, p) => {
    const s = Math.sin(t * 2.4);
    p.armL.raise = 1.35;
    p.armL.spread = 0.4 + s * 0.85;
    p.armL.elbow = 0.25;
    p.twist = s * 0.25;
    p.lean = s * 0.06;
  },

  clap: (t, p) => {
    const k = swing(t, 1.3);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.3;
      a.spread = TOGETHER + 0.05 + k * 1.0;
      a.elbow = 0.5;
    }
    p.lift = (1 - k) * 0.01;
  },

  throw_overhand: (t, p) => {
    const k = phase(t, 2.6);
    const wind = hold(k, 0.05, 0.4, 0.45, 0.55);
    const thrown = hold(k, 0.45, 0.55, 0.75, 0.95);
    p.armR.raise = 0.2 + wind * 2.6 + thrown * 1.2 - wind * thrown * 2.6;
    p.armR.spread = 0.3;
    p.armR.elbow = 0.3 + wind * 1.8 - thrown * 1.8;
    p.twist = -wind * 0.35 + thrown * 0.25;
    p.bend = thrown * 0.2 - wind * 0.1;
    p.armL.raise = 0.6 + wind * 0.5;
  },

  throw_underhand: (t, p) => {
    const k = phase(t, 2.6);
    const back = hold(k, 0.05, 0.35, 0.4, 0.5);
    const up = hold(k, 0.4, 0.55, 0.75, 0.95);
    p.armR.raise = -0.6 * back + up * 1.9;
    p.armR.spread = 0.15;
    p.armR.elbow = 0.15;
    crouch(p, back * 0.25);
    p.bend += back * 0.15;
    p.toes = up * 0.4;
  },

  cast: (t, p) => {
    const k = phase(t, 3.2);
    const back = hold(k, 0.05, 0.35, 0.42, 0.5);
    const out = hold(k, 0.42, 0.55, 0.85, 1);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.0 + back * 1.7 - out * 0.2 - back * out * 1.7;
      a.spread = -0.1;
      a.elbow = 0.6 + back * 0.8 - out * 0.5;
    }
    p.bend = -back * 0.12 + out * 0.15;
    p.twist = -back * 0.2;
  },

  scatter: (t, p) => {
    const k = phase(t, 2);
    const out = hold(k, 0.15, 0.45, 0.55, 0.85);
    p.armR.raise = 0.3 + out * 0.8;
    p.armR.spread = 0.1 + out * 1.1;
    p.armR.elbow = 1.7 - out * 1.6;
    p.armL.raise = 0.4;
    p.armL.elbow = 1.6;
    p.twist = -0.15 + out * 0.3;
  },

  catch: (t, p) => {
    const k = hold(phase(t, 3.4), 0.45, 0.65, 0.85, 1);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.1;
      a.spread = 1.15 - k * 1.55;
      a.elbow = 0.3 + k * 1.5;
    }
    p.bend = k * 0.1 - (1 - k) * 0.05;
    p.lift = 0;
    p.headPitch = -0.1 * (1 - k);
  },

  stretch_up: (t, p) => {
    const k = hold(phase(t, 4.5), 0.05, 0.35, 0.65, 0.9);
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.1 + k * 2.75;
      a.spread = 0.25 + k * 0.1;
      a.elbow = 0.3 - k * 0.3;
    }
    p.toes = k * 0.9;
    p.headPitch = -0.35 * k;
  },

  curl_small: (t, p) => {
    const k = hold(phase(t, 5), 0.05, 0.3, 0.75, 0.95);
    crouch(p, k);
    p.bend += k * 0.4;
    p.headPitch = k * 0.5;
    for (const a of [p.armL, p.armR]) {
      a.raise = k * 1.0;
      a.spread = 0.25 - k * 0.3;
      a.elbow = 0.3 + k * 1.9;
    }
  },

  grow: (t, p) => {
    const k = phase(t, 4.5);
    const tall = hold(k, 0.25, 0.65, 0.85, 1);
    crouch(p, 1 - tall);
    p.bend += (1 - tall) * 0.35;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.6 + tall * 2.3;
      a.spread = 0.3;
      a.elbow = 1.9 - tall * 1.9;
    }
    p.toes = tall * 0.7;
    p.headPitch = 0.4 * (1 - tall) - 0.3 * tall;
  },

  star_shape: (t, p) => {
    const k = hold(phase(t, 4.5), 0.05, 0.3, 0.75, 0.95);
    p.armL.spread = p.armR.spread = 0.3 + k * 1.95;
    p.armL.elbow = p.armR.elbow = 0.1;
    p.legL.spread = p.legR.spread = 0.04 + k * 0.28;
    p.headPitch = -0.1 * k;
  },

  bloom: (t, p) => {
    const k = hold(phase(t, 4), 0.1, 0.45, 0.7, 0.95);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.3 - k * 0.6;
      a.spread = TOGETHER + 0.05 + k * 2.2;
      a.elbow = 0.6 - k * 0.5;
    }
    p.toes = k * 0.4;
    p.headPitch = -0.2 * k;
  },

  arc: (t, p) => {
    const k = phase(t, 5);
    const first = k < 0.5;
    const draw = smooth(clamp01(((first ? k : k - 0.5) - 0.05) / 0.4));
    const arm = first ? p.armL : p.armR;
    arm.spread = 0.3 + Math.sin(draw * Math.PI) * 2.6;
    arm.raise = draw * 0.6;
    arm.elbow = 0.1;
    p.lean = (first ? -1 : 1) * Math.sin(draw * Math.PI) * 0.12;
    p.headYaw = (first ? 1 : -1) * (draw - 0.5) * 0.6;
    p.headPitch = -Math.sin(draw * Math.PI) * 0.3;
  },

  turn_around: (t, p) => {
    const k = phase(t, 7);
    p.turn = smooth(clamp01((k - 0.05) / 0.75)) * TAU;
    if (k > 0.05 && k < 0.8) steps(p, t, 1, 0.35);
    p.armL.spread = p.armR.spread = 1.0;
    p.armL.elbow = p.armR.elbow = 0.2;
  },

  twist: (t, p) => {
    const s = Math.sin(t * 1.2);
    p.twist = s * 0.6;
    p.headYaw = s * 0.4;
    p.armL.spread = p.armR.spread = 0.6;
    p.armL.raise = p.armR.raise = 0.6;
    p.armL.elbow = p.armR.elbow = 0.6;
  },

  look_around: (t, p) => {
    const k = phase(t, 5);
    p.headYaw = (hold(k, 0.05, 0.2, 0.35, 0.5) - hold(k, 0.5, 0.65, 0.8, 0.95)) * 1.0;
    p.headPitch = -0.05;
    p.armL.raise = p.armR.raise = 0.2;
    p.armL.spread = p.armR.spread = 0.35;
  },

  freeze: (t, p) => {
    const k = phase(t, 4);
    if (k < 0.55) {
      CLIPS.shake(t, p);
      return;
    }
    // A funny statue: one arm up, one out, a little tilt.
    p.armL.raise = 0.3;
    p.armL.spread = 2.6;
    p.armL.elbow = 0.2;
    p.armR.spread = 1.3;
    p.armR.elbow = 0.8;
    p.lean = 0.12;
    p.headTilt = 0.2;
  },

  melt: (t, p) => {
    const k = phase(t, 6);
    const melt = hold(k, 0.3, 0.75, 0.85, 1);
    crouch(p, melt * 0.95);
    p.bend += melt * 0.35;
    p.headPitch = melt * 0.45;
    p.headTilt = melt * 0.25;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.25 * (1 - melt);
      a.spread = 0.6 * (1 - melt) + 0.2;
      a.elbow = 0.05 + melt * 0.5;
    }
  },

  one_leg: (t, p) => {
    const k = phase(t, 7);
    const up = hold(k % 0.5, 0.05, 0.15, 0.35, 0.45);
    const leg = k < 0.5 ? p.legL : p.legR;
    leg.lift = up * 0.7;
    leg.knee = up * 1.6;
    p.armL.spread = p.armR.spread = 0.4 + up * 0.9;
    p.armL.elbow = p.armR.elbow = 0.2;
    p.lean = Math.sin(t * 2.3) * 0.04 * up + (k < 0.5 ? -0.06 : 0.06) * up;
  },

  balance_walk: (t, p) => {
    steps(p, t, 2.2, 0.4);
    p.armL.spread = p.armR.spread = 1.45;
    p.armL.elbow = p.armR.elbow = 0.1;
    p.lean = Math.sin(t * 1.4) * 0.09;
    p.headPitch = 0.25;
  },

  carry: (t, p) => {
    steps(p, t, 1.8, 0.3);
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.85;
      a.spread = 0.15;
      a.elbow = 1.3;
    }
    p.toes = 0.3;
    p.headPitch = 0.2;
    p.lean = Math.sin(t * 1.7) * 0.03;
  },

  kite: (t, p) => {
    const tug = hold(phase(t, 1.4), 0.1, 0.25, 0.3, 0.6);
    for (const a of [p.armL, p.armR]) {
      a.raise = 2.2 - tug * 0.35;
      a.spread = 0.0;
      a.elbow = 0.4 + tug * 0.5;
    }
    p.lean = Math.sin(t * 0.8) * 0.12;
    p.headPitch = -0.45;
    p.bend = -0.08;
  },

  trunk_swing: (t, p) => {
    const s = Math.sin(t * 1.7);
    p.bend = 0.45;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.45 + s * 0.45;
      a.elbow = 0;
    }
    p.armL.spread = TOGETHER + 0.15 + s * 0.12;
    p.armR.spread = TOGETHER + 0.15 - s * 0.12;
    p.twist = s * 0.15;
    p.headPitch = -0.2;
    p.lean = s * 0.05;
  },

  snap: (t, p) => {
    const open = 1 - hold(phase(t, 1.5), 0.35, 0.45, 0.6, 0.9);
    p.armL.raise = 1.55 + open * 0.5;
    p.armR.raise = 1.55 - open * 0.35;
    p.armL.spread = p.armR.spread = TOGETHER + 0.15;
    p.armL.elbow = p.armR.elbow = 0;
    p.bend = 0.15;
  },

  scratch: (t, p) => {
    const s = Math.sin(t * 12) * 0.12;
    p.armR.raise = 2.0;
    p.armR.spread = 0.9;
    p.armR.elbow = 2.3 + s;
    p.armL.raise = 0.2;
    p.armL.spread = 0.55 + s;
    p.armL.elbow = 1.9;
    p.headTilt = -0.2;
    crouch(p, 0.2 + Math.abs(Math.sin(t * 4)) * 0.1);
  },

  hammer: (t, p) => {
    const hit = hold(phase(t, 0.9), 0.0, 0.4, 0.45, 0.6);
    p.armR.raise = 1.8 - hit * 1.0;
    p.armR.spread = 0.1;
    p.armR.elbow = 1.9 - hit * 1.3;
    p.armL.raise = 0.9;
    p.armL.spread = 0;
    p.armL.elbow = 1.0;
    p.bend = 0.25;
    p.headPitch = 0.25;
  },

  dig: (t, p) => {
    const k = phase(t, 2.6);
    const scoop = hold(k, 0.05, 0.3, 0.4, 0.5);
    const toss = hold(k, 0.45, 0.65, 0.75, 0.95);
    crouch(p, scoop * 0.35);
    p.bend += scoop * 0.3;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.6 + toss * 1.4 - scoop * 0.2;
      a.spread = -0.1;
      a.elbow = 0.5 + toss * 0.5;
    }
    p.twist = toss * 0.4;
  },

  pour: (t, p) => {
    const tilt = hold(phase(t, 3.4), 0.15, 0.4, 0.75, 0.95);
    p.armR.raise = 0.9 + tilt * 0.35;
    p.armR.elbow = 1.3 - tilt * 0.6;
    p.armR.spread = 0.15;
    p.armL.raise = 0.9;
    p.armL.elbow = 1.4;
    p.armL.spread = 0;
    p.bend = tilt * 0.2;
    p.lean = -tilt * 0.08;
    p.headPitch = 0.25;
  },

  stir: (t, p) => {
    const a = t * 2.8;
    for (const arm of [p.armL, p.armR]) {
      arm.raise = 1.0 + Math.sin(a) * 0.2;
      arm.elbow = 1.1;
    }
    p.armL.spread = TOGETHER + 0.4 + Math.cos(a) * 0.25;
    p.armR.spread = TOGETHER + 0.4 - Math.cos(a) * 0.25;
    p.twist = Math.cos(a) * 0.15;
    p.bend = 0.2;
    p.headPitch = 0.3;
  },

  pump: (t, p) => {
    const down = hold(phase(t, 1.3), 0.05, 0.4, 0.5, 0.9);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.0 - down * 0.55;
      a.spread = TOGETHER + 0.25;
      a.elbow = 1.4 - down * 1.0;
    }
    crouch(p, down * 0.3);
  },

  drum: (t, p) => {
    const s = Math.sin(phase(t, 0.7) * TAU);
    p.armL.raise = 0.95 + Math.max(0, s) * 0.5;
    p.armR.raise = 0.95 + Math.max(0, -s) * 0.5;
    p.armL.elbow = p.armR.elbow = 1.3;
    p.armL.spread = p.armR.spread = 0.2;
    p.bend = 0.1;
    p.lift = Math.abs(s) * 0.01;
  },

  wand: (t, p) => {
    const k = phase(t, 3.2);
    if (k < 0.65) {
      const a = (k / 0.65) * TAU;
      p.armR.raise = 1.7 + Math.sin(a) * 0.45;
      p.armR.spread = 0.5 + Math.cos(a) * 0.45;
      p.armR.elbow = 0.25;
    } else {
      const tap = hold(k, 0.7, 0.8, 0.85, 1);
      p.armR.raise = 1.5 + (1 - tap) * 0.4;
      p.armR.spread = 0.2;
      p.armR.elbow = (1 - tap) * 0.8;
      p.toes = tap * 0.4;
    }
  },

  ring_bell: (t, p) => {
    p.armR.raise = 1.9;
    p.armR.spread = 0.4 + Math.sin(t * 13) * 0.15;
    p.armR.elbow = 0.9;
    p.headTilt = Math.sin(t * 6.5) * 0.12;
    p.lift = Math.abs(Math.sin(t * 6.5)) * 0.01;
  },

  crank: (t, p) => {
    // Both hands on the handle of a crank in front, turning big circles: up, over to one side, down, over to the other.
    const a = phase(t, CRANK_PERIOD) * TAU;
    const side = Math.cos(a);
    const up = Math.sin(a);
    for (const arm of [p.armL, p.armR]) {
      arm.raise = 1.2 + up * 0.5;
      arm.elbow = 0.7 - up * 0.35;
    }
    p.armL.spread = TOGETHER + 0.3 + side * 0.45;
    p.armR.spread = TOGETHER + 0.3 - side * 0.45;
    p.twist = side * 0.18;
    p.lean = side * 0.06;
    p.bend = 0.1 - up * 0.06;
  },

  shapes: (t, p) => {
    // A riddle of three shapes, one after the other: very tall, very wide, very small.
    const n = Math.floor(phase(t, SHAPE_SECONDS * 3) * 3);
    const k = hold(phase(t, SHAPE_SECONDS), 0.05, 0.3, 0.8, 0.98);
    if (n === 0) {
      for (const a of [p.armL, p.armR]) {
        a.raise = 0.1 + k * 2.8;
        a.spread = 0.25;
        a.elbow = 0.3 - k * 0.3;
      }
      p.toes = k * 0.9;
      p.headPitch = -0.3 * k;
    } else if (n === 1) {
      p.armL.spread = p.armR.spread = 0.3 + k * 1.95;
      p.armL.elbow = p.armR.elbow = 0.1;
      p.legL.spread = p.legR.spread = 0.04 + k * 0.3;
    } else {
      crouch(p, k);
      p.bend += k * 0.4;
      p.headPitch = k * 0.5;
      for (const a of [p.armL, p.armR]) {
        a.raise = k * 1.0;
        a.spread = 0.25 - k * 0.3;
        a.elbow = 0.3 + k * 1.9;
      }
    }
  },

  turn_key: (t, p) => {
    if (t < KEY_PICKUP) {
      // Bend down, pick the key up from the ground with the right paw, come back up.
      const down = hold(t / KEY_PICKUP, 0.05, 0.35, 0.5, 0.9);
      const rise = smooth(clamp01((t / KEY_PICKUP - 0.5) / 0.4));
      crouch(p, down * 0.6);
      p.bend += down * 0.35 + rise * 0.12;
      p.headPitch = down * 0.4;
      p.armR.raise = 0.3 + down * 0.6 + (1 - down) * rise * 0.95;
      p.armR.spread = 0.1 - rise * 0.22;
      p.armR.elbow = 0.2 + (1 - down) * rise * 0.35;
      p.armL.raise = 0.05 + rise * 0.55;
      p.armL.spread = 0.18 + rise * 0.12;
      p.armL.elbow = 0.25 + rise * 0.95;
      return;
    }
    // The key in the lock in front: the paw turns it a quarter round and back.
    const k = keyTurn(t);
    p.armR.raise = 1.25;
    p.armR.spread = -0.12;
    p.armR.elbow = 0.55;
    p.armR.twist = k * 1.1;
    p.armL.raise = 0.6;
    p.armL.spread = 0.3;
    p.armL.elbow = 1.2;
    p.twist = -k * 0.12;
    p.lean = -k * 0.05;
    p.headTilt = -k * 0.15;
    p.bend = 0.12;
  },

  jump: (t, p) => {
    // From stone to stone, leaning into it; every third jump goes straight up, the head first, to
    // bump something above with it.
    const n = Math.floor(t / JUMP_PERIOD);
    const bump = isBump(n);
    const flight = jump(p, phase(t, JUMP_PERIOD), bump ? BUMP_HEIGHT : JUMP_HEIGHT);
    const air = flight >= 0 ? Math.sin(flight * Math.PI) : 0;
    if (bump) {
      // Arms down by the sides, chin up: the head bumps it.
      for (const a of [p.armL, p.armR]) {
        a.raise = Math.min(a.raise, 0.4);
        a.spread = 0.35 + air * 0.3;
      }
      p.headPitch -= air * 0.35;
    } else {
      p.bend += air * 0.15;
    }
  },

  brush_away: (t, p) => {
    // The left paw reaches high across in front and sweeps out wide to the side, then the right:
    // like wiping a cobweb away.
    const sweep = (a: Pose["armL"], q: number) => {
      const reach = smooth(clamp01(q / 0.35));
      const out = smooth(clamp01((q - 0.35) / 0.3));
      const back = smooth(clamp01((q - 0.68) / 0.32));
      const up = reach * (1 - back);
      a.raise = 0.3 + up * 1.45 - out * up * 0.3;
      a.spread = 0.2 - reach * 0.45 + out * 1.7 - back * 1.25;
      a.elbow = 0.3 + reach * 0.9 - out * 1.05 + back * 0.15;
      return out * (1 - back);
    };
    const q = phase(t, BRUSH_PERIOD) * 2;
    const left = q < 1;
    const k = left ? q : q - 1;
    const busy = left ? p.armL : p.armR;
    const other = left ? p.armR : p.armL;
    const swept = sweep(busy, k);
    other.raise = 0.25;
    other.spread = 0.25;
    other.elbow = 0.6;
    // The chest turns with the sweep, the head follows the paw.
    const dir = left ? 1 : -1;
    const turn = Math.sin(clamp01((k - 0.2) / 0.7) * Math.PI);
    p.twist = dir * (swept - 0.4) * 0.35 * turn;
    p.lean = dir * swept * 0.06;
    p.headYaw = dir * (swept - 0.3) * 0.45 * turn;
    p.headPitch = -0.15;
  },

  press_button: (t, p) => {
    const press = hold(phase(t, 2.6), 0.3, 0.45, 0.6, 0.85);
    p.armL.raise = 1.15 + press * 0.4;
    p.armL.spread = 0.05;
    p.armL.elbow = 1.6 - press * 1.55;
    p.bend = press * 0.25;
    p.legR.lift = -press * 0.2;
  },
};

/** Where a clip's movement is; only that part glows while it moves (the crank is about the arms). */
type Focus = "arms" | "legs" | "body" | "all";
const FOCUS: Record<MotionClipId, Focus> = {
  idle: "all",
  wave: "arms",
  push_forward: "arms",
  push_up: "arms",
  pull_rope: "arms",
  pull_down: "arms",
  heave: "all",
  lean_side: "body",
  lean_forward: "body",
  duck: "legs",
  sway: "body",
  step_side: "legs",
  march: "legs",
  stomp: "legs",
  high_knees: "legs",
  tiptoe: "legs",
  bounce: "legs",
  hop: "legs",
  shake: "all",
  hip_circle: "body",
  robot: "arms",
  waddle: "legs",
  snake: "arms",
  flutter: "arms",
  cheer: "arms",
  arms_wide: "arms",
  flap: "arms",
  paddle: "arms",
  row: "arms",
  swim: "arms",
  steer: "arms",
  reach_up: "arms",
  tap_forward: "arms",
  point: "arms",
  wipe: "arms",
  clap: "arms",
  throw_overhand: "arms",
  throw_underhand: "arms",
  cast: "arms",
  scatter: "arms",
  catch: "arms",
  stretch_up: "arms",
  curl_small: "all",
  grow: "all",
  star_shape: "all",
  bloom: "arms",
  arc: "arms",
  turn_around: "all",
  twist: "body",
  look_around: "body",
  freeze: "all",
  melt: "all",
  one_leg: "legs",
  balance_walk: "legs",
  carry: "legs",
  kite: "arms",
  trunk_swing: "arms",
  snap: "arms",
  scratch: "arms",
  hammer: "arms",
  dig: "arms",
  pour: "arms",
  stir: "arms",
  pump: "arms",
  drum: "arms",
  wand: "arms",
  ring_bell: "arms",
  press_button: "arms",
  crank: "arms",
  shapes: "all",
  turn_key: "arms",
  jump: "legs",
  brush_away: "arms",
};
const FOCUS_PARTS: Record<Focus, ContourPart[]> = {
  arms: ["armL", "armR"],
  legs: ["legL", "legR"],
  body: ["body", "head"],
  all: ["armL", "armR", "legL", "legR", "body", "head"],
};

/** The parts of the guide that may glow during clip `id`. */
export const clipFocus = (id: MotionClipId) => FOCUS_PARTS[FOCUS[id]];

/** The pose of clip `id`, `t` seconds after it started. */
export function clipPose(id: MotionClipId, t: number): Pose {
  const p = restPose();
  CLIPS[id](t, p);
  return p;
}

export const CLIP_IDS = Object.keys(CLIPS) as MotionClipId[];
