import { join } from "node:path";
import { expect, test } from "bun:test";
import { cssRules, read, sourceFiles } from "@/testSources";

// On a computer the back link is fixed in the top left corner, outside the page's layout. A menu title drawn
// on its own (not by MenuHead, which starts the title's column where the corner ends) slid under it at 1024 px.
test("only MenuHead draws a menu's title", () => {
  const drawers = sourceFiles()
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => read(join("src", file)).includes('className="menu-title"'));
  expect(drawers).toEqual([join("components", "MenuTop.tsx")]);
});

// Grown-ups on a big monitor didn't find the round arrow fixed in the screen's corner: it stays next to the menu's title.
test("the way back from a menu is never fixed in a corner", () => {
  const fixed = cssRules().filter((r) => /\.(menu-top|back-link)\b/.test(r.selector) && /position:\s*fixed/.test(r.body));
  expect(fixed).toEqual([]);
});

// The way back from a menu is the page's corner in the top left, and the page turning back moves from there (user
// feedback, October 2026: a corner in the top right turned the other page, and grown-ups didn't look there). Every menu
// head draws it, it lies fixed at the page's corner, and no round arrow beside the title stands in for it.
test("a menu turns back at the page's corner, top left", () => {
  const menuTop = read("src/components/MenuTop.tsx");
  const head = menuTop.slice(menuTop.indexOf("export function MenuHead"), menuTop.indexOf("function PageCorner"));
  expect(head).toContain("<PageCorner ");
  expect(head).not.toContain("back-link");
  expect(head).not.toContain("<MenuTop");
  const rules = cssRules();
  const corner = rules.filter((r) => r.selector === ":root .page-corner");
  expect(corner.length).toBe(1);
  expect(corner[0]?.body).toMatch(/position:\s*fixed/);
  expect(corner[0]?.body).toMatch(/\bleft:/);
  expect(corner[0]?.body).not.toMatch(/\bright:/);
  expect(corner[0]?.body).toMatch(/\btop:/);
});

// What is touched is what moves: the corner is the left page's outer corner, so the page turning back is this one,
// lifted at its left edge and swung over the spine on its right (the page seen is the book's left page, look.test.ts).
test("the page turning back is the one whose corner is touched, lifted at its left edge", () => {
  const back = cssRules().filter((r) => r.selector === ':root[data-turn="back"]::view-transition-old(turn-page)');
  expect(back.length).toBe(1);
  expect(back[0]?.body).toMatch(/transform-origin:\s*right center/);
  expect(back[0]?.body).toMatch(/book-turn-away/);
  expect(back[0]?.body).not.toMatch(/\breverse\b/);
});

