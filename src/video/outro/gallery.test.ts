import { expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { CATEGORIES } from "@/content/games";
import { APP_LANGUAGES, pick } from "@/lib/language";
import { LEARNING_GAMES } from "@/lib/sharedTexts";
import { read } from "@/testSources";
import { GALLERY, gameTitle, HELPERS_TITLE, SIGNS } from "./content";
import { GALLERY_BEATS, GALLERY_SECONDS, HELPER_COUNT, headingPose, nameShown, PICTURE_COUNT, picturePose, STEP } from "./gallery";
import { GALLERY_SOUND_END } from "./outroSound";
import { cardPose } from "./timeline";

const FRAME = 1 / 60;
const RUN = [...GALLERY.helpers, ...GALLERY.games];

test("it opens on the two categories side by side, each with a picture of its games and its name under it", () => {
  const t = GALLERY_BEATS.categories[1] + 0.1;
  const helpers = picturePose(0, t);
  const games = picturePose(HELPER_COUNT, t);
  expect(helpers.opacity).toBeGreaterThan(0.99);
  expect(games.opacity).toBeGreaterThan(0.99);
  expect(helpers.x).toBeLessThan(-300);
  expect(games.x).toBeGreaterThan(300);
  for (const k of [0, 1] as const) expect(headingPose(k, t).opacity).toBeGreaterThan(0.99);
  // Nothing else shows yet, and no game's name.
  for (let k = 0; k < PICTURE_COUNT; k++) {
    if (k !== 0 && k !== HELPER_COUNT) expect(picturePose(k, t).opacity, `picture ${k}`).toBe(0);
    expect(nameShown(k, t)).toBe(0);
  }
});

test("each picture stands once big and sharp in the middle with its name, alone, under its category's heading", () => {
  for (let k = 0; k < PICTURE_COUNT; k++) {
    const t = GALLERY_BEATS.run[0] + k * STEP + 0.1;
    const pose = picturePose(k, t);
    for (const [key, value] of Object.entries({ x: 0, y: 0, scale: 1, opacity: 1, blur: 0 })) {
      expect(pose[key as keyof typeof pose], `${key} of ${k}`).toBeCloseTo(value, 6);
    }
    expect(nameShown(k, t)).toBe(1);
    for (let other = 0; other < PICTURE_COUNT; other++) {
      if (other === k) continue;
      // The next one may wait behind it, small; the one before is gone; none other shows beside it.
      const pose = picturePose(other, t);
      expect(pose.opacity < 0.01 || pose.scale < 0.6, `${other} beside ${k}`).toBe(true);
      expect(nameShown(other, t)).toBe(0);
    }
    const games = k >= HELPER_COUNT ? 1 : 0;
    expect(headingPose(games as 0 | 1, t).opacity).toBe(1);
    expect(headingPose((1 - games) as 0 | 1, t).opacity).toBe(0);
  }
});

test("everything moves steadily: no jump from one frame to the next", () => {
  for (let k = 0; k < PICTURE_COUNT; k++) {
    let last = picturePose(k, 0);
    for (let t = FRAME; t <= GALLERY_SECONDS; t += FRAME) {
      const pose = picturePose(k, t);
      expect(Math.abs(pose.x - last.x), `picture ${k} at ${t}`).toBeLessThan(40);
      expect(Math.abs(pose.scale - last.scale), `picture ${k} at ${t}`).toBeLessThan(0.12);
      // One flying past fades fast (slowly, it lay over the next as a double picture), yet over several frames.
      expect(Math.abs(pose.opacity - last.opacity), `picture ${k} at ${t}`).toBeLessThan(0.34);
      last = pose;
    }
  }
});

test("the pictures are gone before the card stands, and the card stands whole long enough to scan its code", () => {
  for (const [from, to] of Object.values(GALLERY_BEATS)) {
    expect(from).toBeLessThan(to);
    expect(to).toBeLessThanOrEqual(GALLERY_SECONDS);
  }
  for (let k = 0; k < PICTURE_COUNT; k++) expect(picturePose(k, GALLERY_BEATS.card[1]).opacity).toBe(0);
  const whole = cardPose(GALLERY_SECONDS - 2.5, SIGNS.length, GALLERY_BEATS);
  expect(whole.card).toBe(1);
  expect(whole.code).toBe(1);
  for (const sign of whole.signs) expect(sign).toBe(1);
  expect(GALLERY_SOUND_END).toBeLessThanOrEqual(GALLERY_SECONDS);
});

test("the helpers are everyday helpers and the games are not, each with its picture and its name in every language", () => {
  const helpers = new Set(CATEGORIES.find((c) => c.id === "alltag")!.games.map((game) => game.href));
  for (const game of GALLERY.helpers) expect(helpers.has(game.href), game.href).toBe(true);
  for (const game of GALLERY.games) expect(helpers.has(game.href), game.href).toBe(false);
  expect(new Set(RUN.map((game) => game.href)).size).toBe(RUN.length);
  for (const game of RUN) {
    expect(game.picture, game.href).toBeString();
    for (const language of APP_LANGUAGES) expect(pick(gameTitle(game), language)).toBeString();
  }
  for (const language of APP_LANGUAGES) {
    expect(pick(HELPERS_TITLE, language)).toBeString();
    expect(pick(LEARNING_GAMES, language)).toBeString();
  }
});

test("the videos' pictures are sharp at the size they are shown, and bun run previews --video makes each of them", async () => {
  // A menu's 480 × 320 picture shown 1140 wide was blurred: what the outro shows is at least 1100 wide.
  const ROOT = join(import.meta.dir, "../../..");
  const tool = read(join(ROOT, "tools/previews.ts"));
  const dir = join(import.meta.dir, "bilder");
  for (const name of readdirSync(dir)) {
    expect(await sharp(join(dir, name)).metadata(), name).toMatchObject({ width: 1200, height: 800 });
    expect(tool, `VIDEO_GAMES makes ${name}`).toContain(`${name.replace(/\.webp$/, "").replace(/^(.*-.*)$/, '"$1"')}: { href:`);
  }
  for (const game of RUN) {
    const path = decodeURIComponent(new URL(game.picture!, "file:///").pathname);
    const file = path.startsWith(ROOT) ? path : join(ROOT, path.replace(/^\/_src\//, "src/"));
    const { width = 0 } = await sharp(file).metadata();
    expect(width, game.href).toBeGreaterThanOrEqual(1100);
  }
});
