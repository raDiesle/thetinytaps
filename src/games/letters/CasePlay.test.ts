import { describe, expect, test } from "bun:test";
import { de } from "@/content/de";
import { caseLetters, choicesFor } from "./CasePlay";

// „Wo ist das kleine b?“: exactly one small letter fits its big one (root CLAUDE.md: never a second choice a child
// could rightly pick), and the easy rounds really are easy.
describe("Wo ist das kleine b?", () => {
  const letters = caseLetters(de);

  test("asks only for letters with a big and a small form and no marks over them", () => {
    expect(letters.length).toBeGreaterThan(20);
    for (const l of letters) expect(l.upper.normalize("NFD")).toHaveLength(1);
  });

  test.each([false, true])("three different small letters, exactly one belonging to the big one (alike: %p)", (alike) => {
    for (let run = 0; run < 20; run++) {
      for (const letter of letters) {
        const choices = choicesFor(letter, letters, alike);
        expect(choices).toHaveLength(3);
        expect(new Set(choices.map((c) => c.lower)).size).toBe(3);
        expect(choices.filter((c) => c.upper === letter.upper || c.lower === letter.lower)).toEqual([letter]);
      }
    }
  });

  test("an easy round never puts b next to d or p; a hard one does", () => {
    const b = letters.find((l) => l.lower === "b")!;
    for (let run = 0; run < 50; run++) {
      expect(choicesFor(b, letters, false).some((c) => ["d", "p", "q"].includes(c.lower))).toBe(false);
      expect(choicesFor(b, letters, true).some((c) => ["d", "p", "q"].includes(c.lower))).toBe(true);
    }
  });
});
