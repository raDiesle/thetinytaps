import { readFileSync } from "node:fs";
import { describe, expect, test } from "@rstest/core";
import { CATEGORIES } from "./games";
import { IDEA_AREAS, LANGUAGE_STATUS, TOP_PICKS } from "./ideas";
import { keyMatches, keyOf, LANGUAGES, languageFor, toLower, toUpper } from "./languages";
import { TARGET_LANGUAGES } from "./targetLanguages";

describe("home menu", () => {
  const app = readFileSync("src/App.tsx", "utf8");
  const routes = new Set([...app.matchAll(/path="([^"]+)"/g)].map((match) => `/${match[1]}/`));
  const games = CATEGORIES.flatMap((category) => category.games);

  test.each(games.map((game) => [game.href, game] as const))("%s has a route in App.tsx", (href) => {
    expect(routes).toContain(href);
  });

  test("category ids and game addresses are unique", () => {
    const ids = CATEGORIES.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
    const hrefs = games.map((game) => game.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("ideas", () => {
  const ideas = IDEA_AREAS.flatMap((area) => area.ideas.map((idea) => ({ area, idea })));

  test("ids are unique and belong to their area", () => {
    const ids = ideas.map(({ idea }) => idea.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const { area, idea } of ideas) expect(idea.id).toMatch(new RegExp(`^${area.prefix}-\\d{2,}$`));
  });

  test("each area has its own prefix and sits in one group", () => {
    const prefixes = IDEA_AREAS.map((area) => area.prefix);
    expect(prefixes.filter((p, i) => prefixes.indexOf(p) !== i)).toEqual([]);
  });

  test("top picks name existing ideas", () => {
    const ids = new Set(ideas.map(({ idea }) => idea.id));
    for (const pick of TOP_PICKS) expect(ids).toContain(pick.id);
  });

  test("a rejected idea is not marked as done", () => {
    expect(ideas.filter(({ idea }) => idea.rejected && idea.done).map(({ idea }) => idea.id)).toEqual([]);
  });
});

describe("language status on the ideas page", () => {
  test("names every game of the home menu once, in menu order, then the home page", () => {
    const hrefs = [...CATEGORIES.flatMap((category) => category.games.map((game) => game.href)), "/"];
    expect(LANGUAGE_STATUS.map((row) => row.href)).toEqual(hrefs);
  });

  test("letters and words speak exactly the wanted languages that have a language pack", () => {
    const packs = LANGUAGES.map((language) => language.id as string).filter((id) => TARGET_LANGUAGES.some((target) => target.id === id));
    for (const href of ["/buchstaben/", "/woerter/"]) {
      const row = LANGUAGE_STATUS.find((r) => r.href === href);
      expect(Object.keys(row?.languages ?? {}).sort(), href).toEqual(packs.sort());
    }
  });

  test("German is wanted first and no language twice", () => {
    const ids = TARGET_LANGUAGES.map((language) => language.id);
    expect(ids[0]).toBe("de");
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe.each(LANGUAGES.map((language) => [language.id, language] as const))("language %s", (_, { pack }) => {
  test("every letter has words that start with it (or, for a letter no word starts with, have it inside)", () => {
    for (const letter of pack.letters) {
      expect(letter.words.length, letter.upper).toBeGreaterThan(0);
      for (const { word } of letter.words) {
        if (letter.inWord) expect(toUpper(word, pack).slice(1), word).toContain(letter.upper);
        else expect(toUpper(word.charAt(0), pack), word).toBe(letter.upper);
      }
    }
  });

  test("every letter has a spoken name, a matching lower case and comes once", () => {
    for (const letter of pack.letters) {
      expect(letter.spoken.trim(), letter.upper).not.toBe("");
      expect(letter.lower, letter.upper).toBe(toLower(letter.upper, pack));
    }
    const uppers = pack.letters.map((l) => l.upper);
    expect(new Set(uppers).size).toBe(uppers.length);
  });

  test("countables have every form for 0–9, and a word stands under one letter only", () => {
    for (const thing of pack.countables) for (let n = 0; n <= 9; n++) expect(pack.countSentence(n, thing), `${thing.singular} ${n}`).not.toMatch(/undefined/);
    const words = pack.letters.flatMap((l) => l.words.map((w) => w.word));
    expect(words.filter((w, i) => words.indexOf(w) !== i)).toEqual([]);
  });

  test("every letter can be typed on the keyboard", () => {
    const keys = [...pack.keyboardRows.join("")];
    for (const letter of pack.letters)
      expect(
        keys.some((key) => keyMatches(key, letter.upper, pack)),
        letter.upper,
      ).toBe(true);
  });

  test("numbers 0–9 have words", () => {
    expect(pack.numberWords).toHaveLength(10);
  });
});

describe("Russian", () => {
  const { pack } = languageFor("ru");

  test("has the 33 letters of the alphabet in order", () => {
    expect(pack.letters.map((l) => l.upper).join("")).toBe("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ");
  });

  test("only Ъ, Ы and Ь have their words with the letter inside", () => {
    expect(pack.letters.filter((l) => l.inWord).map((l) => l.upper)).toEqual(["Ъ", "Ы", "Ь"]);
  });

  test("counts with the right plural forms", () => {
    const duck = pack.countables.find((c) => c.emoji === "🦆")!;
    expect([0, 1, 2, 3, 4, 5, 9].map((n) => pack.countSentence(n, duck))).toEqual([
      "ноль уток!",
      "одна утка!",
      "две утки!",
      "три утки!",
      "четыре утки!",
      "пять уток!",
      "девять уток!",
    ]);
    const bus = pack.countables.find((c) => c.emoji === "🚌")!;
    expect([1, 2, 5].map((n) => pack.countSentence(n, bus))).toEqual(["один автобус!", "два автобуса!", "пять автобусов!"]);
    const apple = pack.countables.find((c) => c.emoji === "🍎")!;
    expect([1, 2].map((n) => pack.countSentence(n, apple))).toEqual(["одно яблоко!", "два яблока!"]);
  });

  test("a German keyboard types Russian letters by their place", () => {
    expect(keyOf({ key: "q", code: "KeyQ" }, pack)).toBe("Й");
    expect(keyOf({ key: "z", code: "KeyY" }, pack)).toBe("Н");
    expect(keyOf({ key: "ö", code: "Semicolon" }, pack)).toBe("Ж");
    expect(keyOf({ key: "ф", code: "KeyA" }, pack)).toBe("Ф");
    expect(keyOf({ key: "3", code: "Digit3" }, pack)).toBe("3");
    expect(keyOf({ key: "Enter", code: "Enter" }, pack)).toBe("Enter");
    // Other languages keep the key itself.
    expect(keyOf({ key: "z", code: "KeyY" }, languageFor("de").pack)).toBe("z");
  });

  test("Й is its own key, Е also finds Ё", () => {
    expect(keyMatches("И", "Й", pack)).toBe(false);
    expect(keyMatches("Е", "Ё", pack)).toBe(true);
  });

  test("speaks in Russian and asks about letters", () => {
    const b = pack.letters[1];
    expect(pack.letterSentence(b, b.words[0])).toBe("бэ – как банан!");
    const y = pack.letters.find((l) => l.upper === "Ы")!;
    expect(pack.letterSentence(y, y.words[0])).toBe("ы – в слове сыр!");
    expect(pack.findPrompt(b)).toBe("Где буква бэ?");
  });
});
