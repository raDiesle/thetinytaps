import { describe, expect, test } from "bun:test";
import { BASKET, buildNight, CHAIN, CURTAIN, MOON, ROUND_WINDOW, SHELF, STAR_R, WORLD_W } from "./night";

describe("Gute-Nacht-Maschine", () => {
  const night = buildNight();

  test("the machine runs about half a minute and ends after everything else", () => {
    expect(night.duration).toBeGreaterThan(22);
    expect(night.duration).toBeLessThan(40);
    expect(Math.max(...night.events.map((e) => e.at))).toBe(night.duration);
  });

  test("the crank nudges the star soon after the tap, and the star ends in the basket", () => {
    expect(night.tPush).toBeGreaterThan(0.1);
    expect(night.tPush).toBeLessThan(1.5);
    const { pt } = night.starAt(night.duration);
    expect(Math.abs(pt.x - BASKET.x)).toBeLessThan(BASKET.w / 2 - STAR_R);
    expect(pt.y).toBeGreaterThan(night.basketRim(night.duration));
  });

  test("the star never leaves the room or sinks below the shelf's start before it rolls", () => {
    for (let t = 0; t <= night.duration; t += 0.05) {
      const { pt } = night.starAt(t);
      expect(pt.x).toBeGreaterThan(SHELF.x0);
      expect(pt.x).toBeLessThan(WORLD_W);
      expect(pt.y).toBeGreaterThan(0);
    }
  });

  test("the curtain reaches the lamp's bead and is shut when the lamp clicks off", () => {
    expect(CURTAIN.closed).toBeGreaterThan(CHAIN.x - CHAIN.bead);
    expect(night.curtainEdge(night.tClick)).toBe(CURTAIN.closed);
    expect(night.chainSwing(night.tClick)).toBeGreaterThan(0);
    expect(night.lampOn(night.tClick - 0.01)).toBe(1);
    expect(night.lampOn(night.tClick + 0.2)).toBe(0);
  });

  test("the moon rises from below the round window into it", () => {
    expect(MOON.y0 - MOON.r).toBeGreaterThan(ROUND_WINDOW.y + ROUND_WINDOW.r);
    const top = night.moonY(night.duration);
    expect(Math.hypot(MOON.x - ROUND_WINDOW.x, top - ROUND_WINDOW.y) + MOON.r).toBeLessThan(ROUND_WINDOW.r);
  });

  test("everyone falls asleep in turn, the last one before the end", () => {
    const order = [night.tTeddy, night.tMoonSleep, night.tStar, night.tSheep];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
    expect(night.tSheep).toBeLessThan(night.duration - 1);
    expect(night.tTeddy).toBeGreaterThan(night.tClick);
  });
});
