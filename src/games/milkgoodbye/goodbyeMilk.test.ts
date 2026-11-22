import { describe, expect, test } from "bun:test";
import { MILK_CHAIN_PAGES } from "@/games/milkchain/milkChain";
import { MILK_CHAIN_PICTURE_QUEUE } from "@/games/milkchain/milkChainPictures";
import { GOODBYE_MILK_AR } from "./ar";
import { GOODBYE_MILK_DE } from "./de";
import { GOODBYE_MILK_ES } from "./es";
import { GOODBYE_MILK, GOODBYE_PAGES, GOODBYE_STEPS } from "./goodbyeMilk";
import { GOODBYE_PICTURE_QUEUE, goodbyePicture } from "./goodbyeMilkPictures";
import { GOODBYE_MILK_HI } from "./hi";
import { GOODBYE_MILK_RU } from "./ru";
import { GOODBYE_MILK_ZH } from "./zh";

describe("Three More Sleeps", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = GOODBYE_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of GOODBYE_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // User request, 22 November 2026: „eine weitere Geschichte, die kürzer ist als ganz abstillen“.
  test("is much shorter than Tapsis Milchkette", () => {
    expect(GOODBYE_PAGES.length).toBeLessThanOrEqual(MILK_CHAIN_PAGES.length / 3);
  });

  // Like the other chapter books, the chapters follow the steps the guides give, in their order.
  test("every step of weaning on a set day has a chapter, in the guides' order", () => {
    expect(GOODBYE_MILK.map((c) => c.step)).toEqual(GOODBYE_STEPS.map((s) => s.id));
  });

  test("Tapsi is told beforehand, counts the days, drinks one last time and says thank you", () => {
    const texts = GOODBYE_PAGES.map((p) => p.text);
    expect(texts.some((t) => /In three sleeps, we say goodbye to the milk/.test(t))).toBe(true);
    expect(texts.some((t) => /Every morning Tapsi takes one heart away\. And there is still milk/.test(t))).toBe(true);
    expect(texts.some((t) => /one last time/.test(t))).toBe(true);
    expect(texts.some((t) => /Thank you, Mama's breast!/.test(t))).toBe(true);
    // Plainly about Mama's breast, as „Tapsis Milchkette“.
    expect(texts.filter((t) => /breast/.test(t)).length).toBeGreaterThanOrEqual(3);
  });

  // The milk stays until the day and is gone after it: no „just once more“ once the last heart is gone.
  test("Tapsi drinks only before the goodbye, plainly at Mama's breast", () => {
    const last = GOODBYE_PAGES.findIndex((p) => p.id === "letzte");
    GOODBYE_PAGES.forEach((page, i) => {
      if (!page.nursing) return;
      expect(i, page.id).toBeLessThanOrEqual(last);
      expect(page.cast, page.id).toContain("mama");
      expect(page.picture, page.id).toMatch(/drinks at her breast/);
    });
    expect(GOODBYE_PAGES[last].nursing).toBe(true);
  });

  // Tapsi may be sad, angry and cry, but never alone with it.
  test("whenever Tapsi is sad, angry or cries, a grown-up holds Tapsi", () => {
    for (const page of GOODBYE_PAGES)
      if (/sad|cr(y|ies)|angry|tear/.test(page.text + page.picture))
        expect(
          page.cast.some((c) => c === "mama" || c === "papa"),
          page.id,
        ).toBe(true);
    expect(GOODBYE_PAGES.some((p) => /cries/.test(p.text))).toBe(true);
  });

  test("nothing forces, scolds or hurries, and it ends in cuddles that stay", () => {
    const words =
      /\b(stop crying|don't cry|be good|naughty|baby|quick(ly)?|hurry|must|have to|too big|big kids don't|brave boy|brave girl|good boy|good girl|alone)\b/i;
    for (const page of GOODBYE_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(GOODBYE_PAGES.at(-1)?.text).toMatch(/cuddles stay\. Always\./);
  });

  // Each family picks its own day: no clock, age or weekday.
  test("no clock, age or day of the week is named", () => {
    for (const page of GOODBYE_PAGES)
      expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from one reference, never from „Tapsis Milchkette“'s room with its chain", () => {
    const chainRoom = new Set(MILK_CHAIN_PICTURE_QUEUE.map((p) => p.file).filter((f) => f.includes("milkchain")));
    for (const page of GOODBYE_PAGES) {
      const refs = goodbyePicture(page).ref ?? [];
      expect(refs.length, page.id).toBe(1);
      expect(chainRoom.has(refs[0]), page.id).toBe(false);
      if (page.place === "kinderzimmer") expect(refs[0], page.id).not.toContain("milkchain");
    }
    expect(GOODBYE_PICTURE_QUEUE.length).toBeLessThanOrEqual(GOODBYE_PAGES.length);
  });

  // A thing shown twice comes back doubled (Schnullerfee): the hearts, the cup, the cake and the teddy are each described.
  test("the paper hearts, the new cup, the cake and the teddy are each said to be there as often as the page says", () => {
    for (const page of GOODBYE_PAGES) {
      const prompt = goodbyePicture(page).prompt;
      if (/paper hearts?/.test(page.picture)) expect(prompt, page.id).toMatch(/exactly as many as the page says/);
      for (const thing of ["new cup", "teddy"]) if (page.picture.includes(thing)) expect(prompt, `${page.id}: ${thing}`).toMatch(/only one/);
      if (/cake/.test(page.picture)) expect(prompt, page.id).toMatch(/only one/);
    }
  });

  test("every prompt says the page's light and who of the reference is not there", () => {
    for (const page of GOODBYE_PAGES) {
      const prompt = goodbyePicture(page).prompt;
      expect(prompt, page.id).toMatch(page.light === "abend" ? /evening/ : page.light === "morgen" ? /morning/ : /daytime/);
      expect(prompt.includes("Tapsi drinks"), page.id).toBe(Boolean(page.nursing) || /Tapsi drinks/.test(page.picture));
    }
  });
});

// Translated into every app language at once (root CLAUDE.md, 22 November 2026).
describe("Three More Sleeps in every language", () => {
  const chapterIds = GOODBYE_MILK.map((c) => c.id).sort();
  const pageIds = GOODBYE_PAGES.map((p) => p.id).sort();
  const LANGUAGES = { de: GOODBYE_MILK_DE, zh: GOODBYE_MILK_ZH, hi: GOODBYE_MILK_HI, es: GOODBYE_MILK_ES, ar: GOODBYE_MILK_AR, ru: GOODBYE_MILK_RU };
  /** Tapsi's name and the breast, as each language writes them: the story is plainly about Mama's breast. */
  const SAYS = {
    de: ["Tapsi", "Brust"],
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
      expect(translation.pages.danke).toContain(SAYS[language as keyof typeof SAYS][1]);
      // Russian, Chinese, Hindi and Arabic are written without Latin letters.
      if (language !== "de" && language !== "es") expect(all + Object.values(translation.chapters).join(" ")).not.toMatch(/[A-Za-z]/);
    });
  }
});
