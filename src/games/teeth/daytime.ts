import { byLanguage } from "@/content/texts";
import { type Spoken, spokenIn } from "@/lib/language";
import type { TargetLanguage, TargetLanguageId } from "@/content/targetLanguages";

// Brushing in the morning looks different from brushing at night: the sun
// rises or the moon is out, crumbs from breakfast or pyjamas before bed. The
// week chart keeps a star for every morning and every evening brushed.

/** Which brushing of the day this is. */
export type Daytime = "morning" | "evening";

/** Before two in the afternoon counts as the morning brush. */
const EVENING_FROM_HOUR = 14;

/** The daytime the clock says. */
export function daytimeOf(now = new Date()): Daytime {
  return now.getHours() < EVENING_FROM_HOUR ? "morning" : "evening";
}

/** What is said and shown differently in the morning and the evening, in one language. */
export interface DaytimeTexts {
  /** Said before the first cue. */
  hello: string;
  /** Said while the sugar crumbs grow into monsters: over the day before the evening brushing, over the night before the morning one. */
  grow: string;
  /** The heading at the end. */
  doneTitle: string;
  /** Said after spitting out at the end. */
  after: string;
}

/** The German texts; the other languages are in daytime.<language>.ts (DAYTIME_TRANSLATIONS). */
export const DAYTIME: Record<Daytime, DaytimeTexts> = {
  morning: {
    hello: "Guten Morgen!",
    grow: "In der Nacht wachsen daraus Zuckermonster.",
    doneTitle: "☀️ Blitzeblank!",
    after: "Jetzt kann der Tag losgehen!",
  },
  evening: {
    hello: "Bald ist Schlafenszeit.",
    grow: "Den ganzen Tag über wachsen daraus Zuckermonster.",
    doneTitle: "🌙 Gute Nacht!",
    after: "Jetzt ab ins Bett. Gute Nacht!",
  },
};

/** The morning and evening texts in the other languages, by language. */
export const DAYTIME_TRANSLATIONS: Partial<Record<TargetLanguageId, Record<Daytime, Partial<DaytimeTexts>>>> = byLanguage((texts) => texts.teethDaytime);

/** One of the daytime's texts in `language` and the voice for it; the German one with the German voice where there is no translation. */
export const daytimeText = (daytime: Daytime, key: keyof DaytimeTexts, language: TargetLanguage): Spoken =>
  spokenIn(
    { de: DAYTIME[daytime][key], [language.id]: language.id === "de" ? DAYTIME[daytime][key] : DAYTIME_TRANSLATIONS[language.id]?.[daytime][key] },
    language,
  );

/** Which brushings were finished on which day, keyed by the local date ("2026-10-24"). */
export type WeekLog = Record<string, Daytime[]>;

export const WEEK_KEY = "tinytaps.teeth.week.v1";

/** Older days are dropped, so the log stays small. */
const KEEP_DAYS = 14;

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

/** The log with this brushing added once, and days older than two weeks dropped. */
export function addBrushing(log: WeekLog, today: Date, daytime: Daytime): WeekLog {
  const oldest = dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - KEEP_DAYS));
  const key = dayKey(today);
  const kept = Object.fromEntries(Object.entries(log).filter(([day]) => day > oldest));
  const done = kept[key] ?? [];
  return { ...kept, [key]: done.includes(daytime) ? done : [...done, daytime] };
}

/** The saved log; an empty one when there is none or it can't be read. */
export function loadWeek(): WeekLog {
  try {
    const raw = localStorage.getItem(WEEK_KEY);
    if (raw) return JSON.parse(raw) as WeekLog;
  } catch {
    // Broken or unavailable storage: start a fresh chart.
  }
  return {};
}

/** Saves the log; if storage is full or off the chart only lasts this visit. */
export function saveWeek(log: WeekLog) {
  try {
    localStorage.setItem(WEEK_KEY, JSON.stringify(log));
  } catch {
    // Nothing to do: the stars still show until the page closes.
  }
}
