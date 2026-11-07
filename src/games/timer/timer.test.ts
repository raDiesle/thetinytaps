import { describe, expect, test } from "bun:test";
import { nextPicture, PICTURES, TIMED_PICTURES } from "./content";
import { APPLE_FLOOR, appleRadius, BEE, BEES, CART, CART_MIDDLE, CROWN, HEAP_R, HEAP_ROWS, heapSlot, treeApples } from "./apples";
import { BAR, CLOCK, CLOCK_FLOOR, clockText, DIGITS } from "./clock";
import { BANDS, BITE_ORDER, BUTTERFLY, biteSpot, bitesPerBand, bodyFront, edgesAt, LEAF, LEAF_FLOOR, leafSpan, REACH } from "./caterpillar";
import { DISC, DOTS, dotAt } from "./disc";
import { BLOOM, FLOWER_FLOOR, GROWN_AT, HOLDER, SPOUT, SPROUT, SPROUT_SIZE, STAKE, STALK, TAP } from "./flower";
import { PIZZA, PIZZA_FLOOR, slice, SLICES, SLICE_SECONDS } from "./pizza";
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
import { ANTS, bulbBelow, CANDLE, COOKIE, FLAME_H, GLASS, GROUND, HILL, PLATE, SAND_FLOOR, STAGE_H, STAGE_W, TRAIN } from "./scenes";
import { SWAP_FLOOR, SWAP_GLASS, SWAP_SEATS, TOY } from "./swap";
import { DEFAULT_TIMER_SETTINGS, TIMER_SECONDS } from "./settings";

describe("Timer", () => {
  const RIGHT_EDGE = 1340;

  test("every picture has its own id, an emoji and a German name, they stand in the order the user asked for and „Weiter“ goes round all but Abwechseln", () => {
    expect(new Set(PICTURES.map((p) => p.id)).size).toBe(PICTURES.length);
    for (const p of PICTURES) {
      expect(p.emoji).not.toBe("");
      expect(p.name.de.trim()).not.toBe("");
    }
    // The order the user asked for (November 2026): Rote Scheibe, Sanduhr, Abwechseln, Kerze, Apfelbaum, Pizza, Wecker.
    expect(PICTURES.slice(0, 7).map((p) => p.id)).toEqual(["disc", "sand", "swap", "candle", "apple", "pizza", "clock"]);
    expect(DEFAULT_TIMER_SETTINGS.picture).toBe(PICTURES[0].id);
    // Abwechseln runs without end, so „Weiter“ never leads into it.
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

  test("each card is its picture at the end, with no words on it, and stands still in the menu (user request, November 2026)", async () => {
    const game = await Bun.file(new URL("./TimerGame.tsx", import.meta.url)).text();
    expect(game).toContain("art: <TimerCardArt picture={p.id}");
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    const still = css.match(/\.tm-card-art \* \{([^}]*)\}/)?.[1] ?? "";
    expect(still).toContain("animation: none !important");
    expect(still).toContain("will-change: auto !important");
  });

  test("the lengths are 10 seconds to 10 minutes, with 10 and 30 seconds (user request, November 2026), rising, and the default is one of them", () => {
    expect(TIMER_SECONDS.slice(0, 3)).toEqual([10, 30, 60]);
    expect(TIMER_SECONDS.at(-1)).toBe(600);
    expect([...TIMER_SECONDS].sort((a, b) => a - b)).toEqual([...TIMER_SECONDS]);
    expect(TIMER_SECONDS).toContain(DEFAULT_TIMER_SETTINGS.seconds as (typeof TIMER_SECONDS)[number]);
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
    // The leaf is eaten up to its stalk, never past it into the branch.
    for (const band of BANDS) expect(band.end).toBeGreaterThan(0);
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

  test("a step every second: the caterpillar bites once a second, as many bites as the run has seconds", () => {
    expect(runSeconds(20_000)).toBe(20);
    expect(runSeconds(400)).toBe(1);
    for (const count of [60, 137, 600]) {
      expect(bitesPerBand(count).reduce((a, b) => a + b, 0)).toBe(count);
      // Every band is eaten from its start to its end, exactly by the last bite.
      expect(edgesAt(0, count)).toEqual(BANDS.map((b) => b.start));
      edgesAt(count, count).forEach((edge, i) => expect(edge).toBeCloseTo(BANDS[i].end, 6));
      for (let bites = 0; bites < count; bites++) {
        const band = BITE_ORDER[bites % BITE_ORDER.length];
        const before = edgesAt(bites, count);
        const after = edgesAt(bites + 1, count);
        // One bite a second, on one band only.
        before.forEach((edge, i) => (i === band ? expect(after[i]).toBeLessThan(edge) : expect(after[i]).toBe(edge)));
      }
    }
  });

  test("Raupe: the head goes to each spot it bites, on the leaf, within reach of the body (user request, November 2026)", () => {
    for (const count of [10, 60, 600]) {
      for (let bites = 0; bites < count; bites++) {
        const spot = biteSpot(bites, count);
        const band = BANDS[BITE_ORDER[bites % BITE_ORDER.length]];
        // In the band that loses the bite, at its edge, where there is leaf.
        expect(spot.y).toBeGreaterThanOrEqual(band.top - 0.01);
        expect(spot.y).toBeLessThanOrEqual(band.top + LEAF.h / BANDS.length + 0.01);
        expect(spot.x).toBeLessThanOrEqual(edgesAt(bites, count)[BITE_ORDER[bites % BITE_ORDER.length]]);
        const span = leafSpan(spot.y);
        expect(span).toBeDefined();
        if (span) expect(spot.x).toBeGreaterThanOrEqual(span[0] - 30);
        const front = bodyFront(bites, count);
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

  // User feedback, November 2026: the drawn fox and bear children in the timer's pictures (holding the basket and the
  // hose, blowing out the candle, taking turns) looked odd, and were taken out of every picture. The pictures tell
  // their story by themselves; Abwechseln's children are the real ones, their places two cushions.
  test("no timer picture draws a fox or bear figure", async () => {
    for await (const file of new Bun.Glob("src/games/timer/*.tsx").scan(".")) {
      const code = await Bun.file(file).text();
      expect(/<Mascot(Head)?[\s/>]|MASCOT_COLORS\.\w+\.paw/.test(code) ? `${file} draws a fox or bear` : file).toBe(file);
    }
  });

  test("Abwechseln keeps both cushions, the hourglass and the toy on every screen, the toy never under the hourglass (H-52)", () => {
    expect(SWAP_SEATS.fox).toBeGreaterThanOrEqual(200);
    expect(SWAP_SEATS.bear + SWAP_SEATS.w).toBeLessThanOrEqual(RIGHT);
    const glassLeft = SWAP_GLASS.cx - SWAP_GLASS.w / 2;
    const glassRight = SWAP_GLASS.cx + SWAP_GLASS.w / 2;
    expect(TOY.fox + TOY.w).toBeLessThanOrEqual(glassLeft + 10);
    expect(TOY.bear).toBeGreaterThanOrEqual(glassRight - 10);
    // The toy lies right beside the cushion of the child whose turn it is: right of the fox child's, left of the bear child's.
    expect(TOY.fox).toBeGreaterThanOrEqual(SWAP_SEATS.fox + SWAP_SEATS.w - 10);
    expect(TOY.bear + TOY.w).toBeLessThanOrEqual(SWAP_SEATS.bear + 10);
    expect(SWAP_GLASS.top).toBeGreaterThanOrEqual(80 + 140);
    expect(SWAP_FLOOR + 10).toBeLessThanOrEqual(820);
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
