/** The 3D stories to choose from on the start screen. */
export type AdventureStoryId = "schatzinsel" | "wolkenreise";

/**
 * Only the story played last is kept: read aloud, sounds, music and Tapsi's language
 * come from the home page, the glow and the child figure are always on.
 */
export interface AdventureSettings {
  /** The story played last, marked on the start screen. */
  story: AdventureStoryId;
}

export const DEFAULT_ADVENTURE_SETTINGS: AdventureSettings = { story: "schatzinsel" };

export const ADVENTURE_SETTINGS_KEY = "tinytaps.adventure.v3";
