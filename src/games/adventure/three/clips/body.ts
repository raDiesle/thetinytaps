import { clips, hold, LEAN_PERIOD, linger, phase, TAU } from "./motion";

// Clips about the body and head: leaning, swaying, twisting, looking round.
// Where a clip is decides which part of Tapsi glows (`clipFocus` in index.ts).

export const BODY_CLIPS = clips({
  lean_side: (t, p) => {
    const s = linger(Math.sin(phase(t, LEAN_PERIOD) * TAU));
    p.lean = s * 0.6;
    // The arm on the side leaned to reaches out far; the other one stays down, out of the way.
    p.armL.spread = 0.4 + Math.max(0, s) * 1.0;
    p.armR.spread = 0.4 + Math.max(0, -s) * 1.0;
    // The head tilts on further the same way, so it is well out of the way at the top.
    p.headTilt = s * 0.35;
    p.shift = s * 0.05;
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
});
