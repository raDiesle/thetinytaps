import { describe, expect, test } from "bun:test";
import { SCENARIOS } from "../../../tools/perfScenarios";
import { APP_LANGUAGES, firstLanguage, pick } from "@/lib/language";
import { nextPicture, PICTURES, TIMED_PICTURES } from "./content";
import { APPLE_FLOOR, appleRadius, BEE, BEES, CART, CART_MIDDLE, CROWN, HEAP_R, HEAP_ROWS, heapSlot, treeApples } from "./apples";
import { BAR, CLOCK, CLOCK_FLOOR, clockText, DIGITS } from "./clock";
import {
  CAR,
  CAR_HOME,
  CAR_START,
  carStop,
  HOUSE,
  IN_BOX as ROAD_IN_BOX,
  MAX_ROAD_TOYS,
  MIN_ROAD_TOYS,
  ON_ROAD,
  ROAD,
  ROAD_BOX,
  ROAD_TOY,
  roadBoxSlot,
  roadPlan,
  roadTilt,
  roadToyCount,
  roadToyX,
  roadY,
} from "./road";
import {
  BLOCK,
  BLOCK_HOP_MS,
  blockCount,
  blocksPlan,
  cursorFrames,
  DOOR,
  FACE,
  HOUSE as BLOCK_HOUSE,
  JUMBLE,
  MAX_BLOCKS,
  MIN_BLOCKS,
  SLOTS,
  slotFoot,
  WINDOWS,
} from "./blocks";
import { BOX_COUNT, BOXES, boxesPlan, boxLeft, boxSlot, floorPlaces, IN_BOX, LID_H, MAX_PER_BOX, MIN_PER_BOX, OPENING, perBox, TOY as BOX_TOY } from "./boxes";
import { BITE_R, BUTTERFLY, biteSpot, bodyFront, frontAfter, LEAF, LEAF_FLOOR, leafLeft, leafShape, leafSpan, planBites, REACH } from "./caterpillar";
import { DISC, DOTS, dotAt } from "./disc";
import { PICTURE_LINES, SOON_LINE, TURN_LINES, timerSaid } from "./voice";
import { BLOOM, FLOWER_FLOOR, GROWN_AT, HOLDER, SPOUT, SPROUT, SPROUT_SIZE, STAKE, STALK, TAP } from "./flower";
import { PIZZA, PIZZA_FLOOR, slice, SLICES, SLICE_SECONDS, TOPPINGS } from "./pizza";
import { FINAL_MS, FINAL_NOTES, finalMs } from "./bar";
import { FLOWERS, MOON, MOON_SET_AT, ridgeAt, SKY_CUT, STARS, SUN, SUN_FROM } from "./sunset";
import {
  appleCount,
  applePlaces,
  appleTimes,
  harvestOrder,
  haltMs,
  ladybugLaps,
  MAX_APPLES,
  MAX_DOTS,
  MAX_MARKS,
  MAX_STOPS,
  MIN_APPLES,
  markUnit,
  marksLeft,
  percentMarks,
  pieceCount,
  pieceMoments,
  runSeconds,
  soonMs,
  trainSteps,
} from "./pieces";
import { bulbBelow, CANDLE, FLAME_H, GLASS, HOURGLASS_BOX, PLATE, SAND_FLOOR, STAGE_H, STAGE_W, TRAIN } from "./scenes";
import { FIRST_TURN } from "./SwapPlay";
import { PLANK_BOX, SAW, SAW_GROUND, SAW_TILT, SEAT_CUSHION_W, TYRE_TOP, TYRE_X, WALKER } from "./seesaw";
import { LAMP, SWAP_FLOOR, SWAP_SEATS, TOY } from "./swap";
import { DEFAULT_TIMER_SETTINGS, TIMER_SECONDS } from "./settings";
import {
  BEAM,
  BOX,
  CARRY_BOTTOM,
  CLAW,
  FALL_MS,
  gripTop,
  HEAP_ROWS as TOY_HEAP_ROWS,
  HEAP_SCALE,
  heapSlot as toySlot,
  MAX_TOYS,
  MIN_TOYS,
  POSTS,
  TOY as TOY_SIZE,
  TOY_PLACES,
  tidyTimes,
  tidyToys,
  toyCount,
} from "./tidy";

