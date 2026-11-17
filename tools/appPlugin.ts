import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { BunPlugin } from "bun";

// The one Bun plugin of the app, used by the build (tools/build.ts), the dev server (tools/devServer.ts) and
// the tests (src/testPreload.ts). It does what a bundler must do for us:
//
// - `import files from "./musik/*.mp3?glob"`: all files matching a pattern, relative to the importing
//   file, as { "musik-hintergrund.mp3": url } – keyed by their path below the pattern's folder. A file
//   becomes its bundled URL (a JSON file its content), so a new sound or picture needs no code.
// - `import byLanguage from "./stimme/**/*.mp3?glob-by-language"`: the same files split by language, as
//   { de: () => import(…), en: () => import(…), … }, each `import()` giving that language's part of the map above
//   (same keys) as its `default`. A file's language is its folder when that is named by two small letters
//   (stimme/en/en-1234abcd.mp3, also below other folders: stories/x/stimme/ru/…), else German, the first language,
//   whose recordings lie outside a language folder (src/lib/voiceName.ts). Each language becomes a chunk of its own,
//   `files-<language>.<hash>.js`, so a game's chunk no longer carries every language's file names (R-P1: letters'
//   map was 352 of its 372 KB) and the offline copy can tell them by their names (src/lib/offlineParts.ts).
// - src/lib/buildInfo.ts gets the facts of this build (dev server or not, base path) – never a value that changes with each
//   build, which would rename every chunk importing it.
// - In the build, a stylesheet a module imports (`import "./socks.css"` in a game) travels inside that
//   module's chunk and is added as a <style> when the chunk runs, so a game's CSS arrives only when the
//   game is opened. Bun itself would put every imported stylesheet into the start page's CSS – which the
//   dev server keeps, since it reloads only stylesheets it bundles itself. src/globals.css (and what it
//   @imports) stays the one stylesheet every page loads.

/** What src/lib/buildInfo.ts says about the running build; see the fields there. */
export interface BuildInfo {
  DEV: boolean;
  PROD: boolean;
  BASE_URL: string;
}

/**
 * What the build for players adds to Bun.build: React's production code and JSX without its development checks.
 * Without it Bun compiles every element with `jsxDEV` and keeps React's development code, which made every game
 * several times slower on phones (October 2026; `src/buildTools.test.ts` checks it).
 */
export const PRODUCTION = {
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  jsx: { development: false },
} as const;

