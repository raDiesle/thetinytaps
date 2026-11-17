import { COMFORTS_RU as comforts, FEELINGS_RU as feelings } from "@/games/feelings/bear.ru";
import { SITUATIONS_RU as situations } from "@/games/feelings/kita.ru";
import { DAYS_RU as days } from "@/games/feelings/days.ru";
import type { LanguageTexts } from ".";

// Gefühle in Russian, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-ru.ts (see index.ts). A new Russian file of the game is listed here; texts.test.ts checks.

/** The Russian texts of Gefühle. */
export const TEXTS: LanguageTexts = { comforts, feelings, situations, days };
