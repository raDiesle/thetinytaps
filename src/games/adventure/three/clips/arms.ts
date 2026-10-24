import type { Pose } from "../guide";
import {
  BRUSH_PERIOD,
  clamp01,
  clips,
  CRANK_PERIOD,
  crouch,
  hold,
  jump,
  KEY_PICKUP,
  keyTurn,
  linger,
  phase,
  smooth,
  steps,
  swing,
  TAU,
  TOGETHER,
} from "./motion";

// Clips about the arms: only the arms glow while they move (the crank, the paddle, waving).
// Where a clip is decides which part of Tapsi glows (`clipFocus` in index.ts).

export const ARM_CLIPS = clips({
  wave: (t, p) => {
    // The whole forearm swings from side to side, big and not too fast.
    const s = linger(Math.sin(t * 6.5));
    p.armR.spread = 2.4 + s * 0.45;
    p.armR.raise = 0.3;
    p.armR.elbow = 0.55 + s * 0.3;
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
    const s = linger(Math.sin(phase(t, 1.8) * TAU));
    const reach = (a: Pose["armL"], k: number) => {
      a.raise = 0.6 + k * 1.1;
      a.spread = -0.15;
      a.elbow = 1.75 - k * 1.6;
    };
    reach(p.armL, 0.5 + s / 2);
    reach(p.armR, 0.5 - s / 2);
    p.bend = -0.08 + Math.abs(s) * 0.05;
    p.twist = s * 0.18;
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
      a.spread = 2.6 + Math.sin(t * 7) * 0.2;
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
    const s = linger(Math.sin(k));
    p.twist = Math.cos(k) * 0.55;
    p.lean = -s * 0.26;
    p.bend = 0.15;
    p.armL.raise = 1.15 + s * 0.65;
    p.armR.raise = 1.15 - s * 0.65;
    p.armL.spread = p.armR.spread = 0.25;
    p.armL.elbow = 0.9 - s * 0.45;
    p.armR.elbow = 0.9 + s * 0.45;
    p.headYaw = -s * 0.2;
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
    const s = linger(Math.sin(phase(t, 2.6) * TAU));
    const l = Math.max(0, s);
    const r = Math.max(0, -s);
    const reach = (a: Pose["armL"], up: number, other: number) => {
      a.raise = 0.3 + up * 2.85 - other * 0.5;
      a.spread = 0.25 + up * 0.1 + other * 0.45;
      a.elbow = 0.5 - up * 0.48;
    };
    reach(p.armL, l, r);
    reach(p.armR, r, l);
    p.toes = Math.abs(s);
    p.lift = Math.abs(s) * 0.02;
    p.shift = s * 0.04;
    p.lean = -s * 0.14;
    p.bend = -0.12 * Math.abs(s);
    p.legL.spread = 0.04 + r * 0.32;
    p.legR.spread = 0.04 + l * 0.32;
    p.legL.lift = -r * 0.2;
    p.legR.lift = -l * 0.2;
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

  bloom: (t, p) => {
    const k = hold(phase(t, 4), 0.1, 0.4, 0.72, 0.95);
    for (const a of [p.armL, p.armR]) {
      a.raise = 1.3 - k * 0.7;
      a.spread = TOGETHER + 0.05 + k * 2.45;
      a.elbow = 0.6 - k * 0.55;
    }
    p.toes = k * 0.5;
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
      arm.raise = 1.2 + up * 0.62;
      arm.elbow = 0.7 - up * 0.42;
    }
    p.armL.spread = TOGETHER + 0.3 + side * 0.56;
    p.armR.spread = TOGETHER + 0.3 - side * 0.56;
    p.twist = side * 0.24;
    p.lean = side * 0.08;
    p.bend = 0.1 - up * 0.08;
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
    p.armR.twist = k * 1.4;
    p.armL.raise = 0.6;
    p.armL.spread = 0.3;
    p.armL.elbow = 1.2;
    p.twist = -k * 0.16;
    p.lean = -k * 0.07;
    p.headTilt = -k * 0.2;
    p.bend = 0.12;
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
      a.spread = 0.2 - reach * 0.5 + out * 2.0 - back * 1.5;
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
    p.twist = dir * (swept - 0.4) * 0.45 * turn;
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
});
