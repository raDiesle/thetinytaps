import { COMFORTS_HI as comforts, FEELINGS_HI as feelings } from "@/games/feelings/bear.hi";
import { SITUATIONS_HI as situations } from "@/games/feelings/kita.hi";
import { DAYS_HI as days } from "@/games/feelings/days.hi";
import type { LanguageTexts } from ".";

// Gefühle in Hindi, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-hi.ts (see index.ts). A new Hindi file of the game is listed here; texts.test.ts checks.

/** The Hindi texts of Gefühle. */
export const TEXTS: LanguageTexts = { comforts, feelings, situations, days };
