// Which language a language choice starts on, before a grown-up picks one: the
// browser's own language when the game has it, otherwise English, which more
// players understand than German. While developing (`yarn dev`) it is always
// German, the language the app is written and checked in.

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
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

/**
 * The default of a language choice offering `supported`: German while developing,
 * for players the browser's language, else English, else the first one offered.
 */
export function playLanguage<T extends string>(supported: readonly T[], dev = import.meta.env?.DEV ?? false): T {
  const wanted = dev ? ["de"] : [...browserLanguages(), "en"];
  return pickLanguage(supported, wanted) ?? supported[0];
}
