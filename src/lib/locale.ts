import { DEV } from "@/lib/buildInfo";
// Which language a language choice starts on, before a grown-up picks one: the
// browser's own language when the game has it, otherwise English, which more
// players understand than German. While developing (`bun run dev`) it is always
// German, the language the app is written and checked in. Search engines get the language
// of the page's address (German, or English under /en/, Russian under /ru/ …, src/content/seo.ts): Googlebot renders
// pages in an English browser, so it would see English menus under a German title and description.

/** The first of the `wanted` languages ("de-AT", "zh-Hans-CN", "en") that is `supported`, by its two-letter code. */
export function pickLanguage<T extends string>(supported: readonly T[], wanted: readonly string[]): T | undefined {
  for (const tag of wanted) {
    const code = tag.toLowerCase().split("-")[0];
    const found = supported.find((id) => id === code);
    if (found) return found;
  }
  return undefined;
}

/** The languages the browser asks for, best first; none outside a browser (unit tests). */
function browserLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages?.length) return navigator.languages;
  // Bun's navigator has no language at all.
  return navigator.language ? [navigator.language] : [];
}

/**
 * Search engines that run the page, and Google's own page tests, by their user agent. Named one by one:
 * a pattern like /bot/ would also catch phones (Cubot) and send their players German. Each by the name its crawler
 * alone carries: Sogou's as „Sogou web spider“ (its browser says „SogouMobileBrowser“), Naver's as „Yeti/“.
 * Besides Baidu, China's other search engines are here, since the pages come in Chinese (Sogou, 360, Bytespider),
 * Naver and Cốc Cốc, and the crawlers of Google, Bing and Yandex that render a page besides their main one
 * (GoogleOther, AdsBot, BingPreview, Yandex's mobile and rendering bots).
 */
export const CRAWLER =
  /googlebot|google-inspectiontool|storebot-google|googleother|adsbot-google|chrome-lighthouse|bingbot|bingpreview|yandexbot|yandexmobilebot|yandexrenderresourcesbot|duckduckbot|baiduspider|sogou \w+ spider|360spider|bytespider|yeti\/|coccocbot|applebot|petalbot|seznambot|slurp/i;

/** Where the app language a grown-up picked is saved (language.ts); a built page's head reads it too (tools/pageStart.ts). */
export const LANGUAGE_KEY = "tinytaps.applanguage.v1";

/** Whether the page is being read by a search engine or a preview service rather than played. */
export function isCrawler(userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent) {
  return CRAWLER.test(userAgent);
}

/**
 * The default of a language choice offering `supported`: for search engines and while developing the
 * language of the page's address (`page`, German unless /en/, /ru/ …), for players the browser's language,
 * else English, else the first one offered.
 */
export function playLanguage<T extends string>(supported: readonly T[], dev = DEV, crawler = isCrawler(), page = "de"): T {
  const wanted = dev || crawler ? [page] : [...browserLanguages(), "en"];
  return pickLanguage(supported, wanted) ?? supported[0];
}
