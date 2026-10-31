import { expect, test } from "bun:test";
import { join } from "node:path";

// The app replaces the built page's text when it starts, so Google, which reads the page after that, would find a
// start screen of four words: every menu (a `<main>` of the menus' kinds) shows the page's text below its first
// screen with <SeoText />. Pages for grown-ups only, which stay out of search results, need none.

const SRC = join(import.meta.dir, "..");
const NO_TEXT = ["pages/ManagementPage.tsx", "pages/LegalPage.tsx"];

test("every menu shows the text for search engines below its first screen", async () => {
  const menus: string[] = [];
  for (const file of new Bun.Glob("**/*.tsx").scanSync({ cwd: SRC })) {
    const code = await Bun.file(join(SRC, file)).text();
    if (/<main className=\{?[`"](home|start-screen)\b/.test(code) && !NO_TEXT.includes(file)) menus.push(file);
  }
  expect(menus.length).toBeGreaterThan(4);
  const without = [];
  for (const file of menus) if (!(await Bun.file(join(SRC, file)).text()).includes("<SeoText")) without.push(file);
  expect(without).toEqual([]);
});
