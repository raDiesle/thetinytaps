// How a built page starts quickly and visibly (tools/build.ts): what it shows before the app's code has loaded, and
// which chunks it fetches at once instead of one after another. Kept apart from build.ts, which builds when imported,
// so src/pageStart.test.ts can check it.

/**
 * The paw track that comes and goes while the app's code loads, under the page's title on a sheet of paper (`.boot` in
 * book.css). The same markup as `PageLoading` (src/components/PageLoading.tsx), which shows while a page's own code
 * loads later on: a slow start looks like a book being opened, never like a dark, empty screen (user feedback,
 * November 2026: Zähne putzen opened from a bookmark stood dark for seconds on a phone).
 */
export const BOOT_WAIT = '<div class="boot-wait" aria-hidden="true"><span></span><span></span><span></span></div>';

/**
 * The lazy-loaded page modules of App.tsx by the addresses they open at (`/zaehne/` → `TeethPage`), read from its
 * `page(() => import("@/pages/TeethPage"), "TeethPage", "/zaehne/")` lines.
 */
export function pageModules(appSource: string) {
  const modules = new Map<string, string>();
  for (const [, module, paths] of appSource.matchAll(/page\(\(\) => import\("@\/pages\/(\w+)"\), "\w+"((?:, "[^"]+")*)\)/g))
    for (const [, path] of paths.matchAll(/"([^"]+)"/g)) modules.set(path, module);
  return modules;
}

/**
 * The page module a page of seo.ts opens with, or null where its code is part of the start (the shelf, a book's table
 * of contents). A picture of Lebendige Bilder (`/bilder/baustelle/`) opens `ScenePage`, which has no address of its
 * own to preload by.
 */
export function pageModuleFor(path: string, modules: Map<string, string>) {
  if (path === "/" || path.startsWith("/spiele/")) return null;
  return modules.get(path) ?? (/^\/bilder\/[^/]+\/$/.test(path) ? "ScenePage" : undefined);
}

/**
 * A chunk with every chunk it imports statically, one level after another (`from"/static/x.js"`, `import"/static/x.js"`;
 * never the `import("…")` of a page loaded later). `read` gives a chunk's code by its file (`static/x.js`), `prefix` is
 * how the code names a file (`/static/`, with the base path).
 */
export async function chunkClosure(first: string, read: (file: string) => Promise<string>, prefix: string) {
  const seen = new Set<string>();
  const queue = [first];
  while (queue.length) {
    const file = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const code = await read(file);
    for (const [, name] of code.matchAll(new RegExp(`(?:from|import)\\s*"${prefix.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}([\\w.-]+\\.js)"`, "g")))
      queue.push(`static/${name}`);
  }
  return [...seen];
}

/**
 * The hosts Umami counts on (`data-domains`): the site's own host and its twin with or without „www.“. Umami drops
 * every visit on a host not listed, and the site is served on whichever of the two the repository's Pages setting
 * names while the other only redirects there: in November 2026 `siteUrl` said www.funforboth.com while Pages served
 * funforboth.com, and Umami counted no visitor at all. Listing both counts them wherever the site is served.
 */
export function countedHosts(siteUrl: string): string {
  const host = new URL(siteUrl).hostname;
  const twin = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
  return `${host},${twin}`;
}
