import { expect, test } from "bun:test";
import { APP_LANGUAGES, pick } from "@/lib/language";
import { BOARD_LINE, PINBOARD, photoWord } from "./content";
import { PINBOARD_SOUND_END } from "./outroSound";
import { FRAME, NOTE, notePose, PHOTO_COUNT, PIN_SLOTS, PINBOARD_BEATS, PINBOARD_SECONDS } from "./pinboard";

const FRAME_SECONDS = 1 / 60;

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

test("the board shows every photo from the first frame, and the sheet with the name only a moment later", () => {
  // The photos have no time of their own any more: the scene draws them flat and pinned at every second.
  expect(notePose(0).opacity).toBe(0);
  expect(PINBOARD_BEATS.note[0]).toBeGreaterThan(0.5);
  expect(PINBOARD_BEATS.line[0]).toBeGreaterThanOrEqual(PINBOARD_BEATS.note[1]);
});

test("at the end the whole board stands still long enough to read the address", () => {
  const still = PINBOARD_BEATS.line[1];
  expect(PINBOARD_SECONDS - still).toBeGreaterThanOrEqual(4);
  for (const t of [still, PINBOARD_SECONDS]) expect(notePose(t)).toEqual({ opacity: 1, scale: 1, lift: 0, pin: 1 });
});

test("the sheet moves steadily: no jump from one frame to the next", () => {
  let last = notePose(0);
  for (let t = FRAME_SECONDS; t <= PINBOARD_SECONDS; t += FRAME_SECONDS) {
    const now = notePose(t);
    expect(Math.abs(now.scale - last.scale), `at ${t}`).toBeLessThan(0.03);
    expect(Math.abs(now.lift - last.lift), `at ${t}`).toBeLessThan(0.2);
    last = now;
  }
});

test("the sound rings out before the outro ends", () => {
  expect(PINBOARD_SOUND_END).toBeLessThan(PINBOARD_SECONDS);
});

test("each photo's word and the line under the address are there in every app language", () => {
  for (const language of APP_LANGUAGES) {
    for (const photo of PINBOARD) expect(pick(photoWord(photo), language), `${photo.href} in ${language}`).toBeTruthy();
    expect(BOARD_LINE[language], language).toBeTruthy();
  }
});
