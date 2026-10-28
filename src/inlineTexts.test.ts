import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { findInlineTexts, inlineTextTables, LANGUAGE_TABLES, moveInlineTexts, movesInlineTexts } from "../tools/inlineTexts";

// The build moves texts written inline, t({ de: "Musik", ru: "Музыка" }), into the language chunks
// (tools/inlineTexts.ts); the tests themselves see the sources as written, so these check the move.

const SRC = import.meta.dir;
const TEXTS = join(SRC, "content/texts/index.ts");
const sources = [...new Bun.Glob("**/*.{ts,tsx}").scanSync({ cwd: SRC })].map((file) => join(SRC, file)).filter(movesInlineTexts);

test("an object of plain texts by language moves out, German stays; others stay as they are", () => {
  const code = `const a = t({ de: "Musik", en: "Music", ru: "Музыка" });
const b = t({ de: "Ja", ru: \`Да\` });
const c = t({ de: (n: number) => \`\${n} Paare\`, ru: (n: number) => \`\${n} пар\` });
const d = { de: "nur Deutsch" };
const e = { de: "x", en: "y", other: "z" };`;
  const moved = moveInlineTexts(code, "/texts.ts")!;
  const [found] = findInlineTexts(code);
  expect(moved.split("\n")[1]).toBe(`const a = t({ de: "Musik", ...__inlineText(${JSON.stringify(found.key)}) });`);
  expect(moved.split("\n").slice(2).join("\n")).toBe(code.split("\n").slice(1).join("\n"));
  expect(found.texts).toEqual({ de: "Musik", en: "Music", ru: "Музыка" });
});

test("a file of tables by language is left whole", () => {
  expect(moveInlineTexts(`// ${LANGUAGE_TABLES}\nconst names = { de: "Deutsch", en: "German" };`, TEXTS)).toBeUndefined();
});

test("every source still compiles after the move, and most inline texts move", async () => {
  const transpiler = new Bun.Transpiler({ loader: "tsx" });
  let count = 0;
  for (const path of sources) {
    const moved = moveInlineTexts(await Bun.file(path).text(), TEXTS);
    if (moved === undefined) continue;
    count += findInlineTexts(await Bun.file(path).text()).length;
    expect(() => transpiler.transformSync(moved), path).not.toThrow();
  }
  expect(count).toBeGreaterThan(400);
  const tables = await inlineTextTables(SRC);
  expect(Object.keys(tables).sort()).toEqual(["ar", "en", "es", "hi", "ru", "zh"]);
  expect(Object.keys(tables.ru).length).toBeGreaterThan(300);
});

test("nothing that runs before the app language is loaded has inline texts (src/index.tsx and its imports)", async () => {
  const seen = new Set<string>();
  const visit = async (path: string) => {
    if (seen.has(path)) return;
    seen.add(path);
    const code = await Bun.file(path).text();
    // Static imports only: `await import("./main")` runs after the language is loaded.
    for (const [, spec] of code.matchAll(/^import (?!type )[^"]*"([^"]+)";$/gm)) {
      const base = spec.startsWith("@/") ? join(SRC, spec.slice(2)) : spec.startsWith(".") ? join(dirname(path), spec) : undefined;
      const file = base && [`${base}.ts`, `${base}.tsx`, join(base, "index.ts")].find((candidate) => existsSync(candidate));
      if (file) await visit(file);
    }
  };
  await visit(join(SRC, "index.tsx"));
  const early = [...seen].filter((path) => movesInlineTexts(path) && findInlineTexts(readFileSync(path, "utf8")).length > 0);
  expect(early.map((path) => relative(SRC, path))).toEqual([]);
  expect(seen.size).toBeGreaterThan(3);
});
