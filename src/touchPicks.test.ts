import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// A finger picks at once, it never drags (user feedback, November 2026, Was gehört zum Tier?: a child's finger moves a
// little while it taps, and its tap became a drag that picked nothing). A game that tells a tap from a drag by how far
// the pointer moved (`TAP_PX`) lets only a mouse drag: `mayDrag` in src/lib/tapTargets.ts.

const games = join(import.meta.dir, "games");

/** Every game's source file (not its tests). */
function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sources(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.includes(".test.") ? [path] : [];
  });
}

describe("on a touch screen a press picks, it never starts a drag", () => {
  const dragging = sources(games).filter((path) => readFileSync(path, "utf8").includes("TAP_PX"));

  test("the games that drag are found", () => {
    expect(dragging.length).toBeGreaterThan(0);
  });

  for (const path of dragging) {
    test(path.slice(games.length + 1), () => {
      expect(readFileSync(path, "utf8")).toContain("mayDrag(e)");
    });
  }
});
