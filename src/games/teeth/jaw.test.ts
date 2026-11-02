import { describe, expect, test } from "bun:test";
import { buildMouth, insideBy, midLine, openCorners, projectors, TOOTH_CLEAR, toothKey } from "./jaw";
import { STEPS } from "./steps";

describe("the teeth being brushed", () => {
  // As the mirror draws them: the step's faces that face the viewer, their line from end to end.
  const brushed = (step: (typeof STEPS)[number]) => {
    const model = buildMouth(step.view.open);
    const all = projectors(step.view);
    const keep = step.teeth.flatMap((id) => {
      const face = model.teeth.find((t) => t.key === toothKey(id))!.faces.find((f) => f.kind === step.surface)!;
      return all[id.jaw].facing(face.normal) > 0.03 ? midLine(face).map(all[id.jaw].point) : [];
    });
    return { lips: model.lips.map(all.face.point), keep };
  };

  test.each(STEPS.map((s) => [s.id, s] as const))("%s: all of them show inside the lips, none behind a corner of the mouth", (_, step) => {
    const { lips, keep } = brushed(step);
    expect(keep.length).toBeGreaterThan(0);
    const opened = openCorners(lips, keep, TOOTH_CLEAR);
    expect(keep.filter((p) => !insideBy(p, opened, TOOTH_CLEAR))).toEqual([]);
  });

  test("seen from the side, the near corner of the mouth would hide the back teeth without opening", () => {
    const { lips, keep } = brushed(STEPS.find((s) => s.id === "outer-left")!);
    expect(keep.some((p) => !insideBy(p, lips, TOOTH_CLEAR))).toBe(true);
  });
});

describe("insideBy", () => {
  const square = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];

  test("the middle is inside, also with a margin", () => {
    expect(insideBy({ x: 50, y: 50 }, square, 20)).toBe(true);
  });

  test("near the edge counts as on the lip, not inside", () => {
    expect(insideBy({ x: 95, y: 50 }, square, 0)).toBe(true);
    expect(insideBy({ x: 95, y: 50 }, square, 15)).toBe(false);
  });

  test("outside stays outside", () => {
    expect(insideBy({ x: 150, y: 50 }, square, 0)).toBe(false);
  });
});
