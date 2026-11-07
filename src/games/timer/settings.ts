import type { OwnTime } from "./time";

/**
 * What runs down while the child watches: a train going to the station, an apple tree harvested into a cart, an hourglass, a
 * caterpillar eating a leaf, a flower growing (H-53), a candle, the sun going down (H-54), ants carrying a cookie to
 * their hill (H-68), a red disc, a pizza eaten slice by slice (H-47), a children's
 * digital alarm clock counting down (H-70) – or „Abwechseln“ (H-52), two children taking
 * turns with a toy, turn after turn.
 */
export type TimerPicture = "train" | "apple" | "sand" | "caterpillar" | "flower" | "candle" | "sunset" | "ants" | "disc" | "pizza" | "clock" | "swap";

/** The toy the two children take turns with in „Abwechseln“, picked behind ⚙️. */
export type SwapToy = "bobbycar" | "doll" | "ball";

/**
 * How the time left shows in the picture's bottom right corner (user requests, November 2026): as minutes and seconds
 * (`digits`, the default), as tally marks each a share of the run (`percent`, `percentMarks` of them), as tally marks
 * for a stretch of time each (`marks`: 1 s up to 15 min), or not at all (the child sees only the picture).
 */
export type TimeShown = "percent" | "marks" | "digits" | "off";

/** The lengths a grown-up can set in the row above the cards, in seconds: 10 and 30 seconds, then 1 to 10 minutes. */
export const TIMER_SECONDS = [10, 30, 60, 120, 180, 300, 600] as const;

export interface TimerSettings {
  /** The picture played last, marked on its card; „Weiter“ goes on with the next. */
  picture: TimerPicture;
  /** How long the timer runs in seconds, one of `TIMER_SECONDS`, unless `useOwn`. */
  seconds: number;
  /** The time a grown-up set last behind „Andere …“ (H-59, H-60): it stays as a slip of its own in the row until another comes. */
  own: OwnTime | null;
  /** Whether that own time is the one chosen, instead of `seconds`. */
  useOwn: boolean;
  /** The toy in „Abwechseln“ (H-52). */
  toy: SwapToy;
  /**
   * The time left in the picture's corner, chosen behind ⚙️ while it runs. Named anew whenever the default changes
   * (`shown`, then `showTime` held the old default for everyone who had played before), so the new one reaches them too.
   */
  timeNote: TimeShown;
  /** Always off: the timer says nothing (see the root CLAUDE.md on voice). */
  speech: boolean;
  /** The whistle, chimes and the tune at the end. */
  sounds: boolean;
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  picture: "disc",
  seconds: 300,
  own: null,
  useOwn: false,
  toy: "bobbycar",
  timeNote: "digits",
  speech: false,
  sounds: true,
};

export const TIMER_SETTINGS_KEY = "tinytaps.timer.v1";
