// Days as the games that keep something per day see them (Zähne putzen's week chart, Aufs Töpfchen's stars, „Wie geht's
// dir?“'s morning feeling, the Belohnungstafel and Tagesplan): local dates, weeks from Monday, and morning or evening
// by the clock. They lived in Zähne putzen once and four games reached into it for them.

/** Which half of the day it is: the morning brushing or feeling, or the evening one. */
export type Daytime = "morning" | "evening";

/** Before two in the afternoon counts as the morning. */
const EVENING_FROM_HOUR = 14;

/** The daytime the clock says. */
export function daytimeOf(now = new Date()): Daytime {
  return now.getHours() < EVENING_FROM_HOUR ? "morning" : "evening";
}

/** The local date as "YYYY-MM-DD". */
export function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Monday to Sunday of the week `today` is in. */
export function weekOf(today: Date): Date[] {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
}

/** A log keyed by `dayKey`, so the saved charts stay small by dropping old days. */
export type DayLog<T> = Record<string, T>;

/** The log without the days `keepDays` or more before `today`. */
export function withoutOldDays<T>(log: DayLog<T>, today: Date, keepDays: number): DayLog<T> {
  const oldest = dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - keepDays));
  return Object.fromEntries(Object.entries(log).filter(([day]) => day > oldest));
}
