import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { STORIES } from "./catalog";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { FIRE_RESCUE } from "./stories/fireRescue";
import { firstLanguage, type Story } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

// The start screen loads neither three.js nor a story (code review R-P11, November 2026: its chunk was 1.17 MB, fetched
// ahead from the book's table of contents): catalog.ts keeps what the cards need, each story and the player come by
// `import()` when played.

const source = (file: string) => readFileSync(join(import.meta.dir, file), "utf8");

/** The modules a file imports at load time (`import … from "x"`, not `import type`, not `import("x")`). */
const staticImports = (code: string) => [...code.matchAll(/^import\s+(?!type\b)[^;]*?from\s+"([^"]+)"/gms)].map((match) => match[1]);

describe("Bewegungsabenteuer's start screen stays small", () => {
  test.each(["AdventureGame.tsx", "catalog.ts"])("%s imports neither three.js, the player nor a story", (file) => {
    for (const path of staticImports(source(file))) {
      expect(path, file).not.toMatch(/^three(\/|$)/);
      expect(path, file).not.toMatch(/AdventurePlay$/);
      // story.ts holds only types and small helpers; each story's folder is the heavy part.
      expect(path, file).not.toMatch(/^\.\/stories\/(?!story$)[^/]+(\/index)?$/);
      expect(path, file).not.toMatch(/^\.\/three\//);
    }
  });

  const stories: Record<string, Story> = { schatzinsel: TREASURE_ISLAND, wolkenreise: CLOUD_TRIP, feuerwehr: FIRE_RESCUE };

  test("the catalog lists every story once, with its title and language", () => {
    expect(STORIES.map((s): string => s.id).sort()).toEqual(Object.keys(stories).sort());
    for (const entry of STORIES) {
      const story = stories[entry.id];
      expect(entry.title, entry.id).toBe(story.sequence.title);
      expect(entry.language, entry.id).toBe(firstLanguage(story));
      expect(entry.translations, entry.id).toBe(story.translations);
    }
  });

  test("each entry loads its own story", async () => {
    for (const entry of STORIES) expect(await entry.load()).toBe(stories[entry.id]);
  });
});
