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
 * `page(() => import("@/pages/TeethPage"), "TeethPage", "/zaehne/")` lines (a loader may be wrapped in `withTexts`, a call
 * broken over several lines by the formatter).
 */
export function pageModules(appSource: string) {
  const modules = new Map<string, string>();
  for (const [, module, paths] of appSource.matchAll(
    /page\(\s*(?:withTexts\("\w+",\s*)?\(\) => import\("@\/pages\/(\w+)"\)\)?,\s*"\w+"((?:,\s*"[^"]+")*),?\s*\)/g,
  ))
    for (const [, path] of paths.matchAll(/"([^"]+)"/g)) modules.set(path, module);
  return modules;
}

/**
 * The part of the texts each page module loads with its code (`TogetherPage` → `together`), read from App.tsx's
 * `page(withTexts("together", () => import("@/pages/TogetherPage")), …)` lines: its chunks are `texts-<language>-<part>`.
 */
export function pageTextsParts(appSource: string) {
  const parts = new Map<string, string>();
  for (const [, part, module] of appSource.matchAll(/withTexts\("(\w+)",\s*\(\) => import\("@\/pages\/(\w+)"\)\)/g)) parts.set(module, part);
  return parts;
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
 * The chunk of each picture of Lebendige Bilder by its id (`bauernhof` → `Bauernhof`), read from the
 * `{ id: "bauernhof", …, load: () => import("./bauernhof/Bauernhof")… }` entries of src/games/scenes/catalog.ts. Every
 * picture is a chunk of its own that `ScenePage` loads only once it runs, so a picture's built page preloads it too.
 */
export function sceneModules(catalogSource: string) {
  const scenes = new Map<string, string>();
  for (const [, id, module] of catalogSource.matchAll(/\{\s*id:\s*"([\w-]+)"[^{}]*?import\("\.\/[\w/]*?(\w+)"\)/g)) scenes.set(id, module);
  return scenes;
}

/** The picture's own chunk a page of seo.ts needs besides its page module (`/bilder/bauernhof/` → `Bauernhof`), if any. */
export function sceneModuleFor(path: string, scenes: Map<string, string>) {
  const id = /^\/bilder\/([^/]+)\/$/.exec(path)?.[1];
  return id === undefined ? undefined : scenes.get(id);
}

/**
 * A chunk with every chunk it imports statically, one level after another (`from"/static/x.js"`, `import"/static/x.js"`).
 * `read` gives a chunk's code by its file (`static/x.js`), `prefix` is how the code names a file (`/static/`, with the
 * base path). With `later`, also the chunks it loads later itself (`import("/static/x.js")`), but none of `stop` (the
 * other pages, which a book's copy leaves to their own books) unless it is `first` itself.
 */
export async function chunkClosure(
  first: string,
  read: (file: string) => Promise<string>,
  prefix: string,
  { later = false, stop }: { later?: boolean; stop?: ReadonlySet<string> } = {},
) {
  const named = new RegExp(`(?:from|import)\\s*${later ? "\\(?" : ""}"${prefix.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}([\\w.-]+\\.js)"`, "g");
  const seen = new Set<string>();
  const queue = [first];
  while (queue.length) {
    const file = queue.shift()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const [, name] of (await read(file)).matchAll(named)) {
      const chunk = `static/${name}`;
      if (!stop?.has(chunk) || chunk === first) queue.push(chunk);
    }
  }
  return [...seen];
}

/**
 * Whether a file of out/ carries a hash of its own bytes in its name (Bun's assets – recordings, pictures – and the
 * fonts `fontsAsFiles` takes out): the build then knows it by its name alone, skipping it when out/ already has it at
 * its size and leaving its bytes out of the worker's version (R-P10). Never the code: a chunk's text names other
 * chunks, and every file outside static/ (public/, the pages) has no hash at all.
 */
export const namedByOwnBytes = (file: string) => /^static\/[^/]+\.[a-z0-9]+\.(mp3|webp|png|jpe?g|svg|woff2?)$/.test(file);

/** A font moved out of a stylesheet (`fontsAsFiles`): its path in out/ (`static/<name>.<hash>.woff2`) and its bytes. */
export interface FontFile {
  path: string;
  bytes: Uint8Array;
}

/**
 * Bun's CSS bundler always embeds a font a stylesheet names as base64 (`url(data:font/woff2;base64,…)`), whatever
 * loader is set: Fredoka's two parts made 36 of the start stylesheet's 65 KB gz, and that stylesheet holds up every
 * page's first picture, while `font-display: swap` lets the text show in the device's font until the file has come
 * (R-P5). So the build takes each one out again into a file named by its content, and the stylesheet names that file.
 * `names` gives a font's name by the sha256 of its bytes (`fredoka-latin-wght-normal`, the source file's), `prefix`
 * how the stylesheet names a file (`/static/`, with the base path).
 */
export function fontsAsFiles(css: string, names: ReadonlyMap<string, string>, prefix: string) {
  const files: FontFile[] = [];
  const out = css.replace(/url\(\s*(["']?)data:font\/woff2;base64,([A-Za-z0-9+/=]+)\1\s*\)/g, (_, _quote: string, base64: string) => {
    const bytes = Uint8Array.from(Buffer.from(base64, "base64"));
    const digest = new Bun.CryptoHasher("sha256").update(bytes).digest("hex");
    const path = `static/${names.get(digest) ?? "font"}.${digest.slice(0, 8)}.woff2`;
    if (!files.some((file) => file.path === path)) files.push({ path, bytes });
    return `url(${prefix}${path.slice("static/".length)})`;
  });
  return { css: out, files };
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

/**
 * A little script for the very top of a built page's head that starts fetching the texts of the language the app will
 * play in together with the start's code. The app loads them before its first screen (loadAppLanguage), but only finds
 * out which once its own code has run: a visitor whose browser speaks English, on the German start page, waited a
 * second longer for the shelf on a slow phone, the texts coming only after the start's code (November 2026). It picks
 * the language as `load()` in src/lib/language.ts does – the one saved (`key`), else for a search engine (`crawler`)
 * the address's (`address`), else the first of the browser's languages the app speaks, else English. `chunks` names,
 * for each language the app speaks, its texts chunk and the chunks it imports (German's holds only the translations of
 * what is written English first).
 * It stands before the stylesheet: a script after one waits until the stylesheet has loaded.
 */
export function textsPreload(chunks: Record<string, string[]>, address: string, { key, crawler }: { key: string; crawler: RegExp }) {
  const code = `(function(c,a,k,r){var l,w,i,x,n=navigator;try{l=localStorage.getItem(k)}catch(e){}if(l!=="de"&&!c[l]){l="de";w=r.test(n.userAgent)?[a]:[].concat(n.languages&&n.languages.length?n.languages:n.language?[n.language]:[],"en");for(i=0;i<w.length;i++){x=String(w[i]).toLowerCase().split("-")[0];if(x==="de"||c[x]){l=x;break}}}(c[l]||[]).forEach(function(f){var t=document.createElement("link");t.rel="modulepreload";t.crossOrigin="anonymous";t.href=f;document.head.appendChild(t)})})(${JSON.stringify(chunks)},${JSON.stringify(address)},${JSON.stringify(key)},${crawler.toString()})`;
  return `<script>${code}</script>`;
}
