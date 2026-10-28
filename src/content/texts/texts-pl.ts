import { pl as pack } from "@/content/pl";
import type { LanguageTexts } from ".";

// Everything in Polish that lives in files of its own, one chunk loaded only when the app plays in Polish
// (see index.ts). A new Polish file is listed here; texts.test.ts checks that none is missing.

/** The Polish texts. */
export const TEXTS: LanguageTexts = { pack };
