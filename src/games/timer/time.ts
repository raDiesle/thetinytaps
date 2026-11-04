// The times a grown-up can set beyond the row's minutes (H-59, H-60): any length from 10 seconds to 3 hours, or a
// clock time to end at. Plain functions, so the tests can check the typing and the arithmetic without a screen.

/** The shortest own length, in seconds. */
export const MIN_SECONDS = 10;
/** The longest own length, in seconds: 3 hours. */
export const MAX_SECONDS = 3 * 60 * 60;

/** The ready lengths in the sheet for times often needed, in minutes: 15, 20, 30, 45 minutes and an hour. */
export const READY_MINUTES = [15, 20, 30, 45, 60] as const;

/**
 * A time a grown-up set themselves (the slip „Andere …“): a length (`for`), or a clock time to end at (`until`, „17:30“).
 * `tomorrowFrom` is the day (`dayKey`) on which the grown-up said the clock time meant tomorrow, since it had passed;
 * on any other day it means that day's clock time again.
 */
export type OwnTime = { kind: "for"; seconds: number } | { kind: "until"; at: string; tomorrowFrom?: string };

/** A length kept within 10 seconds and 3 hours, in whole seconds. */
export function clampSeconds(seconds: number) {
  return Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, Math.round(seconds)));
}

/**
 * A length typed on a computer: „45“ is 45 minutes, „7:30“ 7 minutes and 30 seconds, „1:30:00“ an hour and a half;
 * null when it isn't one. Kept within 10 seconds and 3 hours.
 */
export function parseLength(text: string): number | null {
  const parts = text.trim().replace(/[.,]/g, ":").split(":");
  if (!parts.every((p) => /^\d{1,3}$/.test(p)) || parts.length > 3) return null;
  const [a, b, c] = parts.map(Number);
  const seconds = parts.length === 1 ? a * 60 : parts.length === 2 ? a * 60 + b : a * 3600 + b * 60 + c;
  if (parts.length > 1 && parts.slice(1).some((p) => Number(p) > 59)) return null;
  return seconds > 0 ? clampSeconds(seconds) : null;
}

/** A clock time typed on a computer: „17:30“, „17.30“, „8:10“, „1730“ or „17“; „HH:MM“, or null when it isn't one. */
export function parseClock(text: string): string | null {
  const match = text.trim().match(/^(\d{1,2})(?:[:.,h ]?(\d{2}))?$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  if (hours > 23 || minutes > 59) return null;
  return clock(hours * 60 + minutes);
}

/** Minutes after midnight as „HH:MM“, wrapping round the day. */
export function clock(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** „HH:MM“ as minutes after midnight. */
export function clockMinutes(at: string) {
  const [h, m] = at.split(":").map(Number);
  return h * 60 + m;
}

/** The local day of `date` as „YYYY-MM-DD“. */
export function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** When the clock time `at` comes on the day of `now` (or the day after, with `tomorrow`), in ms since 1970. */
export function clockOn(at: string, now: Date, tomorrow = false) {
  const end = new Date(now);
  end.setHours(0, clockMinutes(at), 0, 0);
  if (tomorrow) end.setDate(end.getDate() + 1);
  return end.getTime();
}

/**
 * How long the own time runs from `now`, in ms – or `"past"` when it is a clock time already behind us today, which the
 * timer never quietly takes as tomorrow's but asks about (H-60).
 */
export function ownTimeMs(time: OwnTime, now: Date): number | "past" {
  if (time.kind === "for") return clampSeconds(time.seconds) * 1000;
  const end = clockOn(time.at, now, time.tomorrowFrom === dayKey(now));
  return end > now.getTime() ? end - now.getTime() : "past";
}

/** A length as a grown-up reads it on a slip: „45 Sek.“, „7 Min. 30 Sek.“, „20 Min.“, „1 Std.“, „1 Std. 30 Min.“. */
export function lengthLabel(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h && `${h} Std.`, m && `${m} Min.`, s && `${s} Sek.`].filter(Boolean).join(" ") || "0 Sek.";
}

/** Time left as digits for grown-ups: „0:45“, „4:37“, „1:04:37“, rounded up to the second. */
export function digits(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}
