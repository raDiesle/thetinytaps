import { describe, expect, test } from "bun:test";
import {
  BASKET,
  BEAM_TOP,
  BED,
  BIRD,
  BOTTLE,
  buildNight,
  CAGE,
  CAR,
  CHAIN,
  CHAIR,
  CHEST,
  CLOCK,
  CRADLE,
  CURTAIN,
  carNose,
  DOOR,
  FLOOR,
  hamsterNose,
  KNOB0,
  knobAt,
  LAMP,
  MOON,
  PENDULUM,
  ROPE,
  ROUND_WINDOW,
  SHELF,
  SHUTTER,
  STAR_R,
  TEDDY,
  WHEEL,
  WORLD_W,
} from "./night";

describe("Gute-Nacht-Maschine", () => {
  const night = buildNight();

  test("the machine runs 56 to 64 seconds and ends after everything else", () => {
    expect(night.duration).toBeGreaterThan(56);
    expect(night.duration).toBeLessThan(64);
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

  test("the story comes in order: star, basket, curtain, rocking chair, cuckoo clock, light out, hamster, cable car, shutter, moon, moonlight", () => {
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
      night.tHamsterWake,
      night.tDrink,
      night.tAtWheel,
      night.tInWheel,
      night.tRun,
      night.tArrive,
      night.tOpen,
      night.tBeam,
      night.tYawn,
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

  test("the hamster's chest stands between the lamp and the cradle, the cage and its wheel on it", () => {
    expect(CHEST.x0).toBeGreaterThan(LAMP.base + 70);
    expect(CHEST.x1).toBeLessThan(CRADLE.x0 - 20);
    expect(CAGE.x0).toBeGreaterThan(CHEST.x0);
    expect(CAGE.x1).toBeLessThan(CHEST.x1);
    expect(CAGE.bottom).toBe(CHEST.top);
    expect(WHEEL.x - WHEEL.r).toBeGreaterThan(BED.x + 30);
    expect(WHEEL.x + WHEEL.r).toBeLessThan(CAGE.x1);
    expect(WHEEL.y + WHEEL.r).toBeLessThanOrEqual(CAGE.floor);
    expect(BOTTLE.x0).toBeGreaterThan(CAGE.x0);
  });

  test("the hamster sleeps until the light is out, drinks with its nose at the bottle's spout, and runs in its wheel", () => {
    expect(night.hamsterAt(night.tClick).awake).toBe(0);
    expect(night.tHamsterWake).toBeGreaterThan(night.tClick + 1.8);
    expect(night.hamsterAt(night.tHamsterWake + 0.6).awake).toBe(1);
    const drinking = night.hamsterAt(night.tDrink + 0.8);
    const nose = hamsterNose(drinking);
    expect(Math.hypot(nose.x - BOTTLE.spout.x, nose.y - BOTTLE.spout.y)).toBeLessThan(6);
    expect(night.water(night.tDrink)).toBe(1);
    expect(night.water(night.duration)).toBeLessThan(1);
    // In the wheel it stays inside the rim while it runs.
    for (let t = night.tInWheel; t <= night.duration; t += 0.1) {
      const h = night.hamsterAt(t);
      expect(Math.hypot(h.x - WHEEL.x, h.y - WHEEL.y) + 21).toBeLessThan(WHEEL.r);
    }
    // It never leaves the cage.
    for (let t = 0; t <= night.duration; t += 0.05) {
      const h = night.hamsterAt(t);
      expect(h.x - 31).toBeGreaterThan(CAGE.x0);
      expect(h.x + 31).toBeLessThan(CAGE.x1);
      expect(h.y + 21).toBeLessThanOrEqual(CAGE.floor + 1);
    }
  });

  test("the wheel turns only while the hamster runs, and draws the cable car up until its nose touches the shut shutter", () => {
    expect(night.wheelTurn(night.tRun)).toBe(0);
    expect(night.wheelTurn(night.tRun + 1)).toBeGreaterThan(0);
    expect(night.wheelTurn(night.duration)).toBe(night.wheelTurn(night.tArrive));
    const start = night.carAt(0);
    expect(start.x - CAR.w / 2).toBeGreaterThan(CAGE.x1);
    expect(start.y + CAR.hanger + CAR.h).toBeLessThan(CHEST.top);
    const nose = carNose(night.carAt(night.tArrive));
    expect(Math.hypot(nose.x - ROUND_WINDOW.x, nose.y - ROUND_WINDOW.y)).toBeCloseTo(SHUTTER.r, 0);
    // The car never goes into the shutter, nor past the pulley that turns its rope.
    for (let t = 0; t <= night.duration; t += 0.05) {
      const grip = night.carAt(t);
      const n = carNose(grip);
      expect(Math.hypot(n.x - ROUND_WINDOW.x, n.y - ROUND_WINDOW.y)).toBeGreaterThan(SHUTTER.r - 1);
      expect(grip.x + 7).toBeLessThan(ROPE.turn.x - ROPE.turn.r);
    }
  });

  test("wheel, hamster and cable car stand exactly still outside the rope's run, and the room is dark all through it (A-43)", () => {
    // Outside `ropeMoving` they are drawn in the room's svg, which a change of a fraction of a pixel would paint again;
    // inside it they are sprites under a veil of their own, which a changing darkness would paint again in every frame.
    const still = (t: number) => ({ turn: night.wheelTurn(t), car: night.carAt(t), step: night.hamsterAt(t).step });
    const before = still(night.tRun);
    const after = still(night.tArrive);
    for (let t = night.tInWheel; t <= night.tHamsterSleep; t += 1 / 60) {
      if (night.ropeMoving(t)) expect(night.dark(t)).toBe(night.dark(night.tArrive));
      else expect(still(t)).toEqual(t <= night.tRun ? before : after);
    }
    expect(night.ropeMoving(night.tRun + 0.01)).toBe(true);
    expect(night.ropeMoving(night.tArrive - 0.01)).toBe(true);
  });

  test("from tCornerStill on, only the pendulum and the chair still move in the reading corner, which holds that moment off the screen (A-43)", () => {
    const corner = (t: number) => ({
      door: night.doorOpen(t),
      bird: night.birdX(t),
      beak: night.beakOpen(t),
      sleep: night.birdSleep(t),
      hand: night.minuteHand(t),
      chain: night.chainSwing(t),
    });
    const held = corner(night.tCornerStill);
    expect(held.door).toBe(0);
    for (let t = night.tCornerStill; t <= night.duration + 5; t += 1 / 30) expect(corner(t)).toEqual(held);
  });

  test("the shutter stays shut until the car bumps it, and the moon rises only once it is open", () => {
    expect(night.shutterTurn(night.tArrive)).toBe(0);
    expect(night.shutterTurn(night.tOpen)).toBeCloseTo(SHUTTER.open);
    expect(night.moonY(night.tOpen)).toBe(MOON.y0);
    expect(night.moonY(night.tOpen + 1)).toBeLessThan(MOON.y0);
    expect(SHUTTER.hingeX + 30).toBeLessThan(WORLD_W);
  });

  test("the moonlight creeps down from the window and reaches the teddy's face when it yawns", () => {
    expect(night.beamY(night.tBeam)).toBe(BEAM_TOP);
    expect(night.tBeam).toBeGreaterThan(night.tMoon + 2);
    expect(Math.abs(night.beamY(night.tYawn) - TEDDY.y)).toBeLessThan(3);
    expect(night.beamY(night.duration)).toBe(CRADLE.bottom);
  });

  test("the camera holds the cage and the whole way of the cable car while it rides", () => {
    for (let t = night.tRun; t < night.tOpen; t += 0.1) {
      const left = night.cameraTarget(t);
      expect(left).toBeLessThan(CAGE.x0);
      expect(left + 1600).toBeGreaterThan(SHUTTER.hingeX + 20);
    }
  });

  test("the moon rises from below the round window into it", () => {
    expect(MOON.y0 - MOON.r).toBeGreaterThan(ROUND_WINDOW.y + ROUND_WINDOW.r);
    const top = night.moonY(night.duration);
    expect(Math.hypot(MOON.x - ROUND_WINDOW.x, top - ROUND_WINDOW.y) + MOON.r).toBeLessThan(ROUND_WINDOW.r);
  });

  test("everyone falls asleep in turn, the last one before the end", () => {
    const order = [night.tTeddy, night.tMoonSleep, night.tHamsterSleep, night.tCuckoo, night.tStar, night.tSheep];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
    expect(night.tSheep).toBeLessThan(night.duration - 1);
    expect(night.tTeddy).toBeGreaterThan(night.tClick);
  });
});
