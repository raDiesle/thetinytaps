import { describe, expect, test } from "bun:test";
import { FLOORS, floorOf, placeOf, specialOf } from "./floors";
import { cameraAt, cameraAtRoof, feetAt, flagTop, floorTop, hangingAt, houseLayout, KID, OVERHANG, roofTop, slotAt, wholeHouse } from "./layout";
import { ROW, TOTAL } from "./names";

// The house spans the screen's width, a floor of ten blocks at a time, and the camera follows it up: on every screen –
// a phone on its side and upright, a tablet, a computer – the floor being built, its hanging block and the child stand
// in view, clear of the elevator panel, and the whole house fits at the end.
const SCREENS = [
  [844, 390],
  [640, 360],
  [390, 844],
  [1024, 768],
  [1280, 720],
  [1920, 1080],
] as const;

describe.each(SCREENS)("%i × %i", (w, h) => {
  const l = houseLayout(w, h);

  test("a floor with its ledge and the beam's overhang lies on the screen, left of the panel", () => {
    expect(l.beamLeft).toBeGreaterThanOrEqual(0);
    expect(l.x0 + (ROW + OVERHANG) * l.s).toBeLessThanOrEqual(l.panel.left);
    expect(l.panel.left + l.panel.width).toBeLessThanOrEqual(w);
  });

  test("the blocks are big: a floor uses most of the width, or a fifth of the screen's height", () => {
    expect(l.s).toBeGreaterThanOrEqual(Math.min(0.06 * w, 0.2 * h) - 0.5);
    if (w === 844) expect(l.s).toBeGreaterThanOrEqual(55);
  });

  test("on every floor the hanging block, the child's head and the floor's top are on the screen", () => {
    for (let f = 0; f < ROW; f++) {
      const cam = cameraAt(l, f);
      expect(cam).toBeGreaterThanOrEqual(0);
      expect(cam + h).toBeLessThanOrEqual(l.worldH + 0.01);
      for (let k = 1; k <= ROW; k++) {
        const top = hangingAt(l, f, k).y - l.s / 2 - cam;
        expect(top, `floor ${f} block ${k}`).toBeGreaterThan(0);
        expect(slotAt(l, f, k).y + l.s / 2 - cam, `floor ${f} slot ${k}`).toBeLessThanOrEqual(h);
      }
      for (let k = 0; k <= ROW; k++) {
        const head = feetAt(l, f, k).y - KID * l.s - cam;
        expect(head, `floor ${f} child ${k}`).toBeGreaterThan(0);
      }
      expect(floorTop(l, f) - cam).toBeLessThan(h);
    }
  });

  test("the roof going on and its flag are seen", () => {
    const cam = cameraAtRoof(l);
    expect(flagTop(l) - cam).toBeGreaterThanOrEqual(0);
    expect(roofTop(l) - cam).toBeLessThan(h);
  });

  test("the whole house fits at the end, the backdrop round it", () => {
    const { scale, x, y } = wholeHouse(l);
    expect(scale).toBeGreaterThan(0);
    expect(y + scale * (flagTop(l) - 0.3 * l.s)).toBeGreaterThanOrEqual(0);
    expect(y + scale * l.ground).toBeLessThanOrEqual(h);
    expect(x + scale * (l.beamLeft - 0.3 * l.s)).toBeGreaterThanOrEqual(0);
    expect(x + scale * (l.x0 + (ROW + 0.5) * l.s)).toBeLessThanOrEqual(w);
    // The backdrop reaches from -1.5 w to 2.5 w and from the world's top to 3 h below it.
    expect(x + scale * -1.5 * w).toBeLessThanOrEqual(0);
    expect(x + scale * 2.5 * w).toBeGreaterThanOrEqual(w);
    expect(y).toBeLessThanOrEqual(0);
    expect(y + scale * (l.worldH + 3 * h)).toBeGreaterThanOrEqual(h);
  });
});

describe("floors", () => {
  test("ten floors, each looking different, each with something of the house in it", () => {
    expect(FLOORS).toHaveLength(ROW);
    expect(new Set(FLOORS.map((f) => f.pattern)).size).toBe(ROW);
    expect(new Set(FLOORS.map((f) => f.colors[0])).size).toBe(ROW);
    for (const floor of FLOORS) {
      const specials = Object.keys(floor.specials).map(Number);
      expect(specials.length).toBeGreaterThanOrEqual(2);
      // The tenth block of a floor is always plain: it comes down slowly to the drum roll and the beam follows it.
      for (const k of specials) expect(k >= 1 && k < ROW).toBe(true);
    }
  });

  test("the front door is on the ground floor, every number has its floor and place", () => {
    expect(Object.values(FLOORS[0].specials)).toContain("door");
    for (let n = 1; n <= TOTAL; n++) {
      expect(floorOf(n) * ROW + placeOf(n)).toBe(n);
    }
    expect(specialOf(5)).toBe("door");
  });
});
