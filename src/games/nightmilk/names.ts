import type { EnglishFirst } from "@/lib/language";

// The story's name, its volume's name on the shelf and its line for grown-ups, kept here rather than in `games.ts`: the
// story's own row in the language table answers for them, not the home page's (`inlineTexts.test.ts`). English first
// (root CLAUDE.md, user decision, 11 November 2026); other languages, German too, come when the user asks.

/** The story's name, in the browser tab and over its table of contents. */
export const NIGHT_MILK_TITLE: EnglishFirst = { en: "The Milk Sleeps at Night" };

/** The name of its volume on the shelf, tied to the book „Abstillen“: what parents look for. */
export const NIGHT_MILK_BOOK: EnglishFirst = { en: "Night Weaning" };

/** Its line for grown-ups. */
export const NIGHT_MILK_BLURB: EnglishFirst = { en: "Milk by day, sleep at night – in chapters" };
