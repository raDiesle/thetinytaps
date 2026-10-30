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

// Grown-ups on a big monitor didn't find the round arrow fixed in the screen's corner: it stays next to the menu's title.
test("the way back from a menu is never fixed in a corner", () => {
  const fixed = cssRules().filter((r) => /\.(menu-top|back-link)\b/.test(r.selector) && /position:\s*fixed/.test(r.body));
  expect(fixed).toEqual([]);
});

// In the book look the way back is the page's turned-up corner in the top right, where a reader turns a page back
// (user decision, October 2026): every menu head draws it, it lies fixed at the page's corner, and the round arrow
// gives way to it there (the toy look keeps the arrow, next to the title).
test("in the book look a menu turns back at the page's top right corner", () => {
  const menuTop = readFileSync("src/components/MenuTop.tsx", "utf8");
  const head = menuTop.slice(menuTop.indexOf("export function MenuHead"), menuTop.indexOf("function PageCorner"));
  expect(head).toContain("<PageCorner ");
  const rules = cssRules();
  const corner = rules.filter((r) => r.selector === ':root[data-look="book"] .page-corner');
  expect(corner.length).toBe(1);
  expect(corner[0]?.body).toMatch(/position:\s*fixed/);
  expect(corner[0]?.body).toMatch(/\bright:/);
  expect(corner[0]?.body).toMatch(/\btop:/);
  expect(rules.some((r) => r.selector === ".page-corner" && /display:\s*none/.test(r.body))).toBe(true);
  expect(rules.some((r) => r.selector === ':root[data-look="book"] .menu-head .back-link' && /display:\s*none/.test(r.body))).toBe(true);
});

// Leaving a game is the same corner in the book look (user feedback, October 2026: every way back turns the page back),
// with a ✕ on it and held like the ✕ – so a child's tap still can't end the game.
test("in the book look a game is left by holding the page's corner", () => {
  const shell = readFileSync("src/components/GameShell.tsx", "utf8");
  const exit = shell.slice(shell.indexOf("function ExitButton"));
  expect(exit).toContain("useHold(");
  expect(exit).toContain('<PageCornerArt sign="close" />');
  const rules = cssRules();
  expect(rules.some((r) => r.selector === ".hold-exit .page-corner-art" && /display:\s*none/.test(r.body))).toBe(true);
  expect(rules.some((r) => r.selector === ':root[data-look="book"] .play-area .exit-corner .page-corner-art' && /display:\s*block/.test(r.body))).toBe(true);
  expect(rules.some((r) => r.selector === ':root[data-look="book"] .play-area .exit-corner .hold-exit-sign' && /display:\s*none/.test(r.body))).toBe(true);
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
