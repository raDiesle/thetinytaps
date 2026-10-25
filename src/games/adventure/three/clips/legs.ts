import {
  clamp01,
  clips,
  crouch,
  DODGE_PERIOD,
  duckDepth,
  feetAt,
  hold,
  jump,
  JUMP_HEIGHT,
  JUMP_PERIOD,
  phase,
  sitProgress,
  smooth,
  steps,
  swing,
  TAU,
} from "./motion";

// Clips about the legs: stomping, hopping, marching, balancing.
// Where a clip is decides which part of Tapsi glows (`clipFocus` in index.ts).

export const LEG_CLIPS = clips({
  duck: (t, p) => {
    const k = duckDepth(t);
    crouch(p, k * 0.9);
    p.headPitch = k * 0.3;
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.1 + k * 2.4;
      a.spread = 0.3 + k * 0.15;
      a.elbow = 0.3 + k * 1.75;
    }
  },

  step_side: (t, p) => {
    // A big step to the side and back, one foot after the other: the left foot steps out, the
    // weight shifts over, the right foot follows; back the other way round.
    const k = phase(t, DODGE_PERIOD);
    const part = (from: number, to: number) => clamp01((k - from) / (to - from));
    const lift = (u: number) => Math.sin(u * Math.PI);
    const outL = smooth(part(0.05, 0.2));
    const outR = smooth(part(0.25, 0.4));
    const backR = smooth(part(0.55, 0.7));
    const backL = smooth(part(0.75, 0.9));
    p.shift = (smooth(part(0.14, 0.32)) - smooth(part(0.64, 0.82))) * 0.5;
    const upL = lift(part(0.05, 0.2)) + lift(part(0.75, 0.9));
    const upR = lift(part(0.25, 0.4)) + lift(part(0.55, 0.7));
    feetAt(p, 0.13 + (outL - backL) * 0.52, -0.13 + (outR - backR) * 0.5, upL * 1.4, upR * 1.4);
    // Over the standing leg, arms out for balance.
    p.lean = (upR - upL) * 0.1;
    p.armL.spread = 0.4 + upR * 0.55;
    p.armR.spread = 0.4 + upL * 0.55;
    p.armL.elbow = p.armR.elbow = 0.5;
    p.headPitch = 0.1;
  },

  lift_leg: (t, p) => {
    // The left knee comes up high and stays there a moment, so something can roll under the foot; the
    // arms go out and the body leans a little over the standing leg.
    const up = hold(phase(t, DODGE_PERIOD), 0.1, 0.3, 0.6, 0.8);
    p.legL.lift = up * 1.25;
    p.legL.knee = up * 2.0;
    p.lean = -up * 0.07;
    p.armL.spread = p.armR.spread = 0.4 + up * 0.8;
    p.armL.elbow = p.armR.elbow = 0.3;
    p.headPitch = up * 0.3;
  },

  straddle: (t, p) => {
    // The feet go wide one after the other and come back together, with the legs straight, so
    // something can roll through between them; arms out wide, looking down.
    const k = phase(t, DODGE_PERIOD);
    const part = (from: number, to: number) => clamp01((k - from) / (to - from));
    const lift = (u: number) => Math.sin(u * Math.PI);
    const outL = smooth(part(0.05, 0.17)) - smooth(part(0.68, 0.8));
    const outR = smooth(part(0.17, 0.29)) - smooth(part(0.6, 0.72));
    const upL = lift(part(0.05, 0.17)) + lift(part(0.68, 0.8));
    const upR = lift(part(0.17, 0.29)) + lift(part(0.6, 0.72));
    feetAt(p, 0.13 + outL * 0.24, -0.13 - outR * 0.24, upL * 0.8, upR * 0.8);
    const wide = Math.min(outL, outR);
    p.lean = (upR - upL) * 0.06;
    p.armL.spread = p.armR.spread = 0.4 + wide * 1.0;
    p.armL.elbow = p.armR.elbow = 0.2;
    p.headPitch = wide * 0.35;
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
    // One foot after the other, right on the beat: pulled up high, held there a moment and slammed
    // down hard – the left foot lands at 0.8 s, the right at 1.6 s. The knee gives a little after each stamp.
    const foot = (impact: number) => {
      let d = (((t - impact) % 1.6) + 1.6) % 1.6;
      if (d > 0.8) d -= 1.6;
      const up = d < -0.5 || d >= 0 ? 0 : d < -0.3 ? smooth((d + 0.5) / 0.2) : d < -0.08 ? 1 : 1 - smooth((d + 0.08) / 0.08);
      const give = d >= 0 && d < 0.3 ? Math.sin((d / 0.3) * Math.PI) : 0;
      return { up, give };
    };
    const l = foot(0.8);
    const r = foot(1.6);
    crouch(p, 0.1 + (l.give + r.give) * 0.14);
    p.legL.lift += l.up * 1.4;
    p.legL.knee += l.up * 2.0;
    p.legR.lift += r.up * 1.4;
    p.legR.knee += r.up * 2.0;
    // Over the standing leg; the arms pump with it.
    p.lean = (r.up - l.up) * 0.12;
    p.armL.raise = 0.6 + r.up * 0.8;
    p.armR.raise = 0.6 + l.up * 0.8;
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

  jump: (t, p) => {
    // Every jump goes straight up, the head first, to bump something above with it: arms down by the
    // sides, chin up.
    const flight = jump(p, phase(t, JUMP_PERIOD), JUMP_HEIGHT);
    const air = flight >= 0 ? Math.sin(flight * Math.PI) : 0;
    for (const a of [p.armL, p.armR]) {
      a.raise = Math.min(a.raise, 0.4);
      a.spread = 0.35 + air * 0.3;
    }
    p.headPitch -= air * 0.35;
  },

  sit: (t, p) => {
    // Sitting down on the floor or getting up from it: the arms go forwards for balance while the body
    // goes down or up (the story sits the guide down with sitProgress), then hang loosely again.
    const k = sitProgress(t);
    const moving = Math.sin(k * Math.PI);
    for (const a of [p.armL, p.armR]) {
      a.raise = 0.25 + moving * 1.0;
      a.spread = 0.2;
      a.elbow = 0.3 + moving * 0.2;
    }
    p.bend = moving * 0.3;
    p.headPitch = moving * 0.15;
  },
});
