import type { TargetLanguageId } from "@/content/targetLanguages";
import { cyrillicLetterOf } from "@/lib/cyrillicKeys";
import type { SceneItem } from "./types";

/** Keys that get an item of their own; every other key brings a random item to life. */
export const SCENE_KEYS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"];

/**
 * The same in Russian: every letter of the Russian keyboard, typed at its place on any keyboard (see cyrillicKeys.ts), and the digits.
 * In alphabetical order like the Latin ones, so items whose own letter is taken get the free letters in that order.
 */
export const RUSSIAN_SCENE_KEYS = [..."АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ1234567890"];

/** The keys of the keys mode in this language: Cyrillic in Russian, else Latin. */
export const sceneKeysFor = (languageId: TargetLanguageId) => (languageId === "ru" ? RUSSIAN_SCENE_KEYS : SCENE_KEYS);

const UMLAUTS: Record<string, string> = { Ä: "A", Ö: "O", Ü: "U" };

/**
 * The key an item would like by its name, so where possible the key is the word's first letter:
 * "der Bagger" → "B" (the word after the article), "экскаватор" → "Э" (Russian names have no article).
 */
function initial(item: SceneItem, languageId: TargetLanguageId) {
  if (languageId === "ru") return item.name.charAt(0).toLocaleUpperCase("ru-RU");
  const letter = (item.name.split(" ").at(-1) ?? "").charAt(0).toLocaleUpperCase("de-DE");
  return UMLAUTS[letter] ?? letter;
}

/** The key a key press counts as in this language: in Russian the Cyrillic letter at its place, so a German keyboard types Russian. */
export function pressedKey(e: Pick<KeyboardEvent, "key" | "code">, languageId: TargetLanguageId) {
  if (languageId === "ru") return cyrillicLetterOf(e) ?? e.key.toLocaleUpperCase("ru-RU");
  return e.key.toLocaleUpperCase("de-DE");
}

/**
 * Gives every item a key: the one it asks for or its first letter if that key is still free, else any
 * free key. With more items than keys, items share a key and take turns.
 * With fewer, the spare keys repeat the items, so no key does nothing.
 * In Russian the keys are Cyrillic, so the wished-for (Latin) keys don't count there.
 */
export function assignKeys(items: readonly SceneItem[], languageId: TargetLanguageId = "de") {
  const keys = sceneKeysFor(languageId);
  const byKey = new Map<string, SceneItem[]>(keys.map((key) => [key, []]));
  const later: SceneItem[] = [];
  // Wished-for keys first, then first letters.
  const placed = new Set<SceneItem>();
  for (const item of items) {
    const wished = item.key ? byKey.get(item.key) : undefined;
    if (wished && wished.length === 0) {
      wished.push(item);
      placed.add(item);
    }
  }
  for (const item of items) {
    if (placed.has(item)) continue;
    const own = byKey.get(initial(item, languageId));
    if (own && own.length === 0) own.push(item);
    else later.push(item);
  }
  for (const item of later) {
    const free = keys.find((key) => byKey.get(key)!.length === 0);
    if (free) {
      byKey.get(free)!.push(item);
      continue;
    }
    // Share the first-letter key unless it is already much busier than others.
    const fewest = byKey.get(keys.reduce((best, key) => (byKey.get(key)!.length < byKey.get(best)!.length ? key : best)))!;
    const own = byKey.get(initial(item, languageId));
    (own && own.length <= fewest.length + 1 ? own : fewest).push(item);
  }

  // The key shown on each item: the first one it was given.
  const keyOf = new Map<string, string>();
  for (const [key, list] of byKey) for (const item of list) if (!keyOf.has(item.id)) keyOf.set(item.id, key);

  const spare = keys.filter((key) => byKey.get(key)!.length === 0);
  if (items.length > 0) spare.forEach((key, i) => byKey.get(key)!.push(items[i % items.length]));
  return { byKey, keyOf };
}
