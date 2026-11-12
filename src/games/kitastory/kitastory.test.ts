import { describe, expect, test } from "bun:test";
import { KITA_PAGES, KITA_STORY, SETTLING_STEPS } from "./kitaStory";
import { KITA_PICTURE_QUEUE, kitaPicture } from "./kitaStoryPictures";

describe("Tapsi geht in die Kita", () => {
  test("every page has its own id, a short German text and a picture", () => {
    const ids = KITA_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of KITA_PAGES) {
      // Read out by a grown-up to a small child: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
    }
  });

  // User request, 11 November 2026: like „Abstillen“, the chapters follow the steps the guides give, in their order.
  test("every step of settling in has a chapter, in the guides' order", () => {
    expect(KITA_STORY.flatMap((c) => (c.step ? [c.step] : []))).toEqual(SETTLING_STEPS.map((s) => s.id));
  });

  // Idea H-10: the morning's goodbye is a ritual read every morning – short, and it ends happily, not in tears.
  test("the morning's ritual is short and ends with waving", () => {
    const ritual = KITA_STORY.find((c) => c.step === "ritual");
    expect(ritual?.pages.length).toBeLessThanOrEqual(6);
    expect(ritual?.pages.at(-1)?.text).toMatch(/winkt/);
    expect(ritual?.pages.some((p) => /weint|traurig/.test(p.text))).toBe(false);
  });

  // The guides agree: a parent never sneaks away, says when they come back by the day's order (not the clock), and
  // comes back just then.
  test("Mama says goodbye, says when she comes back, and comes back then", () => {
    const texts = KITA_PAGES.map((p) => p.text);
    expect(texts.some((t) => /schleicht sich nie weg/.test(t))).toBe(true);
    const promise = KITA_PAGES.findIndex((p) => /hole dich nach dem Mittagsschlaf/.test(p.text));
    const back = KITA_PAGES.findIndex((p) => /nach dem Mittagsschlaf, wie sie gesagt hat/.test(p.text));
    expect(promise).toBeGreaterThan(-1);
    expect(back).toBeGreaterThan(promise);
    for (const text of texts) expect(text, text).not.toMatch(/\b\d{1,2}(:\d\d)? Uhr\b/);
  });

  // User decision, 12 November 2026: Mama at home while Tapsi is in the Kita belongs where she stays away longer, never
  // to the first short goodbye, when the guides keep her in the building.
  test("Mama is shown away from Tapsi only once she stays away longer", () => {
    for (const chapter of KITA_STORY)
      for (const page of chapter.pages) if (page.cast.includes("mama") && !page.cast.includes("tapsi")) expect(chapter.step, page.id).toBe("bezugsperson");
  });

  test("nothing scolds or shames, crying is allowed, and it ends in love", () => {
    const words = /\b(böse|unartig|schäm|stell dich nicht an|hör auf zu weinen|darf nicht weinen|baby\b|heimlich|schnell weg)/i;
    for (const page of KITA_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(KITA_PAGES.some((p) => /weint\. Das darf/.test(p.text))).toBe(true);
    expect(KITA_PAGES.at(-1)?.text).toMatch(/lieb/);
  });

  // Mascot rule: the foxes are the family, the bears have roles (the teacher, a friend, the group) – and the Kita's
  // people stay in the Kita.
  test("Mia, Bruno and the group are only in the Kita, Papa only at home and on the way", () => {
    const kita = new Set(["kita", "garderobe", "gruppenraum", "garten"]);
    for (const page of KITA_PAGES) {
      if (page.cast.some((c) => c === "mia" || c === "bruno" || c === "kinder" || c === "gruppe")) expect(kita.has(page.place), page.id).toBe(true);
      if (page.cast.includes("papa")) expect(["wohnzimmer", "kita"]).toContain(page.place);
    }
  });

  test("every picture is drawn from a reference, so the places and people stay", () => {
    for (const page of KITA_PAGES) {
      const picture = kitaPicture(page);
      expect(picture.ref?.length, page.id).toBeGreaterThanOrEqual(1);
      // A reference the prompt names by its place in the list must be there.
      for (const [, nth] of picture.prompt.matchAll(/the (first|second|third|fourth) reference/g)) {
        expect(["first", "second", "third", "fourth"].indexOf(nth), page.id).toBeLessThan(picture.ref?.length ?? 0);
      }
    }
    expect(KITA_PICTURE_QUEUE.length).toBeLessThanOrEqual(KITA_PAGES.length);
  });

  // A place's first picture is drawn from the families, so Mia, first drawn elsewhere, came out new there until she got
  // her own reference (found before the first batch, 11 November 2026).
  test("Mia and Bruno are drawn from the picture they first came in, wherever their place's picture lacks them", () => {
    const first = { mia: "ankommen", bruno: "stuhl" };
    for (const page of KITA_PAGES) {
      const refs = kitaPicture(page).ref ?? [];
      for (const [who, id] of Object.entries(first)) {
        if (!page.cast.includes(who as "mia") || page.id === id) continue;
        // A reference of the story showing them: the page they first came in, or a place's picture with them in it.
        const shows = refs.some((r) => KITA_PAGES.some((p) => r.endsWith(`kita-${p.id}.webp`) && p.cast.includes(who as "mia")));
        expect(shows, `${page.id}: ${who}`).toBe(true);
      }
    }
  });

  // Told only that the reference's places are empty now, Gemini kept Mama on the play room's chair in four of fifteen
  // pictures (once with a second Tapsi on her lap) and Bruno in Mia's arms (11 November 2026).
  test("a page drawn from a story picture says who of that picture is not there", () => {
    for (const page of KITA_PAGES) {
      const ref = kitaPicture(page).ref?.[0] ?? "";
      const shown = KITA_PAGES.find((p) => p.id !== page.id && ref.endsWith(`kita-${p.id}.webp`))?.cast ?? [];
      const gone = shown.filter((who) => !page.cast.includes(who));
      if (gone.length) expect(kitaPicture(page).prompt, page.id).toContain("not in this picture at all");
      else expect(kitaPicture(page).prompt, page.id).not.toContain("not in this picture at all");
    }
  });
});
