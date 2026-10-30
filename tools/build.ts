import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  fullTitle,
  languagePrefix,
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
import { SEO_EN } from "../src/content/seo.en";
import { appPlugin, PRODUCTION } from "./appPlugin";

// `bun run build`: the site for players in out/, built by Bun from index.html (which starts src/index.tsx).
// After bundling it adds what GitHub Pages and an offline app need: public/, the manifest and icon links,
// an own index.html for every page search engines should find, 404.html, sitemap.xml, robots.txt and sw.js.

const ROOT = join(import.meta.dir, "..");
const OUT = join(ROOT, "out");

// The site lives at the root of its domain; PUBLIC_BASE_PATH only to try it under a folder (/<repo>/).
const base = (process.env.PUBLIC_BASE_PATH || "/").replace(/\/$/, "");

// Where the site is online, for links that search engines keep (canonical, sitemap).
// GitHub Pages serves it on its own domain (repo settings → Pages, DNS in tools/toddlerfox.com.zone).
const siteUrl = `${process.env.SITE_ORIGIN || "https://toddlerfox.com"}${base}`;

// READABLE=1 (`bun run perf --profile`): the same build with its names and lines kept, so a profile shows where time goes.
const minify = process.env.READABLE === "1" ? { syntax: true, whitespace: false, identifiers: false } : true;

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
    minify,
    ...PRODUCTION,
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

// Visits are counted by Cloudflare Web Analytics: no cookies, nothing kept on the device, so no consent
// banner a child would have to get past. Its site token is the repository variable CF_BEACON_TOKEN (set in
// GitHub, passed in by deploy.yml); without it, as in every local build, nothing is counted.
const beaconToken = process.env.CF_BEACON_TOKEN?.trim();
if (beaconToken && !/^[0-9a-f]{32}$/i.test(beaconToken)) throw new Error("build: CF_BEACON_TOKEN is not a Cloudflare Web Analytics site token");
const ANALYTICS = beaconToken
  ? [`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${beaconToken}", "spa": true}'></script>`]
  : [];

/** One built page: a page of seo.ts in one language. */
interface BuiltPage {
  language: SeoLanguage;
  /** The page's German entry; its address without the language's prefix. */
  page: PageSeo;
  /** Its texts in `language`. */
  text: PageText;
}

/** A language's texts besides German (seo.<id>.ts). */
const TRANSLATIONS: Record<Exclude<SeoLanguage, "de">, SeoTranslation> = { en: SEO_EN };

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
  return [
    '<main class="seo-page">',
    `<h1>${escapeHtml(text.title)}</h1>`,
    `<p>${escapeHtml(text.text)}</p>`,
    `<p>${escapeHtml(promise)}</p>`,
    "<nav><ul>",
    ...links.map((p) => `<li><a href="${href(`${languagePrefix(language)}${p.path}`)}">${escapeHtml(textIn(p, language).title)}</a></li>`),
    "</ul></nav>",
    `<p>${others.join(" · ")}</p>`,
    "</main>",
  ].join("");
}

/** Each language by its own name, for the link to the same page in it. */
const LANGUAGE_NAMES: Record<SeoLanguage, string> = { de: "Deutsch", en: "English" };

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
  if (page.path === "/") {
    // The site's name in Google's results comes from WebSite; without it Google guesses from the domain.
    const site = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url, inLanguage: language };
    tags.push(`<script type="application/ld+json">${JSON.stringify(site)}</script>`);
    const app = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url,
      description: text.description,
      applicationCategory: "GameApplication",
      operatingSystem: "Web",
      inLanguage: language,
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
// replaces when it starts – once in German at its plain address and once in every other language of
// SEO_LANGUAGES under its prefix (/en/zaehne/), linked to each other with hreflang. Then sitemap.xml and
// robots.txt, which names the sitemap (robots.txt only counts at the root of a domain, so under a folder the
// sitemap has to be given to the Search Console by hand).
// The pages for grown-ups only (NO_INDEX_PATHS) get a page too, with a noindex tag: Google has to be let in to
// read that tag, so robots.txt must not block them – a blocked page that is linked (the Impressum is, from the
// home page) can still turn up in results, as a bare address. The sitemap has no <lastmod>: the build date on
// every page would be wrong, and Google ignores lastmod on a site where it is often wrong.
// 404.html stays the plain start page, so deep links like /bilder/baustelle/ still boot the app.
async function writePages(template: string) {
  await writeFile(join(OUT, "404.html"), template);
  const built = SEO_LANGUAGES.flatMap((language) => SEO_PAGES.map((page): BuiltPage => ({ language, page, text: textIn(page, language) })));
  for (const one of built) {
    let html = replaceOnce(template, '<html lang="de">', `<html lang="${one.language}">`);
    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle(one.text))}</title>`);
    html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(one.text.description)}" />`);
    html = replaceOnce(html, "</head>", `  ${headTags(one)}\n  </head>`);
    html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${staticBody(one)}</div>`);
    const dir = join(OUT, languagePrefix(one.language), one.page.path);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html);
  }
  for (const language of SEO_LANGUAGES) {
    for (const path of NO_INDEX_PATHS) {
      const dir = join(OUT, languagePrefix(language), path);
      await mkdir(dir, { recursive: true });
      const html = replaceOnce(template, '<html lang="de">', `<html lang="${language}">`);
      await writeFile(join(dir, "index.html"), replaceOnce(html, "</head>", '<meta name="robots" content="noindex" /></head>'));
    }
  }
  const urls = built.map(({ language, page }) => `  <url><loc>${urlOf(page.path, language)}</loc></url>`);
  await writeFile(
    join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
  );
  await writeFile(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

// Offline support (PWA): writes out/sw.js from src/sw.js with the list of all built files, so the
// service worker can keep them in the browser. The version is a hash over the worker and all files,
// so every change installs a new one. 404.html is left out: the worker answers deep links with
// index.html itself, and so is the picture for link previews (PREVIEW_IMAGE), which only other sites fetch. So are songs (files named musik-*.mp3): music can be switched off for all games,
// and then they must not be downloaded; the worker keeps a song once a page has fetched it. The same
// for Tapsi's voice in languages besides German (en-<hash>.mp3 and so on, src/lib/voiceName.ts)
// and the texts of each language (texts-ru.<hash>.js, src/content/texts): only the chosen one is needed, and
// the worker keeps the one a page asks for (TEXTS, by language).
async function writeServiceWorker() {
  const all = await filesIn(OUT);
  const texts = Object.fromEntries(all.flatMap((file) => /^static\/texts-([a-z]{2})\.[^/]*\.js$/.exec(file)?.slice(1, 2).map((id) => [id, `./${file}`]) ?? []));
  const files = all.filter(
    (file) =>
      file !== "404.html" &&
      file !== "sw.js" &&
      `/${file}` !== PREVIEW_IMAGE.path &&
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
const template = replaceOnce(await readFile(join(OUT, "index.html"), "utf8"), "</head>", `${[...APP_LINKS, ...ANALYTICS].join("")}</head>`);
await writeFile(join(OUT, "index.html"), template);
await writePages(template);
await writeServiceWorker();
const files = await filesIn(OUT);
console.log(`out/: ${files.length} files (${result.outputs.length} bundled) in ${Math.round(performance.now() - started)} ms`);