// Leaving a game is the same corner (user feedback, October 2026: every way back turns the page back),
// with a ✕ on it, tapped or held like the ✕ (held where grown-ups chose so, so a child's tap can't end the game), in
// the top left like a menu's, and a game's ⚙️ moves to the top right for it.
test("a game is left by the page's corner, top left", () => {
  // GameShell's corner while playing lives in gameExit.tsx.
  expect(read("src/components/GameShell.tsx")).toContain("<GameExit ");
  const shell = read("src/components/gameExit.tsx");
  const exit = shell.slice(shell.indexOf("function ExitButton"));
  expect(exit).toContain("useHold(");
  expect(exit).toContain('<PageCornerArt sign="close" />');
  const rules = cssRules();
  expect(rules.some((r) => r.selector === ":root .play-area .exit-corner .page-corner-art" && /display:\s*block/.test(r.body))).toBe(true);
  expect(exit).not.toContain("hold-exit-sign");
  const placed = (selector: string) => rules.filter((r) => r.selector === selector && /\btop:/.test(r.body));
  const exitCorner = placed(":root .play-area .exit-corner");
  expect(exitCorner.length).toBe(1);
  expect(exitCorner[0]?.body).toMatch(/\bleft:/);
  expect(exitCorner[0]?.body).toMatch(/\bright:\s*auto/);
  // Flush in the screen's very corner, also on a phone with a camera cut-out or rounded corners: moved in by the safe
  // area, it left a strip of picture between it and the edge (user feedback, November 2026). It grows by it instead.
  expect(exitCorner[0]?.body).not.toContain("safe-area");
  const corner = rules.find((r) => r.selector === ":root .play-area .exit-corner .hold-exit")?.body ?? "";
  expect(corner).toMatch(/margin:\s*calc\(-1 \* var\(--frame\) - 8px\) 0 0 calc\(-1 \* var\(--frame\) - 8px\)/);
  expect(
    rules.some(
      (r) =>
        r.selector === ":root .play-area" && /--play-corner:\s*calc\(var\(--play-corner-base\) \+ max\(var\(--safe-left\), var\(--safe-top\)\)/.test(r.body),
    ),
  ).toBe(true);
  const options = placed(":root .play-area .play-options-corner,\n:root .play-area .play-fullscreen-corner");
  expect(options.length).toBe(1);
  expect(options[0]?.body).toMatch(/\bright:\s*max\(/);
  expect(options[0]?.body).toMatch(/\bleft:\s*auto/);
  // The fullscreen slip is in the far top right, ⚙️ right beside it on its left – beside the ✕ it hung on its own up
  // there (user feedback, November 2026). The ✕'s corner holds nothing else.
  const exitCornerJsx = shell.match(/<div className="exit-corner" data-tap-keep>([\s\S]*?)<\/div>/)?.[1] ?? "";
  expect(exitCornerJsx).toContain("{children}");
  expect(exitCornerJsx).not.toContain("FullscreenButton");
  expect(shell).toMatch(/<div className="play-fullscreen-corner" data-tap-keep>\s*\{[^}]*\}\s*<FullscreenButton/);
  expect(rules.some((r) => r.selector === ":root .play-area:has(.play-fullscreen) .play-options-corner" && /\bright:\s*calc\(/.test(r.body))).toBe(true);
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
test("the way back onto the shelf is the book's ribbon, not a corner", () => {
  const menuTop = read("src/components/MenuTop.tsx");
  const corner = menuTop.slice(menuTop.indexOf("function PageCorner"));
  expect(corner).toMatch(/sign=\{to === "\/" \? "shelf" : "back"\}/);
  expect(corner).toMatch(/className=\{to === "\/" \? "page-corner page-ribbon" : "page-corner"\}/);
  const art = read("src/components/PageCornerArt.tsx");
  expect(art).toMatch(/if \(sign === "shelf"\) return <RibbonArt \/>/);
  expect(art).not.toContain("CoverCorner");
});

// The ribbon is big, so a grown-up sees it at once (user feedback, October 2026), and it never lies over a card, a line or
// the title: the menu's head reaches down past it from the top of the menu's padding (`--menu-pad`, which must be the
// padding the menus really have), the table of contents counts that room as taken, and it stays left of the head –
// but for a table of contents on a phone or tablet, see the next test.
test("the ribbon reaches no further than the room the menus keep free for it", () => {
  const art = read("src/components/PageCornerArt.tsx");
  const [, w, h] = (art.match(/className="page-ribbon-art" viewBox="0 0 (\d+) (\d+)"/) ?? []).map(Number);
  const rules = cssRules();
  const body = (selector: string) => rules.filter((r) => r.selector === selector).map((r) => r.body);
  const [ribbon] = body(":root .page-corner.page-ribbon");
  const lift = Number(ribbon?.match(/top:\s*calc\(var\(--page-top\) - var\(--ribbon\) \* (\d+) \/ (\d+)\)/)?.[1]);
  expect(ribbon).toContain(`height: calc(var(--ribbon) * ${h} / ${w})`);
  expect(ribbon).toContain("position: absolute");
  expect(read("src/components/MenuTop.tsx")).toContain('createPortal(corner, document.getElementById("root")');
  const sizes = body(":root:has(.page-ribbon)");
  expect(sizes.join("")).toContain(`--ribbon-reach: calc(var(--page-top) + var(--ribbon) * ${(h ?? 0) - lift} / ${w})`);
  // Left of the head, which keeps the corner's room free (`.menu-head`'s margin): its widest part, the arrow's disc.
  const share = Number(sizes.join("").match(/--ribbon:\s*calc\(var\(--corner\) \* ([\d.]+)\)/)?.[1]);
  const disc = art.match(/className="page-ribbon-badge" cx="([\d.]+)" cy="[\d.]+" r="([\d.]+)"/);
  expect(0.12 + (share * (Number(disc?.[1]) + Number(disc?.[2]))) / (w ?? 1)).toBeLessThanOrEqual(1);
  expect(body(":root:has(.page-ribbon) .menu-head").join("")).toContain("min-height: calc(var(--ribbon-reach) + 6px - var(--menu-pad))");
  expect(rules.filter((r) => r.selector === ":root:has(.page-ribbon) .toc").map((r) => r.body)).toEqual([
    expect.stringContaining("var(--ribbon-reach)"),
    expect.stringContaining("var(--ribbon-reach)"),
  ]);
  // `--menu-pad` is the padding-top the menus have (menus.css, start-screen.css).
  const pad = (file: string, selector: string) =>
    rules.filter((r) => r.file === file && r.selector === selector).flatMap((r) => r.body.match(/padding:\s*max\((\d+px)/)?.[1] ?? []);
  const menuPad = (selector: string) => body(selector).flatMap((b) => b.match(/--menu-pad:\s*(\d+px)/)?.[1] ?? []);
  expect(pad("styles/menus.css", ".home")).toEqual([...menuPad(":root .home"), ...menuPad(":root :is(.home, .start-screen)")]);
  expect(pad("styles/start-screen.css", ".start-screen")).toEqual([...menuPad(":root .start-screen"), ...menuPad(":root :is(.home, .start-screen)")]);
});

// On a phone or tablet a book's table of contents takes the whole page, and the ribbon and the fullscreen note lie over
// its first row's corners, so the games' pictures come out as big as they can (user request, 26 November 2026). It is
// every screen whose shorter side is below `TABLET_SCREEN` and that is narrower than the wide screens laying the ribbon
// beside the lines – those keep it off them.
test("on a phone or tablet the table of contents takes the whole page, the ribbon lying over its first line", async () => {
  const { TABLET_SCREEN } = await import("@/lib/fitGrid");
  const css = read("src/styles/book.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const wideFrom = Number(css.match(/@media \(min-width: (\d+)px\) and \(min-height: 600px\) \{\s*:root:has\(\.page-ribbon\):has\(\.toc\) \{/)?.[1]);
  const block = css.match(
    /@media ([^{]+)\{\s*:root:has\(\.page-ribbon\):has\(\.toc\) \{([^}]*)\}\s*:root:has\(\.page-ribbon\):has\(\.toc\) \.menu-head \{([^}]*)\}/,
  );
  const [, query, root, head] = block ?? [];
  const below = (px: number) => `${px - 0.02}px`;
  expect(query?.trim()).toBe(`(max-width: ${below(TABLET_SCREEN)}), (max-width: ${below(wideFrom)}) and (max-height: ${below(TABLET_SCREEN)})`);
  // Close to the page's outer edge, so it covers as little of the first line as it can.
  expect(root).toContain("--ribbon-left: calc(var(--page-left) + 2px);");
  expect(head).toContain("min-height: 0;");
  // The lines reach down to the page's foot (no strip kept for anything below them).
  expect(css).toMatch(/:root \.toc \{[^}]*--toc-bottom: calc\(var\(--page-bottom\) \+ 8px\);[^}]*width: 100%;/);
});

// On a wide screen the ribbon lies in the margin beside the table of contents, as big as that margin allows (user
// feedback, October 2026: in the corner it was far too small, with much empty room between it and the lines). It keeps
// clear of the lines from the first width it does so: even its smallest size fits, with room for its sway and a scrollbar.
test("on a wide screen the ribbon lies beside the table of contents, never over its lines", () => {
  const css = read("src/styles/book.css");
  const wide = css.match(/@media \(min-width: (\d+)px\) and \(min-height: 600px\) \{\s*:root:has\(\.page-ribbon\):has\(\.toc\) \{([^}]*)\}/);
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

// The arrow on the ribbon's disc is a plain arrow pointing back, as the round arrow of MenuTop: a straight shaft and a
// head of two equal strokes meeting at its tip (a bent shaft with uneven strokes was not seen as an arrow).
test("the ribbon's arrow is a straight arrow with an even head", () => {
  const art = read("src/components/PageCornerArt.tsx");
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
  const panels = sourceFiles("src/games")
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => read(join("src/games", file)).includes('emoji="ℹ️"'));
  expect(panels).toEqual([]);
  expect(read("src/components/GameShell.tsx")).not.toMatch(/\binfo\?:/);
  const games = sourceFiles("src/games")
    .filter((file) => file.endsWith(".tsx"))
    .filter((file) => /<GameShell[\s\S]*?\binfo=\{/.test(read(join("src/games", file))));
  expect(games).toEqual([]);
});

// User feedback, October 2026: the animal families stand at the bottom of a menu's page, never in its top row beside
// the title, where they were too small and in the way. On a phone or tablet the page keeps no room for them: the cards
// take all the room and may lie over them (user decision, 25 November 2026).
test("the families stand at the bottom of a menu's page, not in its head", () => {
  expect(read("src/components/MenuTop.tsx")).not.toContain("BookFamil");
  expect(read("src/components/Sky.tsx")).toContain("<BookFamilies />");
  const family = cssRules().filter((r) => r.selector === ":root .book-family");
  expect(family.length).toBeGreaterThan(0);
  for (const rule of family) expect(rule.body).toMatch(/bottom:/);
  expect(read("src/lib/fitGrid.ts")).not.toContain("--menu-floor");
  expect(read("src/styles/book.css")).not.toContain("--menu-floor");
});

// User feedback, October 2026: headings carry no emoji („Lebendige Welten“, never „🌳 Lebendige Welten“). MenuHead takes
// its title as plain text, and no heading the app shows starts with an emoji or an emoji's span (only the management
// pages, which only the makers see, keep their signs).
test("headings carry no emoji", () => {
  const leading = /<h[1-6][^>]*>\s*(<span aria-hidden>|\{?[^\s<{}]*\p{Extended_Pictographic})/u;
  const offenders = sourceFiles()
    .filter((file) => file.endsWith(".tsx") && !/ManagementPage|ResearchPage|SongsPage|pages\/management\/|PictureQueue|VoiceList/.test(file))
    .filter((file) => leading.test(read(join("src", file))));
  expect(offenders).toEqual([]);
  expect(read("src/components/MenuTop.tsx")).toMatch(/title: string; tools/);
});

// From a menu deeper in a book (a game's cards) only one page back was reachable (user request, 28 November 2026): its
// head also draws the book's ribbon, straight onto the shelf, beside the corner and no lower than it.
test("a menu deeper in a book has the ribbon onto the shelf beside its corner", () => {
  const menuTop = read("src/components/MenuTop.tsx");
  const head = menuTop.slice(menuTop.indexOf("export function MenuHead"), menuTop.indexOf("function PageCorner"));
  expect(head).toContain('{to !== "/" && <ShelfRibbon />}');
  const ribbon = menuTop.slice(menuTop.indexOf("function ShelfRibbon"));
  expect(ribbon).toContain('useTurnPage("/", "back")');
  expect(ribbon).toContain('<PageCornerArt sign="shelf" />');
  const rule = cssRules().find((r) => r.selector === ":root .shelf-ribbon")?.body ?? "";
  expect(rule).toMatch(/left:\s*calc\(var\(--page-left\) \+ var\(--corner\)/);
  expect(rule).toMatch(/height:\s*calc\(var\(--shelf-ribbon\) \* 80 \/ 60\)/);
  expect(cssRules().find((r) => r.selector === ":root" && r.body.includes("--shelf-ribbon:"))?.body).toMatch(
    /--shelf-ribbon:\s*calc\(var\(--corner\) \* 0\.74\)/,
  );
});
