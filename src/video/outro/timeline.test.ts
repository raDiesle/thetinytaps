import { expect, test } from "bun:test";
import { join } from "node:path";
import { CATEGORIES } from "@/content/games";
import { read } from "@/testSources";
import { bookPose, BEATS as INTRO_BEATS, INTRO_SECONDS } from "../intro/timeline";
import { addressFor, codeAddress, SIGNS, shortAddress, VIDEO_PAGES } from "./content";
import { OUTRO_SOUND_END } from "./outroSound";
import { cardPose, glows, OUTRO_BEATS, OUTRO_SECONDS, outroBookPose, titleLeft } from "./timeline";

test("the outro starts on the page the intro ends on, and ends with the book closed and upright in its gap", () => {
  expect(outroBookPose(0)).toEqual(bookPose(INTRO_SECONDS));
  expect(outroBookPose(OUTRO_SECONDS)).toEqual(bookPose(0));
  expect(titleLeft(0)).toBe(1);
});

test("the name is gone before the page begins to shrink, so it is never drawn small and blurred", () => {
  expect(titleLeft(OUTRO_BEATS.zoomOut[0] + 0.1)).toBeLessThan(0.3);
  expect(titleLeft(OUTRO_BEATS.titleOut[1])).toBe(0);
  expect(OUTRO_BEATS.titleOut[0]).toBeLessThan(OUTRO_BEATS.zoomOut[0]);
});

test("the book moves steadily back: no jump from one frame to the next", () => {
  let last = outroBookPose(0);
  for (let t = 1 / 60; t <= OUTRO_SECONDS; t += 1 / 60) {
    const pose = outroBookPose(t);
    expect(Math.abs(pose.x - last.x)).toBeLessThan(40);
    expect(Math.abs(pose.scale - last.scale)).toBeLessThan(0.2);
    expect(Math.abs(pose.cover - last.cover)).toBeLessThan(12);
    last = pose;
  }
});

test("the picture books light up one at a time, only once the book is back, and all are quiet before the card", () => {
  for (let t = 0; t <= OUTRO_SECONDS; t += 0.02) {
    const lit = glows(t);
    if (t < OUTRO_BEATS.settle[1] || t > OUTRO_BEATS.card[0]) expect(Math.max(...lit)).toBeLessThan(0.01);
    expect(lit.filter((glow) => glow > 0.5).length).toBeLessThanOrEqual(1);
  }
  // Each one is fully lit once.
  for (let k = 0; k < glows(0).length; k++) {
    let most = 0;
    for (let t = 0; t <= OUTRO_SECONDS; t += 0.02) most = Math.max(most, glows(t)[k]!);
    expect(most).toBeGreaterThan(0.95);
  }
});

test("everything happens, the card stands whole for a while to scan its code, and the sound rings out within the outro", () => {
  for (const [from, to] of Object.values(OUTRO_BEATS)) {
    expect(from).toBeLessThan(to);
    expect(to).toBeLessThanOrEqual(OUTRO_SECONDS);
  }
  const whole = cardPose(OUTRO_SECONDS - 2.5, SIGNS.length);
  expect(whole.card).toBe(1);
  expect(whole.code).toBe(1);
  for (const sign of whole.signs) expect(sign).toBe(1);
  expect(OUTRO_SOUND_END).toBeLessThanOrEqual(OUTRO_SECONDS);
  expect(INTRO_BEATS.address[1]).toBeLessThanOrEqual(INTRO_SECONDS);
});

test("the code always leads to the home page in the video's language, so one outro serves every video", () => {
  expect(codeAddress("de")).toBe("https://www.littlestepstogrow.com/");
  expect(codeAddress("en")).toBe("https://www.littlestepstogrow.com/en/");
  expect(read(join(import.meta.dir, "../../../tools/video.ts"))).not.toContain("ziel");
});

test("every page a video links to is a page of the site, German at the root and the others under their prefix", () => {
  const pages = new Set(["/", ...CATEGORIES.flatMap((category) => category.games.map((game) => game.href))]);
  for (const [path] of VIDEO_PAGES) expect(pages.has(path)).toBe(true);
  expect(addressFor("/zaehne/", "de")).toBe("https://www.littlestepstogrow.com/zaehne/");
  expect(addressFor("/zaehne/", "en")).toBe("https://www.littlestepstogrow.com/en/zaehne/");
  expect(shortAddress(addressFor("/", "de"))).toBe("littlestepstogrow.com");
  expect(shortAddress(addressFor("/toepfchen/", "es"))).toBe("littlestepstogrow.com/es/toepfchen");
});
