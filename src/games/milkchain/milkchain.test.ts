import { CATEGORIES } from "@/content/games";
import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { MILK_CHAIN_AR } from "./ar";
import { MILK_CHAIN_EN } from "./en";
import { MILK_CHAIN_ES } from "./es";
import { MILK_CHAIN_HI } from "./hi";
import { minutesOf } from "@/lib/storyPages";
import { GENTLE_STEPS, goneOn, MILK_CHAIN, MILK_CHAIN_PAGES, MILK_CHAIN_SHORT, MILK_ORDER, SHORT_PAGES } from "./milkChain";
import { MILK_CHAIN_RU } from "./ru";
import { MILK_CHAIN_ZH } from "./zh";

describe("Tapsis Milchkette", () => {
  test("every page has its own id, a short German text and a picture", () => {
    const ids = MILK_CHAIN_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of MILK_CHAIN_PAGES) {
      // Read out by a grown-up to a child of about two: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
    }
  });

  // User feedback, November 2026: the steps the guides give for gentle weaning are found in the chapters, in order.
  test("every step of gentle weaning has a chapter, in the guides' order", () => {
    expect(MILK_CHAIN.flatMap((c) => (c.step ? [c.step] : []))).toEqual(GENTLE_STEPS.map((s) => s.id));
  });

  // The easiest milk time goes first (the day), falling asleep and the night later, the morning's milk last.
  test("the milk times go one after the other, the day first", () => {
    expect(MILK_CHAIN.flatMap((c) => (c.goes ? [c.goes] : []))).toEqual(MILK_ORDER);
    expect(goneOn(MILK_CHAIN_PAGES[0].id)).toEqual([]);
    expect(goneOn(MILK_CHAIN_PAGES.at(-1)?.id ?? "")).toEqual(MILK_ORDER);
  });

  test("a picture with Tapsi drinking has Mama and Tapsi in it", () => {
    for (const page of MILK_CHAIN_PAGES.filter((p) => p.nursing)) {
      expect(page.cast, page.id).toContain("mama");
      expect(
        page.cast.some((c) => c === "tapsi" || c === "baby"),
        page.id,
      ).toBe(true);
    }
  });

  // User feedback, November 2026: the child only understands it when it is plainly about Mama's breast.
  test("it says plainly that it is about Mama's breast", () => {
    const told = MILK_CHAIN_PAGES.filter((p) => /\bBrust\b/.test(p.text));
    expect(told.length).toBeGreaterThanOrEqual(3);
  });

  test("nothing scolds, being sad is allowed, and it ends in love", () => {
    const words = /\b(böse|unartig|schäm|nein,? nein|darf nicht|nicht mehr lieb|zu groß für|baby(haft)?\b.*\bnicht)/i;
    for (const page of MILK_CHAIN_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(MILK_CHAIN_PAGES.some((p) => /traurig sein/.test(p.text))).toBe(true);
    expect(MILK_CHAIN_PAGES.at(-1)?.text).toMatch(/lieb/);
  });
});

// User requests, 22 and 23 November 2026: a chapter book opens on the choice of its stories, never on its chapters, and
// a story always starts on its first page; the corner leads back to the choice.
test("a story opens on its first page, and the corner leads back to the choice", () => {
  const play = readFileSync("src/components/ChapterBook.tsx", "utf8");
  // Only a link to one of its pages (`?seite=7`), passed in by the choice as `opensAt`, opens it elsewhere.
  expect(play).toContain("useState(() => Math.min(Math.max(0, opensAt), LAST))");
  expect(play).toContain("useInnerBack(onContents);");
  const choice = readFileSync("src/components/StoryChoice.tsx", "utf8");
  expect(choice).toContain("setOpen({ story, page: 0, from });");
});

