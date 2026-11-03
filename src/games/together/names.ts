import type { Localized } from "@/lib/language";

// The game's name and its line for grown-ups, kept here rather than in `games.ts` while the game is German only: so its
// own row in the language table says they are missing, not the home page's (`inlineTexts.test.ts`).

/** The game's name, in its book and in the browser tab. */
export const TOGETHER_TITLE: Localized = { de: "Was gehört zusammen?" };

/** Its line in the book's table of contents. */
export const TOGETHER_BLURB: Localized = { de: "Alltagsdinge, Helfer und ihr Werkzeug" };
