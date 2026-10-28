import { describe, expect, test } from "bun:test";
import { dirname, join, relative } from "node:path";
import { TEXTS_LANGUAGES } from ".";

// A visit downloads only the texts of its language: every file in another language (`ru.ts`, `content.ru.ts`,
// `lines.ru.ts`, …) is listed in its language's module (texts-ru.ts) and imported nowhere else, or it would be
// bundled with the game or the start page and downloaded by everybody.

const SRC = join(import.meta.dir, "../..");
const LANGUAGE_FILE = new RegExp(`(^|[/.])(${TEXTS_LANGUAGES.join("|")})\\.ts$`);

const sources = [...new Bun.Glob("**/*.{ts,tsx}").scanSync({ cwd: SRC })].filter((file) => !/\.test\.tsx?$/.test(file) && file !== "testPreload.ts");
const languageFiles = sources.filter((file) => LANGUAGE_FILE.test(file) && !file.startsWith("content/texts/"));

/** The source files `file` imports (aliases and relative paths; packages left out). */
async function importsOf(file: string) {
  const code = await Bun.file(join(SRC, file)).text();
  return [...code.matchAll(/(?:from|import)\s*\(?\s*"([^"]+)"/g)]
    .map(([, path]) => (path.startsWith("@/") ? path.slice(2) : path.startsWith(".") ? relative(SRC, join(SRC, dirname(file), path)) : undefined))
    .filter((path) => path !== undefined)
    .map((path) => (sources.includes(`${path}.ts`) ? `${path}.ts` : sources.includes(`${path}.tsx`) ? `${path}.tsx` : `${path}/index.ts`));
}

describe("language files", () => {
  test("there are some", () => expect(languageFiles.length).toBeGreaterThan(100));

  test.each(TEXTS_LANGUAGES)("%s: all listed in its texts module", async (id) => {
    const listed = await importsOf(`content/texts/texts-${id}.ts`);
    const own = languageFiles.filter((file) => file.endsWith(`${id}.ts`) && LANGUAGE_FILE.exec(file)?.[2] === id);
    expect(own.filter((file) => !listed.includes(file))).toEqual([]);
  });

  test("imported only by their language's texts module", async () => {
    const strays: string[] = [];
    for (const file of sources) {
      const language = /^content\/texts\/texts-(\w+)\.ts$/.exec(file)?.[1];
      for (const imported of await importsOf(file)) {
        const of = LANGUAGE_FILE.exec(imported)?.[2];
        if (of && languageFiles.includes(imported) && of !== language) strays.push(`${file} → ${imported}`);
      }
    }
    expect(strays).toEqual([]);
  });
});
