import { describe, expect, test } from "bun:test";
import { VIEW_W } from "./level";
import { easeOut, turn } from "./machineKit";
import {
  BARN,
  buildFarm,
  CAN,
  CHICKS,
  DOG_END,
  DONKEY,
  DUCKS,
  donkeyHoof,
  FEATHERS,
  FLOOR,
  featherTip,
  GOAT_HORNS,
  GOAT_SPOTS,
  GOOSE,
  GRAINS,
  GUARD_SPOT,
  HEN,
  HEN_REACH,
  HORN_BULB,
  henHead,
  KENNEL,
  LATCH,
  MOO_MOUTH,
  MOO_RING_GROW,
  MOO_RING_R0,
  NEST,
  PERCH,
  POND,
  ROCKS,
  roofY,
  SACK,
  SACK_PIVOT,
  TRACTOR,
  TRACTOR_DRIVE,
  TURKEY,
  WORLD_W,
} from "./farm";

describe("Bauernhof", () => {
  const farm = buildFarm();

  test("the machine runs 56 to 64 seconds and ends after everything else", () => {
    expect(farm.duration).toBeGreaterThan(56);
    expect(farm.duration).toBeLessThan(64);
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
      farm.tTurkeyBark,
      farm.tGobble,
      farm.tTip,
      farm.tSackDown,
      farm.tHenWake,
      ...GRAINS.map((_, i) => farm.tPeck(i)),
      farm.tHenHop,
      farm.tOnGuard,
      farm.tHorn,
      farm.tEngine,
      farm.tDrive,
      farm.tDriveEnd,
      farm.tHorn2,
      farm.tGooseWake,
      farm.tGooseSplash,
      farm.tGooseHonk,
      ...Array.from({ length: DUCKS }, (_, i) => farm.tTakeOff(i)),
      ...Array.from({ length: DUCKS }, (_, i) => farm.tLand(i)),
      farm.tBray,
      farm.tKick,
      farm.tSwallowOut,
      farm.tSwallowLand,
      farm.tTurned,
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

  test("the dog stops barking right in front of the turkey, short of its head", () => {
    const snout = farm.dogAt(farm.tTurkeyBark).x + 112;
    const turkeyBeak = TURKEY.x - 114;
    expect(snout).toBeLessThan(turkeyBeak);
    expect(turkeyBeak - snout).toBeLessThan(40);
    expect(farm.dogAt(farm.tTurkeyBark + 3).x).toBe(farm.dogAt(farm.tTurkeyBark).x);
  });

  test("the turkey's last tail feather reaches the sack just as it starts to tip, and never goes into it", () => {
    const last = FEATHERS - 1;
    const fan = (t: number) => farm.turkeyAt(t).fan;
    expect(featherTip(last, fan(farm.tTip)).x).toBeCloseTo(SACK.x0, 0);
    expect(farm.sackTilt(farm.tTip)).toBe(0);
    expect(farm.turkeyAt(farm.tTip).lift).toBeCloseTo(0);
    // The tip touches the sack's side, not its top.
    expect(featherTip(last, fan(farm.tTip)).y).toBeGreaterThan(FLOOR - SACK.h);
    for (let t = farm.tGobble; t < farm.duration; t += 0.01) {
      const tip = featherTip(last, fan(t));
      // The sack's left side at the tip's height, turned with the sack.
      const side = turn({ x: SACK.x0, y: tip.y }, SACK_PIVOT, (farm.sackTilt(t) * Math.PI) / 180);
      if (tip.y > FLOOR - SACK.h) expect(tip.x).toBeLessThanOrEqual(side.x + 1.5);
    }
    expect(farm.sackTilt(farm.tSackDown)).toBe(90);
  });

  test("the first grain lands on the hen's head, the others in a row she pecks up on her way to the tractor", () => {
    const head = henHead(HEN.x);
    const first = farm.grainAt(0, farm.tHenWake - 0.001);
    expect(first).not.toBeNull();
    expect(Math.hypot((first?.x ?? 0) - head.x, (first?.y ?? 0) - head.y)).toBeLessThan(30);
    expect(farm.henAt(farm.tHenWake - 0.01).awake).toBe(false);
    GRAINS.forEach((g, i) => {
      // The grain lies on the grass before she pecks it, her beak reaches it, and it is gone afterwards.
      expect(farm.grainAt(i, farm.tPeck(i) - 0.05)).toEqual({ x: g, y: FLOOR - 6 });
      expect(farm.henAt(farm.tPeck(i)).pt.x + HEN_REACH).toBeCloseTo(g, 0);
      expect(farm.henAt(farm.tPeck(i)).peck).toBeGreaterThan(0.8);
      expect(farm.grainAt(i, farm.tPeck(i) + 0.01)).toBeNull();
    });
    // The grains spill out of the sack's mouth, which lies to the right of the sack once it is down, short of the nest.
    expect(SACK_PIVOT.x + SACK.h).toBeLessThan(HEN.x - 52 - 30 * (CHICKS - 1) - 20);
    for (let j = 0; j < CHICKS; j++) expect(farm.chickAt(j, farm.duration).x).toBeLessThan(TRACTOR.x - TRACTOR.wheel);
  });

  test("the hen flutters onto the mudguard, her beak reaches the horn's bulb, and she rides along to the pond", () => {
    const bulbLeft = (t: number) => farm.tractorAt(t).x + HORN_BULB.dx - HORN_BULB.r;
    for (const horn of [farm.tHorn, farm.tHorn2]) {
      const hen = farm.henAt(horn);
      expect(hen.peck).toBeGreaterThan(0.8);
      expect(hen.pt.x + HEN_REACH).toBeGreaterThan(bulbLeft(horn));
      expect(hen.pt.x + HEN_REACH).toBeLessThan(bulbLeft(horn) + 6);
    }
    expect(farm.henAt(farm.tOnGuard).pt.y).toBeCloseTo(TRACTOR.guard, 0);
    expect(farm.tractorAt(farm.tDrive).x).toBe(TRACTOR.x);
    expect(farm.tractorAt(farm.tDriveEnd).x).toBe(TRACTOR.x + TRACTOR_DRIVE);
    expect(farm.henAt(farm.tDriveEnd).pt.x).toBe(TRACTOR.x + TRACTOR_DRIVE + GUARD_SPOT.dx);
    // The farmer is woken by the honk and starts the engine; the first puff comes with it.
    expect(farm.farmerAwake(farm.tHorn)).toBe(0);
    expect(farm.farmerAwake(farm.tEngine)).toBe(1);
    expect(farm.puffs[0]).toBeGreaterThan(farm.tEngine);
    expect(farm.puffs[farm.puffs.length - 1]).toBeLessThan(farm.tGooseWake);
  });

  test("the tractor stops short of the goose, which jumps into the pond and stretches towards the ducks", () => {
    expect(TRACTOR.x + TRACTOR_DRIVE + TRACTOR.front).toBeLessThan(GOOSE.x - 74 - 6);
    expect(GOOSE.x + GOOSE.half).toBeLessThan(POND.x - POND.rx + 20);
    expect(GOOSE.water - GOOSE.half).toBeGreaterThan(POND.x - POND.rx - 5);
    expect(farm.gooseAt(farm.tGooseWake - 0.01).awake).toBe(false);
    expect(farm.gooseAt(farm.tGooseSplash).pt).toEqual({ x: GOOSE.water, y: POND.y });
    expect(farm.gooseAt(farm.tGooseHonk).neck).toBeGreaterThan(0.99);
    // Stretched, its beak comes up to the first duck's tail but not into it.
    const beak = GOOSE.water + 66 + 36;
    const duckTail = farm.duckAt(0, farm.tGooseHonk).pt.x - 48 * 1.4;
    expect(beak).toBeGreaterThan(duckTail - 50);
    expect(beak).toBeLessThan(duckTail + 10);
  });

  test("the swallow flies from her nest to the turn button, which only turns under her, and the doors open after it", () => {
    expect(farm.swallowAt(farm.tSwallowOut - 0.01).pt).toEqual(NEST);
    const landed = farm.swallowAt(farm.tSwallowLand).pt;
    expect(Math.hypot(landed.x - (LATCH.x + LATCH.half - 12), landed.y - (LATCH.y - 8))).toBeLessThan(1);
    expect(farm.latchTurn(farm.tSwallowLand)).toBe(0);
    expect(farm.latchTurn(farm.tTurned)).toBe(90);
    expect(farm.doorsOpen(farm.tTurned)).toBe(0);
    expect(farm.doorsOpen(farm.tDoors + 1)).toBe(1);
    expect(farm.swallowAt(farm.duration).pt).toEqual(PERCH);
    for (let t = farm.tSwallowOut; t < farm.duration; t += 0.05) {
      const { pt } = farm.swallowAt(t);
      expect(pt.x).toBeGreaterThan(DONKEY.x - 300);
      expect(pt.x).toBeLessThan(WORLD_W - 40);
      expect(pt.y).toBeGreaterThan(BARN.peak - 40);
      expect(pt.y).toBeLessThan(FLOOR - 120);
    }
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
