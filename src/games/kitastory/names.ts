import type { Localized } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: the story's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). German only until the user asks for translations.

/** The story's name, in the browser tab and over its table of contents. */
export const KITA_STORY_TITLE: Localized = { de: "Tapsi geht in die Kita" };

/** The name of its book on the shelf, among the Alltagshelfer beside „Schnullerfee“: what parents look for. */
export const KITA_STORY_BOOK: Localized = { de: "Kita-Start" };

/** Its line for grown-ups. */
export const KITA_STORY_BLURB: Localized = { de: "Eingewöhnung und Tschüss – in Kapiteln" };
