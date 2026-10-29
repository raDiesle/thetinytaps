import { describe, expect, test } from "bun:test";
import { BUBBLES, buildBath, DUCK, LAMP, MUG, TUB, WORLD_W } from "./bath";

describe("Badezimmer", () => {
  const bath = buildBath();

  test("the machine runs about half a minute and ends after everything else", () => {
    expect(bath.duration).toBeGreaterThan(18);
    expect(bath.duration).toBeLessThan(40);
    expect(Math.max(...bath.events.map((e) => e.at))).toBe(bath.duration);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [bath.tBlobLand, bath.tInMug, bath.tTopple, bath.tHit, bath.tLever, bath.tInTub, bath.tFull, bath.tLast, bath.duration];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("the falling mug really reaches the duck, and nothing moves it before", () => {
    expect(bath.tHit).toBeLessThan(bath.tTopple + 0.5);
    expect(bath.duckAt(bath.tHit - 0.01).pt).toEqual({ x: DUCK.x, y: DUCK.y });
    expect(DUCK.x - MUG.x).toBeGreaterThan(MUG.w);
  });

  test("the duck ends up afloat in the tub, and the water never rises over the rim", () => {
    for (let t = bath.tInTub; t <= bath.duration; t += 0.1) {
      const { pt } = bath.duckAt(t);
      expect(pt.x).toBeGreaterThan(TUB.x0 + 40);
      expect(pt.x).toBeLessThan(TUB.x1 - 40);
      expect(pt.y).toBeLessThan(TUB.bottom);
      expect(bath.waterY(t)).toBeGreaterThanOrEqual(TUB.rim);
    }
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
});
