import { describe, expect, test } from "bun:test";
import { HAIR_PAGES } from "@/games/hairstory/hairStory";
import { HAIR_SHOWER_AR } from "./ar";
import { HAIR_SHOWER_DE } from "./de";
import { HAIR_SHOWER_ES } from "./es";
import { SHOWER_PAGES, SHOWER_STEPS, SHOWER_STORY } from "./hairShower";
import { FIRST, IN_THE_SHOWER, SHOWER_PICTURE_QUEUE, showerPicture } from "./hairShowerPictures";
import { HAIR_SHOWER_HI } from "./hi";
import { HAIR_SHOWER_RU } from "./ru";
import { HAIR_SHOWER_ZH } from "./zh";

describe("Tapsi and the Warm Rain", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = SHOWER_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of SHOWER_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // A second story of the book should be a length of its own beside the bath's.
  test("is shorter than the story in the bathtub", () => {
    expect(SHOWER_PAGES.length).toBeLessThanOrEqual(HAIR_PAGES.length * 0.85);
  });

  test("every step of washing hair gently has a chapter, in the guides' order", () => {
    expect(SHOWER_STORY.map((c) => c.step)).toEqual(SHOWER_STEPS);
  });

  // What the shower is about (idea H-146): the rain low and from below, the feet first, Tapsi holding the shower too,
  // the signal, and the rinse at the back – never from above.
  test("the rain comes low, on the feet first, Tapsi holds it too and says when", () => {
    const texts = SHOWER_PAGES.map((p) => p.text);
    expect(texts.some((t) => /First the feet, then the hair/.test(t))).toBe(true);
    expect(texts.some((t) => /on the toes first/.test(t))).toBe(true);
    expect(texts.some((t) => /Tapsi holds the shower/.test(t))).toBe(true);
    expect(texts.some((t) => /“Now!”/.test(t))).toBe(true);
    expect(texts.some((t) => /eyes stay dry/.test(t))).toBe(true);
    for (const page of SHOWER_PAGES) expect(`${page.text} ${page.picture}`, page.id).not.toMatch(/from above|above Tapsi's head|overhead/i);
  });

  // The guides: never leave a small child alone with the water; in the shower the grown-up sits with it on the floor.
  test("a grown-up is beside Tapsi in every picture in the shower, and the prompt keeps Tapsi sitting", () => {
    for (const page of SHOWER_PAGES.filter((p) => /Tapsi in the shower/.test(p.picture))) {
      expect(page.place, page.id).toBe("dusche");
      expect(
        page.cast.some((c) => c === "mama" || c === "papa"),
        page.id,
      ).toBe(true);
      expect(showerPicture(page).prompt, page.id).toContain(IN_THE_SHOWER);
    }
  });

  // Never forced: when it is too much, Papa stops at once, Tapsi may cry, and Tapsi chooses how to finish.
  test("nothing forces, scolds or hurries, crying is allowed, and it ends in love", () => {
    const words = /\b(hold still|stop crying|don't cry|be good|naughty|baby|quick(ly)?|hurry|must|have to|brave boy|brave girl|good boy|good girl)\b/i;
    for (const page of SHOWER_PAGES) expect(page.text, page.id).not.toMatch(words);
    const pause = SHOWER_STORY.find((c) => c.step === "pause");
    expect(pause?.pages.some((p) => /off at once/.test(p.text))).toBe(true);
    expect(pause?.pages.some((p) => /You may cry/.test(p.text))).toBe(true);
    expect(pause?.pages.some((p) => /The shower or the cup\?/.test(p.text))).toBe(true);
    expect(SHOWER_PAGES.at(-1)?.text).toMatch(/love/);
  });

  test("no clock, age or day of the week is named", () => {
    for (const page of SHOWER_PAGES) expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from one reference, the shower's from its first page, so the shower stays the same", () => {
    for (const page of SHOWER_PAGES) {
      const refs = showerPicture(page).ref ?? [];
      expect(refs.length, page.id).toBe(1);
      if (page.place === "dusche" && page.id !== FIRST) expect(refs[0], page.id).toBe(`src/games/hairshower/bilder/dusche-${FIRST}.webp`);
    }
    expect(SHOWER_PAGES.find((p) => p.place === "dusche")?.id).toBe(FIRST);
    expect(SHOWER_PICTURE_QUEUE.length).toBeLessThanOrEqual(SHOWER_PAGES.length);
  });

  // The app's foxes wear clothes in every picture; in the bath the foam stood in for them, in the shower there is none.
  test("Tapsi wears swim shorts in the shower, and there is no bathtub there", () => {
    for (const page of SHOWER_PAGES.filter((p) => p.place === "dusche")) {
      const prompt = showerPicture(page).prompt;
      if (/Tapsi in the shower/.test(page.picture)) expect(prompt, page.id).toMatch(/swim shorts/);
      expect(prompt, page.id).toMatch(/no bathtub|NO bathtub|exactly as it is/);
    }
  });
});

// Translated into every app language at once (root CLAUDE.md, 22 November 2026).
describe("Tapsi and the Warm Rain in every language", () => {
  const chapterIds = SHOWER_STORY.map((c) => c.id).sort();
  const pageIds = SHOWER_PAGES.map((p) => p.id).sort();
  const LANGUAGES = { de: HAIR_SHOWER_DE, zh: HAIR_SHOWER_ZH, hi: HAIR_SHOWER_HI, es: HAIR_SHOWER_ES, ar: HAIR_SHOWER_AR, ru: HAIR_SHOWER_RU };
  /** Tapsi's name and the shower, as each language writes them. */
  const SAYS = {
    de: ["Tapsi", "Dusche"],
    zh: ["塔普西", "淋浴"],
    hi: ["टैप्सी", "शावर"],
    es: ["Tapsi", "ducha"],
    ar: ["تابسي", "الدُّش"],
    ru: ["Тапси", "душ"],
  };

  for (const [language, translation] of Object.entries(LANGUAGES)) {
    test(`${language}: every chapter and page, nothing else`, () => {
      expect(Object.keys(translation.chapters).sort()).toEqual(chapterIds);
      expect(Object.keys(translation.pages).sort()).toEqual(pageIds);
      for (const text of [...Object.values(translation.chapters), ...Object.values(translation.pages)]) expect(text.trim()).not.toBe("");
    });

    test(`${language}: Tapsi in its own script, and the shower named`, () => {
      const all = Object.values(translation.pages).join(" ");
      for (const word of SAYS[language as keyof typeof SAYS]) expect(all).toContain(word);
      // Russian, Chinese, Hindi and Arabic are written without Latin letters.
      if (language !== "de" && language !== "es") expect(all + Object.values(translation.chapters).join(" ")).not.toMatch(/[A-Za-z]/);
    });
  }
});
