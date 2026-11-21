import { expect, test } from "bun:test";
import { INTRO_SOUND_END } from "./introSound";
import { BEATS, bookPose, CANVAS, HERO, INTRO_SECONDS } from "./timeline";

/** The book's first page on the canvas at second `t` (its pages' box, scaled round its centre). */
function pageBox(t: number) {
  const pose = bookPose(t);
  const width = HERO.width * pose.scale;
  const height = HERO.height * pose.scale;
  return { left: pose.x - width / 2, right: pose.x + width / 2, top: pose.y - height / 2, bottom: pose.y + height / 2 };
}

test("the name is printed only once the first page fills the whole picture", () => {
  for (let t = BEATS.letters[0]; t <= INTRO_SECONDS; t += 0.05) {
    const page = pageBox(t);
    expect(page.left).toBeLessThanOrEqual(0);
    expect(page.right).toBeGreaterThanOrEqual(CANVAS.width);
    expect(page.top).toBeLessThanOrEqual(0);
    expect(page.bottom).toBeGreaterThanOrEqual(CANVAS.height);
  }
});

test("the book starts in its place on the shelf, closed and upright", () => {
  expect(bookPose(0)).toEqual({ x: HERO.x + HERO.width / 2, y: HERO.y + HERO.height / 2, scale: 1, tip: 0, cover: 0 });
});

test("everything happens, and the sound rings out, within the intro", () => {
  for (const [from, to] of Object.values(BEATS)) {
    expect(from).toBeLessThan(to);
    expect(to).toBeLessThanOrEqual(INTRO_SECONDS);
  }
  expect(INTRO_SOUND_END).toBeLessThanOrEqual(INTRO_SECONDS);
});
