import { describe, expect, test } from "bun:test";
import { MIN_CARD_MM, MIN_STAR_MM, PHOTO_FORMATS, PHOTO_MARGIN_MM, photoFormat, photoLayout, photoPx, photoSheets } from "./photo";

describe("photo prints", () => {
  test("every card fits inside the margin, at least as big as asked", () => {
    for (const format of PHOTO_FORMATS) {
      for (const min of [MIN_CARD_MM, MIN_STAR_MM]) {
        const l = photoLayout(format, min);
        expect(l.cell).toBeGreaterThanOrEqual(min);
        expect(l.left).toBeGreaterThanOrEqual(PHOTO_MARGIN_MM - 0.01);
        expect(l.top).toBeGreaterThanOrEqual(PHOTO_MARGIN_MM - 0.01);
        expect(l.left * 2 + l.cols * l.cell).toBeCloseTo(format.width, 5);
        expect(l.top * 2 + l.rows * l.cell).toBeCloseTo(format.height, 5);
      }
    }
  });

  test("the formats have the shape shops print, at 300 dpi", () => {
    // 10 × 15 and 20 × 30 are 2 : 3 like 4 × 6″ and 8 × 12″; a wrong shape would be cut off by the shop.
    expect(photoPx(photoFormat("10x15").width)).toBe(1200);
    expect(photoPx(photoFormat("10x15").height)).toBe(1800);
    expect(photoPx(photoFormat("20x30").height) / photoPx(photoFormat("20x30").width)).toBe(1.5);
  });

  test("a plan's cards: six on the smallest photo, big enough for a Velcro dot", () => {
    const l = photoLayout(photoFormat("10x15"), MIN_CARD_MM);
    expect(l.cols * l.rows).toBe(6);
    expect(photoLayout(photoFormat("20x30"), MIN_CARD_MM).cols * photoLayout(photoFormat("20x30"), MIN_CARD_MM).rows).toBe(24);
  });

  test("an unknown or old saved format is the first one", () => {
    expect(photoFormat(undefined).id).toBe("10x15");
    expect(photoFormat("9x13").id).toBe("10x15");
  });

  test("cards split into photos, never none", () => {
    expect(photoSheets([], 6)).toEqual([[]]);
    expect(photoSheets([1, 2, 3, 4, 5, 6, 7], 6)).toEqual([[1, 2, 3, 4, 5, 6], [7]]);
  });
});
