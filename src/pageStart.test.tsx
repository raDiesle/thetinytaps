import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BOOT_WAIT,
  chunkClosure,
  countedHosts,
  pageModuleFor,
  pageModules,
  pageTextsParts,
  sceneModuleFor,
  sceneModules,
  textsPreload,
} from "../tools/pageStart";
import { SCENE_ENTRIES } from "./games/scenes/catalog";
import { PageLoading } from "./components/PageLoading";
import { SEO_LANGUAGES, SEO_PAGES } from "./content/seo";
import { TEXTS_PARTS } from "./content/texts";
import { APP_LANGUAGES } from "./lib/language";
import { CRAWLER, LANGUAGE_KEY, playLanguage } from "./lib/locale";

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

test("every part of the texts is loaded with a page, and that page's built page fetches it in the visitor's language", () => {
  const parts = pageTextsParts(app);
  expect(parts.get("TogetherPage")).toBe("together");
  expect(modules.get("/zusammen/")).toBe("TogetherPage");
  expect([...new Set(parts.values())].sort()).toEqual([...TEXTS_PARTS].sort());
  const build = readFileSync(join(import.meta.dir, "..", "tools", "build.ts"), "utf8");
  expect(build).toContain("textsOf(template, one.language, one.page.path)");
});

test("every picture of Lebendige Bilder knows its own chunk, so its built page fetches the picture with the start", () => {
  const scenes = sceneModules(readFileSync(join(import.meta.dir, "games", "scenes", "catalog.ts"), "utf8"));
  expect([...scenes.keys()].sort()).toEqual(SCENE_ENTRIES.map((entry) => entry.id).sort());
  expect(scenes.get("bauernhof")).toBe("Bauernhof");
  expect(scenes.get("winterbaustelle")).toBe("WinterBaustelle");
  const scenePages = SEO_PAGES.filter(({ path }) => pageModuleFor(path, modules) === "ScenePage");
  expect(scenePages.length).toBeGreaterThan(10);
  for (const { path } of scenePages) {
    const module = sceneModuleFor(path, scenes);
    expect({ path, found: !!module && existsSync(join(import.meta.dir, "games", "scenes", path.split("/")[2], `${module}.tsx`)) }).toEqual({
      path,
      found: true,
    });
  }
  expect(sceneModuleFor("/bilder/", scenes)).toBeUndefined();
  expect(sceneModuleFor("/zaehne/", scenes)).toBeUndefined();
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
  expect(countedHosts("https://www.littlestepstogrow.com/")).toBe("www.littlestepstogrow.com,littlestepstogrow.com");
  expect(countedHosts("https://littlestepstogrow.com/")).toBe("littlestepstogrow.com,www.littlestepstogrow.com");
});

/** What the script of `textsPreload` asks the browser to fetch, for a visitor with these languages, saved choice and user agent. */
function preloadedBy(script: string, visitor: { languages: string[]; saved?: string; userAgent?: string }) {
  const fetched: string[] = [];
  const code = script.replace(/^<script>/, "").replace(/<\/script>$/, "");
  const storage = { getItem: (key: string) => (key === LANGUAGE_KEY ? (visitor.saved ?? null) : null) };
  const document = { createElement: () => ({}), head: { appendChild: (link: { rel: string; href: string }) => fetched.push(`${link.rel} ${link.href}`) } };
  const navigator = { languages: visitor.languages, language: visitor.languages[0], userAgent: visitor.userAgent ?? "Mozilla/5.0 (Linux; Android 10)" };
  new Function("navigator", "localStorage", "document", code)(navigator, storage, document);
  return fetched;
}

test("a built page fetches the texts of the language the app will play in at once, chosen as the app chooses it", () => {
  // The pages for search engines come in exactly the app's languages, so every language the app plays in has a chunk.
  expect([...SEO_LANGUAGES] as string[]).toEqual(APP_LANGUAGES);
  const chunks = Object.fromEntries(APP_LANGUAGES.map((id) => [id, [`/static/texts-${id}.x.js`, `/static/shared-${id}.y.js`]]));
  const crawler = "Mozilla/5.0 (Linux; Android 6.0.1) Chrome/130 Mobile Safari/537.36 (compatible; Googlebot/2.1)";
  const visitors = [
    { languages: ["de-DE", "en"] },
    { languages: ["en-US"] },
    { languages: ["fr-FR", "es-ES"] },
    { languages: ["fr-FR"] },
    { languages: ["zh-Hans-CN"] },
    { languages: ["en-US"], saved: "de" },
    { languages: ["de-DE"], saved: "ru" },
    { languages: ["de-DE"], saved: "it" },
    { languages: ["en-US"], userAgent: crawler },
  ];
  for (const address of ["de", "ar"] as const) {
    const script = textsPreload(chunks, address, { key: LANGUAGE_KEY, crawler: CRAWLER });
    expect(script).not.toContain("</script><");
    for (const visitor of visitors) {
      const saved = visitor.saved && APP_LANGUAGES.includes(visitor.saved as (typeof APP_LANGUAGES)[number]) ? visitor.saved : undefined;
      const original = { ...globalThis.navigator };
      Object.defineProperty(globalThis.navigator, "languages", { value: visitor.languages, configurable: true });
      const app = saved ?? playLanguage(APP_LANGUAGES, false, CRAWLER.test(visitor.userAgent ?? ""), address);
      Object.defineProperty(globalThis.navigator, "languages", { value: original.languages, configurable: true });
      const expected = chunks[app].map((file) => `modulepreload ${file}`);
      expect({ address, visitor, fetched: preloadedBy(script, visitor) }).toEqual({ address, visitor, fetched: expected });
    }
  }
});

test("the texts' script stands before the stylesheet in every built page's head, which would hold it back", () => {
  const build = readFileSync(join(import.meta.dir, "..", "tools", "build.ts"), "utf8");
  expect(build).toMatch(/\$\{textsPreload\(texts, address, [^\n]*\)\}\$\{stylesheet\}/);
  expect(build).toContain("const stylesheet = '<link rel=\"stylesheet\"';");
});