describe("Timer", () => {
  const RIGHT_EDGE = 1340;

  test("every picture has its own id, an emoji and a name, they stand in the order the user asked for and „Weiter“ goes round all but those of taking turns", () => {
    expect(new Set(PICTURES.map((p) => p.id)).size).toBe(PICTURES.length);
    for (const p of PICTURES) {
      expect(p.emoji).not.toBe("");
      // The older pictures are named German first, a new one (Tidy Up) English first.
      expect(pick(p.name, firstLanguage(p.name)).trim()).not.toBe("");
    }
    // The order the user asked for (November 2026): Rote Scheibe, Sanduhr, Kerze, Apfelbaum, Blume, Pizza, Wecker, and
    // Abwechseln and the Wippe (H-109) last, in a group of their own. Tennis (H-71) stood there and was taken out (user
    // request, 21 November 2026: poorly done).
    expect(PICTURES.slice(0, 7).map((p) => p.id)).toEqual(["disc", "sand", "candle", "apple", "flower", "pizza", "clock"]);
    expect(PICTURES.slice(-2).map((p) => p.id)).toEqual(["swap", "seesaw"]);
    expect(PICTURES.map((p) => p.id as string)).not.toContain("tennis");
    expect(DEFAULT_TIMER_SETTINGS.picture).toBe(PICTURES[0].id);
    // Taking turns runs without end, so „Weiter“ never leads into it.
    expect(TIMED_PICTURES.map((p) => p.id)).not.toContain("swap");
    expect(TIMED_PICTURES.map((p) => p.id)).not.toContain("seesaw");
    expect(TIMED_PICTURES).toHaveLength(PICTURES.length - 2);
    const seen = new Set<string>();
    let id = TIMED_PICTURES[0].id;
    for (let i = 0; i < TIMED_PICTURES.length; i++) {
      seen.add(id);
      id = nextPicture(id);
    }
    expect(seen.size).toBe(TIMED_PICTURES.length);
    expect(id).toBe(TIMED_PICTURES[0].id);
    expect(nextPicture("swap")).toBe(TIMED_PICTURES[0].id);
    expect(nextPicture("seesaw")).toBe(TIMED_PICTURES[0].id);
  });

  test("the alarm clock shows the time left on a screen whose digits never shift, starting on the time set and ending on 0:00", () => {
    expect(clockText(300_000, 300_000)).toBe("5:00");
    expect(clockText(299_001, 300_000)).toBe("5:00");
    expect(clockText(299_000, 300_000)).toBe("4:59");
    expect(clockText(9_000, 10_000)).toBe("0:09");
    expect(clockText(0, 300_000)).toBe("0:00");
    // From ten minutes on, a blank stands in front of one-digit minutes; from an hour on the hours stay in front.
    expect(clockText(599_000, 600_000)).toBe(" 9:59");
    expect(clockText(600_000, 600_000)).toBe("10:00");
    expect(clockText(3_599_000, 5_400_000)).toBe("0:59:59");
    expect(clockText(5_400_000, 5_400_000)).toBe("1:30:00");
    for (const total of [10_000, 60_000, 600_000, 3_600_000, 10_800_000])
      for (const left of [total, total / 2, 1, 0]) expect(clockText(left, total)).toHaveLength(clockText(total, total).length);
    // It stands on the table within what every screen shows, its digits and blocks inside it.
    expect(CLOCK.x).toBeGreaterThanOrEqual(200);
    expect(CLOCK.x + CLOCK.w).toBeLessThanOrEqual(RIGHT_EDGE);
    expect(CLOCK.y).toBeGreaterThanOrEqual(80);
    expect(CLOCK_FLOOR).toBeLessThanOrEqual(820);
    for (const box of [DIGITS, BAR]) {
      expect(box.x).toBeGreaterThan(CLOCK.x);
      expect(box.x + box.w).toBeLessThan(CLOCK.x + CLOCK.w);
    }
  });

  test("the removed pictures stay removed (user feedback, November 2026: Eimer and Kuchen made no sense)", () => {
    const ids: string[] = PICTURES.map((p) => p.id);
    expect(ids).not.toContain("bucket");
    expect(ids).not.toContain("cake");
  });

  test("each card is its picture halfway through its run, with no words on it, and stands still in the menu (user request and feedback, November 2026)", async () => {
    const game = await Bun.file(new URL("./TimerGame.tsx", import.meta.url)).text();
    expect(game).toContain("art: <TimerCardArt picture={p.id}");
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    expect(css.match(/\.tm-card-art\.tm-still \* \{([^}]*)\}/)?.[1]).toContain("animation: none !important");
    expect(css.match(/\.tm-card-art \* \{([^}]*)\}/)?.[1]).toContain("will-change: auto !important");
    const art = await Bun.file(new URL("./cardArt.tsx", import.meta.url)).text();
    expect(art).toContain("const MIDDLE = 0.5;");
    expect(art).toContain('phase="running"');
    expect(art).not.toContain("tm-done");
  });

  test("the lengths are 10 seconds to 10 minutes, with 10 and 30 seconds (user request, November 2026), rising, and the default is one of them", () => {
    expect(TIMER_SECONDS.slice(0, 3)).toEqual([10, 30, 60]);
    expect(TIMER_SECONDS.at(-1)).toBe(600);
    expect([...TIMER_SECONDS].sort((a, b) => a - b)).toEqual([...TIMER_SECONDS]);
    expect(TIMER_SECONDS).toContain(DEFAULT_TIMER_SETTINGS.seconds as (typeof TIMER_SECONDS)[number]);
  });

  test("every visit starts at 5 minutes: the length picked is never stored (user request, November 2026)", async () => {
    expect(DEFAULT_TIMER_SETTINGS.seconds).toBe(300);
    const game = await Bun.file(new URL("./TimerGame.tsx", import.meta.url)).text();
    // The row's length and whether the own time is chosen live in `visitLength`, never in the stored settings.
    expect(game).not.toMatch(/update\(\{[^}]*\b(seconds|useOwn)\b/);
    expect(game).toMatch(/useState\(visitLength\)/);
  });

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

  test("the CSS burns the candle all the way down before its flame goes out, and its smoke rises for seconds", async () => {
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    const height = CANDLE.base - CANDLE.top;
    const left = (CANDLE.stub / height).toFixed(4);
    const burnt = `${(((height - CANDLE.stub) / height) * 100).toFixed(2)}%`;
    expect(css).toContain(`scaleY(${left})`);
    expect(css).toContain(`--tm-burnt: ${burnt}`);
    // Down into its puddle: only a thin rim of wax is left (user feedback, November 2026: they went out half a hand high).
    expect(CANDLE.stub).toBeLessThanOrEqual(12);
    // The flame goes out at the end of its candle's turn, when the wax is down – never before.
    expect(css).toMatch(/tm-go-out [\d.]+s ease-in calc\(var\(--tm-from\) \+ var\(--tm-turn\)\) forwards/);
    // The smoke lingers: several puffs and a wisp, each rising for seconds.
    const seconds = [...css.matchAll(/animation: tm-(?:wisp|smoke-puff) ([\d.]+)s/g)].map((m) => Number(m[1]));
    expect(seconds.length).toBe(2);
    for (const s of seconds) expect(s).toBeGreaterThanOrEqual(4);
  });

  test("Sanduhr: only the sand left and the heap show – no film, no grain, no clip-path on what moves (user feedback, November 2026)", async () => {
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    const scenes = await Bun.file(new URL("./scenes.tsx", import.meta.url)).text();
    for (const gone of [".tm-sand-dust", ".tm-grain"]) expect(css).not.toContain(gone);
    for (const gone of ["tm-sand-dust", "tm-grain"]) expect(scenes).not.toContain(gone);
    // No white streaks for the glass's shine either: they looked bad (user feedback, November 2026), on both hourglasses.
    // Abwechseln draws the same hourglass (checked below), so its frame is the one to look at.
    const frame = scenes.slice(scenes.indexOf("const GlassFrame"), scenes.indexOf("export function BulbSand"));
    expect(frame.length).toBeGreaterThan(0);
    expect(frame).not.toContain('stroke="#fff"');
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
    expect(CART.x + CART.w).toBeLessThanOrEqual(1400);
    expect(APPLE_FLOOR).toBeLessThanOrEqual(820);
    expect(LEAF.x + LEAF.w).toBeLessThanOrEqual(1200);
    // The butterfly flies back and forth in the air, clear of the ✕ and the book's right margin.
    expect(BUTTERFLY.left).toBeGreaterThanOrEqual(200);
    expect(BUTTERFLY.right + BUTTERFLY.w).toBeLessThanOrEqual(1340);
    expect(BUTTERFLY.y).toBeGreaterThanOrEqual(80);
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
    expect(appleCount(60_000)).toBeGreaterThanOrEqual(10);
    expect(appleCount(3 * 3600_000)).toBe(MAX_APPLES);
    expect(MIN_APPLES).toBeGreaterThanOrEqual(6);
  });

  test("a step every second: the caterpillar bites once a second, the leaf going evenly and gone with the last bite", () => {
    expect(runSeconds(20_000)).toBe(20);
    expect(runSeconds(400)).toBe(1);
    for (const count of [60, 137, 600, 3600]) {
      const plan = planBites(count, 42);
      expect(plan.length).toBe(count);
      for (const share of [0.1, 0.25, 0.5, 0.75, 0.9]) expect(Math.abs(leafLeft(plan, Math.round(count * share)) - (1 - share))).toBeLessThan(0.02);
      expect(leafLeft(plan, count)).toBeLessThan(0.01);
    }
  });

  test("Raupe: it starts at the tip and bites uneven round notches that stand apart (user feedback, November 2026)", () => {
    for (const count of [60, 300]) {
      const plan = planBites(count, 7);
      // The first bite takes the very tip, and the first tenth stay at the front of the leaf.
      expect(plan[0].spot.x).toBeGreaterThan(LEAF.w - 20);
      for (const b of plan.slice(0, count / 10)) expect(b.spot.x).toBeGreaterThan(LEAF.w * 0.6);
      // Real bites, never tiny: as big as the leaf shared out allows, of different sizes, a step apart from the last.
      const sizes = plan.map((b) => b.r);
      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(BITE_R.min);
      expect(Math.max(...sizes) / Math.min(...sizes)).toBeGreaterThan(1.3);
      const steps = plan.slice(1).map((b, i) => Math.abs(b.y - plan[i].y));
      expect(steps.filter((d) => d > 1.2 * BITE_R.min).length).toBeGreaterThan(steps.length * 0.6);
    }
  });

  test("Raupe: the leaf is one piece, drawn as it is left – no bands, no clip path while it runs (user feedback, November 2026)", async () => {
    const code = await Bun.file(new URL("./caterpillar.tsx", import.meta.url)).text();
    const leaf = code.slice(code.indexOf("function Leaf("), code.indexOf("/** One round segment"));
    // A band's hairline let the sky through; a clip path (CSS or in the svg) showed the whole leaf as the page turned.
    expect(code).not.toContain("tm-band");
    expect(leaf).not.toContain("<clipPath");
    expect(leaf.match(/clipPath/g) ?? []).toHaveLength(1);
    expect(leaf).toMatch(/glow > 0 && \(\s*<div className="tm-leaf-light" style=\{\{ clipPath: /);
    // Its green and lines end at the bites: nothing of it lies right of the bitten edge.
    const plan = planBites(60, 3);
    const front = frontAfter(plan, 30);
    const xs = (d: string) => [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
    for (const [x, y] of xs(leafShape(front))) expect(x).toBeLessThanOrEqual(front[Math.round(y / 2)] + 0.1);
    expect(leafShape(frontAfter(plan, 0))).not.toBe("");
    expect(leafShape(frontAfter(plan, 60).map(() => 0))).toBe("");
  });

  test("Raupe: the head goes to each spot it bites, on the leaf, within reach of the body (user request, November 2026)", () => {
    for (const count of [10, 60, 600]) {
      const plan = planBites(count);
      for (let bites = 0; bites < count; bites++) {
        const spot = biteSpot(plan, bites);
        // At the edge, where there is leaf.
        const span = leafSpan(spot.y);
        expect(span).toBeDefined();
        if (span) {
          expect(spot.x).toBeGreaterThanOrEqual(span[0] - 30);
          expect(spot.x).toBeLessThanOrEqual(span[1]);
        }
        const front = bodyFront(plan, bites);
        expect(Math.hypot(spot.x - front.x, spot.y - front.y)).toBeLessThanOrEqual(REACH);
      }
    }
  });

  test("Zeit im Bild: tally marks never more than fit, each one still begun counts, none at the end", () => {
    for (const minutes of [1 / 6, 1, 2, 5, 10, 30, 60, 180]) {
      const total = minutes * 60_000;
      expect(marksLeft(total, markUnit(total))).toBeLessThanOrEqual(MAX_MARKS);
      expect(marksLeft(total, markUnit(total))).toBeGreaterThan(0);
    }
    expect(markUnit(60_000)).toBe(2000);
    expect(markUnit(10_000)).toBe(1000);
    expect(marksLeft(55_000, 10_000)).toBe(6);
    expect(marksLeft(1, 10_000)).toBe(1);
    expect(marksLeft(0, 10_000)).toBe(0);
  });

  test("Zeit im Bild: by default minutes and seconds in the bottom right corner; marks start many (user requests, November 2026)", async () => {
    expect(DEFAULT_TIMER_SETTINGS.timeNote).toBe("digits");
    for (const total of [10_000, 30_000, 5 * 60_000, 3 * 60 * 60_000]) {
      // Never just ten: a full row, or one a second for a short time.
      expect(marksLeft(total, total / percentMarks(total))).toBe(Math.min(MAX_MARKS, total / 1000));
      expect(marksLeft(total, markUnit(total))).toBeGreaterThanOrEqual(10);
    }
    expect(marksLeft(5 * 60_000 * 0.55, (5 * 60_000) / percentMarks(5 * 60_000))).toBe(17);
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

  test("every apple hangs inside the crown, apart from the others, and falls straight down past no other apple", () => {
    for (const count of [1, 5, 12, 20, MAX_APPLES]) {
      const r = appleRadius(count);
      const places = applePlaces(count, CROWN.rx - r - 24, CROWN.ry - r - 24);
      expect(places).toHaveLength(count);
      for (const p of places) expect((p.x / (CROWN.rx - r)) ** 2 + (p.y / (CROWN.ry - r)) ** 2).toBeLessThanOrEqual(1);
      for (const a of places) for (const b of places) if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(2 * r);
      // The cart goes back and forth from where it waits at the right (user feedback, November 2026): first over to the
      // left, then turning again and again; an apple falls only once none hangs below it in its way.
      const start = CART_MIDDLE - CROWN.cx;
      const order = harvestOrder(places, r, start);
      expect(order).toHaveLength(count);
      if (count > 1) expect(order[0].x).toBeLessThan(start);
      const steps = [start, ...order.map((p) => p.x)].map((x, i, xs) => (i === 0 ? 0 : Math.sign(x - xs[i - 1]))).slice(1);
      const turns = steps.filter((d, i) => i > 0 && d !== 0 && d === -steps[i - 1]).length;
      if (count >= 5) expect(turns).toBeGreaterThanOrEqual(Math.floor(count / 2));
      order.forEach((p, k) => {
        for (const q of order.slice(k + 1)) expect(q.y > p.y && Math.abs(q.x - p.x) < 2 * r).toBe(false);
      });
    }
  });

  test("Apfelbaum: the tree grows, the blossoms open one by one, each becomes an apple in turn, the cart comes under each as it falls; the last lands at the end", () => {
    for (const total of [10_000, 60_000, 5 * 60_000, 3 * 3600_000]) {
      const count = appleCount(total);
      const t = appleTimes(total, count);
      expect(t.harvest).toHaveLength(count);
      for (let i = 0; i < count; i++) {
        expect(t.bloom[i]).toBeGreaterThanOrEqual(t.grown);
        expect(t.ripen[i]).toBeGreaterThan(t.bloom[i]);
        // Every apple is red before the first one is harvested.
        expect(t.ripen[i] + t.ripenMs).toBeLessThanOrEqual(t.harvest[0].leave + 1e-6);
      }
      // One at a time (user feedback, November 2026): a blossom is open before the next opens, an apple grown before
      // the next comes out of its blossom, and the apples only after the last blossom.
      const blooms = [...t.bloom].sort((a, b) => a - b);
      const ripens = [...t.ripen].sort((a, b) => a - b);
      for (let i = 1; i < count; i++) {
        expect(blooms[i] - blooms[i - 1]).toBeGreaterThanOrEqual(t.openMs - 1e-6);
        expect(ripens[i] - ripens[i - 1]).toBeGreaterThanOrEqual(t.ripenMs - 1e-6);
      }
      expect(ripens[0]).toBeGreaterThanOrEqual(blooms.at(-1)! + t.openMs - 1e-6);
      let before = t.harvest[0].sway;
      for (const h of t.harvest) {
        expect(h.sway).toBeGreaterThanOrEqual(before - 1e-6);
        expect(h.leave).toBeGreaterThanOrEqual(h.sway - 1e-6);
        expect(h.under).toBeGreaterThan(h.leave);
        // The cart is under the apple as it lets go, not waiting there for seconds before.
        expect(h.fall).toBeGreaterThanOrEqual(h.under);
        expect(h.fall - h.under).toBeLessThanOrEqual(200);
        expect(h.land).toBeGreaterThan(h.fall);
        before = h.land;
      }
      expect(t.harvest.at(-1)?.land).toBeCloseTo(total);
      // Blossoms open all over the tree, not one after the other along a row.
      expect(new Set(t.bloom).size).toBe(count);
    }
  });

  test("Apfelbaum: each apple lies on its own in the cart, and the cart and the bees stay on the screen", async () => {
    expect(HEAP_ROWS.reduce((a, b) => a + b, 0)).toBe(MAX_APPLES);
    const half = (CART.box.right - CART.box.left) / 2;
    for (let n = 0; n < MAX_APPLES; n++) {
      const slot = heapSlot(n);
      expect(Math.abs(slot.x - CART_MIDDLE) + HEAP_R).toBeLessThanOrEqual(half);
      expect(slot.y - HEAP_R).toBeGreaterThanOrEqual(CART.y);
      // Each shows: even the bottom row lies with its middle over the box's front (user feedback, November 2026).
      expect(slot.y).toBeLessThan(CART.box.rim - 8);
      // Never two apples on the same spot.
      for (let m = 0; m < n; m++) {
        const other = heapSlot(m);
        expect(Math.hypot(slot.x - other.x, slot.y - other.y)).toBeGreaterThanOrEqual(1.5 * HEAP_R);
      }
    }
    expect(CART.x + CART.w).toBeLessThanOrEqual(RIGHT_EDGE);
    for (const count of [MIN_APPLES, 12, MAX_APPLES]) {
      for (const p of treeApples(count)) expect(p.x - CART_MIDDLE + CART.box.left).toBeGreaterThanOrEqual(190);
    }
    // The bees are tiny beside a blossom (user feedback, November 2026: much smaller).
    expect(BEE.w).toBeLessThanOrEqual(2.2 * appleRadius(MAX_APPLES) * 0.6);
    // Their rounds (`tm-bee-fly`: up to 1000 % right, 250 % up, 510 % down) stay over the meadow and under the sky's top.
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    expect(css).toContain("translate(1000%, 115%)");
    for (const b of BEES) {
      const reach = 10 * BEE.w;
      const xs = b.flip ? [b.x - reach, b.x + BEE.w] : [b.x, b.x + reach + BEE.w];
      expect(xs[0]).toBeGreaterThanOrEqual(200);
      expect(xs[1]).toBeLessThanOrEqual(RIGHT_EDGE);
      expect(b.y - 2.5 * BEE.h).toBeGreaterThanOrEqual(80);
      expect(b.y + 5.1 * BEE.h).toBeLessThanOrEqual(APPLE_FLOOR);
    }
  });

  test("Tidy Up: fifteen toys at five minutes, always many, the crane taking one at a time, the last landing as the time is up (H-118)", () => {
    expect(toyCount(5 * 60_000)).toBe(15);
    expect(MAX_TOYS).toBe(15);
    expect(toyCount(10_000)).toBe(MIN_TOYS);
    expect(toyCount(3 * 3600_000)).toBe(MAX_TOYS);
    for (const total of [10_000, 60_000, 5 * 60_000, 3 * 3600_000]) {
      const count = toyCount(total);
      const times = tidyTimes(total, count);
      let before = 0;
      for (const t of times) {
        // Each toy is finished before the crane sets off for the next, and each step follows the one before.
        const steps = [t.leave, t.over, t.down, t.gripped, t.up, t.open, t.land];
        expect(steps[0]).toBeGreaterThanOrEqual(before);
        for (let i = 1; i < steps.length; i++) expect(steps[i]).toBeGreaterThan(steps[i - 1]);
        expect(t.land - t.open).toBeLessThanOrEqual(FALL_MS + 1e-6);
        before = t.land;
      }
      expect(times.at(-1)?.land).toBeCloseTo(total);
      // Nearest the box first, so the empty floor grows from the box outwards; never two on one place.
      const toys = tidyToys(count);
      expect(toys).toHaveLength(count);
      expect(new Set(toys.map((t) => `${t.x},${t.y}`)).size).toBe(count);
      for (let i = 1; i < count; i++) expect(toys[i].x).toBeLessThan(toys[i - 1].x);
    }
  });

  test("Tidy Up: the toys lie between the posts and left of the box, each lands on its own in the heap, and the claw stays on the screen (H-118)", () => {
    const half = TOY_SIZE / 2;
    for (const place of TOY_PLACES) {
      expect(place.x - half).toBeGreaterThanOrEqual(POSTS.xs[0] + POSTS.w);
      expect(place.x + half).toBeLessThanOrEqual(BOX.left);
      expect(place.y).toBeLessThanOrEqual(820);
      // The claw goes down to each toy.
      expect(gripTop(place)).toBeGreaterThan(CLAW.rest);
    }
    expect(TOY_HEAP_ROWS.reduce((a, b) => a + b, 0)).toBe(MAX_TOYS);
    const small = (HEAP_SCALE * TOY_SIZE) / 2;
    const heapTop = Math.min(...Array.from({ length: MAX_TOYS }, (_, n) => toySlot(n).y - 2 * small));
    // A toy carried over the box passes above the full heap, never through it.
    expect(CARRY_BOTTOM).toBeLessThanOrEqual(heapTop);
    expect(heapTop).toBeGreaterThanOrEqual(80 + CLAW.h);
    for (let n = 0; n < MAX_TOYS; n++) {
      const slot = toySlot(n);
      expect(slot.x - small).toBeGreaterThanOrEqual(BOX.left);
      expect(slot.x + small).toBeLessThanOrEqual(BOX.right);
      // Each shows above the box's front, the bottom row too.
      expect(slot.y - 2 * small).toBeLessThan(BOX.rim);
      // The claw over it and the trolley stay inside the beam and the screen's right edge.
      expect(slot.x + CLAW.w / 2).toBeLessThanOrEqual(RIGHT_EDGE);
      expect(slot.x + CLAW.w / 2).toBeLessThanOrEqual(BEAM.right);
      for (let m = 0; m < n; m++) {
        const other = toySlot(m);
        expect(Math.hypot(slot.x - other.x, slot.y - other.y)).toBeGreaterThanOrEqual(0.3 * TOY_SIZE);
      }
    }
    expect(Math.min(...TOY_PLACES.map((p) => p.x)) - CLAW.w / 2).toBeGreaterThanOrEqual(BEAM.left);
  });

  test("Tidy Up: a toy falls straight down from the open claw into the box, and every part snaps to its place at the end (H-118)", async () => {
    const code = await Bun.file(new URL("./tidy.tsx", import.meta.url)).text();
    // The fall's start (still in the claw) and its end (in the box) share the same sideways move.
    expect(code).toContain("carried(((toy.slot.x - toy.x) / TOY) * 100)");
    expect(code).toContain("const dx = ((toy.slot.x - toy.x) / TOY) * 100;");
    expect(code).not.toMatch(/clip-?[pP]ath/);
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    for (const part of ["toy", "tidy-trolley", "tidy-rope", "tidy-claw", "tidy-sway", "tidy-finger"])
      expect(css, part).toMatch(new RegExp(`\\.tm-done \\.tm-${part}[,\\s{]`));
  });

  // The perf scenarios tap each card by its tooltip, which follows the app language (German while measuring): Tidy Up's
  // and the Wippe's still asked for „Tidy Up“ and „Seesaw“ after their names were translated, and measured nothing.
  test("every timer card a perf scenario taps is named so in German, and every timed picture has its scenario", () => {
    const german = PICTURES.map((p) => pick(p.name, "de"));
    const tapped = SCENARIOS.filter((s) => s.path.startsWith("/timer/")).flatMap((s) =>
      s.parts.flatMap((part) => (part.before ?? []).flatMap((step) => ("tap" in step ? [...step.tap.matchAll(/title\^="([^"]+)"/g)].map((m) => m[1]) : []))),
    );
    for (const title of tapped)
      expect(
        german.some((name) => name.startsWith(title)),
        title,
      ).toBe(true);
    for (const name of german)
      expect(
        tapped.some((title) => name.startsWith(title)),
        name,
      ).toBe(true);
  });

  test("Five Boxes: three toys a box at five minutes, each hop finished before the next, a lid shut after its box's last toy, the last as the time is up (H-120)", () => {
    expect(perBox(5 * 60_000)).toBe(3);
    expect(perBox(10_000)).toBe(MIN_PER_BOX);
    expect(perBox(3 * 3600_000)).toBe(MAX_PER_BOX);
    for (const total of [10_000, 60_000, 5 * 60_000, 3 * 3600_000]) {
      const count = perBox(total);
      const { toys, lids } = boxesPlan(total, count);
      expect(toys).toHaveLength(BOX_COUNT * count);
      expect(lids).toHaveLength(BOX_COUNT);
      let before = 0;
      for (const toy of toys) {
        // One toy at a time, from the left box to the right, never two in the air at once.
        expect(toy.hop.start).toBeGreaterThanOrEqual(before);
        expect(toy.hop.land).toBeGreaterThan(toy.hop.start);
        // Its box's lid swings only once it is in.
        expect(lids[toy.box].start).toBeGreaterThanOrEqual(toy.hop.land);
        if (toy.box > 0) expect(toy.hop.start).toBeGreaterThanOrEqual(lids[toy.box - 1].shut);
        // It waits its turn wiggling only while nothing else moves.
        if (toy.hop.waitFrom !== undefined) expect(toy.hop.waitFrom).toBeGreaterThanOrEqual(before);
        before = toy.hop.land;
      }
      for (const lid of lids) expect(lid.shut).toBeGreaterThan(lid.start);
      expect(lids.at(-1)?.shut).toBeCloseTo(total);
    }
  });

  test("Five Boxes: the boxes and toys stay on the screen, the toys lie in front of their box without hiding each other, each lands on its own place inside it (H-120)", () => {
    const half = BOX_TOY / 2;
    expect(boxLeft(0)).toBeGreaterThanOrEqual(200);
    expect(boxLeft(BOX_COUNT - 1) + BOXES.w).toBeLessThanOrEqual(RIGHT_EDGE);
    // The lid standing open stays below the top edge, and so does the top of every hop.
    expect(BOXES.rim - OPENING - LID_H).toBeGreaterThanOrEqual(80);
    for (let k = 0; k < BOX_COUNT; k++) {
      for (const count of [MIN_PER_BOX, 3, MAX_PER_BOX]) {
        const places = floorPlaces(k, count);
        expect(places).toHaveLength(count);
        for (const [j, place] of places.entries()) {
          // On the floor in front of the boxes, within the screen and above the bar along the bottom.
          expect(place.y - BOX_TOY).toBeGreaterThan(BOXES.bottom - 40);
          expect(place.y).toBeLessThanOrEqual(780);
          expect(place.x - half).toBeGreaterThanOrEqual(200);
          expect(place.x + half).toBeLessThanOrEqual(RIGHT_EDGE);
          for (const other of places.slice(0, j)) expect(Math.hypot(place.x - other.x, place.y - other.y)).toBeGreaterThanOrEqual(0.8 * BOX_TOY);
          // In the box, side by side and within its walls, its top showing above the rim.
          const slot = boxSlot(k, j, count);
          const small = (IN_BOX * BOX_TOY) / 2;
          expect(slot.x - small).toBeGreaterThanOrEqual(boxLeft(k) + 6);
          expect(slot.x + small).toBeLessThanOrEqual(boxLeft(k) + BOXES.w - 6);
          expect(slot.y - 2 * small).toBeLessThan(BOXES.rim);
        }
      }
    }
    const { toys } = boxesPlan(5 * 60_000, 3);
    for (const toy of toys) expect(toy.hop.peak - BOX_TOY).toBeGreaterThanOrEqual(80);
  });

  test("Five Boxes: toys and lids move as layers on one CSS animation each and snap to their place at the end, with no clip path (H-120)", async () => {
    for (const file of ["./boxes.tsx", "./hop.tsx"]) {
      const code = await Bun.file(new URL(file, import.meta.url)).text();
      expect(code).not.toMatch(/clip-?[pP]ath/);
    }
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    for (const part of ["hop", "hop-wait", "boxes-lid"]) expect(css, part).toMatch(new RegExp(`\\.tm-done \\.tm-${part}[,\\s{]`));
  });

  test("Road Rug: eight toys at five minutes, one at a time: a toy hops into the box, then the car drives on to the next, home as the time is up (H-122)", () => {
    expect(roadToyCount(5 * 60_000)).toBe(MAX_ROAD_TOYS);
    expect(roadToyCount(10_000)).toBe(MIN_ROAD_TOYS);
    expect(roadToyCount(3 * 3600_000)).toBe(MAX_ROAD_TOYS);
    for (const total of [10_000, 60_000, 5 * 60_000, 3 * 3600_000]) {
      const count = roadToyCount(total);
      const { toys, drives } = roadPlan(total, count);
      expect(toys).toHaveLength(count);
      expect(drives).toHaveLength(count);
      let before = 0;
      toys.forEach((toy, i) => {
        // The toy goes only once the car stands behind it, and the car sets off only once the toy is in the box.
        expect(toy.hop.start).toBeGreaterThanOrEqual(before);
        expect(toy.hop.land).toBeGreaterThan(toy.hop.start);
        if (toy.hop.waitFrom !== undefined) expect(toy.hop.waitFrom).toBeGreaterThanOrEqual(before);
        const drive = drives[i];
        expect(drive.start).toBeGreaterThanOrEqual(toy.hop.land);
        expect(drive.arrive).toBeGreaterThan(drive.start);
        expect(drive.from).toBeCloseTo(carStop(i, count));
        // It drives forward only, and stops before the next toy – never into it.
        expect(drive.to).toBeGreaterThan(drive.from);
        if (i + 1 < count) expect(drive.to + 0.44 * CAR).toBeLessThan(roadToyX(i + 1, count) - ROAD_TOY / 2);
        before = drive.arrive;
      });
      expect(drives[0].from).toBeCloseTo(CAR_START);
      expect(drives.at(-1)?.to).toBe(CAR_HOME);
      expect(drives.at(-1)?.arrive).toBeCloseTo(total);
    }
  });

  test("Road Rug: road, toys, car, house and box stay on the screen, the toys stand apart on the road, each lands on its own in the box (H-122)", () => {
    // The road winds gently: the car never tilts much.
    for (let x = CAR_START; x <= CAR_HOME; x += 10) expect(Math.abs(roadTilt(x))).toBeLessThanOrEqual(25);
    expect(ROAD.x0 - 60 - ROAD.w / 2).toBeGreaterThanOrEqual(200);
    expect(HOUSE.x + HOUSE.w + 14).toBeLessThanOrEqual(RIGHT_EDGE);
    expect(HOUSE.top - 80).toBeGreaterThanOrEqual(80);
    expect(CAR_HOME + 0.44 * CAR).toBeLessThanOrEqual(HOUSE.x);
    for (const count of [MIN_ROAD_TOYS, 6, MAX_ROAD_TOYS]) {
      for (let i = 0; i < count; i++) {
        const x = roadToyX(i, count);
        const foot = roadY(x) + ON_ROAD;
        expect(foot).toBeLessThanOrEqual(780);
        if (i > 0) expect(x - roadToyX(i - 1, count)).toBeGreaterThanOrEqual(ROAD_TOY);
      }
      // The car's back at the start stays on the rug's side of the screen.
      expect(carStop(0, count) - CAR / 2).toBeGreaterThanOrEqual(200);
    }
    const small = (ROAD_IN_BOX * ROAD_TOY) / 2;
    for (let j = 0; j < MAX_ROAD_TOYS; j++) {
      const slot = roadBoxSlot(j);
      expect(slot.x - small).toBeGreaterThanOrEqual(ROAD_BOX.x + 6);
      expect(slot.x + small).toBeLessThanOrEqual(ROAD_BOX.x + ROAD_BOX.w - 6);
      expect(slot.y - 2 * small).toBeLessThan(ROAD_BOX.rim);
      for (let m = 0; m < j; m++) {
        const other = roadBoxSlot(m);
        expect(Math.hypot(slot.x - other.x, slot.y - other.y)).toBeGreaterThanOrEqual(0.3 * ROAD_TOY);
      }
    }
    for (const toy of roadPlan(5 * 60_000, MAX_ROAD_TOYS).toys) expect(toy.hop.peak - ROAD_TOY).toBeGreaterThanOrEqual(80);
  });

  test("Road Rug: the car and the toys move as layers on one CSS animation each and snap to their place at the end, with no clip path (H-122)", async () => {
    const code = await Bun.file(new URL("./road.tsx", import.meta.url)).text();
    expect(code).not.toMatch(/clip-?[pP]ath/);
    // The car is the Tidy Up's own toy car, never a second drawing of one.
    expect(code).toContain('<ToyArt kind="car" />');
    expect(code).toContain('className="tm-hop tm-road-car"');
  });

  test("Block House: all twenty blocks at five minutes, one hop at a time, the house built from the bottom up, the last block landing as the time is up (H-125)", () => {
    expect(blockCount(5 * 60_000)).toBe(MAX_BLOCKS);
    expect(blockCount(10_000)).toBe(MIN_BLOCKS);
    expect(blockCount(3 * 3600_000)).toBe(MAX_BLOCKS);
    for (const total of [10_000, 60_000, 5 * 60_000, 3 * 3600_000]) {
      const count = blockCount(total);
      const { built, blocks } = blocksPlan(total, count);
      expect(built + blocks.length).toBe(MAX_BLOCKS);
      let before = 0;
      for (const [i, b] of blocks.entries()) {
        expect(b.k).toBe(built + i);
        expect(b.hop.start).toBeGreaterThanOrEqual(before);
        expect(b.hop.land - b.hop.start).toBeLessThanOrEqual(BLOCK_HOP_MS);
        expect(b.hop.land).toBeGreaterThan(b.hop.start);
        if (b.hop.waitFrom !== undefined) expect(b.hop.waitFrom).toBeGreaterThanOrEqual(before);
        before = b.hop.land;
      }
      expect(blocks.at(-1)?.hop.land).toBeCloseTo(total);
      // The cursor stands on each block's place until the one before has landed, never on a place already built.
      const frames = cursorFrames(blocks);
      expect(frames).toHaveLength(blocks.length);
      for (const [i, f] of frames.entries()) expect(f.at).toBe(i ? blocks[i - 1].hop.land : 0);
    }
  });

  test("Block House: every block rests on the one below or over an opening, built before it; the house, the jumble and every hop stay on the screen (H-125)", () => {
    const opening = (c: number, r: number) => WINDOWS.some((w) => w.c === c && w.r === r) || (c === DOOR.c && r >= DOOR.r && r < DOOR.r + DOOR.h);
    const places = SLOTS.map((s) => `${s.c},${s.r}`);
    expect(new Set(places).size).toBe(SLOTS.length);
    SLOTS.forEach((s, k) => {
      expect(opening(s.c, s.r)).toBe(false);
      if (s.r > 0) {
        const below = places.indexOf(`${s.c},${s.r - 1}`);
        expect(below >= 0 ? below < k : opening(s.c, s.r - 1), `${s.c},${s.r}`).toBe(true);
      }
      const foot = slotFoot(s.c, s.r);
      expect(foot.x + BLOCK / 2).toBeLessThanOrEqual(RIGHT_EDGE);
      expect(foot.y - BLOCK).toBeGreaterThanOrEqual(80);
    });
    expect(BLOCK_HOUSE.x).toBeGreaterThan(Math.max(...JUMBLE.map((j) => j.x + BLOCK / 2)) + 8);
    expect(JUMBLE).toHaveLength(MAX_BLOCKS);
    for (const j of JUMBLE) {
      expect(j.x - BLOCK / 2).toBeGreaterThanOrEqual(225);
      expect(j.y).toBeLessThanOrEqual(780);
      expect(Math.abs(j.tilt)).toBeLessThanOrEqual(10);
      // Blocks side by side in a row never stand in each other.
      for (const other of JUMBLE) if (other !== j && Math.abs(other.y - j.y) < 30) expect(Math.abs(other.x - j.x)).toBeGreaterThanOrEqual(BLOCK);
    }
    // Every place of the jumble is taken by exactly one block of the house.
    const { blocks } = blocksPlan(5 * 60_000, MAX_BLOCKS);
    expect(new Set(blocks.map((b) => `${b.hop.from.x},${b.hop.from.y}`)).size).toBe(MAX_BLOCKS);
    for (const b of blocks) expect(b.hop.peak - BLOCK).toBeGreaterThanOrEqual(80);
    expect(FACE + 20).toBe(BLOCK);
  });

  test("Block House: blocks, cursor and crumbs are layers on CSS animations that snap to their place at the end, with no clip path (H-125)", async () => {
    const code = await Bun.file(new URL("./blocks.tsx", import.meta.url)).text();
    expect(code).not.toMatch(/clip-?[pP]ath/);
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    for (const part of ["blocks-z", "blocks-cursor", "blocks-crumbs", "blocks-light"]) expect(css, part).toMatch(new RegExp(`\\.tm-done \\.tm-${part}[,\\s{]`));
    // Their stacking stays inside the picture, never above the end's light and trophy.
    expect(css).toMatch(/\.tm-blocks \{\s*isolation: isolate;/);
  });

  // User feedback, November 2026: the drawn fox and bear children in the timer's pictures (holding the basket and the
  // hose, blowing out the candle, taking turns) looked odd, and were taken out of every picture. The pictures tell
  // their story by themselves; Abwechseln's children are the real ones, their places two cushions.
  test("no timer picture draws a fox or bear figure", async () => {
    for await (const file of new Bun.Glob("src/games/timer/*.tsx").scan(".")) {
      const code = await Bun.file(file).text();
      expect(/<Mascot(Head)?[\s/>]|MASCOT_COLORS\.\w+\.paw/.test(code) ? `${file} draws a fox or bear` : file).toBe(file);
    }
  });

  test("Abwechseln keeps both cushions with their lamps and the toy on every screen, the same way either side of the hourglass (H-52)", () => {
    const half = SWAP_SEATS.w / 2;
    expect(SWAP_SEATS.fox - half).toBeGreaterThanOrEqual(200);
    expect(SWAP_SEATS.bear + half).toBeLessThanOrEqual(RIGHT);
    // Neither cushion nor the toy on it reaches under the hourglass.
    expect(SWAP_SEATS.fox + Math.max(half, TOY.w / 2)).toBeLessThanOrEqual(HOURGLASS_BOX.x);
    expect(SWAP_SEATS.bear - Math.max(half, TOY.w / 2)).toBeGreaterThanOrEqual(HOURGLASS_BOX.x + HOURGLASS_BOX.w);
    // Fair: both places as far from the hourglass's middle.
    expect(GLASS.cx - SWAP_SEATS.fox).toBe(SWAP_SEATS.bear - GLASS.cx);
    // The lamps' shades and the toy waiting in front of the hourglass are seen on a phone on its side too.
    expect(LAMP.rim - 30).toBeGreaterThanOrEqual(80);
    expect(TOY.waiting).toBeLessThanOrEqual(820);
    expect(TOY.onCushion - TOY.h).toBeGreaterThanOrEqual(80);
  });

  // H-109: the seesaw is the time – a seat sinks the whole turn long until it lies on its tyre, as the chick walks over to
  // it, then the other child's seat, up high, sinks. It must touch down for real, stay fair, tip far (user request,
  // 21 November 2026: a bigger board, a plainer motion) and be seen whole on a phone on its side.
  test("Wippe: the seat touches down on its tyre, both seats the same either side, and everything stays on the screen (H-109)", () => {
    const rad = (SAW_TILT * Math.PI) / 180;
    // Tipped, the plank's underside under the low seat lies exactly on the tyre's top, and the tyres lie under the seats.
    expect(SAW.y + SAW.thick / 2 + SAW.seat * Math.sin(rad)).toBeCloseTo(TYRE_TOP);
    expect(SAW.x - TYRE_X.fox).toBeCloseTo(TYRE_X.bear - SAW.x);
    expect(TYRE_TOP).toBeLessThan(SAW_GROUND);
    // A big board and a tilt a child sees from the sofa, and the plank's end never sinks into the ground.
    expect(SAW_TILT).toBeGreaterThanOrEqual(22);
    expect(SAW.thick).toBeGreaterThanOrEqual(40);
    expect(SAW.y + SAW.thick / 2 + SAW.half * Math.sin(rad)).toBeLessThan(SAW_GROUND);
    // Fair: the pivot in the middle of the stage, both seats as far from it.
    expect(SAW.x as number).toBe(STAGE_W / 2);
    // Level (at the end) the cushions stay within the screen's safe part.
    expect(SAW.x - SAW.seat - SEAT_CUSHION_W / 2).toBeGreaterThanOrEqual(200);
    expect(SAW.x + SAW.seat + SEAT_CUSHION_W / 2).toBeLessThanOrEqual(RIGHT_EDGE);
    // The chick walks between the cushions, never into them, and the cushion up high (its ears) and the chick at the
    // high end stay below the top.
    expect(WALKER.reach + WALKER.w / 2).toBeLessThanOrEqual(SAW.seat - SEAT_CUSHION_W / 2);
    const plankTop = SAW.y - SAW.thick / 2;
    expect(plankTop - WALKER.h - WALKER.reach * Math.sin(rad)).toBeGreaterThanOrEqual(80);
    expect(plankTop - 114 - SAW.seat * Math.sin(rad)).toBeGreaterThanOrEqual(80);
    // The chick walks far each turn, so its way is seen even on a long one.
    expect(WALKER.reach * 2).toBeGreaterThanOrEqual(500);
    // The plank turns round the pivot in the middle of its layer.
    expect(PLANK_BOX.x + PLANK_BOX.w / 2).toBe(SAW.x as number);
    expect(PLANK_BOX.y + PLANK_BOX.h / 2).toBe(SAW.y as number);
  });

  // November 2026: below the head, the row of lengths left a phone on its side too little room for the twelve cards, and
  // the Abwechseln group fell below the screen. In the head it stands beside the ribbon, in room taken anyway.
  test("the row of lengths stands in the menu's head, so every card fits on a phone on its side", async () => {
    expect(await Bun.file("src/games/timer/TimerGame.tsx").text()).toMatch(/<GameShell\s(?:(?!<\/GameShell|\/>\n)[\s\S])*?\slevelInHead\b/);
  });

  // User request, November 2026: Abwechseln's hourglass is the Sanduhr's own, not a second one built beside it.
  test("Abwechseln and Sanduhr draw the one shared hourglass", async () => {
    const swap = await Bun.file("src/games/timer/swap.tsx").text();
    expect(swap).toContain("<Hourglass");
    expect(swap).not.toMatch(/function bulbPath|BulbSand/);
    expect(SWAP_FLOOR).toBe(SAND_FLOOR);
  });

  // User feedback, 21 November 2026: no start sequence drawing a side at random – the fox child begins at once, shown
  // from the first second, and a grown-up gives the other child the first turn behind ⚙️.
  test("Abwechseln and the Wippe start with the fox child's turn, never with a draw", async () => {
    expect(FIRST_TURN).toBe("fox");
    const play = await Bun.file("src/games/timer/SwapPlay.tsx").text();
    expect(play).not.toMatch(/Math\.random|DRAW_STEPS|WHO_BEGINS/);
  });

  // The book's paper margin and the ⚙️ note lie over the stage's right edge (x 1400 at 4:3): a figure standing to 1380
  // was cut off there, so the new pictures keep what matters within 1340.
  const RIGHT = 1340;

  test("Sonnenaufgang: a big moon and sun in the very middle, the moon setting first, then the sun rising, behind the ridge (H-54)", () => {
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

  test("Blume: the stalk grows tall from a sprout to the ribbon, then opens; the water comes from a tap (H-53)", async () => {
    expect(STALK.top).toBeGreaterThan(STAKE.top);
    expect(STAKE.top - 20).toBeGreaterThanOrEqual(80 + 10);
    expect(STALK.soil - STALK.top).toBeGreaterThanOrEqual(600);
    // It is grown well before the end, so the petals opening one by one fill the rest of the time.
    expect(GROWN_AT).toBeGreaterThan(0.5);
    expect(GROWN_AT).toBeLessThanOrEqual(0.8);
    // A tap on a post, not a can that never runs dry: the hose, laid in a stick left of the bed, drips onto it.
    expect(TAP.x).toBeGreaterThanOrEqual(200);
    expect(TAP.x).toBeLessThan(HOLDER.x);
    expect(HOLDER.x).toBeLessThan(STALK.cx - 190);
    expect(SPOUT.x).toBeLessThan(STALK.cx);
    expect(STALK.soil).toBeLessThanOrEqual(820);
    expect(SPROUT).toBeGreaterThan(0);
    expect(SPROUT).toBeLessThan(0.2);
    expect(FLOWER_FLOOR).toBeLessThanOrEqual(820);
    // The plant grows as a whole while it rises (user feedback, November 2026): drawn smaller at the start, never so
    // small that less than the sprout would be left above the soil.
    expect(SPROUT_SIZE).toBeGreaterThan(SPROUT);
    expect(SPROUT_SIZE).toBeLessThan(0.6);
    // The flower when open stays on a phone held sideways (y from 80).
    expect(STALK.top + 24 - BLOOM / 2).toBeGreaterThanOrEqual(80 + 10);
    // The CSS grows the plant and then the flower at GROWN_AT, the flower as one layer, all petals at once.
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    expect(css).toContain(`animation: tm-bloom calc(var(--tm-ms) * ${+(1 - GROWN_AT).toFixed(2)}) linear calc(var(--tm-ms) * ${GROWN_AT}) forwards`);
    expect(css).toMatch(new RegExp(`@keyframes tm-grow-up \\{[^}]+\\}\\s*${GROWN_AT * 100}%`));
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

// What the Timer says comes in every app language (H-72): no line falls back to German in another language, and Russian,
// Chinese, Hindi and Arabic have no Latin letters in theirs.
test("every line the Timer says is in every app language, a new picture's English-first lines too", () => {
  const lines = [...Object.values(PICTURE_LINES).flatMap((p) => [p.start, p.end]), SOON_LINE, ...TURN_LINES];
  // The older lines are German first; a new picture's come English first (Tidy Up, H-118) and are translated into every
  // app language, German included, in the same commit (user decision, 22 November 2026).
  for (const line of lines) expect(APP_LANGUAGES.filter((language) => !line[language]?.trim())).toEqual([]);
  const german = new Set(timerSaid("de"));
  for (const language of APP_LANGUAGES) {
    const said = timerSaid(language);
    expect(said.length, language).toBe(new Set(lines.filter((line) => line[language] !== undefined).map((line) => line[language])).size);
    if (language === "de") continue;
    for (const line of said) {
      expect(german.has(line), `${language}: ${line}`).toBe(false);
      if (["ru", "zh", "hi", "ar"].includes(language)) expect(line, language).not.toMatch(/[A-Za-zäöüß]/);
    }
  }
});

describe("the bar along the bottom and the last moments", () => {
  test("the last moments are ten seconds, a quarter of a short run, and the bar is on by default", () => {
    expect(finalMs(5 * 60_000)).toBe(FINAL_MS);
    expect(finalMs(10_000)).toBe(2500);
    expect(FINAL_NOTES * 1000).toBeLessThanOrEqual(FINAL_MS);
    expect(DEFAULT_TIMER_SETTINGS.bar).toBe(true);
  });

  test("the bar and the last moments' light move only by transform and opacity, and the stage still covers the screen", async () => {
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    const frames = [...css.matchAll(/@keyframes (tm-bar-[\w-]+|tm-final-light) \{([\s\S]*?)\n\}/g)];
    expect(frames.length).toBeGreaterThanOrEqual(6);
    for (const [, name, body] of frames) {
      const props = [...body.matchAll(/([a-z-]+):/g)].map((m) => m[1]);
      for (const prop of props) expect(["transform", "opacity"], `${name}: ${prop}`).toContain(prop);
    }
    // Moved up into the room above the bar, the stage must still reach the screen's bottom edge (a dark strip showed).
    const stage = css.slice(css.indexOf(".tm-with-bar .tm-stage {"), css.indexOf("}", css.indexOf(".tm-with-bar .tm-stage {")));
    expect(stage).toContain("100cqh + var(--tm-bar-room)");
  });

  test("the pizza's toppings lie on the cheese, inside the tomato ring and the crust", () => {
    expect(new Set(TOPPINGS.map((t) => t.kind)).size).toBe(5);
    for (const t of TOPPINGS) expect(t.radius + 22).toBeLessThanOrEqual(PIZZA.r - 26);
  });
});
