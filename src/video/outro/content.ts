import { languagePrefix, type SeoLanguage } from "@/content/seo";
import { APP_LANGUAGES, type EnglishFirst } from "@/lib/language";

/** The site the outro sends to: its main address (`siteUrl` in tools/build.ts). */
export const SITE = "https://www.funforboth.com";

/**
 * Where the code on the card can lead: the home page or the game the video shows (idea Y-05), each with its name on
 * the recording page (German, like the rest of /management/). A new video of a game adds its address here.
 */
export const CODE_TARGETS = [
  ["/", "Startseite"],
  ["/zaehne/", "Zähne putzen"],
  ["/toepfchen/", "Aufs Töpfchen"],
  ["/timer/", "Timer"],
  ["/schnullerfee/", "Schnullerfee"],
  ["/abstillen/", "Abstillen"],
  ["/kita/", "Kita-Start"],
] as const;

/** One of the addresses the code can lead to. */
export type CodeTarget = (typeof CODE_TARGETS)[number][0];

/** The page `path` in `language` on the site: German at the root, every other language under its prefix (/en/zaehne/). */
export const addressFor = (path: CodeTarget, language: SeoLanguage) => `${SITE}${languagePrefix(language)}${path}`;

/** The address as people say and type it: no https, no www, no slash at the end („funforboth.com/en/zaehne“). */
export const shortAddress = (url: string) => url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");

/** What the card says the site is, each as a small sign with its picture (idea Y-04). All of it is true of every page. */
export const SIGNS: readonly { icon: string; text: EnglishFirst }[] = [
  { icon: "🎁", text: { en: "Free" } },
  { icon: "🚫", text: { en: "No ads" } },
  { icon: "✈️", text: { en: "Plays offline" } },
  { icon: "🌐", text: { en: `${APP_LANGUAGES.length} languages` } },
  { icon: "⏳", text: { en: "Play-time limit" } },
];

/** The line over the code. */
export const SCAN: EnglishFirst = { en: "Scan to play" };
