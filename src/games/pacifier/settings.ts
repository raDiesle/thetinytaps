import type { Farewell } from "./content";

/** What grown-ups choose behind ⚙️ while playing, so the story is the one they really do at home. */
export interface PacifierSettings {
  /** Pops, the lamp's click, the fairy's glitter and the cheering. */
  sounds: boolean;
  /** How the pacifiers leave: the box on the windowsill or the balloon. */
  farewell: Farewell;
  /** The present the fairy leaves (`GIFTS`). */
  gift: string;
}

export const DEFAULT_PACIFIER_SETTINGS: PacifierSettings = {
  sounds: true,
  farewell: "box",
  gift: "teddy",
};

export const PACIFIER_SETTINGS_KEY = "tinytaps.pacifier.v1";
