import { type DayLog, dayKey, withoutOldDays } from "@/lib/days";
import { readStored, writeStored } from "@/lib/storage";

// Every time the child really went (a grown-up tapped a ✓ on the potty), the end
// of the story puts a star on today's column. Kept for two weeks, so the chart
// can show this week and the log stays small.

/** How many stars each day got, keyed by the local date ("2026-10-26"). */
export type StarLog = DayLog<number>;

export const STARS_KEY = "tinytaps.potty.stars.v1";

/** Older days are dropped. */
const KEEP_DAYS = 14;

/** The log with one more star today, and days older than two weeks dropped. */
export function addStar(log: StarLog, today: Date): StarLog {
  const key = dayKey(today);
  const kept = withoutOldDays(log, today, KEEP_DAYS);
  return { ...kept, [key]: (kept[key] ?? 0) + 1 };
}

/** The saved log; an empty one when there is none or it can't be read. */
export const loadStars = (): StarLog => readStored<StarLog>(STARS_KEY, {});

/** Saves the log; if storage is full or off, the stars only last this visit. */
export const saveStars = (log: StarLog) => writeStored(STARS_KEY, log);
