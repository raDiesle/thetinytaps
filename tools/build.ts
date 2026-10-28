import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fullTitle, NO_INDEX_PATHS, type PageSeo, SEO_PAGES, SITE_NAME, SITE_PROMISE } from "../src/content/seo";
import { appPlugin } from "./appPlugin";

// `bun run build`: the site for players in out/, built by Bun from index.html (which starts src/index.tsx).
// After bundling it adds what GitHub Pages and an offline app need: public/, the manifest and icon links,
// an own index.html for every page search engines should find, 404.html, sitemap.xml, robots.txt and sw.js.

const ROOT = join(import.meta.dir, "..");
const OUT = join(ROOT, "out");

// On GitHub Pages the site lives under /<repo-name>; locally it is served from the root.
const base = (process.env.PUBLIC_BASE_PATH || "/").replace(/\/$/, "");

// Where the site is online, for links that search engines keep (canonical, sitemap).
// GitHub Pages serves it from https://<user>.github.io/<repo>/; SITE_ORIGIN for another domain.
const siteUrl = `${process.env.SITE_ORIGIN || "https://radiesle.github.io"}${base}`;

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The address of a page or file inside the site, with the base path. */
const href = (path: string) => `${base}${path}`;

/** Replaces exactly one match, so a changed index.html fails the build instead of silently losing a tag. */
function replaceOnce(html: string, search: RegExp | string, replacement: string) {
  if (!(typeof search === "string" ? html.includes(search) : search.test(html))) throw new Error(`build: ${search} not found in index.html`);
  return html.replace(search, () => replacement);
}

/** All files below a folder, as paths relative to it with "/". */
async function filesIn(dir: string) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(dir.length + 1).split("\\").join("/"))
    .sort();
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
    minify: true,
    sourcemap: "none",
    publicPath: `${base}/`,
    naming: { entry: "[dir]/[name].[ext]", chunk: "static/[name].[hash].[ext]", asset: "static/[name].[hash].[ext]" },
    // The font (@fontsource in src/globals.css) ends up inside the stylesheet, so it needs no request of its own.
    plugins: [appPlugin({ DEV: false, PROD: true, BASE_URL: base || "/", BUILD_TIME: new Date().toISOString() }, await minifiedStyles())],
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
  `<link rel="apple-touch-icon" href="${href("/icons/apple-touch-icon.png")}" />`,
];

/** What a page shows before the app has started, and all a crawler without JavaScript sees: its text and links to the other pages. */
function staticBody(page: PageSeo) {
  const isScene = (p: PageSeo) => p.path.startsWith("/bilder/") && p.path !== "/bilder/";
  const links = SEO_PAGES.filter((p) => p.path !== page.path && (!isScene(p) || page.path.startsWith("/bilder/")));
  return [
    '<main class="seo-page">',
    `<h1>${escapeHtml(page.title)}</h1>`,
    `<p>${escapeHtml(page.text)}</p>`,
    `<p>${escapeHtml(SITE_PROMISE)}</p>`,
    "<nav><ul>",
    ...links.map((p) => `<li><a href="${href(p.path)}">${escapeHtml(p.title)}</a></li>`),
    "</ul></nav>",
    "</main>",
  ].join("");
}

