import { EN as elevator } from "@/games/elevator/en";
import type { LanguageTexts } from ".";

// Kleine Abenteuer in English, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-en.ts (see index.ts). A new English file of the game is listed here; texts.test.ts checks.

/** The English texts of Kleine Abenteuer. */
export const TEXTS: LanguageTexts = { elevator };
