import { describe, expect, test } from "bun:test";
import {
  BLOBS,
  BULBS,
  buildLight,
  CAROUSEL,
  DOME_Y,
  FIREFLIES,
  FLOOR,
  GLOBE,
  GLOBE_BUTTON,
  LAMP,
  LAVA,
  lavaHalf,
  NAILS,
  SIDE_TABLE,
  SWITCH,
  WIRE,
  WORLD_W,
  wireY,
} from "./light";

describe("Licht-Kette", () => {
  const light = buildLight();
  const times = (from: number, to: number, step = 0.05) => Array.from({ length: Math.ceil((to - from) / step) + 1 }, (_, k) => Math.min(to, from + k * step));

  test("the fairy lights hang between the nails, never above them or far below", () => {
    for (let x = NAILS[0]; x <= NAILS[NAILS.length - 1]; x += 10) {
      expect(wireY(x)).toBeGreaterThanOrEqual(WIRE.y - 0.01);
      expect(wireY(x)).toBeLessThanOrEqual(WIRE.y + WIRE.sag + 0.01);
    }
  });

  test("the machine runs about forty seconds and ends after everything else", () => {
    expect(light.duration).toBeGreaterThan(38);
    expect(light.duration).toBeLessThan(42);
    expect(Math.max(...light.events.map((e) => e.at))).toBe(light.duration);
    expect(light.events.filter((e) => e.done)).toHaveLength(1);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      light.tMirror,
      light.tBall,
      light.tSpot,
      light.tJar,
      light.tLid,
      light.tSwitch,
      light.tRise(0),
      light.tTurn,
      light.tRabbitShows,
      light.tBirdShows,
      light.tLoose,
      light.tGlobe,
      light.tCall(FIREFLIES - 1),
      light.tLamp,
      light.tOwl,
      light.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
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
    expect(on[on.length - 1]).toBeLessThan(light.tSwitch);
  });

  test("the first firefly presses the lava lamp's switch, and all sit on the side table until the globe calls them", () => {
    const first = light.fireflyAt(0, light.tSwitch).pt;
    expect(Math.hypot(first.x - SWITCH.x, first.y - SWITCH.y)).toBeLessThan(25);
    expect(light.lavaGlow(light.tSwitch - 0.01)).toBe(0);
    for (let i = 0; i < FIREFLIES; i++) {
      expect(light.tSeat(i)).toBeLessThan(light.tCall(i));
      const { pt } = light.fireflyAt(i, light.tCall(i) - 0.01);
      expect(pt.x).toBeGreaterThan(SIDE_TABLE.x0);
      expect(pt.x).toBeLessThan(SIDE_TABLE.x1);
      expect(pt.y).toBeLessThan(SIDE_TABLE.top);
    }
  });

  test("the lava lamp's blobs stay inside the glass and end up near its top", () => {
    BLOBS.forEach((_, i) => {
      for (const t of times(-1, light.duration)) {
        const b = light.blobAt(i, t);
        expect(b.y - b.ry).toBeGreaterThan(LAVA.glass1);
        expect(b.y + b.ry).toBeLessThan(LAVA.glass0);
        expect(Math.abs(b.x - LAVA.x) + b.rx * 0.9).toBeLessThan(lavaHalf(b.y) + 1);
      }
      expect(light.blobAt(i, light.duration).y).toBeLessThan((LAVA.glass0 + LAVA.glass1) / 2);
    });
  });

  test("nothing turns before the lamp is warm, and the cut-outs never touch the glass", () => {
    expect(light.carousel(light.tTurn)).toBe(0);
    expect(light.heat(light.tSwitch)).toBe(0);
    expect(CAROUSEL.r).toBeGreaterThan(lavaHalf(CAROUSEL.hoop + CAROUSEL.hang + 70) + 30);
  });

  test("the shadows show on the wall only while the lamp is on, and stay in the room", () => {
    for (const t of times(-1, light.duration)) {
      const r = light.rabbitShadow(t);
      const b = light.birdShadow(t);
      if (t < light.tSwitch) {
        expect(r.show).toBe(0);
        expect(b.show).toBe(0);
      }
      for (const s of [r, b]) {
        if (s.show <= 0) continue;
        expect(s.x).toBeGreaterThan(200);
        expect(s.x).toBeLessThan(WORLD_W - 200);
        expect(s.y).toBeLessThan(FLOOR - 100);
        expect(s.y).toBeGreaterThan(200);
      }
    }
  });

  test("the paper bird comes loose from the hoop and lands on the globe's button, which lights the globe", () => {
    expect(light.birdOnHoop(light.tLoose - 0.01)).not.toBeNull();
    expect(light.birdOnHoop(light.tLoose)).toBeNull();
    const landed = light.birdFlying(light.tGlobe)?.pt;
    expect(landed).toBeDefined();
    expect(Math.hypot((landed?.x ?? 0) - GLOBE_BUTTON.x, (landed?.y ?? 0) - GLOBE_BUTTON.y)).toBeLessThan(20);
    expect(light.globeGlow(light.tGlobe)).toBe(0);
    expect(light.globeTurn(light.tGlobe)).toBe(0);
    expect(light.globeGlow(light.tGlobe + 1)).toBe(1);
    for (const t of times(light.tLoose, light.duration)) {
      const pt = light.birdFlying(t)?.pt;
      expect(pt?.x).toBeGreaterThan(LAVA.x);
      expect(pt?.x).toBeLessThan(GLOBE.x + GLOBE.r);
      expect(pt?.y).toBeLessThan(FLOOR);
      expect(pt?.y).toBeGreaterThan(200);
    }
  });

  test("the fireflies stay in the room, and every one ends up on the star lamp", () => {
    for (let i = 0; i < FIREFLIES; i++) {
      for (const t of times(-1, light.duration, 0.1)) {
        const { pt } = light.fireflyAt(i, t);
        expect(pt.x).toBeGreaterThan(0);
        expect(pt.x).toBeLessThan(WORLD_W);
        expect(pt.y).toBeGreaterThan(40);
        expect(pt.y).toBeLessThan(FLOOR);
      }
      const { pt } = light.fireflyAt(i, light.duration);
      expect(Math.hypot(pt.x - LAMP.x, pt.y - DOME_Y)).toBeLessThan(LAMP.r + 40);
    }
  });
});
