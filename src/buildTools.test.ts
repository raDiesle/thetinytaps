import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

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

test("a `?glob` pattern has one extension and no braces, which Bun can't load", () => {
  const wrong: string[] = [];
  for (const { file, text } of code)
    for (const [, pattern] of text.matchAll(/from "([^"]*)\?glob"/g)) if (/[{},]/.test(pattern) || !/\*\.\w+$/.test(pattern)) wrong.push(`${file}: ${pattern}`);
  expect(wrong).toEqual([]);
});
