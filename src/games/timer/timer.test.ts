import { describe, expect, test } from "bun:test";
import { SCENARIOS } from "../../../tools/perfScenarios";
import { APP_LANGUAGES, firstLanguage, pick } from "@/lib/language";
import { nextPicture, PICTURES, TIMED_PICTURES } from "./content";
import { APPLE_FLOOR, appleRadius, BEE, BEES, CART, CART_MIDDLE, CROWN, HEAP_R, HEAP_ROWS, heapSlot, treeApples } from "./apples";
import { BAR, CLOCK, CLOCK_FLOOR, clockText, DIGITS } from "./clock";
import {
  BEAM_L,
  BLOCK,
  beamFrames,
  beamShades,
  beamTransform,
  blockCount,
  blockPose,
  blocksPlan,
  cursorFrames,
  DOOR,
  FACE,
  GEM,
  HOUSE as BLOCK_HOUSE,
  JUMBLE,
  MAX_BLOCKS,
  MIN_BLOCKS,
  SLOTS,
  SLIP,
  SLIP_FALL_MS,
  slotFoot,
  WINDOWS,
} from "./blocks";
import {
  CHEST,
  CRUMBLE_MS,
  digCount,
  HILL,
  MAX_DIG,
  MIN_DIG,
  PICK,
  pickCorner,
  ROOM,
  S as DIG,
  SPOTS,
  spotCorner,
  spotKind,
  toolFrames,
  TUNNEL,
  tunnelPlan,
} from "./tunnel";
import {
  ANCHOR,
  BASKET,
  CABIN,
  CAKE,
  cameraAt,
  carFrames,
  BITS,
  BURST,
  DECK,
  DIVE_SHARE,
  diveMs,
  FINAL,
  GROUND,
  gearLooks,
  HOP_MS,
  hopArc,
  jumpFrames,
  jumpPlan,
  leapsOf,
  MAX_MOVES,
  MIN_MOVES,
  MIN_UNIT,
  MOON as JUMP_MOON,
  moveCount,
  ORBIT,
  ORBIT_R,
  PACE,
  PLANET,
  POSE_OF,
  poseLooks,
  poseTimeline,
  RELEASE_Y,
  RUNNER,
  SHAFT,
  SHORE,
  SKYSCRAPER,
  SPOTS as HOP_SPOTS,
  squashFrames,
  STAR,
  STEPS,
  starAt,
  SURFACE,
  SWAY,
  swingCount,
  swingX,
  TREE,
  WORLD_H,
  wayOf,
} from "./jump";
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

  test("Block House: all twenty blocks at five minutes, carried one at a time, the house built from the bottom up, the last block landing as the time is up (H-125)", () => {
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
        // Each block is on its way its whole share: the beam turns onto it as the one before lands.
        expect(b.start).toBeCloseTo(before);
        expect(b.land).toBeGreaterThan(b.start);
        before = b.land;
      }
      expect(blocks.at(-1)?.land).toBeCloseTo(total);
      // The cursor stands on each block's place until the one before has landed, never on a place already built.
      const frames = cursorFrames(blocks);
      expect(frames).toHaveLength(blocks.length);
      for (const [i, f] of frames.entries()) expect(f.at).toBe(i ? blocks[i - 1].land : 0);
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
    expect(new Set(blocks.map((b) => `${b.from.x},${b.from.y}`)).size).toBe(MAX_BLOCKS);
    expect(FACE + 20).toBe(BLOCK);
  });

  test("Block House: the beam carries each block all its share – it moves every second, floats clear of the jumble, the house built and the crystal, and slips now and then (H-125)", () => {
    const overlap = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.abs(a.x - b.x) < FACE - 4 && Math.abs(a.y - b.y) < FACE - 4;
    for (const total of [60_000, 5 * 60_000, 3600_000]) {
      const { built, blocks } = blocksPlan(total, blockCount(total));
      for (const [i, b] of blocks.entries()) {
        // Lying still before its turn, resting on its place after it.
        expect(blockPose(b, b.start - 1)).toMatchObject({ ...b.from, rot: b.tilt });
        expect(blockPose(b, b.land)).toMatchObject({ ...b.to, rot: 0 });
        const share = b.land - b.start;
        // From the beam's grip to the landing it never stands still for a second (on a long run its bob, a second
        // at a time, shows the move where the way itself is slow).
        const lift = b.start + share * 0.07;
        if (total <= 5 * 60_000)
          for (let t = lift; t + 1000 <= b.land; t += 1000) {
            const a = blockPose(b, t);
            const c = blockPose(b, t + 1000);
            expect(Math.hypot(c.x - a.x, c.y - a.y), `${total} ${b.k} ${t}`).toBeGreaterThan(2);
          }
        // Floating across (and slipping), it never passes through a block still lying, a block of the house or the crystal.
        const lying = blocks.slice(i + 1).map((o) => o.from);
        const house = [...SLOTS.slice(0, built), ...blocks.slice(0, i).map((o) => SLOTS[o.k])].map((s) => slotFoot(s.c, s.r));
        for (let t = b.start + share * 0.3; t < b.land; t += share / 200) {
          const pose = blockPose(b, t);
          for (const o of [...lying, ...house]) expect(overlap(pose, o), `${b.k} over ${o.x},${o.y} at ${t}`).toBe(false);
          expect(pose.x + BLOCK / 2 < GEM.x || pose.x - BLOCK / 2 > GEM.x + GEM.w || pose.y - BLOCK > GEM.y + GEM.h).toBe(true);
          expect(pose.y - BLOCK).toBeGreaterThanOrEqual(80);
        }
      }
      // Every third block slips once on a long share, and the beam's light is off while it falls.
      const slipping = blocks.filter((b) => b.drop !== undefined);
      expect(slipping.length).toBe(Math.floor((blocks.length + 1) / 3));
      const shades = beamShades(blocks);
      for (const b of slipping) {
        const at = b.drop ?? 0;
        expect(blockPose(b, at + SLIP_FALL_MS).y - blockPose(b, at).y).toBeCloseTo(SLIP);
        expect(blockPose(b, at + SLIP_FALL_MS / 2).held).toBe(false);
        expect(shades.some((s) => s.at > at && s.at <= at + SLIP_FALL_MS && s.o === 0)).toBe(true);
      }
    }
    // A short run has no time to slip.
    expect(blocksPlan(10_000, blockCount(10_000)).blocks.every((b) => b.drop === undefined)).toBe(true);
  });

  test("Block House: the beam's tip lies on the carried block at every keyframe, reaching from the crystal's tip (H-125)", () => {
    expect(beamTransform({ x: GEM.tip.x, y: GEM.tip.y + BEAM_L })).toBe("rotate(0.00deg) scaleY(1.000)");
    const total = 5 * 60_000;
    const { blocks } = blocksPlan(total, blockCount(total));
    const frames = beamFrames(blocks);
    for (const b of blocks)
      for (const f of frames.filter((f) => f.at >= b.start + (b.land - b.start) * 0.07 && f.at <= b.land)) {
        const pose = blockPose(b, f.at);
        expect(f.transform).toBe(beamTransform({ x: pose.x, y: pose.y - BLOCK / 2 }));
      }
    for (let i = 1; i < frames.length; i++) expect(frames[i].at).toBeGreaterThanOrEqual(frames[i - 1].at);
  });

  test("Block House: blocks, beam, crystal, cursor and crumbs are layers on CSS animations that snap to their place at the end, with no clip path (H-125)", async () => {
    const code = await Bun.file(new URL("./blocks.tsx", import.meta.url)).text();
    expect(code).not.toMatch(/clip-?[pP]ath/);
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    for (const part of ["blocks-z", "blocks-cursor", "blocks-crumbs", "blocks-light", "blocks-block", "blocks-aura", "blocks-beam", "blocks-halo"])
      expect(css, part).toMatch(new RegExp(`\\.tm-done \\.tm-${part}[,\\s{]`));
    // Their stacking stays inside the picture, never above the end's light and trophy.
    expect(css).toMatch(/\.tm-blocks \{\s*isolation: isolate;/);
  });

  test("Treasure Tunnel: all twenty blocks at five minutes, dug one after the other from the entrance, the last gone as the time is up (H-126)", () => {
    expect(digCount(5 * 60_000)).toBe(MAX_DIG);
    expect(digCount(10_000)).toBe(MIN_DIG);
    expect(digCount(3 * 3600_000)).toBe(MAX_DIG);
    for (const total of [10_000, 60_000, 5 * 60_000, 3 * 3600_000]) {
      const { dug, unit, blocks } = tunnelPlan(total, digCount(total));
      expect(dug + blocks.length).toBe(MAX_DIG);
      for (const [i, b] of blocks.entries()) {
        expect(b.k).toBe(dug + i);
        expect(b.gone).toBeCloseTo((i + 1) * unit);
        // It crumbles within its own share, after its last crack (three quarters in), never longer than CRUMBLE_MS.
        expect(b.crumble).toBeGreaterThan(i * unit + unit * 0.75);
        expect(b.gone - b.crumble).toBeLessThanOrEqual(CRUMBLE_MS);
      }
      expect(blocks.at(-1)?.gone).toBeCloseTo(total);
      // The pickaxe and the frame stand at each block from the moment the one before is gone.
      const frames = toolFrames(blocks, pickCorner, PICK.size);
      for (const [i, f] of frames.entries()) expect(f.at).toBe(i ? blocks[i - 1].gone : 0);
    }
  });

  test("Treasure Tunnel: dug column by column from the entrance, the top first; the tunnel lies inside the hill, and tunnel, chest and pickaxe stay on the screen (H-126)", () => {
    expect(SPOTS).toHaveLength(TUNNEL.cols * TUNNEL.rows);
    expect(new Set(SPOTS.map((p) => `${p.c},${p.r}`)).size).toBe(SPOTS.length);
    SPOTS.forEach((p, k) => {
      if (k) expect(p.c * 2 + (1 - p.r)).toBe(SPOTS[k - 1].c * 2 + (1 - SPOTS[k - 1].r) + 1);
      // Every block of the tunnel has the hill above it, at least a block of dirt under its grass.
      expect(HILL[p.c]).toBeGreaterThanOrEqual(TUNNEL.rows + 1);
      const corner = spotCorner(k);
      expect(corner.y).toBeGreaterThanOrEqual(80);
      // Each block's pickaxe stands within the picture, its tip at the block.
      const pick = pickCorner(k);
      expect(pick.x + PICK.hand.x).toBeGreaterThanOrEqual(200);
      expect(pick.y).toBeGreaterThanOrEqual(80);
      expect(pick.x + PICK.tip.x).toBeCloseTo(corner.x + 4);
    });
    expect(new Set(SPOTS.map((_, k) => spotKind(k)))).toEqual(new Set(["dirt", "stone", "gold"]));
    // The room and its chest come right after the tunnel, inside the room, left of the paper margin.
    expect(ROOM.x).toBe(TUNNEL.x + TUNNEL.cols * DIG);
    expect(CHEST.cx - CHEST.w / 2).toBeGreaterThanOrEqual(ROOM.x);
    expect(CHEST.cx + CHEST.w / 2).toBeLessThanOrEqual(Math.min(ROOM.x + ROOM.cols * DIG, RIGHT_EDGE));
    expect(CHEST.body + CHEST.lid).toBeLessThan(TUNNEL.rows * DIG);
    // The hill reaches the stage's right edge, and its top stays below the top of what every screen shows.
    expect(TUNNEL.x + HILL.length * DIG).toBeGreaterThanOrEqual(1600);
    for (const n of HILL) expect(TUNNEL.floor - n * DIG).toBeGreaterThanOrEqual(80);
  });

  test("Treasure Tunnel: blocks, cracks and pickaxe are layers on CSS animations that are put away at the end, with no clip path (H-126)", async () => {
    const code = await Bun.file(new URL("./tunnel.tsx", import.meta.url)).text();
    expect(code).not.toMatch(/clip-?[pP]ath/);
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    for (const part of ["tunnel-block", "tunnel-crack", "tunnel-swing", "tunnel-pick", "tunnel-cracks", "tunnel-lid", "tunnel-light"])
      expect(css, part).toMatch(new RegExp(`\\.tm-done \\.tm-${part}[,\\s{]`));
  });

  test("Up to the Moon: every move at five minutes, quick hops and slow ways one after the other, then the way down as a fifth of the time, landing as it is up (H-127)", () => {
    expect(moveCount(5 * 60_000)).toBe(MAX_MOVES);
    expect(moveCount(10_000)).toBe(MIN_MOVES);
    expect(moveCount(3 * 3600_000)).toBe(MAX_MOVES);
    for (const total of [10_000, 60_000, 5 * 60_000, 3 * 3600_000]) {
      const { first, unit, leap, moves, dive } = jumpPlan(total, moveCount(total));
      // It always ends on the moon, a short time starting further up, never hurrying.
      expect(first + moves.length).toBe(MAX_MOVES);
      if (moves.length > MIN_MOVES) expect(unit).toBeGreaterThanOrEqual(MIN_UNIT);
      // User feedback, 23 November 2026: never standing still and then a quick move – each move leaves as the one
      // before lands, its star caught halfway. A hop is quick, `HOP_MS` a leap (slow leaps looked odd), and the slow
      // ways – swimming, the lift, the balloons, space – take the time the hops leave, by their pace.
      expect(leap).toBeLessThanOrEqual(HOP_MS);
      expect(HOP_MS).toBeLessThanOrEqual(1200);
      for (const [i, m] of moves.entries()) {
        expect(m.k).toBe(first + i);
        expect(m.kind).toBe(HOP_SPOTS[m.k + 1].by!);
        expect(m.start).toBeCloseTo(i ? moves[i - 1].land : 0);
        expect(m.star).toBeCloseTo((m.start + m.land) / 2);
        if (m.kind === "hop") expect(m.land - m.start, `hop ${m.k}`).toBeCloseTo(leapsOf(m.k) * leap);
      }
      expect(moves.at(-1)!.land).toBeCloseTo(total - diveMs(total));
      const slow = moves.slice(0, -1).filter((m) => m.kind !== "hop");
      const per = (m: (typeof moves)[number]) => (m.land - m.start) / (PACE[m.kind as keyof typeof PACE] * (HOP_SPOTS[m.k + 1].slow ?? 1));
      for (const m of slow) expect(per(m) / per(slow[0]), `move ${m.k}`).toBeCloseTo(1);
      for (const m of slow) expect(m.land - m.start, `move ${m.k}`).toBeGreaterThan(leap);
      // The way down is part of the timer, slow enough to see every place it passes (user feedback, 23 November 2026).
      expect(dive.start).toBeCloseTo(moves.at(-1)!.land);
      expect(dive.land - dive.start).toBeCloseTo(diveMs(total));
      expect(diveMs(total)).toBeCloseTo(total * DIVE_SHARE);
      expect(DIVE_SHARE).toBeGreaterThanOrEqual(0.15);
      expect(dive.top).toBeGreaterThan(dive.start);
      expect(dive.release).toBeGreaterThan(dive.top);
      expect(dive.land).toBe(total);
      // Most of it under the parachute, at a pace the eye can follow: at five minutes under a screen every 10 seconds.
      expect(dive.release - dive.top).toBeGreaterThan((dive.land - dive.start) * 0.7);
      if (total === 5 * 60_000) expect((HOP_SPOTS[MAX_MOVES].y - RELEASE_Y) / 900 / ((dive.release - dive.top) / 1000)).toBeLessThan(0.1);
      // The keyframes go forward in time, so neither the fox nor the picture ever jumps back.
      const frames = jumpFrames(first, moves, dive);
      for (const list of Object.values(frames)) for (let i = 1; i < list.length; i++) expect(list[i].at).toBeGreaterThanOrEqual(list[i - 1].at);
      for (const g of Object.values(gearLooks(first, moves, dive)))
        for (let i = 1; i < g.frames.length; i++) expect(g.frames[i].at).toBeGreaterThanOrEqual(g.frames[i - 1].at);
      // It is on its way all the time: no two keyframes of its way up stand at the same place, and they move evenly
      // (an even pace, `linear`), so the picture goes up all the way.
      const climb = frames.upDown.filter((f) => f.at > 0 && f.at <= dive.start);
      expect(climb.length).toBeGreaterThanOrEqual(moves.length);
      for (const list of [frames.across, frames.upDown])
        for (let i = 1; i < list.length; i++)
          if (list[i].at <= dive.start && list[i].at > list[i - 1].at)
            expect(list[i].transform !== list[i - 1].transform || frames[list === frames.across ? "upDown" : "across"].some((f) => f.at === list[i].at)).toBe(
              true,
            );
      // The picture follows at an even pace, never up and down with each hop; the fox's way up and down is even too,
      // but for its hops, which rise slowing to their top and fall from it (user request, 23 November 2026: hopping
      // up the tree's steps), each with its top between leaving and landing.
      for (const f of frames.camera.filter((f) => f.at < dive.start)) expect(f.ease ?? "linear").toBe("linear");
      expect(new Set(frames.upDown.filter((f) => f.at < dive.start).map((f) => f.ease ?? "linear")).size).toBeLessThanOrEqual(3);
      for (const m of moves.filter((m) => m.kind === "hop"))
        expect(frames.upDown.filter((f) => f.at > m.start && f.at < m.land && f.ease !== "linear").length, `hop ${m.k}`).toBeGreaterThanOrEqual(1);
      // Its body bounces like a rubber ball on every hop (user request, 23 November 2026): squashed as it pushes off
      // and as it lands, stretched as it goes up – and plain again between hops.
      const squash = frames.squash;
      for (const m of moves.filter((m) => m.kind === "hop")) {
        const during = squash.filter((f) => f.at >= m.start && f.at <= m.land);
        expect(
          during.some((f) => /scale\(1\.\d+, 0\.\d+\)/.test(f.transform)),
          `crouch ${m.k}`,
        ).toBe(true);
        expect(
          during.some((f) => /scale\(0\.\d+, 1\.\d+\)/.test(f.transform)),
          `stretch ${m.k}`,
        ).toBe(true);
      }
      for (const m of slow) expect(squash.filter((f) => f.at > m.start + 400 && f.at < m.land).every((f) => f.transform === "scale(1, 1)")).toBe(true);
    }
  });

  test("Up to the Moon: a hop squashes, stretches and lands again, its frames in order and its body back to round (H-127)", () => {
    const frames = squashFrames([
      { from: 1000, to: 2000 },
      { from: 2000, to: 3000 },
    ]);
    for (let i = 1; i < frames.length; i++) expect(frames[i].at).toBeGreaterThanOrEqual(frames[i - 1].at);
    expect(frames.at(-1)!.transform).toBe("scale(1, 1)");
    expect(frames.filter((f) => f.at === 2000).length).toBeGreaterThanOrEqual(1);
  });

  test("Up to the Moon: on every move it is somewhere new each second, never waiting in place (H-127)", () => {
    const total = 5 * 60_000;
    const { first, moves, dive } = jumpPlan(total, moveCount(total));
    const { across, upDown } = jumpFrames(first, moves, dive);
    const value = (list: { at: number; transform: string }[], ms: number) => {
      const i = list.findIndex((f) => f.at > ms);
      const [a, b] = [list[i - 1], list[i]];
      const num = (f: { transform: string }) => Number(f.transform.match(/-?[\d.]+/)![0]);
      return num(a) + (num(b) - num(a)) * ((ms - a.at) / (b.at - a.at));
    };
    for (let ms = 1000; ms < dive.start; ms += 1000) {
      const moved = Math.abs(value(across, ms) - value(across, ms - 1000)) + Math.abs(value(upDown, ms) - value(upDown, ms - 1000));
      expect(moved, `second ${ms / 1000}`).toBeGreaterThan(5);
    }
  });

  test("Up to the Moon: under the parachute it swings from side to side, staying on a tablet's screen, and drops straight into the cake (H-127)", () => {
    for (const total of [10_000, 5 * 60_000, 3 * 3600_000]) {
      const { dive } = jumpPlan(total, moveCount(total));
      const n = swingCount(dive);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(60);
      const from = HOP_SPOTS[MAX_MOVES].x - 50;
      for (let j = 1; j <= n; j++) {
        expect(swingX(from, j, n) - RUNNER / 2).toBeGreaterThanOrEqual(235);
        expect(swingX(from, j, n) + RUNNER / 2).toBeLessThanOrEqual(RIGHT_EDGE);
      }
      expect(swingX(from, n, n)).toBe(FINAL.x);
    }
    expect(SWAY).toBeGreaterThan(30);
    expect(RELEASE_Y).toBeLessThan(CAKE.top - 150);
  });

  test("Up to the Moon: the cake bursts all over as it lands – pieces in every direction, near and far, seen on a tablet's screen (H-127)", () => {
    expect(BITS.length).toBeGreaterThanOrEqual(20);
    const shown = cameraAt(FINAL.y);
    const sides = { left: 0, right: 0, up: 0 };
    for (const b of BITS) {
      // On the end's screen (above the bar), and most within what a tablet shows.
      expect(b.y - b.size / 2 - shown).toBeGreaterThanOrEqual(0);
      expect(b.y + b.size / 2 - shown).toBeLessThanOrEqual(820);
      expect(b.x + b.size / 2).toBeLessThanOrEqual(RIGHT_EDGE);
      if (b.x < BURST.x - 100) sides.left++;
      if (b.x > BURST.x + 100) sides.right++;
      if (b.y < BURST.y - 100) sides.up++;
    }
    // Only the few lying far left are for a wide screen alone.
    expect(BITS.filter((b) => b.x - b.size / 2 >= 235).length).toBeGreaterThanOrEqual(BITS.length - 3);
    expect(sides.left).toBeGreaterThanOrEqual(5);
    expect(sides.right).toBeGreaterThanOrEqual(10);
    expect(sides.up).toBeGreaterThanOrEqual(5);
    // Far as well as near: some fly across the meadow onto the lake.
    expect(Math.min(...BITS.map((b) => b.x - BURST.x))).toBeLessThan(-550);
    expect(BITS.filter((b) => b.x < SHORE).length).toBeGreaterThanOrEqual(3);
  });

  test("Up to the Moon: the way climbs from the lake's floor to the moon, each height its own way to move, and stays on every screen (H-127)", () => {
    const kinds = HOP_SPOTS.slice(1).map((s) => s.by);
    // Swimming in the lake, hopping up the tree, the cable car to the skyscraper's window, the glass lift, the balloons
    // past the clouds, the jetpack in space – in that order (user request, 23 November 2026).
    expect(kinds.filter((k, i) => k !== kinds[i - 1])).toEqual(["swim", "walk", "hop", "ride", "hop", "lift", "hop", "fly", "jet"]);
    // Out of the water it walks on the meadow first, then hops (user request, 23 November 2026).
    const walk = HOP_SPOTS.findIndex((s) => s.by === "walk");
    expect(HOP_SPOTS[walk].y).toBe(GROUND);
    expect(HOP_SPOTS[walk].x).toBeGreaterThan(SHORE);
    expect(HOP_SPOTS[walk + 1].by).toBe("hop");
    // Swimming, the lift, the balloons and space go slower than walking (user request, 23 November 2026).
    for (const kind of ["swim", "lift", "fly", "jet"] as const) expect(PACE[kind], kind).toBeGreaterThan(PACE.walk);
    // It starts under water and ends at the top, going up all the way (a leap never higher than a fox can hop).
    expect(HOP_SPOTS[0].y).toBeGreaterThan(SURFACE + 300);
    expect(HOP_SPOTS.at(-1)!.y).toBeLessThan(600);
    for (let k = 1; k < HOP_SPOTS.length; k++) {
      const s = HOP_SPOTS[k];
      expect(s.y - HOP_SPOTS[k - 1].y, `spot ${k}`).toBeLessThanOrEqual(30);
      if (s.by === "hop") {
        const way = wayOf(k - 1);
        for (let j = 1; j < way.length; j++) expect(way[j - 1].y - way[j].y, `hop ${k}, leap ${j}`).toBeLessThanOrEqual(130);
      }
    }
    // A hop's arc rises over its higher end, its top later the higher it goes.
    const arc = hopArc(STEPS[0], STEPS[1]);
    expect(arc.y).toBeLessThan(STEPS[1].y);
    expect(arc.at).toBeGreaterThan(0.5);
    expect(arc.at).toBeLessThan(1);
    // Swimming stays in the water, everything after it above.
    for (const s of HOP_SPOTS) if (s.by === "swim" || s === HOP_SPOTS[0]) expect(s.y).toBeGreaterThan(SURFACE);
    // Within what a tablet shows (x 200–1400 less the paper's margin), the fox and its stars.
    for (const s of HOP_SPOTS) {
      expect(s.x - RUNNER / 2).toBeGreaterThanOrEqual(235);
      expect(s.x + RUNNER / 2).toBeLessThanOrEqual(RIGHT_EDGE);
    }
    for (let k = 0; k < MAX_MOVES; k++) {
      const star = starAt(k);
      expect(star.x - STAR / 2).toBeGreaterThanOrEqual(235);
      expect(star.x + STAR / 2).toBeLessThanOrEqual(RIGHT_EDGE);
      expect(star.y - STAR / 2).toBeGreaterThanOrEqual(0);
    }
    // Nothing stands in the water (user feedback, 23 November 2026: high-rises standing in the lake made no sense): the
    // tree, the skyscraper and the cake stand on the meadow right of the shore.
    expect(TREE.x - TREE.half).toBeGreaterThan(SHORE);
    expect(SKYSCRAPER.x).toBeGreaterThan(SHORE);
    expect(CAKE.x - CAKE.low / 2).toBeGreaterThan(SHORE);
    // The trunk's steps go up left and right in turn, like a treehouse's, and every leap onto the trunk lands on one of
    // them or on the treehouse's floor.
    STEPS.forEach((st, i) => {
      expect(Math.sign(st.x - TREE.x)).toBe(i % 2 ? 1 : -1);
      if (i) expect(st.y).toBeLessThan(STEPS[i - 1].y);
    });
    const onTree = HOP_SPOTS.flatMap((s, k) => (k && s.by === "hop" ? wayOf(k - 1).slice(1) : [])).filter(
      (p) => Math.abs(p.x - TREE.x) <= TREE.half && p.y < GROUND,
    );
    expect(onTree.length).toBeGreaterThanOrEqual(STEPS.length);
    for (const p of onTree) expect(STEPS.some((st) => st.x === p.x && st.y === p.y) || p.y === DECK.y, `${p.x},${p.y}`).toBe(true);
    expect(HOP_SPOTS.some((s) => s.y === DECK.y && s.x > DECK.left && s.x < DECK.right)).toBe(true);
    // It rides the basket from the treehouse to the skyscraper's window and the lift in its shaft up to the roof.
    expect(HOP_SPOTS[BASKET.from].x).toBeGreaterThan(DECK.right);
    expect(HOP_SPOTS[BASKET.to].x + RUNNER / 2).toBeLessThan(SKYSCRAPER.x + 20);
    for (let k = CABIN.from; k <= CABIN.to; k++) expect(HOP_SPOTS[k].x).toBe(SHAFT.x);
    expect(HOP_SPOTS[CABIN.to].y).toBe(SKYSCRAPER.top);
    expect(HOP_SPOTS.some((s) => s.y === SKYSCRAPER.top && s.x > SKYSCRAPER.x && s.x < SKYSCRAPER.x + SKYSCRAPER.w && s.x !== SHAFT.x)).toBe(true);
    expect(HOP_SPOTS.at(-1)!.y).toBe(JUMP_MOON.cy - JUMP_MOON.r);
    // With the jetpack it flies once round the moon before landing on top of it (user request, 23 November 2026):
    // the way's angle round the moon turns a whole circle, clear of the moon and the planet, on a tablet's screen.
    const last = HOP_SPOTS.at(-1)!;
    expect(last.via).toBe(ORBIT);
    let turned = 0;
    const angle = (p: { x: number; y: number }) => Math.atan2(p.y - JUMP_MOON.cy, p.x - JUMP_MOON.cx);
    for (let i = 1; i < ORBIT.length; i++) {
      let d = angle(ORBIT[i]) - angle(ORBIT[i - 1]);
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      turned += d;
    }
    expect(Math.abs(turned)).toBeGreaterThanOrEqual(2 * Math.PI);
    expect(ORBIT_R).toBeGreaterThan(JUMP_MOON.r + RUNNER * 0.6);
    for (const p of ORBIT) {
      expect(Math.hypot(p.x - PLANET.cx, p.y - PLANET.cy)).toBeGreaterThan(PLANET.r);
      expect(p.x - RUNNER / 2).toBeGreaterThanOrEqual(235);
      expect(p.x + RUNNER / 2).toBeLessThanOrEqual(RIGHT_EDGE);
      expect(p.y - RUNNER).toBeGreaterThanOrEqual(0);
    }
    // The cake stands on the meadow, seen whole, and the fox ends in it.
    expect(CAKE.x - CAKE.low / 2).toBeGreaterThanOrEqual(235);
    expect(FINAL.x).toBe(CAKE.x);
    expect(FINAL.y).toBeLessThan(GROUND);
    expect(FINAL.y).toBeGreaterThan(CAKE.top);
  });

  test("Up to the Moon: the fox moves as it goes – its own pose for each kind of move, and the cars it rides go along with it (H-127)", () => {
    for (const total of [10_000, 5 * 60_000]) {
      const { first, moves, dive } = jumpPlan(total, moveCount(total));
      const line = poseTimeline(moves, dive);
      const poseAt = (ms: number) => [...line].reverse().find((p) => p.from <= ms)!.pose;
      for (const m of moves) expect(poseAt((m.start + m.land) / 2), `move ${m.k}`).toBe(POSE_OF[m.kind]);
      // Leaping off the moon, hanging from the parachute all the way down, dropping into the cake.
      expect(poseAt((dive.start + dive.top) / 2)).toBe("drop");
      expect(poseAt((dive.top + dive.release) / 2)).toBe("hang");
      expect(poseAt(total)).toBe("drop");
      // Exactly one pose shown at every moment, and only the last one left at the end.
      const looks = poseLooks(moves, dive, total);
      const shownAt = (frames: { at: number; css: string }[], ms: number) => [...frames].reverse().find((l) => l.at <= ms)!.css === "opacity: 1";
      for (const ms of [0, ...moves.map((m) => (m.start + m.land) / 2), (dive.top + dive.release) / 2, total])
        expect(Object.values(looks).filter((l) => shownAt(l.frames, ms)).length, `at ${ms}`).toBe(1);
      expect(
        Object.entries(looks)
          .filter(([, l]) => l.end === 1)
          .map(([p]) => p),
      ).toEqual(["drop"]);
      // A car waits where the fox gets in, goes with it step for step while it rides, and stays where it got out.
      for (const car of [BASKET, CABIN]) {
        const frames = carFrames(car, first, moves);
        if (first <= car.from) expect(frames[0].transform).toBe("translate(0.00%, 0.00%)");
        for (const f of frames) expect(f.ease).toBe("linear");
        const rides = moves.filter((m) => m.k >= car.from && m.k < car.to);
        expect(frames.length).toBe(1 + rides.length * 2);
        for (const m of rides) expect(frames.some((f) => f.at === m.land)).toBe(true);
      }
    }
  });

  test("Up to the Moon: the picture follows the fox, keeping it on the screen and never looking past the world's top or bottom (H-127)", () => {
    for (const s of [...HOP_SPOTS, FINAL]) {
      const c = cameraAt(s.y);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(WORLD_H - 900);
      // Its feet on the screen, with room above it for the fox and below it above the bar.
      expect(s.y - c).toBeGreaterThanOrEqual(RUNNER + 80);
      expect(s.y - c).toBeLessThanOrEqual(820);
    }
    expect(cameraAt(HOP_SPOTS[0].y)).toBe(WORLD_H - 900);
    expect(cameraAt(HOP_SPOTS.at(-1)!.y)).toBe(0);
    expect(cameraAt(1000)).toBe(1000 - ANCHOR);
    // The cake is seen at the end, whole.
    expect(CAKE.top - 40 - cameraAt(FINAL.y)).toBeGreaterThanOrEqual(80);
  });

  test("Up to the Moon: what it carries comes and goes on its way – the balloons past the clouds, the parachute on the way down (H-127)", () => {
    const at = (looks: { at: number; css: string }[], ms: number) =>
      [...looks]
        .reverse()
        .find((l) => l.at <= ms)!
        .css.startsWith("opacity: 1");
    const balloonsFrom = HOP_SPOTS.findIndex((s) => s.by === "fly") - 1;
    const jetpackFrom = HOP_SPOTS.findIndex((s) => s.by === "jet") - 1;
    for (const total of [10_000, 5 * 60_000]) {
      const { first, moves, dive } = jumpPlan(total, moveCount(total));
      const gear = gearLooks(first, moves, dive);
      // Started low, the balloons and the jetpack wait for it; started higher up, what it passed is already taken.
      expect(at(gear["waiting-balloons"].frames, 0)).toBe(first <= balloonsFrom);
      expect(at(gear["waiting-jetpack"].frames, 0)).toBe(first <= jetpackFrom);
      expect(at(gear.balloons.frames, 0)).toBe(first > balloonsFrom && first <= jetpackFrom);
      // The balloons are held all the way from the roof to the highest cloud, then let go.
      for (const m of moves.filter((m) => m.kind === "fly")) expect(at(gear.balloons.frames, (m.start + m.land) / 2), `move ${m.k}`).toBe(true);
      for (const m of moves.filter((m) => m.kind === "jet")) expect(at(gear.balloons.frames, m.land), `move ${m.k}`).toBe(false);
      // What waits is the very thing it takes (user feedback, 23 November 2026: two sets of balloons were seen at
      // once): the one waiting and the one held are never shown together.
      for (let ms = 0; ms <= total; ms += total / 2000) {
        expect(at(gear["waiting-balloons"].frames, ms) && at(gear.balloons.frames, ms), `balloons at ${ms}`).toBe(false);
      }
      // The jetpack waits on the highest cloud until the fox has floated in front of it and docked it.
      const arrive = moves.find((m) => m.k === jetpackFrom - 1);
      if (arrive) expect(at(gear["waiting-jetpack"].frames, arrive.land)).toBe(true);
      // At the end nothing is held any more (the jetpack is part of the fox's poses), the parachute let go.
      for (const g of ["balloons", "parachute", "waiting-balloons", "waiting-jetpack"] as const) {
        expect(at(gear[g].frames, total), g).toBe(false);
        expect(gear[g].end).toBe(0);
      }
      // The parachute is open all the way down, and only then.
      expect(at(gear.parachute.frames, dive.start)).toBe(false);
      expect(at(gear.parachute.frames, dive.top)).toBe(true);
      expect(at(gear.parachute.frames, (dive.top + dive.release) / 2)).toBe(true);
    }
  });

  test("Up to the Moon: the world, the fox and what it carries are layers on CSS animations that stop at the end, with no clip path (H-127)", async () => {
    const code = await Bun.file(new URL("./jump.tsx", import.meta.url)).text();
    expect(code).not.toMatch(/clip-?[pP]ath/);
    // Nothing in space looks like a second moon (user feedback, 23 November 2026: a grey half rock was taken out).
    expect(code).not.toMatch(/asteroid/i);
    // The world moves as one layer by a transform, never by a changing viewBox.
    expect(code).not.toMatch(/viewBox=\{`[^`]*\$\{c/);
    const css = await Bun.file(new URL("./timer.css", import.meta.url)).text();
    for (const part of [
      "jump-bob",
      "jump-star",
      "jump-fade",
      "jump-cherry",
      "jump-cake-whole",
      "jump-cake-smashed",
      "jump-bits",
      "jump-bit-x",
      "jump-bit-y",
      "jump-bit-spin",
      "jump-limb",
      "jump-flame",
      "jump-ring",
      "jump-spark",
      "jump-crown",
      "jump-bird",
      "jump-wing",
      "jump-fish",
      "jump-bubble",
      "jump-wind",
      "jump-twinkle",
      "jump-comet",
      "hop",
    ])
      expect(css, part).toMatch(new RegExp(`\\.tm-done \\.tm-${part}[,\\s{]`));
  });

  // User feedback, November 2026: the drawn fox and bear children in the timer's pictures (holding the basket and the
  // hose, blowing out the candle, taking turns) looked odd, and were taken out of every picture. The pictures tell
  // their story by themselves; Abwechseln's children are the real ones, their places two cushions.
  // The one exception is Up to the Moon's fox (`jumpFox.tsx`): it is the figure doing the run, swimming, hopping and
  // riding, never one standing by (user request, 23 November 2026), drawn with the shared head.
  test("no timer picture draws a fox or bear figure", async () => {
    for await (const file of new Bun.Glob("src/games/timer/*.tsx").scan(".")) {
      if (file.endsWith("jumpFox.tsx")) continue;
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

describe("pause and start over", () => {
  // User request, 23 November 2026: every timer can be paused and started over, from the bar's start.
  test("every run mounts the pause and hands its clock to the pictures", async () => {
    for (const file of ["./TimerPlay.tsx", "./SwapPlay.tsx"]) {
      const code = await Bun.file(new URL(file, import.meta.url)).text();
      expect(code).toContain("usePausableClock()");
      expect(code).toContain("<RunClockProvider value={clock}>");
      expect(code).toContain("<PauseControls paused={paused} onPause={pause} onResume={resume} onRestart={onAgain} />");
      // A tap on the picture answers and pauses (user decision, 23 November 2026); keys only answer.
      expect(code).toMatch(/const down = \(e: PointerEvent\) => \{\s*answer\(e\.clientX, e\.clientY\);\s*if \([^)]*\) pause\(\);/);
    }
  });

  // What a picture works out from the clock (bites, digits, turns, the bar) reads the run's clock, never the real one,
  // or it went on while paused. Only the start screen, the own time's sheet, a menu's card and the clock itself may.
  test("nothing in a run reads the real clock but the run's clock", async () => {
    const allowed = new Set(["TimerGame.tsx", "OwnTimeSheet.tsx", "cardArt.tsx", "pause.tsx"]);
    for await (const file of new Bun.Glob("*.tsx").scan(new URL(".", import.meta.url).pathname)) {
      if (allowed.has(file)) continue;
      const code = await Bun.file(new URL(`./${file}`, import.meta.url)).text();
      const uses = code.split("\n").filter((line) => line.includes("Date.now"));
      // The question „Bis morgen um …?“ works out the run's length before it runs.
      const expected = file === "TimerPlay.tsx" ? uses.filter((line) => line.includes("clockOn(until")) : [];
      expect({ file, uses }).toEqual({ file, uses: expected });
    }
  });
});
