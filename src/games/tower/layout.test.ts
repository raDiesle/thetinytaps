import { describe, expect, test } from "bun:test";
import { DRESSINGS, dressingOf, FLOORS, floorOf, placeOf } from "./floors";
import {
  cameraAt,
  cameraAtRoof,
  feetAt,
  flagTop,
  floorTop,
  hangingAt,
  houseLayout,
  KID,
  lookRange,
  OVERHANG,
  PLUS,
  plusAt,
  roofTop,
  slotAt,
  wholeHouse,
} from "./layout";
import { ROW, TOTAL } from "./names";

// The house spans the screen's width, a floor of ten blocks at a time, and the camera follows it up: on every screen –
// a phone on its side and upright, a tablet, a computer – the floor being built, its hanging block and the child stand
// in view, the plus for the next row beside it, and the whole house fits at the end.
const SCREENS = [
  [844, 390],
  [640, 360],
  [390, 844],
  [1024, 768],
  [1280, 720],
  [1920, 1080],
] as const;

describe.each(SCREENS)("%i × %i", (w, h) => {
  // The book's paper margin over the picture's edges, as `--frame` in book.css.
  const frame = w >= 900 && h >= 600 ? 16 : 10;
  const l = houseLayout(w, h, frame);

  test("a floor with its ledge, the beam's overhang and the plus beside it lies on the screen", () => {
    expect(l.beamLeft).toBeGreaterThanOrEqual(frame);
    const plus = plusAt(l, 1);
    expect(plus.x - (PLUS * l.s) / 2).toBeGreaterThanOrEqual(l.x0 + (ROW + OVERHANG) * l.s);
    expect(plus.x + (PLUS * l.s) / 2).toBeLessThanOrEqual(w - frame);
  });

  test("the blocks are big: a floor uses nearly the whole width, or a fifth of the screen's height", () => {
    // User feedback, 25 November 2026: bigger blocks. A landscape phone had 63 px with the elevator panel.
    expect(l.s).toBeGreaterThanOrEqual(Math.min(0.08 * w, 0.2 * h) - 0.5);
    if (w === 844) expect(l.s).toBeGreaterThanOrEqual(70);
  });

  test("swiping along the house reaches the meadow and back, never past the world", () => {
    for (let f = 0; f < ROW; f++) {
      const { top, bottom } = lookRange(l, f);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThanOrEqual(cameraAt(l, f));
      expect(bottom).toBeGreaterThanOrEqual(cameraAt(l, f));
      expect(bottom + h).toBeLessThanOrEqual(l.worldH + 0.01);
    }
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
  test("ten floors, each looking different", () => {
    expect(FLOORS).toHaveLength(ROW);
    expect(new Set(FLOORS.map((f) => f.pattern)).size).toBe(ROW);
    expect(new Set(FLOORS.map((f) => f.colors[0])).size).toBe(ROW);
    for (let n = 1; n <= TOTAL; n++) expect(floorOf(n) * ROW + placeOf(n)).toBe(n);
  });

  test("no block looks like another: a floor's ten wear ten dressings, each unlike its neighbours and the one below", () => {
    // User feedback, 25 November 2026: no box may repeat its look.
    const looks = new Set<string>();
    for (let n = 1; n <= TOTAL; n++) {
      const floor = FLOORS[floorOf(n)];
      looks.add(`${floor.pattern} ${dressingOf(n)}`);
      if (placeOf(n) > 1) expect(dressingOf(n), `${n}`).not.toBe(dressingOf(n - 1));
      if (n > ROW) expect(dressingOf(n), `${n}`).not.toBe(dressingOf(n - ROW));
    }
    expect(looks.size).toBe(TOTAL);
    for (let f = 0; f < ROW; f++) {
      expect(new Set(Array.from({ length: ROW }, (_, i) => dressingOf(f * ROW + i + 1))).size).toBe(ROW);
    }
    // Every dressing is worn somewhere.
    expect(new Set(Array.from({ length: TOTAL }, (_, i) => dressingOf(i + 1))).size).toBe(DRESSINGS.length);
  });
});
