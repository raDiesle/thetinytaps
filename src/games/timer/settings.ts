import type { OwnTime } from "./time";

/**
 * What runs down while the child watches: a train going to the station, an apple tree harvested into a cart, an hourglass, a
 * caterpillar eating a leaf, a flower growing (H-53), a candle, the sunrise (H-54), a red disc, a pizza eaten slice by slice (H-47), a children's
 * digital alarm clock counting down (H-70), a jar filling with marbles from a pegboard (H-149) – or „Abwechseln“ (H-52),
 * two to four children taking turns, turn after turn, at an hourglass, on a seesaw (H-109), a marble run (H-117) or a
 * race track.
 */
export type TimerPicture =
  | "train"
  | "apple"
  | "sand"
  | "caterpillar"
  | "flower"
  | "candle"
  | "sunset"
  | "disc"
  | "pizza"
  | "clock"
  | "tidy"
  | "boxes"
  | "blocks"
  | "tunnel"
  | "jump"
  | "jar"
  | TurnPicture;

/**
 * The pictures of taking turns, which run on without end: the hourglass between the children's cushions, the seesaw
 * (H-109; Tennis, H-71, was taken out), the Kugelbahn, whose marble rolls into the next child's cup (H-117), and the
 * Rennstrecke, a lap of a race track for each child's turn.
 */
export type TurnPicture = "swap" | "seesaw" | "marblerun" | "race";

/** How many children take turns in every picture of taking turns (H-115; all of them since 25 November 2026), chosen behind ⚙️. */
export type TurnCount = 2 | 3 | 4;

/**
 * The children taking turns, left to right in the order of their turns: the fox's and the bear's, then a rabbit's and a
 * frog's – each with its colours and its animal's ears on its cushion, cup, mat or helmet.
 */
export type TurnChild = "fox" | "bear" | "rabbit" | "frog";

/**
 * Who a child taking turns really is, set by a grown-up behind ⚙️ (user request, 25 November 2026): its name, or a
 * photo picked on the device – kept only in this browser, made small (`photoFromFile`), never sent anywhere.
 */
export interface PlayerLook {
  /** The child's name, shown on its place and in „Wer ist dran?“. */
  name?: string;
  /** A small square photo of the child as a data URL (JPEG), shown on its place instead of the name. */
  photo?: string;
}

/** The children's names and photos, by their place in the turns. */
export type Players = Partial<Record<TurnChild, PlayerLook>>;

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
  /** How long the timer runs in seconds, one of `TIMER_SECONDS`, unless `useOwn`. Chosen per visit, never stored: each visit starts at 5 minutes. */
  seconds: number;
  /** The time a grown-up set last behind „Andere …“ (H-59, H-60): it stays as a slip of its own in the row until another comes. */
  own: OwnTime | null;
  /** Whether that own time is the one chosen, instead of `seconds`. Per visit like `seconds`, never stored. */
  useOwn: boolean;
  /** How many children take turns in the pictures of taking turns (H-115), two by default. */
  kids: TurnCount;
  /** The names and photos a grown-up gave the children taking turns. */
  players: Players;
  /**
   * The time left in the picture's corner, chosen behind ⚙️ while it runs. Named anew whenever the default changes
   * (`shown`, then `showTime` held the old default for everyone who had played before), so the new one reaches them too.
   */
  timeNote: TimeShown;
  /** The bar along the bottom (`TimeBar`), a second way to see the time beside the picture; on by default, off behind ⚙️. */
  bar: boolean;
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  picture: "disc",
  seconds: 300,
  own: null,
  useOwn: false,
  kids: 2,
  players: {},
  timeNote: "digits",
  bar: true,
};

export const TIMER_SETTINGS_KEY = "tinytaps.timer.v1";
