import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LEVELS } from "./catalog";
import { LEVEL_TEXTS } from "./content";

// The start screen loads no level (code review R-P12, November 2026: all 21 levels in its chunk were 454 KB, fetched
// ahead from the book's table of contents): catalog.ts keeps what the cards need, each level comes by `import()` when
// it is played.

const source = (file: string) => readFileSync(join(import.meta.dir, file), "utf8");

/** The modules a file imports at load time (`import … from "x"` and `import "x"`, not `import type`, not `import("x")`). */
const staticImports = (code: string) =>
  [...code.matchAll(/^import\s+(?!type\b)(?:[^;]*?from\s+)?"([^"]+)"/gms)].map((match) => match[1]).filter((path) => path.startsWith("."));

/** A level's own code and what only levels use: the levels, the machines' stage and kit, the runs' worlds and drawings. */
const LEVEL_CODE =
  /^\.\/(\w+Level|MachineStage|machineKit|scenery|parts|things|path|track|\w+Track|trackTheme|colors|machine|kitchen|garden|building|circus|space|light|bath|farm|night|tidy|water|pegs|sneeze)$/;

describe("Kettenreaktion's start screen stays small", () => {
  test.each(["MarbleGame.tsx", "MarblePlay.tsx", "catalog.ts", "content.ts", "level.ts", "settings.ts", "voice.ts"])("%s imports no level's code", (file) => {
    for (const path of staticImports(source(file))) expect(path, file).not.toMatch(LEVEL_CODE);
  });

  test("the import check sees a level", () => {
    expect(staticImports('import { TrackLevel } from "./TrackLevel";\nimport "./track.css";')).toEqual(["./TrackLevel", "./track.css"]);
    expect("./TrackLevel").toMatch(LEVEL_CODE);
  });

  test("the catalog lists every level once, with its name", () => {
    const ids: string[] = LEVELS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(Object.keys(LEVEL_TEXTS).sort());
  });

  test("every level file is in the catalog", () => {
    const files = readdirSync(import.meta.dir).filter((file) => /^\w+Level\.tsx$/.test(file));
    const catalog = source("catalog.ts");
    for (const file of files) expect(catalog, file).toContain(`"./${file.replace(/\.tsx$/, "")}"`);
  });

  test("each entry loads a level component", async () => {
    const loaded = await Promise.all(LEVELS.map((entry) => entry.load()));
    for (const [i, Level] of loaded.entries()) expect(typeof Level, LEVELS[i].id).toBe("function");
    // Each card its own level: only the runs share TrackLevel's file, never one component.
    expect(new Set(loaded).size).toBe(LEVELS.length);
  });
});
