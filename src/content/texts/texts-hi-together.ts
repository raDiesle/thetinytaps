import { HINDI as togetherHandmade } from "@/games/together/content.hi";
import { HINDI_SCENES as togetherScenes } from "@/games/together/content.scenes.hi";
import type { LanguageTexts } from ".";

// Was gehört zusammen? in Hindi, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-hi.ts (see index.ts). A new Hindi file of the game is listed here; texts.test.ts checks.

/** The Hindi texts of Was gehört zusammen?. */
export const TEXTS: LanguageTexts = { together: { ...togetherHandmade, ...togetherScenes } };
