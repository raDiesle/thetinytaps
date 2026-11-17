import { afterEach, expect, test } from "bun:test";
import { dayKey, daytimeOf, weekOf, withoutOldDays } from "./days";
import { isTest, read, sourceFiles } from "@/testSources";
import { readStored, writeStored } from "./storage";

// Dates are easy to get wrong by one: the week starts on Monday, local dates, old days go.

test("the clock picks morning before two and evening after", () => {
  expect(daytimeOf(new Date(2026, 9, 24, 7, 30))).toBe("morning");
  expect(daytimeOf(new Date(2026, 9, 24, 13, 59))).toBe("morning");
  expect(daytimeOf(new Date(2026, 9, 24, 14, 0))).toBe("evening");
  expect(daytimeOf(new Date(2026, 9, 24, 19, 0))).toBe("evening");
});

test("the week runs from Monday to Sunday", () => {
  // 24 October 2026 is a Saturday, 25 a Sunday.
  for (const day of [24, 25, 19]) {
    const week = weekOf(new Date(2026, 9, day, 20));
    expect(week.map(dayKey)).toEqual(["19", "20", "21", "22", "23", "24", "25"].map((d) => `2026-10-${d}`));
  }
  expect(weekOf(new Date(2026, 10, 1)).map(dayKey)[0]).toBe("2026-10-26");
});

test("days two weeks back and older are dropped", () => {
  const log = { "2026-10-10": 1, "2026-10-11": 2, "2026-10-24": 3 };
  expect(withoutOldDays(log, new Date(2026, 9, 24, 19), 14)).toEqual({ "2026-10-11": 2, "2026-10-24": 3 });
});

// The children's charts (Zähne putzen's week, Aufs Töpfchen's stars, the morning's feeling) go through these two:
// what is written must read back the same, and a broken or missing entry must give the empty chart, never an error.
const real = globalThis.localStorage;
const values = new Map<string, string>();
const fakeStorage = () => {
  values.clear();
  globalThis.localStorage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  } as Storage;
};

afterEach(() => {
  globalThis.localStorage = real;
});

test("a stored day log reads back what was written, as plain JSON under its key", () => {
  fakeStorage();
  const log = { "2026-10-24": ["evening", "morning"] };
  writeStored("tinytaps.teeth.week.v1", log);
  expect(values.get("tinytaps.teeth.week.v1")).toBe('{"2026-10-24":["evening","morning"]}');
  expect(readStored("tinytaps.teeth.week.v1", {})).toEqual(log);
});

test("missing or broken storage gives the empty log", () => {
  fakeStorage();
  expect(readStored("tinytaps.potty.stars.v1", {})).toEqual({});
  values.set("tinytaps.potty.stars.v1", "{broken");
  expect(readStored("tinytaps.potty.stars.v1", {})).toEqual({});
  expect(readStored<object | undefined>("tinytaps.mood.day.v2", undefined)).toBeUndefined();
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("off");
    },
    setItem: () => {
      throw new Error("full");
    },
  } as unknown as Storage;
  expect(readStored("tinytaps.potty.stars.v1", {})).toEqual({});
  expect(() => writeStored("tinytaps.potty.stars.v1", { "2026-10-24": 1 })).not.toThrow();
});

test("a game's saved record goes through src/lib/storage.ts, never localStorage by hand", () => {
  // Three day logs had their own try/catch round localStorage (code review, November 2026); one moving an old key may stay.
  const MAY = ["games/scenes/settings.ts"];
  const byHand = sourceFiles()
    .filter((file) => file.startsWith("games/") && /\.tsx?$/.test(file) && !isTest(file) && !MAY.includes(file))
    .filter((file) => /\blocalStorage\./.test(read(`src/${file}`)));
  expect(byHand).toEqual([]);
});
