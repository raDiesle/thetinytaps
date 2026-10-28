import { createHash } from "node:crypto";
import { join } from "node:path";

// Texts written inline, `t({ de: "Musik", en: "Music", ru: "Музыка" })`, are moved into the language
// chunks by the build (and the dev server), so a visit downloads only its own language of them too: the
// object becomes `{ de: "Musik", ...inlineText("3f9c0a1b") }`, and inlineText (src/content/texts) gives
// the app language's text from its chunk. Only objects whose keys are all languages and whose values are
// all plain strings are moved; functions, JSX and texts with ${…} stay as they are. The tests see the
// sources unchanged. A file of tables by language rather than texts (the languages' names, the language
// table of the management page) carries LANGUAGE_TABLES and is left whole.

/** Marks a file whose objects by language are tables needed in every language at once, not texts. */
export const LANGUAGE_TABLES = "@language-tables";

const LANGUAGES = "de|en|zh|hi|es|ar|ru|it";
const STRING = String.raw`"(?:[^"\\\n]|\\.)*"`;
const PROPERTY = String.raw`(?:${LANGUAGES})\s*:\s*${STRING}`;
/** `{ de: "…", ru: "…", … }`: only language keys, only plain strings. */
const OBJECT = new RegExp(String.raw`\{\s*${PROPERTY}(?:\s*,\s*${PROPERTY})*\s*,?\s*\}`, "g");
const PROPERTIES = new RegExp(String.raw`(${LANGUAGES})\s*:\s*(${STRING})`, "g");

/** One inline text: where it is, its key and its texts by language (German among them). */
export interface InlineText {
  start: number;
  end: number;
  key: string;
  texts: Record<string, string>;
  /** The German text as written in the code. */
  german: string;
}

/** The inline texts in `code` that the build moves out: with German and at least one other language. */
export function findInlineTexts(code: string): InlineText[] {
  if (code.includes(LANGUAGE_TABLES)) return [];
  return [...code.matchAll(OBJECT)].flatMap((match) => {
    const literals = Object.fromEntries([...match[0].matchAll(PROPERTIES)].map(([, id, literal]) => [id, literal]));
    if (literals.de === undefined || Object.keys(literals).length < 2) return [];
    let texts: Record<string, string>;
    try {
      texts = Object.fromEntries(Object.entries(literals).map(([id, literal]) => [id, JSON.parse(literal)]));
    } catch {
      // An escape JSON doesn't know (\x41, \'): left inline.
      return [];
    }
    // By content, so the same text in two places is stored once and a key stays when other code moves.
    const key = createHash("sha256").update(JSON.stringify(texts)).digest("hex").slice(0, 10);
    return [{ start: match.index, end: match.index + match[0].length, key, texts, german: literals.de }];
  });
}

/** `code` with its inline texts moved out, importing `inlineText` from `textsModule`; undefined when it has none. */
export function moveInlineTexts(code: string, textsModule: string): string | undefined {
  const found = findInlineTexts(code);
  if (found.length === 0) return undefined;
  let moved = "";
  let at = 0;
  for (const { start, end, key, german } of found) {
    moved += `${code.slice(at, start)}{ de: ${german}, ...__inlineText(${JSON.stringify(key)}) }`;
    at = end;
  }
  return `import { inlineText as __inlineText } from ${JSON.stringify(textsModule)};\n${moved}${code.slice(at)}`;
}

/** The files whose inline texts are moved: the app's sources without tests and the language chunks themselves. */
export const movesInlineTexts = (path: string) => /\/src\/.*\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path) && !path.includes("/src/content/texts/");

/** Every inline text of the sources in `src`, by language and key: what each language chunk carries. */
export async function inlineTextTables(src: string): Promise<Record<string, Record<string, string>>> {
  const tables: Record<string, Record<string, string>> = {};
  for (const file of new Bun.Glob("**/*.{ts,tsx}").scanSync({ cwd: src })) {
    const path = join(src, file);
    if (!movesInlineTexts(path)) continue;
    for (const { key, texts } of findInlineTexts(await Bun.file(path).text()))
      for (const [id, text] of Object.entries(texts)) if (id !== "de") (tables[id] ??= {})[key] = text;
  }
  return tables;
}
