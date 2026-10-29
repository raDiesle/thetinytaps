import { type Board, boardFromTemplate, type StarLog } from "./board";
import { type ChartType, TEMPLATES } from "./catalog";
import { PLANNER_SETTINGS_KEY } from "./planSettings";
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

/** The first board: a week of brushing teeth, which the Zähne-putzen game fills by itself. A fixed id, so its stars stay theirs before anything is saved. */
const FIRST: Board = { ...boardFromTemplate(TEMPLATES[0]), id: "erste" };

export const DEFAULT_REWARDS_SETTINGS: RewardsSettings = {
  boards: [FIRST],
  current: FIRST.id,
  print: { orientation: "auto", color: true, colorIn: false, stickers: false, nextMonth: false },
  speech: false,
  sounds: true,
};

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

/** Whether something was saved under a key; without storage, as if it was (nothing is hidden or replaced then). */
export function saved(key: string): boolean {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return true;
  }
}

/** Nothing saved yet by the board, the plan or the page: the page opens with the wizard. */
export const firstVisit = () => ![REWARDS_SETTINGS_KEY, REWARDS_STARS_KEY, PLANNER_SETTINGS_KEY, CHARTS_KEY].some(saved);
