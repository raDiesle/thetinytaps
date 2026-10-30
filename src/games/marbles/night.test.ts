import { describe, expect, test } from "bun:test";
import {
  BASKET,
  BIRD,
  buildNight,
  CHAIN,
  CHAIR,
  CLOCK,
  CRADLE,
  CURTAIN,
  DOOR,
  FLOOR,
  KNOB0,
  knobAt,
  LAMP,
  MOON,
  PENDULUM,
  ROUND_WINDOW,
  SHELF,
  STAR_R,
  WORLD_W,
} from "./night";

describe("Gute-Nacht-Maschine", () => {
  const night = buildNight();

  test("the machine runs 42 to 46 seconds and ends after everything else", () => {
    expect(night.duration).toBeGreaterThan(42);
    expect(night.duration).toBeLessThan(46);
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

  test("the story comes in order: star, basket, curtain, rocking chair, cuckoo clock, light out, moon", () => {
    const order = [
      night.tPush,
      night.tIn,
      night.tSink,
      night.tNudge,
      night.tShut,
      night.tHour,
      night.tOut,
      night.tCall,
      night.tBirdYawn,
      night.tClick,
      night.tBack,
      night.tMoon,
      night.tTeddy,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("nothing in the reading corner moves before the tap", () => {
    expect(night.chairAngle(-1)).toBe(0);
    expect(night.pendulumAngle(-1)).toBe(0);
    expect(night.doorOpen(-1)).toBe(0);
    expect(night.birdX(-1)).toBe(BIRD.inX);
    expect(night.chainSwing(-1)).toBe(0);
  });

  test("the curtain's edge reaches the chair's knob and tips the chair, which then taps the pendulum's bob", () => {
    expect(CURTAIN.closed).toBeGreaterThan(KNOB0.x - CHAIR.knobR);
    expect(night.curtainEdge(night.tShut)).toBe(CURTAIN.closed);
    expect(night.chairAngle(night.tNudge - 0.05)).toBe(0);
    expect(night.chairAngle(night.tShut)).toBeGreaterThan(0.1);
    // The knob touches the bob when the curtain is shut…
    const knob = knobAt(night.chairAngle(night.tShut));
    const bob = { x: CLOCK.x, y: CLOCK.bottom + PENDULUM.len };
    expect(Math.abs(Math.hypot(knob.x - bob.x, knob.y - bob.y) - CHAIR.knobR - PENDULUM.bobR)).toBeLessThan(1.5);
    // …and never goes through it, before or after.
    for (let t = 0; t <= night.duration; t += 0.02) {
      const k = knobAt(night.chairAngle(t));
      const a = night.pendulumAngle(t);
      const b = { x: CLOCK.x + PENDULUM.len * Math.sin(a), y: CLOCK.bottom + PENDULUM.len * Math.cos(a) };
      expect(Math.hypot(k.x - b.x, k.y - b.y)).toBeGreaterThan(CHAIR.knobR + PENDULUM.bobR - 1.5);
    }
    expect(night.pendulumAngle(night.tShut - 0.01)).toBe(0);
    expect(night.pendulumAngle(night.tShut + PENDULUM.period / 4)).toBeGreaterThan(0);
  });

  test("the chair rocks softer and softer and its rockers stay on the floor, in the room, and clear of the lamp", () => {
    const peak = night.chairAngle(night.tShut);
    expect(Math.abs(night.chairAngle(night.tShut + 1.4))).toBeLessThan(peak);
    expect(Math.abs(night.chairAngle(night.duration))).toBeLessThan(peak / 10);
    for (const a of [peak, -peak]) {
      for (const dx of [-165, 165]) {
        const tip = { x: CHAIR.x + dx, y: FLOOR - 36 };
        const turned = {
          x: CHAIR.x + (tip.x - CHAIR.x) * Math.cos(a) - (tip.y - FLOOR) * Math.sin(a),
          y: FLOOR + (tip.x - CHAIR.x) * Math.sin(a) + (tip.y - FLOOR) * Math.cos(a),
        };
        expect(turned.y).toBeLessThan(FLOOR);
        expect(turned.x).toBeGreaterThan(0);
        expect(turned.x).toBeLessThan(LAMP.base - 70);
      }
    }
  });

  test("the minute hand reaches the full hour before the door opens, and the cuckoo comes out of it", () => {
    expect(night.minuteHand(night.tShut)).toBeLessThan(0);
    expect(night.minuteHand(night.tHour)).toBe(0);
    expect(night.minuteHand(night.tHour - 0.3)).toBe(-3);
    expect(night.doorOpen(night.tOut)).toBeGreaterThan(0.6);
    expect(night.birdX(night.tCall)).toBe(BIRD.outX);
    expect(BIRD.inX + BIRD.beak.dx).toBeLessThan(DOOR.x - DOOR.w / 2);
    expect(night.doorOpen(night.duration)).toBe(0);
    expect(night.birdX(night.duration)).toBe(BIRD.inX);
  });

  test("the bead hangs just out of the cuckoo's reach until its yawn pushes it, and the light goes off then", () => {
    const bead = { x: CHAIN.x, y: CHAIN.top + CHAIN.len };
    expect(Math.abs(bead.y - (BIRD.y + BIRD.beak.dy))).toBeLessThan(CHAIN.bead);
    expect(night.chainSwing(night.tCall + 1)).toBe(0);
    expect(night.chainSwing(night.tClick)).toBeGreaterThan(0.2);
    expect(night.lampOn(night.tClick - 0.01)).toBe(1);
    expect(night.lampOn(night.tClick + 0.2)).toBe(0);
    // The lamp's shade hangs clear of the clock's roof.
    expect(CHAIN.top + 10).toBeLessThan(CLOCK.top - 30 + ((LAMP.shade.x - 60 - CLOCK.x) / 85) * 36);
  });

  test("the room's far end still holds the round window and the cradle", () => {
    expect(ROUND_WINDOW.x + ROUND_WINDOW.r).toBeLessThan(WORLD_W);
    expect(CRADLE.x1 + 20).toBeLessThan(WORLD_W);
    expect(CRADLE.x0 - 20).toBeGreaterThan(LAMP.base + 70);
  });

  test("the moon rises from below the round window into it", () => {
    expect(MOON.y0 - MOON.r).toBeGreaterThan(ROUND_WINDOW.y + ROUND_WINDOW.r);
    const top = night.moonY(night.duration);
    expect(Math.hypot(MOON.x - ROUND_WINDOW.x, top - ROUND_WINDOW.y) + MOON.r).toBeLessThan(ROUND_WINDOW.r);
  });

  test("everyone falls asleep in turn, the last one before the end", () => {
    const order = [night.tTeddy, night.tMoonSleep, night.tCuckoo, night.tStar, night.tSheep];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
    expect(night.tSheep).toBeLessThan(night.duration - 1);
    expect(night.tTeddy).toBeGreaterThan(night.tClick);
  });
});
