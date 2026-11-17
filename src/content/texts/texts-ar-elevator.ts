import { AR as elevator } from "@/games/elevator/ar";
import type { LanguageTexts } from ".";

// Kleine Abenteuer in Arabic, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-ar.ts (see index.ts). A new Arabic file of the game is listed here; texts.test.ts checks.

/** The Arabic texts of Kleine Abenteuer. */
export const TEXTS: LanguageTexts = { elevator };
