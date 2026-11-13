import type { EnglishFirst } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). English first (root CLAUDE.md, user decision,
// 11 November 2026): the other languages, German too, come when the user asks for them.

/** The story's name, in the browser tab and over its table of contents. */
export const HAIR_STORY_TITLE: EnglishFirst = { en: "Tapsi and the Foam Crown" };

/** The name of its book on the shelf, among the Alltagshelfer beside „Kita-Start“: what parents look for. */
export const HAIR_STORY_BOOK: EnglishFirst = { en: "Hair Washing" };

/** Its line for grown-ups. */
export const HAIR_STORY_BLURB: EnglishFirst = { en: "Washing hair calmly – in chapters" };
