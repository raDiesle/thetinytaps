import { describe, expect, test } from "bun:test";
import {
  BALLOONS,
  BIG_BALL,
  BOW_SPOT,
  BUNCH_FROM,
  BUNCH_TO,
  buildCircus,
  CLOWN_FEET,
  CORD,
  FEET,
  FLOOR,
  LION_FROM,
  LION_TO,
  onTrapeze,
  PEDESTAL_W,
  PERCH,
  PLATFORM,
  STAGE,
  STRIKER,
  TRAPEZE,
  WORLD_W,
} from "./circus";

describe("Zirkus", () => {
  const circus = buildCircus();
  const near = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

  test("the machine runs about a minute and ends after everything else", () => {
    expect(circus.duration).toBeGreaterThan(56);
    expect(circus.duration).toBeLessThan(64);
    expect(Math.max(...circus.events.map((e) => e.at))).toBe(circus.duration);
    expect(circus.events[circus.events.length - 1].done).toBe(true);
  });

  test("one act sets off the next, in the order of the story", () => {
    const order = [
      ...circus.drumTimes,
      circus.tCymbal,
      circus.tBed,
      circus.tNose,
      circus.tHead,
      circus.tTip,
      circus.tGrab,
      circus.tDrop,
      circus.tPlop,
      circus.tRoar,
      circus.tLeap,
      circus.tLand,
      circus.tShake,
      circus.tOut,
      circus.tCatch,
      circus.tHoop,
      circus.tHook,
      circus.tStop,
      circus.tFire,
      circus.tNet,
      circus.tToss,
      circus.tOnBall,
      circus.tWalk,
      circus.tPad,
      circus.tPuck,
      circus.tRing,
      circus.tBump,
      circus.tWake,
      circus.tFly,
      circus.tTassel,
      circus.tShow,
      circus.tHopOff,
      circus.tBow,
      circus.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("the marble never jumps: it is handed on from one act to the next", () => {
    let last = circus.marbleAt(0).pt;
    for (let t = 0; t <= circus.duration; t += 1 / 120) {
      const { pt } = circus.marbleAt(t);
      expect(near(pt, last)).toBeLessThan(16);
      last = pt;
    }
  });

  test("the marble stays in the tent", () => {
    for (let t = 0; t <= circus.duration; t += 0.05) {
      const { pt } = circus.marbleAt(t);
      expect(pt.x).toBeGreaterThan(0);
      expect(pt.x).toBeLessThan(WORLD_W);
      expect(pt.y).toBeGreaterThan(90);
      expect(pt.y).toBeLessThan(FLOOR);
    }
  });

  test("the trapeze hangs still until the marble reaches the monkey's feet, then swings under the tent roof", () => {
    expect(circus.swingAt(circus.tGrab - 0.01)).toBe(0);
    expect(near(circus.marbleAt(circus.tGrab).pt, onTrapeze(FEET, 0))).toBeLessThan(1);
    for (let t = circus.tGrab; t < circus.duration; t += 0.05) {
      const angle = circus.swingAt(t);
      expect(Math.abs(angle)).toBeLessThanOrEqual(60);
      const bar = onTrapeze({ x: 0, y: TRAPEZE.len }, angle);
      expect(bar.y).toBeGreaterThan(120);
    }
    // It lets go at the top of the last swing forward, over the lion.
    const top = onTrapeze(FEET, circus.swingAt(circus.tDrop));
    expect(Math.abs(top.x - LION_FROM.x)).toBeLessThan(40);
  });

  test("the lion waits still until the marble lands in its mane, leaps onto the next pedestal and stays in the tent", () => {
    expect(circus.lionAt(circus.tPlop - 0.01)).toEqual(circus.lionAt(0));
    expect(circus.lionAt(0).x).toBe(LION_FROM.x);
    const end = circus.lionAt(circus.tLand + 1.5);
    expect(end.x).toBe(LION_TO.x);
    expect(end.y).toBeCloseTo(LION_TO.top, 5);
    for (let t = circus.tPlop; t < circus.duration; t += 0.02) {
      const lion = circus.lionAt(t);
      expect(lion.x).toBeGreaterThan(0);
      expect(lion.x + 100).toBeLessThan(WORLD_W);
      expect(lion.y).toBeLessThanOrEqual(LION_FROM.top + 0.001);
      // Its head clears the tent's top edge, even at the top of the leap.
      expect(lion.y - 200).toBeGreaterThan(100);
    }
  });

  test("the pedestals stand apart, between the elephant and the teddy's platform", () => {
    expect(LION_TO.x - LION_FROM.x).toBeGreaterThan(PEDESTAL_W + 100);
    expect(LION_TO.x + PEDESTAL_W / 2).toBeLessThan(PLATFORM.x0);
  });

  test("the camera keeps the trapeze, the lion and the unicycle in sight while they move", () => {
    const inView = (t: number, x: number) => {
      const left = circus.cameraTarget(t);
      expect(x).toBeGreaterThan(left + 60);
      expect(x).toBeLessThan(left + 1600 - 60);
    };
    for (let t = circus.tGrab; t < circus.tLeap; t += 0.1) inView(t, circus.marbleAt(t).pt.x);
    for (let t = circus.tLeap; t < circus.tOut; t += 0.1) inView(t, circus.lionAt(t).x);
    for (let t = circus.tCatch; t < circus.tStop; t += 0.1) inView(t, circus.unicycleAt(t).pt.x);
    for (let t = circus.tFire; t < circus.tPad; t += 0.1) inView(t, circus.clownAt(t).pt.x);
    for (let t = circus.tRing; t < circus.tTassel; t += 0.1) {
      inView(t, circus.balloonsAt(t).pt.x);
      inView(t, circus.parrotAt(t).pt.x);
    }
    for (let t = circus.tHopOff; t <= circus.duration; t += 0.1) inView(t, circus.clownAt(t).pt.x);
  });

  test("the clown never jumps: from the cannon to its bow it is always somewhere near where it just was", () => {
    let last = circus.clownAt(circus.tFire).pt;
    for (let t = circus.tFire; t <= circus.duration; t += 1 / 120) {
      const { pt } = circus.clownAt(t);
      expect(near(pt, last)).toBeLessThan(16);
      last = pt;
    }
  });

  test("the net throws the clown onto the big ball, which waits still until then and carries it onto the striker's pad", () => {
    expect(circus.bigBallAt(circus.tOnBall - 0.01).pt.x).toBe(BIG_BALL.x0);
    const landing = circus.clownAt(circus.tOnBall).pt;
    const ball = circus.bigBallAt(circus.tOnBall).pt;
    expect(Math.abs(landing.x - ball.x)).toBeLessThan(1);
    expect(Math.abs(landing.y + CLOWN_FEET - (ball.y - BIG_BALL.r))).toBeLessThan(1);
    for (let t = circus.tOnBall; t < circus.tHopOff; t += 0.05) {
      const clown = circus.clownAt(t).pt;
      const on = circus.bigBallAt(t).pt;
      expect(Math.abs(clown.x - on.x)).toBeLessThan(1);
      expect(Math.abs(clown.y + CLOWN_FEET - (on.y - BIG_BALL.r))).toBeLessThan(1);
      expect(on.x).toBeLessThanOrEqual(BIG_BALL.x1 + 0.01);
    }
    expect(circus.bigBallAt(circus.tPad).pt.x).toBeCloseTo(BIG_BALL.x1, 5);
    // The ball stands on the floor until the pad gives under it, and stops before the striker's column.
    expect(circus.bigBallAt(circus.tPad - 0.01).pt.y).toBe(FLOOR - BIG_BALL.r);
    expect(BIG_BALL.x1 + BIG_BALL.r).toBeLessThan(STRIKER.x - STRIKER.w / 2);
    expect(BIG_BALL.x0 - BIG_BALL.r).toBeGreaterThan(1600 / 2);
  });

  test("the puck goes up only once the ball presses the pad, and the lid opens only when it gets to the top", () => {
    expect(circus.padSink(circus.tPad - 0.01)).toBe(0);
    expect(circus.puckAt(circus.tPuck)).toBe(0);
    expect(circus.puckAt(circus.tRing)).toBeCloseTo(1, 5);
    expect(circus.lidAt(circus.tRing - 0.01)).toBe(0);
    expect(circus.lidAt(circus.tRing + 0.3)).toBeGreaterThan(90);
  });

  test("the balloons wait hidden in the box, then rise to the parrot's swing and bump its bar from below", () => {
    const top = (t: number) => {
      const { pt, grow } = circus.balloonsAt(t);
      return Math.min(...BALLOONS.at.map((o) => pt.y + o.y * grow - BALLOONS.r * 1.15 * grow));
    };
    for (let t = 0; t < circus.tRing; t += 0.5) {
      expect(circus.balloonsAt(t).pt).toEqual(BUNCH_FROM);
      expect(top(t)).toBeGreaterThan(STRIKER.top - STRIKER.box);
    }
    const bump = circus.balloonsAt(circus.tBump);
    expect(bump.pt.x).toBeCloseTo(BUNCH_TO.x, 5);
    expect(BUNCH_TO.y - 14 - BALLOONS.r).toBeCloseTo(PERCH.y + 5, 5);
    expect(circus.swingOf(circus.tBump - 0.01)).toBe(0);
    for (let t = circus.tRing; t <= circus.duration; t += 0.05) {
      expect(top(t)).toBeGreaterThan(PERCH.y - 1);
      const { pt } = circus.balloonsAt(t);
      expect(pt.x).toBeLessThan(WORLD_W);
    }
  });

  test("the parrot dozes until the balloons bump its swing, flies under the tent roof and takes the tassel before the curtain opens", () => {
    expect(circus.parrotAt(circus.tBump).awake).toBe(false);
    expect(circus.parrotAt(circus.tWake).awake).toBe(true);
    for (let t = circus.tFly; t < circus.tTassel; t += 0.02) {
      const { pt } = circus.parrotAt(t);
      // Its head (34 above its middle) stays under the tent's scalloped edge.
      expect(pt.y - 36).toBeGreaterThan(92);
      expect(pt.y + 60).toBeLessThan(FLOOR);
      expect(pt.x).toBeGreaterThan(BIG_BALL.x0);
      expect(pt.x + 40).toBeLessThan(WORLD_W);
    }
    const grab = circus.parrotAt(circus.tTassel).pt;
    expect(Math.hypot(grab.x - CORD.x, grab.y + 30 - CORD.y)).toBeLessThan(2);
    expect(circus.tasselY(circus.tTassel)).toBe(CORD.y);
    expect(circus.tShow).toBeGreaterThan(circus.tTassel);
    expect(CORD.x).toBeGreaterThan(STAGE.x0);
  });

  test("the clown hops off the ball onto its spot in front of the stage and bows there, its head under the tent roof", () => {
    expect(near(circus.clownAt(circus.tBow).pt, BOW_SPOT)).toBeLessThan(1);
    expect(near(circus.clownAt(circus.duration).pt, BOW_SPOT)).toBeLessThan(1);
    expect(BOW_SPOT.x).toBeGreaterThan(STAGE.x0 + 100);
    expect(BOW_SPOT.x).toBeLessThan(STAGE.x1 - 100);
    for (let t = circus.tNet; t <= circus.duration; t += 0.02) {
      const { pt } = circus.clownAt(t);
      expect(pt.y - 140).toBeGreaterThan(40);
      expect(pt.x + 60).toBeLessThan(WORLD_W);
    }
  });
});
