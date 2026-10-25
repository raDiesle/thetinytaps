import { describe, expect, test } from "@rstest/core";
import { layoutHud } from "./TrailPlay";

describe("the bag and the action button", () => {
  // The screen's free edges in the picture's units: a 16:9 or 16:10 computer, a 4:3 tablet (both the whole
  // picture's width), and a wide phone whose picture leaves room at the sides.
  const screens: [string, number, number, boolean][] = [
    ["computer", 0, 1600, true],
    ["tablet", 0, 1600, false],
    ["phone", -180, 1780, false],
  ];
  for (const [name, left, right, keys] of screens)
    test(`on a ${name} the button is right next to the bag, left of the child`, () => {
      const hud = layoutHud(left, right, keys);
      const [bagX, , bagW] = hud.bagBox;
      const [boxX, , boxW] = hud.actionBox;
      expect(boxX - (bagX + bagW)).toBeLessThanOrEqual(30);
      expect(boxX + boxW).toBeLessThan(hud.kidX - 70);
    });
});
