import { readdirSync, readFileSync } from "node:fs";

// Many tests look through the app's sources. Walking `src` and reading each file once per process, instead of once per
// test, keeps the serial run (`bun test`, CI) short; `bun test --parallel` runs each file in a process of its own.

const files = new Map<string, string[]>();
const texts = new Map<string, string>();
let rules: { file: string; selector: string; body: string }[] | undefined;

/** Whether a path is a test file (`*.test.ts` or `*.test.tsx`), which is never "source" (a filter on `.test.ts` alone lets `.test.tsx` through). */
export const isTest = (path: string): boolean => /\.test\.tsx?$/.test(path);

/** Every file below `dir` (default `src`), as paths relative to `dir`, walked once per process. Do not change the array. */
export function sourceFiles(dir = "src"): string[] {
  let list = files.get(dir);
  if (!list) {
    list = readdirSync(dir, { recursive: true, encoding: "utf8" });
    files.set(dir, list);
  }
  return list;
}

/** A file's text (UTF-8), read once per process. */
export function read(path: string): string {
  let text = texts.get(path);
  if (text === undefined) {
    text = readFileSync(path, "utf8");
    texts.set(path, text);
  }
  return text;
}

/** Every CSS rule in `src` (file relative to `src`, selector and body), roughly split – enough for flat rules and rules inside one @media. Built once. */
export function cssRules(): { file: string; selector: string; body: string }[] {
  rules ??= sourceFiles()
    .filter((file) => file.endsWith(".css"))
    .flatMap((file) =>
      [
        ...read(`src/${file}`)
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .matchAll(/([^{}]+)\{([^{}]*)\}/g),
      ].map(([, selector, body]) => ({ file, selector: selector.trim(), body })),
    );
  return rules;
}
