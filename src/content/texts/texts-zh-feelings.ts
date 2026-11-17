import { COMFORTS_ZH as comforts, FEELINGS_ZH as feelings } from "@/games/feelings/bear.zh";
import { SITUATIONS_ZH as situations } from "@/games/feelings/kita.zh";
import { DAYS_ZH as days } from "@/games/feelings/days.zh";
import type { LanguageTexts } from ".";

// Gefühle in Chinese, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-zh.ts (see index.ts). A new Chinese file of the game is listed here; texts.test.ts checks.

/** The Chinese texts of Gefühle. */
export const TEXTS: LanguageTexts = { comforts, feelings, situations, days };
