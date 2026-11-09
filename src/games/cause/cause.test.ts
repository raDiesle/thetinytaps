import { describe, expect, test } from "bun:test";
import { CAUSE_ROUNDS } from "./rounds";

describe("Was ist passiert?", () => {
  test("every round has two pictures and exactly one that fits the feeling", () => {
    for (const round of CAUSE_ROUNDS) {
      expect(round.options.length).toBe(2);
      expect(round.options.filter((o) => o.fits).length).toBe(1);
    }
  });

  test("round and picture ids are unique, and every picture has an emoji and a German line for grown-ups", () => {
    const roundIds = CAUSE_ROUNDS.map((r) => r.id);
    expect(new Set(roundIds).size).toBe(roundIds.length);
    const optionIds = CAUSE_ROUNDS.flatMap((r) => r.options.map((o) => o.id));
    expect(new Set(optionIds).size).toBe(optionIds.length);
    for (const option of CAUSE_ROUNDS.flatMap((r) => r.options)) {
      expect(option.emoji.trim().length).toBeGreaterThan(0);
      expect(option.label.de.trim().length).toBeGreaterThan(0);
    }
  });
});
