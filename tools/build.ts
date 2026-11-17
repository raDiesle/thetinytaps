import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  fullTitle,
  languagePrefix,
  MOVED_PATHS,
  NO_INDEX_PATHS,
  type PageSeo,
  type PageText,
  PREVIEW_IMAGE,
  SEO_LANGUAGES,
  SEO_PAGES,
  type SeoLanguage,
  type SeoTranslation,
  SITE_NAME,
  SITE_PROMISE,
} from "../src/content/seo";
import { SEO_AR } from "../src/content/seo.ar";
import { SEO_EN } from "../src/content/seo.en";
import { SEO_ES } from "../src/content/seo.es";
import { SEO_HI } from "../src/content/seo.hi";
import { SEO_RU } from "../src/content/seo.ru";
import { SEO_ZH } from "../src/content/seo.zh";
import { shelfEntryOf } from "../src/content/games";
import { levelPaths } from "../src/content/levelPages";
import { appPlugin, PRODUCTION } from "./appPlugin";
import { isBackgroundSong, isVoice, languageOf, needsEnglish, type OfflineManifest, type OfflinePart } from "../src/lib/offlineParts";
import { BOOT_WAIT, chunkClosure, countedHosts, fontsAsFiles, pageModuleFor, pageModules, sceneModuleFor, sceneModules, textsPreload } from "./pageStart";
import { structuredDataTags } from "./structuredData";
import { CRAWLER, LANGUAGE_KEY } from "../src/lib/locale";

// `bun run build`: the site for players in out/, built by Bun from index.html (which starts src/index.tsx).
// After bundling it adds what GitHub Pages and an offline app need: public/, the manifest and icon links,
// an own index.html for every page search engines should find, 404.html, sitemap.xml, robots.txt and sw.js.

const ROOT = join(import.meta.dir, "..");
const OUT = join(ROOT, "out");

// The site lives at the root of its domain; PUBLIC_BASE_PATH only to try it under a folder (/<repo>/).
const base = (process.env.PUBLIC_BASE_PATH || "/").replace(/\/$/, "");

// Where the site is online, for links that search engines keep (canonical, sitemap).
// GitHub Pages serves it on its own domain (repo settings → Pages, DNS in tools/funforboth.com.zone).
const siteUrl = `${process.env.SITE_ORIGIN || "https://www.funforboth.com"}${base}`;

// READABLE=1 (`bun run perf --profile`): the same build with its names and lines kept, so a profile shows where time goes.
const minify = process.env.READABLE === "1" ? { syntax: true, whitespace: false, identifiers: false } : true;

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The address of a page or file inside the site, with the base path. */
const href = (path: string) => `${base}${path}`;

/** Replaces exactly one match, so a changed index.html (or src/sw.js, `where`) fails the build instead of silently losing a tag. */
function replaceOnce(html: string, search: RegExp | string, replacement: string, where = "index.html") {
  if (!(typeof search === "string" ? html.includes(search) : search.test(html))) throw new Error(`build: ${search} not found in ${where}`);
  return html.replace(search, () => replacement);
}

/** Every file written into out/ after its one walk (`walkOut`), as paths relative to it with "/". */
const written = new Set<string>();

/** Writes a file into out/ (its folders too) and notes it for the closing count. */
async function put(file: string, data: string | Uint8Array) {
  await mkdir(join(OUT, file, ".."), { recursive: true });
  await writeFile(join(OUT, file), data);
  written.add(file);
}

/** All files below a folder, as paths relative to it with "/". */
async function filesIn(dir: string) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(dir.length + 1).split("\\").join("/"))
    .sort();
}

/** out/ as bundled, walked once (`walkOut`): its files, each chunk by its name, and their code read once. */
interface Built {
  /** Every file, relative to out/ with "/", sorted. */
  files: string[];
  /** A chunk's file by its name (`TeethPage` → `static/TeethPage.<hash>.js`), or undefined; never two. */
  chunkOf(name: string): string | undefined;
  /** A file's text, read once. */
  read(file: string): Promise<string>;
  /** `chunkClosure` of a chunk over `read`, worked out once for each chunk and kind (every caller passes the same `stop`). */
  closure(first: string, later?: { stop: ReadonlySet<string> }): Promise<string[]>;
}

