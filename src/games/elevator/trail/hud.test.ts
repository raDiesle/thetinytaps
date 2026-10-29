import { describe, expect, test } from "bun:test";
import { layoutHud, type Screen } from "./TrailPlay";

describe("the bag and the action button", () => {
  // The screen's free edges in the picture's units (1600 × 900, under a bar of 56 px): a 16:9 computer, a 4:3
  // tablet (the whole picture's width, and room above and below), and a wide phone whose picture leaves room at the
  // sides.
  const screens: [string, Screen, boolean][] = [
    ["computer", { left: -52, right: 1652, top: -50, bottom: 910 }, true],
    ["tablet", { left: -16, right: 1616, top: -200, bottom: 1023 }, false],
    ["phone", { left: -351, right: 1951, top: -153, bottom: 911 }, false],
  ];
  for (const [name, screen, keys] of screens) {
    const hud = layoutHud(screen, keys);
    const [bagX, bagTop, bagW, bagH] = hud.bagBox;
    const [boxX, boxTop, , boxH] = hud.actionBox;
    // Where a point of the frames as drawn lands on the screen: their bottom-left corner goes to `corner`, zoomed.
    const onScreen = (x: number, y: number) => [hud.corner[0] + (x - bagX) * hud.zoom, hud.corner[1] + (y - bagTop - bagH) * hud.zoom];
    const [bagLeft, top] = onScreen(bagX, Math.min(bagTop, boxTop));
    const [bagRight] = onScreen(bagX + bagW, 0);
    const [boxLeft, low] = onScreen(boxX, Math.max(bagTop + bagH, boxTop + boxH));

    test(`on a ${name} the button is right next to the bag, along the screen's bottom edge`, () => {
      expect(boxLeft - bagRight).toBeLessThanOrEqual(40);
      expect(bagLeft).toBeGreaterThanOrEqual(screen.left);
      expect(low).toBeLessThanOrEqual(screen.bottom);
      expect(low).toBeGreaterThan(screen.bottom - 40);
    });

    test(`on a ${name} the child walks above bag and button, with the way ahead in sight`, () => {
      const [x, feet] = hud.feet;
      expect(feet).toBeLessThan(top);
      expect((screen.right - x) / hud.zoom).toBeGreaterThanOrEqual(830);
      expect((x - screen.left) / hud.zoom).toBeGreaterThanOrEqual(270);
      // Not more sky than needed: a tablet zooms in instead of showing a sky taller than the way is wide ahead.
      expect((feet - screen.top) / hud.zoom).toBeLessThan(800);
    });
  }
});
