import { describe, expect, test } from "bun:test";
import { STEPS } from "./content";
import { MILK_CHAIN, MILK_CHAIN_PAGES, MILK_ORDER } from "./milkChain";

describe("Abstillen", () => {
  test("every page has its own id and a short German sentence", () => {
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
    for (const step of STEPS) {
      expect(step.line.de.trim().length, step.id).toBeGreaterThan(0);
      // Small under the picture, read out by a grown-up: never more than two short sentences' worth.
      expect(step.line.de.length, step.id).toBeLessThanOrEqual(80);
    }
  });

  // The story says goodbye to Mama's milk without blame: being sad belongs to it, and it ends happily in the morning.
  test("the milk is said goodbye to before the evening, and the story ends in the morning", () => {
    const ids = STEPS.map((s) => s.id);
    expect(ids.indexOf("goodbye")).toBeLessThan(ids.indexOf("evening"));
    expect(ids.at(-1)).toBe("morning");
    expect(STEPS.at(-1)?.sky).toBe("morning");
  });

  test("nothing in the story scolds or calls the child naughty", () => {
    const words = /\b(böse|unartig|schäm|nein,? nein|darf nicht|nicht mehr lieb)/i;
    for (const step of STEPS) expect(step.line.de, step.id).not.toMatch(words);
  });
});

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

  // Weaning guides drop the easiest milk time first and the bedtime milk last; the chapters say goodbye in that order.
  test("the milk times go one after the other, the day first and the evening last", () => {
    expect(MILK_CHAIN.flatMap((c) => (c.goes ? [c.goes] : []))).toEqual(MILK_ORDER);
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