/** Walks out/ once, after bundling and before the pages are written (R-D9: it was walked four times, 27k files each). */
async function walkOut(): Promise<Built> {
  const files = await filesIn(OUT);
  const chunks = new Map<string, string[]>();
  for (const file of files) {
    const name = /^static\/(.+)\.[a-z0-9]+\.js$/.exec(file)?.[1];
    if (name) chunks.set(name, [...(chunks.get(name) ?? []), file]);
  }
  const texts = new Map<string, Promise<string>>();
  const read = (file: string) => texts.get(file) ?? (texts.set(file, readFile(join(OUT, file), "utf8")), texts.get(file) as Promise<string>);
  const closures = new Map<string, Promise<string[]>>();
  return {
    files,
    chunkOf: (name) => {
      const found = chunks.get(name) ?? [];
      if (found.length > 1) throw new Error(`build: ${found.length} chunks for ${name}`);
      return found[0];
    },
    read,
    closure: (first, later) => {
      const key = `${later ? "later" : "now"} ${first}`;
      if (!closures.has(key)) closures.set(key, chunkClosure(first, read, `${base}/static/`, later ? { later: true, stop: later.stop } : {}));
      return closures.get(key) as Promise<string[]>;
    },
  };
}

/**
 * Every stylesheet the code imports, minified (path → CSS). Done in one go beforehand: the plugin moves them into
 * their chunks, and a Bun.build inside a plugin never finishes.
 */
async function minifiedStyles() {
  const paths = (await filesIn(join(ROOT, "src"))).filter((file) => file.endsWith(".css") && file !== "globals.css").map((file) => join(ROOT, "src", file));
  const result = await Bun.build({ entrypoints: paths, root: join(ROOT, "src"), minify: true, throw: false });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    process.exit(1);
  }
  return new Map(await Promise.all(result.outputs.map(async (output) => [join(ROOT, "src", output.path), await output.text()] as const)));
}

/** Bundles the app: index.html with its script, every lazy page a chunk of its own, files named by their content. */
async function bundle() {
  const result = await Bun.build({
    entrypoints: [join(ROOT, "index.html")],
    outdir: OUT,
    splitting: true,
    minify,
    ...PRODUCTION,
    sourcemap: "none",
    publicPath: `${base}/`,
    naming: { entry: "[dir]/[name].[ext]", chunk: "static/[name].[hash].[ext]", asset: "static/[name].[hash].[ext]" },
    // Bun embeds the font (src/styles/font.css) into the stylesheet; fontsOutOfStyles takes it out again afterwards.
    plugins: [appPlugin({ DEV: false, PROD: true, BASE_URL: base || "/" }, await minifiedStyles())],
    throw: false,
  });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    process.exit(1);
  }
  return result;
}

// The manifest and the icons are files of public/, which Bun can't follow from index.html, so their
// links are added after bundling, with the base path, so they also work under /<repo-name>/.
const APP_LINKS = [
  `<link rel="manifest" href="${href("/manifest.webmanifest")}" />`,
  `<link rel="icon" href="${href("/icons/icon.svg")}" type="image/svg+xml" />`,
  // A PNG beside it: Google's results and older browsers take no SVG icon, and Google wants at least 48 × 48.
  `<link rel="icon" type="image/png" sizes="48x48" href="${href("/icons/favicon-48.png")}" />`,
  `<link rel="apple-touch-icon" href="${href("/icons/apple-touch-icon.png")}" />`,
];

// Visits are counted by Cloudflare Web Analytics: no cookies, nothing kept on the device, so no consent
// banner a child would have to get past. Its site token is the repository variable CF_BEACON_TOKEN (set in
// GitHub, passed in by deploy.yml); without it, as in every local build, nothing is counted.
const beaconToken = process.env.CF_BEACON_TOKEN?.trim();
if (beaconToken && !/^[0-9a-f]{32}$/i.test(beaconToken)) throw new Error("build: CF_BEACON_TOKEN is not a Cloudflare Web Analytics site token");
// How long each game is played is sent to Umami Cloud (src/lib/analytics.ts), which sets no cookies either. Its
// website id is no secret (it stands in every page), so it lives here; the script counts only on the site's own
// hosts (with and without www, `countedHosts`), so a build looked at locally sends nothing, and it leaves out the address's query (?level=…).
const UMAMI_WEBSITE_ID = "f51dbbd5-9252-4b5b-addc-267b2bb89f67";
const ANALYTICS = [
  ...(beaconToken
    ? [`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${beaconToken}", "spa": true}'></script>`]
    : []),
  `<script defer src="https://cloud.umami.is/script.js" data-website-id="${UMAMI_WEBSITE_ID}" data-domains="${countedHosts(siteUrl)}" data-exclude-search="true"></script>`,
];

