import { expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { SEO_LANGUAGES } from "@/content/seo";
import { APP_LANGUAGES, pick } from "@/lib/language";
import { read } from "@/testSources";
import { PINBOARD, photoWord } from "./content";
import { PINBOARD_SOUND_END } from "./outroSound";
import { BOARD_ADDRESS, boardLine, FREE } from "./content";
import {
  FRAME,
  markShown,
  NOTE,
  PAW_PRINTS,
  PHOTO,
  PHOTO_COUNT,
  PIN_SLOTS,
  PINBOARD_BEATS,
  PINBOARD_SECONDS,
  pawShown,
  stampPose,
  TRACK_DEPTH,
  TRACK_EMS,
  TRACK_UNITS,
} from "./pinboard";

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

test("the paw prints are few and big, their feet set apart, filling the room under the address (user request, 28 November 2026)", () => {
  // Once 84 prints of a few pixels in one thin band, hardly seen.
  expect(PAW_PRINTS.length).toBeLessThanOrEqual(36);
  for (const paw of PAW_PRINTS) {
    expect(paw.x).toBeGreaterThan(0);
    expect(paw.x).toBeLessThan(TRACK_EMS * TRACK_UNITS);
    expect(paw.y).toBeGreaterThan(0);
    expect(paw.y).toBeLessThan(TRACK_DEPTH * TRACK_UNITS);
  }
  const rows = (big: boolean) => new Set(PAW_PRINTS.filter((p) => p.big === big).map((p) => p.y)).size;
  expect(rows(true)).toBe(2);
  expect(rows(false)).toBe(2);
  // Quick: the whole track in little more than a second.
  expect(PINBOARD_BEATS.paws[1] - PINBOARD_BEATS.paws[0]).toBeLessThanOrEqual(1.4);
});

test("the address shows each word's capital, the line over it says what the site holds, and the free stamp under it lands and stays", () => {
  // User request, 28 November 2026: „Alltagshelfer & Lernspiele“ over the address, the stamp under it.
  const scene = read(join(import.meta.dir, "PinboardScene.tsx"));
  const [line, address, stamp] = ['className="vp-line"', 'className="vp-address"', 'className="vp-stamp"'].map((c) => scene.indexOf(c));
  expect(line).toBeGreaterThan(0);
  expect(line).toBeLessThan(address!);
  expect(address).toBeLessThan(stamp!);
  // A capital at each word's start, so the address reads as words (user request, 28 November 2026).
  expect(BOARD_ADDRESS.toLowerCase()).toBe("www.littlestepstogrow.com");
  expect(BOARD_ADDRESS.match(/[A-Z]/g)).toEqual(["L", "S", "T", "G"]);
  for (const language of SEO_LANGUAGES) {
    expect(boardLine(language), language).toContain(" & ");
    expect(pick(FREE, language), language).toBeTruthy();
  }
  const [from, lands] = PINBOARD_BEATS.stamp;
  expect(stampPose(from - 0.01).opacity).toBe(0);
  expect(from).toBeGreaterThanOrEqual(PINBOARD_BEATS.paws[1]);
  for (let t = lands + 0.2; t <= PINBOARD_SECONDS; t += 0.5) expect(stampPose(t)).toEqual({ opacity: 1, scale: 1 });
});

test("at the end the whole board stands still long enough to read the address", () => {
  // User request, 28 November 2026: show it a little longer before the video ends.
  expect(PINBOARD_SECONDS - PINBOARD_BEATS.stamp[1]).toBeGreaterThanOrEqual(6);
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
