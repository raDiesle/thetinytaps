import type { TargetLanguageId } from "@/content/targetLanguages";
import { arabicLetterOf } from "@/lib/arabicKeys";
import { cyrillicLetterOf } from "@/lib/cyrillicKeys";
import { devanagariLetterOf } from "@/lib/devanagariKeys";
import { SCENES } from ".";
import type { SceneItem } from "./types";

// Keys mode in every language: each item gets a key, where it can the first letter of its name in the
// picture's language, typed at its place on any keyboard (Q is Й in Russian, क is K in Hindi, ب is F in Arabic).

/** Keys that get an item of their own; every other key brings a random item to life. */
export const SCENE_KEYS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"];

/**
 * The same in Russian: every letter of the Russian keyboard, typed at its place on any keyboard (see cyrillicKeys.ts), and the digits.
 * In alphabetical order like the Latin ones, so items whose own letter is taken get the free letters in that order.
 */
export const RUSSIAN_SCENE_KEYS = [..."АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ1234567890"];

/**
 * In Hindi: the letters on the Hindi (InScript) keyboard without Shift (see devanagariKeys.ts), vowels first, then
 * the consonants, in the order of the alphabet, and the digits. The breathy letters on Shift (ख, घ, भ …) are no keys
 * of their own: they count as the letter on the same key without Shift (see `HINDI_SAME_KEY`).
 */
export const HINDI_SCENE_KEYS = [..."अआइईउऊएऐओऔकगचजटडतदनपबमयरलवसह1234567890"];

/** In Arabic: the 28 letters of the alphabet, in its order, as on the Arabic keyboard (see arabicKeys.ts), and the digits. */
export const ARABIC_SCENE_KEYS = [..."ابتثجحخدذرزسشصضطظعغفقكلمنهوي1234567890"];

/** The keys of the keys mode in this language: the language's own letters where it has its own script, else Latin (Chinese too). */
export function sceneKeysFor(languageId: TargetLanguageId) {
  if (languageId === "ru") return RUSSIAN_SCENE_KEYS;
  if (languageId === "hi") return HINDI_SCENE_KEYS;
  if (languageId === "ar") return ARABIC_SCENE_KEYS;
  return SCENE_KEYS;
}

/**
 * A Hindi letter that has no key of its own, as the key it counts as. The letters on Shift count as the letter on the
 * same key without Shift (ख on K is क): a toddler presses one key and never has to hold Shift, and InScript puts each
 * breathy consonant on the key of its plain partner anyway (क/ख, ग/घ, ब/भ), so the key still fits the word's sound.
 * A few letters on no key go to the nearest-sounding one (ष → स, ऋ → र, ऑ → ओ, ऍ → ए).
 */
const HINDI_SAME_KEY: Record<string, string> = {
  भ: "ब",
  ङ: "ह",
  घ: "ग",
  ध: "द",
  झ: "ज",
  ढ: "ड",
  फ: "प",
  ख: "क",
  थ: "त",
  छ: "च",
  ठ: "ट",
  ण: "म",
  श: "स",
  ष: "स",
  ञ: "ज",
  ऋ: "र",
  ऑ: "ओ",
  ऍ: "ए",
};

/** The Hindi key of a letter: itself, or the key it is typed on (see `HINDI_SAME_KEY`). */
const hindiKey = (letter: string) => HINDI_SAME_KEY[letter] ?? letter;

/** The first letter of a word without accents, in capitals: "árbol" → "A", "ñu" → "N", "Ölfass" → "O". */
const latinInitial = (word: string) => word.normalize("NFD").charAt(0).toLocaleUpperCase("de-DE");

/** The German name of an item of picture `sceneId`, for Chinese, which plays on the German keys. */
const germanName = (sceneId: string | undefined, item: SceneItem) =>
  SCENES.find((s) => s.id === sceneId)?.items.find((i) => i.id === item.id)?.name ?? item.name;

