import { describe, expect, test } from "bun:test";
import {
  ACORN_R,
  acornAt,
  BEES,
  beeAt,
  CLOUD,
  FLOOR,
  FLOWERS,
  gustAt,
  HIVE,
  hatAt,
  KINDS,
  KITE,
  kiteAt,
  kiteTailTip,
  layOutRow,
  leavesOf,
  MEADOW_AFTER_TREE,
  PART2,
  PART2_STEPS,
  PUFFBALL,
  part2Focus,
  pickAnimals,
  plannedSeconds,
  SCARECROW,
  SEEDS_EACH,
  STRAWS,
  seedAt,
  shellAt,
  sporesAt,
  strawAt,
  TORTOISE,
  TREE_ROOM,
} from "./sneeze";
import type { Pt } from "./path";

/** A repeatable stand-in for Math.random, so every test run sees the same rows. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

const near = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
/** Every moment of the second part, in the order they happen. */
const MOMENTS = [
  PART2.chatter,
  PART2.slip,
  ...PART2.bounces,
  PART2.puff,
  PART2.sniff,
  PART2.ha,
  PART2.ha2,
  PART2.hide,
  PART2.tortoise,
  PART2.land,
  PART2.bees,
  ...PART2.flowers,
  PART2.wake,
  PART2.cloudHa,
  PART2.cloudHa2,
  PART2.cloud,
  PART2.lift,
  PART2.high,
  PART2.tickle,
  PART2.crowHa,
  PART2.crowHa2,
  PART2.scarecrow,
  PART2.hat,
  PART2.laugh,
];
/** The second part sampled every twentieth of a second, up to the end of its laughing. */
const TIMES = Array.from({ length: Math.ceil((PART2.laugh + 3) * 20) }, (_, i) => i / 20);

