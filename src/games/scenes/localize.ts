import type { TargetLanguageId } from "@/content/targetLanguages";
import { SCENES } from ".";
import { SCENE_TRANSLATIONS } from "./translations";
import type { Scene, SceneItem, SceneTranslation } from "./types";

// A picture in the app language: its title, description, the names and sentences
// of its items and the sentences of its chains come from the scene's translation
// (translations.ts), everything else (drawings, boxes, sounds) stays the same.
// Translations are made only on request, so a picture can be half translated: it
// then plays entirely in German (names, sentences, voice and keys), never mixed.

/** Whether `translation` covers every item and every chain step of `scene`. */
const covers = (scene: Pick<Scene, "items" | "chains">, translation: SceneTranslation) =>
  scene.items.every((item) => translation.items[item.id]) && (scene.chains ?? []).every((chain, c) => translation.chains?.[c]?.length === chain.steps.length);

/** The language picture `sceneId` plays in: `languageId` when it is translated completely, otherwise German. */
export function sceneLanguage(sceneId: string, languageId: TargetLanguageId): TargetLanguageId {
  const translation = languageId === "de" ? undefined : SCENE_TRANSLATIONS[sceneId]?.[languageId];
  const scene = SCENES.find((s) => s.id === sceneId);
  return translation && scene && covers(scene, translation) ? languageId : "de";
}

/** The scene's complete translation into `languageId`, if there is one (German is the scene itself). */
const translationOf = (sceneId: string, languageId: TargetLanguageId): SceneTranslation | undefined =>
  sceneLanguage(sceneId, languageId) === "de" ? undefined : SCENE_TRANSLATIONS[sceneId]?.[languageId];

/** The item of picture `sceneId` with its name, sentences and grammar in `languageId`; German when the picture is not translated completely. */
export function localizeItem(sceneId: string, item: SceneItem, languageId: TargetLanguageId): SceneItem {
  const words = translationOf(sceneId, languageId)?.items[item.id];
  if (!words) return item;
  return { ...item, name: words.name, sentences: words.sentences, plural: words.plural, gender: words.gender };
}

/** Localized scenes, made once per scene and language, so each keeps the same identity (React memos depend on it). */
const cache = new WeakMap<Scene, Map<TargetLanguageId, Scene>>();

/** The scene in `languageId`: title, description, items and chain sentences; German when its translation is missing or incomplete. */
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
