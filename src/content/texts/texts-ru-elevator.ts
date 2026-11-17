import { RU as elevator } from "@/games/elevator/ru";
import type { LanguageTexts } from ".";

// Kleine Abenteuer in Russian, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-ru.ts (see index.ts). A new Russian file of the game is listed here; texts.test.ts checks.

/** The Russian texts of Kleine Abenteuer. */
export const TEXTS: LanguageTexts = { elevator };
