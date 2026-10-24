import { readFileSync } from "node:fs";
import { describe, expect, test } from "@rstest/core";
import { CATEGORIES } from "./games";
import { IDEA_AREAS, TOP_PICKS } from "./ideas";
import { keyMatches, LANGUAGES, toUpper } from "./languages";

describe("home menu", () => {
  const app = readFileSync("src/App.tsx", "utf8");
  const routes = new Set([...app.matchAll(/path="([^"]+)"/g)].map((match) => `/${match[1]}/`));
  const games = CATEGORIES.flatMap((category) => category.games);

  test.each(games.map((game) => [game.href, game] as const))("%s has a route in App.tsx", (href) => {
    expect(routes).toContain(href);
  });

  // "/bilder/" has a tile per picture instead: href: `/bilder/${s.id}/`.
  const kidHome = readFileSync("src/pages/KidHome.tsx", "utf8");
  test.each(games.map((game) => [game.href, game] as const))("%s has a tile on the kid home page", (href) => {
    expect(kidHome).toMatch(new RegExp(`href: ["\`]${href}`));
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

  test("top picks name existing ideas", () => {
    const ids = new Set(ideas.map(({ idea }) => idea.id));
    for (const pick of TOP_PICKS) expect(ids).toContain(pick.id);
  });
});

describe.each(LANGUAGES.map((language) => [language.id, language] as const))("language %s", (_, { pack }) => {
  test("every letter has words that start with it", () => {
    for (const letter of pack.letters) {
      expect(letter.words.length, letter.upper).toBeGreaterThan(0);
      for (const { word } of letter.words) expect(toUpper(word.charAt(0), pack), word).toBe(letter.upper);
    }
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
