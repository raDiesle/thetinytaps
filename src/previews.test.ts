import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { bookIdOf, CATEGORIES, hasPage, listedGames } from "@/content/games";
import { SCENE_ENTRIES } from "@/games/scenes/catalog";

// The menus show a framed landscape cut of each game instead of its emoji (user request, November 2026), made by
// `bun run previews` (tools/previews.ts) as small still pictures: these checks keep every menu's pictures there and
// light, so a phone shows a menu without drawing a single game.

const ROOT = join(import.meta.dir, "..");
const TOOL = readFileSync(join(ROOT, "tools/previews.ts"), "utf8");

/** Every source file below `dir`. */
const sources = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? sources(join(dir, entry.name)) : /\.tsx?$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [join(dir, entry.name)] : [],
  );

/** The `vorschau/` folders the app imports, relative to the repo. */
const folders = sources(join(ROOT, "src")).flatMap((file) =>
  [...readFileSync(file, "utf8").matchAll(/from "([^"]*vorschau)\/\*\.webp\?glob"/g)].map(([, path]) =>
    join(file.slice(ROOT.length + 1, file.lastIndexOf("/")), path),
  ),
);

describe("menu pictures", () => {
  test("each book's table of contents has a picture for every game", () => {
    for (const category of CATEGORIES.filter(hasPage)) {
      for (const game of listedGames(category)) expect(existsSync(join(ROOT, "src/components/vorschau", `${bookIdOf(game.href)}.webp`)), game.href).toBe(true);
    }
  });

  test("each picture of Lebendige Bilder has its card's picture", () => {
    for (const scene of SCENE_ENTRIES) expect(existsSync(join(ROOT, "src/games/scenes/vorschau", `${scene.id}.webp`)), scene.id).toBe(true);
  });

  test("a folder of files is imported by a path relative to its importer", () => {
    // tools/appPlugin.ts resolves a `?glob` next to the importing file only: "@/…" found no files and gave an empty
    // list without an error, so Lebendige Bilder's menu kept its emojis.
    for (const file of sources(join(ROOT, "src"))) expect(readFileSync(file, "utf8"), file).not.toMatch(/from "@\/[^"]*\?glob"/);
  });

  test("bun run previews knows every folder the menus show", () => {
    expect(folders.length).toBeGreaterThan(5);
    for (const folder of new Set(folders)) expect(TOOL.includes(`"${folder}"`), folder).toBe(true);
  });

  test("the pictures are landscape cuts, as the frames on the cards are", async () => {
    // Square prints in round frames showed too little of a game (user feedback, November 2026): tools/previews.ts cuts 4:3.
    for (const folder of new Set(folders)) {
      for (const name of readdirSync(join(ROOT, folder))) {
        const { width = 0, height = 0 } = await sharp(join(ROOT, folder, name)).metadata();
        expect(width / height, `${folder}/${name}`).toBeCloseTo(4 / 3, 1);
      }
    }
  });

  test("the pictures are small: a menu of twenty cards stays light on a phone", () => {
    for (const folder of new Set(folders)) {
      for (const name of readdirSync(join(ROOT, folder))) {
        expect(name, folder).toMatch(/\.webp$/);
        expect(statSync(join(ROOT, folder, name)).size, `${folder}/${name}`).toBeLessThan(24_000);
      }
    }
  });
});
