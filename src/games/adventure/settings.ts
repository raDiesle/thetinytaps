export interface AdventureSettings {
  /** The guide speaks every situation and movement; off by default, the fox shows everything. */
  speech: boolean;
  /** Background music; off by default. */
  music: boolean;
  /** Splashes, whooshes and sparkles. */
  sounds: boolean;
  /** A glowing outline of a child shows the movement next to the fox. */
  outline: boolean;
  /** The body part the movement is about (arms, legs or body) gets a glowing outline while it moves. */
  glow: boolean;
}

export const DEFAULT_ADVENTURE_SETTINGS: AdventureSettings = {
  speech: false,
  music: false,
  sounds: true,
  outline: true,
  glow: true,
};

// v2: speech is off by default now, so old saved settings start fresh.
// v3: no music by default, so music saved before is switched off once; all other choices are carried over.
export const ADVENTURE_SETTINGS_KEY = "tinytaps.adventure.v3";
const OLD_ADVENTURE_SETTINGS_KEY = "tinytaps.adventure.v2";

/** Takes over the settings saved under v2, without the music. Call before reading the settings. */
export function carryOverAdventureSettings() {
  try {
    const old = localStorage.getItem(OLD_ADVENTURE_SETTINGS_KEY);
    if (old === null || localStorage.getItem(ADVENTURE_SETTINGS_KEY) !== null) return;
    const { music: _, ...rest } = JSON.parse(old) as Partial<AdventureSettings>;
    localStorage.setItem(ADVENTURE_SETTINGS_KEY, JSON.stringify(rest));
    localStorage.removeItem(OLD_ADVENTURE_SETTINGS_KEY);
  } catch {
    // Broken or unavailable storage: the defaults apply.
  }
}
