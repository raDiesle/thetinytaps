import { type Board, boardFromTemplate, type StarLog } from "./board";
import { type ChartType, TEMPLATES } from "./catalog";
import type { PhotoFormat } from "./photo";

/** How the board is printed. */
export interface PrintOptions {
  /** "auto": landscape for most boards, portrait for a day board with one or two tasks. */
  orientation: "auto" | "landscape" | "portrait";
  /** In colour, or black and white to save ink. */
  color: boolean;
  /** Fields show the mark's outline to colour in, instead of an empty circle for a sticker. */
  colorIn: boolean;
  /** A second page of marks to cut out and stick on. */
  stickers: boolean;
  /** A month board prints next month's calendar instead of this one's (printed near the month's end). */
  nextMonth: boolean;
  /** The photo size the stars are laid out on; missing in options saved before photo prints. */
  photo?: PhotoFormat["id"];
}

export interface RewardsSettings {
  boards: Board[];
  /** Id of the board shown. */
  current: string;
  print: PrintOptions;
  speech: boolean;
  sounds: boolean;
}

/**
 * The board that older versions showed before anything was saved (a week of brushing teeth, fixed id): no longer made,
 * a first visit starts with the wizard, but kept where it already has stars, so they are never lost.
 */
const OLD_FIRST: Board = { ...boardFromTemplate(TEMPLATES[0]), id: "erste" };

/** No board yet: the page opens with the wizard until one is made. */
export const DEFAULT_REWARDS_SETTINGS: RewardsSettings = {
  boards: [],
  current: "",
  print: { orientation: "auto", color: true, colorIn: false, stickers: false, nextMonth: false },
  speech: false,
  sounds: true,
};

/** The defaults on this device: none, or the old first board while its stars are kept and nothing was saved over it. */
export const rewardsDefaults = (log: StarLog): RewardsSettings =>
  log[OLD_FIRST.id] ? { ...DEFAULT_REWARDS_SETTINGS, boards: [OLD_FIRST], current: OLD_FIRST.id } : DEFAULT_REWARDS_SETTINGS;

export const REWARDS_SETTINGS_KEY = "tinytaps.rewards.v1";

/** The stars, apart from the boards so editing a board never touches them. */
export const REWARDS_STARS_KEY = "tinytaps.rewards.stars.v1";

export const NO_STARS: StarLog = {};

/** What the page itself remembers: whether a board or a plan was shown last, so it opens there again. */
export interface ChartsSettings {
  /** Missing until the grown-up has chosen: then the address decides (`/tagesplan/` a plan). */
  shown?: ChartType;
}

export const CHARTS_KEY = "tinytaps.tafeln.v1";
