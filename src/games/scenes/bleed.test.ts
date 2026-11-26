import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { intoPicture, mirrorsFor } from "./bleed";

describe("the background beyond the picture's edges", () => {
  test("a phone on its side gets copies left and right, a tablet above and below, a matching screen none", () => {
    expect(mirrorsFor(1600, 1000, 844, 390)).toEqual(["matrix(-1 0 0 1 0 0)", "matrix(-1 0 0 1 3200 0)"]);
    expect(mirrorsFor(1600, 1000, 1024, 768)).toEqual(["matrix(1 0 0 -1 0 0)", "matrix(1 0 0 -1 0 2000)"]);
    expect(mirrorsFor(1600, 1000, 1600, 1000)).toEqual([]);
    expect(mirrorsFor(1600, 1000, 0, 0)).toEqual([]);
  });

  test("a point beside the picture is the point of the picture it mirrors", () => {
    expect(intoPicture(-50, 500, 1600, 1000)).toEqual([50, 500]);
    expect(intoPicture(1650, 1040, 1600, 1000)).toEqual([1550, 960]);
    expect(intoPicture(800, -20, 1600, 1000)).toEqual([800, 20]);
    expect(intoPicture(-5000, 500, 1600, 1000)).toEqual([1600, 500]);
  });

  // User feedback, November 2026: on a phone the picture stood in the middle with plain bands of colour beside it.
  test("the picture's svgs mirror the background and the falling overlay into the room beside the picture", () => {
    const source = readFileSync(join(import.meta.dir, "ScenePlay.tsx"), "utf8");
    expect(source).toContain("<MirroredEdges");
    expect(source.match(/<MirroredEdges /g)?.length).toBe(2);
  });
});
