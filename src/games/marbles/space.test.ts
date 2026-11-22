import { describe, expect, test } from "bun:test";
import {
  BUGGY,
  buildSpace,
  CAPSULE,
  CAPSULE_X,
  FLOOR,
  HILLS,
  HUT,
  INTERCOM,
  KANGAROO_SPOTS,
  LEVER,
  leverKnob,
  MOON,
  PLANETS,
  planetSpot,
  RADIO,
  ROCK,
  SAT,
  SCOPE,
  scopeTip,
  UFO_BELOW,
  WORLD_W,
} from "./space";

describe("Raketenstart", () => {
  const space = buildSpace();

  test("the machine runs about a minute and ends after everything else", () => {
    expect(space.duration).toBeGreaterThan(56);
    expect(space.duration).toBeLessThan(64);
    expect(Math.max(...space.events.map((e) => e.at))).toBe(space.duration);
    expect(space.events.filter((e) => e.done)).toHaveLength(1);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      space.tRobot,
      space.tPush,
      space.tBump,
      space.tDoor,
      space.tExit,
      ...space.hopTimes,
      space.tPedal,
      ...space.lampTimes,
      ...space.waveTimes,
      space.tSatWake,
      space.tCapsule,
      space.tChute,
      space.tLand,
      space.tPuff,
      space.tSpin,
      space.tScope,
      space.tSettle,
      space.tAppear,
      space.tArrive,
      space.tBeam,
      space.tGrab,
      space.tRelease,
      space.tLever,
      space.tOff,
      space.tWake,
      ...space.tCount,
      space.tIgnite,
      space.tLift,
      space.tMoonIn,
      space.tMoonLand,
      space.tFlag,
      space.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("the earth really reaches the telescope, and nothing moves it before", () => {
    const earth = planetSpot(PLANETS[0], space.spinAt(space.tScope));
    const tip = scopeTip(SCOPE.rest);
    expect(Math.hypot(earth.x - tip.x, earth.y - tip.y)).toBeLessThanOrEqual(PLANETS[0].r * earth.scale + SCOPE.lens + 1);
    expect(space.scopeAngle(space.tScope - 0.01)).toBe(SCOPE.rest);
    expect(space.scopeAngle(-1)).toBe(SCOPE.rest);
  });

  test("the spinning telescope stays clear of the ground and of the turning earth, and ends up pointing at the sky", () => {
    for (let t = space.tScope; t < space.tScope + 4; t += 0.01) {
      const angle = space.scopeAngle(t);
      const tip = scopeTip(angle);
      expect(tip.y + SCOPE.lens).toBeLessThan(FLOOR);
      if (t > space.tScope + 0.15) {
        const earth = planetSpot(PLANETS[0], space.spinAt(t));
        expect(Math.hypot(earth.x - tip.x, earth.y - tip.y)).toBeGreaterThan(PLANETS[0].r * earth.scale + SCOPE.lens);
      }
    }
    expect(scopeTip(space.scopeAngle(space.tAppear)).y).toBeLessThan(SCOPE.pivot.y - 60);
  });

  test("the UFO comes only after the telescope points up, stays in the sky over the site, and is gone again before the end", () => {
    expect(space.ufoAt(space.tAppear - 0.01)).toBeNull();
    expect(space.ufoAt(space.tGone)).toBeNull();
    expect(space.tGone).toBeLessThan(space.duration);
    for (let t = space.tAppear; t < space.tLeave; t += 0.05) {
      const ufo = space.ufoAt(t);
      expect(ufo).not.toBeNull();
      expect(ufo?.pt.x ?? -1).toBeGreaterThan(0);
      expect(ufo?.pt.x ?? WORLD_W + 1).toBeLessThan(WORLD_W);
      expect(ufo?.pt.y ?? -1).toBeGreaterThan(120);
      expect(ufo?.pt.y ?? FLOOR).toBeLessThan(FLOOR - 250);
    }
  });

  test("the moon rock lies still until the beam, floats up under the UFO, and falls right onto the switch's knob", () => {
    expect(space.rockAt(-1).pt).toEqual({ x: ROCK.x, y: FLOOR - ROCK.r });
    expect(space.rockAt(space.tBeam - 0.01).pt).toEqual({ x: ROCK.x, y: FLOOR - ROCK.r });
    const ufo = space.ufoAt(space.tGrab + 1);
    const rock = space.rockAt(space.tGrab + 1).pt;
    expect(Math.abs(rock.x - (ufo?.pt.x ?? 0))).toBeLessThan(1);
    expect(rock.y).toBeGreaterThan((ufo?.pt.y ?? 0) + UFO_BELOW);
    const knob = leverKnob(LEVER.rest);
    const hit = space.rockAt(space.tLever - 1e-4).pt;
    expect(Math.hypot(hit.x - knob.x, hit.y - knob.y)).toBeLessThan(LEVER.knob + ROCK.r + 2);
    expect(space.leverTilt(space.tLever - 0.01)).toBe(LEVER.rest);
    for (let t = 0; t <= space.duration; t += 0.05) {
      const { pt } = space.rockAt(t);
      expect(pt.y + ROCK.r).toBeLessThanOrEqual(FLOOR + 0.01);
      expect(pt.x).toBeGreaterThan(0);
      expect(pt.x).toBeLessThan(WORLD_W);
    }
  });

  test("the buggy's bumper reaches the intercom's button, between the hills and the glass dome", () => {
    const { pt } = space.buggyAt(space.tBump);
    expect(pt.x + BUGGY.nose).toBeCloseTo(INTERCOM.x - INTERCOM.post / 2 - 2 * INTERCOM.r, 5);
    expect(pt.y).toBe(FLOOR);
    expect(Math.abs(FLOOR - BUGGY.bumper - INTERCOM.y)).toBeLessThan(INTERCOM.r);
    expect(INTERCOM.x - 60).toBeGreaterThan(HILLS[HILLS.length - 1].x + HILLS[HILLS.length - 1].w / 2);
    expect(INTERCOM.x + 40).toBeLessThan(HUT.x - HUT.r);
  });

  test("the kangaroo sleeps in its dome until the button is pressed, comes out through the tunnel and hops onto the pedal", () => {
    expect(space.kangarooAt(space.tBump).awake).toBe(false);
    expect(space.kangarooAt(space.tBump).pt).toEqual(KANGAROO_SPOTS[0]);
    expect(space.hatchAt(space.tExit)).toBe(1);
    // It is never anywhere it couldn't be: in the tunnel it keeps low enough to fit through.
    let last = space.kangarooAt(0).pt;
    for (let t = 0; t <= space.duration; t += 1 / 120) {
      const { pt } = space.kangarooAt(t);
      expect(Math.hypot(pt.x - last.x, pt.y - last.y)).toBeLessThan(16);
      if (pt.x > HUT.tunnel0 - 40 && pt.x < HUT.x1) expect(FLOOR - pt.y).toBeLessThan(HUT.door - 116);
      expect(pt.y - 120).toBeGreaterThan(0);
      expect(pt.y).toBeLessThanOrEqual(FLOOR);
      last = pt;
    }
    const onPedal = space.kangarooAt(space.tPedal).pt;
    expect(onPedal.x).toBe(RADIO.pedal);
    expect(onPedal.y).toBe(FLOOR - RADIO.pedalH);
    expect(space.pedalAt(space.tPedal - 0.01)).toBe(0);
    expect(space.kangarooAt(space.duration).pt.y).toBe(FLOOR - RADIO.pedalH + RADIO.press);
  });

  test("the radio waves go from the antenna up to the satellite, which sleeps until the last one gets there", () => {
    expect(space.waveAt(space.waveTimes[0] - 0.01)).toHaveLength(0);
    const last = space.waveTimes[space.waveTimes.length - 1];
    const end = space.waveAt(space.tSatWake - 1e-4);
    expect(Math.hypot(end[end.length - 1].pt.x - SAT.x, end[end.length - 1].pt.y - SAT.y)).toBeLessThan(2);
    expect(space.waveAt(last).at(-1)?.pt).toEqual({ x: RADIO.x, y: RADIO.top });
    expect(space.satAt(space.tSatWake - 0.01)).toEqual({ awake: false, wings: 0 });
    expect(space.satAt(space.tCapsule).wings).toBe(1);
  });

  test("the capsule hangs under the satellite until it wakes, floats down on its parachute and lands between the mast and the earth", () => {
    expect(space.capsuleAt(space.tCapsule - 0.01).pt.x).toBe(SAT.x);
    expect(space.capsuleAt(space.tChute - 0.01).chute).toBe(0);
    expect(space.capsuleAt(space.tLand).pt).toEqual({ x: CAPSULE_X, y: FLOOR });
    let last = space.capsuleAt(0).pt;
    for (let t = 0; t <= space.duration; t += 1 / 120) {
      const { pt, chute } = space.capsuleAt(t);
      expect(Math.hypot(pt.x - last.x, pt.y - last.y)).toBeLessThan(16);
      expect(pt.y).toBeLessThanOrEqual(FLOOR);
      // The open parachute stays in the sky.
      expect(pt.y - CAPSULE.h - 200 * chute).toBeGreaterThan(-20);
      last = pt;
    }
    const earth = planetSpot(PLANETS[0], 0);
    expect(CAPSULE_X - CAPSULE.half).toBeGreaterThan(RADIO.x + 60);
    expect(CAPSULE_X + CAPSULE.half + 40).toBeLessThan(earth.x - PLANETS[0].r);
  });

  test("the capsule's puff of air reaches the earth just as the mobile starts to turn, and nothing turns it before", () => {
    expect(space.spinAt(space.tSpin - 0.01)).toBe(0);
    expect(space.spinAt(space.tSpin + 0.5)).toBeGreaterThan(0);
    expect(space.puffAt(space.tPuff - 0.01)).toBeNull();
    const puff = space.puffAt(space.tSpin - 1e-4);
    const earth = planetSpot(PLANETS[0], 0);
    expect(Math.abs((puff?.pt.x ?? 0) - (earth.x - PLANETS[0].r))).toBeLessThan(12);
    expect(Math.abs((puff?.pt.y ?? 0) - earth.y)).toBeLessThan(2);
  });

  test("after liftoff the rocket, small far away, lands right on top of the moon", () => {
    expect(space.miniRocketAt(space.tMoonIn - 0.01)).toBeNull();
    expect(space.miniRocketAt(space.tMoonLand)?.pt).toEqual({ x: MOON.x, y: MOON.y - MOON.r });
    expect(space.flagAt(space.tFlag)).toBe(0);
    expect(space.flagAt(space.duration)).toBe(1);
    const left = space.cameraTarget(space.duration);
    expect(MOON.x - MOON.r).toBeGreaterThan(left + 60);
    expect(MOON.x + MOON.r).toBeLessThan(left + 1600 - 60);
  });

  test("the camera keeps the kangaroo, the satellite and the falling capsule in sight", () => {
    const inView = (t: number, x: number) => {
      const left = space.cameraTarget(t);
      expect(x).toBeGreaterThan(left + 60);
      expect(x).toBeLessThan(left + 1600 - 60);
    };
    for (let t = space.tBump; t < space.tPedal; t += 0.1) inView(t, space.kangarooAt(t).pt.x);
    for (let t = space.tPedal; t < space.tSpin; t += 0.1) {
      inView(t, SAT.x);
      inView(t, space.capsuleAt(t).pt.x);
    }
    for (let t = space.tPedal; t < space.tSatWake; t += 0.1) inView(t, RADIO.x);
  });

  test("the camera never looks past the ends of the launch site", () => {
    for (let t = -1; t <= space.duration; t += 0.1) {
      expect(space.cameraTarget(t)).toBeGreaterThanOrEqual(0);
      expect(space.cameraTarget(t)).toBeLessThanOrEqual(WORLD_W - 1600);
    }
  });
});
