import type { OwnTime } from "./time";

/**
 * What runs down while the child watches: a train going to the station, apples falling into a basket, an hourglass, a
 * caterpillar eating a leaf, a flower growing (H-53), a candle, the sun going down (H-54), ants carrying a cookie to
 * their hill (H-68), a red disc, a pizza eaten slice by slice (H-47) – or „Abwechseln“ (H-52), two children taking
 * turns with a toy, turn after turn.
 */
export type TimerPicture = "train" | "apple" | "sand" | "caterpillar" | "flower" | "candle" | "sunset" | "ants" | "disc" | "pizza" | "swap";

/** The toy the two children take turns with in „Abwechseln“, picked behind ⚙️. */
export type SwapToy = "bobbycar" | "doll" | "ball";

/**
 * Whether the time left shows in the picture too, for grown-ups who want it (user request, November 2026): not at all
 * (the child sees only the picture), as digits, or as tally marks going one by one.
 */
export type TimeShown = "off" | "digits" | "marks";

/** The minutes a grown-up can set, in the row above the cards. */
export const TIMER_MINUTES = [1, 2, 3, 5, 10] as const;

export interface TimerSettings {
  /** The picture played last, marked on its card; „Weiter“ goes on with the next. */
  picture: TimerPicture;
  /** How long the timer runs, one of `TIMER_MINUTES`, unless `useOwn`. */
  minutes: number;
  /** The time a grown-up set last behind „Andere …“ (H-59, H-60): it stays as a slip of its own in the row until another comes. */
  own: OwnTime | null;
  /** Whether that own time is the one chosen, instead of `minutes`. */
  useOwn: boolean;
  /** The toy in „Abwechseln“ (H-52). */
  toy: SwapToy;
  /** The time left in the picture's corner too, chosen behind ⚙️ while it runs. */
  shown: TimeShown;
  /** Always off: the timer says nothing (see the root CLAUDE.md on voice). */
  speech: boolean;
  /** The whistle, chimes and the tune at the end. */
  sounds: boolean;
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  picture: "train",
  minutes: 5,
  own: null,
  useOwn: false,
  toy: "bobbycar",
  shown: "off",
  speech: false,
  sounds: true,
};

export const TIMER_SETTINGS_KEY = "tinytaps.timer.v1";
