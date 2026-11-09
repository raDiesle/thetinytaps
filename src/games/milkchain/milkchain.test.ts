import { describe, expect, test } from "bun:test";
import { GENTLE_STEPS, goneOn, MILK_CHAIN, MILK_CHAIN_PAGES, MILK_ORDER } from "./milkChain";

describe("Tapsis Milchkette", () => {
  test("every page has its own id, a short German text and a picture", () => {
    const ids = MILK_CHAIN_PAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const page of MILK_CHAIN_PAGES) {
      // Read out by a grown-up to a child of about two: one or two short sentences.
      expect(page.text.length, page.id).toBeLessThanOrEqual(110);
      expect(page.picture.length, page.id).toBeGreaterThan(20);
    }
  });

  // User feedback, November 2026: the steps the guides give for gentle weaning are found in the chapters, in order.
  test("every step of gentle weaning has a chapter, in the guides' order", () => {
    expect(MILK_CHAIN.flatMap((c) => (c.step ? [c.step] : []))).toEqual(GENTLE_STEPS.map((s) => s.id));
  });

  // The easiest milk time goes first (the day), falling asleep and the night later, the morning's milk last.
  test("the milk times go one after the other, the day first", () => {
    expect(MILK_CHAIN.flatMap((c) => (c.goes ? [c.goes] : []))).toEqual(MILK_ORDER);
    expect(goneOn(MILK_CHAIN_PAGES[0].id)).toEqual([]);
    expect(goneOn(MILK_CHAIN_PAGES.at(-1)?.id ?? "")).toEqual(MILK_ORDER);
  });

  test("a picture with Tapsi drinking has Mama and Tapsi in it", () => {
    for (const page of MILK_CHAIN_PAGES.filter((p) => p.nursing)) {
      expect(page.cast, page.id).toContain("mama");
      expect(
        page.cast.some((c) => c === "tapsi" || c === "baby"),
        page.id,
      ).toBe(true);
    }
  });

  // User feedback, November 2026: the child only understands it when it is plainly about Mama's breast.
  test("it says plainly that it is about Mama's breast", () => {
    const told = MILK_CHAIN_PAGES.filter((p) => /\bBrust\b/.test(p.text));
    expect(told.length).toBeGreaterThanOrEqual(3);
  });

  test("nothing scolds, being sad is allowed, and it ends in love", () => {
    const words = /\b(böse|unartig|schäm|nein,? nein|darf nicht|nicht mehr lieb|zu groß für|baby(haft)?\b.*\bnicht)/i;
    for (const page of MILK_CHAIN_PAGES) expect(page.text, page.id).not.toMatch(words);
    expect(MILK_CHAIN_PAGES.some((p) => /traurig sein/.test(p.text))).toBe(true);
    expect(MILK_CHAIN_PAGES.at(-1)?.text).toMatch(/lieb/);
  });
});
