import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "@rstest/core";
import { CATEGORIES } from "@/content/games";
import { cyrillicLetterOf, RUSSIAN_KEYBOARD_ROWS } from "./cyrillicKeys";
import { APP_LANGUAGES, OWN_NAMES } from "./language";

const OTHER_LANGUAGES = APP_LANGUAGES.filter((id) => id !== "de");

/** Every .ts/.tsx file below `dir`, tests left out. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) && !name.includes(".test.") ? [path] : [];
  });
}

/** The text from `start` (an opening brace) to its closing brace. */
function braced(text: string, start: number) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return text.slice(start, i + 1);
  }
  return text.slice(start);
}

describe("app languages", () => {
  test("every category and game of the home menu has its name in each app language", () => {
    for (const id of OTHER_LANGUAGES) {
      for (const category of CATEGORIES) {
        expect(category.title[id], `${category.id} title in ${id}`).toBeTruthy();
        expect(category.subtitle[id], `${category.id} subtitle in ${id}`).toBeTruthy();
        for (const game of category.games) expect(game.title[id], `${game.href} in ${id}`).toBeTruthy();
      }
    }
  });

  test("every t({ de: … }) and pick({ de: … }) in the code also gives each app language", () => {
    const missing: string[] = [];
    for (const file of sources("src")) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(/\b(?:t|pick)\(\s*\{\s*de:/g)) {
        const object = braced(text, text.indexOf("{", match.index));
        for (const id of OTHER_LANGUAGES) {
          if (!new RegExp(`\\b${id}:`).test(object)) missing.push(`${file}: ${object.slice(0, 60)}… has no ${id}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  test("each app language has its own name for the language choice", () => {
    for (const id of APP_LANGUAGES) expect(OWN_NAMES[id]).toBeTruthy();
  });
});

describe("Russian key places", () => {
  test("every Russian letter can be typed on a Latin keyboard, each on its own key", () => {
    const letters = [...RUSSIAN_KEYBOARD_ROWS.join(""), "Ё"];
    expect(new Set(letters).size).toBe(33);
    const codes = ["Backquote", "BracketLeft", "BracketRight", "Semicolon", "Quote", "Comma", "Period", ..."QWERTYUIOPASDFGHJKLZXCVBNM"].map((c) =>
      c.length === 1 ? `Key${c}` : c,
    );
    const typed = codes.map((code) => cyrillicLetterOf({ key: "", code }));
    expect(new Set(typed)).toEqual(new Set(letters));
  });

  test("a Russian keyboard types its own letter, whatever the key's place", () => {
    expect(cyrillicLetterOf({ key: "ж", code: "KeyQ" })).toBe("Ж");
    expect(cyrillicLetterOf({ key: "q", code: "KeyQ" })).toBe("Й");
    expect(cyrillicLetterOf({ key: "1", code: "Digit1" })).toBeUndefined();
  });
});
