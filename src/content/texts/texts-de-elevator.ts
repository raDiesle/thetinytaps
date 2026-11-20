import { DE as elevator } from "@/games/elevator/de";
import type { LanguageTexts } from ".";

// Kleine Abenteuer in German: only what is written English first (the newer films), a chunk of its own loaded with the
// game's page (`withTexts` in App.tsx), never with the German texts before the first screen (see index.ts).

/** The German texts of Kleine Abenteuer's English-first parts. */
export const TEXTS: LanguageTexts = { elevator };
