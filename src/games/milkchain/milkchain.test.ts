import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { MILK_CHAIN_AR } from "./ar";
import { MILK_CHAIN_EN } from "./en";
import { MILK_CHAIN_ES } from "./es";
import { MILK_CHAIN_HI } from "./hi";
import { GENTLE_STEPS, goneOn, MILK_CHAIN, MILK_CHAIN_PAGES, MILK_ORDER } from "./milkChain";
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

// User request, 9 November 2026: a story read over many days opens on its chapters, and the corner goes back to them.
test("the book opens on its table of contents, and the corner leads back to it", () => {
  const play = readFileSync("src/components/ChapterBook.tsx", "utf8");
  expect(play).toContain("useState(CONTENTS)");
  expect(play).toMatch(/useInnerBack\(index === CONTENTS \? undefined/);
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
