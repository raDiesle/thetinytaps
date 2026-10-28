// Picture prompts waiting for the grown-up's look before anything is generated with
// Gemini (/bild-erzeugen): a feature collects every picture it may want, the
// management page shows them to read, change and mark as fine, and only then
// they are made. Until then the feature shows emoji or drawings.

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
