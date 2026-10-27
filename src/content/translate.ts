import type { WordEntry } from "./types";

// Words in different language packs belong together when they have the same
// picture: 🐻 is "Bär" in German and "bear" in English. A new pack takes the
// German colours and doing words this way and only gives its own words.

/** `items` with the words given per emoji; items without a word are left out (e.g. a doing word a language has no short word for). */
export function relabel<T extends WordEntry>(items: T[], words: Record<string, string>): T[] {
  return items.filter((item) => item.emoji in words).map((item) => ({ ...item, word: words[item.emoji] }));
}
