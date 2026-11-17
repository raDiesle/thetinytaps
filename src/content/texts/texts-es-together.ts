import { SPANISH as togetherHandmade } from "@/games/together/content.es";
import { SPANISH_SCENES as togetherScenes } from "@/games/together/content.scenes.es";
import type { LanguageTexts } from ".";

// Was gehört zusammen? in Spanish, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-es.ts (see index.ts). A new Spanish file of the game is listed here; texts.test.ts checks.

/** The Spanish texts of Was gehört zusammen?. */
export const TEXTS: LanguageTexts = { together: { ...togetherHandmade, ...togetherScenes } };
