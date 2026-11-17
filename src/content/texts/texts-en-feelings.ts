import { COMFORTS_EN as comforts, FEELINGS_EN as feelings } from "@/games/feelings/bear.en";
import { SITUATIONS_EN as situations } from "@/games/feelings/kita.en";
import { DAYS_EN as days } from "@/games/feelings/days.en";
import type { LanguageTexts } from ".";

// Gefühle in English, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-en.ts (see index.ts). A new English file of the game is listed here; texts.test.ts checks.

/** The English texts of Gefühle. */
export const TEXTS: LanguageTexts = { comforts, feelings, situations, days };
