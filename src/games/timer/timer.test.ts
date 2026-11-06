import { describe, expect, test } from "bun:test";
import { nextPicture, PICTURES } from "./content";
import { APPLE_FLOOR, APPLE_LANDED, appleRadius, BASKET, CROWN } from "./apples";
import { EATEN, LEAF, LEAF_FLOOR } from "./caterpillar";
import { BOAT, BUCKET, BUCKET_FAMILY, bucketEdges, GOAL_Y, POT, SPOUT, WATER } from "./bucket";
import { CAKE, CAKE_FAMILY, CAKE_FLOOR, DOUGH_START, OVEN, OVEN_WINDOW, TABLE } from "./cake";
import { DISC, DOTS, dotAt } from "./disc";
import { FLOWER_FAMILY, FLOWER_FLOOR, SPROUT, STAKE, STALK } from "./flower";
import { PIZZA, PIZZA_FAMILY, PIZZA_FLOOR, slice, SLICES, SLICE_SECONDS } from "./pizza";
import { MOON, ridgeAt, SKY_CUT, STARS, SUN, SUNSET_FAMILY, SUNSET_FLOOR } from "./sunset";
import { applePlaces, haltMs, ladybugLaps, MAX_APPLES, MAX_DOTS, MAX_STOPS, pieceCount, pieceMoments, soonMs, trainSteps } from "./pieces";
import { ANT_FAMILY, ANTS, CANDLE, COOKIE, GLASS, GROUND, HILL, SAND_FLOOR, STAGE_H, TRAIN } from "./scenes";
import { SWAP_FAMILIES, SWAP_FLOOR, SWAP_GLASS, TOY } from "./swap";
import { DEFAULT_TIMER_SETTINGS, TIMER_MINUTES } from "./settings";

