import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { BOOT_WAIT, chunkClosure, countedHosts, pageModuleFor, pageModules } from "../tools/pageStart";
import { PageLoading } from "./components/PageLoading";
import { SEO_PAGES } from "./content/seo";

// A slow start shows the page's title on paper with a paw track (never a dark, empty screen), and a built page fetches
// its own page's code together with the start's (tools/pageStart.ts, tools/build.ts).

const app = readFileSync(join(import.meta.dir, "App.tsx"), "utf8");
const modules = pageModules(app);

test("every page for search engines knows the page code it opens with, so its built page fetches that at once", () => {
  const missing = SEO_PAGES.filter(({ path }) => {
    const module = pageModuleFor(path, modules);
    return (
      module === undefined || (module !== null && !(existsSync(join(import.meta.dir, "pages", `${module}.tsx`)) && app.includes(`import("@/pages/${module}")`)))
    );
  }).map(({ path }) => path);
  expect(missing).toEqual([]);
  expect(modules.get("/zaehne/")).toBe("TeethPage");
});

test("a page whose code is still loading shows the paw track on paper, the same as a built page before the app starts", () => {
  expect(app).not.toContain("fallback={null}");
  expect(app).toContain("fallback={<PageLoading />}");
  const markup = renderToStaticMarkup(<PageLoading />);
  expect(markup).toContain('class="boot"');
  expect(markup).toContain(BOOT_WAIT);
  expect(readFileSync(join(import.meta.dir, "..", "tools", "build.ts"), "utf8")).toContain('<div class="boot"><h1>');
});

test("a chunk's closure follows its static imports, never a page loaded later", async () => {
  const code: Record<string, string> = {
    "static/Page.a1.js": 'import{x}from"/static/shared.b2.js";import"/static/side.c3.js";const later=()=>import("/static/Other.d4.js");',
    "static/shared.b2.js": 'import{y}from"/static/deep.e5.js";',
    "static/side.c3.js": "",
    "static/deep.e5.js": "",
  };
  const files = await chunkClosure("static/Page.a1.js", async (file) => code[file] ?? "", "/static/");
  expect(files.sort()).toEqual(["static/Page.a1.js", "static/deep.e5.js", "static/shared.b2.js", "static/side.c3.js"]);
});

test("Umami counts on the site's host with and without www, wherever Pages serves it", () => {
  expect(countedHosts("https://www.funforboth.com/")).toBe("www.funforboth.com,funforboth.com");
  expect(countedHosts("https://funforboth.com/")).toBe("funforboth.com,www.funforboth.com");
});
