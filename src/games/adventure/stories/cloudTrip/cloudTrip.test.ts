import { expect, test } from "bun:test";
import { CLOUD_TRIP } from ".";
import { ARC_PERIOD } from "../../three/clips";
import { RAINBOW_COLORS } from "./layout";
import { CYCLES, clipLength, S } from "./script";

test("every movement of the Wolkenreise ends after whole goes, so each go has its target", () => {
  CYCLES.forEach((cycle, step) => {
    if (!cycle) return;
    const goes = (clipLength(step) - cycle.from) / cycle.seconds;
    expect(Math.abs(goes - Math.round(goes)), `step ${step}: ${goes} goes`).toBeLessThan(0.01);
    expect(Math.round(goes), `step ${step}`).toBeGreaterThanOrEqual(2);
  });
});

test("the Wolkenreise has a cycle and lines for every step", () => {
  const steps = CLOUD_TRIP.sequence.steps.length;
  expect(CYCLES.length).toBe(steps);
  expect(CLOUD_TRIP.lines.length).toBe(steps);
  expect(CLOUD_TRIP.lead.length).toBe(steps);
  expect(CLOUD_TRIP.demo.length).toBe(steps);
  expect(CLOUD_TRIP.praise.length).toBe(steps);
});

test("the rainbow has a band for every go of the arms", () => {
  expect(Math.round(clipLength(S.rainbow) / ARC_PERIOD)).toBe(RAINBOW_COLORS.length);
});
