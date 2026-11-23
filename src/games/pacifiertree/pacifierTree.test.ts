import { describe, expect, test } from "bun:test";
import { PACIFIER_PAGES } from "@/games/pacifierstory/pacifierStory";
import { PACIFIER_TREE_AR } from "./ar";
import { PACIFIER_TREE_DE } from "./de";
import { PACIFIER_TREE_ES } from "./es";
import { PACIFIER_TREE_HI } from "./hi";
import { TREE_PAGES, TREE_STEPS, TREE_STORY } from "./pacifierTree";
import { TREE_PICTURE_QUEUE, treePicture } from "./pacifierTreePictures";
import { PACIFIER_TREE_RU } from "./ru";
import { PACIFIER_TREE_ZH } from "./zh";

describe("Tapsi and the Pacifier Tree", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = TREE_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of TREE_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // User request, 23 November 2026: a different length from the fairy's story, each whole and short.
  test("is about half as long as the fairy's story", () => {
    expect(TREE_PAGES.length).toBeLessThanOrEqual(PACIFIER_PAGES.length * 0.6);
  });

  test("after the first chapter, every step of a gentle goodbye but the swap has a chapter, in the guides' order", () => {
    expect(TREE_STORY.slice(1).map((c) => c.step)).toEqual(TREE_STEPS);
    expect(TREE_STEPS).not.toContain("tausch");
  });

  // The pacifiers are given away by Tapsi and stay in the tree: never „just once more“ after the goodbye.
  test("after the goodbye Tapsi's own pacifiers are only in the tree, never in a paw or at home", () => {
    const goodbye = TREE_PAGES.findIndex((p) => p.id === "tschuess");
    expect(goodbye).toBeGreaterThan(0);
    for (const page of TREE_PAGES.slice(goodbye + 1)) {
      if (page.place !== "park") expect(page.picture, page.id).not.toMatch(/(red|blue|yellow) pacifier/);
      else expect(page.picture, page.id).toMatch(/hanging/);
    }
  });

  // Tapsi may be sad and cry, but never alone with it.
  test("whenever Tapsi is sad or cries, a grown-up holds Tapsi", () => {
    for (const page of TREE_PAGES)
      if (/sad|cr(y|ies|ying)|tear/.test(page.text + page.picture))
        expect(
          page.cast.some((c) => c === "mama" || c === "papa"),
          page.id,
        ).toBe(true);
    expect(TREE_PAGES.some((p) => /cries/.test(p.text))).toBe(true);
  });

  test("nothing forces, scolds or hurries, and it ends in love with and without a pacifier", () => {
    const words =
      /\b(stop crying|don't cry|be good|naughty|baby|quick(ly)?|hurry|must|have to|too big|big kids don't|brave boy|brave girl|good boy|good girl|alone)\b/i;
    for (const page of TREE_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(TREE_PAGES.at(-1)?.text).toMatch(/love you – with a pacifier and without one\. Always\./);
  });

  test("no clock, age or day of the week is named", () => {
    for (const page of TREE_PAGES) expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from one reference, the park's from its first page, so the tree stays the same", () => {
    for (const page of TREE_PAGES) {
      const refs = treePicture(page).ref ?? [];
      expect(refs.length, page.id).toBe(1);
      if (page.place === "park" && page.id !== "los") expect(refs[0], page.id).toBe("src/games/pacifiertree/bilder/baum-los.webp");
      // Never from a Milchkette picture of Tapsi's room, whose chain of milk drops would come back.
      if (page.place === "kinderzimmer") expect(refs[0], page.id).not.toContain("milkchain");
    }
    expect(TREE_PICTURE_QUEUE.length).toBeLessThanOrEqual(TREE_PAGES.length);
  });

  test("every prompt says the page's light, and Tapsi's room without pacifiers has none", () => {
    for (const page of TREE_PAGES) {
      const prompt = treePicture(page).prompt;
      expect(prompt, page.id).toMatch(page.light === "abend" ? /evening/ : page.light === "morgen" ? /morning/ : /daytime/);
      if (page.place === "kinderzimmer" && !/(red|blue|yellow) pacifier/.test(page.picture)) expect(prompt, page.id).toMatch(/no pacifier anywhere/);
      if (page.cast.includes("mama") && page.cast.includes("papa")) expect(prompt, page.id).toMatch(/two separate grown-ups/);
    }
  });
});

// Translated into every app language at once (root CLAUDE.md, 22 November 2026).
describe("Tapsi and the Pacifier Tree in every language", () => {
  const chapterIds = TREE_STORY.map((c) => c.id).sort();
  const pageIds = TREE_PAGES.map((p) => p.id).sort();
  const LANGUAGES = { de: PACIFIER_TREE_DE, zh: PACIFIER_TREE_ZH, hi: PACIFIER_TREE_HI, es: PACIFIER_TREE_ES, ar: PACIFIER_TREE_AR, ru: PACIFIER_TREE_RU };
  /** Tapsi's name and the pacifier, as each language writes them. */
  const SAYS = {
    de: ["Tapsi", "Schnuller"],
    zh: ["塔普西", "奶嘴"],
    hi: ["टैप्सी", "चुसनी"],
    es: ["Tapsi", "chupete"],
    ar: ["تابسي", "لهاي"],
    ru: ["Тапси", "пустыш"],
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
      if (language !== "de" && language !== "es") expect(all + Object.values(translation.chapters).join(" ")).not.toMatch(/[A-Za-z]/);
    });
  }
});
