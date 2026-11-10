/** How „Alltagssituationen“ puts its scenes together: as days of the little bear, or by feeling. */
export type FeelingsOrder = "tage" | "gefuehle";

export interface FeelingsSettings {
  /**
   * „Tage“ (the default, user idea, November 2026): the scenes told as days, from morning to night, with pages of the
   * story between them (`days.ts`). „Gefühle“: one card per feeling (`groups.ts`), as before.
   */
  order: FeelingsOrder;
  /** The day played last (an id from `DAYS`): its card is marked, and it goes on where it stopped. */
  day: string;
  /** The scene of `day` it goes on with, counted from 0. */
  dayScene: number;
  /** The group of „Alltagssituationen“ played last (an id from `GROUPS`): its card comes first, and it goes on where it stopped. */
  group: string;
  /** The scene of `group` a pass goes on with, counted from 0: where the child stopped last time. */
  scene: number;
  /** Per story id, which of its choices comes next (0, 1, 2 …), so a scene asks its other choices when it comes again. */
  steps: Record<string, number>;
  /**
   * Whether „Alltagssituationen“ tells its scenes, questions, answers and praise aloud. Grown-ups who tell the story to
   * the child themselves switch it off (`VoiceSwitch`); the sounds go on. „Wie geht's dir?“ always speaks.
   */
  voice: boolean;
  /** Read aloud by the browser's voice: always off (`FIXED` in src/lib/common.ts), kept for the shared options. */
  speech: boolean;
  /** Little sounds for hugs, stomping, lullabies. */
  sounds: boolean;
}

export const DEFAULT_FEELINGS_SETTINGS: FeelingsSettings = {
  order: "tage",
  day: "tag-1",
  dayScene: 0,
  group: "traurig",
  scene: 0,
  steps: {},
  voice: true,
  speech: false,
  sounds: true,
};

export const FEELINGS_SETTINGS_KEY = "tinytaps.feelings.v1";
