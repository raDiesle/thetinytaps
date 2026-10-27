import { describe, expect, test } from "bun:test";
import { DEFAULT_PLAYTIME_SETTINGS, limitReached, parseSettings } from "./playtime";

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

  test("the limit counts what it is set to, and nothing without one", () => {
    const played = { day, ms: 10 * 60_000, games: 3 };
    expect(limitReached({ by: "time", minutes: 10, games: 1 }, played)).toBe(true);
    expect(limitReached({ by: "time", minutes: 15, games: 1 }, played)).toBe(false);
    expect(limitReached({ by: "games", minutes: 5, games: 3 }, played)).toBe(true);
    expect(limitReached({ by: "games", minutes: 5, games: 4 }, played)).toBe(false);
    expect(limitReached({ by: "none", minutes: 5, games: 1 }, played)).toBe(false);
  });
});
