import { describe, expect, test } from "bun:test";
import { nextPicture, PICTURES, TIMED_PICTURES } from "./content";
import { APPLE_FLOOR, APPLE_LANDED, appleRadius, BASKET, CROWN } from "./apples";
import { EATEN, LEAF, LEAF_FLOOR } from "./caterpillar";
import { DISC, DOTS, dotAt } from "./disc";
import { FLOWER_CHILD, FLOWER_FLOOR, GROWN_AT, SPOUT, SPROUT, STAKE, STALK, TAP } from "./flower";
import { PIZZA, PIZZA_FLOOR, slice, SLICES, SLICE_SECONDS } from "./pizza";
import { FLOWERS, MOON, MOON_SET_AT, ridgeAt, SKY_CUT, STARS, SUN, SUN_FROM } from "./sunset";
import {
  appleCount,
  applePlaces,
  haltMs,
  ladybugLaps,
  MAX_APPLES,
  MAX_DOTS,
  MAX_MARKS,
  MAX_STOPS,
  MIN_APPLES,
  markUnit,
  marksLeft,
  PERCENT_MARKS,
  pieceCount,
  pieceMoments,
  runSeconds,
  soonMs,
  trainSteps,
} from "./pieces";
import { ANTS, bulbBelow, CANDLE, CHILD, COOKIE, FLAME_H, GLASS, GROUND, HILL, PLATE, SAND_FLOOR, STAGE_H, STAGE_W, TRAIN } from "./scenes";
import { SWAP_CHILDREN, SWAP_FLOOR, SWAP_GLASS, TOY } from "./swap";
import { DEFAULT_TIMER_SETTINGS, TIMER_SECONDS } from "./settings";

