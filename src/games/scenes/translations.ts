import { onTexts } from "@/content/texts";
import type { SceneTranslations } from "./types";

// The translations of every scene, by scene id: each scene folder has a ru.ts, en.ts, zh.ts, hi.ts,
// es.ts and ar.ts with its words in that language, listed in src/content/texts/texts-<language>.ts and
// loaded with the app language. A scene or item without a translation is said in German.

/** Translations by scene id, in the languages loaded so far. */
export const SCENE_TRANSLATIONS: Record<string, SceneTranslations> = {};

onTexts((language, texts) => {
  for (const [sceneId, translation] of Object.entries(texts.scenes ?? {}))
    SCENE_TRANSLATIONS[sceneId] = { ...SCENE_TRANSLATIONS[sceneId], [language]: translation };
});
