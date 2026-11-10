import type { Localized } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). German only until the user asks for translations.

/** The story's name, in the browser tab and over its table of contents. */
export const PACIFIER_STORY_TITLE: Localized = { de: "Tapsi und die Schnullerfee" };

/** The name of its book on the shelf, among the Alltagshelfer beside „Abstillen“: what parents look for. */
export const PACIFIER_STORY_BOOK: Localized = { de: "Schnullerfee" };

/** Its line for grown-ups. */
export const PACIFIER_STORY_BLURB: Localized = { de: "Tschüss, Schnuller – in Kapiteln" };
