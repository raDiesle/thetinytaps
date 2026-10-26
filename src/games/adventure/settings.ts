import type { TargetLanguageId } from "@/content/targetLanguages";

/** The 3D stories to choose from on the start screen. */
export type AdventureStoryId = "schatzinsel" | "wolkenreise";

export interface AdventureSettings {
  /** The story played last, marked on the start screen. */
  story: AdventureStoryId;
  /** The guide speaks every situation and movement; off by default, the fox shows everything. */
  speech: boolean;
  /** Background music; off by default. */
  music: boolean;
  /** The language Tapsi speaks in (when speech is on); "app" follows the app's language, chosen on the home page. */
  voiceLanguage: TargetLanguageId | "app";
  /** Splashes, whooshes and sparkles. */
  sounds: boolean;
  /** A glowing outline of a child shows the movement next to the fox. */
  outline: boolean;
  /** The body part the movement is about (arms, legs or body) gets a glowing outline while it moves. */
  glow: boolean;
}

export const DEFAULT_ADVENTURE_SETTINGS: AdventureSettings = {
  story: "schatzinsel",
  speech: false,
  music: false,
  voiceLanguage: "app",
  sounds: true,
  outline: true,
  glow: true,
};

// v2: speech is off by default now, so old saved settings start fresh.
// v3: no music by default, so music saved before is switched off once; all other choices are carried over.
export const ADVENTURE_SETTINGS_KEY = "tinytaps.adventure.v3";
const OLD_ADVENTURE_SETTINGS_KEY = "tinytaps.adventure.v2";

/** The language in Tapsi's voice was saved as `language` before there was an app language. */
type SavedBefore = Partial<AdventureSettings> & { language?: TargetLanguageId };

/** Takes over the settings saved under v2, without the music, and the old `language`. Call before reading the settings. */
export function carryOverAdventureSettings() {
  try {
    const old = localStorage.getItem(OLD_ADVENTURE_SETTINGS_KEY);
    if (old !== null && localStorage.getItem(ADVENTURE_SETTINGS_KEY) === null) {
      const { music: _, ...rest } = JSON.parse(old) as SavedBefore;
      localStorage.setItem(ADVENTURE_SETTINGS_KEY, JSON.stringify(rest));
      localStorage.removeItem(OLD_ADVENTURE_SETTINGS_KEY);
    }
    // Every change on the start screen saved all settings, so a saved "de" is almost always the old
    // default, not a choice: it now follows the app language. Any other language was chosen and stays.
    const saved = localStorage.getItem(ADVENTURE_SETTINGS_KEY);
    if (saved === null) return;
    const { language, ...rest } = JSON.parse(saved) as SavedBefore;
    if (language === undefined) return;
    localStorage.setItem(ADVENTURE_SETTINGS_KEY, JSON.stringify(language === "de" || rest.voiceLanguage ? rest : { ...rest, voiceLanguage: language }));
  } catch {
    // Broken or unavailable storage: the defaults apply.
  }
}
