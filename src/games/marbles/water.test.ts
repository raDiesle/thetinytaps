import { describe, expect, test } from "bun:test";
import { along } from "./machineKit";
import {
  BASINS,
  buildWater,
  duckTop,
  gateX,
  GEYSER,
  GROUND,
  groundY,
  HOT_SPRING,
  PARADE,
  PONDS,
  POOL,
  POOL_SPOT,
  poseAt,
  SKY_TOP,
  STORK,
  TAP_GATE,
  gateWaits,
  waitSpot,
  WORLD_H,
  WORLD_W,
} from "./water";

describe("Wasserbahn", () => {
  const water = buildWater();
  const { stretches } = water;

  test("every stretch starts where the duck waits in its basin and ends where it waits in the next one, the last at the head of the ducklings' row", () => {
    stretches.forEach((s, i) => {
      expect(s.basin).toBe(BASINS[i]);
      expect(s.legs[0].path.pts[0]).toEqual(waitSpot(BASINS[i]));
      const end = poseAt(s, s.duration).pt;
      const next = i + 1 < BASINS.length ? waitSpot(BASINS[i + 1]) : { x: PARADE.end, y: POOL.y };
      expect(Math.hypot(end.x - next.x, end.y - next.y)).toBeLessThan(0.5);
    });
  });

  test("the legs of a stretch join up, one after the other", () => {
    for (const s of stretches) {
      s.legs.slice(1).forEach((leg, k) => {
        const before = s.legs[k];
        const end = along(before.path, before.path.total).pt;
        expect(Math.hypot(leg.path.pts[0].x - end.x, leg.path.pts[0].y - end.y)).toBeLessThan(0.5);
        expect(leg.start).toBeCloseTo(before.start + before.duration, 6);
      });
    }
  });

  test("the duck waits inside its basin, before the gate, and stays in the world all the way", () => {
    for (const b of BASINS) {
      const w = waitSpot(b);
      expect(w.x).toBeGreaterThan(b.x0 + 60);
      expect(w.x + 70).toBeLessThan(gateX(b) - 20);
    }
    for (const s of stretches) {
      for (let t = 0; t <= s.duration; t += 0.05) {
        const { pt } = poseAt(s, t);
        expect(pt.x).toBeGreaterThan(0);
        expect(pt.x).toBeLessThan(WORLD_W);
        expect(pt.y).toBeGreaterThan(SKY_TOP);
        expect(pt.y).toBeLessThan(WORLD_H);
        // Never inside a hill: in the water, in the air or on the ground, unless it is hidden in the pipe.
        if (!poseAt(s, t).hidden) expect(pt.y).toBeLessThan(groundY(pt.x) + 40);
      }
    }
  });

  test("each basin and the pool sit on their own terrace, each lower than the one before", () => {
    BASINS.forEach((b, i) => {
      expect(groundY((b.x0 + b.x1) / 2)).toBeCloseTo(b.y - 20, 0);
      if (i > 0) expect(b.y).toBeGreaterThan(BASINS[i - 1].y);
    });
    expect(groundY((POOL.x0 + POOL.x1) / 2)).toBe(POOL.lawn);
    // The wild ponds between the basins lie on terraces of their own too, lower one after the other.
    for (const p of PONDS) expect(groundY((p.x0 + p.x1) / 2)).toBeCloseTo(p.y - 20, 0);
    PONDS.slice(1).forEach((p, i) => {
      expect(p.y).toBeGreaterThan(PONDS[i].y);
    });
    GROUND.slice(1).forEach((p, i) => {
      expect(p.x).toBeGreaterThanOrEqual(GROUND[i].x);
    });
  });

  test("the whole run takes about a minute and ends once, at the very end", () => {
    const total = stretches.reduce((sum, s) => sum + s.duration, 0);
    expect(total).toBeGreaterThan(56);
    expect(total).toBeLessThan(64);
    for (const s of stretches) {
      expect(Math.max(...s.events.map((e) => e.at))).toBeLessThanOrEqual(s.duration);
      // Things settle: the water stops a while before the duck waits at the next gate.
      expect(s.close + 0.8).toBeLessThanOrEqual(s.duration);
    }
    const ends = stretches.flatMap((s, i) => s.events.filter((e) => e.done).map((e) => ({ i, at: e.at })));
    expect(ends).toEqual([{ i: stretches.length - 1, at: stretches[stretches.length - 1].duration }]);
  });

  test("only the start and the tower's gate wait for a tap", () => {
    expect(stretches.map((_, i) => gateWaits(i))).toEqual(stretches.map((_, i) => i === 0 || i === TAP_GATE));
  });

  test("the stork holds the duck by the head all the way over the hill, and ends in its nest", () => {
    const s = stretches[0];
    const { stork } = water;
    for (let t = stork.grab; t < stork.release; t += 0.05) {
      const tip = water.storkAt(t).tip;
      const top = duckTop(poseAt(s, t).pt);
      expect(Math.hypot(tip.x - top.x, tip.y - top.y)).toBeLessThan(12);
    }
    const end = water.storkAt(s.duration);
    expect(Math.abs(end.body.x - STORK.nest.x)).toBeLessThan(40);
    expect(Math.abs(end.body.y - STORK.nest.y)).toBeLessThan(60);
    expect(end.wing).toBeNull();
  });

  test("the turtle swims right under the duck while it carries it", () => {
    const s = stretches[1];
    const { turtle } = water;
    expect(water.turtleAt(turtle.rise - 0.01)).toBeNull();
    for (let t = turtle.rise + 0.2; t < turtle.bow; t += 0.05) {
      const shell = water.turtleAt(t);
      const duck = poseAt(s, t).pt;
      expect(shell).not.toBeNull();
      if (!shell) continue;
      expect(Math.abs(shell.top.x - duck.x)).toBeLessThan(30);
      expect(shell.top.y).toBeGreaterThan(duck.y - 10);
      expect(shell.top.y).toBeLessThan(duck.y + 40);
    }
  });

  test("the geyser's column holds the duck up from the warm spring", () => {
    const s = stretches[2];
    const { geyser } = water;
    // Its first moment the column is still a bulge in the spring.
    for (let t = geyser.shoot + 0.15; t < geyser.jump; t += 0.05) {
      const top = water.geyserAt(t);
      const duck = poseAt(s, t).pt;
      expect(top).not.toBeNull();
      expect(Math.abs(duck.x - GEYSER.x)).toBeLessThan(30);
      expect(Math.abs((top ?? 0) - duck.y)).toBeLessThan(30);
      expect(top ?? 0).toBeLessThan(HOT_SPRING.y);
    }
    expect(water.geyserAt(s.duration)).toBeNull();
  });

  test("the ducklings end in a row behind the duck, all in the pool", () => {
    const s = stretches[3];
    const xs = [0, 1, 2].map((i) => water.babyAt(i, s.duration).x);
    const duck = poseAt(s, s.duration).pt;
    expect(duck.x).toBeLessThan(POOL_SPOT.x);
    xs.forEach((x, i) => {
      expect(x).toBeCloseTo(PARADE.end + (i + 1) * PARADE.gap, 3);
      expect(x).toBeGreaterThan(POOL.x0);
      expect(x).toBeLessThan(POOL.x1);
    });
  });

  test("nothing moves or sounds before the gate opens", () => {
    for (const s of stretches) {
      expect(Math.min(...s.events.map((e) => e.at))).toBe(0);
      const before = poseAt(s, -1);
      expect(before.moving).toBe(false);
      expect(before.tilt).toBe(0);
    }
  });
});
