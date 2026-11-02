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
// with a ✕ on it, tapped or held like the ✕ (held where grown-ups chose so, so a child's tap can't end the game), in
// the top left like a menu's, and a game's ⚙️ moves to the top right for it.
test("in the book look a game is left by the page's corner, top left", () => {
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
// page“, and the cover's corner lying over the page floated where no cover can be (user feedback, October 2026), so the
// way back to the home page is the book's ribbon hanging over the page's top edge, with a shelf on it.
test("in the book look the way back onto the shelf is the book's ribbon, not a corner", () => {
  const menuTop = readFileSync("src/components/MenuTop.tsx", "utf8");
  const corner = menuTop.slice(menuTop.indexOf("function PageCorner"));
  expect(corner).toMatch(/sign=\{to === "\/" \? "shelf" : "back"\}/);
  expect(corner).toMatch(/className=\{to === "\/" \? "page-corner page-ribbon" : "page-corner"\}/);
  const art = readFileSync("src/components/PageCornerArt.tsx", "utf8");
  expect(art).toMatch(/if \(sign === "shelf"\) return <RibbonArt \/>/);
  expect(art).not.toContain("CoverCorner");
});

// The ribbon is big, so a grown-up sees it at once (user feedback, October 2026), and it never lies over a card, a line or
// the title: the menu's head reaches down past it from the top of the menu's padding (`--menu-pad`, which must be the
// padding the menus really have), the table of contents counts that room as taken, and it stays left of the head.
test("the ribbon reaches no further than the room the menus keep free for it", () => {
  const art = readFileSync("src/components/PageCornerArt.tsx", "utf8");
  const [, w, h] = (art.match(/className="page-ribbon-art" viewBox="0 0 (\d+) (\d+)"/) ?? []).map(Number);
  const rules = cssRules();
  const body = (selector: string) => rules.filter((r) => r.selector === selector).map((r) => r.body);
  const [ribbon] = body(':root[data-look="book"] .page-corner.page-ribbon');
  const lift = Number(ribbon?.match(/top:\s*calc\(var\(--page-top\) - var\(--ribbon\) \* (\d+) \/ (\d+)\)/)?.[1]);
  expect(ribbon).toContain(`height: calc(var(--ribbon) * ${h} / ${w})`);
  expect(ribbon).toContain("position: absolute");
  expect(readFileSync("src/components/MenuTop.tsx", "utf8")).toContain('createPortal(corner, document.getElementById("root")');
  const sizes = body(':root[data-look="book"]:has(.page-ribbon)');
  expect(sizes.join("")).toContain(`--ribbon-reach: calc(var(--page-top) + var(--ribbon) * ${(h ?? 0) - lift} / ${w})`);
  // Left of the head, which keeps the corner's room free (`.menu-head`'s margin): its widest part, the arrow's disc.
  const share = Number(sizes.join("").match(/--ribbon:\s*calc\(var\(--corner\) \* ([\d.]+)\)/)?.[1]);
  const disc = art.match(/className="page-ribbon-badge" cx="([\d.]+)" cy="[\d.]+" r="([\d.]+)"/);
  expect(0.12 + (share * (Number(disc?.[1]) + Number(disc?.[2]))) / (w ?? 1)).toBeLessThanOrEqual(1);
  expect(body(':root[data-look="book"]:has(.page-ribbon) .menu-head').join("")).toContain("min-height: calc(var(--ribbon-reach) + 6px - var(--menu-pad))");
  expect(rules.filter((r) => r.selector === ':root[data-look="book"]:has(.page-ribbon) .toc').map((r) => r.body)).toEqual([
    expect.stringContaining("var(--ribbon-reach)"),
    expect.stringContaining("var(--ribbon-reach)"),
  ]);
  // `--menu-pad` is the padding-top the menus have (in the book look they keep the toy look's).
  const pad = (file: string, selector: string) =>
    rules.filter((r) => r.file === file && r.selector === selector).flatMap((r) => r.body.match(/padding:\s*max\((\d+px)/)?.[1] ?? []);
  const menuPad = (selector: string) => body(selector).flatMap((b) => b.match(/--menu-pad:\s*(\d+px)/)?.[1] ?? []);
  expect(pad("styles/menus.css", ".home")).toEqual([
    ...menuPad(':root[data-look="book"] .home'),
    ...menuPad(':root[data-look="book"] :is(.home, .start-screen)'),
  ]);
  expect(pad("styles/start-screen.css", ".start-screen")).toEqual([
    ...menuPad(':root[data-look="book"] .start-screen'),
    ...menuPad(':root[data-look="book"] :is(.home, .start-screen)'),
  ]);
});

// On a wide screen the ribbon lies in the margin beside the table of contents, as big as that margin allows (user
// feedback, October 2026: in the corner it was far too small, with much empty room between it and the lines). It keeps
// clear of the lines from the first width it does so: even its smallest size fits, with room for its sway and a scrollbar.
test("on a wide screen the ribbon lies beside the table of contents, never over its lines", () => {
  const css = readFileSync("src/styles/book.css", "utf8");
  const wide = css.match(
    /@media \(min-width: (\d+)px\) and \(min-height: 600px\) \{\s*:root\[data-look="book"\]:has\(\.page-ribbon\):has\(\.toc\) \{([^}]*)\}/,
  );
  const [, from, body] = wide ?? [];
  expect(css).toMatch(/\.toc \{[^}]*width: min\(100%, 900px\);/);
  expect(body).toContain("--toc-left: calc((100vw - 900px) / 2);");
  const size = body?.match(/--ribbon: clamp\((\d+)px, var\(--toc-left\) - (\d+)px - var\(--page-left\) - (\d+)px, min\((\d+)px, (\d+)vh\)\);/);
  const [, smallest, gap] = (size ?? []).map(Number);
  // Its right edge keeps `gap` from the lines: the hover sways it 5° (its disc moves about 20 px at the biggest size)
  // and a scrollbar moves the lines 8 px left.
  expect(body).toContain(`--ribbon-left: calc(var(--toc-left) - ${gap}px - var(--ribbon));`);
  expect(gap).toBeGreaterThanOrEqual(28);
  // Even at its smallest it still begins on the page, from the first width it lies there.
  const pageLeft = Number(css.match(/--page-left: (\d+)px;/)?.[1]);
  expect((Number(from) - 900) / 2 - (gap ?? 0) - (smallest ?? 0)).toBeGreaterThanOrEqual(pageLeft);
});

// The arrow on the ribbon's disc is a plain arrow pointing back, as the toy look's round arrow: a straight shaft and a
// head of two equal strokes meeting at its tip (a bent shaft with uneven strokes was not seen as an arrow).
test("the ribbon's arrow is a straight arrow with an even head", () => {
  const art = readFileSync("src/components/PageCornerArt.tsx", "utf8");
  const d = art.match(/className="page-ribbon-arrow" d="([^"]+)"/)?.[1] ?? "";
  const [x0, y0, x1, ax, ay, tx, ty, bx, by] = (d.match(/-?[\d.]+/g) ?? []).map(Number);
  expect(d).toMatch(/^M[\d.]+ [\d.]+H[\d.]+M[\d.]+ [\d.]+L[\d.]+ [\d.]+L[\d.]+ [\d.]+$/);
  expect(x1).toBeLessThan(x0 ?? 0);
  expect(ty).toBe(y0);
  expect(tx).toBeLessThanOrEqual(x1 ?? 0);
  expect(ax).toBe(bx);
  expect((ay ?? 0) + (by ?? 0)).toBeCloseTo(2 * (ty ?? 0));
  expect((ax ?? 0) - (tx ?? 0)).toBeCloseTo((ty ?? 0) - (ay ?? 0));
});

// User decision, October 2026: menus need no „Über das Spiel“. GameShell has no `info`, no game passes one, and no
// game's own menu has an ℹ️ panel either (the Belohnungstafel's „Über die Tafel“ went too).
test("no start screen has an „Über das Spiel“", () => {
  const panels = readdirSync("src/games", { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => readFileSync(join("src/games", file), "utf8").includes('emoji="ℹ️"'));
  expect(panels).toEqual([]);
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

// User feedback, October 2026: headings carry no emoji („Lebendige Welten“, never „🌳 Lebendige Welten“). MenuHead takes
// its title as plain text, and no heading the app shows starts with an emoji or an emoji's span (only the management
// page, which only the makers see, keeps its signs).
test("headings carry no emoji", () => {
  const leading = /<h[1-6][^>]*>\s*(<span aria-hidden>|\{?[^\s<{}]*\p{Extended_Pictographic})/u;
  const offenders = readdirSync("src", { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".tsx") && !/ManagementPage|PicturePromptReview|PictureQueue|VoiceList/.test(file))
    .filter((file) => leading.test(readFileSync(join("src", file), "utf8")));
  expect(offenders).toEqual([]);
  expect(readFileSync("src/components/MenuTop.tsx", "utf8")).toMatch(/title: string; tools/);
});
