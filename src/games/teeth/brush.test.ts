import { describe, expect, test } from "bun:test";
import { BOXES, drawOrder, FOAM, FOAM_EDGE, FOAM_FIRST, SIZE, turnLeft, type Facing } from "./brush";

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

describe("brush size", () => {
  // A bigger brush hid the teeth being brushed and their monsters (user feedback, November 2026, asked twice).
  test("the brush stays small, about a milk molar's head", () => {
    expect(SIZE).toBeLessThanOrEqual(0.75);
  });
});

// Even white balls with a thick blue ring were too loud on the brush (user feedback, November 2026): the foam is faint
// flecks unlike each other – clumps, clear bubbles and tiny dots of different sizes – with a pale edge.
describe("the brush's foam", () => {
  test("its flecks come in every kind and many sizes", () => {
    expect(new Set(FOAM.map((f) => f.kind))).toEqual(new Set(["clump", "bubble", "dot"]));
    expect(new Set(FOAM.map((f) => f.r)).size).toBeGreaterThanOrEqual(FOAM.length - 2);
    expect(Math.max(...FOAM.map((f) => f.r))).toBeGreaterThanOrEqual(2.5 * Math.min(...FOAM.map((f) => f.r)));
  });

  // Twelve flecks were too many, seven then a little too few (user requests, November 2026).
  test("it is a few flecks, a little more than at first", () => {
    expect(FOAM.length).toBe(10);
    expect(FOAM_FIRST).toBe(3);
  });

  test("it is small and its edge pale", () => {
    for (const f of FOAM) expect(f.r).toBeLessThanOrEqual(3.5);
    const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(FOAM_EDGE.slice(i, i + 2), 16));
    expect(Math.min(r, g, b)).toBeGreaterThanOrEqual(0xc8);
  });
});

// On the sides the brush circles counter-clockwise on the screen (user request, November 2026).
test("the brush circles counter-clockwise on the screen", async () => {
  const css = await Bun.file("src/games/teeth/teeth.css").text();
  // The second swing runs a quarter of the circle ahead of the first.
  expect(css).toMatch(/\.brush-move\.circle > \.brush-move-across \{[^}]*calc\(var\(--brush-s\) \/ -4\)/);
  const swings = [
    [
      { x: 11, y: 0 },
      { x: 0, y: 6 },
    ],
    [
      { x: 11, y: 0 },
      { x: 0, y: -6 },
    ],
    [
      { x: -3, y: 9 },
      { x: 8, y: 2 },
    ],
    [
      { x: 4, y: -7 },
      { x: 5, y: 3 },
    ],
  ];
  for (const [first, raw] of swings) {
    const second = turnLeft(first, raw);
    const at = (t: number) => {
      const [a, b] = [Math.cos(2 * Math.PI * t), Math.cos(2 * Math.PI * (t + 0.25))];
      return { x: a * first.x + b * second.x, y: a * first.y + b * second.y };
    };
    let area = 0;
    for (let i = 0; i < 40; i++) {
      const [p, q] = [at(i / 40), at((i + 1) / 40)];
      area += p.x * q.y - q.x * p.y;
    }
    // With the screen's y pointing down, a counter-clockwise path has a negative area.
    expect(area).toBeLessThan(0);
  }
});
