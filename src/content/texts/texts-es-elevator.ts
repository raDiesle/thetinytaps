import { ES as elevator } from "@/games/elevator/es";
import type { LanguageTexts } from ".";

// Kleine Abenteuer in Spanish, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-es.ts (see index.ts). A new Spanish file of the game is listed here; texts.test.ts checks.

/** The Spanish texts of Kleine Abenteuer. */
export const TEXTS: LanguageTexts = { elevator };
