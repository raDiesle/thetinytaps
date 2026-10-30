import { describe, expect, test } from "bun:test";
import { buildSpace, FLOOR, LEVER, leverKnob, PLANETS, planetSpot, ROCK, SCOPE, scopeTip, UFO_BELOW, WORLD_W } from "./space";

describe("Raketenstart", () => {
  const space = buildSpace();

  test("the machine runs about forty seconds and ends after everything else", () => {
    expect(space.duration).toBeGreaterThan(39);
    expect(space.duration).toBeLessThan(43);
    expect(Math.max(...space.events.map((e) => e.at))).toBe(space.duration);
    expect(space.events.filter((e) => e.done)).toHaveLength(1);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      space.tRobot,
      space.tPush,
      space.tBump,
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

  test("the camera never looks past the ends of the launch site", () => {
    for (let t = -1; t <= space.duration; t += 0.1) {
      expect(space.cameraTarget(t)).toBeGreaterThanOrEqual(0);
      expect(space.cameraTarget(t)).toBeLessThanOrEqual(WORLD_W - 1600);
    }
  });
});
