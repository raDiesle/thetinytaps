// The addresses below a game's own: every level of a game with cards has one (`/abenteuer/schatzinsel/`,
// src/lib/levelAddress.ts), which grown-ups share and bookmark. GitHub Pages answers an address without a built page
// with 404.html and status 404, so the build writes the game's page at each of them too, with the game's canonical
// link (tools/build.ts), and the running app takes the game's words for search engines there (`seoFor`).
// Only ids here, no imports: tools/build.ts and seo.ts read this file, and a game's own data would bring its pictures
// and code along. `levelPages.test.ts` checks every list against the game's real levels, so none falls behind.

/**
 * The levels of every game whose route takes one (`<Route path="abenteuer/:level?">` in App.tsx), by the game's
 * address, in the order of its cards. A new game with levels, or a new level, is added here.
 */
export const LEVEL_IDS: Record<string, readonly string[]> = {
  "/timer/": ["disc", "sand", "candle", "apple", "flower", "pizza", "clock", "tidy", "boxes", "road", "train", "caterpillar", "sunset", "swap", "seesaw"],
  // Its cards are the days of the little bear or, by the row above them, the feelings.
  "/gefuehle/": [
    ...Array.from({ length: 15 }, (_, i) => `tag-${i + 1}`),
    "traurig",
    "wuetend",
    "frust",
    "angst",
    "freude",
    "muede",
    "streit",
    "freunde",
    "igitt",
  ],
  "/wie-gehts-dir/": ["gefuehl", "brauche"],
  "/kettenreaktion/": [
    "track",
    "colortrack",
    "snowtrack",
    "spacetrack",
    "slidetrack",
    "sitetrack",
    "machine",
    "sneeze",
    "kitchen",
    "garden",
    "pegs",
    "topple",
    "building",
    "water",
    "circus",
    "space",
    "light",
    "bath",
    "farm",
    "night",
    "tidy",
  ],
  "/kleine-abenteuer/": [
    "hunger",
    "gutenacht",
    "pfuetzen",
    "drachen",
    "ball",
    "ballon",
    "lok",
    "floss",
    "sandburg",
    "picknick",
    "katze",
    "schneemann",
    "feuerwehr",
    "brief",
    "baecker",
    "garten",
    "krankenwagen",
    "korn",
    "haus",
    "muell",
  ],
  "/abenteuer/": ["schatzinsel", "wolkenreise", "feuerwehr"],
};

const withSlash = (pathname: string) => (pathname.endsWith("/") ? pathname : `${pathname}/`);

/**
 * The page an address belongs to: for an address one step below a game with levels that game's own
 * (`/abenteuer/schatzinsel/` → `/abenteuer/`), also where it names no level, since the game then shows its cards
 * (GameShell); any other address as it is, with its slash at the end.
 */
export function pageOfLevel(pathname: string): string {
  const path = withSlash(pathname);
  const game = /^(\/[^/]+\/)[^/]+\/$/.exec(path)?.[1];
  return game && LEVEL_IDS[game] ? game : path;
}

/** The addresses of a game's levels, each of which gets the game's built page; none for a page without levels. */
export const levelPaths = (game: string): string[] => (LEVEL_IDS[game] ?? []).map((id) => `${game}${id}/`);
