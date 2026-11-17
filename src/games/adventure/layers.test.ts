import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(import.meta.dir, "adventure.css"), "utf8");

/** The declarations of the first rule whose selector is exactly `selector`. */
const rule = (selector: string) => css.match(new RegExp(`(^|\\n)${selector.replace(".", "\\.")} \\{([^}]*)\\}`))?.[2] ?? "";

// The child figure beside the fox is drawn anew in every frame. Without a layer of its own its repaint was rastered in
// a layer it shared with the controls and the time bar: 47 screens of pixels a second at the drums instead of 24
// (budget 30; `bun run perf abenteuer`, November 2026).
test("the child figure that is drawn in every frame has a layer of its own", () => {
  expect(rule(".adventure-outline")).toMatch(/will-change:\s*transform/);
});