describe("Timer", () => {
  test("every picture has its own id, an emoji and a German name, and „Weiter“ goes round them all", () => {
    expect(new Set(PICTURES.map((p) => p.id)).size).toBe(PICTURES.length);
    for (const p of PICTURES) {
      expect(p.emoji).not.toBe("");
      expect(p.name.de.trim()).not.toBe("");
    }
    const seen = new Set<string>();
    let id = PICTURES[0].id;
    for (let i = 0; i < PICTURES.length; i++) {
      seen.add(id);
      id = nextPicture(id);
    }
    expect(seen.size).toBe(PICTURES.length);
    expect(id).toBe(PICTURES[0].id);
  });

  test("the minutes are 1 to 10, rising, and the default is one of them", () => {
    expect(TIMER_MINUTES[0]).toBe(1);
    expect(TIMER_MINUTES.at(-1)).toBe(10);
    expect([...TIMER_MINUTES].sort((a, b) => a - b)).toEqual([...TIMER_MINUTES]);
    expect(TIMER_MINUTES).toContain(DEFAULT_TIMER_SETTINGS.minutes as (typeof TIMER_MINUTES)[number]);
  });

  test("what matters stays where every screen shows it (x 200–1400, y 80–820)", () => {
    expect(TRAIN.x).toBeGreaterThanOrEqual(200);
    expect(TRAIN.stop).toBeLessThanOrEqual(1400);
    // The bear family at the station was cut off on a tablet when it stood right of x 1400 (grown-up 190 wide).
    expect(TRAIN.family + 190).toBeLessThanOrEqual(1400);
    expect(TRAIN.family - 110).toBeGreaterThan(TRAIN.stop);
    expect(GLASS.cx - GLASS.w / 2).toBeGreaterThanOrEqual(200);
    // With a margin: at 80 and 820 the hourglass's plates touched the screen's edges on a phone on its side.
    expect(GLASS.top - 44).toBeGreaterThanOrEqual(130);
    expect(SAND_FLOOR + 10).toBeLessThanOrEqual(790);
    expect(CANDLE.base).toBeLessThanOrEqual(820);
    expect(CANDLE.top).toBeGreaterThanOrEqual(80 + 140);
    expect(STAGE_H).toBe(900);
  });

  test("the CSS burns the candle down to its stub", async () => {
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    const height = CANDLE.base - CANDLE.top;
    const left = (CANDLE.stub / height).toFixed(4);
    const burnt = `${(((height - CANDLE.stub) / height) * 100).toFixed(2)}%`;
    expect(css).toContain(`scaleY(${left})`);
    expect(css).toContain(`--tm-burnt: ${burnt}`);
  });

  test("the new pictures keep what matters where every screen shows it too", () => {
    expect(CROWN.cx - CROWN.rx).toBeGreaterThanOrEqual(200);
    expect(CROWN.cy - CROWN.ry).toBeGreaterThanOrEqual(80);
    expect(BASKET.cx + BASKET.w / 2).toBeLessThanOrEqual(1400);
    expect(APPLE_FLOOR).toBeLessThanOrEqual(820);
    expect(LEAF.x + LEAF.w).toBeLessThanOrEqual(1200);
    // The leaf is eaten up to its stalk, never past it into the branch.
    expect(EATEN).toBeLessThan(LEAF.w);
    expect(LEAF_FLOOR).toBeLessThanOrEqual(820);
    expect(DISC.cx - DISC.face).toBeGreaterThanOrEqual(200);
    expect(DISC.cy - DISC.face).toBeGreaterThanOrEqual(80);
    expect(DISC.cy + DISC.face).toBeLessThanOrEqual(820);
    // The fox family stands right of the face (its child from x 1090).
    expect(DISC.cx + DISC.face).toBeLessThan(1090);
  });

  test("piece by piece: one a minute, at least one, never more than fit (H-45)", () => {
    expect(pieceCount(60_000, MAX_APPLES)).toBe(1);
    expect(pieceCount(5 * 60_000, MAX_APPLES)).toBe(5);
    expect(pieceCount(20_000, MAX_APPLES)).toBe(1);
    expect(pieceCount(3 * 3600_000, MAX_APPLES)).toBe(MAX_APPLES);
    expect(pieceCount(30 * 60_000, MAX_STOPS)).toBe(MAX_STOPS);
    expect(pieceMoments(300_000, 5)).toEqual([60_000, 120_000, 180_000, 240_000]);
    expect(pieceMoments(300_000, 1)).toEqual([]);
  });

  test("the train halts at every stop and reaches the station as the time is up", () => {
    const total = 5 * 60_000;
    const steps = trainSteps(total, 5, haltMs(total, 5));
    expect(steps[0]).toEqual({ at: 0, part: 0 });
    expect(steps.at(-1)).toEqual({ at: 1, part: 1 });
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].at).toBeGreaterThan(steps[i - 1].at);
      expect(steps[i].part).toBeGreaterThanOrEqual(steps[i - 1].part);
    }
    // Four halts on the way, each standing still for a while.
    expect(steps.filter((s, i) => i > 0 && s.part === steps[i - 1].part)).toHaveLength(4);
  });

  test("every apple hangs inside the crown, apart from the others", () => {
    for (const count of [1, 5, 12, 20, MAX_APPLES]) {
      const r = appleRadius(count);
      const places = applePlaces(count, CROWN.rx - r - 24, CROWN.ry - r - 24);
      expect(places).toHaveLength(count);
      for (const p of places) expect((p.x / (CROWN.rx - r)) ** 2 + (p.y / (CROWN.ry - r)) ** 2).toBeLessThanOrEqual(1);
      for (const a of places) for (const b of places) if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(2 * r);
      // They fall from left to right.
      expect(places.map((p) => p.x)).toEqual([...places.map((p) => p.x)].sort((a, b) => a - b));
    }
  });

  test("the CSS shrinks a landing apple as much as the basket expects", async () => {
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    expect(css).toContain(`translateY(var(--tm-dy)) scale(${APPLE_LANDED})`);
  });

  test("the Ameisenstraße stays on every screen, its ants walk from under the cookie into the hill, one step a second (H-68)", async () => {
    expect(COOKIE.cx - COOKIE.w / 2).toBeGreaterThanOrEqual(190);
    // The fox family right of the hill, the grown-up within x 1400 (190 wide).
    expect(ANT_FAMILY + 190).toBeLessThanOrEqual(1400);
    expect(GROUND + 40).toBeLessThanOrEqual(820);
    expect(GROUND - HILL.h).toBeGreaterThanOrEqual(80 + 140);
    // The road starts under the cookie and ends at the hill's foot while it is still small, so ants come and go hidden.
    const end = ANTS.from + ANTS.n * ANTS.step;
    expect(ANTS.from).toBeLessThan(COOKIE.cx + COOKIE.w / 2 - ANTS.w);
    expect(end).toBeGreaterThanOrEqual(HILL.cx - (HILL.w / 2) * HILL.start - ANTS.w / 2);
    expect(ANTS.step).toBeGreaterThan(ANTS.w);
    // One keyframe per step, and the march lasts as many seconds as there are ants, one started each second.
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    for (let k = 0; k <= ANTS.n; k++) expect(css).toContain(`translateX(calc(var(--tm-ant-step) * ${k}))`);
    expect(css).not.toContain(`translateX(calc(var(--tm-ant-step) * ${ANTS.n + 1}))`);
    expect(css).toContain(`animation: tm-march ${ANTS.n}s ease-in-out infinite`);
  });

  test("Abwechseln keeps both families, the hourglass and the toy on every screen, the toy never under the hourglass (H-52)", () => {
    expect(SWAP_FAMILIES.fox).toBeGreaterThanOrEqual(200);
    expect(SWAP_FAMILIES.bear + 190).toBeLessThanOrEqual(1400);
    const glassLeft = SWAP_GLASS.cx - SWAP_GLASS.w / 2;
    const glassRight = SWAP_GLASS.cx + SWAP_GLASS.w / 2;
    expect(TOY.fox + TOY.w).toBeLessThanOrEqual(glassLeft + 10);
    expect(TOY.bear).toBeGreaterThanOrEqual(glassRight - 10);
    // The fox child stands right of its grown-up (120 wide), the bear child left of its grown-up.
    expect(TOY.fox).toBeGreaterThanOrEqual(SWAP_FAMILIES.fox + 190 - 10 + 120 - 10);
    expect(TOY.bear + TOY.w).toBeLessThanOrEqual(SWAP_FAMILIES.bear - 120 + 10 + 10);
    expect(SWAP_GLASS.top).toBeGreaterThanOrEqual(80 + 140);
    expect(SWAP_FLOOR + 10).toBeLessThanOrEqual(820);
  });

  // The book's paper margin and the ⚙️ note lie over the stage's right edge (x 1400 at 4:3): a family standing to 1380
  // was cut off there, so the new pictures keep their families' right edge within 1340.
  const RIGHT = 1340;

  test("Sonnenuntergang: the sun and the moon move behind the ridge, the cut of their boxes always hidden below it (H-54)", () => {
    for (const { cx, r } of [SUN, MOON]) for (let x = cx - r; x <= cx + r; x += 5) expect(ridgeAt(x)).toBeLessThan(SKY_CUT);
    // The sun is wholly gone at the end, the moon peeks over the hill from the start and stands high at the end.
    expect(SUN.set).toBeGreaterThanOrEqual(SKY_CUT);
    expect(SUN.top).toBeGreaterThanOrEqual(80);
    expect(MOON.start).toBeLessThan(ridgeAt(MOON.cx) - 20);
    expect(MOON.top).toBeGreaterThanOrEqual(80);
    // The stars come out in order through the second half, within the sky, never where the moon ends up.
    expect(STARS.map((s) => s.at)).toEqual([...STARS.map((s) => s.at)].sort((a, b) => a - b));
    for (const s of STARS) {
      expect(s.at).toBeGreaterThanOrEqual(0.4);
      expect(s.at).toBeLessThan(1);
      expect(s.y).toBeLessThan(ridgeAt(s.x) - 30);
      expect(Math.hypot(s.x - MOON.cx, s.y - (MOON.top + MOON.r))).toBeGreaterThan(MOON.r + 30);
    }
    expect(SUNSET_FAMILY - 110).toBeGreaterThan(MOON.cx + MOON.r);
    expect(SUNSET_FAMILY + 190).toBeLessThanOrEqual(RIGHT);
    expect(SUNSET_FLOOR).toBeLessThanOrEqual(820);
  });

  test("Blume: the stalk grows from a sprout to the ribbon, on every screen (H-53)", () => {
    expect(STALK.top).toBeGreaterThan(STAKE.top);
    expect(STAKE.top - 20).toBeGreaterThanOrEqual(80 + 100);
    expect(STALK.soil).toBeLessThanOrEqual(820);
    expect(SPROUT).toBeGreaterThan(0);
    expect(SPROUT).toBeLessThan(0.2);
    expect(FLOWER_FAMILY).toBeGreaterThanOrEqual(200);
    // The bear child (right of its grown-up, 120 wide) stands left of the bed.
    expect(FLOWER_FAMILY + 190 - 10 + 120).toBeLessThanOrEqual(STALK.cx - 190);
    expect(FLOWER_FLOOR).toBeLessThanOrEqual(820);
  });

  test("Pizza: eight slices round the board, eaten at their eighths, the family beside it (H-47)", async () => {
    let area = 0;
    for (let i = 0; i < SLICES; i++) {
      const s = slice(i);
      expect(s.x).toBeGreaterThanOrEqual(200);
      expect(s.y).toBeGreaterThanOrEqual(80);
      expect(s.x + s.w).toBeLessThanOrEqual(RIGHT);
      expect(s.y + s.h).toBeLessThanOrEqual(820);
      area += s.to - s.from;
    }
    expect(area).toBeCloseTo(2 * Math.PI);
    expect(PIZZA.cx + PIZZA.r + 34).toBeLessThan(PIZZA_FAMILY - 110);
    expect(PIZZA_FAMILY + 190).toBeLessThanOrEqual(RIGHT);
    expect(PIZZA_FLOOR).toBeLessThanOrEqual(820);
    // A slice is gone at its moment: the CSS lifts it off in as many seconds as its delay takes away.
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    expect(css).toContain(`animation: tm-slice ${SLICE_SECONDS}s ease-in both`);
    expect(pieceMoments(8 * 60_000, SLICES)).toHaveLength(SLICES - 1);
  });

  test("Rote Scheibe: the ladybug leaves a dot a round, never more than once round the face, clear of the family (H-67)", () => {
    expect(ladybugLaps(60_000)).toEqual({ dots: 1, every: 1, laps: 1 });
    expect(ladybugLaps(5 * 60_000)).toEqual({ dots: 5, every: 1, laps: 5 });
    expect(ladybugLaps(10_000)).toEqual({ dots: 1, every: 1, laps: 1 });
    for (const minutes of [1, 2, 3, 5, 10, 17, 30, 31, 45, 60, 90, 180]) {
      const { dots, every, laps } = ladybugLaps(minutes * 60_000);
      expect(dots).toBeLessThanOrEqual(MAX_DOTS);
      expect(laps).toBe(dots * every);
      // About a minute a round, like a second hand.
      expect((minutes / laps) * 60).toBeGreaterThan(40);
      expect((minutes / laps) * 60).toBeLessThan(80);
    }
    expect(MAX_DOTS * DOTS.apart).toBeLessThanOrEqual(360);
    for (let k = 0; k < MAX_DOTS; k++) {
      const { x, y } = dotAt(k);
      expect(x - DOTS.r).toBeGreaterThanOrEqual(200);
      expect(y - DOTS.r).toBeGreaterThanOrEqual(80);
      expect(y + DOTS.r).toBeLessThanOrEqual(820);
      // The fox child stands from x 1090.
      expect(x + DOTS.r).toBeLessThan(1090);
    }
  });

  test("Eimer: the water rises from a little to the red line, where the boat waits; all on every screen (H-69)", () => {
    expect(WATER.start).toBeGreaterThan(0);
    expect(WATER.start).toBeLessThan(WATER.goal);
    expect(WATER.goal).toBeLessThan(1);
    expect(BUCKET.cx - BUCKET.wTop / 2).toBeGreaterThanOrEqual(200);
    expect(BUCKET.bottom).toBeLessThanOrEqual(820);
    // The boat hangs inside the bucket, its keel a little under the line, so the water reaches it only at the end.
    const line = bucketEdges(GOAL_Y);
    expect(BOAT.left).toBeGreaterThan(line.left);
    expect(BOAT.right).toBeLessThan(line.right);
    expect(BOAT.keel).toBeGreaterThan(GOAL_Y);
    expect(BOAT.keel - GOAL_Y).toBeLessThan(20);
    // The drops fall into the bucket, clear of the boat.
    const rim = bucketEdges(BUCKET.top);
    expect(SPOUT.x).toBeGreaterThan(rim.left + 20);
    expect(SPOUT.x).toBeLessThan(BOAT.left - 30);
    expect(SPOUT.y + SPOUT.fall).toBeGreaterThan(BUCKET.top);
    // The pot between the bucket and the bear child (left of its grown-up, 120 wide), the family within the right edge.
    expect(POT.cx - 44).toBeGreaterThan(rim.right + 14);
    expect(POT.cx + 50).toBeLessThanOrEqual(BUCKET_FAMILY - 120 + 20);
    expect(BUCKET_FAMILY + 190).toBeLessThanOrEqual(RIGHT);
    expect(POT.floor).toBeLessThanOrEqual(820);
  });

  test("Kuchen: the dough rises inside the oven's window, and the cake comes out onto the table by the family (H-53)", () => {
    expect(DOUGH_START).toBeGreaterThan(0);
    expect(DOUGH_START).toBeLessThan(0.3);
    // The cake, risen, is seen whole through the window.
    expect(CAKE.x).toBeGreaterThanOrEqual(OVEN_WINDOW.x);
    expect(CAKE.x + CAKE.w).toBeLessThanOrEqual(OVEN_WINDOW.x + OVEN_WINDOW.w);
    expect(CAKE.y + CAKE.dough.y).toBeGreaterThan(OVEN_WINDOW.y);
    expect(CAKE.y + CAKE.h).toBeLessThanOrEqual(OVEN_WINDOW.y + OVEN_WINDOW.h);
    // The dough's box is cut behind the tin's front, never above its rim.
    expect(CAKE.dough.y + CAKE.dough.h).toBeGreaterThan(CAKE.rim);
    expect(OVEN.x + OVEN.w).toBeLessThanOrEqual(1340);
    expect(OVEN.y).toBeGreaterThanOrEqual(80 + 140);
    // The table lies between the family (its child right of its grown-up) and the oven, and holds the cake.
    expect(CAKE_FAMILY).toBeGreaterThanOrEqual(200);
    expect(CAKE_FAMILY + 190 - 10 + 120).toBeLessThanOrEqual(TABLE.x);
    expect(TABLE.x + TABLE.w).toBeLessThan(OVEN.x);
    expect(CAKE.w).toBeLessThan(TABLE.w);
    expect(CAKE_FLOOR).toBeLessThanOrEqual(820);
  });

  test("Gleich ist es so weit: a minute before the end, or the last fifth of a short time (H-49)", () => {
    expect(soonMs(10 * 60_000)).toBe(60_000);
    expect(soonMs(60_000)).toBe(12_000);
    expect(soonMs(10_000)).toBe(2000);
  });
});
