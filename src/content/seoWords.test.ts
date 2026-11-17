import { describe, expect, test } from "bun:test";
import { LEVEL_TEXTS } from "../games/marbles/content";
import { SEO_PAGES } from "./seo";
import { SEO_EN } from "./seo.en";

// What the search pages say must stay true and say enough (code review R-S1, R-S3, November 2026): the book's page
// still spoke of twenty chain reactions when Kettenreaktion had twenty-one, and the hub pages had a third of the
// words of their siblings, so Google had little to tell them apart by.

const german = (path: string) => SEO_PAGES.find((page) => page.path === path)?.text ?? "";
const english = (path: string) => SEO_EN.pages[path]?.text ?? "";
const words = (text: string) => text.split(/\s+/).filter(Boolean).length;

/** How many levels Kettenreaktion has, written as the texts write it. Add the words when the count changes. */
const LEVEL_WORDS: Record<number, { de: string; en: string }> = {
  20: { de: "zwanzig", en: "twenty" },
  21: { de: "einundzwanzig", en: "twenty-one" },
  22: { de: "zweiundzwanzig", en: "twenty-two" },
  23: { de: "dreiundzwanzig", en: "twenty-three" },
};

describe("Kettenreaktion's number of levels", () => {
  const count = Object.keys(LEVEL_TEXTS).length;
  const right = LEVEL_WORDS[count];

  test("has its words here", () => expect(right, `add the words for ${count} to LEVEL_WORDS`).toBeDefined());

  test.each(["/kettenreaktion/", "/spiele/lebendige-welten/"])("%s names it in German and English, and no other count", (path) => {
    for (const [language, text] of [
      ["de", german(path)],
      ["en", english(path)],
    ] as const) {
      const found = text.toLowerCase();
      expect(found.includes(right[language]) || found.includes(String(count)), `${language} ${path}`).toBe(true);
      // A wrong count stands right before what is counted: „zwanzig Kettenreaktionen“, "twenty Chain Reactions".
      for (const [n, other] of Object.entries(LEVEL_WORDS)) {
        if (Number(n) === count) continue;
        const counted = language === "de" ? "(kettenreaktion|bahnen)" : "(chain reaction|runs)";
        expect(found, `${language} ${path}`).not.toMatch(new RegExp(`(^|[^a-z-])${other[language]} ${counted}`));
      }
    }
  });
});

/** Pages that are rightly short, with the reason; none so far. A page is listed here only with its reason. */
const SHORT_PAGES: Record<string, string> = {};

/** The fewest words of a game's or book's own text, in German and English (the site's median is about 90 and 110). */
const MIN_WORDS = 60;

describe("every page for search engines says enough", () => {
  // The scene pages have their own, stricter check in content.test.ts.
  const pages = SEO_PAGES.filter((page) => !/^\/bilder\/[^/]+\/$/.test(page.path) && !(page.path in SHORT_PAGES));

  test.each(pages.map((page) => [page.path] as const))("%s has its own words in German and English", (path) => {
    expect(words(german(path)), `de ${path}`).toBeGreaterThanOrEqual(MIN_WORDS);
    expect(words(english(path)), `en ${path}`).toBeGreaterThanOrEqual(MIN_WORDS);
  });

  test("a page let off is still a page and still short", () => {
    for (const [path, reason] of Object.entries(SHORT_PAGES)) {
      expect(reason.length, path).toBeGreaterThan(10);
      expect(words(german(path)), `${path} is no longer short: take it off the list`).toBeLessThan(MIN_WORDS);
    }
  });
});
