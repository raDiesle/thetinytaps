import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";

// All CSS is global, and games are loaded one by one: a name used twice means the
// look depends on which game was opened first. Prefix names by game or scene.

const cssFiles = readdirSync("src", { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".css"))
  .map((file) => join("src", file));

test("keyframe names are unique across all CSS files", () => {
  const files = new Map<string, string[]>();
  for (const file of cssFiles) {
    for (const [, name] of readFileSync(file, "utf8").matchAll(/@keyframes\s+([\w-]+)/g)) {
      files.set(name, [...(files.get(name) ?? []), file]);
    }
  }
  const twice = [...files].filter(([, where]) => where.length > 1).map(([name, where]) => `${name}: ${where.join(", ")}`);
  expect(twice).toEqual([]);
});
