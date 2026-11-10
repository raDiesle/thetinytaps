import { expect, test } from "bun:test";
import * as THREE from "three";
import { Guide, restPose } from "../../three/guide";
import { seeded, TURTLE_BACK, TURTLE_HALF_WIDTH } from "../../three/props";
import { TREASURE_ISLAND } from ".";
import {
  BIRD_SCALE,
  BIRDS_PER_BEAT,
  CHEST_SAND,
  COIN_STAND,
  DRUM_HAND,
  DRUM_RADIUS,
  DRUMS_CAMERA_BACK,
  drumBirdSpot,
  GATE_BEAM,
  GATE_LIFT,
  PARTY,
} from "./layout";
import { CYCLES, clipLength, goes, S } from "./script";

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

test("the gate rises high enough for Tapsi on Ole's back to ride through without touching it", () => {
  const guide = new Guide();
  guide.apply(restPose(), 0);
  guide.root.updateMatrixWorld(true);
  // From Tapsi's feet to the tips of the ears, standing on Ole's back.
  const top = new THREE.Box3().setFromObject(guide.root).max.y;
  expect(top).toBeGreaterThan(1.4);
  expect(GATE_LIFT, `ears at ${(TURTLE_BACK + top).toFixed(2)} m`).toBeGreaterThan(TURTLE_BACK + top + 0.3);
  // And the stakes' tips stay below the beam.
  expect(GATE_LIFT + 2.3).toBeLessThan(GATE_BEAM - 0.13);
});

test("at the end Tapsi stays on Ole's back, and the chest comes to Tapsi instead", () => {
  // Ole lies side on at the party, so world z runs across its shell (the shell's half width).
  const onShell = Math.hypot(COIN_STAND.x - PARTY.x, COIN_STAND.z - PARTY.z);
  expect(onShell).toBeLessThan(TURTLE_HALF_WIDTH * 0.7);
  // The chest stands in the sand just past the shell's edge, within reach of the paws.
  const chest = Math.hypot(CHEST_SAND.x - PARTY.x, CHEST_SAND.z - PARTY.z);
  expect(chest).toBeGreaterThan(TURTLE_HALF_WIDTH + 0.3);
  expect(Math.hypot(CHEST_SAND.x - COIN_STAND.x, CHEST_SAND.z - COIN_STAND.z)).toBeLessThan(0.9);
});

test("the birds at the drums sit big beside the drums as the camera behind Tapsi sees them, never behind a drum or Tapsi", () => {
  // From high up and far back they sat small behind Tapsi's legs and the drums, and nobody saw what the drumming was for.
  expect(BIRDS_PER_BEAT).toBeGreaterThanOrEqual(2);
  expect(BIRD_SCALE).toBeGreaterThanOrEqual(2.5);
  // How far out to the side a drum's outer edge reaches, seen from the camera (tangent of the angle).
  const drumEdge = (DRUM_HAND.x + DRUM_RADIUS) / (DRUMS_CAMERA_BACK + DRUM_HAND.z);
  const beats = goes(S.drums) * 2;
  for (let n = 0; n < beats * BIRDS_PER_BEAT; n++) {
    const { x, ahead, side } = drumBirdSpot(n, seeded(40 + n));
    expect(Math.sign(x), `bird ${n}`).toBe(side);
    expect(Math.abs(x) / (DRUMS_CAMERA_BACK + ahead), `bird ${n}`).toBeGreaterThan(drumEdge);
    expect(ahead, `bird ${n}`).toBeGreaterThan(DRUM_HAND.z + 1);
  }
});
