import { createHash } from "node:crypto";
import { copyFile, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig, type RsbuildPlugin } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

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
  plugins: [pluginReact(), pluginSpaFallback, pluginOffline],
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
