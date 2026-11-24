import { describe, expect, test } from "bun:test";
import { OWN_BED_AR } from "./ar";
import { OWN_BED_DE } from "./de";
import { OWN_BED_ES } from "./es";
import { OWN_BED_HI } from "./hi";
import { OWN_BED_KIND, OWN_BED_TITLE } from "./names";
import { OWN_BED_PAGES, OWN_BED_STEPS, OWN_BED_STORY } from "./ownBed";
import { FIRST, OWN_BED_PICTURE_QUEUE, ownBedPicture, pictureFile, SAFE_BED } from "./ownBedPictures";
import { OWN_BED_RU } from "./ru";
import { OWN_BED_ZH } from "./zh";

/** Every translation of the story (root CLAUDE.md: every new text in all seven app languages at once). */
const TRANSLATIONS = { de: OWN_BED_DE, zh: OWN_BED_ZH, hi: OWN_BED_HI, es: OWN_BED_ES, ar: OWN_BED_AR, ru: OWN_BED_RU };

/** Tapsi's name in each language's own script (root CLAUDE.md, Language). */
const TAPSI = { de: "Tapsi", zh: "塔普西", hi: "टैप्सी", es: "Tapsi", ar: "تابسي", ru: "Тапси" };

describe("Tapsi's Own Bed", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = OWN_BED_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of OWN_BED_PAGES) {
      // Read out to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // Like the first story of the book: the chapters follow the guides' steps out of the parents' bed, in their order
  // (research „grosses-bett“).
  test("every step out of the parents' bed has a chapter, in the guides' order", () => {
    expect(OWN_BED_STORY.map((c) => c.step)).toEqual(OWN_BED_STEPS.map((s) => s.id));
  });

  // The guides: tell it beforehand and listen to the wish to stay, keep the morning cuddle in the big bed, take along
  // what smells of home, the door open and a night light, naps first with a grown-up beside the bed, the evening as it
  // was, a grown-up who moves away step by step, and a child who comes over at night brought back calmly, again and again.
  test("the story tells what the guides advise", () => {
    const texts = OWN_BED_PAGES.map((p) => p.text);
    const has = (line: RegExp) =>
      expect(
        texts.some((t) => line.test(t)),
        String(line),
      ).toBe(true);
    has(/We are always close by/);
    has(/every morning you come over to our big bed/);
    has(/smells of home/);
    has(/door stays open/);
    has(/little moon/);
    has(/naps in Tapsi's own bed in the daytime/);
    has(/just like every evening/);
    has(/a little further from the bed/);
    has(/calm and quiet/);
    has(/brings Tapsi back again/);
  });

  // The move is learnt with a grown-up close: on every page of the night but the one where Tapsi gets up, a grown-up is there.
  test("a grown-up is there on every page of the night but the one where Tapsi gets up", () => {
    for (const page of OWN_BED_PAGES)
      if (page.light === "nacht" && page.id !== "raus")
        expect(
          page.cast.some((c) => c !== "tapsi"),
          page.id,
        ).toBe(true);
  });

  // No punishment, no crying it out, no locked door, no sticker chart, and the big bed is never forbidden or called wrong.
  test("nothing scolds, threatens, hurries or rewards, and it ends in love", () => {
    const words =
      /\b(hold still|stop crying|don't cry|cry it out|be good|naughty|baby|quick(ly)?|hurry|must|have to|not allowed|no more|never again|too big|brave boy|brave girl|good boy|good girl|lock(ed)?|punish\w*|sticker|chart|reward|prize)\b/i;
    for (const page of OWN_BED_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(OWN_BED_PAGES.at(-1)?.text).toMatch(/love/);
  });

  test("no clock, age or day of the week is named", () => {
    for (const page of OWN_BED_PAGES)
      expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from a reference, and the bedroom's first picture comes before the pages drawn from it", () => {
    const order = OWN_BED_PAGES.map((p) => pictureFile(p.id));
    for (const [i, page] of OWN_BED_PAGES.entries()) {
      const refs = ownBedPicture(page).ref ?? [];
      expect(refs.length, page.id).toBeGreaterThan(0);
      for (const ref of refs) {
        const at = order.indexOf(ref);
        if (at >= 0) expect(at, `${page.id} ← ${ref}`).toBeLessThan(i);
      }
      if (page.place === "elternzimmer" && page.id !== FIRST) expect(refs, page.id).toEqual([pictureFile(FIRST)]);
    }
    expect(OWN_BED_PAGES[0]?.id).toBe(FIRST);
    expect(OWN_BED_PICTURE_QUEUE.length).toBeLessThanOrEqual(OWN_BED_PAGES.length);
  });

  // Kita-Start: told only that the reference's places are empty, Gemini kept Mama on the chair.
  test("a page drawn from Tapsi's room says who of that picture is not there", () => {
    for (const page of OWN_BED_PAGES.filter((p) => p.place === "kinderzimmer")) {
      const gone = (["tapsi", "mama"] as const).filter((who) => !page.cast.includes(who));
      expect(ownBedPicture(page).prompt.includes("not in this picture at all"), page.id).toBe(gone.length > 0);
    }
  });

  // A thing shown twice comes back doubled (Schnullerfee: a lid held over a box came back as a second lid).
  test("the bunny, the night light, the book and the cushion are each said to be there once", () => {
    for (const page of OWN_BED_PAGES) {
      const prompt = ownBedPicture(page).prompt;
      for (const thing of ["plush bunny", "night light", "picture book", "cushion"])
        if (page.picture.includes(thing)) expect(prompt, `${page.id}: ${thing}`).toMatch(/only one/);
    }
  });

  test("every picture of a bed keeps whoever lies in it safely inside", () => {
    for (const page of OWN_BED_PAGES) if (/\bbed\b/.test(page.picture)) expect(ownBedPicture(page).prompt, page.id).toContain(SAFE_BED);
  });

  // Haare waschen and Abstillen: with both grown-ups in one picture Gemini once drew one fox with the flower and the glasses.
  test("Mama and Papa are said to be two foxes wherever both are in a picture", () => {
    for (const page of OWN_BED_PAGES)
      if (page.cast.includes("mama") && page.cast.includes("papa"))
        expect(ownBedPicture(page).prompt, page.id).toContain("Mama and Papa are two separate foxes");
  });

  test("night clothes are worn only where a page says so", () => {
    for (const page of OWN_BED_PAGES) {
      const prompt = ownBedPicture(page).prompt;
      expect(prompt.includes("light-blue pyjamas"), page.id).toBe(/Tapsi in pyjamas/.test(page.picture));
      if (page.cast.includes("mama")) expect(prompt.includes("long yellow nightgown"), page.id).toBe(/Mama in her nightgown/.test(page.picture));
      if (page.cast.includes("papa")) expect(prompt.includes("green striped pyjamas"), page.id).toBe(/Papa in pyjamas/.test(page.picture));
    }
  });

  test("every language has every chapter, page and name", () => {
    for (const [language, t] of Object.entries(TRANSLATIONS)) {
      expect(Object.keys(t.chapters).sort(), language).toEqual(OWN_BED_STORY.map((c) => c.id).sort());
      expect(Object.keys(t.pages).sort(), language).toEqual(OWN_BED_PAGES.map((p) => p.id).sort());
      for (const text of [...Object.values(t.chapters), ...Object.values(t.pages)]) expect(text.trim().length, language).toBeGreaterThan(0);
      for (const names of [OWN_BED_TITLE, OWN_BED_KIND]) expect(names[language as keyof typeof names], language).toBeTruthy();
    }
  });

  test("Tapsi in each script, no Latin letters in Russian, Chinese, Hindi and Arabic", () => {
    for (const [language, t] of Object.entries(TRANSLATIONS)) {
      const tapsi = TAPSI[language as keyof typeof TAPSI];
      for (const page of OWN_BED_PAGES) if (page.text.includes("Tapsi")) expect(t.pages[page.id], `${language} ${page.id}`).toContain(tapsi);
      if (["ru", "zh", "hi", "ar"].includes(language))
        for (const text of [...Object.values(t.chapters), ...Object.values(t.pages)]) expect(text, language).not.toMatch(/[A-Za-z]/);
    }
  });
});
