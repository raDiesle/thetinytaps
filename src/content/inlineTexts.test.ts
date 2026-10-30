import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { APP_LANGUAGES } from "@/lib/language";
import { LANGUAGE_STATUS, type LanguageStatusRow } from "./ideas";

// The inline texts (`t({ de: "…", en: "…" })`) against the language status on the management page: where a game's
// row says a language is there, every inline text of the game has it. So the table can't claim more than the code
// has, and a text written German-only into a translated game shows up as a gap to mark there. Recorded parts (sung
// songs, Tapsi's voice) are left out: their state is about recordings, not inline texts.

/** The source folders of each row of the language status; the home page row has the shared screens and menus. */
const FOLDERS: Record<string, string[]> = {
  "/bilder/": ["src/games/scenes"],
  "/abenteuer/": ["src/games/adventure"],
  "/gefuehle/": ["src/games/feelings"],
  "/kettenreaktion/": ["src/games/marbles"],
  "/kleine-abenteuer/": ["src/games/elevator"],
  "/tiere/": ["src/games/animals"],
  "/schatten/": ["src/games/shadows"],
  "/socken/": ["src/games/socks"],
  "/buchstaben/": ["src/games/letters"],
  "/zaehne/": ["src/games/teeth"],
  "/toepfchen/": ["src/games/potty"],
  "/belohnungstafel/": ["src/games/rewards"],
  "/laut-leise/": ["src/games/loud"],
  "/": ["src/components", "src/pages", "src/lib", "src/content/games.ts"],
};

/** Grown-ups' pages that stay German (CLAUDE.md): the management page. */
const GERMAN_ONLY = /management|ManagementPage|PicturePromptReview/;

/** Every .ts/.tsx file below `path` (or `path` itself), tests left out. */
function sources(path: string): string[] {
  if (/\.tsx?$/.test(path)) return [path];
  return readdirSync(path, { recursive: true, encoding: "utf8" })
    .filter((f) => /\.tsx?$/.test(f) && !f.includes(".test."))
    .map((f) => `${path}/${f}`)
    .filter((f) => !GERMAN_ONLY.test(f));
}

/** A literal text with a `de` key in a source file: where it starts and the keys next to it. */
interface InlineText {
  line: number;
  german: string;
  keys: string[];
}

/**
 * The object literals of `code` whose `de` is a string or template literal, with their own keys. A small scanner
 * rather than a parser: it skips strings, templates and comments, and counts `key:` at the top level of each `{}`.
 */
function inlineTexts(code: string): InlineText[] {
  const found: InlineText[] = [];
  const stack: { open: string; start: number; keys: string[]; german?: string }[] = [];
  let word = "";
  let i = 0;
  /** The end of the string or template starting at `from`, nested `${…}` included. */
  const skipQuoted = (from: number) => {
    const quote = code[from];
    let j = from + 1;
    while (j < code.length && code[j] !== quote) {
      if (code[j] === "\\") j += 2;
      else if (quote === "`" && code.startsWith("${", j)) {
        let depth = 1;
        j += 2;
        while (depth && j < code.length) {
          if (code[j] === "{") depth++;
          else if (code[j] === "}") depth--;
          j++;
        }
      } else j++;
    }
    return j + 1;
  };
  while (i < code.length) {
    const c = code[i];
    if (code.startsWith("//", i)) i = code.indexOf("\n", i) === -1 ? code.length : code.indexOf("\n", i);
    else if (code.startsWith("/*", i)) i = code.indexOf("*/", i) + 2;
    else if (c === '"' || c === "'" || c === "`") {
      const end = skipQuoted(i);
      word = code.slice(i + 1, end - 1);
      i = end;
    } else if ("{[(".includes(c)) {
      stack.push({ open: c, start: i, keys: [] });
      word = "";
      i++;
    } else if ("}])".includes(c)) {
      const frame = stack.pop();
      if (c === "}" && frame?.german !== undefined) found.push({ line: code.slice(0, frame.start).split("\n").length, german: frame.german, keys: frame.keys });
      word = "";
      i++;
    } else if (/[\w$]/.test(c)) {
      const end = code.slice(i).search(/[^\w$]/);
      word = code.slice(i, end === -1 ? code.length : i + end);
      i += word.length;
    } else if (c === ":" && stack.at(-1)?.open === "{" && word) {
      const frame = stack[stack.length - 1];
      frame.keys.push(word);
      const value = code.slice(i + 1).trimStart();
      if (word === "de" && /^["'`]/.test(value)) frame.german = value.slice(0, 60);
      word = "";
      i++;
    } else {
      if (!/\s/.test(c)) word = "";
      i++;
    }
  }
  return found;
}

/** Whether `row` says the texts of `language` are there: every part without recordings at least translated. */
function textsDone(row: LanguageStatusRow, language: string) {
  const parts = row.parts ? row.parts.filter((p) => !p.recorded) : [row];
  return parts.every((p) => {
    const state = p.languages?.[language as keyof typeof p.languages];
    return state === "done" || state === "text";
  });
}

describe("inline texts against the language status", () => {
  test("every game of the language status has its folders, and every game folder is one's", () => {
    expect(Object.keys(FOLDERS).sort()).toEqual(LANGUAGE_STATUS.map((r) => r.href).sort());
    const listed = new Set(Object.values(FOLDERS).flat());
    expect(readdirSync("src/games").filter((f) => !listed.has(`src/games/${f}`))).toEqual([]);
  });

  test("the scanner finds texts and their languages", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: the sample is source code with a template literal in it
    const found = inlineTexts('t({ de: `A ${b.c}`, en: "B" }); x = { de: "Hallo", ru: \'Привет\' }; type L = { de: T };');
    expect(found.map((f) => [f.german.slice(0, 3), f.keys])).toEqual([
      ["`A ", ["de", "en"]],
      ['"Ha', ["de", "ru"]],
    ]);
  });

  for (const row of LANGUAGE_STATUS)
    test(`${row.href}: a language marked as there is in every inline text`, () => {
      const languages = APP_LANGUAGES.filter((language) => language !== "de" && textsDone(row, language));
      const missing = FOLDERS[row.href].flatMap(sources).flatMap((file) =>
        inlineTexts(readFileSync(file, "utf8")).flatMap(({ line, german, keys }) => {
          const lacking = languages.filter((language) => !keys.includes(language));
          return lacking.length ? [`${file}:${line} ${german} – ${lacking.join(", ")}`] : [];
        }),
      );
      expect(missing).toEqual([]);
    });
});
