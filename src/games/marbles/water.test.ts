import { describe, expect, test } from "@rstest/core";
import { along } from "./machineKit";
import { BASINS, buildWater, gateX, GROUND, groundY, POOL, POOL_SPOT, poseAt, SKY_TOP, waitSpot, WORLD_H, WORLD_W } from "./water";

describe("Wasserbahn", () => {
  const { stretches } = buildWater();

  test("every stretch starts where the duck waits in its basin and ends where it waits in the next one", () => {
    stretches.forEach((s, i) => {
      expect(s.basin).toBe(BASINS[i]);
      expect(s.legs[0].path.pts[0]).toEqual(waitSpot(BASINS[i]));
      const end = poseAt(s, s.duration).pt;
      const next = i + 1 < BASINS.length ? waitSpot(BASINS[i + 1]) : POOL_SPOT;
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
      }
    }
  });

  test("each basin and the pool sit on their own terrace, each lower than the one before", () => {
    BASINS.forEach((b, i) => {
      expect(groundY((b.x0 + b.x1) / 2)).toBeCloseTo(b.y - 20, 0);
      if (i > 0) expect(b.y).toBeGreaterThan(BASINS[i - 1].y);
    });
    expect(groundY((POOL.x0 + POOL.x1) / 2)).toBe(POOL.lawn);
    GROUND.slice(1).forEach((p, i) => {
      expect(p.x).toBeGreaterThanOrEqual(GROUND[i].x);
    });
  });

  test("the whole run takes about half a minute and ends once, at the very end", () => {
    const total = stretches.reduce((sum, s) => sum + s.duration, 0);
    expect(total).toBeGreaterThan(26);
    expect(total).toBeLessThan(40);
    for (const s of stretches) {
      expect(Math.max(...s.events.map((e) => e.at))).toBeLessThanOrEqual(s.duration);
      // Things settle: the water stops a while before the duck waits at the next gate.
      expect(s.close + 0.8).toBeLessThanOrEqual(s.duration);
    }
    const ends = stretches.flatMap((s, i) => s.events.filter((e) => e.done).map((e) => ({ i, at: e.at })));
    expect(ends).toEqual([{ i: stretches.length - 1, at: stretches[stretches.length - 1].duration }]);
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
