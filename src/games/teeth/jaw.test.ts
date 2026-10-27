import { describe, expect, test } from "bun:test";
import { insideBy } from "./jaw";

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