/** One built page: a page of seo.ts in one language. */
interface BuiltPage {
  language: SeoLanguage;
  /** The page's German entry; its address without the language's prefix. */
  page: PageSeo;
  /** Its texts in `language`. */
  text: PageText;
}

/** A language's texts besides German (seo.<id>.ts). */
const TRANSLATIONS: Record<Exclude<SeoLanguage, "de">, SeoTranslation> = { en: SEO_EN, zh: SEO_ZH, hi: SEO_HI, es: SEO_ES, ar: SEO_AR, ru: SEO_RU };

const textIn = (page: PageSeo, language: SeoLanguage): PageText => {
  if (language === "de") return page;
  const text = TRANSLATIONS[language].pages[page.path];
  if (!text) throw new Error(`build: ${page.path} has no texts in seo.${language}.ts`);
  return text;
};

/** The full address of a page in a language. */
const urlOf = (path: string, language: SeoLanguage) => `${siteUrl}${languagePrefix(language)}${path}`;

/** What a page shows before the app has started, and all a crawler without JavaScript sees: its text and links to the other pages. */
function staticBody({ language, page, text }: BuiltPage) {
  const isScene = (p: PageSeo) => p.path.startsWith("/bilder/") && p.path !== "/bilder/";
  const links = SEO_PAGES.filter((p) => p.path !== page.path && (!isScene(p) || page.path.startsWith("/bilder/")));
  const promise = language === "de" ? SITE_PROMISE : TRANSLATIONS[language].promise;
  // The same page in the other languages, named in their own language.
  const others = SEO_LANGUAGES.filter((other) => other !== language).map(
    (other) => `<a href="${href(`${languagePrefix(other)}${page.path}`)}" hreflang="${other}">${LANGUAGE_NAMES[other]}</a>`,
  );
  // First the title on a sheet of paper with the paw track coming and going, filling the screen while the app's code
  // loads (tools/pageStart.ts); the text and links below it, for search engines.
  return [
    '<main class="seo-page">',
    `<div class="boot"><h1>${escapeHtml(text.title)}</h1>${BOOT_WAIT}</div>`,
    '<div class="seo-page-text">',
    `<p>${escapeHtml(text.text)}</p>`,
    `<p>${escapeHtml(promise)}</p>`,
    "<nav><ul>",
    ...links.map((p) => `<li><a href="${href(`${languagePrefix(language)}${p.path}`)}">${escapeHtml(textIn(p, language).title)}</a></li>`),
    "</ul></nav>",
    `<p>${others.join(" · ")}</p>`,
    "</div>",
    "</main>",
  ].join("");
}

/** Each language by its own name, for the link to the same page in it. */
const LANGUAGE_NAMES: Record<SeoLanguage, string> = { de: "Deutsch", en: "English", zh: "中文", hi: "हिन्दी", es: "Español", ar: "العربية", ru: "Русский" };

