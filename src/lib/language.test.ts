import { describe, expect, test } from "bun:test";
import { CATEGORIES } from "@/content/games";
import { LANGUAGES, type LanguageId } from "@/content/languages";
import { cyrillicLetterOf, RUSSIAN_KEYBOARD_ROWS } from "./cyrillicKeys";
import { APP_LANGUAGES, OWN_NAMES } from "./language";

describe("app languages", () => {
  // Translations are made only on request, so a name may be missing (it shows in German); one that is there is Russian.
  test("the Russian names of the home menu are written in Cyrillic", () => {
    const names = CATEGORIES.flatMap((c) => [c.title, c.subtitle, ...c.games.map((g) => g.title)]).flatMap((text) => (text.ru ? [text.ru] : []));
    for (const name of names) expect(name, name).toMatch(/^[^A-Za-z]*$/);
  });

  // One language for everything: the letters and words games play in the app language, so it needs a pack.
  test("each app language has a pack for the letters and words games", () => {
    for (const id of APP_LANGUAGES) expect(LANGUAGES.map((l) => l.id)).toContain(id as LanguageId);
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
