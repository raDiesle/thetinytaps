import { describe, expect, test } from "bun:test";
import { PACIFIER_STORY_AR } from "./ar";
import { PACIFIER_STORY_EN } from "./en";
import { PACIFIER_STORY_ES } from "./es";
import { PACIFIER_STORY_HI } from "./hi";
import { PACIFIER_PAGES, PACIFIER_STEPS, PACIFIER_STORY } from "./pacifierStory";
import { PACIFIER_STORY_RU } from "./ru";
import { PACIFIER_STORY_ZH } from "./zh";
import { PACIFIER_PICTURE_QUEUE } from "./pacifierStoryPictures";

describe("Tapsi und die Schnullerfee", () => {
  test("every page has its own id, a short German text and a picture", () => {
    const ids = PACIFIER_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of PACIFIER_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
    }
  });

  // User request, 10 November 2026: like „Abstillen“, the chapters follow the steps the guides give, in their order.
  test("every step of a gentle goodbye has a chapter, in the guides' order", () => {
    expect(PACIFIER_STORY.flatMap((c) => (c.step ? [c.step] : []))).toEqual(PACIFIER_STEPS.map((s) => s.id));
  });

  test("nothing scolds or tricks, being sad is allowed, and it ends in love", () => {
    const words = /\b(böse|unartig|schäm|nein,? nein|darf nicht|nicht mehr lieb|zu groß für|baby(haft)?\b.*\bnicht|abgeschnitten|kaputt|weggeworfen)/i;
    for (const page of PACIFIER_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(PACIFIER_PAGES.some((p) => /traurig sein/.test(p.text))).toBe(true);
    expect(PACIFIER_PAGES.at(-1)?.text).toMatch(/lieb/);
  });

  // The pacifiers go and stay gone: after the fairy took them, no picture shows one again.
  test("no pacifier comes back after the fairy took them", () => {
    const taken = PACIFIER_PAGES.findIndex((p) => p.id === "nimmt");
    for (const page of PACIFIER_PAGES.slice(taken + 1)) {
      expect(page.picture.replace(/pacifier (fairy|box)( is gone)?/g, ""), page.id).not.toMatch(/pacifier/);
    }
  });

  // The fairy is a bear in a role and comes alone (mascot rule); the foxes are the family.
  test("the fairy only comes at night, while Tapsi sleeps or on her way", () => {
    for (const page of PACIFIER_PAGES.filter((p) => p.cast.includes("fee"))) {
      expect(page.light, page.id).toBe("nacht");
      expect(
        page.cast.filter((c) => c !== "fee" && c !== "tapsi"),
        page.id,
      ).toEqual([]);
    }
  });

  test("every picture is drawn from a reference, so the places stay", () => {
    for (const picture of PACIFIER_PICTURE_QUEUE) expect(picture.ref?.length, picture.id).toBe(1);
  });
});

describe("Tapsi und die Schnullerfee in every language", () => {
  const chapterIds = PACIFIER_STORY.map((c) => c.id).sort();
  const pageIds = PACIFIER_PAGES.map((p) => p.id).sort();
  const LANGUAGES = {
    en: PACIFIER_STORY_EN,
    zh: PACIFIER_STORY_ZH,
    hi: PACIFIER_STORY_HI,
    es: PACIFIER_STORY_ES,
    ar: PACIFIER_STORY_AR,
    ru: PACIFIER_STORY_RU,
  };
  /** Tapsi's name and the pacifier, as each language writes them. */
  const SAYS = {
    en: ["Tapsi", "pacifier"],
    zh: ["塔普西", "奶嘴"],
    hi: ["टैप्सी", "चुसनी"],
    es: ["Tapsi", "chupete"],
    ar: ["تابسي", "لهاية"],
    ru: ["Тапси", "пустышк"],
  };

  for (const [language, translation] of Object.entries(LANGUAGES)) {
    test(`${language}: every chapter and page, nothing else`, () => {
      expect(Object.keys(translation.chapters).sort()).toEqual(chapterIds);
      expect(Object.keys(translation.pages).sort()).toEqual(pageIds);
      for (const text of [...Object.values(translation.chapters), ...Object.values(translation.pages)]) expect(text.trim()).not.toBe("");
    });

    test(`${language}: Tapsi in its own script, and the pacifier named`, () => {
      const all = Object.values(translation.pages).join(" ");
      for (const word of SAYS[language as keyof typeof SAYS]) expect(all).toContain(word);
      // Russian, Chinese, Hindi and Arabic are written without Latin letters.
      if (language !== "en" && language !== "es") expect(all + Object.values(translation.chapters).join(" ")).not.toMatch(/[A-Za-z]/);
    });
  }
});
