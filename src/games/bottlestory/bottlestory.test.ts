import { describe, expect, test } from "bun:test";
import { BOTTLE_ORDER, BOTTLE_PAGES, BOTTLE_STEPS, BOTTLE_STORY } from "./bottleStory";
import { BOTTLE, BOTTLE_PICTURE_QUEUE, bottlePicture } from "./bottleStoryPictures";

/** The chapter of a step, by its place in the story. */
const chapterOf = (step: string) => BOTTLE_STORY.findIndex((c) => c.step === step);

describe("Bye-Bye, Bottle!", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = BOTTLE_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of BOTTLE_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence: written in English until German is asked for (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // Like the other chapter books: the chapters follow the steps the guides give, in their order (research
  // „flasche-abgewoehnen“).
  test("every step from the bottle to the cup has a chapter, in the guides' order", () => {
    expect(BOTTLE_STORY.flatMap((c) => (c.step ? [c.step] : []))).toEqual(BOTTLE_STEPS.map((s) => s.id));
  });

  // The guides agree on one bottle at a time, the bedtime bottle last (the one that comforts most); the cup comes before
  // the first bottle goes, and the night after the bedtime bottle.
  test("the cup comes first, then one bottle after the other, the bedtime bottle last, then the night", () => {
    const chapters = BOTTLE_ORDER.map((b) => chapterOf(b.chapter));
    expect(chapters).toEqual([...chapters].sort((a, b) => a - b));
    expect(BOTTLE_ORDER.at(-1)?.time).toBe("abend");
    expect(chapterOf("becher")).toBeLessThan(chapters[0]);
    expect(chapterOf("nacht")).toBeGreaterThan(chapters.at(-1) ?? 0);
  });

  // The guides: milk with the meal in an open cup, never a bottle to fall asleep with (teeth), water at night, the
  // cuddle stays when the bottle goes, and the bottle out of sight.
  test("milk comes in the cup at the table, the cuddle stays, water at night, the bottle out of sight", () => {
    const texts = BOTTLE_PAGES.map((p) => p.text);
    expect(texts.some((t) => /milk comes in the green cup/.test(t))).toBe(true);
    expect(texts.some((t) => /the cuddle stays/.test(t))).toBe(true);
    expect(texts.some((t) => /out of sight/.test(t))).toBe(true);
    expect(BOTTLE_STORY[chapterOf("nacht")].pages.some((p) => /water in the cup/.test(p.text))).toBe(true);
    expect(BOTTLE_STORY[chapterOf("abend")].pages.some((p) => /In bed there is no bottle/.test(p.text))).toBe(true);
  });

  // Never a bottle in bed: no picture in the evening or at night shows one, and no picture in bed at all.
  test("no picture shows a bottle in bed, in the evening or at night", () => {
    for (const page of BOTTLE_PAGES) {
      if (page.light === "abend" || page.light === "nacht") expect(page.picture, page.id).not.toMatch(/bottle/);
      if (/in bed|sits up in bed/.test(page.picture)) expect(page.picture, page.id).not.toMatch(/bottle/);
    }
  });

  // Once packed into its box, the bottle stays gone: no later picture shows it.
  test("after the bottle is packed away, no picture shows it again", () => {
    const packed = BOTTLE_PAGES.findIndex((p) => p.id === "kiste");
    expect(packed).toBeGreaterThan(0);
    for (const page of BOTTLE_PAGES.slice(packed + 1)) expect(page.picture, page.id).not.toMatch(/bottle/);
  });

  // For every child who drank from a bottle, breastfed or not (idea H-105): nothing speaks of Mama's milk or breast.
  test("it fits a child who was never breastfed", () => {
    for (const page of BOTTLE_PAGES) expect(`${page.text} ${page.picture}`, page.id).not.toMatch(/breast|nurs|Mama's milk/i);
    expect(BOTTLE_PAGES[0].cast).toContain("papa");
  });

  // Gentle and true: Tapsi may be sad and cries in Mama's arms, nobody scolds, shames („like a baby“) or bribes, and a
  // grown-up is in every picture where Tapsi cries or calls in the night.
  test("nothing scolds, shames or bribes, crying is allowed with a grown-up there, and it ends in love", () => {
    const words =
      /\b(naughty|bad|stop crying|don't cry|be good|must|have to|like a baby|for babies|too big for|quick(ly)?|hurry|good boy|good girl|reward|sweets?|candy|juice)\b/i;
    for (const page of BOTTLE_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(BOTTLE_PAGES.some((p) => /cries\. That's all right\./.test(p.text))).toBe(true);
    for (const page of BOTTLE_PAGES)
      if (/cries|calling out/.test(page.picture))
        expect(
          page.cast.some((c) => c === "mama" || c === "papa"),
          page.id,
        ).toBe(true);
    expect(BOTTLE_PAGES.at(-1)?.text).toMatch(/love/);
  });

  // Like the other chapter books: no clock, no age – each family has its own day and its own child.
  test("no clock, age or day of the week is named", () => {
    for (const page of BOTTLE_PAGES)
      expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|months? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from a picture of the other books, so the home and the family stay", () => {
    for (const page of BOTTLE_PAGES) {
      const entry = bottlePicture(page);
      expect(entry.ref?.length, page.id).toBe(1);
      expect(entry.ref?.[0], page.id).toMatch(/^src\/games\/(milkchain|pacifierstory)\/bilder\//);
      expect(entry.after, page.id).toContain("MADE");
    }
    expect(BOTTLE_PICTURE_QUEUE.length).toBeLessThanOrEqual(BOTTLE_PAGES.length);
  });

  // Kita-Start, 11 November 2026: told only that the reference's places are empty, Gemini kept Mama on the chair.
  test("a page leaving out someone of its reference says so", () => {
    const baby = BOTTLE_PAGES.find((p) => p.id === "baby");
    expect(baby && bottlePicture(baby).prompt).toContain("Tapsi (the fox toddler) and Mama (the grown-up fox woman) are not in this picture at all");
    const cup = BOTTLE_PAGES.find((p) => p.id === "schluck");
    expect(cup && bottlePicture(cup).prompt).toContain("Papa (the grown-up fox man) is not in this picture at all");
  });

  // A thing shown twice comes back doubled (Schnullerfee: a lid held over a box came back as a second lid): every thing
  // that comes back is said to be there only once, and the bottle looks the same on every page.
  test("the bottle, the green cup, the bunny and the box are each said to be there once", () => {
    for (const page of BOTTLE_PAGES) {
      const prompt = bottlePicture(page).prompt;
      if (/bottle/.test(page.picture)) expect(prompt, page.id).toContain(BOTTLE);
      for (const thing of ["green cup", "plush bunny", "box"]) if (page.picture.includes(thing)) expect(prompt, `${page.id}: ${thing}`).toMatch(/only one/);
    }
  });
});
