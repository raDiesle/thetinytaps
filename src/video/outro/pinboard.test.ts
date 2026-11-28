import { expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { APP_LANGUAGES, pick } from "@/lib/language";
import { read } from "@/testSources";
import { PINBOARD, photoWord } from "./content";
import { PINBOARD_SOUND_END } from "./outroSound";
import { FRAME, markShown, NOTE, PAW_PRINTS, PHOTO, PHOTO_COUNT, PIN_SLOTS, PINBOARD_BEATS, PINBOARD_SECONDS, pawShown } from "./pinboard";

const FRAME_SECONDS = 1 / 60;
const ROOT = join(import.meta.dir, "../../..");

test("every photo has its place on the board, and none lies over the address or leaves the picture", () => {
  expect(PIN_SLOTS.length).toBe(PHOTO_COUNT);
  for (const [k, slot] of PIN_SLOTS.entries()) {
    // Turned a few degrees, a photo reaches a little further than its frame: keep that much room.
    const reach = { x: FRAME.width / 2 + 12, y: FRAME.height / 2 + 12 };
    // Inside the board's wooden frame (26 px).
    expect(slot.x - reach.x, `photo ${k}`).toBeGreaterThanOrEqual(26);
    expect(slot.x + reach.x, `photo ${k}`).toBeLessThanOrEqual(1920 - 26);
    expect(slot.y - reach.y, `photo ${k}`).toBeGreaterThanOrEqual(26);
    expect(slot.y + reach.y, `photo ${k}`).toBeLessThanOrEqual(1080 - 26);
    const apart = Math.abs(slot.x - NOTE.x) >= reach.x + NOTE.width / 2 || Math.abs(slot.y - NOTE.y) >= reach.y + NOTE.height / 2 - 20;
    expect(apart, `photo ${k} over the address`).toBe(true);
  }
});

test("the sheet with the address is there from the first frame, never coming later (user request, 28 November 2026)", () => {
  // The scene draws photos and sheet flat and pinned at every second: nothing of them has a time of its own.
  const scene = read(join(import.meta.dir, "PinboardScene.tsx"));
  expect(scene).toContain('className="vp-note" style={pressedStyle(NOTE, NOTE.width, NOTE.height, FLAT)}');
  expect(markShown(0)).toBe(0);
  expect(PINBOARD_BEATS.mark[1]).toBeLessThanOrEqual(1);
});

test("the paw prints appear one after another, each growing steadily, all there once the tracks reach the foxes", () => {
  const [from, to] = PINBOARD_BEATS.paws;
  for (const [k] of PAW_PRINTS.entries()) {
    expect(pawShown(k, from - 0.01), `print ${k}`).toBe(0);
    expect(pawShown(k, to), `print ${k}`).toBe(1);
    let last = 0;
    for (let t = from; t <= to; t += FRAME_SECONDS) {
      const now = pawShown(k, t);
      expect(now, `print ${k} at ${t}`).toBeGreaterThanOrEqual(last);
      // Each comes within a few frames, one after another: never all at once.
      if (k > 0) expect(now <= pawShown(k - 1, t), `print ${k} before ${k - 1}`).toBe(true);
      last = now;
    }
  }
  expect(pawShown(PAW_PRINTS.length - 1, (from + to) / 2)).toBe(0);
});

test("at the end the whole board stands still long enough to read the address", () => {
  // User request, 28 November 2026: show it a little longer before the video ends.
  expect(PINBOARD_SECONDS - PINBOARD_BEATS.paws[1]).toBeGreaterThanOrEqual(6);
});

test("the sound rings out before the outro ends", () => {
  expect(PINBOARD_SOUND_END).toBeLessThan(PINBOARD_SECONDS);
});

test("each photo's word is there in every app language, and a photo with words has its picture in each", () => {
  for (const language of APP_LANGUAGES) {
    for (const photo of PINBOARD) {
      expect(pick(photoWord(photo), language), `${photo.href} in ${language}`).toBeTruthy();
      if (photo.byLanguage) expect((photo.byLanguage as Record<string, string>)[language], `${photo.href}'s picture in ${language}`).toBeString();
    }
  }
  for (const photo of PINBOARD) expect(photo.picture, photo.href).toBeString();
});

test("a cut photo keeps the board's 3 : 2 and stays inside its picture", async () => {
  const ratio = PHOTO.picture.width / PHOTO.picture.height;
  for (const photo of PINBOARD.filter((p) => p.crop)) {
    const { x, y, width, of } = photo.crop!;
    const path = decodeURIComponent(new URL(photo.picture!, "file:///").pathname);
    const file = path.startsWith(ROOT) ? path : join(ROOT, path.replace(/^\/_src\//, "src/"));
    const meta = await sharp(file).metadata();
    expect(meta.width, photo.href).toBe(of);
    expect(x + width, photo.href).toBeLessThanOrEqual(of);
    expect(y + width / ratio, photo.href).toBeLessThanOrEqual(meta.height!);
  }
});

test("bun run previews --pinnwand makes every photo of the board's own folder", () => {
  const tool = read(join(ROOT, "tools/previews.ts"));
  for (const name of readdirSync(join(import.meta.dir, "pinnwand"))) {
    const id = name.replace(/\.webp$/, "");
    const language = /^gefuehle-(\w+)$/.exec(id)?.[1];
    if (language) expect(tool, name).toContain(`const LANGUAGES = [`);
    else expect(tool, name).toContain(`${id.includes("-") ? `"${id}"` : id}: { href:`);
  }
});
