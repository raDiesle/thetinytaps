import { expect, test } from "@rstest/core";
import { CATEGORIES } from "./categories";
import { MOVEMENTS } from "./movements";
import { SCENARIOS } from "./scenarios";
import { SEQUENCES } from "./sequences";
import { WORLDS } from "./worlds";

const movementIds = new Set(MOVEMENTS.map((m) => m.id));
const worldIds = new Set(WORLDS.map((w) => w.id));

test("movement ids are unique", () => {
  expect(movementIds.size).toBe(MOVEMENTS.length);
});

test("movements belong to known categories and worlds", () => {
  const categoryIds = new Set(CATEGORIES.map((c) => c.id));
  for (const m of MOVEMENTS) {
    expect(categoryIds, m.id).toContain(m.category);
    expect(worldIds, m.id).toContain(m.scenario.world);
    expect(m.ageRange.min, m.id).toBeLessThanOrEqual(m.ageRange.max);
    expect(m.movementSteps.length, m.id).toBeGreaterThan(0);
  }
});

test("scenarios and sequences only use movements of the library", () => {
  for (const scenario of SCENARIOS) {
    expect(worldIds, scenario.id).toContain(scenario.world);
    for (const moment of scenario.moments) expect(movementIds, scenario.id).toContain(moment.movement);
  }
  for (const sequence of SEQUENCES) {
    expect(worldIds, sequence.id).toContain(sequence.world);
    for (const step of sequence.steps) {
      expect(movementIds, sequence.id).toContain(step.movement);
      expect(step.seconds, `${sequence.id} ${step.movement}`).toBeGreaterThan(0);
    }
  }
});
