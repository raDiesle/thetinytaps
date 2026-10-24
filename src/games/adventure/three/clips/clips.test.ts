import { describe, expect, test } from "@rstest/core";
import { CLIP_GROUPS, CLIP_IDS } from ".";

describe("motion clips", () => {
  // The groups are spread into one table, so a clip in two files would silently lose one of them.
  test("every clip is in exactly one body-part file", () => {
    const grouped = Object.values(CLIP_GROUPS).flatMap((group) => Object.keys(group));
    expect(grouped.length).toBe(CLIP_IDS.length);
  });
});
