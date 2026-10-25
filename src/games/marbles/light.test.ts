import { describe, expect, test } from "@rstest/core";
import { BULBS, buildLight, DOME_Y, FIREFLIES, LAMP, NAILS, WIRE, wireY } from "./light";

describe("Licht-Kette", () => {
  const light = buildLight();

  test("the fairy lights hang between the nails, never above them or far below", () => {
    for (let x = NAILS[0]; x <= NAILS[NAILS.length - 1]; x += 10) {
      expect(wireY(x)).toBeGreaterThanOrEqual(WIRE.y - 0.01);
      expect(wireY(x)).toBeLessThanOrEqual(WIRE.y + WIRE.sag + 0.01);
    }
  });

  test("the machine runs about half a minute and ends after everything else", () => {
    expect(light.duration).toBeGreaterThan(18);
    expect(light.duration).toBeLessThan(40);
    expect(Math.max(...light.events.map((e) => e.at))).toBe(light.duration);
  });

  test("the bulbs come on one after the other, left to right", () => {
    const on = BULBS.map((_, k) => {
      let t = 0;
      while (light.bulbOn(k, t) <= 0) t += 0.05;
      return t;
    });
    on.slice(1).forEach((t, k) => {
      expect(t).toBeGreaterThanOrEqual(on[k]);
    });
    expect(on[on.length - 1]).toBeLessThan(light.tLamp);
  });

  test("every firefly ends up on the star lamp", () => {
    for (let i = 0; i < FIREFLIES; i++) {
      const { pt } = light.fireflyAt(i, light.duration);
      expect(Math.hypot(pt.x - LAMP.x, pt.y - DOME_Y)).toBeLessThan(LAMP.r + 40);
    }
  });
});
