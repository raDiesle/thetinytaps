import { describe, expect, test } from "bun:test";
import { BLOWHOLE, BUBBLES, buildBath, DUCK, DUCK_R, FLOOR, HANDLE, HOLDER, LAMP, MUG, NOZZLE, ROLL, TUB, WAND, WHALE, WORLD_W } from "./bath";

describe("Badezimmer", () => {
  const bath = buildBath();

  test("the machine runs 37 to 41 seconds and ends after everything else", () => {
    expect(bath.duration).toBeGreaterThan(37);
    expect(bath.duration).toBeLessThan(41);
    expect(Math.max(...bath.events.map((e) => e.at))).toBe(bath.duration);
    expect(bath.events.filter((e) => e.done)).toHaveLength(1);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      bath.tBlobLand,
      bath.tInMug,
      bath.tTopple,
      bath.tHit,
      bath.tLever,
      bath.tInTub,
      bath.tFull,
      bath.tSurf,
      bath.tBonk,
      bath.tRollLand,
      bath.tKey,
      bath.tWound,
      bath.tWake,
      bath.tWalk,
      bath.tStop,
      bath.tFountain,
      bath.tHitDryer,
      bath.tDryer,
      bath.tCapLand,
      bath.tLast,
      bath.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("the falling mug really reaches the duck, and nothing moves it before", () => {
    expect(bath.tHit).toBeLessThan(bath.tTopple + 0.5);
    expect(bath.duckAt(bath.tHit - 0.01).pt).toEqual({ x: DUCK.x, y: DUCK.y });
    expect(DUCK.x - MUG.x).toBeGreaterThan(MUG.w);
  });

  test("the duck floats in the tub until it overflows, and the water never rises over the rim", () => {
    for (let t = bath.tInTub; t < bath.tSurf; t += 0.1) {
      const { pt } = bath.duckAt(t);
      expect(pt.x).toBeGreaterThan(TUB.x0 + 40);
      expect(pt.x).toBeLessThan(TUB.x1 - 40);
      expect(pt.y).toBeLessThan(TUB.bottom);
    }
    for (let t = 0; t <= bath.duration; t += 0.1) expect(bath.waterY(t)).toBeGreaterThanOrEqual(TUB.rim);
  });

  test("the duck really bonks the roll, and the roll stays on its holder until then", () => {
    const duck = bath.duckAt(bath.tBonk).pt;
    expect(Math.hypot(duck.x - HOLDER.x, duck.y - HOLDER.y)).toBeLessThan(DUCK_R + ROLL.r + 2);
    expect(bath.rollAt(bath.tBonk - 0.01).pt).toEqual({ x: HOLDER.x, y: HOLDER.y });
    expect(bath.ribbon(bath.tBonk - 0.01)).toBeNull();
    // Over the rim, and then down in the puddle on the floor, clear of the tub.
    const down = bath.duckAt(bath.duration).pt;
    expect(down.x).toBeGreaterThan(TUB.x1);
    expect(down.y + 40).toBeCloseTo(FLOOR, 0);
  });

  test("the roll stays on the floor and in the world, and gets thinner as its paper unrolls", () => {
    let last = ROLL.r;
    for (let t = bath.tBonk; t <= bath.tKey; t += 0.02) {
      const { pt, r } = bath.rollAt(t);
      expect(pt.y + r).toBeLessThanOrEqual(FLOOR + 0.5);
      expect(pt.x - r).toBeGreaterThan(0);
      expect(pt.x + r).toBeLessThan(WORLD_W);
      expect(r).toBeLessThanOrEqual(last + 1e-9);
      expect(r).toBeGreaterThanOrEqual(ROLL.core);
      last = r;
    }
    expect(last).toBeLessThan(ROLL.r - 10);
    // It is still rolling when it gets to the key.
    expect(bath.rollAt(bath.tKey).pt.x - bath.rollAt(bath.tKey - 0.05).pt.x).toBeGreaterThan(3);
  });

  test("the roll really reaches the whale's key, and the whale waits for it", () => {
    const roll = bath.rollAt(bath.tKey);
    const key = bath.keyTip(bath.tKey);
    expect(Math.hypot(key.x - roll.pt.x, key.y - roll.pt.y)).toBeLessThan(roll.r + 5);
    for (let t = -1; t < bath.tWalk; t += 0.1) expect(bath.whaleAt(t).x).toBe(WHALE.x);
    expect(bath.whaleAt(bath.tKey - 0.01).keyTurn).toBe(0);
    expect(bath.whaleAt(bath.tWound).keyTurn).toBeGreaterThan(700);
  });

  test("the whale walks to right under the dryer's switch, and its fountain reaches it", () => {
    expect(bath.whaleAt(bath.tStop).x).toBe(WHALE.stop);
    expect(WHALE.stop + BLOWHOLE.dx).toBeCloseTo(HANDLE.x, 5);
    expect(bath.fountainAt(bath.tFountain - 0.01)).toBeNull();
    expect(bath.fountainAt(bath.tHitDryer)?.top).toBeCloseTo(HANDLE.y, 3);
    expect(bath.dryerAngle(bath.tHitDryer - 0.01)).toBe(0);
    expect(bath.blowing(bath.tDryer - 0.01)).toBe(0);
    expect(bath.blowing(bath.tDryer + 0.5)).toBe(1);
    // The wand stands in the dryer's air.
    expect(WAND.x).toBeGreaterThan(NOZZLE.x);
    expect(Math.abs(WAND.y - NOZZLE.y)).toBeLessThan(WAND.r);
  });

  test("the shower cap flies onto the lamp and stays in the bathroom on its way", () => {
    for (let t = bath.tDryer; t < bath.tCapLand; t += 0.05) {
      const cap = bath.capAt(t);
      expect(cap).not.toBeNull();
      expect(cap?.pt.y).toBeGreaterThan(60);
      expect(cap?.pt.x).toBeLessThan(WORLD_W - 50);
    }
    const last = bath.capAt(bath.tCapLand - 0.001);
    expect(Math.hypot((last?.pt.x ?? 0) - bath.capOn.x, (last?.pt.y ?? 0) - bath.capOn.y)).toBeLessThan(5);
    expect(bath.capAt(bath.tCapLand)).toBeNull();
    expect(Math.abs(bath.capOn.x - LAMP.x)).toBeLessThan(1);
  });

  test("every bubble pops at the lamp and stays in the bathroom on its way", () => {
    for (let i = 0; i < BUBBLES; i++) {
      const tPop = bath.tPop[i];
      const last = bath.bubbleAt(i, tPop - 0.01);
      expect(last).not.toBeNull();
      expect(Math.hypot((last?.pt.x ?? 0) - LAMP.x, (last?.pt.y ?? 0) - (LAMP.y + LAMP.r))).toBeLessThan(20);
      expect(bath.bubbleAt(i, tPop)).toBeNull();
      for (let t = tPop - 8; t < tPop; t += 0.1) {
        const b = bath.bubbleAt(i, t);
        if (!b) continue;
        expect(b.pt.y).toBeGreaterThan(40);
        expect(b.pt.x).toBeLessThan(WORLD_W);
      }
    }
  });

  test("the camera stays still before the tap and ends on the dryer and the lamp", () => {
    expect(bath.cameraTarget(-1)).toBe(0);
    const left = bath.cameraTarget(bath.duration);
    expect(left).toBeLessThan(HANDLE.x - 60);
    expect(left + 1600).toBeGreaterThan(LAMP.x + 200);
  });
});
