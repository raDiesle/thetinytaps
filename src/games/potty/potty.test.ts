import { describe, expect, it } from "@rstest/core";
import { ANIMALS, nextAnimal, POTTY_TEXTS, STEPS } from "./content";
import { addStar } from "./stars";

describe("Aufs Töpfchen", () => {
  it("has animals with their own ids, and „Weiter“ goes through all of them", () => {
    expect(new Set(ANIMALS.map((a) => a.id)).size).toBe(ANIMALS.length);
    let id = ANIMALS[0].id;
    const seen = new Set<string>();
    for (let i = 0; i < ANIMALS.length; i++) {
      seen.add(id);
      id = nextAnimal(id).id;
    }
    expect(seen.size).toBe(ANIMALS.length);
  });

  it("has steps with their own ids, every one said, ending with the party", () => {
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
    expect(STEPS.at(-1)?.id).toBe("party");
    for (const texts of Object.values(POTTY_TEXTS)) {
      for (const step of STEPS) for (const animal of ANIMALS) expect(texts.steps[step.id](animal.name).trim()).not.toBe("");
      expect(texts.pee.trim()).not.toBe("");
      expect(texts.star.trim()).not.toBe("");
    }
  });

  it("puts one more star on today and forgets days older than two weeks", () => {
    const today = new Date(2026, 9, 26);
    const log = addStar({ "2026-10-26": 2, "2026-10-01": 5, "2026-10-20": 1 }, today);
    expect(log).toEqual({ "2026-10-26": 3, "2026-10-20": 1 });
    expect(addStar({}, today)).toEqual({ "2026-10-26": 1 });
  });
});
