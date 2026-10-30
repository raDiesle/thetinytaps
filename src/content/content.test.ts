import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { CATEGORIES, categoryHref, categoryOf, hasPage } from "./games";
import { IDEA_AREAS, LANGUAGE_STATUS, type LanguageState, languageStateOf, TOP_PICKS } from "./ideas";
import { keyMatches, keyOf, LANGUAGES, languageFor, letterIndex, toLower } from "./languages";
import { RESEARCH } from "./research";
import { NO_INDEX_PATHS, SEO_PAGES, fullTitle } from "./seo";
import { SCENES } from "../games/scenes";
import { WORLDS } from "../components/Worlds";
import { TARGET_LANGUAGES } from "./targetLanguages";

describe("home menu", () => {
  const app = readFileSync("src/App.tsx", "utf8");
  const routes = new Set([...app.matchAll(/path="([^"]+)"/g)].map((match) => `/${match[1]}/`));
  const games = CATEGORIES.flatMap((category) => category.games);

  test.each(games.flatMap((game) => [game.href, ...(game.also ?? [])]).map((href) => [href] as const))("%s has a route in App.tsx", (href) => {
    expect(routes).toContain(href);
  });

  test("a category of one game opens it directly, without a menu of one card", () => {
    for (const category of CATEGORIES) {
      if (category.onHome) continue;
      expect(categoryHref(category), category.id).toBe(category.games.length === 1 ? category.games[0].href : `/spiele/${category.id}/`);
    }
  });

  test("a category whose games stand on the home page has no page, and its games lead back home", () => {
    for (const category of CATEGORIES.filter((c) => c.onHome)) {
      expect(hasPage(category), category.id).toBe(false);
      for (const game of category.games) expect(categoryOf(game.href), game.href).toBeUndefined();
    }
  });

  test("every category has its world (backdrop, card colours, the picture on its card)", () => {
    for (const category of CATEGORIES) expect(WORLDS as readonly string[], category.id).toContain(category.id);
  });

  test("every card has a short line for grown-ups that fits in two lines", () => {
    const lines = [...games.map((g) => [g.href, g.blurb] as const), ...CATEGORIES.filter((c) => !c.onHome).map((c) => [c.id, c.blurb] as const)];
    for (const [where, blurb] of lines) {
      expect(blurb?.de, where).toBeDefined();
      for (const text of Object.values(blurb ?? {})) expect(text.length, where).toBeLessThanOrEqual(42);
    }
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

describe("search engine texts (seo.ts)", () => {
  const paths = SEO_PAGES.map((page) => page.path);

  test("every page of the menu and every scene has one, and nothing else", () => {
    const wanted = [
      "/",
      ...CATEGORIES.filter(hasPage).map((category) => `/spiele/${category.id}/`),
      ...CATEGORIES.flatMap((category) => category.games.flatMap((game) => [game.href, ...(game.also ?? [])])),
      ...SCENES.map((scene) => `/bilder/${scene.id}/`),
    ];
    expect([...paths].sort()).toEqual([...new Set(wanted)].sort());
  });

  test.each(SEO_PAGES.map((page) => [page.path, page] as const))("%s: title and description fit in a search result", (_, page) => {
    expect(fullTitle(page).length, fullTitle(page)).toBeLessThanOrEqual(70);
    expect(page.description.length, page.description).toBeGreaterThanOrEqual(80);
    expect(page.description.length, page.description).toBeLessThanOrEqual(160);
    expect(page.text.length).toBeGreaterThan(60);
  });

  test("titles and descriptions are not shared between pages", () => {
    for (const key of ["title", "description"] as const) {
      const values = SEO_PAGES.map((page) => page[key]);
      expect(values.filter((v, i) => values.indexOf(v) !== i)).toEqual([]);
    }
  });

  test("grown-up pages are never in the search pages", () => {
    for (const path of NO_INDEX_PATHS) expect(paths).not.toContain(path);
  });
});

describe("research on the management page", () => {
  const ideaIds = new Set(IDEA_AREAS.flatMap((area) => area.ideas.map((idea) => idea.id)));
  const hrefs = new Set(CATEGORIES.flatMap((category) => category.games.flatMap((game) => [game.href, ...(game.also ?? [])])));

  test.each(RESEARCH.map((r) => [r.id, r] as const))("%s names existing ideas and games", (_, research) => {
    for (const id of [...research.ideas, ...research.topics.flatMap((topic) => topic.ideas)]) expect(ideaIds, id).toContain(id);
    for (const game of research.games) expect(hrefs, game.href).toContain(game.href);
    expect(research.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("checked domains come best first, each ending once as free or taken", () => {
    for (const research of RESEARCH) {
      const domains = research.domains ?? [];
      const ranks = domains.map((d) => d.rank);
      expect(ranks, research.id).toEqual([...ranks].sort((a, b) => a - b));
      expect(new Set(domains.map((d) => d.name)).size, research.id).toBe(domains.length);
      for (const { name, free, taken } of domains) {
        const endings = [...free, ...taken];
        expect(new Set(endings).size, name).toBe(endings.length);
      }
    }
  });

  test("ids are unique and the newest comes first", () => {
    const ids = RESEARCH.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    const dates = RESEARCH.map((r) => r.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("language status on the management page", () => {
  test("names every game of the home menu once, in menu order, then the home page", () => {
    const hrefs = [...CATEGORIES.flatMap((category) => category.games.map((game) => game.href)), "/"];
    expect(LANGUAGE_STATUS.map((row) => row.href)).toEqual(hrefs);
  });

  test("Buchstaben & Zahlen speaks exactly the wanted languages that have a language pack", () => {
    const packs = LANGUAGES.map((language) => language.id as string).filter((id) => TARGET_LANGUAGES.some((target) => target.id === id));
    const row = LANGUAGE_STATUS.find((r) => r.href === "/buchstaben/");
    expect(Object.keys(row?.languages ?? {}).sort()).toEqual(packs.sort());
  });

  test("a game has its languages either as a whole or part by part, and only parts with recordings can lack them", () => {
    for (const row of LANGUAGE_STATUS) {
      expect(!!row.languages !== !!row.parts?.length, `${row.href}: languages or parts`).toBe(true);
      for (const part of row.parts ?? [row]) {
        const text = Object.entries(part.languages ?? {}).filter(([, state]) => state === "text");
        if (!row.recorded && !part.recorded) expect(text, row.href).toEqual([]);
      }
    }
  });

  test("a game with parts is done only where every part is", () => {
    const row = (...states: (LanguageState | undefined)[]) => ({ href: "/", parts: states.map((s) => ({ label: "", languages: s ? { en: s } : {} })) });
    expect(languageStateOf(row("done", "done"), "en")).toBe("done");
    expect(languageStateOf(row("done", "text"), "en")).toBe("text");
    expect(languageStateOf(row("done", undefined), "en")).toBe("partial");
    expect(languageStateOf(row(undefined, undefined), "en")).toBeUndefined();
  });

  // What a story speaks follows from its files: lines.<language>.ts is the translation, stimme/ (German)
  // or stimme/<language>/ the recordings (src/games/adventure/CLAUDE.md).
  test.each([
    ["🏝️ Die Schatzinsel", "treasureIsland"],
    ["☁️ Die Wolkenreise", "cloudTrip"],
  ])("Bewegungsabenteuer: %s shows the translations and recordings it has", (label, folder) => {
    const dir = `src/games/adventure/stories/${folder}`;
    const recorded = (path: string) => existsSync(path) && readdirSync(path).some((f) => f.endsWith(".mp3"));
    const translated = new Set(readdirSync(dir).flatMap((f) => /^lines\.([a-z]+)\.ts$/.exec(f)?.[1] ?? []));
    const expected = Object.fromEntries(
      TARGET_LANGUAGES.flatMap((l): [string, LanguageState][] => {
        if (l.id === "de") return [["de", recorded(`${dir}/stimme`) ? "done" : "text"]];
        if (!translated.has(l.id)) return [];
        return [[l.id, recorded(`${dir}/stimme/${l.id}`) ? "done" : "text"]];
      }),
    );
    const part = LANGUAGE_STATUS.find((r) => r.href === "/abenteuer/")?.parts?.find((p) => p.label === label);
    expect(part?.languages).toEqual(expected);
  });

  test("Zähne putzen: the sung song speaks exactly the wanted languages it has a song in", () => {
    const sung = readdirSync("src/games/teeth/musik").flatMap((f) => /^musik-zaehneputzen-lied-([a-z]{2})\.mp3$/.exec(f)?.[1] ?? []);
    const wanted = sung.filter((id) => TARGET_LANGUAGES.some((l) => l.id === id));
    const part = LANGUAGE_STATUS.find((r) => r.href === "/zaehne/")?.parts?.find((p) => p.label.startsWith("🎵"));
    expect(part?.languages).toEqual(Object.fromEntries(wanted.map((id) => [id, "done"])));
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
      // Counted in the pieces a word is typed by (its pinyin for Chinese), the plain form counts (أ for ا).
      for (const word of letter.words) {
        const at = letterIndex(word, letter, pack);
        if (letter.inWord) expect(at, word.word).toBeGreaterThan(0);
        else expect(at, word.word).toBe(0);
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
