import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig, type RsbuildPlugin } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { fullTitle, NO_INDEX_PATHS, SEO_PAGES, SITE_NAME, SITE_PROMISE, type PageSeo } from "./src/content/seo";

// On GitHub Pages the site lives under /<repo-name>; locally it is served from the root.
const base = process.env.PUBLIC_BASE_PATH || "/";

// GitHub Pages has no SPA fallback, but it serves 404.html for unknown paths,
// so deep links like /bilder/baustelle/ still boot the app.
const pluginSpaFallback: RsbuildPlugin = {
  name: "spa-fallback",
  setup(api) {
    api.onAfterBuild(async () => {
      const dist = api.context.distPath;
      await copyFile(join(dist, "index.html"), join(dist, "404.html"));
    });
  },
};

// Where the site is online, for links that search engines keep (canonical, sitemap).
// GitHub Pages serves it from https://<user>.github.io/<repo>/; SITE_ORIGIN for another domain.
const siteUrl = `${process.env.SITE_ORIGIN || "https://radiesle.github.io"}${base.replace(/\/$/, "")}`;

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The address of a page inside the site, with the base path. */
const href = (path: string) => `${base.replace(/\/$/, "")}${path}`;

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
function headTags(page: PageSeo, fontFile: string | undefined) {
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
  // The font is needed for the first picture; asking for it early saves a round trip.
  if (fontFile) tags.push(`<link rel="preload" href="${href(`/${fontFile}`)}" as="font" type="font/woff2" crossorigin />`);
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

/** Replaces exactly one match, so a changed index.html fails the build instead of silently losing a tag. */
function replaceOnce(html: string, search: RegExp | string, replacement: string) {
  if (!(typeof search === "string" ? html.includes(search) : search.test(html))) throw new Error(`seo pages: ${search} not found in index.html`);
  return html.replace(search, () => replacement);
}

// Search engines: GitHub Pages answers every address but the start page with
// 404.html and status 404, which Google does not index. So every page of
// src/content/seo.ts gets an index.html of its own (status 200) with its title,
// description, canonical link, preview tags and its text in #root, which the
// app replaces when it starts. Then sitemap.xml and robots.txt (robots.txt only
// counts at the root of a domain, so on <user>.github.io/<repo>/ the sitemap has
// to be given to the Search Console by hand). 404.html stays the plain start page.
const pluginSeoPages: RsbuildPlugin = {
  name: "seo-pages",
  setup(api) {
    api.onAfterBuild(async () => {
      const dist = api.context.distPath;
      const template = await readFile(join(dist, "index.html"), "utf8");
      const fontFile = (await readdir(join(dist, "static/font")).catch(() => [] as string[]))
        .filter((file) => /^fredoka-latin-wght-normal\..*\.woff2$/.test(file))
        .map((file) => `static/font/${file}`)[0];
      for (const page of SEO_PAGES) {
        let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle(page))}</title>`);
        html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`);
        html = replaceOnce(html, "</head>", `  ${headTags(page, fontFile)}\n  </head>`);
        html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${staticBody(page)}</div>`);
        const dir = join(dist, page.path);
        await mkdir(dir, { recursive: true });
        await writeFile(join(dir, "index.html"), html);
      }
      const today = new Date().toISOString().slice(0, 10);
      const urls = SEO_PAGES.map((page) => `  <url><loc>${siteUrl}${page.path}</loc><lastmod>${today}</lastmod></url>`);
      await writeFile(
        join(dist, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
      );
      const disallow = NO_INDEX_PATHS.map((path) => `Disallow: ${href(path)}`).join("\n");
      await writeFile(join(dist, "robots.txt"), `User-agent: *\n${disallow}\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
    });
  },
};

// Offline support (PWA): writes out/sw.js from src/sw.js with the list of all
// built files, so the service worker can keep them in the browser. The version
// is a hash over the worker and all files, so every change installs a new one.
// 404.html is left out: the worker answers deep links with index.html itself.
// So are songs (files named musik-*.mp3): music can be switched off for all
// games, and then they must not be downloaded; the worker keeps a song once a
// page has fetched it. The same for Tapsi's voice in languages besides German
// (en-<hash>.mp3 and so on, src/games/adventure/voiceId.ts): only the chosen one is needed.
const pluginOffline: RsbuildPlugin = {
  name: "offline",
  setup(api) {
    api.onAfterBuild(async () => {
      const dist = api.context.distPath;
      const files = (await readdir(dist, { recursive: true, withFileTypes: true }))
        .filter((entry) => entry.isFile())
        .map((entry) =>
          join(entry.parentPath, entry.name)
            .slice(dist.length + 1)
            .split("\\")
            .join("/"),
        )
        .filter(
          (file) =>
            file !== "404.html" && file !== "sw.js" && !/\.(map|LICENSE\.txt)$/.test(file) && !/(^|\/)(musik-[^/]*|[a-z]{2}-[0-9a-f]{8}[^/]*)\.mp3$/.test(file),
        )
        .sort();
      const template = await readFile("src/sw.js", "utf8");
      const hash = createHash("sha256").update(template);
      for (const file of files) hash.update(file).update(await readFile(join(dist, file)));
      const worker = template
        .replace('"__VERSION__"', JSON.stringify(hash.digest("hex").slice(0, 12)))
        .replace("__FILES__", JSON.stringify(files.map((file) => `./${file}`)));
      await writeFile(join(dist, "sw.js"), worker);
    });
  },
};

export default defineConfig({
  plugins: [pluginReact(), pluginSpaFallback, pluginSeoPages, pluginOffline],
  // BUILD_TIME: the home page shows parents which version runs (src/lib/pwa.ts, buildDate).
  source: { entry: { index: "./src/index.tsx" }, define: { BUILD_TIME: JSON.stringify(new Date().toISOString()) } },
  html: {
    template: "./index.html",
    // Prefixed with the base path, so they also work under /<repo-name>/.
    tags: [
      { tag: "link", attrs: { rel: "manifest", href: "manifest.webmanifest" } },
      { tag: "link", attrs: { rel: "icon", href: "icons/icon.svg", type: "image/svg+xml" } },
      { tag: "link", attrs: { rel: "apple-touch-icon", href: "icons/apple-touch-icon.png" } },
    ],
  },
  server: { base, port: 3000, historyApiFallback: true },
  output: { distPath: { root: "out" } },
});
