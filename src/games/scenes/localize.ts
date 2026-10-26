import type { TargetLanguageId } from "@/content/targetLanguages";
import { SCENE_TRANSLATIONS } from "./translations";
import type { Scene, SceneItem, SceneTranslation } from "./types";

// A picture in the app language: its title, description, the names and sentences
// of its items and the sentences of its chains come from the scene's translation
// (translations.ts), everything else (drawings, boxes, sounds) stays the same.
// What a translation lacks – the whole scene, an item or a chain – is German.

/** The scene's translation into `languageId`, if there is one (German is the scene itself). */
const translationOf = (sceneId: string, languageId: TargetLanguageId): SceneTranslation | undefined =>
  languageId === "de" ? undefined : SCENE_TRANSLATIONS[sceneId]?.[languageId];

/** The item of picture `sceneId` with its name, sentences and grammar in `languageId`; German when it has no translation. */
export function localizeItem(sceneId: string, item: SceneItem, languageId: TargetLanguageId): SceneItem {
  const words = translationOf(sceneId, languageId)?.items[item.id];
  if (!words) return item;
  return { ...item, name: words.name, sentences: words.sentences, plural: words.plural, gender: words.gender };
}

/** Localized scenes, made once per scene and language, so each keeps the same identity (React memos depend on it). */
const cache = new WeakMap<Scene, Map<TargetLanguageId, Scene>>();

/** The scene in `languageId`: title, description, items and chain sentences; German wherever a translation is missing. */
export function localizeScene(scene: Scene, languageId: TargetLanguageId): Scene {
  const translation = translationOf(scene.id, languageId);
  if (!translation) return scene;
  const byLanguage = cache.get(scene) ?? new Map<TargetLanguageId, Scene>();
  cache.set(scene, byLanguage);
  const cached = byLanguage.get(languageId);
  if (cached) return cached;
  const localized: Scene = {
    ...scene,
    title: translation.title,
    description: translation.description,
    items: scene.items.map((item) => localizeItem(scene.id, item, languageId)),
    chains: scene.chains?.map((chain, c) => ({
      ...chain,
      steps: chain.steps.map((step, s) => ({ ...step, sentence: translation.chains?.[c]?.[s] ?? step.sentence })),
    })),
  };
  byLanguage.set(languageId, localized);
  return localized;
}