/** Tags for search engines and link previews (WhatsApp, Messenger) in the page's head. */
function headTags(page: PageSeo) {
  const url = `${siteUrl}${page.path}`;
  const meta = (property: string, content: string) => `<meta property="${property}" content="${escapeHtml(content)}" />`;
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    meta("og:type", "website"),
    meta("og:site_name", SITE_NAME),
    meta("og:locale", "de_DE"),
    meta("og:title", page.title),
    meta("og:description", page.description),
    meta("og:url", url),
    meta("og:image", `${siteUrl}/icons/icon-512.png`),
    '<meta name="twitter:card" content="summary" />',
  ];
  if (page.path === "/") {
    const app = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url,
      description: page.description,
      applicationCategory: "GameApplication",
      operatingSystem: "Web",
      inLanguage: "de",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      audience: { "@type": "PeopleAudience", suggestedMinAge: 2, suggestedMaxAge: 4 },
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(app)}</script>`);
  }
  return tags.join("\n    ");
}

// Search engines: GitHub Pages answers every address but the start page with 404.html and status 404,
// which Google does not index. So every page of src/content/seo.ts gets an index.html of its own (status
// 200) with its title, description, canonical link, preview tags and its text in #root, which the app
// replaces when it starts. Then sitemap.xml and robots.txt (robots.txt only counts at the root of a
// domain, so on <user>.github.io/<repo>/ the sitemap has to be given to the Search Console by hand).
// 404.html stays the plain start page, so deep links like /bilder/baustelle/ still boot the app.
async function writePages(template: string) {
  await writeFile(join(OUT, "404.html"), template);
  for (const page of SEO_PAGES) {
    let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle(page))}</title>`);
    html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`);
    html = replaceOnce(html, "</head>", `  ${headTags(page)}\n  </head>`);
    html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${staticBody(page)}</div>`);
    const dir = join(OUT, page.path);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html);
  }
  const today = new Date().toISOString().slice(0, 10);
  const urls = SEO_PAGES.map((page) => `  <url><loc>${siteUrl}${page.path}</loc><lastmod>${today}</lastmod></url>`);
  await writeFile(
    join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
  );
  const disallow = NO_INDEX_PATHS.map((path) => `Disallow: ${href(path)}`).join("\n");
  await writeFile(join(OUT, "robots.txt"), `User-agent: *\n${disallow}\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

// Offline support (PWA): writes out/sw.js from src/sw.js with the list of all built files, so the
// service worker can keep them in the browser. The version is a hash over the worker and all files,
// so every change installs a new one. 404.html is left out: the worker answers deep links with
// index.html itself. So are songs (files named musik-*.mp3): music can be switched off for all games,
// and then they must not be downloaded; the worker keeps a song once a page has fetched it. The same
// for Tapsi's voice in languages besides German (en-<hash>.mp3 and so on, src/games/adventure/voiceId.ts)
// and the texts of each language (texts-ru.<hash>.js, src/content/texts): only the chosen one is needed, and
// the worker keeps the one a page asks for (TEXTS, by language).
async function writeServiceWorker() {
  const all = await filesIn(OUT);
  const texts = Object.fromEntries(all.flatMap((file) => /^static\/texts-([a-z]{2})\.[^/]*\.js$/.exec(file)?.slice(1, 2).map((id) => [id, `./${file}`]) ?? []));
  const files = all.filter(
    (file) =>
      file !== "404.html" &&
      file !== "sw.js" &&
      !/\.(map|LICENSE\.txt)$/.test(file) &&
      !/(^|\/)(musik-[^/]*|[a-z]{2}-[0-9a-f]{8}[^/]*)\.mp3$/.test(file) &&
      !Object.values(texts).includes(`./${file}`),
  );
  const template = await readFile(join(ROOT, "src/sw.js"), "utf8");
  const hash = createHash("sha256").update(template);
  for (const file of files) hash.update(file).update(await readFile(join(OUT, file)));
  const worker = template
    .replace('"__VERSION__"', JSON.stringify(hash.digest("hex").slice(0, 12)))
    .replace("__FILES__", JSON.stringify(files.map((file) => `./${file}`)))
    .replace("__TEXTS__", JSON.stringify(texts));
  await writeFile(join(OUT, "sw.js"), worker);
}

const started = performance.now();
await rm(OUT, { recursive: true, force: true });
const result = await bundle();
await cp(join(ROOT, "public"), OUT, { recursive: true });
// The app's code (src/main.tsx) runs only once the app language's texts are loaded (src/index.tsx); the browser
// fetches it meanwhile instead of after them.
const main = result.outputs.find((output) => /\/static\/main\.[^/]*\.js$/.test(output.path));
if (!main) throw new Error("build: no main chunk (src/main.tsx)");
const preload = `<link rel="modulepreload" crossorigin href="${href(`/${relative(OUT, main.path)}`)}" />`;
const template = replaceOnce(await readFile(join(OUT, "index.html"), "utf8"), "</head>", `${APP_LINKS.join("")}${preload}</head>`);
await writeFile(join(OUT, "index.html"), template);
await writePages(template);
await writeServiceWorker();
const files = await filesIn(OUT);
console.log(`out/: ${files.length} files (${result.outputs.length} bundled) in ${Math.round(performance.now() - started)} ms`);
