import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { defaultDraft, draftInSpan, SPANS } from "./ChartEditor";
import {
  DEFAULT_PHOTO_PLACE,
  FRAME_RATIOS,
  frameRatio,
  newPhotoKey,
  PHOTO_KEY,
  PHOTO_MAX_SIDE,
  PHOTO_PLACES,
  type PhotoPlace,
  photoKeysOf,
  photoPlaceOf,
  scaledSize,
} from "./chartPhoto";

describe("the photo of the child on a chart", () => {
  test("an old chart, or a place no longer known, takes the default place top left", () => {
    expect(DEFAULT_PHOTO_PLACE).toBe("top-left");
    expect(photoPlaceOf(undefined)).toBe("top-left");
    expect(photoPlaceOf({ key: "foto-a-b" })).toBe("top-left");
    expect(photoPlaceOf({ key: "foto-a-b", place: "bottom-left" as PhotoPlace })).toBe("top-left");
    for (const place of PHOTO_PLACES) expect(photoPlaceOf({ key: "foto-a-b", place })).toBe(place);
  });

  test("the frame keeps the photo's shape within its limits, a portrait's where it is unknown", () => {
    expect(frameRatio(undefined)).toBe(4 / 5);
    expect(frameRatio({ key: "foto-a-b", ratio: 0 })).toBe(4 / 5);
    expect(frameRatio({ key: "foto-a-b", ratio: Number.NaN })).toBe(4 / 5);
    expect(frameRatio({ key: "foto-a-b", ratio: 1 })).toBe(1);
    expect(frameRatio({ key: "foto-a-b", ratio: 0.2 })).toBe(FRAME_RATIOS.min);
    expect(frameRatio({ key: "foto-a-b", ratio: 5 })).toBe(FRAME_RATIOS.max);
  });

  test("a photo is stored at most PHOTO_MAX_SIDE on its longest side, keeping its shape, never made bigger", () => {
    expect(scaledSize(4000, 3000)).toEqual({ width: PHOTO_MAX_SIDE, height: 900 });
    expect(scaledSize(1600, 2000)).toEqual({ width: 960, height: PHOTO_MAX_SIDE });
    expect(scaledSize(640, 480)).toEqual({ width: 640, height: 480 });
    expect(scaledSize(0, 0).width).toBeGreaterThan(0);
  });

  test("a photo's key is random and tells nothing about the picture or the child", () => {
    const keys = new Set(Array.from({ length: 50 }, newPhotoKey));
    expect(keys.size).toBe(50);
    for (const key of keys) expect(key).toMatch(PHOTO_KEY);
  });

  test("the photos kept are exactly those a chart names", () => {
    const keys = photoKeysOf([{ photo: { key: "foto-a-1" } }, {}, { photo: { key: "foto-b-2", place: "title" } }, { photo: { key: "foto-a-1" } }]);
    expect([...keys].sort()).toEqual(["foto-a-1", "foto-b-2"]);
  });

  test("another Zeitraum in the wizard keeps the photo and its place", () => {
    const photo = { key: "foto-a-1", place: "top-right" as const, ratio: 0.75 };
    const start = defaultDraft("de");
    if (start.type !== "plan") throw new Error("the wizard starts on a plan");
    const draft = { ...start, plan: { ...start.plan, photo } };
    for (const span of SPANS) {
      const moved = draftInSpan(span, draft, "de");
      expect(moved.type === "board" ? moved.board.photo : moved.plan.photo, span.id).toEqual(photo);
    }
  });
});

/** The files of the rewards' folder that are code, not tests. */
const FOLDER = import.meta.dir;
const ROOT = join(FOLDER, "../../..");
const codeIn = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "stimme" || name === "bilder" || name === "node_modules" ? [] : codeIn(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });

describe("the photo never leaves the device", () => {
  const photoFiles = ["chartPhoto.ts", "photoStore.ts", "ChildPhoto.tsx"].map((name) => join(FOLDER, name));

  test("only photoStore.ts touches IndexedDB, and only the editor, the page and the photo itself use the store", () => {
    for (const file of codeIn(join(ROOT, "src"))) {
      const code = readFileSync(file, "utf8");
      const name = relative(FOLDER, file);
      if (/\bindexedDB\b/.test(code)) expect(name, "IndexedDB is used only by the photo store").toBe("photoStore.ts");
      if (/from "\.\/photoStore"|photoStore"/.test(code)) expect(["ChartEditor.tsx", "RewardsGame.tsx", "ChildPhoto.tsx"], name).toContain(name);
    }
  });

  test("the photo's files send, log and store nothing elsewhere", () => {
    for (const file of photoFiles) {
      const code = readFileSync(file, "utf8");
      for (const banned of [
        /\btrack\(/,
        /@\/lib\/analytics/,
        /localStorage/,
        /sessionStorage/,
        /\bfetch\(/,
        /sendBeacon/,
        /console\./,
        /\blocation\b/,
        /navigate\(/,
        /searchParams/,
        /pictureQueue|bilder\/prompts/,
      ]) {
        expect(banned.test(code), `${relative(ROOT, file)} uses ${banned}`).toBe(false);
      }
    }
  });

  test("a photo is shrunk and re-encoded as JPEG in a canvas, upright by its own orientation", () => {
    const store = readFileSync(join(FOLDER, "photoStore.ts"), "utf8");
    expect(store).toContain('imageOrientation: "from-image"');
    expect(store).toContain("scaledSize(");
    expect(store).toContain('"image/jpeg"');
  });

  test("the file picker takes only pictures", () => {
    expect(readFileSync(join(FOLDER, "ChartEditor.tsx"), "utf8")).toMatch(/type="file"[^>]*accept="image\/\*"/);
  });
});
