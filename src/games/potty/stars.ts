import { dayKey } from "@/games/teeth/daytime";

// Every time the child really went (a grown-up tapped a ✓ on the potty), the end
// of the story puts a star on today's column. Kept for two weeks, so the chart
// can show this week and the log stays small.

/** How many stars each day got, keyed by the local date ("2026-10-26"). */
export type StarLog = Record<string, number>;

export const STARS_KEY = "tinytaps.potty.stars.v1";

/** Older days are dropped. */
const KEEP_DAYS = 14;

/** The log with one more star today, and days older than two weeks dropped. */
export function addStar(log: StarLog, today: Date): StarLog {
  const oldest = dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - KEEP_DAYS));
  const key = dayKey(today);
  const kept = Object.fromEntries(Object.entries(log).filter(([day]) => day > oldest));
  return { ...kept, [key]: (kept[key] ?? 0) + 1 };
}

/** The saved log; an empty one when there is none or it can't be read. */
export function loadStars(): StarLog {
  try {
    const raw = localStorage.getItem(STARS_KEY);
    if (raw) return JSON.parse(raw) as StarLog;
  } catch {
    // Broken or unavailable storage: start a fresh chart.
  }
  return {};
}

/** Saves the log; if storage is full or off, the stars only last this visit. */
export function saveStars(log: StarLog) {
  try {
    localStorage.setItem(STARS_KEY, JSON.stringify(log));
  } catch {
    // Nothing to do: the stars still show until the page closes.
  }
}
