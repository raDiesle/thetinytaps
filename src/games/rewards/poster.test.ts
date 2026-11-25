import { describe, expect, test } from "bun:test";
import {
  blurriest,
  layoutSize,
  largestSharp,
  MAX_CANVAS_PIXELS,
  POSTER_FORMATS,
  posterFormat,
  posterFormatsFor,
  posterPx,
  posterSize,
  seasonalDecor,
} from "./poster";

const plan = (view: string, parts: number, cards: number) => ({ kind: "plan" as const, view, parts, cards });
const ids = (formats: { id: string }[]) => formats.map((f) => f.id);

describe("photo posters (T-32)", () => {
  test("every format fits an old phone's canvas and is above what photo services ask for", () => {
    for (const f of POSTER_FORMATS) {
      const w = posterPx(f.short, f.dpi);
      const h = posterPx(f.long, f.dpi);
      expect(w * h).toBeLessThan(MAX_CANVAS_PIXELS);
      // Two megapixels for the smallest poster, more for the bigger ones.
      expect(w * h).toBeGreaterThan(f.long >= 600 ? 4e6 : 2e6);
      expect(f.dpi).toBeGreaterThanOrEqual(120);
    }
  });

  test("the usual shapes: 2 : 3, 3 : 4, a panorama 1 : 3 and a square, the same in inches", () => {
    for (const f of POSTER_FORMATS) {
      const ratio = f.long / f.short;
      expect([1, 4 / 3, 3 / 2, 3].some((r) => Math.abs(r - ratio) < 1e-9) ? f.id : `${f.id}: ${ratio}`).toBe(f.id);
      const [a, b] = f.inches.replace("″", "").split(" × ").map(Number);
      expect(b / a).toBeCloseTo(ratio, 6);
    }
  });

  test("the sizes match the idea's pixels (T-32)", () => {
    const px = (id: string) => {
      const f = POSTER_FORMATS.find((g) => g.id === id);
      if (!f) throw new Error(id);
      return [posterPx(f.short, f.dpi), posterPx(f.long, f.dpi)];
    };
    expect(px("20x30")).toEqual([1575, 2362]);
    expect(px("30x40")).toEqual([2126, 2835]);
    expect(px("40x60")).toEqual([2362, 3543]);
    expect(px("30x90")).toEqual([1772, 5315]);
  });

  test("a week board gets the three usual sizes only", () => {
    expect(ids(posterFormatsFor({ kind: "board", view: "week", parts: 1, cards: 0 }))).toEqual(["20x30", "30x40", "40x60"]);
  });

  test("a whole day of five to ten cards may be a panorama 30 × 90, morning and evening 40 × 120 (T-35)", () => {
    expect(ids(posterFormatsFor(plan("day", 1, 6)))).toContain("30x90");
    expect(ids(posterFormatsFor(plan("day", 1, 6)))).not.toContain("40x120");
    expect(ids(posterFormatsFor(plan("day", 1, 4)))).not.toContain("30x90");
    expect(ids(posterFormatsFor(plan("day", 1, 11)))).not.toContain("30x90");
    expect(ids(posterFormatsFor(plan("day", 2, 4)))).toEqual(["20x30", "30x40", "40x60", "40x120"]);
    expect(ids(posterFormatsFor(plan("day", 3, 4)))).toEqual(["20x30", "30x40", "40x60"]);
    expect(ids(posterFormatsFor(plan("week", 1, 6)))).toEqual(["20x30", "30x40", "40x60"]);
  });

  test("a Countdown and a collecting board may be square (T-36)", () => {
    expect(ids(posterFormatsFor(plan("countdown", 1, 1)))).toContain("30x30");
    expect(ids(posterFormatsFor({ kind: "board", view: "collect", parts: 1, cards: 0 }))).toContain("30x30");
    expect(ids(posterFormatsFor({ kind: "board", view: "month", parts: 1, cards: 0 }))).not.toContain("30x30");
  });

  test("an unknown or missing format is 30 × 40", () => {
    expect(posterFormat(POSTER_FORMATS, undefined).id).toBe("30x40");
    expect(posterFormat(POSTER_FORMATS, "50x75").id).toBe("30x40");
  });

  test("a panorama always lies, a standard poster follows the chart, the layout's short side is A4's", () => {
    const panorama = posterFormat(POSTER_FORMATS, "30x90");
    expect(posterSize(panorama, "portrait")).toEqual({ width: 900, height: 300 });
    const standard = posterFormat(POSTER_FORMATS, "30x40");
    expect(posterSize(standard, "portrait")).toEqual({ width: 300, height: 400 });
    expect(posterSize(standard, "landscape")).toEqual({ width: 400, height: 300 });
    expect(layoutSize(standard, "portrait").width).toBe(210);
    expect(layoutSize(standard, "portrait").height).toBeCloseTo(280, 6);
  });
});

describe("sharpness before ordering (T-37)", () => {
  // The child's photo, 1200 px across, taking a fifth of the poster's width.
  const photo = { px: 1200, share: 0.2, photo: true };
  const standard = POSTER_FORMATS.filter((f) => f.shape === "standard");

  test("a photo a fifth of the width is sharp on 40 × 60 and soft on a much bigger share", () => {
    // 1200 px over 80 mm is 381 dpi.
    expect(blurriest([photo], posterFormat(POSTER_FORMATS, "40x60"), "portrait")).toBeUndefined();
    const big = { ...photo, px: 500, share: 0.5 };
    // 500 px over 200 mm is 63 dpi.
    expect(blurriest([photo, big], posterFormat(POSTER_FORMATS, "40x60"), "portrait")).toBe(big);
  });

  test("the largest sharp format of the same shape is suggested, none where all are soft", () => {
    const soft = { px: 400, share: 0.5, photo: true };
    // 400 px: 100 mm on 20 × 30 is 102 dpi, 150 mm on 30 × 40 is 68.
    expect(largestSharp([soft], POSTER_FORMATS, posterFormat(POSTER_FORMATS, "40x60"), "portrait")?.id).toBe("20x30");
    expect(largestSharp([{ ...soft, px: 100 }], standard, standard[2], "portrait")).toBeUndefined();
    expect(largestSharp([photo], standard, standard[0], "portrait")?.id).toBe("40x60");
  });
});

describe("decoration by the season (T-40)", () => {
  test("Easter in spring, leaves in autumn, Advent in December, vines the rest of the year", () => {
    expect(seasonalDecor(3)).toBe("easter");
    expect(seasonalDecor(9)).toBe("autumn");
    expect(seasonalDecor(11)).toBe("advent");
    expect(seasonalDecor(6)).toBe("vines");
  });
});
