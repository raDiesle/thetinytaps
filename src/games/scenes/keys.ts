import type { SceneItem } from "./types";

/** Keys that get an item of their own; every other key brings a random item to life. */
export const SCENE_KEYS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"];

const UMLAUTS: Record<string, string> = { Ä: "A", Ö: "O", Ü: "U" };

/** "der Bagger" → "B", so where possible the key is the word's first letter. */
function initial(item: SceneItem) {
  const letter = (item.name.split(" ").at(-1) ?? "").charAt(0).toLocaleUpperCase("de-DE");
  return UMLAUTS[letter] ?? letter;
}

/**
 * Gives every item a key: the one it asks for or its first letter if that key is still free, else any
 * free key. With more items than keys, items share a key and take turns.
 * With fewer, the spare keys repeat the items, so no key does nothing.
 */
export function assignKeys(items: readonly SceneItem[]) {
  const byKey = new Map<string, SceneItem[]>(SCENE_KEYS.map((key) => [key, []]));
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
    const own = byKey.get(initial(item));
    if (own && own.length === 0) own.push(item);
    else later.push(item);
  }
  for (const item of later) {
    const free = SCENE_KEYS.find((key) => byKey.get(key)!.length === 0);
    if (free) {
      byKey.get(free)!.push(item);
      continue;
    }
    // Share the first-letter key unless it is already much busier than others.
    const fewest = byKey.get(SCENE_KEYS.reduce((best, key) => (byKey.get(key)!.length < byKey.get(best)!.length ? key : best)))!;
    const own = byKey.get(initial(item));
    (own && own.length <= fewest.length + 1 ? own : fewest).push(item);
  }

  // The key shown on each item: the first one it was given.
  const keyOf = new Map<string, string>();
  for (const [key, list] of byKey) for (const item of list) if (!keyOf.has(item.id)) keyOf.set(item.id, key);

  const spare = SCENE_KEYS.filter((key) => byKey.get(key)!.length === 0);
  if (items.length > 0) spare.forEach((key, i) => byKey.get(key)!.push(items[i % items.length]));
  return { byKey, keyOf };
}
