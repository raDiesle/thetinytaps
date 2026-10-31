import { type PageText, SITE_PROMISE, seoFor } from "@/content/seo";
import { byLanguage } from "@/content/texts";
import type { TargetLanguageId } from "@/content/targetLanguages";

/** The texts for search engines of each language besides German, filled as a language's texts load. */
const TRANSLATIONS = byLanguage((texts) => texts.seo);

/** What a page says to search engines and grown-ups in one language. */
export interface PageWords extends PageText {
  /** What every page says about the whole site. */
  promise: string;
  /** The language the words are in. */
  language: TargetLanguageId;
}

/** The search engine texts of `path` (a router address) in `language`, when that language has them. */
export function seoWords(path: string, language: TargetLanguageId): PageWords | undefined {
  const german = seoFor(path);
  if (!german) return undefined;
  if (language === "de") return { ...german, promise: SITE_PROMISE, language };
  const translation = TRANSLATIONS[language];
  const page = translation?.pages[german.path];
  return page && translation ? { ...page, promise: translation.promise, language } : undefined;
}