/**
 * The key an item would like by its name, so where possible the key is the word's first letter:
 * "der Bagger" → "B" (the word after the article), "экскаватор" → "Э", "excavadora" → "E", "खरगोश" → "क" (ख is on
 * the क key), "الحافلة" → "ح" (the letter after the article ال). Chinese has no letters: it keeps the German key.
 */
function initial(item: SceneItem, languageId: TargetLanguageId, sceneId?: string) {
  switch (languageId) {
    case "ru":
      return item.name.charAt(0).toLocaleUpperCase("ru-RU");
    case "en":
    case "es":
      return latinInitial(item.name);
    case "hi":
      // NFD splits a letter with a dot (ज़, फ़) into the letter and the dot.
      return hindiKey(item.name.normalize("NFD").charAt(0));
    case "ar": {
      const word = item.name.startsWith("ال") && item.name.length > 2 ? item.name.slice(2) : item.name;
      return arabicLetterOf({ key: word.charAt(0), code: "" }) ?? word.charAt(0);
    }
    default: {
      const name = languageId === "zh" ? germanName(sceneId, item) : item.name;
      return latinInitial(name.split(" ").at(-1) ?? "");
    }
  }
}

/** A digit key, whatever digit the keyboard types there (Hindi and Arabic keyboards may type १ or ١). */
const digitOf = (e: Pick<KeyboardEvent, "code">) => (/^(Digit|Numpad)\d$/.test(e.code) ? e.code.slice(-1) : undefined);

/**
 * The key a key press counts as in this language: in Russian, Hindi and Arabic the letter at the key's place, so a
 * German keyboard types them; in Hindi with or without Shift the same letter (see `HINDI_SAME_KEY`). Latin letters
 * count without their accents, so a Spanish Ñ is N and a German Ä is A, like the items' first letters.
 */
export function pressedKey(e: Pick<KeyboardEvent, "key" | "code"> & { shiftKey?: boolean }, languageId: TargetLanguageId) {
  switch (languageId) {
    case "ru":
      return cyrillicLetterOf(e) ?? e.key.toLocaleUpperCase("ru-RU");
    case "hi": {
      const letter = devanagariLetterOf(e);
      return letter ? hindiKey(letter) : (digitOf(e) ?? e.key);
    }
    case "ar":
      return arabicLetterOf(e) ?? digitOf(e) ?? e.key;
    default:
      return e.key.length === 1 ? latinInitial(e.key) : e.key.toLocaleUpperCase("de-DE");
  }
}

/**
 * Gives every item a key: the one it asks for or its first letter if that key is still free, else any
 * free key. With more items than keys, items share a key and take turns.
 * With fewer, the spare keys repeat the items, so no key does nothing.
 * The wished-for (Latin) keys count only where the keys are Latin and follow the German names: German and Chinese.
 * `sceneId` lets Chinese find the German names.
 */
export function assignKeys(items: readonly SceneItem[], languageId: TargetLanguageId = "de", sceneId?: string) {
  const keys = sceneKeysFor(languageId);
  const byKey = new Map<string, SceneItem[]>(keys.map((key) => [key, []]));
  const later: SceneItem[] = [];
  const wishes = languageId === "de" || languageId === "zh";
  // Wished-for keys first, then first letters.
  const placed = new Set<SceneItem>();
  for (const item of items) {
    const wished = wishes && item.key ? byKey.get(item.key) : undefined;
    if (wished && wished.length === 0) {
      wished.push(item);
      placed.add(item);
    }
  }
  for (const item of items) {
    if (placed.has(item)) continue;
    const own = byKey.get(initial(item, languageId, sceneId));
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
    const own = byKey.get(initial(item, languageId, sceneId));
    (own && own.length <= fewest.length + 1 ? own : fewest).push(item);
  }

  // The key shown on each item: the first one it was given.
  const keyOf = new Map<string, string>();
  for (const [key, list] of byKey) for (const item of list) if (!keyOf.has(item.id)) keyOf.set(item.id, key);

  const spare = keys.filter((key) => byKey.get(key)!.length === 0);
  if (items.length > 0) spare.forEach((key, i) => byKey.get(key)!.push(items[i % items.length]));
  return { byKey, keyOf };
}
