import { afterEach, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { levelNow, levelTimerSet, paused } from "./level";

// Pause at any moment of a level (user request, November 2026): the level clock stands still while paused, and what a
// level waits for with `later` of `useLevelTimers` waits with it, so nothing ends, sounds or moves behind the veil.

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));
afterEach(() => paused.set(false));

test("the level clock stands still while paused and goes on from there", async () => {
  paused.set(true);
  const at = levelNow();
  await wait(60);
  expect(levelNow()).toBe(at);
  paused.set(false);
  await wait(20);
  expect(levelNow() - at).toBeLessThan(55);
});

test("a level's wait is held while paused and comes once the level has run its time", async () => {
  const timers = levelTimerSet();
  let fired = 0;
  timers.later(() => fired++, 50);
  await wait(20);
  paused.set(true);
  await wait(80);
  expect(fired).toBe(0);
  paused.set(false);
  await wait(15);
  expect(fired).toBe(0);
  await wait(40);
  expect(fired).toBe(1);
  timers.clearAll();
});

test("a wait cancelled or cleared never comes", async () => {
  const timers = levelTimerSet();
  let fired = 0;
  timers.later(() => fired++, 10).cancel();
  timers.later(() => fired++, 10);
  timers.clearAll();
  await wait(30);
  expect(fired).toBe(0);
});

test("the pause button and its veil are mounted while a level plays, and skip goes on to the next level", () => {
  const play = readFileSync("src/games/marbles/MarblePlay.tsx", "utf8");
  expect(play).toMatch(/\{!party && !ended && <PauseVeil next=\{nextPicture\} nextName=\{nextName\} onSkip=\{skip\} \/>\}/);
  expect(play).toMatch(/next=\{\{ name: nextName, onNext: goOn, picture: nextPicture \}\}/);
  const veil = readFileSync("src/games/marbles/PauseVeil.tsx", "utf8");
  // Paused, keys go on with the level before any level's own keys hear them.
  expect(veil).toMatch(/addEventListener\("keydown", onKey, \{ capture: true \}\)/);
  const level = readFileSync("src/games/marbles/level.ts", "utf8");
  expect(level).toMatch(/if \(!paused\.get\(\)\) tick\(levelNow\(\)\);/);
});

test("no level times itself past the level clock", () => {
  // A level reading the wall's clock or waiting with a bare timeout would move, sound or end behind the pause veil.
  const files = Array.from(new Bun.Glob("*.{ts,tsx}").scanSync(import.meta.dir)).filter(
    (file) => !/\.test\.tsx?$/.test(file) && !["level.ts", "MarblePlay.tsx", "PauseVeil.tsx"].includes(file),
  );
  expect(files.length).toBeGreaterThan(20);
  const offenders = files.filter((file) =>
    /performance\.now\(|Date\.now\(|setTimeout\(|setInterval\(|useTimers\(/.test(readFileSync(`${import.meta.dir}/${file}`, "utf8")),
  );
  expect(offenders).toEqual([]);
});
