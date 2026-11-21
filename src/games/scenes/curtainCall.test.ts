import { describe, expect, test } from "bun:test";
import { BOW_AFTER_MS, BOW_MS, bowFoot, bowOrder, bowStep, curtainEndAt, curtainSoundAt, layerPoint } from "./curtainCall";
import type { SceneItem } from "./types";

const item = (id: string, box: [number, number, number, number], place?: SceneItem["place"]) => ({ id, box, place }) as SceneItem;

describe("the end of a picture (B-21)", () => {
  test("things bow from left to right by the middle of their foot", () => {
    const items = [item("c", [500, 0, 100, 50]), item("a", [0, 0, 300, 50]), item("b", [100, 0, 200, 50], { x: 100, y: 0, scale: 1 })];
    expect(bowOrder(items).map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(bowFoot(items[2])).toEqual([300, 50]);
  });

  test("a few things bow calmly, many quicker, and all bows begin within a few seconds", () => {
    expect(bowStep(1)).toBe(0);
    expect(bowStep(5)).toBe(260);
    for (const count of [12, 35, 42]) {
      expect((count - 1) * bowStep(count)).toBeLessThanOrEqual(3400);
      // Never so quick that the row turns into a blur: each bow still overlaps only a few others.
      expect(BOW_MS / bowStep(count)).toBeLessThan(8);
    }
  });

  test("the sound comes once the last bow is over, the buttons after it", () => {
    expect(curtainSoundAt(1)).toBe(BOW_AFTER_MS + BOW_MS);
    expect(curtainSoundAt(40)).toBeCloseTo(BOW_AFTER_MS + 3400 + BOW_MS);
    expect(curtainEndAt(40)).toBeGreaterThan(curtainSoundAt(40));
    // A toddler waits no longer than about six seconds for the trophy.
    expect(curtainEndAt(42)).toBeLessThan(6500);
  });

  test("a picture point lands where the layer's meet scaling draws it", () => {
    // 1000 × 500 units in a 400 × 400 layer: scale 0.4, 100 px empty above and below.
    expect(layerPoint([500, 500], 1000, 500, 400, 400)).toEqual([200, 300]);
    // In a wide layer the picture is centred sideways.
    expect(layerPoint([0, 0], 1000, 500, 1200, 500)).toEqual([100, 0]);
  });
});
