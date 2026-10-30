import { DEV } from "@/lib/buildInfo";
// Which language a language choice starts on, before a grown-up picks one: the
// browser's own language when the game has it, otherwise English, which more
// players understand than German. While developing (`bun run dev`) it is always
// German, the language the app is written and checked in. Search engines get German
// too: the built pages are German (src/content/seo.ts), and Googlebot renders them in
// an English browser, so it would see English menus under a German title and description.

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
 * a pattern like /bot/ would also catch phones (Cubot) and send their players German.
 */
const CRAWLER =
  /googlebot|google-inspectiontool|storebot-google|chrome-lighthouse|bingbot|yandexbot|duckduckbot|baiduspider|applebot|petalbot|seznambot|slurp/i;

/** Whether the page is being read by a search engine or a preview service rather than played. */
export function isCrawler(userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent) {
  return CRAWLER.test(userAgent);
}

/**
 * The default of a language choice offering `supported`: German while developing and
 * for search engines, for players the browser's language, else English, else the first one offered.
 */
export function playLanguage<T extends string>(supported: readonly T[], dev = DEV, crawler = isCrawler()): T {
  const wanted = dev || crawler ? ["de"] : [...browserLanguages(), "en"];
  return pickLanguage(supported, wanted) ?? supported[0];
}
