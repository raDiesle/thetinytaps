import { describe, expect, test } from "bun:test";
import { dirname, join, relative } from "node:path";
import { isTest, read, sourceFiles } from "@/testSources";
import { TEXTS_LANGUAGES, TEXTS_PARTS } from ".";

// A visit downloads only the texts of its language: every file in another language (`ru.ts`, `content.ru.ts`,
// `lines.ru.ts`, …) is listed in its language's module (texts-ru.ts) and imported nowhere else, or it would be
// bundled with the game or the start page and downloaded by everybody. The biggest games' files are in a part of their
// language (texts-ru-together.ts), loaded only with the game's page, never with the language's texts before the first screen.

const SRC = join(import.meta.dir, "../..");
const LANGUAGE_FILE = new RegExp(`(^|[/.])(${TEXTS_LANGUAGES.join("|")})\\.ts$`);

const sources = sourceFiles().filter((file) => /\.tsx?$/.test(file) && !isTest(file) && file !== "testPreload.ts");
// German's words pack (content/de.ts) is the code's own first language, played without the German module.
const languageFiles = sources.filter((file) => LANGUAGE_FILE.test(file) && !file.startsWith("content/texts/") && file !== "content/de.ts");

/** The source files `file` imports (aliases and relative paths; packages left out). */
function importsOf(file: string) {
  const code = read(join(SRC, file));
  return [...code.matchAll(/(?:from|import)\s*\(?\s*"([^"]+)"/g)]
    .map(([, path]) => (path.startsWith("@/") ? path.slice(2) : path.startsWith(".") ? relative(SRC, join(SRC, dirname(file), path)) : undefined))
    .filter((path) => path !== undefined)
    .map((path) => (sources.includes(`${path}.ts`) ? `${path}.ts` : sources.includes(`${path}.tsx`) ? `${path}.tsx` : `${path}/index.ts`));
}

/** The parts' modules (`content/texts/texts-<language>-<part>.ts`) with their language and part. */
const partModules = sources.flatMap((file) => {
  const [, language, part] = /^content\/texts\/texts-([a-z]{2})-(\w+)\.ts$/.exec(file) ?? [];
  return language && part ? [{ file, language, part }] : [];
});

describe("language files", () => {
  test("there are some", () => expect(languageFiles.length).toBeGreaterThan(100));

  test.each(TEXTS_LANGUAGES)("%s: all listed in its texts module or in one of its parts", async (id) => {
    const listed = [`content/texts/texts-${id}.ts`, ...partModules.filter((m) => m.language === id).map((m) => m.file)].flatMap(importsOf);
    const own = languageFiles.filter((file) => file.endsWith(`${id}.ts`) && LANGUAGE_FILE.exec(file)?.[2] === id);
    expect(own.filter((file) => !listed.includes(file))).toEqual([]);
  });

  test("imported only by their language's texts module", () => {
    const strays: string[] = [];
    for (const file of sources) {
      const language = /^content\/texts\/texts-([a-z]{2})(?:-\w+)?\.ts$/.exec(file)?.[1];
      for (const imported of importsOf(file)) {
        const of = LANGUAGE_FILE.exec(imported)?.[2];
        if (of && languageFiles.includes(imported) && of !== language) strays.push(`${file} → ${imported}`);
      }
    }
    expect(strays).toEqual([]);
  });
});

describe("parts loaded with their game's page", () => {
  test("every part of every language is one of index.ts's parts, and loaded nowhere else", () => {
    expect(partModules.length).toBeGreaterThan(10);
    expect([...new Set(partModules.map((m) => m.part))].sort()).toEqual([...TEXTS_PARTS].sort());
    const loaders = importsOf("content/texts/index.ts");
    expect(partModules.filter((m) => !loaders.includes(m.file)).map((m) => m.file)).toEqual([]);
    const strays = sources.flatMap((file) =>
      file === "content/texts/index.ts"
        ? []
        : importsOf(file)
            .filter((imported) => partModules.some((m) => m.file === imported))
            .map((imported) => `${file} → ${imported}`),
    );
    expect(strays).toEqual([]);
  });

  test.each(TEXTS_LANGUAGES)("%s: its texts before the first screen hold nothing of a part's game", (id) => {
    // A part's game is the folder its files are in (games/together/); none of its files may come back into the language's chunk.
    const folders = new Set(
      partModules.flatMap((m) =>
        importsOf(m.file)
          .filter((f) => languageFiles.includes(f))
          .map((f) => dirname(f)),
      ),
    );
    expect(folders.size).toBeGreaterThanOrEqual(TEXTS_PARTS.length);
    expect(importsOf(`content/texts/texts-${id}.ts`).filter((f) => folders.has(dirname(f)))).toEqual([]);
  });
});
