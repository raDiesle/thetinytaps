import { describe, expect, test } from "bun:test";
import {
  buildGarden,
  CROQUET,
  FEEDER,
  FLOOR,
  headGap,
  HEDGEHOG,
  knobAt,
  LEAF_PILE,
  LEAVES,
  MALLET,
  malletHead,
  MOLEHILL,
  MOWER,
  NUT_SPOTS,
  NUT_TREE,
  PINWHEEL,
  TAP,
  WORLD_W,
} from "./garden";

describe("Im Garten", () => {
  const garden = buildGarden();

  test("the machine runs about a minute and ends after everything else", () => {
    expect(garden.duration).toBeGreaterThan(56);
    expect(garden.duration).toBeLessThan(64);
    const last = garden.events[garden.events.length - 1];
    expect(last.at).toBe(garden.duration);
    expect(last.done).toBe(true);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      garden.tCup,
      garden.tPush,
      garden.tStop,
      garden.tMow,
      garden.tBump,
      garden.nutLand[0],
      garden.eats[0].eat,
      garden.eats[garden.eats.length - 1].done,
      garden.tLeap,
      garden.tOnHead,
      garden.tBall,
      garden.tKnock,
      garden.tPeek,
      garden.tMid,
      garden.tPopB,
      garden.tToss,
      garden.tLandHog,
      garden.tBurst,
      garden.tGust,
      garden.tOpen,
      garden.tSpray,
      garden.tBloom,
      garden.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("nothing moves before the tap", () => {
    expect(garden.hogAt(-1).pt).toEqual({ x: HEDGEHOG.x, y: FLOOR - HEDGEHOG.r });
    expect(garden.pinwheelAt(-1)).toBe(0);
    expect(garden.leanAt(-1)).toBe(0);
    expect(garden.leverAt(-1)).toBe(0);
    expect(garden.moleAt(-1)).toEqual([0, 0, 0]);
    expect(garden.pileAt(-1)).toBe(1);
  });

  test("the apple wakes the mower, which mows over to the feeder's pole and bumps it", () => {
    expect(garden.appleAt(garden.tMow).pt.x + 22).toBeCloseTo(MOWER.x - MOWER.len / 2, 0);
    expect(garden.mowerAt(garden.tMow).x).toBe(MOWER.x);
    expect(garden.mowerAt(garden.tBump).x + MOWER.len / 2).toBeCloseTo(FEEDER.x - FEEDER.w / 2, 0);
    expect(garden.poleAt(garden.tBump - 0.01)).toBe(0);
    for (let t = 0; t <= garden.duration; t += 0.05) expect(garden.mowerAt(t).x + MOWER.len / 2).toBeLessThanOrEqual(FEEDER.x - FEEDER.w / 2 + 0.5);
  });

  test("the nuts fall out of the shaken feeder onto the grass between its pole and the squirrel's tree", () => {
    for (const x of NUT_SPOTS) {
      expect(x).toBeGreaterThan(FEEDER.x + 30);
      expect(x).toBeLessThan(NUT_TREE.x - NUT_TREE.trunkW / 2 - 40);
    }
    NUT_SPOTS.forEach((x, i) => {
      expect(garden.nutAt(i, garden.tBump)).toBeNull();
      expect(garden.nutAt(i, garden.nutLand[i] + 0.3)).toEqual({ x, y: FLOOR - 9 });
    });
  });

  test("the squirrel eats every nut where it lies, climbs the trunk and leaps onto the mallet's head", () => {
    expect(garden.eats.length).toBe(NUT_SPOTS.length);
    for (const e of garden.eats) {
      expect(e.eat).toBeGreaterThan(garden.nutLand[e.i]);
      expect(Math.abs(garden.squirrelAt(e.eat + 0.1).pt.x - NUT_SPOTS[e.i])).toBeLessThan(30);
      expect(garden.nutAt(e.i, e.done)).toBeNull();
    }
    const [, , c, d] = malletHead(MALLET.lean);
    const onHead = garden.squirrelAt(garden.tOnHead).pt;
    expect(onHead.x).toBeCloseTo((c.x + d.x) / 2, 0);
    expect(onHead.y).toBeCloseTo((c.y + d.y) / 2, 0);
    expect(garden.malletAt(garden.tOnHead - 0.01)).toBe(MALLET.lean);
    for (let t = 0; t <= garden.duration; t += 0.05) {
      const { pt } = garden.squirrelAt(t);
      expect(pt.y).toBeLessThanOrEqual(FLOOR);
      expect(pt.y).toBeGreaterThan(300);
      expect(pt.x).toBeGreaterThan(FEEDER.x);
      expect(pt.x).toBeLessThan(CROQUET.x - CROQUET.r);
    }
  });

  test("the falling mallet's head meets the croquet ball and never goes into it", () => {
    expect(headGap(CROQUET.x, garden.malletAt(garden.tBall))).toBeLessThan(2);
    for (let t = garden.tOnHead; t <= garden.duration; t += 0.01) expect(headGap(garden.ballAt(t).pt.x, garden.malletAt(t))).toBeGreaterThan(-0.5);
    expect(Math.max(...malletHead(garden.malletAt(garden.duration)).map((p) => p.y))).toBeLessThanOrEqual(FLOOR + 0.5);
  });

  test("the croquet ball rolls right up to the molehill without going into it", () => {
    const gap = (t: number) => {
      const { pt } = garden.ballAt(t);
      let min = Infinity;
      for (let a = 0; a <= Math.PI; a += 0.01) {
        min = Math.min(min, Math.hypot(MOLEHILL.x + MOLEHILL.rx * Math.cos(a) - pt.x, FLOOR - MOLEHILL.h * Math.sin(a) - pt.y));
      }
      return min - CROQUET.r;
    };
    expect(gap(garden.tKnock)).toBeLessThan(3);
    for (let t = garden.tBall; t <= garden.tKnock + 1; t += 0.05) expect(gap(t)).toBeGreaterThan(-0.5);
  });

  test("the mole comes up right under the hedgehog and tosses it from the hilltop", () => {
    expect(garden.ridgeAt(garden.tPopB)).toBe(HEDGEHOG.x);
    const onHill = garden.hogAt(garden.tToss - 0.01).pt;
    expect(onHill.x).toBe(HEDGEHOG.x);
    expect(onHill.y).toBeCloseTo(FLOOR - HEDGEHOG.r - MOLEHILL.h, 0);
    expect(garden.moleAt(garden.tToss)[2]).toBeGreaterThan(0.5);
  });

  test("the hedgehog lands clear of the hill, bursts the leaf pile and stops before the pinwheel's pot", () => {
    expect(HEDGEHOG.land - HEDGEHOG.r).toBeGreaterThan(HEDGEHOG.x + MOLEHILL.rx);
    const landed = garden.hogAt(garden.tLandHog).pt;
    expect(landed.x).toBeCloseTo(HEDGEHOG.land, 0);
    expect(landed.y).toBeCloseTo(FLOOR - HEDGEHOG.r, 0);
    const pileLeft = LEAF_PILE.x - LEAF_PILE.w / 2;
    expect(garden.hogAt(garden.tBurst).pt.x + HEDGEHOG.r).toBeCloseTo(pileLeft, 0);
    expect(garden.hogAt(garden.tBurst - 0.05).pt.x + HEDGEHOG.r).toBeLessThan(pileLeft);
    expect(garden.hogAt(garden.duration).pt.x).toBe(HEDGEHOG.stop);
    // Standing, the hedgehog reaches about 1.8 radii in front of its middle.
    expect(HEDGEHOG.stop + 1.8 * HEDGEHOG.r).toBeLessThan(PINWHEEL.x - 46);
    for (let t = 0; t <= garden.duration; t += 0.02) {
      const { pt } = garden.hogAt(t);
      expect(pt.y).toBeLessThanOrEqual(FLOOR - HEDGEHOG.r + 0.01);
      expect(pt.y).toBeGreaterThan(300);
      expect(pt.x).toBeGreaterThanOrEqual(HEDGEHOG.x);
      expect(pt.x).toBeLessThanOrEqual(HEDGEHOG.stop);
    }
  });

  test("the whirling leaves stay in the garden and reach the pinwheel when it starts spinning", () => {
    for (let t = garden.tBurst; t <= garden.duration; t += 0.05) {
      for (let i = 0; i < LEAVES; i++) {
        const leaf = garden.leafAt(i, t);
        if (!leaf) continue;
        expect(leaf.pt.x).toBeGreaterThan(0);
        expect(leaf.pt.x).toBeLessThan(WORLD_W);
        expect(leaf.pt.y).toBeGreaterThan(200);
        expect(leaf.pt.y).toBeLessThanOrEqual(FLOOR - 6);
      }
    }
    const front = Math.max(...Array.from({ length: LEAVES }, (_, i) => garden.leafAt(i, garden.tGust)?.pt.x ?? 0));
    expect(front).toBeGreaterThanOrEqual(PINWHEEL.x - PINWHEEL.r);
    expect(garden.pinwheelAt(garden.tGust)).toBe(0);
    expect(garden.pinwheelAt(garden.tOpen)).toBeGreaterThan(4 * Math.PI);
  });

  test("the pinwheel's string pulls the lever towards it until the tap is open", () => {
    expect(garden.leverAt(garden.tOpen)).toBe(TAP.open);
    const dist = (t: number) => {
      const knob = knobAt(garden.leverAt(t));
      const hub = garden.hubAt(t);
      return Math.hypot(knob.x - hub.x, knob.y - hub.y);
    };
    // The string only gets shorter while it winds up.
    for (let t = garden.tGust + 0.5; t < garden.tOpen; t += 0.05) expect(dist(t + 0.05)).toBeLessThan(dist(t) + 1);
    expect(dist(garden.tOpen)).toBeLessThan(dist(garden.tGust) - 100);
  });
});
