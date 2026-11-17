import { ENGLISH as togetherHandmade } from "@/games/together/content.en";
import { ENGLISH_SCENES as togetherScenes } from "@/games/together/content.scenes.en";
import type { LanguageTexts } from ".";

// Was gehört zusammen? in English, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-en.ts (see index.ts). A new English file of the game is listed here; texts.test.ts checks.

/** The English texts of Was gehört zusammen?. */
export const TEXTS: LanguageTexts = { together: { ...togetherHandmade, ...togetherScenes } };