describe("Timer", () => {
  test("every picture has its own id, an emoji and a German name, Abwechseln comes first and „Weiter“ goes round the others", () => {
    expect(new Set(PICTURES.map((p) => p.id)).size).toBe(PICTURES.length);
    for (const p of PICTURES) {
      expect(p.emoji).not.toBe("");
      expect(p.name.de.trim()).not.toBe("");
    }
    // Abwechseln runs without end, so it stands on top under its own line and „Weiter“ never leads into it.
    expect(PICTURES[0].id).toBe("swap");
    expect(TIMED_PICTURES.map((p) => p.id)).not.toContain("swap");
    expect(TIMED_PICTURES).toHaveLength(PICTURES.length - 1);
    const seen = new Set<string>();
    let id = TIMED_PICTURES[0].id;
    for (let i = 0; i < TIMED_PICTURES.length; i++) {
      seen.add(id);
      id = nextPicture(id);
    }
    expect(seen.size).toBe(TIMED_PICTURES.length);
    expect(id).toBe(TIMED_PICTURES[0].id);
    expect(nextPicture("swap")).toBe(TIMED_PICTURES[0].id);
  });

  test("the removed pictures stay removed (user feedback, November 2026: Eimer and Kuchen made no sense)", () => {
    const ids: string[] = PICTURES.map((p) => p.id);
    expect(ids).not.toContain("bucket");
    expect(ids).not.toContain("cake");
  });

  test("the lengths are 10 seconds to 10 minutes, with 10 and 30 seconds (user request, November 2026), rising, and the default is one of them", () => {
    expect(TIMER_SECONDS.slice(0, 3)).toEqual([10, 30, 60]);
    expect(TIMER_SECONDS.at(-1)).toBe(600);
    expect([...TIMER_SECONDS].sort((a, b) => a - b)).toEqual([...TIMER_SECONDS]);
    expect(TIMER_SECONDS).toContain(DEFAULT_TIMER_SETTINGS.seconds as (typeof TIMER_SECONDS)[number]);
  });

  const RIGHT_EDGE = 1340;

  test("what matters stays where every screen shows it (x 200–1400, y 80–820)", () => {
    expect(TRAIN.x).toBeGreaterThanOrEqual(200);
    expect(TRAIN.stop + TRAIN.w).toBeLessThanOrEqual(1400 + 200);
    // A long way to go, so every second shows a step: the train drives most of the picture's width.
    expect(TRAIN.stop - TRAIN.x).toBeGreaterThanOrEqual(1000);
    expect(TRAIN.stop).toBeLessThanOrEqual(RIGHT_EDGE);
    expect(GLASS.cx - GLASS.w / 2).toBeGreaterThanOrEqual(200);
    // With a margin: at 80 and 820 the hourglass's plates touched the screen's edges on a phone on its side.
    expect(GLASS.top - 4 - PLATE).toBeGreaterThanOrEqual(110);
    expect(GLASS.bottom + 4 + PLATE).toBeLessThanOrEqual(790);
    expect(SAND_FLOOR).toBeLessThanOrEqual(810);
    // Tall, so the heap is seen growing (user feedback, November 2026).
    expect(GLASS.bottom - GLASS.top).toBeGreaterThanOrEqual(590);
    expect(CANDLE.base).toBeLessThanOrEqual(820);
    // Tall candles, their flames still on the screen; three of them burning one after the other.
    expect(CANDLE.top - FLAME_H).toBeGreaterThanOrEqual(80);
    expect(CANDLE.base - CANDLE.top).toBeGreaterThanOrEqual(500);
    expect(CANDLE.xs.length).toBeGreaterThanOrEqual(3);
    expect(CANDLE.xs[0] - CANDLE.w / 2).toBeGreaterThanOrEqual(200);
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

  test("Sanduhr: only the sand left and the heap show – no film, no grain, no clip-path on what moves (user feedback, November 2026)", async () => {
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    const scenes = await Bun.file(new URL("./scenes.tsx", import.meta.url)).text();
    for (const gone of [".tm-sand-dust", ".tm-grain"]) expect(css).not.toContain(gone);
    for (const gone of ["tm-sand-dust", "tm-grain"]) expect(scenes).not.toContain(gone);
    // A clip-path round a moving layer dropped out of a turning page's picture and showed the sand as a square.
    const sandRules = [...css.matchAll(/([^{}]*\.tm-(?:sand|bulb)[^{}]*)\{([^}]*)\}/g)];
    expect(sandRules.length).toBeGreaterThan(0);
    for (const [, , body] of sandRules) expect(body).not.toContain("clip-path");
    const sand = scenes.slice(scenes.indexOf("export function BulbSand"), scenes.indexOf("// Kerze"));
    expect(sand.match(/clipPath/g) ?? []).toHaveLength(1); // only the tap's light, mounted after a tap
    // The sand's outline: the full top from its level down to the neck, the full bottom from the same level to the floor.
    const ys = (d: string) => [...d.matchAll(/[ML]\S+ (\S+)/g)].map((m) => Number(m[1]));
    expect(Math.min(...ys(bulbBelow(0.3, false)))).toBeCloseTo(30);
    expect(Math.max(...ys(bulbBelow(0.3, false)))).toBeCloseTo(100);
    expect(Math.min(...ys(bulbBelow(0.3, true)))).toBeCloseTo(30);
    expect(Math.max(...ys(bulbBelow(0.3, true)))).toBeCloseTo(100);
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

  test("Apfelbaum: always many apples, also for a short time – they only fall more often", () => {
    expect(appleCount(10_000)).toBe(MIN_APPLES);
    expect(appleCount(60_000)).toBeGreaterThanOrEqual(20);
    expect(appleCount(3 * 3600_000)).toBe(MAX_APPLES);
    expect(MIN_APPLES).toBeGreaterThanOrEqual(6);
  });

  test("a step every second: the caterpillar bites once a second, as many bites as the run has seconds", async () => {
    expect(runSeconds(20_000)).toBe(20);
    expect(runSeconds(400)).toBe(1);
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    expect(css).toContain("tm-eat var(--tm-ms) steps(var(--tm-secs), end)");
  });

  test("Zeit im Bild: tally marks never more than fit, each one still begun counts, none at the end", () => {
    for (const minutes of [1 / 6, 1, 2, 5, 10, 30, 60, 180]) {
      const total = minutes * 60_000;
      expect(marksLeft(total, markUnit(total))).toBeLessThanOrEqual(MAX_MARKS);
      expect(marksLeft(total, markUnit(total))).toBeGreaterThan(0);
    }
    expect(markUnit(60_000)).toBe(10_000);
    expect(marksLeft(55_000, 10_000)).toBe(6);
    expect(marksLeft(1, 10_000)).toBe(1);
    expect(marksLeft(0, 10_000)).toBe(0);
  });

  test("Zeit im Bild: by default ten tally marks, each a tenth of the run, in the bottom right corner (user request, November 2026)", async () => {
    expect(DEFAULT_TIMER_SETTINGS.showTime).toBe("percent");
    for (const total of [10_000, 30_000, 5 * 60_000, 3 * 60 * 60_000]) {
      expect(marksLeft(total, total / PERCENT_MARKS)).toBe(10);
      expect(marksLeft(total * 0.55, total / PERCENT_MARKS)).toBe(6);
    }
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    const rule = css.slice(css.indexOf(".tm-shown {"), css.indexOf("}", css.indexOf(".tm-shown {")));
    expect(rule).toContain("right:");
    expect(rule).toContain("bottom:");
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

  test("Abwechseln keeps both children, the hourglass and the toy on every screen, the toy never under the hourglass (H-52)", () => {
    expect(SWAP_CHILDREN.fox).toBeGreaterThanOrEqual(200);
    expect(SWAP_CHILDREN.bear + CHILD.w).toBeLessThanOrEqual(1400);
    const glassLeft = SWAP_GLASS.cx - SWAP_GLASS.w / 2;
    const glassRight = SWAP_GLASS.cx + SWAP_GLASS.w / 2;
    expect(TOY.fox + TOY.w).toBeLessThanOrEqual(glassLeft + 10);
    expect(TOY.bear).toBeGreaterThanOrEqual(glassRight - 10);
    // The toy lies right beside the child whose turn it is: right of the fox child, left of the bear child.
    expect(TOY.fox).toBeGreaterThanOrEqual(SWAP_CHILDREN.fox + CHILD.w - 10);
    expect(TOY.bear + TOY.w).toBeLessThanOrEqual(SWAP_CHILDREN.bear + 10);
    expect(SWAP_GLASS.top).toBeGreaterThanOrEqual(80 + 140);
    expect(SWAP_FLOOR + 10).toBeLessThanOrEqual(820);
  });

  // The book's paper margin and the ⚙️ note lie over the stage's right edge (x 1400 at 4:3): a figure standing to 1380
  // was cut off there, so the new pictures keep what matters within 1340.
  const RIGHT = 1340;

  test("Sonnenuntergang: a big moon and sun in the very middle, the moon setting first, then the sun rising, behind the ridge (H-54)", () => {
    // Both exactly in the middle and big (user feedback, November 2026), and the cut of their boxes always hidden below the ridge.
    for (const { cx, r } of [SUN, MOON]) {
      expect(cx).toBe(STAGE_W / 2);
      expect(r).toBeGreaterThanOrEqual(220);
      for (let x = cx - r; x <= cx + r; x += 5) expect(ridgeAt(x)).toBeLessThan(SKY_CUT);
    }
    // Moon high at the start and wholly gone once set; the sun hidden until then and high, whole above the hill, at the end.
    expect(MOON.top).toBeGreaterThanOrEqual(80);
    expect(MOON.set).toBeGreaterThanOrEqual(SKY_CUT);
    expect(SUN.start).toBeGreaterThanOrEqual(SKY_CUT);
    expect(SUN_FROM).toBeGreaterThanOrEqual(MOON_SET_AT);
    expect(SUN.top).toBeGreaterThanOrEqual(80);
    expect(SUN.top + 2 * SUN.r).toBeLessThan(ridgeAt(SUN.cx));
    // The stars go out in order through the moon's half, within the sky, never where the moon or the sun passes.
    expect(STARS.map((s) => s.at)).toEqual([...STARS.map((s) => s.at)].sort((a, b) => a - b));
    for (const s of STARS) {
      expect(s.at).toBeGreaterThanOrEqual(0);
      expect(s.at).toBeLessThan(SUN_FROM);
      expect(s.y).toBeLessThan(ridgeAt(s.x) - 30);
      expect(Math.abs(s.x - SUN.cx)).toBeGreaterThan(SUN.r + 30);
    }
    // Flowers, dots on the meadow below the ridge, within the part of the stage every screen shows.
    expect(FLOWERS.length).toBeGreaterThanOrEqual(40);
    for (const f of FLOWERS) {
      expect(f.y).toBeGreaterThan(ridgeAt(f.x) + f.r);
      expect(f.y).toBeLessThanOrEqual(820);
    }
  });

  test("Blume: the stalk grows tall from a sprout to the ribbon, then opens; the water comes from a tap (H-53)", () => {
    expect(STALK.top).toBeGreaterThan(STAKE.top);
    expect(STAKE.top - 20).toBeGreaterThanOrEqual(80 + 10);
    expect(STALK.soil - STALK.top).toBeGreaterThanOrEqual(600);
    // It is grown well before the end, so the petals opening one by one fill the rest of the time.
    expect(GROWN_AT).toBeGreaterThan(0.5);
    expect(GROWN_AT).toBeLessThanOrEqual(0.8);
    // A tap on a post, not a can that never runs dry: the hose's nozzle lies over the bed, the tap left of the child.
    expect(TAP.x).toBeGreaterThanOrEqual(200);
    expect(TAP.x).toBeLessThan(FLOWER_CHILD);
    expect(SPOUT.x).toBeLessThan(STALK.cx);
    expect(STALK.soil).toBeLessThanOrEqual(820);
    expect(SPROUT).toBeGreaterThan(0);
    expect(SPROUT).toBeLessThan(0.2);
    // The bear child stands left of the bed.
    expect(FLOWER_CHILD).toBeGreaterThanOrEqual(200);
    expect(FLOWER_CHILD + CHILD.w).toBeLessThanOrEqual(STALK.cx - 190);
    expect(FLOWER_FLOOR).toBeLessThanOrEqual(820);
  });

  test("Pizza: many slices round the board, one eaten at each of its moments (H-47)", async () => {
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
    expect(PIZZA.cx + PIZZA.r).toBeLessThanOrEqual(RIGHT);
    expect(PIZZA_FLOOR).toBeLessThanOrEqual(820);
    // A slice is gone at its moment: the CSS lifts it off in as many seconds as its delay takes away.
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    expect(css).toContain(`animation: tm-slice ${SLICE_SECONDS}s ease-in both`);
    expect(SLICES).toBeGreaterThanOrEqual(16);
    expect(pieceMoments(8 * 60_000, SLICES)).toHaveLength(SLICES - 1);
  });

  test("Rote Scheibe: the ladybug leaves a dot a round, never more than once round the face (H-67)", () => {
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
    }
  });

  test("Gleich ist es so weit: a minute before the end, or the last fifth of a short time (H-49)", () => {
    expect(soonMs(10 * 60_000)).toBe(60_000);
    expect(soonMs(60_000)).toBe(12_000);
    expect(soonMs(10_000)).toBe(2000);
  });
});
