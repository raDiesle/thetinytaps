import { COMFORTS_AR as comforts, FEELINGS_AR as feelings } from "@/games/feelings/bear.ar";
import { SITUATIONS_AR as situations } from "@/games/feelings/kita.ar";
import { DAYS_AR as days } from "@/games/feelings/days.ar";
import type { LanguageTexts } from ".";

// Gefühle in Arabic, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-ar.ts (see index.ts). A new Arabic file of the game is listed here; texts.test.ts checks.

/** The Arabic texts of Gefühle. */
export const TEXTS: LanguageTexts = { comforts, feelings, situations, days };
