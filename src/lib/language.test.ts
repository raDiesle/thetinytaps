import { describe, expect, test } from "bun:test";
import { CATEGORIES } from "@/content/games";
import { LANGUAGES, type LanguageId } from "@/content/languages";
import { ARABIC_KEYBOARD_ROWS, arabicLetterOf } from "./arabicKeys";
import { cyrillicLetterOf, RUSSIAN_KEYBOARD_ROWS } from "./cyrillicKeys";
import { devanagariLetterOf, HINDI_KEYBOARD_ROWS } from "./devanagariKeys";
import { APP_LANGUAGES, OWN_NAMES } from "./language";

describe("app languages", () => {
  // Translations are made only on request, so a name may be missing (it shows in German); one that is there is in
  // the language's own script, never German words in Latin letters on a Russian, Chinese, Hindi or Arabic menu.
  test("the home menu's names in languages with their own script have no Latin letters", () => {
    const texts = CATEGORIES.flatMap((c) => [c.title, ...c.games.map((g) => g.title)]);
    for (const id of ["ru", "zh", "hi", "ar"] as const) {
      for (const name of texts.flatMap((text) => text[id] ?? [])) expect(name, `${id}: ${name}`).toMatch(/^[^A-Za-z]*$/);
    }
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
    expect([...new Set(typed)].sort()).toEqual(letters.sort());
  });

  test("a Russian keyboard types its own letter, whatever the key's place", () => {
    expect(cyrillicLetterOf({ key: "ж", code: "KeyQ" })).toBe("Ж");
    expect(cyrillicLetterOf({ key: "q", code: "KeyQ" })).toBe("Й");
    expect(cyrillicLetterOf({ key: "1", code: "Digit1" })).toBeUndefined();
  });
});

/** Every key place of the letter keys on a Latin keyboard. */
const LETTER_CODES = ["Backquote", "BracketLeft", "BracketRight", "Semicolon", "Quote", "Comma", "Period", "Slash", ..."QWERTYUIOPASDFGHJKLZXCVBNM"].map((c) =>
  c.length === 1 ? `Key${c}` : c,
);

describe("Hindi key places", () => {
  test("every key of the on-screen rows types its letter, and Shift brings the breathy consonants", () => {
    const plain = new Set(LETTER_CODES.map((code) => devanagariLetterOf({ key: "", code })));
    for (const letter of HINDI_KEYBOARD_ROWS.join("")) expect(plain).toContain(letter);
    const all = new Set([...plain, ...LETTER_CODES.map((code) => devanagariLetterOf({ key: "", code, shiftKey: true }))]);
    // The consonants of the Hindi alphabet (without the nukta forms) and its ten vowels.
    for (const letter of "कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहअआइईउऊएऐओऔ") expect(all, letter).toContain(letter);
  });

  test("a Hindi keyboard types its own letter, a vowel sign as its vowel", () => {
    expect(devanagariLetterOf({ key: "क", code: "KeyQ" })).toBe("क");
    expect(devanagariLetterOf({ key: "ा", code: "KeyE" })).toBe("आ");
    expect(devanagariLetterOf({ key: "k", code: "KeyK" })).toBe("क");
    expect(devanagariLetterOf({ key: "K", code: "KeyK", shiftKey: true })).toBe("ख");
    expect(devanagariLetterOf({ key: "1", code: "Digit1" })).toBeUndefined();
  });
});

describe("Arabic key places", () => {
  test("all 28 letters can be typed on a Latin keyboard, and every letter key types one of them", () => {
    const letters = [...ARABIC_KEYBOARD_ROWS.join("")];
    expect(new Set(letters).size).toBe(28);
    const typed = LETTER_CODES.map((code) => arabicLetterOf({ key: "", code }));
    expect(typed.includes(undefined)).toBe(false);
    expect([...new Set(typed)].sort()).toEqual(letters.sort());
  });

  test("an Arabic keyboard types its own letter, a form as the letter it is written with", () => {
    expect(arabicLetterOf({ key: "ب", code: "KeyQ" })).toBe("ب");
    expect(arabicLetterOf({ key: "ة", code: "KeyM" })).toBe("ت");
    expect(arabicLetterOf({ key: "f", code: "KeyF" })).toBe("ب");
    expect(arabicLetterOf({ key: "1", code: "Digit1" })).toBeUndefined();
  });
});
