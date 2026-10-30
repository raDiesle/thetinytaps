import { describe, expect, test } from "bun:test";
import { addPoint, bendTo, laneLength, poseAt, POINT_STEP, vehicleTransform, type Point } from "./lanes";

describe("drawn roads", () => {
  test("a point closer than a step to the last one is left out", () => {
    const points: Point[] = [[0, 0]];
    expect(addPoint(points, [POINT_STEP / 2, 0])).toBe(points);
    expect(addPoint(points, [POINT_STEP, 0])).toEqual([
      [0, 0],
      [POINT_STEP, 0],
    ]);
  });

  test("a vehicle follows the road exactly, round the bend, and stops at its end", () => {
    const corner: Point[] = [
      [0, 0],
      [100, 0],
      [100, 100],
    ];
    expect(laneLength(corner)).toBe(200);
    expect(poseAt(corner, 50)).toMatchObject({ x: 50, y: 0, angle: 0 });
    expect(poseAt(corner, 150)).toMatchObject({ x: 100, y: 50, angle: Math.PI / 2 });
    expect(poseAt(corner, 999)).toMatchObject({ x: 100, y: 100 });
  });

  test("a vehicle going left is mirrored, never upside down", () => {
    expect(vehicleTransform({ x: 10, y: 900, angle: Math.PI })).toContain("scale(-");
    expect(vehicleTransform({ x: 10, y: 900, angle: 0 })).not.toContain("scale(-");
  });

  test("a key's road runs from the vehicle to the item in even steps", () => {
    const road = bendTo([100, 900], [1200, 500]);
    expect(road[0]).toEqual([100, 900]);
    expect(road[road.length - 1]).toEqual([1200, 500]);
    for (let i = 1; i < road.length; i++) expect(Math.hypot(road[i][0] - road[i - 1][0], road[i][1] - road[i - 1][1])).toBeLessThan(POINT_STEP * 1.5);
  });
});
