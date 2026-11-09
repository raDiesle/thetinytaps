import type { Localized } from "@/lib/language";

// The story's name and its line for grown-ups, kept here rather than in `games.ts`: German only so far, so the story's
// own row in the language table answers for them, not the home page's (`inlineTexts.test.ts`).

/** The story's name, in the browser tab and on the management page. */
export const MILK_CHAIN_TITLE: Localized = { de: "Tapsis Milchkette" };

/** Its line for grown-ups. */
export const MILK_CHAIN_BLURB: Localized = { de: "Abstillen in Kapiteln" };
