import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "bun:test";

// Games don't count the rounds or finds with a row of stars (user feedback, November 2026): they flow on with nothing
// to collect. Lebendige Bilder is the exception grown-ups need: how many of a picture's things are found, out of all.

/** The games' drawn code, by path. */
const files = readdirSync("src/games", { recursive: true, encoding: "utf8" })
  .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
  .map((f) => `src/games/${f}`);

test("only Lebendige Bilder shows a row of stars for what was found", () => {
  expect(files.filter((f) => readFileSync(f, "utf8").includes('"⭐".repeat('))).toEqual(["src/games/scenes/ScenePlay.tsx"]);
});

test("Lebendige Bilder counts the things found out of all", () => {
  expect(readFileSync("src/games/scenes/ScenePlay.tsx", "utf8")).toContain("{discovered.size}/{scene.items.length}");
});
