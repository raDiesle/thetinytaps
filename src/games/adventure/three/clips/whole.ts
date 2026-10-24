import { lerpPose } from "../guide";
import { type Clip, clamp01, clips, posed, crouch, hold, phase, SHAPE_SECONDS, smooth, statuePose, steps, STOP_DANCE, stopDance, TAU } from "./motion";

// Clips with the whole body: growing, curling up, freezing, turning round.
// Where a clip is decides which part of Tapsi glows (`clipFocus` in index.ts).

/** Shaking all over; the stop dance dances it between its statues. */
const shake: Clip = (t, p) => {
  const s = Math.sin(t * 11);
  p.lean = Math.sin(t * 5.5) * 0.08;
  p.twist = s * 0.08;
  for (const a of [p.armL, p.armR]) {
    a.raise = 0.6 + Math.sin(t * 13) * 0.35;
    a.spread = 0.8 + s * 0.3;
    a.elbow = 0.8 + Math.sin(t * 17) * 0.4;
  }
  crouch(p, 0.1 + Math.abs(Math.sin(t * 5.5)) * 0.1);
  p.headTilt = Math.sin(t * 5.5) * 0.15;
};

export const WHOLE_CLIPS = clips({
  idle: (t, p) => {
    p.lean = Math.sin(t * 0.9) * 0.03;
    p.headYaw = Math.sin(t * 0.5) * 0.15;
    p.headTilt = Math.sin(t * 0.7) * 0.06;
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

  shake,

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

  turn_around: (t, p) => {
    const k = phase(t, 7);
    p.turn = smooth(clamp01((k - 0.05) / 0.75)) * TAU;
    if (k > 0.05 && k < 0.8) steps(p, t, 1, 0.35);
    p.armL.spread = p.armR.spread = 1.0;
    p.armL.elbow = p.armR.elbow = 0.2;
  },

  freeze: (t, p) => {
    const { round, still, dancing } = stopDance(t);
    if (still === null) {
      // Out of the statue back into the dance; not at the very start, which comes from standing.
      const before = STOP_DANCE[(round + STOP_DANCE.length - 1) % STOP_DANCE.length];
      const back = t > dancing ? smooth(clamp01(dancing / 0.25)) : 1;
      Object.assign(p, lerpPose(statuePose(before.statue, before.hold), posed(shake, t), back));
      return;
    }
    // Caught in the middle of the dance, and quickly into the statue.
    Object.assign(p, lerpPose(posed(shake, t - still), statuePose(STOP_DANCE[round].statue, still), smooth(clamp01(still / 0.25))));
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
      p.legL.spread = p.legR.spread = 0.04 + k * 0.42;
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
});