/** Tags for search engines and link previews (WhatsApp, Messenger) in the page's head. */
function headTags({ language, page, text }: BuiltPage) {
  const url = urlOf(page.path, language);
  const meta = (property: string, content: string) => `<meta property="${property}" content="${escapeHtml(content)}" />`;
  const locale = (id: SeoLanguage) => (id === "de" ? "de_DE" : TRANSLATIONS[id].locale);
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    // The same page in every language, itself included, and English for everyone else (x-default).
    ...SEO_LANGUAGES.map((id) => `<link rel="alternate" hreflang="${id}" href="${urlOf(page.path, id)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlOf(page.path, "en")}" />`,
    meta("og:type", "website"),
    meta("og:site_name", SITE_NAME),
    meta("og:locale", locale(language)),
    ...SEO_LANGUAGES.filter((id) => id !== language).map((id) => meta("og:locale:alternate", locale(id))),
    meta("og:title", text.title),
    meta("og:description", text.description),
    meta("og:url", url),
    meta("og:image", `${siteUrl}${PREVIEW_IMAGE.path}`),
    meta("og:image:width", String(PREVIEW_IMAGE.width)),
    meta("og:image:height", String(PREVIEW_IMAGE.height)),
    meta("og:image:alt", language === "de" ? PREVIEW_IMAGE.alt : TRANSLATIONS[language].imageAlt),
    '<meta name="twitter:card" content="summary_large_image" />',
  ];
  // What the site is on its home pages, and on every other page the way to it from the home page (structuredData.ts).
  const titleOf = (path: string) => {
    const other = SEO_PAGES.find((p) => p.path === path);
    if (!other) throw new Error(`build: ${page.path} names ${path} on its way from the home page, which is no page`);
    return textIn(other, language).title;
  };
  tags.push(...structuredDataTags({ path: page.path, language, text, titleOf, urlOf: (path) => urlOf(path, language) }));
  return tags.join("\n    ");
}

