import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";

// On a computer the back link is fixed in the top left corner, outside the page's layout. A menu title drawn
// on its own (not by MenuHead, which starts the title's column where the corner ends) slid under it at 1024 px.
test("only MenuHead draws a menu's title", () => {
  const drawers = readdirSync("src", { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => readFileSync(join("src", file), "utf8").includes('className="menu-title"'));
  expect(drawers).toEqual([join("components", "MenuTop.tsx")]);
});
