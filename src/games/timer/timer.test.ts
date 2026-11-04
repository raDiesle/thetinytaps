import { describe, expect, test } from "bun:test";
import { nextPicture, PICTURES } from "./content";
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
});
