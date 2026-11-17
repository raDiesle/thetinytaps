import { HI as elevator } from "@/games/elevator/hi";
import type { LanguageTexts } from ".";

// Kleine Abenteuer in Hindi, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-hi.ts (see index.ts). A new Hindi file of the game is listed here; texts.test.ts checks.

/** The Hindi texts of Kleine Abenteuer. */
export const TEXTS: LanguageTexts = { elevator };
