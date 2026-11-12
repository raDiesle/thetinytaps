import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { DUCK, EFFECTS_GAIN, songGain, VOICE_LUFS } from "./loudness";

/** Every source file under `dir`, tests left out. */
const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });

const files = sources(join(import.meta.dir, "..")).map((path) => ({ path, code: readFileSync(path, "utf8") }));

describe("loudness", () => {
  test("a song as loud as the voice plays at full gain, a louder one lower, never above 1", () => {
    expect(songGain(VOICE_LUFS)).toBe(1);
    expect(songGain(VOICE_LUFS + 6)).toBeCloseTo(0.5, 1);
    expect(songGain(VOICE_LUFS - 10)).toBe(1);
  });

  test("sounds are only a little quieter than voice and music (user feedback, November 2026)", () => {
    expect(EFFECTS_GAIN).toBeLessThan(1);
    expect(EFFECTS_GAIN).toBeGreaterThanOrEqual(0.8);
  });

  test("a song dips under the voice, but stays heard", () => {
    expect(DUCK).toBeGreaterThan(0.1);
    expect(DUCK).toBeLessThan(0.5);
  });

  test("every song played with playLoop takes its volume from its measured loudness (songGain), never a guessed number", () => {
    const players = files.filter(({ path, code }) => !path.endsWith(join("sfx", "core.ts")) && /\bplayLoop\(/.test(code));
    expect(players.length).toBeGreaterThan(0);
    for (const { path, code } of players) expect({ path, measured: /\bsongGain\(-\d/.test(code) }).toEqual({ path, measured: true });
  });

  test("everything plays through the one limiter (speaker), never straight to the speaker", () => {
    const direct = files.filter(({ path, code }) => !path.endsWith(join("sfx", "core.ts")) && /\.destination\b/.test(code)).map(({ path }) => path);
    expect(direct).toEqual([]);
  });
});
