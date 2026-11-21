import { describe, expect, test } from "bun:test";
import { BED_PAGES, BED_STEPS, BED_STORY } from "./bedStory";
import { BED_PICTURE_QUEUE, bedPicture, pictureFile, SAFE_BED } from "./bedStoryPictures";

describe("Tapsi's Big Bed", () => {
  test("every page has its own id, a short English text and a picture", () => {
    const ids = BED_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of BED_PAGES) {
      // Read out to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
      // English first, never a German sentence: written in English until German is asked for (root CLAUDE.md).
      expect(page.text, page.id).not.toMatch(/[äöüß„]|\b(und|die|der|das)\b/);
    }
  });

  // Like „Abstillen“, „Kita-Start“ and „Hair Washing“: the chapters follow the steps the guides give, in their order
  // (research „grosses-bett“).
  test("every step of moving into a bed of one's own has a chapter, in the guides' order", () => {
    expect(BED_STORY.flatMap((c) => (c.step ? [c.step] : []))).toEqual(BED_STEPS.map((s) => s.id));
  });

  // The guides: the new bed stands where the cot stood, the cuddly toy and the old blanket come along, the first sleeps
  // in it are naps, the evening stays as it was, a grown-up promises to look in and does, a child who gets up is brought
  // back calmly with few words, and a grown-up beside the bed moves a little further away each evening.
  test("the story tells what the guides advise", () => {
    const texts = BED_PAGES.map((p) => p.text);
    const has = (line: RegExp) =>
      expect(
        texts.some((t) => line.test(t)),
        String(line),
      ).toBe(true);
    has(/just where the cot is now/);
    has(/Bunny comes too\. And your little yellow blanket/);
    has(/naps in the big bed in the daytime/);
    has(/just like every evening/);
    has(/I'll come back soon and look in on you/);
    has(/just as he said/);
    has(/It's night\. Back to bed\./);
    has(/brings Tapsi back again/);
    has(/a little further from the bed/);
    has(/Mama listens/);
  });

  // A bed of one's own is learnt with a grown-up close: whenever Tapsi or Bruno is brought back, called for or helped
  // to sleep at night, a grown-up is in the picture.
  test("a grown-up is there on every page of the night but the one where Tapsi gets up or calls", () => {
    const alone = new Set(["raus", "traum"]);
    for (const page of BED_PAGES)
      if (page.light === "nacht" && !alone.has(page.id))
        expect(
          page.cast.some((c) => c !== "tapsi" && c !== "bruno"),
          page.id,
        ).toBe(true);
  });

  // The research's „left out“: no punishment, no crying it out, no locked door, no „it was only a dream“ and no sticker
  // chart (the guides disagree on rewards for sleep), and nothing calls the child a baby or tells it to hurry.
  test("nothing scolds, threatens, hurries or rewards, and it ends in love", () => {
    const words =
      /\b(hold still|stop crying|don't cry|cry it out|be good|naughty|baby|quick(ly)?|hurry|must|have to|brave boy|brave girl|good boy|good girl|lock(ed)?|punish\w*|only a dream|no monsters|sticker|chart|reward|prize)\b/i;
    for (const page of BED_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(BED_PAGES.at(-1)?.text).toMatch(/love/);
  });

  // Like the other chapter books: no clock, no age – each family has its own evening and its own child.
  test("no clock, age or day of the week is named", () => {
    for (const page of BED_PAGES) expect(page.text, page.id).not.toMatch(/\b\d|o'clock|years? old|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
  });

  test("every picture is drawn from a reference, and a place's first picture comes before the pages drawn from it", () => {
    const order = BED_PAGES.map((p) => pictureFile(p.id));
    for (const [i, page] of BED_PAGES.entries()) {
      const refs = bedPicture(page).ref ?? [];
      expect(refs.length, page.id).toBeGreaterThan(0);
      for (const ref of refs) {
        const at = order.indexOf(ref);
        if (at >= 0) expect(at, `${page.id} ← ${ref}`).toBeLessThan(i);
      }
    }
    expect(BED_PICTURE_QUEUE.length).toBeLessThanOrEqual(BED_PAGES.length);
  });

  // Kita-Start, 11 November 2026: told only that the reference's places are empty, Gemini kept Mama on the chair.
  test("a page drawn from Tapsi's made bed says who of that picture is not there", () => {
    const first = BED_PAGES.find((p) => p.id === "machen");
    for (const page of BED_PAGES.filter((p) => p.place === "kinderzimmer" && p.id !== "machen")) {
      const gone = (first?.cast ?? []).filter((who) => !page.cast.includes(who));
      expect(bedPicture(page).prompt.includes("not in this picture at all"), page.id).toBe(gone.length > 0);
    }
  });

  // A thing shown twice comes back doubled (Schnullerfee: a lid held over a box came back as a second lid).
  test("the bunny, the blanket, the chair, the night light and the boat pillow are each said to be there once", () => {
    for (const page of BED_PAGES) {
      const prompt = bedPicture(page).prompt;
      for (const thing of ["plush bunny", "yellow blanket", "chair", "night light", "boat"])
        if (page.picture.includes(thing)) expect(prompt, `${page.id}: ${thing}`).toMatch(/only one/);
    }
  });

  // Kita-Start's Mia came back with a fox's bushy tail.
  test("every bear is drawn with a bear's tail", () => {
    for (const page of BED_PAGES)
      if (page.cast.some((c) => c === "bruno" || c === "mamaBaer" || c === "papaBaer"))
        expect(bedPicture(page).prompt, page.id).toContain("tiny round bear tail");
  });

  // Who is in bed lies inside it, as a safe bed for a small child is.
  test("every picture of a made bed keeps whoever lies in it safely inside", () => {
    for (const page of BED_PAGES)
      if (page.place === "kinderzimmer" || page.place === "brunozimmer") expect(bedPicture(page).prompt, page.id).toContain(SAFE_BED);
  });

  // The night's clothes follow the picture's words: pyjamas or a nightgown only where the page says so.
  test("night clothes are worn only where a page says so", () => {
    for (const page of BED_PAGES) {
      const prompt = bedPicture(page).prompt;
      expect(prompt.includes("light-blue pyjamas"), page.id).toBe(/Tapsi in pyjamas/.test(page.picture));
      if (page.cast.includes("mama")) expect(prompt.includes("long yellow nightgown"), page.id).toBe(/Mama in her nightgown/.test(page.picture));
    }
  });
});
