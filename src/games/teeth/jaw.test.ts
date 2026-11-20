import { describe, expect, test } from "bun:test";
import {
  brushedPoints,
  buildMouth,
  cornerStretch,
  glideStretch,
  insideBy,
  lerpView,
  midLine,
  NO_STRETCH,
  openCorners,
  projectors,
  stretchLips,
  TOOTH_CLEAR,
  toothKey,
  type View,
} from "./jaw";
import { GRIN_VIEW, STEPS } from "./steps";

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

describe("the lips while the head turns or the mouth opens", () => {
  type Zone = (typeof STEPS)[number] | null;
  const stretchAt = (view: View, zone: Zone) => {
    if (!zone) return NO_STRETCH;
    const model = buildMouth(view.open);
    const all = projectors(view);
    return cornerStretch(model.lips.map(all.face.point), brushedPoints(model, all, zone), TOOTH_CLEAR);
  };
  const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
  const width = (lips: { x: number }[]) => Math.max(...lips.map((p) => p.x)) - Math.min(...lips.map((p) => p.x));
  // From the grin before brushing through every step back to the grin at the end, as the mirror glides.
  const stops: { view: View; zone: Zone }[] = [
    { view: GRIN_VIEW, zone: null },
    ...STEPS.map((s) => ({ view: s.view, zone: s })),
    { view: GRIN_VIEW, zone: null },
  ];
  const glides = stops.slice(1).map((to, i) => [`${stops[i].zone?.id ?? "grin"} → ${to.zone?.id ?? "grin"}`, stops[i], to] as const);

  test.each(glides)("%s: the mouth widens or narrows smoothly, never jumps open", (_, from, to) => {
    const start = stretchAt(from.view, from.zone);
    const end = stretchAt(to.view, to.zone);
    const FRAMES = 40;
    const widths = Array.from({ length: FRAMES + 1 }, (_, i) => {
      const k = ease(i / FRAMES);
      const view = lerpView(from.view, to.view, k);
      return width(stretchLips(buildMouth(view.open).lips.map(projectors(view).face.point), glideStretch(start, end, k)));
    });
    // Worked out from each in-between picture, the turn onto the left outside jumped by 76 picture units in one frame.
    const biggest = Math.max(...widths.slice(1).map((w, i) => Math.abs(w - widths[i])));
    expect(biggest).toBeLessThan(12);
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
