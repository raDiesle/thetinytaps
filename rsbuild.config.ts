import { copyFile } from "node:fs/promises";
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

export default defineConfig({
  plugins: [pluginReact(), pluginSpaFallback],
  source: { entry: { index: "./src/index.tsx" } },
  html: { template: "./index.html" },
  server: { base, port: 3000, historyApiFallback: true },
  output: { distPath: { root: "out" } },
});
