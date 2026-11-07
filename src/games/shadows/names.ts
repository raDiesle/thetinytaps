import type { Localized } from "@/lib/language";

// The game's name and its line for grown-ups, kept here rather than in `games.ts`: so the game's own row in the language
// table answers for them, not the home page's (`inlineTexts.test.ts`). German only since the game became „Erkennen“
// (November 2026), when „Wer schaut da raus?“ moved in; the translations come only when the user asks.

/** The game's name, in its book and in the browser tab. */
export const SHADOWS_TITLE: Localized = { de: "Erkennen" };

/** Its line in the book's table of contents. */
export const SHADOWS_BLURB: Localized = { de: "Schatten finden und Tiere erkennen" };
