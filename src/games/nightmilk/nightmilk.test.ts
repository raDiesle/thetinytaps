import { describe, expect, test } from "bun:test";
import { MILK_CHAIN_PICTURE_QUEUE } from "@/games/milkchain/milkChainPictures";
import { NIGHT_MILK_AR } from "./ar";
import { NIGHT_MILK_DE } from "./de";
import { NIGHT_MILK_ES } from "./es";
import { NIGHT_MILK_HI } from "./hi";
import { NIGHT_MILK, NIGHT_PAGES, NIGHT_STEPS } from "./nightMilk";
import { NIGHT_MILK_RU } from "./ru";
import { NIGHT_MILK_ZH } from "./zh";
import { NIGHT_PICTURE_QUEUE, nightPicture } from "./nightMilkPictures";

describe("The Milk Sleeps at Night", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = NIGHT_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of NIGHT_PAGES) {
      // Read out by a grown-up to a small child at bedtime: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence: written in English until German is asked for (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // Like the other chapter books, the chapters follow the steps the guides give, in their order (research
  // „nachts-abstillen“).
  test("every step of gentle night weaning has a chapter, in the guides' order", () => {
    expect(NIGHT_MILK.map((c) => c.step)).toEqual(NIGHT_STEPS.map((s) => s.id));
  });

  // The guides: tell beforehand with one simple rule tied to dark and light, say that the milk stays by day, say who
  // comes at night – and keep that rule, so the milk comes back with the sun.
  test("Tapsi hears the moon-and-sun rule, that the milk stays by day, and who comes at night", () => {
    const texts = NIGHT_PAGES.map((p) => p.text);
    expect(texts.some((t) => /When the moon shines, the milk sleeps\. When the sun comes up, it wakes again\./.test(t))).toBe(true);
    expect(texts.some((t) => /daytime\?.*as much as you like/.test(t))).toBe(true);
    expect(texts.some((t) => /When you wake up at night, I'll come/.test(t))).toBe(true);
    expect(texts.some((t) => /The milk is awake!/.test(t))).toBe(true);
    // Plainly about Mama's breast, as „Tapsis Milchkette“: no other milk is meant.
    expect(texts.some((t) => /breast/.test(t))).toBe(true);
  });

  // The pages where Tapsi drinks show it, and only by day, in the evening or in the morning – never in the night.
  test("Tapsi drinks only when the moon is not yet up or the sun is up again, and the picture shows it", () => {
    for (const page of NIGHT_PAGES.filter((p) => p.nursing)) {
      expect(page.light, page.id).not.toBe("nacht");
      expect(page.cast, page.id).toContain("mama");
      expect(page.picture, page.id).toMatch(/drinks at her breast/);
    }
    expect(NIGHT_PAGES.filter((p) => p.light === "nacht").some((p) => p.nursing)).toBe(false);
  });

  // All guides have a grown-up beside the child at night: Tapsi may cry and be angry, but never alone with it.
  test("whenever Tapsi cries or is comforted, a grown-up holds Tapsi", () => {
    for (const page of NIGHT_PAGES)
      if (/cr(y|ies)|angry|comfort|carr(y|ies)|holds Tapsi/.test(page.text + page.picture))
        expect(
          page.cast.some((c) => c === "mama" || c === "papa"),
          page.id,
        ).toBe(true);
  });

  // Never forced or scolded, no crying it out, and it ends in love.
  test("nothing forces, scolds or hurries, crying is allowed, and it ends in love", () => {
    const words =
      /\b(stop crying|don't cry|be good|naughty|baby|quick(ly)?|hurry|must|have to|too big|big kids don't|brave boy|brave girl|good boy|good girl|alone)\b/i;
    for (const page of NIGHT_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(NIGHT_PAGES.some((p) => /cries/.test(p.text))).toBe(true);
    expect(NIGHT_PAGES.at(-1)?.text).toMatch(/love/);
  });

  // Like the other chapter books: no clock, no age, no number of nights – each family has its own night.
  test("no clock, age, number of nights or day of the week is named", () => {
    for (const page of NIGHT_PAGES)
      expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|\b(two|three|seven|ten) nights|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from a reference, so the places and the family stay", () => {
    for (const page of NIGHT_PAGES) expect(nightPicture(page).ref?.length, page.id).toBe(1);
    expect(NIGHT_PICTURE_QUEUE.length).toBeLessThanOrEqual(NIGHT_PAGES.length);
  });

  // „Tapsis Milchkette“'s room has the chain of milk drops over the bed: drawn from it, the chain would come back on
  // every page of a story that has none.
  test("no picture is drawn from a picture of „Tapsis Milchkette“'s room", () => {
    const chainRoom = new Set(MILK_CHAIN_PICTURE_QUEUE.map((p) => p.file).filter((f) => f.includes("milkchain")));
    for (const page of NIGHT_PAGES) {
      const [ref] = nightPicture(page).ref ?? [];
      expect(chainRoom.has(ref), page.id).toBe(false);
      if (page.place === "kinderzimmer") expect(ref, page.id).not.toContain("milkchain");
    }
  });

  // Kita-Start, 11 November 2026: told only that the reference's places are empty, Gemini kept Mama on the chair.
  test("a page says who of its reference picture is not there", () => {
    for (const page of NIGHT_PAGES) {
      const prompt = nightPicture(page).prompt;
      const gone =
        page.place === "wohnzimmer" ? ["tapsi", "mama"].filter((c) => !page.cast.includes(c as never)) : page.cast.includes("tapsi") ? [] : ["tapsi"];
      expect(prompt.includes("not in this picture at all"), page.id).toBe(gone.length > 0);
    }
  });

  // A thing shown twice comes back doubled (Schnullerfee: a lid held over a box came back as a second lid): every thing
  // that comes back is said to be there only once, and so is the moon.
  test("the moon, the picture book, the blue cup and the teddy are each said to be there once", () => {
    for (const page of NIGHT_PAGES) {
      const prompt = nightPicture(page).prompt;
      for (const thing of ["picture book", "blue cup", "teddy"]) if (page.picture.includes(thing)) expect(prompt, `${page.id}: ${thing}`).toMatch(/only one/);
      if (page.place === "kinderzimmer" && /moon/.test(page.picture)) expect(prompt, page.id).toMatch(/only one moon/);
    }
  });

  // The light makes the story: the reference pictures are drawn in daylight, so each prompt says the page's light.
  test("every prompt says the page's light, and the nursing pages say how", () => {
    for (const page of NIGHT_PAGES) {
      const prompt = nightPicture(page).prompt;
      expect(prompt, page.id).toMatch(
        page.light === "nacht" ? /moonlight/ : page.light === "abend" ? /evening/ : page.light === "morgen" ? /morning/ : /daytime/,
      );
      expect(prompt.includes("Tapsi drinks"), page.id).toBe(Boolean(page.nursing) || /Tapsi drinks/.test(page.picture));
    }
  });
});

// Translated into every app language at once (22 November 2026), as „Hair Washing“: each language has every chapter
// and page, names Tapsi as its voice says it, and keeps the story's rule of the moon.
describe("The Milk Sleeps at Night in every language", () => {
  const chapterIds = NIGHT_MILK.map((c) => c.id).sort();
  const pageIds = NIGHT_PAGES.map((p) => p.id).sort();
  const LANGUAGES = { de: NIGHT_MILK_DE, zh: NIGHT_MILK_ZH, hi: NIGHT_MILK_HI, es: NIGHT_MILK_ES, ar: NIGHT_MILK_AR, ru: NIGHT_MILK_RU };
  /** Tapsi's name and the moon, as each language writes them. */
  const SAYS = {
    de: ["Tapsi", "Mond"],
    zh: ["塔普西", "月亮"],
    hi: ["टैप्सी", "चाँद"],
    es: ["Tapsi", "luna"],
    ar: ["تابسي", "القمر"],
    ru: ["Тапси", "луна"],
  };

  for (const [language, translation] of Object.entries(LANGUAGES)) {
    test(`${language}: every chapter and page, nothing else`, () => {
      expect(Object.keys(translation.chapters).sort()).toEqual(chapterIds);
      expect(Object.keys(translation.pages).sort()).toEqual(pageIds);
      for (const text of [...Object.values(translation.chapters), ...Object.values(translation.pages)]) expect(text.trim()).not.toBe("");
    });

    test(`${language}: Tapsi in its own script, and the moon's rule told`, () => {
      const all = Object.values(translation.pages).join(" ");
      for (const word of SAYS[language as keyof typeof SAYS]) expect(all).toContain(word);
      expect(translation.pages.sagen).toContain(SAYS[language as keyof typeof SAYS][1]);
      // Russian, Chinese, Hindi and Arabic are written without Latin letters.
      if (language !== "de" && language !== "es") expect(all + Object.values(translation.chapters).join(" ")).not.toMatch(/[A-Za-z]/);
    });
  }
});
