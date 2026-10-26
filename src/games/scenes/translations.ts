import type { SceneTranslations } from "./types";

// The translations of every scene, by scene id: each scene folder has a ru.ts (and so
// on) with its words in that language. A scene or item without a translation is
// said in German.

/** Translations by scene id. */
export const SCENE_TRANSLATIONS: Record<string, SceneTranslations> = {};