// Search engines: GitHub Pages answers every address but the start page with 404.html and status 404,
// which Google does not index. So every page of src/content/seo.ts gets an index.html of its own (status
// 200) with its title, description, canonical link, preview tags and its text in #root, which the app
// replaces when it starts – once in German at its plain address and once in every other language of
// SEO_LANGUAGES under its prefix (/en/zaehne/), linked to each other with hreflang. Then sitemap.xml and
// robots.txt, which names the sitemap (robots.txt only counts at the root of a domain, so under a folder the
// sitemap has to be given to the Search Console by hand).
// The pages for grown-ups only (NO_INDEX_PATHS) get a page too, with a noindex tag: Google has to be let in to
// read that tag, so robots.txt must not block them – a blocked page that is linked (the Impressum is, from the
// home page) can still turn up in results, as a bare address. The sitemap has no <lastmod>: the build date on
// every page would be wrong, and Google ignores lastmod on a site where it is often wrong.
// A level of a game with cards has an address of its own (/abenteuer/schatzinsel/, src/content/levelPages.ts), which
// is shared and bookmarked: it gets the game's page as it is, canonical link and hreflang naming the game's address,
// so it opens with status 200 and Google counts it as the game's page. It stays out of the sitemap, which lists only
// the addresses to be found.
// 404.html stays the plain start page, so any other deep link still boots the app.
async function writePages(template: string, out: Built) {
  const { preloadsOf, textsOf } = await pagePreloads(template, out);
  await put("404.html", textsOf(template, "de"));
  const built = SEO_LANGUAGES.flatMap((language) => SEO_PAGES.map((page): BuiltPage => ({ language, page, text: textIn(page, language) })));
  for (const one of built) {
    let html = replaceOnce(textsOf(template, one.language), '<html lang="de">', `<html lang="${one.language}">`);
    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle(one.text, one.page.path))}</title>`);
    html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(one.text.description)}" />`);
    html = replaceOnce(html, "</head>", `  ${[headTags(one), ...(await preloadsOf(one))].join("\n    ")}\n  </head>`);
    html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${staticBody(one)}</div>`);
    for (const path of [one.page.path, ...levelPaths(one.page.path)]) {
      await put(`${languagePrefix(one.language)}${path}index.html`.slice(1), html);
    }
  }
  for (const language of SEO_LANGUAGES) {
    for (const path of NO_INDEX_PATHS) {
      const html = replaceOnce(textsOf(template, language), '<html lang="de">', `<html lang="${language}">`);
      await put(`${languagePrefix(language)}${path}index.html`.slice(1), replaceOnce(html, "</head>", '<meta name="robots" content="noindex" /></head>'));
    }
  }
  // A moved page sends on to its new address in the same language: GitHub Pages can't answer 301, and Google takes a
  // meta refresh at once with a canonical link as one (MOVED_PATHS).
  for (const language of SEO_LANGUAGES) {
    for (const [from, to] of Object.entries(MOVED_PATHS)) {
      const target = urlOf(to, language);
      await put(
        `${languagePrefix(language)}${from}index.html`.slice(1),
        `<!doctype html>\n<html lang="${language}">\n<head>\n<meta charset="utf-8" />\n<title>${SITE_NAME}</title>\n<link rel="canonical" href="${target}" />\n<meta http-equiv="refresh" content="0; url=${target}" />\n</head>\n<body><a href="${target}">${target}</a></body>\n</html>\n`,
      );
    }
  }
  const urls = built.map(({ language, page }) => `  <url><loc>${urlOf(page.path, language)}</loc></url>`);
  await put(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
  );
  await put("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

/**
 * The chunks a page needs beyond the start's, as `<link rel="modulepreload">` tags (`preloadsOf`): its own page's code,
 * and on a picture of Lebendige Bilder that picture's chunk (App.tsx and ScenePage load them lazily, so without these
 * tags they were fetched only after the start's code had run, one round trip after another). And `textsOf`, which puts the script into a page's head that fetches the texts of the language the visitor
 * will play in (textsPreload) – the browser's, not the address's: a German page played in English needs the English
 * texts, an English page played in German none. They come down together with the start's code, while the page's title
 * waits on paper (`.boot`).
 */
async function pagePreloads(template: string, built: Built) {
  const modules = pageModules(await readFile(join(ROOT, "src/App.tsx"), "utf8"));
  const scenes = sceneModules(await readFile(join(ROOT, "src/games/scenes/catalog.ts"), "utf8"));
  const linked = new Set([...template.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]));
  const chunkOf = (name: string) => {
    const found = built.chunkOf(name);
    if (!found) throw new Error(`build: no chunk for ${name}`);
    return found;
  };
  const unlinked = async (first: string) => (await built.closure(first)).map((file) => href(`/${file}`)).filter((url) => !linked.has(url));
  const texts: Record<string, string[]> = {};
  for (const language of SEO_LANGUAGES) texts[language] = await unlinked(chunkOf(`texts-${language}`));
  const stylesheet = '<link rel="stylesheet"';
  return {
    preloadsOf: async ({ page }: BuiltPage) => {
      const module = pageModuleFor(page.path, modules);
      if (module === undefined) throw new Error(`build: no page of App.tsx opens ${page.path}`);
      // A picture of Lebendige Bilder needs its own chunk too, which ScenePage would ask for only once it runs.
      const scene = sceneModuleFor(page.path, scenes);
      if (module === "ScenePage" && !scene) throw new Error(`build: no picture of src/games/scenes/catalog.ts is at ${page.path}`);
      const urls = new Set([...(module ? await unlinked(chunkOf(module)) : []), ...(scene ? await unlinked(chunkOf(scene)) : [])]);
      return [...urls].map((url) => `<link rel="modulepreload" crossorigin href="${url}">`);
    },
    textsOf: (html: string, address: SeoLanguage) =>
      replaceOnce(html, stylesheet, `${textsPreload(texts, address, { key: LANGUAGE_KEY, crawler: CRAWLER })}${stylesheet}`),
  };
}

// Offline support (PWA): writes out/sw.js from src/sw.js, so the service worker can keep the built files in the
// browser. It names only the few files not named by their content (UNHASHED); the content hashes of the others go into
// static/built.<hash>.txt, which the worker fetches only at install (R-P9: listed in sw.js they made it 246 KB). The
// version is a hash over the worker and all files,
// so every change installs a new one. 404.html is left out: the worker answers deep links with
// index.html itself, and so is the picture for link previews (PREVIEW_IMAGE), which only other sites fetch. So are songs (files named musik-*.mp3): music can be switched off for all games,
// and then they must not be downloaded; the worker keeps a song once a page has fetched it. The same
// for Tapsi's voice in languages besides German (en-<hash>.mp3 and so on, src/lib/voiceName.ts)
// and the texts of each language (texts-ru.<hash>.js, src/content/texts): only the chosen one is needed, and
// the worker keeps the one a page asks for (TEXTS, by language).
async function writeServiceWorker(built: Built) {
  const offline = await writeOfflineManifest(built);
  const all = built.files;
  const texts = Object.fromEntries(all.flatMap((file) => /^static\/texts-([a-z]{2})\.[^/]*\.js$/.exec(file)?.slice(1, 2).map((id) => [id, `./${file}`]) ?? []));
  // Offline every address opens index.html (src/sw.js), so the other pages, written for search engines, stay out.
  const files = all.filter(
    (file) =>
      (file === "index.html" || !/\.(html|xml|txt)$/.test(file)) &&
      file !== "sw.js" &&
      `/${file}` !== PREVIEW_IMAGE.path &&
      !/\.(map|LICENSE\.txt)$/.test(file) &&
      !/(^|\/)(musik-[^/]*|[a-z]{2}-[0-9a-f]{8}[^/]*)\.mp3$/.test(file) &&
      !Object.values(texts).includes(`./${file}`),
  );
  const unhashed = files.filter((file) => !file.startsWith("static/"));
  const hashes = files
    .filter((file) => file.startsWith("static/"))
    .map((file) => {
      const hash = /^static\/[^/]+\.([a-z0-9]+)\.[a-z0-9]+$/.exec(file)?.[1];
      if (!hash) throw new Error(`build: static/ holds ${file}, which is not named by its content: the service worker would keep it for good`);
      return hash;
    });
  // Only a handful: everything else must be named by its content, or the worker's start grows again.
  if (unhashed.length > 30) throw new Error(`build: ${unhashed.length} files outside static/, each named in sw.js: ${unhashed.slice(0, 5).join(", ")} …`);
  const list = [...new Set(hashes)].sort().join("\n");
  const builtList = `./static/built.${createHash("sha256").update(list).digest("hex").slice(0, 8)}.txt`;
  await put(builtList.slice(2), list);
  const shell = await shellFiles();
  const template = await readFile(join(ROOT, "src/sw.js"), "utf8");
  const hash = createHash("sha256").update(template);
  // The build's time in index.html is left out, so a build that changed nothing installs no new worker.
  for (const file of files) {
    const bytes = await readFile(join(OUT, file));
    hash.update(file).update(file.endsWith(".html") ? bytes.toString("utf8").replace(/<meta name="build-time" content="[^"]*" \/>/, "") : bytes);
  }
  const fills: [string, string][] = [
    ['"__VERSION__"', JSON.stringify(hash.digest("hex").slice(0, 12))],
    ["__UNHASHED__", JSON.stringify(unhashed.map((file) => `./${file}`))],
    ["__BUILT__", JSON.stringify(builtList)],
    ["__SHELL__", JSON.stringify(shell.map((file) => `./${file}`))],
    ["__TEXTS__", JSON.stringify(texts)],
    ["__OFFLINE__", JSON.stringify(offline)],
  ];
  await put("sw.js", fills.reduce((code, [placeholder, value]) => replaceOnce(code, placeholder, value, "src/sw.js"), template));
}

/**
 * The offline copy by book and language (src/lib/offlineParts.ts), as static/offline.<hash>.json; returns its address.
 * A file belongs to the books whose pages' code names it: each lazy page of App.tsx with every chunk it imports (and
 * loads later itself, but no other page), less what the start already needs, which every book shares. The other
 * languages' voices and songs are told apart by their names; an English recording stands in for the languages whose
 * recordings in the same game's code fall short (`needsEnglish`).
 */
async function writeOfflineManifest({ files, read, chunkOf, closure }: Built) {
  const escaped = `${base}/static/`.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const modules = pageModules(await readFile(join(ROOT, "src/App.tsx"), "utf8"));
  const pageChunks = new Set([...new Set(modules.values())].map(chunkOf).filter((chunk): chunk is string => !!chunk));
  /** The files a chunk's code names (pictures, sounds), besides itself. */
  const named = async (chunk: string) => [chunk, ...[...(await read(chunk)).matchAll(new RegExp(`${escaped}([\\w.-]+\\.(?:mp3|webp|png|jpe?g|svg|woff2?))`, "g"))].map((m) => `static/${m[1]}`)];

  // index.html as writePages left it (the home page's), read anew: `read` keeps what it read once.
  const html = await readFile(join(OUT, "index.html"), "utf8");
  const start = new Set<string>();
  for (const [, name] of html.matchAll(new RegExp(`${escaped}([\\w.-]+\\.js)`, "g"))) for (const chunk of await closure(`static/${name}`)) start.add(chunk);
  const shared = new Set<string>();
  for (const chunk of start) for (const file of await named(chunk)) shared.add(file);

  const books = new Map<string, Set<string>>();
  const english = new Map<string, Set<string>>();
  for (const [path, module] of modules) {
    const book = shelfEntryOf(path)?.id;
    const chunk = chunkOf(module);
    if (!book || !chunk) continue;
    const used: string[] = [];
    // A chunk with the chunks it imports, statically or later, but never another page.
    for (const each of await closure(chunk, { stop: pageChunks })) if (!start.has(each)) used.push(...(await named(each)));
    const lacking = needsEnglish(used)(SEO_LANGUAGES);
    for (const file of used) {
      if (shared.has(file)) continue;
      books.set(file, (books.get(file) ?? new Set()).add(book));
      if (languageOf(file) === "en" && lacking.length) english.set(file, new Set([...(english.get(file) ?? []), ...lacking]));
    }
  }

  const parts: OfflinePart[] = [];
  for (const file of files) {
    // Pages for search engines, the worker, the texts by language (the worker keeps those by TEXTS) stay out.
    if ((/\.(html|xml|txt|map)$/.test(file) && file !== "index.html") || file === "sw.js" || /^static\/texts-[a-z]{2}\./.test(file)) continue;
    if (`/${file}` === PREVIEW_IMAGE.path) continue;
    const part: OfflinePart = { path: `./${file}`, bytes: (await Bun.file(join(OUT, file)).size) as number };
    const inBooks = books.get(file);
    if (inBooks) part.books = [...inBooks].sort();
    const language = languageOf(file);
    if (language) part.language = language;
    if (isBackgroundSong(file)) part.music = true;
    if (isVoice(file)) part.voice = true;
    const standsIn = english.get(file);
    if (standsIn) part.standsIn = [...standsIn].sort();
    parts.push(part);
  }
  const manifest: OfflineManifest = { parts };
  const json = JSON.stringify(manifest);
  const name = `static/offline.${createHash("sha256").update(json).digest("hex").slice(0, 8)}.json`;
  await put(name, json);
  return `./${name}`;
}

/** The most the service worker's install may download (`shellFiles`), in files and in MB. */
const MAX_SHELL = { files: 70, megabytes: 1.6 };

/**
 * What the service worker keeps at install, so the app starts offline on its home page even right after an update:
 * index.html, the scripts and styles it links (Bun lists every chunk the start needs as a modulepreload) and the
 * pictures those name (the shelf's covers, the logo) – not the sounds they name, which only a game plays, and not the
 * menus' and trophies' previews (`vorschau/` folders, which the start's code names through trophyPictures.ts): 82 of
 * them made 1 MB that every first visit downloaded for a trophy room or a book it may never open (R-P3). A preview is
 * kept once a page shows it, like every other file. Fails above `MAX_SHELL`, so the start can't silently grow again.
 */
async function shellFiles() {
  const html = await readFile(join(OUT, "index.html"), "utf8");
  const linked = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => ref.startsWith(`${base}/`) && !ref.endsWith("/"))
    .map((ref) => ref.slice(base.length + 1));
  // The previews, known by their content: their built names say nothing of the folder they came from.
  const digest = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
  const previews = new Set<string>();
  for (const file of await filesIn(join(ROOT, "src"))) if (/(^|\/)vorschau\/[^/]+\.webp$/.test(file)) previews.add(digest(await readFile(join(ROOT, "src", file))));
  const pictures = new Set<string>();
  for (const file of linked.filter((file) => /\.(js|css)$/.test(file))) {
    for (const match of (await readFile(join(OUT, file), "utf8")).matchAll(/static\/[\w.-]+\.(?:webp|png|jpe?g|svg|woff2?)/g))
      if (!previews.has(digest(await readFile(join(OUT, match[0]))))) pictures.add(match[0]);
  }
  // The preloaded font is linked and named by the stylesheet too: kept once.
  const shell = [...new Set(["index.html", ...linked, ...pictures])];
  const megabytes = shell.reduce((sum, file) => sum + Bun.file(join(OUT, file)).size, 0) / 1e6;
  console.log(`service worker's start: ${shell.length} files, ${megabytes.toFixed(2)} MB`);
  if (shell.length > MAX_SHELL.files || megabytes > MAX_SHELL.megabytes) {
    console.error(`build: the service worker's start is ${shell.length} files and ${megabytes.toFixed(2)} MB, over ${MAX_SHELL.files} files or ${MAX_SHELL.megabytes} MB: every first visit downloads it`);
    process.exit(1);
  }
  return shell;
}

