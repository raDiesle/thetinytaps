import { expect, test } from "bun:test";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PRODUCTION } from "../tools/appPlugin";
import { fontsAsFiles } from "../tools/pageStart";

// Bun bundles the app with one plugin (tools/appPlugin.ts); code written for another bundler would build
// with holes (no sounds, no pictures) or not at all. These checks keep the code to what the plugin offers.

const SRC = import.meta.dir;
const code = (readdirSync(SRC, { recursive: true, encoding: "utf8" }) as string[])
  .filter((file) => /\.(ts|tsx)$/.test(file) && !file.endsWith(".test.ts"))
  .map((file) => ({ file, text: readFileSync(join(SRC, file), "utf8") }));

test("no code of another bundler: files come from `?glob` imports, build facts from src/lib/buildInfo.ts", () => {
  const found = code.filter(({ text }) => /import\.meta\.(webpackContext|env|glob)\b|require\.context/.test(text)).map(({ file }) => file);
  expect(found).toEqual([]);
});

test("no value that changes with every build is compiled into the code: it renamed most chunks on each deploy", () => {
  // The build's time is written into the pages (tools/build.ts) and read from there (`buildDate` in src/lib/pwa.ts).
  const info = readFileSync(join(SRC, "lib", "buildInfo.ts"), "utf8");
  expect(info).not.toMatch(/new Date\(|Date\.now|Math\.random|crypto/);
  const plugin = readFileSync(join(SRC, "..", "tools", "appPlugin.ts"), "utf8");
  expect(plugin).not.toMatch(/BUILD_TIME|toISOString|Date\.now/);
  expect(code.filter(({ text }) => /\bBUILD_TIME\b/.test(text)).map(({ file }) => file)).toEqual([]);
  expect(readFileSync(join(SRC, "..", "tools", "build.ts"), "utf8")).toContain('<meta name="build-time" content=');
  expect(code.find(({ file }) => file === join("lib", "pwa.ts"))?.text).toContain('meta[name="build-time"]');
});

test("a `?glob` pattern has one extension and no braces, which Bun can't load", () => {
  const wrong: string[] = [];
  for (const { file, text } of code)
    for (const [, pattern] of text.matchAll(/from "([^"]*)\?glob"/g)) if (/[{},]/.test(pattern) || !/\*\.\w+$/.test(pattern)) wrong.push(`${file}: ${pattern}`);
  expect(wrong).toEqual([]);
});

test("fonts leave the start stylesheet as files of their own: embedded, they held up every page's first picture (R-P5)", async () => {
  // Bun embeds every font a stylesheet names as base64, so the build takes them out again (fontsAsFiles).
  const result = await Bun.build({ entrypoints: [join(SRC, "styles", "font.css")], minify: true, throw: false });
  expect(result.success).toBe(true);
  const embedded = await result.outputs[0].text();
  expect(embedded).toContain("data:font/woff2");
  const source = readFileSync(join(SRC, "styles", "font.css"), "utf8");
  const names = new Map<string, string>();
  for (const [, path] of source.matchAll(/url\("([^"]+\.woff2)"\)/g)) {
    const bytes = readFileSync(join(SRC, "styles", path));
    names.set(new Bun.CryptoHasher("sha256").update(bytes).digest("hex"), path.slice(path.lastIndexOf("/") + 1, -".woff2".length));
  }
  const { css, files } = fontsAsFiles(embedded, names, "/static/");
  expect(css).not.toContain("data:font");
  expect(files.map((file) => file.path.replace(/\.[0-9a-f]{8}\./, ".#."))).toEqual([
    "static/fredoka-latin-ext-wght-normal.#.woff2",
    "static/fredoka-latin-wght-normal.#.woff2",
  ]);
  for (const file of files) expect(css).toContain(`url(/${file.path})`);
  // The build preloads the Latin one by that name and fails when a stylesheet still embeds one.
  const build = readFileSync(join(SRC, "..", "tools", "build.ts"), "utf8");
  expect(build).toContain('const PRELOADED_FONT = "fredoka-latin-wght-normal"');
  expect(build).toContain('rel="preload" as="font" type="font/woff2" crossorigin');
  // And no stylesheet of src/ embeds one itself.
  const styles = (readdirSync(SRC, { recursive: true, encoding: "utf8" }) as string[]).filter((file) => file.endsWith(".css"));
  expect(styles.filter((file) => readFileSync(join(SRC, file), "utf8").includes("data:font"))).toEqual([]);
});

test("the build for players has React without its development code (several times faster on phones)", async () => {
  // A folder inside the project, so `react` resolves from its node_modules.
  const dir = mkdtempSync(join(SRC, "..", ".build-check-"));
  try {
    writeFileSync(join(dir, "check.tsx"), 'import { createRoot } from "react-dom/client";\ncreateRoot(document.body).render(<p key="a">a</p>);\n');
    const result = await Bun.build({ entrypoints: [join(dir, "check.tsx")], minify: true, ...PRODUCTION });
    const js = await result.outputs[0].text();
    expect(js).not.toContain("jsxDEV");
    expect(js).not.toContain("runWithFiberInDEV");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 20000);
