import { describe, expect, test } from "bun:test";
import { CLIP_GROUPS, CLIP_IDS, clipFocus, clipPose, TAP_HIT, TAP_PERIOD } from ".";

describe("motion clips", () => {
  // The groups are spread into one table, so a clip in two files would silently lose one of them.
  test("every clip is in exactly one body-part file", () => {
    const grouped = Object.values(CLIP_GROUPS).flatMap((group) => Object.keys(group));
    expect(grouped.length).toBe(CLIP_IDS.length);
  });

  // User feedback, November 2026: the waiting arm jumped up whenever the other paw had tapped.
  test("tapping, the arms flow from one paw to the other without a jump", () => {
    const dt = 1 / 120;
    let before = clipPose("tap_forward", 0);
    for (let t = dt; t < 4 * TAP_PERIOD; t += dt) {
      const now = clipPose("tap_forward", t);
      for (const arm of ["armL", "armR"] as const)
        for (const key of ["raise", "spread", "elbow"] as const)
          expect(Math.abs(now[arm][key] - before[arm][key]), `${arm}.${key} at ${t.toFixed(2)} s`).toBeLessThan(0.05);
      before = now;
    }
  });

  // Reaching straight ahead, the paws hid the balloons behind the head as the camera sees them from behind.
  test("tapping, each paw reaches out to its own side, the left one first", () => {
    expect(clipPose("tap_forward", TAP_HIT).armL.spread).toBeGreaterThan(0.6);
    expect(clipPose("tap_forward", TAP_HIT + TAP_PERIOD).armR.spread).toBeGreaterThan(0.6);
  });

  // Leaning to the side, the paw reaching out on that side is the main movement, so it glows too.
  test("leaning to the side, the arms may glow", () => {
    expect(clipFocus("lean_side")).toContain("armL");
    expect(clipFocus("lean_side")).toContain("armR");
  });
});