/** The font every page preloads: the Latin part, which every language's menus use (the others only for a few letters). */
const PRELOADED_FONT = "fredoka-latin-wght-normal";

/**
 * Takes the fonts Bun embedded into the built stylesheets out again into files of their own (`fontsAsFiles`), named
 * after the files src/styles/font.css names; returns the preload tag of `PRELOADED_FONT`. The latin-ext part stays a
 * file the browser fetches only for a letter it covers (`unicode-range`): Chinese pinyin's tone marks (bō, ǎ) need it.
 */
async function fontsOutOfStyles() {
  const source = await readFile(join(ROOT, "src/styles/font.css"), "utf8");
  const names = new Map<string, string>();
  for (const [, path] of source.matchAll(/url\("([^"]+\.woff2)"\)/g)) {
    const bytes = await readFile(join(ROOT, "src/styles", path));
    names.set(createHash("sha256").update(bytes).digest("hex"), path.slice(path.lastIndexOf("/") + 1, -".woff2".length));
  }
  const written: string[] = [];
  for (const file of (await readdir(join(OUT, "static"))).filter((name) => name.endsWith(".css"))) {
    const { css, files } = fontsAsFiles(await readFile(join(OUT, "static", file), "utf8"), names, `${base}/static/`);
    if (css.includes("data:font")) throw new Error(`build: static/${file} still embeds a font that is no woff2`);
    for (const font of files) await writeFile(join(OUT, font.path), font.bytes);
    written.push(...files.map((font) => font.path));
    await writeFile(join(OUT, "static", file), css);
  }
  const preloaded = written.find((path) => path.startsWith(`static/${PRELOADED_FONT}.`));
  if (!preloaded) throw new Error(`build: no ${PRELOADED_FONT} font came out of the stylesheets`);
  return `<link rel="preload" as="font" type="font/woff2" crossorigin href="${href(`/${preloaded}`)}" />`;
}

