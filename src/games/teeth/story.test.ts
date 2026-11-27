import { describe, expect, test } from "bun:test";
import { TEETH_PER_SIDE } from "./jaw";
import { PRELUDE_TEXTS } from "./lines";
import { FACE } from "./face";
import { FRAMINGS, framingFor, freeSeen, HEAD, MOUTH, STORY_TEETH, SWEET_REACH, sweetPlace } from "./origin";

// The story's mouth once showed six teeth above and four below, and the face stood small in the middle of a wide
// screen (user feedback, November 2026: show the right number of teeth and the mouth bigger).

describe("the story's teeth", () => {
  test.each(Object.entries(STORY_TEETH))("%s row: a child's ten milk teeth, narrowing towards the corners", (_, row) => {
    expect(row).toHaveLength(2 * TEETH_PER_SIDE);
    for (let i = 1; i < row.length; i++) {
      // Neighbours nearly touch: no overlap, no gap that looks like a lost tooth.
      const gap = row[i].x - row[i].width / 2 - (row[i - 1].x + row[i - 1].width / 2);
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThan(2);
    }
    const right = row.slice(TEETH_PER_SIDE);
    for (let i = 1; i < right.length; i++) expect(right[i].width).toBeLessThan(right[i - 1].width);
    for (const t of row) {
      expect(t.x - t.width / 2).toBeGreaterThan(MOUTH.left);
      expect(t.x + t.width / 2).toBeLessThan(MOUTH.right);
    }
  });

  test("the lower row stands inside the upper one", () => {
    const span = (row: typeof STORY_TEETH.upper) => row[row.length - 1].x - row[0].x;
    expect(span(STORY_TEETH.lower)).toBeLessThan(span(STORY_TEETH.upper));
  });
});

describe("the story's framings", () => {
  // A sweet grows to one and a half times its size where it appears, and once stood so near the screen's edge that it
  // was cut off there (user feedback, November 2026): it appears whole, inside the free room and clear of the frame.
  // The free rooms are the ones measured in the preview (beside the controls' strip, or above it held upright).
  const screens = {
    "phone 844×390": { width: 844, height: 390, free: { x: 111, y: 10, width: 727, height: 370 } },
    "tablet 1024×768": { width: 1024, height: 768, free: { x: 156, y: 10, width: 862, height: 748 } },
    "computer 1280×720": { width: 1280, height: 720, free: { x: 150, y: 10, width: 1124, height: 700 } },
    "computer 1920×1080": { width: 1920, height: 1080, free: { x: 190, y: 10, width: 1724, height: 1060 } },
    "upright 390×844": { width: 390, height: 844, free: { x: 6, y: 10, width: 378, height: 740 } },
  };
  test.each(Object.entries(screens))("%s: every sweet appears whole, never at the screen's edge", (name, room) => {
    const { framing, box, unit } = framingFor(room);
    const seen = freeSeen(room, box, unit);
    for (const want of framing.sweets) {
      const at = sweetPlace(want, seen, unit);
      const edge = 20 * unit;
      expect(at.x - SWEET_REACH.left).toBeGreaterThanOrEqual(seen.x + edge);
      expect(at.x + SWEET_REACH.right).toBeLessThanOrEqual(seen.x + seen.width - edge);
      expect(at.y - SWEET_REACH.up).toBeGreaterThanOrEqual(seen.y + edge);
      expect(at.y + SWEET_REACH.down).toBeLessThanOrEqual(seen.y + seen.height - edge);
      // Held sideways it stays clear of the child's eyes: its round body (about 45 units across its middle at its
      // biggest) never reaches an eye.
      if (name.startsWith("upright")) continue;
      for (const s of [-1, 1]) {
        const eye = { x: HEAD.x + s * FACE.eyes.x, y: HEAD.y + FACE.eyes.y };
        expect(Math.hypot(at.x - eye.x, at.y - eye.y)).toBeGreaterThan(45 + FACE.eyes.ry);
      }
    }
  });

  test("the face's framing shows the face bigger than the head's", () => {
    expect(FRAMINGS.face.focus.height).toBeLessThan(FRAMINGS.head.focus.height * 0.85);
  });

  // The story is the same whatever the time of day (user request, November 2026): no sun or moon crossing its sky,
  // no sky turning to dusk or night, and the monsters' line „Aus dem Zucker wachsen …“ says nothing of day or night.
  test("has no sun or moon and one calm sky, whatever the time of day", async () => {
    const origin = await Bun.file("src/games/teeth/origin.tsx").text();
    const css = await Bun.file("src/games/teeth/teeth.css").text();
    for (const framing of Object.values(FRAMINGS)) expect(Object.keys(framing).sort()).toEqual(["focus", "sweets"]);
    expect(origin).not.toMatch(/SkyBody|origin-sky|STAR_PATH/);
    expect(css).not.toMatch(/\.origin-(sky|sun|moon)/);
    expect(css).not.toContain("teeth-origin-sky");
    for (const text of Object.values(PRELUDE_TEXTS.grow.cue ?? {})) expect(text).not.toMatch(/Nacht|Tag\b|night|day\b/i);
  });
});
