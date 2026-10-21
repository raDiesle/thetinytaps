import type { Countable, LanguagePack, WordEntry } from "./types";

// Words in different language packs belong together when they have the same
// picture: 🐻 is "Bär" in German and "bear" in English.

/** `items` with the words given per emoji; items without a word are left out (e.g. a doing word a language has no short word for). */
export function relabel<T extends WordEntry>(items: T[], words: Record<string, string>): T[] {
  return items.filter((item) => item.emoji in words).map((item) => ({ ...item, word: words[item.emoji] }));
}

const indexes = new WeakMap<LanguagePack, Map<string, string>>();

/** Every word of `pack` by its emoji; the first word with an emoji wins. */
function index(pack: LanguagePack) {
  let words = indexes.get(pack);
  if (!words) {
    words = new Map();
    const entries: { emoji: string; word: string }[] = [
      ...pack.letters.flatMap((l) => l.words),
      ...pack.colors,
      ...pack.actions,
      ...pack.countables.map((c) => ({ emoji: c.emoji, word: c.singular })),
      ...Object.entries(pack.moreWords ?? {}).map(([emoji, word]) => ({ emoji, word })),
    ];
    for (const { emoji, word } of entries) if (!words.has(emoji)) words.set(emoji, word);
    indexes.set(pack, words);
  }
  return words;
}

/** The same thing in another language, found by its picture: Bär 🐻 → "bear". */
export function translate(word: WordEntry, to: LanguagePack): string | undefined {
  return index(to).get(word.emoji);
}

/** The same countable thing in another language, for "drei Enten – three ducks". */
export function translateCountable(thing: Countable, to: LanguagePack): Countable | undefined {
  return to.countables.find((c) => c.emoji === thing.emoji);
}
