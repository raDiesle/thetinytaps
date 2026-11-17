import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

// The shelf's option menus (play time, language, offline, „mehr …“) open in a portal at the end of the page: without a
// dialog's role and the focus moved into it, a keyboard and a screen reader stayed on the shelf behind and never
// reached them.

const source = readFileSync("src/components/HomeOptions.tsx", "utf8");

test("an open menu is a dialog named after its thing, which takes the focus and gives it back", () => {
  expect(source).toContain('className="home-menu-panel" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}');
  expect(source).toContain("panel.current?.focus({ preventScroll: true });");
  expect(source).toContain("return () => opener.current?.focus({ preventScroll: true });");
  expect(source).toMatch(/<button ref=\{opener\} type="button" className=\{className\} aria-expanded=\{open\}/);
  expect(source).toContain('if (e.key === "Escape") setOpen(false);');
});

test("the menu shows no ring of its own while it holds the focus", () => {
  const css = readFileSync("src/styles/home-options.css", "utf8");
  const panel = css.match(/\n\.home-menu-panel \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(panel).toMatch(/outline: none;/);
});

test("a closed menu that keeps its text for search engines is no dialog and takes no focus", () => {
  // The dialog is drawn only while open; what is kept while closed is a hidden box of plain text.
  const sheet = source.match(/const sheet = open && \(([\s\S]*?)\n {2}\);/)?.[1] ?? "";
  expect(sheet).toContain('role="dialog"');
  expect(source.split('role="dialog"').length).toBe(2);
  expect(source.split("tabIndex").length).toBe(2);
  expect(source).toContain("{keep && !open && <div hidden>{children}</div>}");
});
