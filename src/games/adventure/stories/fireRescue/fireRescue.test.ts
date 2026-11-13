import { expect, test } from "bun:test";
import * as THREE from "three";
import { Guide, restPose } from "../../three/guide";
import { FIRE_RESCUE } from ".";
import { GATE_OPEN, GATE_Z, HOVER, KITTEN_COLORS, ROBO_TOP, STREET_END } from "./layout";
import { CYCLES, clipLength, DUCK_END, goes, lineZ, S } from "./script";

test("every movement of Fire Rescue ends after whole goes, so each go has its target", () => {
  CYCLES.forEach((cycle, step) => {
    if (!cycle) return;
    const goes = (clipLength(step) - cycle.from) / cycle.seconds;
    expect(Math.abs(goes - Math.round(goes)), `step ${step}: ${goes} goes`).toBeLessThan(0.01);
    expect(Math.round(goes), `step ${step}`).toBeGreaterThanOrEqual(2);
  });
});

test("Fire Rescue has a cycle and lines for every step, each with its own turn", () => {
  const steps = FIRE_RESCUE.sequence.steps.length;
  expect(CYCLES.length).toBe(steps);
  expect(FIRE_RESCUE.lines.length).toBe(steps);
  expect(FIRE_RESCUE.lead.length).toBe(steps);
  expect(FIRE_RESCUE.demo.length).toBe(steps);
  expect(FIRE_RESCUE.praise.length).toBe(steps);
  // The default turn is German: an English story says its own.
  for (const line of FIRE_RESCUE.lines) expect(line.turn, line.instruction).toBeTruthy();
});

test("a kitten jumps into the arms at every go of the catch", () => {
  expect(goes(S.catch)).toBe(KITTEN_COLORS.length);
});

test("the washing lines hang across the street, behind the gate and before the square", () => {
  for (let n = 0; n < goes(S.duck); n++) {
    expect(lineZ(n)).toBeLessThan(GATE_Z - 0.5);
    expect(lineZ(n)).toBeGreaterThan(STREET_END);
  }
  expect(DUCK_END).toBeGreaterThan(STREET_END - 4);
});

test("the gate rolls up high enough for Tapsi on Robo to hover through without touching it", () => {
  const guide = new Guide();
  guide.apply(restPose(), 0);
  guide.root.updateMatrixWorld(true);
  const top = new THREE.Box3().setFromObject(guide.root).max.y;
  expect(top).toBeGreaterThan(1.4);
  expect(GATE_OPEN, `ears at ${(HOVER + ROBO_TOP + top).toFixed(2)} m`).toBeGreaterThan(HOVER + ROBO_TOP + top + 0.3);
});
