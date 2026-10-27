import { readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { plugin } from "bun";

// Loaded before every `bun test` (bunfig.toml). The app is bundled by Rsbuild, and a few modules list
// their files with Rspack's `import.meta.webpackContext` (sounds, songs, pictures, voice lines), which Bun
// doesn't know. Here each such call reads the folder itself, with Rspack's defaults, so the tests see the
// same files the build would bundle; a file's "URL" is its path from the project root.

const ROOT = resolve(import.meta.dir, "..");

/** Options of `import.meta.webpackContext` that the app uses. */
interface ContextOptions {
  /** Look into sub-folders too; Rspack's default is true. */
  recursive?: boolean;
  /** Keys ("./name.mp3") to keep. */
  regExp?: RegExp;
}

/** Rspack's `import.meta.webpackContext(request, options)` for a module in `dir`. */
function webpackContext(dir: string, request: string, { recursive = true, regExp = /^\.\/.*$/ }: ContextOptions = {}) {
  const folder = resolve(dir, request);
  const keys = (readdirSync(folder, { recursive }) as string[]).map((file) => `./${file}`).filter((key) => regExp.test(key));
  const context = (key: string) => `/${relative(ROOT, join(folder, key))}`;
  context.keys = () => keys;
  return context;
}

(globalThis as { __webpackContext?: typeof webpackContext }).__webpackContext = webpackContext;

plugin({
  name: "webpack-context",
  setup(build) {
    build.onLoad({ filter: /\/src\/.*\.tsx?$/ }, async ({ path }) => {
      const source = await Bun.file(path).text();
      return {
        contents: source.replaceAll("import.meta.webpackContext(", "globalThis.__webpackContext(import.meta.dir, "),
        loader: path.endsWith(".tsx") ? "tsx" : "ts",
      };
    });
  },
});