/** The folder part of a pattern ("../sounds" of "../sounds/*.mp3") and the glob below it. */
function splitPattern(pattern: string) {
  const parts = pattern.split("/");
  const firstGlob = parts.findIndex((part) => /[*?[{]/.test(part));
  return { folder: parts.slice(0, firstGlob).join("/") || ".", glob: parts.slice(firstGlob).join("/") };
}

const SRC = join(import.meta.dir, "../src");

/** The files below `root` matching `glob`, sorted; none where the folder isn't there yet (a game's stimme/ before its first recording). */
const filesOf = (root: string, glob: string) => (existsSync(root) ? [...new Bun.Glob(glob).scanSync({ cwd: root })].sort() : []);

/** A map module of `files` (relative to `root`): each file's bundled URL by its relative path. */
function mapModule(root: string, files: string[]) {
  const imports = files.map((file, i) => `import f${i} from ${JSON.stringify(join(root, file))};`);
  const entries = files.map((file, i) => `  ${JSON.stringify(file)}: f${i},`);
  return `${imports.join("\n")}\nexport default {\n${entries.join("\n")}\n};\n`;
}

/**
 * The language of a file of a `?glob-by-language` pattern (its path below the pattern's folder): its folder's name when
 * that is a language's two small letters, else German, whose recordings lie outside a language folder.
 */
export function fileLanguage(file: string) {
  const parts = file.split("/");
  const folder = parts.length > 1 ? parts[parts.length - 2] : "";
  return /^[a-z]{2}$/.test(folder) ? folder : "de";
}

/** How a `?glob-by-language` module names one language's part: its folder, the pattern (encoded) and `files-<language>`, so Bun names its chunk `files-<language>.<hash>.js`. */
const languagePart = (root: string, glob: string, language: string) => `${root}/${encodeURIComponent(glob)}/files-${language}?glob-language`;

/**
 * The plugin; `info` fills in src/lib/buildInfo.ts (without it, in the tests, the file stays as written). `styles`,
 * every imported stylesheet minified by the build (path → CSS), moves them into their chunks.
 */
export function appPlugin(info?: BuildInfo, styles?: ReadonlyMap<string, string>): BunPlugin {
  return {
    name: "tinytaps",
    setup(build) {
      build.onResolve({ filter: /\?glob$/ }, ({ path, importer }) => ({
        path: `${dirname(importer)}|${path.slice(0, -"?glob".length)}`,
        namespace: "glob",
      }));
      build.onLoad({ filter: /.*/, namespace: "glob" }, ({ path }) => {
        const [importerDir, pattern] = path.split("|");
        const { folder, glob } = splitPattern(pattern);
        const root = join(importerDir, folder);
        return { contents: mapModule(root, filesOf(root, glob)), loader: "js" };
      });
      build.onResolve({ filter: /\?glob-by-language$/ }, ({ path, importer }) => ({
        path: `${dirname(importer)}|${path.slice(0, -"?glob-by-language".length)}`,
        namespace: "glob-by-language",
      }));
      build.onLoad({ filter: /.*/, namespace: "glob-by-language" }, ({ path }) => {
        const [importerDir, pattern] = path.split("|");
        const { folder, glob } = splitPattern(pattern);
        const root = join(importerDir, folder);
        const languages = [...new Set(filesOf(root, glob).map(fileLanguage))].sort();
        const entries = languages.map((language) => `  ${language}: () => import(${JSON.stringify(languagePart(root, glob, language))}),`);
        return { contents: `export default {\n${entries.join("\n")}\n};\n`, loader: "js" };
      });
      build.onResolve({ filter: /\?glob-language$/ }, ({ path }) => ({ path: path.slice(0, -"?glob-language".length), namespace: "glob-language" }));
      build.onLoad({ filter: /.*/, namespace: "glob-language" }, ({ path }) => {
        const language = path.slice(path.lastIndexOf("/files-") + "/files-".length);
        const rest = path.slice(0, path.lastIndexOf("/files-"));
        const root = rest.slice(0, rest.lastIndexOf("/"));
        const glob = decodeURIComponent(rest.slice(rest.lastIndexOf("/") + 1));
        return { contents: mapModule(root, filesOf(root, glob).filter((file) => fileLanguage(file) === language)), loader: "js" };
      });
      if (info)
          build.onLoad({ filter: /\/src\/lib\/buildInfo\.ts$/ }, () => ({
          contents: Object.entries(info)
            .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
            .join("\n"),
          loader: "ts",
        }));
      if (!styles) return;
      build.onResolve({ filter: /\.css$/ }, ({ path, importer }) => {
        if (!/\.[jt]sx?$/.test(importer) || path.endsWith("/globals.css")) return undefined;
        return { path: path.startsWith("@/") ? join(SRC, path.slice(2)) : join(dirname(importer), path), namespace: "style" };
      });
      build.onLoad({ filter: /.*/, namespace: "style" }, ({ path }) => {
        const css = styles.get(path);
        if (css === undefined) throw new Error(`${path} is not among the stylesheets tools/build.ts minified`);
        return {
          contents: `const style = document.createElement("style");
style.dataset.css = ${JSON.stringify(path.slice(SRC.length + 1))};
style.textContent = ${JSON.stringify(css)};
document.head.append(style);
`,
          loader: "js",
        };
      });
    },
  };
}

/** The dev server's plugin (bunfig.toml, [serve.static]): developer helpers on, no service worker, served from the root, CSS left to Bun. */
export default appPlugin({ DEV: true, PROD: false, BASE_URL: "/" });
