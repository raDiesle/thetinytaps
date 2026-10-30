import { describe, expect, test } from "bun:test";
import { VIEW_W } from "./level";
import { easeOut, turn } from "./machineKit";
import {
  BARN,
  buildFarm,
  CAN,
  DOG_END,
  DONKEY,
  DUCKS,
  donkeyHoof,
  FLOOR,
  GOAT_HORNS,
  GOAT_SPOTS,
  KENNEL,
  MOO_MOUTH,
  MOO_RING_GROW,
  MOO_RING_R0,
  POND,
  ROCKS,
  roofY,
  WORLD_W,
} from "./farm";

describe("Bauernhof", () => {
  const farm = buildFarm();

  test("the machine runs 37 to 41 seconds and ends after everything else", () => {
    expect(farm.duration).toBeGreaterThan(37);
    expect(farm.duration).toBeLessThan(41);
    const last = farm.events[farm.events.length - 1];
    expect(last.at).toBe(farm.duration);
    expect(last.done).toBe(true);
  });

  test("one animal sets off the next, in the order of the story", () => {
    const order = [
      farm.tCrow,
      farm.tSplash,
      farm.tCatWake,
      farm.tNose,
      farm.tMoo,
      farm.tGoatWake,
      farm.tGround,
      farm.tButt1,
      farm.tCharge,
      farm.tButt,
      farm.tKennelHit,
      farm.tDog,
      farm.tPond,
      ...Array.from({ length: DUCKS }, (_, i) => farm.tLand(i)),
      farm.tBray,
      farm.tKick,
      farm.tDoors,
      farm.tChoir,
      farm.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("the moo reaches the goat when she wakes, and she hops down her steps onto the grass", () => {
    const ring = MOO_RING_R0 + MOO_RING_GROW * easeOut(farm.mooRing(0, farm.tGoatWake));
    const head = { x: GOAT_SPOTS[0].x + 60, y: GOAT_SPOTS[0].y - 110 };
    expect(ring).toBeCloseTo(Math.hypot(head.x - MOO_MOUTH.x, head.y - MOO_MOUTH.y), 0);
    expect(farm.goatAt(farm.tGoatWake - 0.01).pt).toEqual(GOAT_SPOTS[0]);
    GOAT_SPOTS.slice(0, ROCKS.length).forEach((spot, i) => {
      expect(spot.y).toBe(ROCKS[i].top);
      expect(spot.x).toBeGreaterThan(ROCKS[i].x0);
      expect(spot.x).toBeLessThan(ROCKS[i].x1);
    });
    expect(farm.goatAt(farm.tGround).pt).toEqual(GOAT_SPOTS[GOAT_SPOTS.length - 1]);
    for (let t = farm.tGoatWake; t < farm.duration; t += 0.05) {
      const { pt } = farm.goatAt(t);
      expect(pt.y).toBeLessThanOrEqual(FLOOR);
      expect(pt.x + GOAT_HORNS).toBeLessThanOrEqual(CAN.x - CAN.w / 2 + 0.5);
    }
  });

  test("both butts really reach the milk can, which only tumbles after the second", () => {
    const front = CAN.x - CAN.w / 2;
    for (const t of [farm.tButt1, farm.tButt]) expect(farm.goatAt(t - 0.001).pt.x + GOAT_HORNS).toBeGreaterThan(front - 2);
    const standing = { pt: { x: CAN.x, y: FLOOR - CAN.h / 2 }, angle: 0 };
    expect(farm.canAt(farm.tButt1 + 0.3)).toEqual(standing);
    expect(Math.abs(farm.canRock(farm.tButt1 + 0.1))).toBeGreaterThan(1);
    expect(farm.canRock(farm.tButt)).toBe(0);
  });

  test("the tumbling milk can stays on the grass and just reaches the kennel wall", () => {
    const corners = (t: number) => {
      const { pt, angle } = farm.canAt(t);
      return [-1, 1].flatMap((sx) => [-1, 1].map((sy) => turn({ x: pt.x + (sx * CAN.w) / 2, y: pt.y + (sy * CAN.h) / 2 }, pt, (angle * Math.PI) / 180)));
    };
    for (let t = farm.tButt; t <= farm.duration; t += 0.01) {
      for (const c of corners(t)) {
        expect(c.y).toBeLessThanOrEqual(FLOOR + 0.5);
        expect(c.x).toBeLessThanOrEqual(KENNEL.x0 + 0.5);
      }
    }
    const right = Math.max(...corners(farm.tKennelHit).map((c) => c.x));
    expect(right).toBeGreaterThan(KENNEL.x0 - 6);
  });

  test("the ducks land on the donkey's back, and his kick throws them onto the barn roof", () => {
    for (let i = 0; i < DUCKS; i++) {
      const sitting = farm.duckAt(i, farm.tLand(i) + 0.01).pt;
      expect(Math.abs(sitting.x - DONKEY.x)).toBeLessThan(DONKEY.back.rx);
      expect(sitting.y).toBeLessThan(FLOOR + DONKEY.back.y);
      const roof = farm.duckAt(i, farm.tOnRoof(i)).pt;
      expect(roof.x).toBeGreaterThan(BARN.x0);
      expect(roof.x).toBeLessThan(BARN.x1);
      expect(roof.y).toBeCloseTo(roofY(roof.x));
      expect(farm.tFlyUp(i)).toBeGreaterThanOrEqual(farm.tKick);
      for (let t = farm.tTakeOff(i); t < farm.tOnRoof(i); t += 0.05) {
        const { pt } = farm.duckAt(i, t);
        expect(pt.x).toBeGreaterThan(POND.x - POND.rx);
        expect(pt.x).toBeLessThan(WORLD_W);
        expect(pt.y).toBeGreaterThan(20);
      }
    }
  });

  test("the donkey's hind hooves stand on the grass until the kick and then hit the barn wall", () => {
    const hoof = (t: number) => {
      const d = farm.donkeyAt(t);
      return donkeyHoof(d.tilt, d.swing);
    };
    const still = hoof(farm.tKick - 0.6);
    expect(still.x).toBeCloseTo(DONKEY.x + DONKEY.hip.x);
    expect(still.y).toBeCloseTo(FLOOR);
    for (let t = 0; t < farm.duration; t += 0.02) expect(hoof(t).x).toBeLessThanOrEqual(BARN.x0 + 8);
    expect(hoof(farm.tKick).x).toBeGreaterThan(BARN.x0 - 2);
  });

  test("the dog ends in front of the donkey's nose, and the barn and camera stay in the farmyard", () => {
    expect(farm.dogAt(farm.duration).x).toBe(DOG_END);
    expect(DOG_END + 130).toBeLessThan(DONKEY.x - 220);
    expect(BARN.x1 + 40).toBeLessThan(WORLD_W);
    expect(farm.cameraTarget(-1)).toBe(0);
    for (let t = 0; t <= farm.duration; t += 0.1) {
      const x = farm.cameraTarget(t);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(WORLD_W - VIEW_W);
    }
    // The end shows the dog, the donkey and the whole barn at once.
    const end = farm.cameraTarget(farm.duration);
    expect(end).toBeLessThan(DOG_END - 70);
    expect(end + VIEW_W).toBeGreaterThan(BARN.x1 + 40);
  });
});
