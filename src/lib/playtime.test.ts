import { describe, expect, test } from "bun:test";
import { DEFAULT_PLAYTIME_SETTINGS, dueToSave, limitReached, type PlaytimeState, parsePlayed, parseSettings, SAVE_EVERY_MS, shownChanged } from "./playtime";

const day = new Date().toDateString();

describe("play time", () => {
  test("a minutes value saved before there was a choice of limit stays a time limit", () => {
    expect(parseSettings(JSON.stringify({ minutes: 20 }))).toEqual({ ...DEFAULT_PLAYTIME_SETTINGS, by: "time", minutes: 20 });
    expect(parseSettings(JSON.stringify({ minutes: 0 }))).toEqual(DEFAULT_PLAYTIME_SETTINGS);
    expect(parseSettings(null)).toEqual(DEFAULT_PLAYTIME_SETTINGS);
    expect(parseSettings("{broken")).toEqual(DEFAULT_PLAYTIME_SETTINGS);
  });

  test("new settings are read as saved", () => {
    expect(parseSettings(JSON.stringify({ by: "games", minutes: 15, games: 4 }))).toEqual({ by: "games", minutes: 15, games: 4 });
  });

  test("a saved field of the wrong type falls back to its default, the others stay", () => {
    expect(parseSettings(JSON.stringify({ by: "games", minutes: "20", games: 4 }))).toEqual({ by: "games", minutes: 15, games: 4 });
    expect(parseSettings(JSON.stringify({ by: "time", minutes: 30, games: null }))).toEqual({ by: "time", minutes: 30, games: 3 });
    expect(parseSettings(JSON.stringify({ by: "time", minutes: -5, games: 2 }))).toEqual({ by: "time", minutes: 15, games: 2 });
    // An unknown limit is no limit of its own: only a minutes value saved with it still means a time limit.
    expect(parseSettings(JSON.stringify({ by: "forever", games: 2 }))).toEqual(DEFAULT_PLAYTIME_SETTINGS);
    expect(parseSettings(JSON.stringify({ by: 7, minutes: 20 }))).toEqual({ ...DEFAULT_PLAYTIME_SETTINGS, by: "time", minutes: 20 });
    expect(parseSettings(JSON.stringify({ minutes: "20" }))).toEqual(DEFAULT_PLAYTIME_SETTINGS);
    for (const raw of ["5", "null", "[1,2]", '"time"']) expect(parseSettings(raw)).toEqual(DEFAULT_PLAYTIME_SETTINGS);
  });

  test("what was played today is read as saved, a field of the wrong type as nothing played", () => {
    expect(parsePlayed(JSON.stringify({ day, ms: 90_000, games: 2 }))).toEqual({ day, ms: 90_000, games: 2 });
    expect(parsePlayed(JSON.stringify({ day, ms: "90000", games: 2 }))).toEqual({ day, ms: 0, games: 2 });
    expect(parsePlayed(JSON.stringify({ day, ms: 90_000, games: -1 }))).toEqual({ day, ms: 90_000, games: 0 });
    expect(parsePlayed(JSON.stringify({ day: "Mon Jan 01 2001", ms: 90_000, games: 2 }))).toEqual({ day, ms: 0, games: 0 });
    for (const raw of [null, "{broken", "3", "[]"]) expect(parsePlayed(raw)).toEqual({ day, ms: 0, games: 0 });
  });

  test("the limit counts what it is set to, and nothing without one", () => {
    const played = { day, ms: 10 * 60_000, games: 3 };
    expect(limitReached({ by: "time", minutes: 10, games: 1 }, played)).toBe(true);
    expect(limitReached({ by: "time", minutes: 15, games: 1 }, played)).toBe(false);
    expect(limitReached({ by: "games", minutes: 5, games: 3 }, played)).toBe(true);
    expect(limitReached({ by: "games", minutes: 5, games: 4 }, played)).toBe(false);
    expect(limitReached({ by: "none", minutes: 5, games: 1 }, played)).toBe(false);
  });
});

describe("counting while playing", () => {
  // Once a second it wrote localStorage and re-rendered every component showing play time (code review, November 2026).
  test("the time counted is written every SAVE_EVERY_MS, not every second", () => {
    let lastSaved = 0;
    let writes = 0;
    for (let now = 1000; now <= 60_000; now += 1000) {
      if (dueToSave(lastSaved, now)) {
        writes++;
        lastSaved = now;
      }
    }
    expect(SAVE_EVERY_MS).toBeGreaterThanOrEqual(5000);
    expect(writes).toBe(60_000 / SAVE_EVERY_MS);
  });

  test("a second counted tells the components only when what they show changes", () => {
    const at = (ms: number, more: Partial<PlaytimeState> = {}): PlaytimeState => ({
      settings: { ...DEFAULT_PLAYTIME_SETTINGS, by: "time" },
      played: { day: "today", ms, games: 1 },
      over: false,
      inGame: true,
      goodNight: false,
      dusk: 0,
      ...more,
    });
    expect(shownChanged(at(61_000), at(62_000))).toBe(false);
    expect(shownChanged(at(119_500), at(120_500))).toBe(true);
    expect(shownChanged(at(0), at(1000))).toBe(true);
    expect(shownChanged(at(5000, { dusk: 0.2 }), at(6000, { dusk: 0.3 }))).toBe(true);
    expect(shownChanged(at(5000), at(6000, { over: true }))).toBe(true);
  });
});
