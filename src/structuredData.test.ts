import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { structuredData, structuredDataTags, trailOf } from "../tools/structuredData";
import { CATEGORIES, hasPage } from "./content/games";
import { languagePrefix, NO_INDEX_PATHS, MOVED_PATHS, SEO_LANGUAGES, SEO_PAGES, SITE_NAME } from "./content/seo";

// The structured data in a built page's head (tools/structuredData.ts): what the site is on the home pages, and on
// every other page its way from the home page (BreadcrumbList), which Google shows in place of the bare address.

const SITE = "https://www.littlestepstogrow.com";
const urlOf = (language: (typeof SEO_LANGUAGES)[number]) => (path: string) => `${SITE}${languagePrefix(language)}${path}`;
const titleOf = (path: string) => `title of ${path}`;
const facts = (path: string, language: (typeof SEO_LANGUAGES)[number] = "de") => ({
  path,
  language,
  text: { title: titleOf(path), description: "what it is", text: "" },
  titleOf,
  urlOf: urlOf(language),
});

/** The steps of a page's breadcrumbs, as address and name. */
function crumbs(path: string, language: (typeof SEO_LANGUAGES)[number] = "de") {
  const [data] = structuredData(facts(path, language)) as { "@type": string; itemListElement: { position: number; name: string; item: string }[] }[];
  expect(data["@type"]).toBe("BreadcrumbList");
  expect(data.itemListElement.map((step) => step.position)).toEqual(data.itemListElement.map((_, i) => i + 1));
  return data.itemListElement.map((step) => [step.item, step.name]);
}

test("a page's breadcrumbs lead from the home page over its book to the game, and on to a picture of Lebendige Bilder", () => {
  // A game in a book with a table of contents.
  expect(trailOf("/buchstaben/")).toEqual(["/", "/spiele/buchstaben-zahlen/", "/buchstaben/"]);
  // A picture below its game.
  expect(trailOf("/bilder/zoo/")).toEqual(["/", "/spiele/lebendige-welten/", "/bilder/", "/bilder/zoo/"]);
  // A book's own page, and the Alltagshelfer, each a book of its own on the shelf with no page between.
  expect(trailOf("/spiele/zuordnen/")).toEqual(["/", "/spiele/zuordnen/"]);
  expect(trailOf("/zaehne/")).toEqual(["/", "/zaehne/"]);
  expect(trailOf("/timer/")).toEqual(["/", "/timer/"]);
  expect(crumbs("/bilder/zoo/", "en")).toEqual([
    [`${SITE}/en/`, SITE_NAME],
    [`${SITE}/en/spiele/lebendige-welten/`, "title of /spiele/lebendige-welten/"],
    [`${SITE}/en/bilder/`, "title of /bilder/"],
    [`${SITE}/en/bilder/zoo/`, "title of /bilder/zoo/"],
  ]);
});

test("every step of every page's breadcrumbs is a page the build writes, in the page's own language", () => {
  for (const language of SEO_LANGUAGES) {
    const written = new Set(SEO_PAGES.map((page) => urlOf(language)(page.path)));
    for (const page of SEO_PAGES.filter((page) => page.path !== "/")) {
      const steps = crumbs(page.path, language);
      expect(steps.length, page.path).toBeGreaterThanOrEqual(2);
      expect(steps[0][0]).toBe(urlOf(language)("/"));
      expect(steps.at(-1)?.[0]).toBe(urlOf(language)(page.path));
      for (const [url] of steps) expect(written.has(url), `${page.path}: ${url}`).toBe(true);
      expect(new Set(steps.map(([url]) => url)).size, page.path).toBe(steps.length);
    }
  }
  // Every game of a book with a table of contents passes that book.
  for (const category of CATEGORIES.filter(hasPage))
    for (const game of category.games.filter((game) => !game.unfinished)) expect(trailOf(game.href), game.href).toContain(`/spiele/${category.id}/`);
});

test("the home pages say what the site is, and no other page", () => {
  const types = (path: string) => (structuredData(facts(path)) as { "@type": string }[]).map((data) => data["@type"]);
  expect(types("/")).toEqual(["WebSite", "WebApplication"]);
  expect(types("/zaehne/")).toEqual(["BreadcrumbList"]);
});

test("the tags hold valid JSON that no text can end early", () => {
  const tags = structuredDataTags({ ...facts("/zaehne/"), titleOf: () => 'Zähne </script><b> & "putzen"' });
  expect(tags).toHaveLength(1);
  const [, json] = /^<script type="application\/ld\+json">(.*)<\/script>$/.exec(tags[0]) ?? [];
  expect(json).not.toContain("<");
  expect(JSON.parse(json).itemListElement[1].name).toBe('Zähne </script><b> & "putzen"');
});

test("only the pages for search engines get them: the build writes them in `headTags`, never into a noindex or moved page", () => {
  const build = readFileSync(join(import.meta.dir, "..", "tools", "build.ts"), "utf8");
  expect(build.match(/structuredDataTags\(/g)).toHaveLength(1);
  const headTags = build.slice(build.indexOf("function headTags("), build.indexOf("async function writePages("));
  expect(headTags).toContain("structuredDataTags(");
  // `headTags` is called for the built pages of SEO_PAGES alone, which hold no noindex and no moved address.
  expect(build.match(/headTags\(/g)).toHaveLength(2);
  const found = SEO_PAGES.map((page) => page.path);
  for (const path of [...NO_INDEX_PATHS, ...Object.keys(MOVED_PATHS)]) expect(found).not.toContain(path);
});
