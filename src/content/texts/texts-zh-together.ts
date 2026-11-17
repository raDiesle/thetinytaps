import { CHINESE as togetherHandmade } from "@/games/together/content.zh";
import { CHINESE_SCENES as togetherScenes } from "@/games/together/content.scenes.zh";
import type { LanguageTexts } from ".";

// Was gehört zusammen? in Chinese, a chunk of its own loaded with the game's page (`withTexts` in App.tsx), not before the
// first screen with texts-zh.ts (see index.ts). A new Chinese file of the game is listed here; texts.test.ts checks.

/** The Chinese texts of Was gehört zusammen?. */
export const TEXTS: LanguageTexts = { together: { ...togetherHandmade, ...togetherScenes } };
