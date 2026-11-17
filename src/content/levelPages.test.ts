import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DAYS } from "../games/feelings/days";
import { GROUPS } from "../games/feelings/groups";
import { PICTURES } from "../games/timer/content";
import { levelHref } from "../lib/levelAddress";
import { seoWords } from "../lib/seoText";
import { pageModuleFor, pageModules } from "../../tools/pageStart";
import { isUnfinished } from "./games";
import { LEVEL_IDS, levelPaths, pageOfLevel } from "./levelPages";
import { isNoIndex, MOVED_PATHS, NO_INDEX_PATHS, SEO_PAGES, SEO_TEXTS, seoFor } from "./seo";

// A level's address (`/abenteuer/schatzinsel/`) had no built page, so GitHub Pages answered a shared link with
// 404.html and status 404, and the running app found no words, title or canonical link for it. The build writes the
// game's page there too, and `seoFor` gives the game's entry (levelPages.ts). The level ids are a list of their own
// there, since the build must not load the games: these checks keep it to the games' real levels.

const SRC = join(import.meta.dir, "..");
const source = (file: string) => readFileSync(join(SRC, file), "utf8");

/** The ids of the cards a start screen lists in its code, between `from` and `to`. */
function idsIn(file: string, from: string, to: string) {
  const code = source(file);
  const start = code.indexOf(from);
  expect(start, `${file}: ${from}`).toBeGreaterThanOrEqual(0);
  const part = code.slice(start, code.indexOf(to, start));
  return [...part.matchAll(/\bid: "([^"]+)"/g)].map((match) => match[1]);
}

/** Each game's levels as the game itself has them: the ids of its start screen's cards. */
const REAL_LEVELS: Record<string, () => string[]> = {
  "/timer/": () => PICTURES.map((picture) => picture.id),
  // Days or feelings, by the row above the cards (FeelingsGame).
  "/gefuehle/": () => [...DAYS.map((day) => day.id), ...GROUPS.map((group) => group.id)],
  "/wie-gehts-dir/": () => [...source("games/feelings/MoodGame.tsx").matchAll(/^const (?:FEELING|NEED) = "([^"]+)";/gm)].map((match) => match[1]),
  "/kettenreaktion/": () => idsIn("games/marbles/catalog.ts", "export const LEVELS", "];"),
  "/kleine-abenteuer/": () => idsIn("games/elevator/ElevatorGame.tsx", "modes={[", "]}"),
  "/abenteuer/": () => idsIn("games/adventure/catalog.ts", "const STORIES", "];"),
};

test("every game whose route takes a level has its levels listed for the build, and no other", () => {
  const routes = [...source("App.tsx").matchAll(/<Route path="([^"]+)\/:level\?"/g)].map((match) => `/${match[1]}/`);
  expect(routes.length).toBeGreaterThan(5);
  expect(Object.keys(LEVEL_IDS).sort()).toEqual(routes.sort());
  expect(Object.keys(REAL_LEVELS).sort()).toEqual(routes.sort());
});

test.each(Object.keys(LEVEL_IDS))("%s: the listed levels are the game's own, in its cards' order", (game) => {
  const real = REAL_LEVELS[game]();
  expect(real.length).toBeGreaterThan(1);
  expect(LEVEL_IDS[game] as string[]).toEqual(real);
  // The address GameShell gives a level is the one that gets a page.
  expect(levelPaths(game)).toEqual(real.map((id) => levelHref(game, id)));
});

test("a level's address has its game's words, title and canonical link", () => {
  for (const game of Object.keys(LEVEL_IDS)) {
    const entry = SEO_TEXTS.find((page) => page.path === game);
    expect(entry, game).toBeDefined();
    for (const path of levelPaths(game)) {
      expect(pageOfLevel(path)).toBe(game);
      // The very entry of the game: its `path`, which SeoHead makes the canonical link, is the game's address.
      expect(seoFor(path), path).toBe(isUnfinished(game) ? undefined : entry);
      expect(seoFor(path.slice(0, -1)), path).toBe(seoFor(game));
      expect(isNoIndex(path)).toBe(isNoIndex(game));
      for (const language of ["de", "en", "ar"] as const) expect(seoWords(path, language), path).toEqual(seoWords(game, language));
    }
    // An address naming no level shows the game's cards (GameShell), so it is the game's page too.
    expect(pageOfLevel(`${game}gibt-es-nicht/`)).toBe(game);
  }
  expect(seoWords("/kettenreaktion/track/", "en")?.path).toBe("/kettenreaktion/");
  // Only one step below a game with levels: every other address stays what it is.
  expect(pageOfLevel("/zaehne")).toBe("/zaehne/");
  expect(pageOfLevel("/bilder/zoo/")).toBe("/bilder/zoo/");
  expect(pageOfLevel("/abenteuer/schatzinsel/mehr/")).toBe("/abenteuer/schatzinsel/mehr/");
  expect(seoFor("/bilder/zoo/")?.path).toBe("/bilder/zoo/");
  expect(seoFor("/zaehne/gibt-es-nicht/")).toBeUndefined();
  expect(isNoIndex("/management/")).toBe(true);
  expect(isNoIndex("/zaehne/")).toBe(false);
});

test("the build writes the game's page at every level's address, with the game's head, and keeps them out of the sitemap", () => {
  const build = readFileSync(join(SRC, "..", "tools", "build.ts"), "utf8");
  // The same html as the game's page (canonical link and hreflang name the game), written once more per level.
  expect(build).toContain("for (const path of [one.page.path, ...levelPaths(one.page.path)]) {");
  // The sitemap lists the pages themselves, never a level's address.
  expect(build).toMatch(/const urls = built\.map\(\(\{ language, page \}\) => `\s*<url><loc>\$\{urlOf\(page\.path, language\)\}<\/loc><\/url>`\);/);
  const modules = pageModules(source("App.tsx"));
  const pages = new Set([...SEO_PAGES.map((page) => page.path), ...NO_INDEX_PATHS, ...Object.keys(MOVED_PATHS)]);
  for (const game of Object.keys(LEVEL_IDS)) {
    // Each such game is a page the build writes (or, still being built, one it marks noindex), opened by its own code.
    expect(SEO_PAGES.some((page) => page.path === game) || isUnfinished(game), game).toBe(true);
    expect(pageModuleFor(game, modules), game).toBeString();
    // No level's page takes the place of another page.
    for (const path of levelPaths(game)) expect(pages.has(path), path).toBe(false);
    expect(new Set(LEVEL_IDS[game]).size, game).toBe(LEVEL_IDS[game].length);
    for (const id of LEVEL_IDS[game]) expect(id, game).toMatch(/^[a-z0-9-]+$/);
  }
});