describe("Hatschi-Kette", () => {
  const rows = Array.from({ length: 40 }, (_, i) => pickAnimals(seeded(i + 1)));

  test("the row starts with the mouse, ends with the cow and the elephant, and grows from small to big", () => {
    for (const ids of rows) {
      expect(ids[0]).toBe("mouse");
      expect(ids.slice(-2)).toEqual(["cow", "elephant"]);
      expect(new Set(ids).size).toBe(ids.length);
      ids.slice(1).forEach((id, i) => {
        expect(KINDS[id].height).toBeGreaterThan(KINDS[ids[i]].height);
      });
    }
  });

  test("the animals don't overlap, and the tree stands after the elephant", () => {
    for (const ids of rows) {
      const { seats, tree, worldW } = layOutRow(ids);
      seats.slice(1).forEach((seat, i) => {
        const before = seats[i];
        expect(before.x + (before.kind.width * before.s) / 2).toBeLessThan(seat.x - (seat.kind.width * seat.s) / 2);
      });
      const elephant = seats[seats.length - 1];
      expect(tree.crown.x - tree.r).toBeGreaterThan(elephant.x + (elephant.kind.width * elephant.s) / 2);
      expect(tree.crown.x + tree.r).toBeLessThan(tree.x + TREE_ROOM);
      expect(tree.x + MEADOW_AFTER_TREE).toBe(worldW);
      expect(tree.crown.y - tree.r).toBeGreaterThan(0);
    }
  });

  test("a round without joining in takes about a minute", () => {
    for (const ids of rows) {
      const seconds = plannedSeconds(layOutRow(ids));
      expect(seconds).toBeGreaterThan(56);
      expect(seconds).toBeLessThan(64);
    }
  });

  test("every leaf lands in the grass", () => {
    const { tree, worldW } = layOutRow(rows[0]);
    for (const leaf of leavesOf(tree)) {
      expect(leaf.to.y).toBeGreaterThan(FLOOR);
      expect(leaf.to.x).toBeGreaterThan(0);
      expect(leaf.to.x).toBeLessThan(worldW);
    }
  });

  test("past the tree the moments come one after the other, and a tap's steps go forward", () => {
    MOMENTS.slice(1).forEach((at, i) => {
      expect(at).toBeGreaterThan(MOMENTS[i]);
    });
    PART2_STEPS.slice(1).forEach((at, i) => {
      expect(at).toBeGreaterThan(PART2_STEPS[i]);
    });
    for (const step of PART2_STEPS) expect(MOMENTS).toContain(step);
  });

  test("the acorn drops from the squirrel, bounces and rolls right into the puffball", () => {
    expect(acornAt(PART2.slip - 0.01).y).toBeLessThan(400);
    for (const at of PART2.bounces) expect(acornAt(at).y).toBeCloseTo(FLOOR - ACORN_R, 0);
    const bump = acornAt(PART2.puff);
    expect(near(bump, PUFFBALL) - PUFFBALL.r - ACORN_R).toBeLessThan(8);
    for (const u of TIMES) expect(near(acornAt(u), PUFFBALL)).toBeGreaterThan(PUFFBALL.r);
  });

  test("the spores drift from the puffball to the tortoise's nose", () => {
    expect(sporesAt(PART2.puff - 0.01)).toBeNull();
    const start = sporesAt(PART2.puff);
    expect(start && Math.abs(start.x - PUFFBALL.x)).toBeLessThan(5);
    const end = sporesAt(PART2.sniff);
    expect(end && near(end, { x: TORTOISE.x + TORTOISE.nose.dx, y: TORTOISE.nose.y })).toBeLessThan(5);
  });

  test("the tortoise's shell hops right against the leg of the beehive's stool", () => {
    const landed = shellAt(PART2.land);
    expect(landed.lift).toBeCloseTo(0, 5);
    const leg = HIVE.x - HIVE.legs;
    expect(leg - (landed.x + TORTOISE.rx)).toBeGreaterThan(0);
    expect(leg - (landed.x + TORTOISE.rx)).toBeLessThan(20);
    expect(shellAt(PART2.land + 5).x).toBe(landed.x);
  });

  test("the first bee flies through each dandelion clock as it loses its seeds, and every bee goes home", () => {
    PART2.flowers.forEach((at, i) => {
      const bee = beeAt(0, at);
      expect(bee && near(bee, { x: FLOWERS[i].x, y: FLOOR - FLOWERS[i].h })).toBeLessThan(2);
    });
    for (let j = 0; j < BEES; j++) {
      expect(beeAt(j, PART2.bees - 0.01)).toBeNull();
      expect(beeAt(j, PART2.wake)).toBeNull();
    }
  });

  test("the seeds float up under the cloud before it wakes, and its sneeze blows them away", () => {
    for (let i = 0; i < FLOWERS.length; i++)
      for (let n = 0; n < SEEDS_EACH; n++) {
        expect(seedAt(i, n, PART2.flowers[i] - 0.01)).toBeNull();
        const under = seedAt(i, n, PART2.wake);
        expect(under && Math.abs(under.x - CLOUD.x)).toBeLessThan(CLOUD.rx);
        expect(under && under.y - CLOUD.y).toBeGreaterThan(CLOUD.ry);
        expect(under && under.y - CLOUD.y).toBeLessThan(CLOUD.ry + 50);
        expect(seedAt(i, n, PART2.cloud + 2)?.fade ?? 0).toBeLessThanOrEqual(0);
      }
  });

  test("the cloud's gust reaches the kite as it lifts, and the kite's tail tickles the scarecrow's nose", () => {
    const gust = gustAt(PART2.lift);
    expect(gust && near(gust, { x: KITE.x, y: FLOOR - 40 })).toBeLessThan(5);
    expect(kiteAt(PART2.lift - 0.01).flat).toBe(1);
    expect(kiteAt(PART2.high).y).toBeLessThan(200);
    for (const u of [PART2.tickle, PART2.crowHa, PART2.crowHa2, PART2.scarecrow - 0.01])
      expect(near(kiteTailTip(u), { x: SCARECROW.x, y: SCARECROW.nose })).toBeLessThan(12);
    expect(kiteAt(PART2.scarecrow + 3).y).toBeLessThan(200);
  });

  test("the scarecrow's hat flies off and lands back on his head, and the straw lands in the grass", () => {
    const on = hatAt(0);
    expect(on.y).toBeLessThan(SCARECROW.head);
    expect(hatAt(PART2.scarecrow + 0.8).y).toBeLessThan(on.y - 200);
    const landed = hatAt(PART2.hat);
    expect(near(landed, on)).toBeLessThan(10);
    expect(landed.turn).not.toBe(0);
    for (let n = 0; n < STRAWS; n++) {
      expect(strawAt(n, PART2.scarecrow - 0.01)).toBeNull();
      const lying = strawAt(n, PART2.laugh);
      expect(lying?.y).toBeGreaterThan(FLOOR);
    }
  });

  test("everything past the tree stays in the meadow and in the sky the camera sees", () => {
    const { tree } = layOutRow(rows[0]);
    const inWorld = (p: Pt | null) => {
      if (!p) return;
      expect(tree.x + p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(MEADOW_AFTER_TREE);
      // Zoomed out to 0.8 the camera sees from 225 above the picture's top down to the ground.
      expect(p.y).toBeGreaterThan(-225);
      expect(p.y).toBeLessThan(FLOOR + 100);
    };
    for (const u of TIMES) {
      for (const p of [acornAt(u), sporesAt(u), gustAt(u), kiteAt(u), kiteTailTip(u), hatAt(u)]) inWorld(p);
      for (let j = 0; j < BEES; j++) inWorld(beeAt(j, u));
      for (let i = 0; i < FLOWERS.length; i++) for (let n = 0; n < SEEDS_EACH; n++) inWorld(seedAt(i, n, u));
      for (let n = 0; n < STRAWS; n++) inWorld(strawAt(n, u));
    }
  });

  test("the camera looks at each thing past the tree while it acts", () => {
    // The camera's view at the end is 2000 wide; it starts on the tree from the row.
    const view = (u: number) => {
      const middle = part2Focus(u) ?? TREE_ROOM - 1000;
      return [middle - 1000, Math.min(MEADOW_AFTER_TREE, middle + 1000)];
    };
    const seen = (u: number, x: number) => {
      const [left, right] = view(u);
      expect({ u, x, seen: x > left + 40 && x < right - 40 }).toEqual({ u, x, seen: true });
    };
    seen(PART2.slip, acornAt(PART2.slip).x);
    seen(PART2.puff, PUFFBALL.x);
    seen(PART2.sniff, TORTOISE.x);
    seen(PART2.land, shellAt(PART2.land).x);
    seen(PART2.bees, HIVE.x);
    for (const [i, at] of PART2.flowers.entries()) seen(at, FLOWERS[i].x);
    seen(PART2.wake, CLOUD.x);
    seen(PART2.lift, KITE.x);
    seen(PART2.scarecrow, SCARECROW.x);
    seen(PART2.hat, SCARECROW.x);
  });
});
