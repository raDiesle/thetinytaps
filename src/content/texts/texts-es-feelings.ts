import { COMFORTS_ES as comforts, FEELINGS_ES as feelings } from "@/games/feelings/bear.es";
import { SITUATIONS_ES as situations } from "@/games/feelings/kita.es";
import { DAYS_ES as days } from "@/games/feelings/days.es";
import type { LanguageTexts } from ".";

// Gefühle in Spanish, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-es.ts (see index.ts). A new Spanish file of the game is listed here; texts.test.ts checks.

/** The Spanish texts of Gefühle. */
export const TEXTS: LanguageTexts = { comforts, feelings, situations, days };
