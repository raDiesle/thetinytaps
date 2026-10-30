import { describe, expect, test } from "bun:test";
import { buildCircus, FEET, FLOOR, LION_FROM, LION_TO, onTrapeze, PEDESTAL_W, PLATFORM, TRAPEZE, WORLD_W } from "./circus";

describe("Zirkus", () => {
  const circus = buildCircus();
  const near = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

  test("the machine runs about forty seconds and ends after everything else", () => {
    expect(circus.duration).toBeGreaterThan(39);
    expect(circus.duration).toBeLessThan(43);
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
      circus.tShow,
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
  });
});