// User request, 22 November 2026: „Abstillen“ is one book whose first page chooses its story, and that choice shows
// only how many pictures each story has, about how long it takes and where it starts – no chapter numbers any more.
test("the book Abstillen opens on the choice of its stories, each with its pictures, minutes and start slips", () => {
  const book = readFileSync("src/games/milkchain/MilkChainGame.tsx", "utf8");
  expect([...book.matchAll(/href: "([^"]+)"/g)].map((m) => m[1])).toEqual(["/abstillen/", "/abstillen/kurz/", "/abstillen/abschied/", "/abstillen/nachts/"]);
  expect(book).toContain("<StoryBookGame book={BOOK} />");
  const choice = readFileSync("src/components/StoryChoice.tsx", "utf8");
  // Without a link to a page, nothing is open: the choice.
  expect(choice).toContain('return typeof opened?.page === "number" ? { story: here, page: opened.page, from } : undefined;');
  // Each story's way back to its contents leads to the choice; every version has a slip with its size to start it.
  expect(choice).toContain("onContents={toChoice}");
  expect(choice).toMatch(/className="cb-story-start"[\s\S]*?className="cb-story-start-label"[\s\S]*?className="cb-story-start-size"/);
  expect(choice).not.toContain("cb-story-chapter");
  // One book on the shelf, no longer two tied together.
  expect(CATEGORIES.flatMap((c) => c.games).find((g) => g.href === "/abstillen/")?.volumes).toBeUndefined();
});

test("a story's minutes grow with its pages and words, and every story takes at least one", () => {
  expect(minutesOf([])).toBe(1);
  const long = minutesOf(MILK_CHAIN_PAGES);
  const short = minutesOf(MILK_CHAIN_SHORT.flatMap((c) => c.pages));
  expect(short).toBeLessThan(long);
  expect(long).toBeGreaterThanOrEqual(8);
});

// User request, 22 November 2026: „zusätzlich von der ersten Geschichte eine Kurzfassung“.
describe("the short version of Tapsis Milchkette", () => {
  const short = MILK_CHAIN_SHORT.flatMap((c) => c.pages);
  const ids = MILK_CHAIN_PAGES.map((p) => p.id);

  test("is made of the long story's own pages, in their order, about a third of them", () => {
    expect(short.every((p) => ids.includes(p.id))).toBe(true);
    const at = short.map((p) => ids.indexOf(p.id));
    expect(at).toEqual([...at].sort((a, b) => a - b));
    expect(short.length).toBeGreaterThanOrEqual(12);
    expect(short.length).toBeLessThanOrEqual(MILK_CHAIN_PAGES.length / 2);
    // Every id in SHORT_PAGES is a page of the long story, so a renamed page can't drop out unseen.
    expect(SHORT_PAGES.filter((id) => !ids.includes(id))).toEqual([]);
  });

  test("tells the whole way: from the baby to the farewell and the love that stays", () => {
    expect(short[0].id).toBe(MILK_CHAIN_PAGES[0].id);
    expect(short.at(-1)?.id).toBe(MILK_CHAIN_PAGES.at(-1)?.id);
    // Every milk time goes in it, in MILK_ORDER, and it keeps a page where Tapsi drinks at the breast.
    for (const steps of ["tag", "abend", "nacht", "abschied"])
      expect(
        short.some((p) => p.id.startsWith(steps)),
        steps,
      ).toBe(true);
    expect(short.some((p) => /Brust/.test(p.text))).toBe(true);
  });

  test("never leaves Tapsi crying: a page where Tapsi cries is followed by one where a grown-up holds or comforts", () => {
    short.forEach((page, i) => {
      if (!/weint/.test(page.text)) return;
      expect(/Papa|Mama/.test(page.text) || /hält|tröst|Arm|kuschelt/.test(short[i + 1]?.text ?? ""), page.id).toBe(true);
    });
  });
});

describe("Tapsis Milchkette in every language", () => {
  const chapterIds = MILK_CHAIN.map((c) => c.id).sort();
  const pageIds = MILK_CHAIN_PAGES.map((p) => p.id).sort();
  const LANGUAGES = { en: MILK_CHAIN_EN, zh: MILK_CHAIN_ZH, hi: MILK_CHAIN_HI, es: MILK_CHAIN_ES, ar: MILK_CHAIN_AR, ru: MILK_CHAIN_RU };
  /** Tapsi's name and the breast, as each language writes them: the story is plainly about Mama's breast. */
  const SAYS = {
    en: ["Tapsi", "breast"],
    zh: ["塔普西", "乳房"],
    hi: ["टैप्सी", "छाती"],
    es: ["Tapsi", "pecho"],
    ar: ["تابسي", "صدر"],
    ru: ["Тапси", "груд"],
  };

  for (const [language, translation] of Object.entries(LANGUAGES)) {
    test(`${language}: every chapter and page, nothing else`, () => {
      expect(Object.keys(translation.chapters).sort()).toEqual(chapterIds);
      expect(Object.keys(translation.pages).sort()).toEqual(pageIds);
      for (const text of [...Object.values(translation.chapters), ...Object.values(translation.pages)]) expect(text.trim()).not.toBe("");
    });

    test(`${language}: Tapsi in its own script, and the breast named`, () => {
      const all = Object.values(translation.pages).join(" ");
      for (const word of SAYS[language as keyof typeof SAYS]) expect(all).toContain(word);
      // Russian, Chinese, Hindi and Arabic are written without Latin letters.
      if (language !== "en" && language !== "es") expect(all + Object.values(translation.chapters).join(" ")).not.toMatch(/[A-Za-z]/);
    });
  }
});
