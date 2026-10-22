// Which time of the year the pictures show (idea B-18). The scenes stay the
// same; each season only adds a few things: leaves and a pumpkin in autumn,
// snow and a snowman in winter, a Christmas tree in Advent, an egg at Easter.

export type Season = "herbst" | "winter" | "advent" | "ostern";

/** Parent setting: follow the calendar, a fixed season, or no extras at all. */
export type SeasonSetting = "auto" | "none" | Season;

export const SEASON_LABELS: Record<Season, string> = {
  herbst: "🍂 Herbst",
  winter: "⛄ Winter",
  advent: "🎄 Advent",
  ostern: "🐣 Ostern",
};

/** Easter Sunday of the year (Gregorian calendar, anonymous algorithm). */
export function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The season on that day: Advent from 1 December to Epiphany (6 January), then
 * winter until the end of February; Easter from two weeks before Easter Sunday
 * to a week after; autumn from 22 September to the end of November.
 */
export function seasonOn(date: Date): Season | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 12 || (month === 1 && day <= 6)) return "advent";
  if (month <= 2) return "winter";
  if ((month === 9 && day >= 22) || month === 10 || month === 11) return "herbst";
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((today.getTime() - easterSunday(date.getFullYear()).getTime()) / DAY_MS);
  if (days >= -14 && days <= 7) return "ostern";
  return null;
}

export function activeSeason(setting: SeasonSetting, date = new Date()): Season | null {
  if (setting === "auto") return seasonOn(date);
  return setting === "none" ? null : setting;
}
