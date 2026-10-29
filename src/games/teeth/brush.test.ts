import { describe, expect, test } from "bun:test";
import { BOXES, drawOrder, type Facing } from "./brush";

// The bristle tufts stand on the bristle side of the head (b above -11), the head, neck and handle behind them.
const isTuft = (i: number) => BOXES[i].b[0] >= -11;
const isHandle = (i: number) => BOXES[i].u[0] >= 22;

/** Where in the drawing order each box comes. */
const places = (facing: Facing) => {
  const order = drawOrder(BOXES, facing);
  return BOXES.map((_, i) => order.indexOf(i));
};

describe("brush drawing order", () => {
  test("every box is drawn once", () => {
    expect([...drawOrder(BOXES, { u: 0.3, w: -0.2, b: 0.5 })].sort((a, b) => a - b)).toEqual(BOXES.map((_, i) => i));
  });

  test("every two boxes lie apart along one of the brush's axes", () => {
    for (const [i, a] of BOXES.entries())
      for (const b of BOXES.slice(i + 1)) {
        const apart = (["u", "w", "b"] as const).some((axis) => a[axis][1] <= b[axis][0] || b[axis][1] <= a[axis][0]);
        expect(apart).toBe(true);
      }
  });

  /** Pairs of a tuft and a part of the head right behind it (side by side along the handle and across the head). */
  const backed = BOXES.flatMap((tuft, i) =>
    BOXES.flatMap((head, j) =>
      isTuft(i) && !isTuft(j) && !isHandle(j) && tuft.u[0] < head.u[1] && head.u[0] < tuft.u[1] && tuft.w[0] < head.w[1] && head.w[0] < tuft.w[1]
        ? [[i, j]]
        : [],
    ),
  );

  // Seen from the back of the head, along the head, the far tufts' middles are nearer than the long head's middle:
  // sorted by their middles they showed through the plastic.
  test("seen from the back of the head, the plastic covers the bristles behind it", () => {
    expect(backed.length).toBeGreaterThan(BOXES.filter((_, i) => isTuft(i)).length - 1);
    for (const u of [-0.9, -0.4, 0, 0.4, 0.9]) {
      const at = places({ u, w: 0.2, b: -0.3 });
      for (const [tuft, head] of backed) expect(at[tuft]).toBeLessThan(at[head]);
    }
  });

  test("seen from the bristle side, the bristles cover the head", () => {
    for (const u of [-0.9, 0, 0.9]) {
      const at = places({ u, w: -0.2, b: 0.6 });
      for (const [tuft, head] of backed) expect(at[head]).toBeLessThan(at[tuft]);
    }
  });

  test("with the handle towards the viewer, it covers the head and the bristles", () => {
    const at = places({ u: 0.9, w: 0.1, b: -0.4 });
    expect(Math.max(...at.filter((_, i) => !isHandle(i)))).toBeLessThan(Math.min(...at.filter((_, i) => isHandle(i))));
  });
});
