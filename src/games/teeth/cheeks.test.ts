import { describe, expect, test } from "bun:test";
import {
  buildMouth,
  CHEEK_GAP,
  cheekSpots,
  brushedPoints,
  cornerStretch,
  distanceOutside,
  NO_STRETCH,
  projectors,
  stretchLips,
  TOOTH_CLEAR,
  type View,
} from "./jaw";
import { CHEEK, CHEEKS, MOUTH } from "./origin";
import { GRIN_VIEW, STEPS } from "./steps";

// The pink cheeks once lay right on the corners of the open mouth, in the mirror and in the story, and looked odd
// (user feedback, November 2026). They keep a gap of skin to the lips.

/** Points round an ellipse's edge. */
const edge = (x: number, y: number, rx: number, ry: number) =>
  Array.from({ length: 36 }, (_, i) => ({ x: x + rx * Math.cos((i * Math.PI) / 18), y: y + ry * Math.sin((i * Math.PI) / 18) }));

describe("the mirror's cheeks", () => {
  const stops: { name: string; view: View; zone: (typeof STEPS)[number] | null }[] = [
    { name: "grin", view: GRIN_VIEW, zone: null },
    ...STEPS.map((s) => ({ name: s.id, view: s.view, zone: s })),
  ];

  test.each(stops.map((s) => [s.name, s] as const))("%s: no cheek touches the lips", (_, { view, zone }) => {
    const model = buildMouth(view.open);
    const all = projectors(view);
    const raw = model.lips.map(all.face.point);
    const lips = stretchLips(raw, zone ? cornerStretch(raw, brushedPoints(model, all, zone), TOOTH_CLEAR) : NO_STRETCH);
    const cheeks = cheekSpots(all.face, lips);
    // Seen from the front both show; seen from the side at least the near one.
    expect(cheeks.length).toBeGreaterThanOrEqual(view.yaw === 0 ? 2 : 1);
    for (const c of cheeks) {
      const nearest = Math.min(...edge(c.x, c.y, c.rx, c.ry).map((p) => distanceOutside(p, lips)));
      // Half the lip's thick outline (34) and skin between.
      expect(nearest).toBeGreaterThanOrEqual(CHEEK_GAP - 1);
    }
  });
});

test("the story's cheeks keep clear of the mouth's corners, also while they glow bigger", () => {
  const corners = [
    { x: MOUTH.left, y: MOUTH.top },
    { x: MOUTH.right, y: MOUTH.top },
  ];
  const GLOW = 1.25;
  for (const cx of CHEEKS) {
    const nearest = Math.min(...edge(cx, CHEEK.y, CHEEK.rx * GLOW, CHEEK.ry * GLOW).flatMap((p) => corners.map((c) => Math.hypot(p.x - c.x, p.y - c.y))));
    expect(nearest).toBeGreaterThan(14);
  }
});