/** The most out/ may weigh, in MB: GitHub Pages publishes at most 1 GB, and the deploy should fail long before. */
const MAX_SITE_MB = 800;

const started = performance.now();
await rm(OUT, { recursive: true, force: true });
const result = await bundle();
await cp(join(ROOT, "public"), OUT, { recursive: true });
const fontPreload = await fontsOutOfStyles();
// The time of this build stands in every page (`buildDate` in src/lib/pwa.ts reads it), never in the code: a value
// that changes with each build renamed most chunks every time, so returning visitors downloaded every game again.
const BUILD_TIME_TAG = `<meta name="build-time" content="${new Date().toISOString()}" />`;
// The font's preload stands before the stylesheet, so its download starts as early as the stylesheet's.
const bundled = replaceOnce(await readFile(join(OUT, "index.html"), "utf8"), '<link rel="stylesheet"', `${fontPreload}<link rel="stylesheet"`);
const template = replaceOnce(bundled, "</head>", `${[BUILD_TIME_TAG, ...APP_LINKS, ...ANALYTICS].join("")}</head>`);
await writeFile(join(OUT, "index.html"), template);
const built = await walkOut();
await writePages(template, built);
await writeServiceWorker(built);
const files = [...new Set([...built.files, ...written])];
const bytes = files.reduce((sum, file) => sum + Bun.file(join(OUT, file)).size, 0);
const megabytes = Math.round(bytes / 1e6);
console.log(`out/: ${files.length} files, ${megabytes} MB (${result.outputs.length} bundled) in ${Math.round(performance.now() - started)} ms`);
// GitHub Pages publishes a site of at most 1 GB; stop well before it, while there is still time to make room (R-D8).
if (megabytes > MAX_SITE_MB) {
  console.error(`build: out/ is ${megabytes} MB, over the limit of ${MAX_SITE_MB} MB (GitHub Pages takes at most 1 GB) – make the recordings or pictures smaller first`);
  process.exit(1);
}
