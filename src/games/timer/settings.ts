import type { OwnTime } from "./time";

/** What runs down while the child watches: a train going to the station, an hourglass, a candle. */
export type TimerPicture = "train" | "sand" | "candle";

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
  speech: false,
  sounds: true,
};

export const TIMER_SETTINGS_KEY = "tinytaps.timer.v1";
