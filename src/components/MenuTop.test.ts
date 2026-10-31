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

// In the book look the way back is the page's corner in the top left, and the page turning back moves from there
// (user feedback, October 2026: a corner in the top right turned the other page, and grown-ups didn't look there). Every menu head draws it, it lies fixed at the page's corner, and the round arrow gives way to it
// (the toy look keeps the arrow, next to the title).
test("in the book look a menu turns back at the page's corner, top left", () => {
  const menuTop = readFileSync("src/components/MenuTop.tsx", "utf8");
  const head = menuTop.slice(menuTop.indexOf("export function MenuHead"), menuTop.indexOf("function PageCorner"));
  expect(head).toContain("<PageCorner ");
  const rules = cssRules();
  const corner = rules.filter((r) => r.selector === ':root[data-look="book"] .page-corner');
  expect(corner.length).toBe(1);
  expect(corner[0]?.body).toMatch(/position:\s*fixed/);
  expect(corner[0]?.body).toMatch(/\bleft:/);
  expect(corner[0]?.body).not.toMatch(/\bright:/);
  expect(corner[0]?.body).toMatch(/\btop:/);
  expect(rules.some((r) => r.selector === ".page-corner" && /display:\s*none/.test(r.body))).toBe(true);
  expect(rules.some((r) => r.selector === ':root[data-look="book"] .menu-head .back-link' && /display:\s*none/.test(r.body))).toBe(true);
});

// What is touched is what moves: the corner is the left page's outer corner, so the page turning back is this one,
// lifted at its left edge and swung over the spine on its right (the page seen is the book's left page, look.test.ts).
test("in the book look the page turning back is the one whose corner is touched, lifted at its left edge", () => {
  const back = cssRules().filter((r) => r.selector === ':root[data-look="book"][data-turn="back"]::view-transition-old(turn-page)');
  expect(back.length).toBe(1);
  expect(back[0]?.body).toMatch(/transform-origin:\s*right center/);
  expect(back[0]?.body).toMatch(/book-turn-away/);
  expect(back[0]?.body).not.toMatch(/\breverse\b/);
});

// Leaving a game is the same corner in the book look (user feedback, October 2026: every way back turns the page back),
// with a ✕ on it and held like the ✕ – so a child's tap still can't end the game – in the top left like a menu's, and
// a game's ⚙️ moves to the top right for it.
test("in the book look a game is left by holding the page's corner, top left", () => {
  const shell = readFileSync("src/components/GameShell.tsx", "utf8");
  const exit = shell.slice(shell.indexOf("function ExitButton"));
  expect(exit).toContain("useHold(");
  expect(exit).toContain('<PageCornerArt sign="close" />');
  const rules = cssRules();
  expect(rules.some((r) => r.selector === ".hold-exit .page-corner-art" && /display:\s*none/.test(r.body))).toBe(true);
  expect(rules.some((r) => r.selector === ':root[data-look="book"] .play-area .exit-corner .page-corner-art' && /display:\s*block/.test(r.body))).toBe(true);
  expect(rules.some((r) => r.selector === ':root[data-look="book"] .play-area .exit-corner .hold-exit-sign' && /display:\s*none/.test(r.body))).toBe(true);
  const placed = (selector: string) => rules.filter((r) => r.selector === selector && /\btop:/.test(r.body));
  const exitCorner = placed(':root[data-look="book"] .play-area .exit-corner');
  expect(exitCorner.length).toBe(1);
  expect(exitCorner[0]?.body).toMatch(/\bleft:\s*max\(/);
  expect(exitCorner[0]?.body).toMatch(/\bright:\s*auto/);
  const options = placed(':root[data-look="book"] .play-area .play-options-corner');
  expect(options.length).toBe(1);
  expect(options[0]?.body).toMatch(/\bright:\s*max\(/);
  expect(options[0]?.body).toMatch(/\bleft:\s*auto/);
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

// Back onto the shelf no page turns, the book closes and goes back (bookTravel.ts): a page's corner there said „turn the
// page“ (user feedback, October 2026), so the way back to the home page is the book's cover with a shelf on it.
test("in the book look the way back onto the shelf is the book's cover, not a page's corner", () => {
  const menuTop = readFileSync("src/components/MenuTop.tsx", "utf8");
  const corner = menuTop.slice(menuTop.indexOf("function PageCorner"));
  expect(corner).toMatch(/sign=\{to === "\/" \? "shelf" : "back"\}/);
  expect(readFileSync("src/components/PageCornerArt.tsx", "utf8")).toMatch(/if \(sign === "shelf"\) return <CoverCornerArt \/>/);
});

// User decision, October 2026: menus need no „Über das Spiel“. GameShell has no `info`, and no game passes one.
test("no start screen has an „Über das Spiel“", () => {
  expect(readFileSync("src/components/GameShell.tsx", "utf8")).not.toMatch(/\binfo\?:/);
  const games = readdirSync("src/games", { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => /<GameShell[\s\S]*?\binfo=\{/.test(readFileSync(join("src/games", file), "utf8")));
  expect(games).toEqual([]);
});

// User feedback, October 2026: the animal families stand at the bottom of a menu's page, never in its top row beside
// the title, where they were too small and in the way; the page keeps room for them under its cards.
test("in the book look the families stand at the bottom of a menu's page, not in its head", () => {
  expect(readFileSync("src/components/MenuTop.tsx", "utf8")).not.toContain("BookFamil");
  expect(readFileSync("src/components/Sky.tsx", "utf8")).toContain("<BookFamilies />");
  const family = cssRules().filter((r) => r.selector === ':root[data-look="book"] .book-family');
  expect(family.length).toBeGreaterThan(0);
  for (const rule of family) expect(rule.body).toMatch(/bottom:/);
  expect(readFileSync("src/lib/fitGrid.ts", "utf8")).toContain("--menu-floor");
});
