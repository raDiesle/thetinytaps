import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { LazyPictures, Pic } from "@/games/rewards/pictures";

// Only what the visitor picks is loaded (user request, November 2026; root CLAUDE.md): menus once loaded every card's
// page while they waited, and start screens a level in idle moments, for every visitor.

const files = (pattern: string) => [...new Bun.Glob(pattern).scanSync("src")].filter((file) => !/\.test\.tsx?$/.test(file));
const read = (file: string) => readFileSync(`src/${file}`, "utf8");

test("no menu or start screen loads pages or levels while it waits", () => {
  const menus = [...files("pages/*.tsx"), ...files("components/*.tsx"), ...files("games/*/*Game.tsx")];
  const waiting = menus.filter((file) => {
    const code = read(file);
    // Loading while the page waits goes through afterLoad or the old usePreloadPages; a menu never needs either.
    return /\busePreloadPages\b|\bprefetchLevel\b/.test(code) || (/\bafterLoad\b/.test(code) && /\b(preloadPage|\.load\(|import\()/.test(code));
  });
  expect(waiting).toEqual([]);
});

test("only the loader itself walks every page", () => {
  const users = files("**/*.{ts,tsx}").filter((file) => file !== "lib/preloadPages.ts" && /\bpagePaths\(/.test(read(file)));
  expect(users).toEqual([]);
});

test("the Belohnungstafel's small and folded pictures load lazily, a chart's and a print's at once", () => {
  expect(renderToStaticMarkup(<Pic src="x.webp" emoji="⭐" />)).not.toContain("loading");
  expect(
    renderToStaticMarkup(
      <LazyPictures value={true}>
        <Pic src="x.webp" emoji="⭐" />
      </LazyPictures>,
    ),
  ).toContain('loading="lazy"');
  // The folded „Weitere Einstellungen“ stands inside it.
  expect(read("games/rewards/ChartEditor.tsx")).toMatch(/<LazyPictures value=\{true\}>\{more\}<\/LazyPictures>/);
});
