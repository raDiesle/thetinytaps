import { type Board, boardFromTemplate, type StarLog } from "./board";
import { TEMPLATES } from "./catalog";

/** How the board is printed. */
export interface PrintOptions {
  /** "auto": landscape for week and collecting boards, portrait for a day board. */
  orientation: "auto" | "landscape" | "portrait";
  /** In colour, or black and white to save ink. */
  color: boolean;
  /** Fields show the mark's outline to colour in, instead of an empty circle for a sticker. */
  colorIn: boolean;
  /** A second page of marks to cut out and stick on. */
  stickers: boolean;
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
  print: { orientation: "auto", color: true, colorIn: false, stickers: false },
  speech: false,
  sounds: true,
};

export const REWARDS_SETTINGS_KEY = "tinytaps.rewards.v1";

/** The stars, apart from the boards so editing a board never touches them. */
export const REWARDS_STARS_KEY = "tinytaps.rewards.stars.v1";

export const NO_STARS: StarLog = {};
