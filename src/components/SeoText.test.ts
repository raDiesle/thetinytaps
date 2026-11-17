import { expect, test } from "bun:test";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { seoWords } from "../lib/seoText";
import { WordsPanel } from "./SeoText";

// The app replaces the built page's text when it starts, so Google, which reads the page after that, would find a
// start screen of four words: every menu (a `<main>` of the menus' kinds) shows the page's text below its first
// screen with <SeoText />. Pages for grown-ups only, which stay out of search results, need none, and the home page,
// the bookshelf, has its text behind the carving's „mehr …“ (RoomNotes).

const SRC = join(import.meta.dir, "..");
const NO_TEXT = ["pages/ManagementPage.tsx", "pages/PicturesPage.tsx", "pages/LegalPage.tsx"];

test("every menu shows the text for search engines below its first screen", async () => {
  const menus: string[] = [];
  for (const file of new Bun.Glob("**/*.tsx").scanSync({ cwd: SRC })) {
    const code = await Bun.file(join(SRC, file)).text();
    if (/<main className=\{?[`"](home|start-screen)\b/.test(code) && !NO_TEXT.includes(file)) menus.push(file);
  }
  expect(menus.length).toBeGreaterThan(3);
  const without = [];
  for (const file of menus) if (!(await Bun.file(join(SRC, file)).text()).includes("<SeoText")) without.push(file);
  expect(without).toEqual([]);
});

// A page has exactly one <h1>: a menu's is its title (MenuHead) and the shelf's the app's name (Logo), so the words for
// search engines stand under an <h2> there. Only a game playing, which has no title in the page, makes theirs the <h1>.
test("the words' title is an <h2> below a menu's title, and the page's <h1> only where a playing game asks for it", async () => {
  const panel = (path: string, main: boolean) => {
    const words = seoWords(path, "de");
    return words ? renderToStaticMarkup(createElement(WordsPanel, { words, main })) : "";
  };
  expect(panel("/zaehne/", false)).toMatch(/^<section class="seo-text"><h2>[^<]+<\/h2><p>/);
  expect(panel("/zaehne/", true)).toMatch(/^<section class="seo-text"><h1>[^<]+<\/h1><p>/);
  // A level's address shows its game's words (seoFor).
  expect(panel("/kettenreaktion/track/", true)).toBe(panel("/kettenreaktion/", true));
  expect(panel("/kettenreaktion/track/", true)).toContain("<h1>");
  // The words' own panel is an <h2> unless asked, and only a playing game asks.
  expect(await Bun.file(join(SRC, "components/SeoText.tsx")).text()).toContain("export function SeoWords({ main = false }");
  const asking: string[] = [];
  for (const file of new Bun.Glob("**/*.tsx").scanSync({ cwd: SRC })) {
    if (/<SeoWords\s+main\b/.test(await Bun.file(join(SRC, file)).text())) asking.push(file);
  }
  expect(asking).toEqual(["components/GameShell.tsx"]);
});
