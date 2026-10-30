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

/** Every CSS rule in src (selector and body), roughly split – enough for flat rules and rules inside one @media. */
function cssRules() {
  return readdirSync("src", { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".css"))
    .flatMap((file) =>
      [
        ...readFileSync(join("src", file), "utf8")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .matchAll(/([^{}]+)\{([^{}]*)\}/g),
      ].map(([, selector, body]) => ({
        file,
        selector: selector.trim(),
        body,
      })),
    );
}

// Grown-ups on a big monitor didn't find the way back fixed in the screen's corner: it stays next to the menu's title.
test("the way back from a menu is never fixed in a corner", () => {
  const fixed = cssRules().filter((r) => /\.(menu-top|back-link)\b/.test(r.selector) && /position:\s*fixed/.test(r.body));
  expect(fixed).toEqual([]);
});

// The sun is in the top left corner, so the grown-ups' buttons (fullscreen, the home page's options) keep the top right one.
test("the menus' sun is in the top left corner", () => {
  const sun = cssRules().filter((r) => r.selector === ".sky-sun");
  expect(sun.length).toBeGreaterThan(0);
  for (const r of sun) {
    expect(r.body).toMatch(/\bleft:/);
    expect(r.body).not.toMatch(/\bright:/);
  }
});
