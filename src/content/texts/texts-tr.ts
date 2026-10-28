import { tr as pack } from "@/content/tr";
import type { LanguageTexts } from ".";

// Everything in Turkish that lives in files of its own, one chunk loaded only when the app plays in Turkish
// (see index.ts). A new Turkish file is listed here; texts.test.ts checks that none is missing.

/** The Turkish texts. */
export const TEXTS: LanguageTexts = { pack };
