// The Gemini prompts of a feature's pictures (/bild-erzeugen), kept with the code so a picture can be changed and
// made again. The management page doesn't show them for review any more (user decision, November 2026): a picture
// to make goes into the queue (pictureQueue.ts), and the page shows only how many wait there.

import { REWARDS_PICTURE_PROMPTS } from "@/games/rewards/bilder/prompts";

/** One picture to make with `bun run image`. */
export interface PicturePrompt {
  /** Unique in its set; the file's name without folder and extension. */
  id: string;
  /** Where the picture goes, relative to the repository. */
  file: string;
  /** What it is for, in German, for the grown-up. */
  use: string;
  /** The prompt, in English like every Gemini prompt here. */
  prompt: string;
  /** Options for `bun run image`, e.g. "--transparent --size 512". */
  options: string;
  /** Pictures passed as `--ref`, relative to the repository. */
  ref?: string[];
  /** The picture's bundled URL once `file` is made; one without is still to make. */
  url?: string;
}

/** Prompts of one kind, e.g. all task pictures. */
export interface PicturePromptGroup {
  title: string;
  /** What holds for all of them. */
  note?: string;
  prompts: PicturePrompt[];
}

/** All prompts of one feature. */
export interface PicturePromptSet {
  id: string;
  emoji: string;
  title: string;
  /** When they were written, YYYY-MM-DD. */
  date: string;
  /** What the pictures are for and what to check. */
  intro: string;
  groups: PicturePromptGroup[];
}

/** Every set, newest first. */
export const PICTURE_PROMPTS: PicturePromptSet[] = [REWARDS_PICTURE_PROMPTS];
