import { expect, test } from "bun:test";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PRODUCTION } from "../tools/appPlugin";

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
