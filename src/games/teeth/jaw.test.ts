import { describe, expect, test } from "bun:test";
import {
  brushedPoints,
  buildMouth,
  CHEWING_DEPTHS,
  cornerStretch,
  glideStretch,
  innerGumAt,
  insideBy,
  lerpView,
  midLine,
  MIN_FACING,
  NO_STRETCH,
  openCorners,
  projectors,
  stretchLips,
  TEETH_PER_SIDE,
  TOOTH_CLEAR,
  profileOf,
  toothKey,
  type View,
  viewedLips,
} from "./jaw";
import { GRIN_VIEW, ROAR_VIEW, STEPS } from "./steps";

// From the two broad molars the next three teeth were all equally thin from above, a jump that looked odd (user
// feedback, November 2026): from the last molar to the front tooth the chewing surface narrows step by step.
test("the chewing surfaces narrow step by step from the back to the front", () => {
  const steps = CHEWING_DEPTHS.slice(1).map((d, i) => d - CHEWING_DEPTHS[i]);
  for (const step of steps) expect(step).toBeGreaterThan(0);
  // No step much bigger than the others: the biggest at most twice the smallest.
  expect(Math.max(...steps)).toBeLessThanOrEqual(2 * Math.min(...steps));
});

// The screen is held sideways, so the mouth is drawn wide: a tall open „Aaah“ left most of it to an empty palate and
// drew the teeth small (user request, November 2026).
describe("the mouth fills a screen held sideways", () => {
  const extent = (open: number) => {
    const lips = buildMouth(open).lips;
    const xs = lips.map((p) => p[0]);
    const ys = lips.map((p) => p[1]);
    return { width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
  };

  test("wide open, it is still clearly wider than tall", () => {
    const { width, height } = extent(1);
    expect(width / height).toBeGreaterThan(1.7);
  });

  test("with the teeth together, it is a broad grin", () => {
    const { width, height } = extent(0);
    expect(width / height).toBeGreaterThan(2.8);
  });
});

describe("the teeth being brushed", () => {
  // As the mirror draws them: the step's faces that face the viewer, their line from end to end.
  const brushed = (step: (typeof STEPS)[number]) => {
    const model = buildMouth(step.view.open);
    const all = projectors(step.view);
    const keep = step.teeth.flatMap((id) => {
      const face = model.teeth.find((t) => t.key === toothKey(id))!.faces.find((f) => f.kind === step.surface)!;
      return all[id.jaw].facing(face.normal) > 0.03 ? midLine(face).map(all[id.jaw].point) : [];
    });
    return { lips: viewedLips(model.lips, step.view).map(all.face.point), keep };
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

// Gaps of dark mouth showed between the gum and the lips, most of all seen from the side (user feedback, November 2026):
// the gum's cheek-side wall reaches past the lips, which cut it off, so the gum always runs into them. Round a jaw
// tipped into the open mouth, and beside the arch seen from the side, the inside of the cheek shows (CHEEK_INSIDE in
// mouth.tsx), never the dark of the mouth.
describe("the gum runs into the lips", () => {
  const views: [string, View, (typeof STEPS)[number] | null][] = [
    ["grin", GRIN_VIEW, null],
    ["roar", ROAR_VIEW, null],
    ...STEPS.map((s) => [s.id, s.view, s] as [string, View, (typeof STEPS)[number]]),
  ];

  test.each(views)("%s: every cheek-side wall of gum that shows ends outside the lips", (_, view, zone) => {
    const model = buildMouth(view.open);
    const all = projectors(view);
    const plain = viewedLips(model.lips, view).map(all.face.point);
    const lips = stretchLips(plain, zone ? cornerStretch(plain, brushedPoints(model, all, zone), TOOTH_CLEAR) : NO_STRETCH);
    const inside = model.gums.flatMap((gum) => {
      const wall = gum.faces.find((f) => f.kind === "outer")!;
      // A jaw tipped to show its top or tongue side lies in the open mouth like a model, with cheek round it.
      if (Math.abs(view.tilt[gum.jaw]) >= 0.01 || all[gum.jaw].facing(wall.normal) <= MIN_FACING) return [];
      // The wall's points: its rim along the tooth, then its foot back the other way.
      const feet = wall.points.slice(wall.points.length / 2).map(all[gum.jaw].point);
      return feet.filter((p) => insideBy(p, lips, 0)).map(() => gum.key);
    });
    expect(inside).toEqual([]);
  });
});

describe("the lips while the head turns or the mouth opens", () => {
  type Zone = (typeof STEPS)[number] | null;
  const stretchAt = (view: View, zone: Zone) => {
    if (!zone) return NO_STRETCH;
    const model = buildMouth(view.open);
    const all = projectors(view);
    return cornerStretch(viewedLips(model.lips, view).map(all.face.point), brushedPoints(model, all, zone), TOOTH_CLEAR);
  };
  const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
  const width = (lips: { x: number }[]) => Math.max(...lips.map((p) => p.x)) - Math.min(...lips.map((p) => p.x));
  // From the grin before brushing through the lion's open mouth (X-26) and every step back to the grin at the end, as the mirror glides.
  const stops: { name: string; view: View; zone: Zone }[] = [
    { name: "grin", view: GRIN_VIEW, zone: null },
    { name: "roar", view: ROAR_VIEW, zone: null },
    ...STEPS.map((s) => ({ name: s.id, view: s.view, zone: s })),
    { name: "grin", view: GRIN_VIEW, zone: null },
  ];
  const glides = stops.slice(1).map((to, i) => [`${stops[i].name} → ${to.name}`, stops[i], to] as const);

  test.each(glides)("%s: the mouth widens or narrows smoothly, never jumps open", (_, from, to) => {
    const start = stretchAt(from.view, from.zone);
    const end = stretchAt(to.view, to.zone);
    const FRAMES = 40;
    const frames = Array.from({ length: FRAMES + 1 }, (_, i) => {
      const k = ease(i / FRAMES);
      const view = lerpView(from.view, to.view, k);
      const lips = viewedLips(buildMouth(view.open).lips, view).map(projectors(view).face.point);
      return { plain: width(lips), stretched: width(stretchLips(lips, glideStretch(start, end, k))) };
    });
    const biggest = (widths: number[]) => Math.max(...widths.slice(1).map((w, i) => Math.abs(w - widths[i])));
    // Worked out from each in-between picture, the turn onto the left outside jumped by 76 picture units in one frame.
    // The corners' stretch adds next to nothing to how fast the lips change as the head turns: a turn to the side
    // narrows them by itself, the further the faster.
    expect(biggest(frames.map((f) => f.stretched))).toBeLessThan(biggest(frames.map((f) => f.plain)) + 12);
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

// Seen from the side the lips are seen from the side, and every tooth stays inside the mouth behind them, growing out of
// its gum: front teeth standing out past the lips with no gum looked plainly wrong (user feedback, November 2026).
describe("the mouth seen from the side", () => {
  const sideways = STEPS.filter((s) => Math.abs(s.view.yaw) >= 60);

  test("the outside steps of the back teeth are seen from the side", () => {
    expect(sideways.map((s) => s.id).sort()).toEqual(["outer-left", "outer-right"]);
    for (const step of sideways) expect(profileOf(step.view)).toBe(1);
  });

  test("from the front nothing changes", () => {
    for (const view of [GRIN_VIEW, ROAR_VIEW, ...STEPS.filter((s) => s.view.yaw === 0).map((s) => s.view)]) expect(profileOf(view)).toBe(0);
  });

  test.each(sideways.map((s) => [s.id, s] as const))("%s: the lips end in front of the front teeth, past their gums", (_, step) => {
    const model = buildMouth(step.view.open);
    const lips = viewedLips(model.lips, step.view);
    const middle = lips.filter((p) => Math.abs(p[0]) < 1e-6);
    expect(middle).toHaveLength(2);
    for (const jaw of ["upper", "lower"] as const) {
      const points = model.teeth.filter((t) => t.id.n === 0 && t.id.jaw === jaw).flatMap((t) => t.faces.flatMap((f) => f.points));
      const lip = middle.find((p) => (jaw === "upper" ? p[1] > 0 : p[1] < 0))!;
      expect(lip[2]).toBeGreaterThan(Math.max(...points.map((p) => p[2])) + 5);
      // A band of gum shows between the lip and the crowns.
      if (jaw === "upper") expect(lip[1]).toBeGreaterThan(Math.max(...points.map((p) => p[1])) + 4);
      else expect(lip[1]).toBeLessThan(Math.min(...points.map((p) => p[1])) - 4);
    }
  });
});

// A jaw tipped to show its chewing or tongue side ran straight down the sides like a flat horseshoe (user feedback,
// November 2026): with perspective its back teeth shrink and bend in, as if the row went back into the mouth.
describe("a tipped row goes back into the mouth", () => {
  const tipped = STEPS.filter((s) => Math.abs(s.view.tilt.upper) + Math.abs(s.view.tilt.lower) > 0);
  test.each(tipped.map((s) => [s.id, s] as const))("%s: the back teeth come out smaller than the front teeth", (_, step) => {
    const model = buildMouth(step.view.open);
    const all = projectors(step.view);
    const jaw = Math.abs(step.view.tilt.upper) > 0 ? "upper" : "lower";
    // How long one unit across the face comes out at a tooth: tipping the jaw back or forth never shortens it, so
    // without perspective it would be the same at every tooth.
    const scale = (n: number) => {
      const [x, y, z] = model.teeth.find((t) => t.key === toothKey({ jaw, side: "left", n }))!.center;
      const a = all[jaw].point([x, y, z]);
      const b = all[jaw].point([x + 1, y, z]);
      return Math.hypot(b.x - a.x, b.y - a.y);
    };
    expect(scale(TEETH_PER_SIDE - 1)).toBeLessThan(0.97 * scale(0));
  });
});

// On the tongue side the gum's edge ran up into a papilla between every two teeth, which showed as odd spikes where the
// gum meets the palate and the tongue (user feedback, November 2026): there it is one smooth arc along the whole row.
describe("the gum on the tongue side", () => {
  // From the middle of the front teeth to past the last molar (beyond it the edge stays as it is).
  const along = Array.from({ length: 400 }, (_, i) => (i / 399) * 120);

  test.each(["upper", "lower"] as const)("%s jaw: its edge runs as one arc, never up and down between the teeth", (jaw) => {
    for (const open of [0, ROAR_VIEW.open]) {
      const heights = along.map((t) => innerGumAt(jaw, t, open).rim);
      const steps = heights.slice(1).map((h, i) => h - heights[i]);
      const moving = steps.filter((d) => Math.abs(d) > 1e-9);
      const turns = moving.slice(1).filter((d, i) => Math.sign(d) !== Math.sign(moving[i])).length;
      // The edge follows the teeth's heights, so it may turn at a tooth's middle – never up into a papilla and down
      // again between two teeth, which would turn it twice for every tooth.
      expect(turns).toBeLessThanOrEqual(TEETH_PER_SIDE - 2);
      // No jump anywhere: from one sample to the next it moves only a little.
      expect(Math.max(...steps.map(Math.abs))).toBeLessThan(0.5);
    }
  });
});
