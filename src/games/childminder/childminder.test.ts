import { describe, expect, test } from "bun:test";
import { KITA_PAGES } from "@/games/kitastory/kitaStory";
import { CHILDMINDER_AR } from "./ar";
import { CHILDMINDER_PAGES, CHILDMINDER_STEPS, CHILDMINDER_STORY } from "./childminder";
import { CHILDMINDER_PICTURE_QUEUE, childminderPicture, PEOPLE, PLACES, pictureFile } from "./childminderPictures";
import { CHILDMINDER_DE } from "./de";
import { CHILDMINDER_ES } from "./es";
import { CHILDMINDER_HI } from "./hi";
import { CHILDMINDER_RU } from "./ru";
import { CHILDMINDER_ZH } from "./zh";

describe("Tapsi Goes to Lotta's", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = CHILDMINDER_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of CHILDMINDER_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // A second story of the book should be a length of its own beside the Kita's.
  test("is shorter than the story in the Kita", () => {
    expect(CHILDMINDER_PAGES.length).toBeLessThanOrEqual(KITA_PAGES.length * 0.85);
  });

  test("every step of settling in has a chapter, in the guides' order, as in the Kita story", () => {
    expect(CHILDMINDER_STORY.map((c) => c.step)).toEqual(CHILDMINDER_STEPS);
  });

  test("the morning's ritual is short and ends with waving, never in tears", () => {
    const ritual = CHILDMINDER_STORY.find((c) => c.step === "ritual");
    expect(ritual?.pages.length).toBeLessThanOrEqual(6);
    expect(ritual?.pages.at(-1)?.text).toMatch(/wave/);
    expect(ritual?.pages.some((p) => /\bcr(y|ies)\b|sad/.test(p.text))).toBe(false);
  });

  test("Mama says goodbye, says when she comes back by the day's order, and comes back then", () => {
    const texts = CHILDMINDER_PAGES.map((p) => p.text);
    expect(texts.some((t) => /never sneaks away/.test(t))).toBe(true);
    const promise = texts.findIndex((t) => /pick you up after your nap/.test(t));
    const back = texts.findIndex((t) => /Right after the nap, just as she said/.test(t));
    expect(promise).toBeGreaterThanOrEqual(0);
    expect(back).toBeGreaterThan(promise);
  });

  // As in the Kita story (user decision, 12 November 2026): Mama away from Tapsi is shown only once she stays away
  // longer, never at the first short goodbye.
  test("Mama is shown away from Tapsi only once she stays away longer", () => {
    for (const chapter of CHILDMINDER_STORY)
      for (const page of chapter.pages) if (page.cast.includes("mama") && !page.cast.includes("tapsi")) expect(chapter.step, page.id).toBe("bezugsperson");
  });

  test("nothing scolds or shames, crying is allowed, and it ends in love", () => {
    const words = /\b(naughty|stop crying|don't cry|be good|baby steps|shame|quick(ly)?|hurry|brave boy|brave girl|good boy|good girl|secretly)\b/i;
    for (const page of CHILDMINDER_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(CHILDMINDER_PAGES.some((p) => /cries\. That's okay/.test(p.text))).toBe(true);
    expect(CHILDMINDER_PAGES.at(-1)?.text).toMatch(/love/);
  });

  test("no clock, age or day of the week is named", () => {
    for (const page of CHILDMINDER_PAGES)
      expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|weekend/);
  });

  // Mascot rule: the foxes are the family, the bears have roles (the childminder, a friend, the other children) – and
  // Lotta's people stay at Lotta's and on her outing.
  test("Lotta, Emil and the children are only at Lotta's, Papa only at home and on the visit", () => {
    const lottas = new Set(["flur", "spielzimmer", "kueche", "spielplatz", "schlafzimmer"]);
    for (const page of CHILDMINDER_PAGES) {
      if (page.cast.some((c) => c === "lotta" || c === "emil" || c === "kinder")) expect(lottas.has(page.place), page.id).toBe(true);
      if (page.cast.includes("papa")) expect(["wohnzimmer", "flur"]).toContain(page.place);
    }
  });

  test("every picture is drawn from a reference, so the places and people stay", () => {
    for (const page of CHILDMINDER_PAGES) {
      const picture = childminderPicture(page);
      expect(picture.ref?.length, page.id).toBeGreaterThanOrEqual(1);
      // A reference the prompt names by its place in the list must be there.
      for (const [, nth] of picture.prompt.matchAll(/the (first|second|third|fourth) reference/g)) {
        expect(["first", "second", "third", "fourth"].indexOf(nth), page.id).toBeLessThan(picture.ref?.length ?? 0);
      }
    }
    // Each new place is drawn first on a page that is there and shows it.
    for (const [place, { first }] of Object.entries(PLACES)) {
      if (first) expect(CHILDMINDER_PAGES.find((p) => p.id === first)?.place, place).toBe(place as never);
    }
    expect(CHILDMINDER_PICTURE_QUEUE.length).toBeLessThanOrEqual(CHILDMINDER_PAGES.length);
  });

  // Kita-Start's lesson: someone first drawn elsewhere came out new where the place's picture lacked them.
  test("Lotta and Emil are drawn from the picture they first came in, wherever their place's picture lacks them", () => {
    for (const page of CHILDMINDER_PAGES) {
      const refs = childminderPicture(page).ref ?? [];
      for (const [who, id] of Object.entries(PEOPLE)) {
        if (!page.cast.includes(who as "lotta") || page.id === id) continue;
        const shows = refs.some((r) => CHILDMINDER_PAGES.some((p) => r === pictureFile(p.id) && p.cast.includes(who as "lotta")));
        expect(shows, `${page.id}: ${who}`).toBe(true);
      }
    }
  });

  test("a page drawn from a story picture says who of that picture is not there", () => {
    for (const page of CHILDMINDER_PAGES) {
      const ref = childminderPicture(page).ref?.[0] ?? "";
      const shown = CHILDMINDER_PAGES.find((p) => p.id !== page.id && ref === pictureFile(p.id))?.cast ?? [];
      const gone = shown.filter((who) => !page.cast.includes(who));
      if (gone.length) expect(childminderPicture(page).prompt, page.id).toContain("not in this picture at all");
      else expect(childminderPicture(page).prompt, page.id).not.toContain("not in this picture at all");
    }
  });
});

// Translated into every app language at once (root CLAUDE.md, 22 November 2026).
describe("Tapsi Goes to Lotta's in every language", () => {
  const chapterIds = CHILDMINDER_STORY.map((c) => c.id).sort();
  const pageIds = CHILDMINDER_PAGES.map((p) => p.id).sort();
  const LANGUAGES = { de: CHILDMINDER_DE, zh: CHILDMINDER_ZH, hi: CHILDMINDER_HI, es: CHILDMINDER_ES, ar: CHILDMINDER_AR, ru: CHILDMINDER_RU };
  /** Tapsi's and Lotta's names and Mama's promise by the nap, as each language writes them. */
  const SAYS = {
    de: ["Tapsi", "Lotta", "nach dem Mittagsschlaf"],
    zh: ["塔普西", "洛塔", "午睡以后"],
    hi: ["टैप्सी", "लोट्टा", "दोपहर की नींद के बाद"],
    es: ["Tapsi", "Lotta", "después de la siesta"],
    ar: ["تابسي", "لوتا", "بعد القيلولة"],
    ru: ["Тапси", "Лотт", "после тихого часа"],
  };

  for (const [language, translation] of Object.entries(LANGUAGES)) {
    test(`${language}: every chapter and page, nothing else`, () => {
      expect(Object.keys(translation.chapters).sort()).toEqual(chapterIds);
      expect(Object.keys(translation.pages).sort()).toEqual(pageIds);
      for (const text of [...Object.values(translation.chapters), ...Object.values(translation.pages)]) expect(text.trim()).not.toBe("");
    });

    test(`${language}: the names in its own script, and Mama's promise by the nap`, () => {
      const all = Object.values(translation.pages).join(" ");
      for (const word of SAYS[language as keyof typeof SAYS]) expect(all).toContain(word);
      // Russian, Chinese, Hindi and Arabic are written without Latin letters.
      if (language !== "de" && language !== "es") expect(all + Object.values(translation.chapters).join(" ")).not.toMatch(/[A-Za-z]/);
    });
  }
});
