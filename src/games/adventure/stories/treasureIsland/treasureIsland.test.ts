import { expect, test } from "@rstest/core";
import { TREASURE_ISLAND } from ".";
import { CYCLES, clipLength } from "./script";

test("every movement of the Schatzinsel ends after whole goes, so each go has its target", () => {
  CYCLES.forEach((cycle, step) => {
    if (!cycle) return;
    const goes = (clipLength(step) - cycle.from) / cycle.seconds;
    expect(Math.abs(goes - Math.round(goes)), `step ${step}: ${goes} goes`).toBeLessThan(0.01);
    expect(Math.round(goes), `step ${step}`).toBeGreaterThanOrEqual(2);
  });
});

test("the Schatzinsel has a cycle and lines for every step", () => {
  const steps = TREASURE_ISLAND.sequence.steps.length;
  expect(CYCLES.length).toBe(steps);
  expect(TREASURE_ISLAND.lines.length).toBe(steps);
  expect(TREASURE_ISLAND.lead.length).toBe(steps);
  expect(TREASURE_ISLAND.demo.length).toBe(steps);
});
