import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// A camera that follows the marbles moves its picture as a layer of its own (`cameraLayer` in level.ts), which a
// phone moves without painting. A changing viewBox or a moved group inside the svg had it paint the whole picture
// again in every frame, and the marble run stuttered on phones (November 2026).

const dir = import.meta.dir;
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => ({ name: f, code: readFileSync(join(dir, f), "utf8") }));

describe("marble cameras", () => {
  test("no viewBox follows the camera", () => {
    const moving = files.filter((f) => /viewBox=\{[^}]*\bcam/i.test(f.code)).map((f) => f.name);
    expect(moving).toEqual([]);
  });

  test("no group inside an svg is moved by the camera", () => {
    const moving = files.filter((f) => /<g\b[^>]*\btransform=\{[^}]*\bcam/i.test(f.code)).map((f) => f.name);
    expect(moving).toEqual([]);
  });

  test("every level with a camera moves it as a layer", () => {
    const withCamera = files.filter((f) => /const (cam|camera)\b/.test(f.code));
    expect(withCamera.length).toBeGreaterThanOrEqual(5);
    for (const f of withCamera) expect({ file: f.name, layer: f.code.includes("cameraLayer(") }).toEqual({ file: f.name, layer: true });
  });
});
