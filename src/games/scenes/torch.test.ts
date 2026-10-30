import { describe, expect, test } from "bun:test";
import { litItems } from "./torch";
import type { SceneItem } from "./types";

/** Nothing to draw: only the boxes count here. */
const Art = () => null;

const item = (id: string, box: SceneItem["box"], extra: Partial<SceneItem> = {}): SceneItem => ({
  id,
  name: id,
  sentences: [],
  sound: "pop",
  box,
  durationMs: 1000,
  Art,
  ...extra,
});

describe("torch light", () => {
  test("wakes an item under its middle and one just beside it, not one at its dark edge", () => {
    const items = [item("under", [90, 90, 20, 20]), item("beside", [140, 90, 20, 20]), item("edge", [190, 90, 20, 20])];
    expect(litItems(items, 100, 100, 100).map((i) => i.id)).toEqual(["under", "beside"]);
  });

  test("goes by the tap areas where they are, after the placement", () => {
    const crane = item("crane", [0, 0, 400, 400], { hitAreas: [[300, 0, 100, 100]], place: { x: 100, y: 0, scale: 0.5 } });
    expect(litItems([crane], 300, 25, 40)).toEqual([crane]);
    expect(litItems([crane], 120, 150, 40)).toEqual([]);
  });
});
