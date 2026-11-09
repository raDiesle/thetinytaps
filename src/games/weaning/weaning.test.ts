import { describe, expect, test } from "bun:test";
import { STEPS } from "./content";

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
