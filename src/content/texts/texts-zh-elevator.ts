import { ZH as elevator } from "@/games/elevator/zh";
import type { LanguageTexts } from ".";

// Kleine Abenteuer in Chinese, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-zh.ts (see index.ts). A new Chinese file of the game is listed here; texts.test.ts checks.

/** The Chinese texts of Kleine Abenteuer. */
export const TEXTS: LanguageTexts = { elevator };
