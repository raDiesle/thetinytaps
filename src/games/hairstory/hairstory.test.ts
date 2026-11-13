import { describe, expect, test } from "bun:test";
import { HAIR_PAGES, HAIR_STORY, WASH_STEPS } from "./hairStory";
import { HAIR_PICTURE_QUEUE, hairPicture, IN_THE_BATH } from "./hairStoryPictures";

describe("Tapsi and the Foam Crown", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = HAIR_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of HAIR_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence: written in English until German is asked for (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // User request, 13 November 2026: like „Abstillen“ and „Kita-Start“, the chapters follow the steps the guides give,
  // in their order (research „haare-waschen“).
  test("every step of washing hair gently has a chapter, in the guides' order", () => {
    expect(HAIR_STORY.flatMap((c) => (c.step ? [c.step] : []))).toEqual(WASH_STEPS.map((s) => s.id));
  });

  // The guides: tell beforehand and in which order, wash hair not every bath, keep the eyes dry with a cloth the child
  // holds itself, and let the child give the signal.
  test("Tapsi knows what comes, holds the cloth and says when", () => {
    const texts = HAIR_PAGES.map((p) => p.text);
    expect(texts.some((t) => /Not every night/.test(t))).toBe(true);
    expect(texts.some((t) => /First water, then foam, then water again/.test(t))).toBe(true);
    expect(texts.some((t) => /“Now!”/.test(t))).toBe(true);
    expect(texts.some((t) => /eyes stay dry/.test(t))).toBe(true);
  });

  // The guides agree: never leave a small child alone in the bath, not even for a moment.
  test("a grown-up is beside Tapsi in every picture in the bath", () => {
    for (const page of HAIR_PAGES)
      if (/Tapsi in the bath/.test(page.picture))
        expect(
          page.cast.some((c) => c === "mama" || c === "papa"),
          page.id,
        ).toBe(true);
  });

  // Never forced: when it is too much, Mama stops at once, Tapsi may cry, and Tapsi decides how to go on.
  test("nothing forces, scolds or hurries, crying is allowed, and it ends in love", () => {
    const words = /\b(hold still|stop crying|don't cry|be good|naughty|baby|quick(ly)?|hurry|must|have to|brave boy|brave girl|good boy|good girl)\b/i;
    for (const page of HAIR_PAGES) expect(page.text, page.id).not.toMatch(words);
    const pause = HAIR_STORY.find((c) => c.step === "pause");
    expect(pause?.pages.some((p) => /stops at once/.test(p.text))).toBe(true);
    expect(pause?.pages.some((p) => /You may cry/.test(p.text))).toBe(true);
    expect(pause?.pages.some((p) => /or stop for today\?/.test(p.text))).toBe(true);
    expect(HAIR_PAGES.at(-1)?.text).toMatch(/love/);
  });

  // Like the other chapter books: no clock, no age – each family has its own evening and its own child.
  test("no clock, age or day of the week is named", () => {
    for (const page of HAIR_PAGES) expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from a reference, so the places and the family stay", () => {
    for (const page of HAIR_PAGES) expect(hairPicture(page).ref?.length, page.id).toBe(1);
    expect(HAIR_PICTURE_QUEUE.length).toBeLessThanOrEqual(HAIR_PAGES.length);
  });

  // Kita-Start, 11 November 2026: told only that the reference's places are empty, Gemini kept Mama on the chair.
  test("a page drawn from a story picture says who of that picture is not there", () => {
    const first = HAIR_PAGES.find((p) => p.id === "becher");
    for (const page of HAIR_PAGES.filter((p) => p.place === "bad" && p.id !== "becher")) {
      const gone = (first?.cast ?? []).filter((who) => !page.cast.includes(who));
      expect(hairPicture(page).prompt.includes("not in this picture at all"), page.id).toBe(gone.length > 0);
    }
  });

  // The first bath pictures: a see-through tub, water over the face, a second cup or bottle in Mama's other paw.
  test("every picture in the bath keeps the tub solid, the face dry and one cup", () => {
    for (const page of HAIR_PAGES) if (/Tapsi in the bath/.test(page.picture)) expect(hairPicture(page).prompt, page.id).toContain(IN_THE_BATH);
  });

  // A thing shown twice comes back doubled (Schnullerfee: a lid held over a box came back as a second lid): every thing
  // that comes back is said to be there only once.
  test("the cup, the cloth, the shampoo and the bunny are each said to be there once", () => {
    for (const page of HAIR_PAGES) {
      const prompt = hairPicture(page).prompt;
      for (const thing of ["red cup", "washcloth", "shampoo", "plush bunny"])
        if (page.picture.includes(thing)) expect(prompt, `${page.id}: ${thing}`).toMatch(/only one/);
    }
  });
});
