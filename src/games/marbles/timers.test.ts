import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";

// A level's end, a sound or a line that comes a moment later goes through `later` of `useTimers` (src/lib/timers.ts),
// which drops it when the level is left. A bare `setTimeout(onDone, …)` still fired after ✕: the end's tune played in
// the menu and the level counted as played, when a grown-up left within the seconds after the last ball.

const FOLDER = "src/games/marbles";
/** The game around the levels, every level and the machines' stage: what mounts and unmounts while playing. */
const PLAYED = readdirSync(FOLDER).filter((file) => /^(MarblePlay|MachineStage|\w+Level)\.tsx$/.test(file));

test("the levels are found", () => {
  expect(PLAYED).toContain("TrackLevel.tsx");
  expect(PLAYED).toContain("ToppleLevel.tsx");
  expect(PLAYED.length).toBeGreaterThan(15);
});

test("no level sets a timeout that outlives it", () => {
  const bare = PLAYED.filter((file) => /\bset(Timeout|Interval)\(/.test(readFileSync(`${FOLDER}/${file}`, "utf8")));
  expect(bare, "use `later` of useTimers instead of setTimeout").toEqual([]);
});
