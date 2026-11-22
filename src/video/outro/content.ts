import { CATEGORIES } from "@/content/games";
import feelings from "../../games/feelings/bilder/*.webp?glob";
import kita from "../../games/kitastory/bilder/*.webp?glob";
import milk from "../../games/milkchain/bilder/*.webp?glob";
import pacifier from "../../games/pacifierstory/bilder/*.webp?glob";
import potty from "../../games/potty/bilder/*.webp?glob";
import together from "../../games/together/bilder/*.webp?glob";
import shots from "./bilder/*.webp?glob";
import { languagePrefix, type SeoLanguage } from "@/content/seo";
import { APP_LANGUAGES, type EnglishFirst, type Texts } from "@/lib/language";

/** The site the outro sends to: its main address (`siteUrl` in tools/build.ts). */
export const SITE = "https://www.funforboth.com";

/**
 * The pages a video's YouTube description links to: the home page or the game the video shows, each with its German
 * name. A new video of a game adds its address here.
 */
export const VIDEO_PAGES = [
  ["/", "Startseite"],
  ["/zaehne/", "Zähne putzen"],
  ["/toepfchen/", "Aufs Töpfchen"],
  ["/timer/", "Timer"],
  ["/schnullerfee/", "Schnullerfee"],
  ["/abstillen/", "Abstillen"],
  ["/kita/", "Kita-Start"],
] as const;

/** One of the pages a video links to. */
export type VideoPage = (typeof VIDEO_PAGES)[number][0];

/** The page `path` in `language` on the site: German at the root, every other language under its prefix (/en/zaehne/). */
export const addressFor = (path: VideoPage, language: SeoLanguage) => `${SITE}${languagePrefix(language)}${path}`;

/**
 * Where the code on the card leads: always the home page in the video's language (user decision, November 2026), so
 * one outro per language serves every video, rendered once and put after each.
 */
export const codeAddress = (language: SeoLanguage) => addressFor("/", language);

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

// ----- The outro „Bilder aus den Spielen“ (`GalleryScene`) -----

/** A game the outro shows big: its address, the picture, and its name where the shelf's would mislead. */
export interface GalleryGame {
  href: string;
  picture: string | undefined;
  title?: Texts;
}

/** A category's name on the shelf. */
const categoryTitle = (id: string): Texts => {
  const category = CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error(`No category ${id}`);
  return category.title;
};

/**
 * The games the outro „Bilder aus den Spielen“ shows one after another, big in the middle (user request, November
 * 2026): first the everyday helpers, then the learning games, as the shelf has them. Each picture is one the game
 * itself shows: a story's painted picture, or a game drawn in code pictured big by `bun run previews --video` into
 * `bilder/` (`VIDEO_GAMES` in tools/previews.ts) – never a menu's small picture, which was blurred that big. None has
 * words in it, so one picture serves the video in every language.
 */
export const GALLERY: { helpers: readonly GalleryGame[]; games: readonly GalleryGame[] } = {
  helpers: [
    { href: "/zaehne/", picture: shots["zaehne.webp"] },
    { href: "/toepfchen/", picture: potty["fox-sitzen.webp"] },
    { href: "/timer/", picture: shots["timer.webp"] },
    { href: "/abstillen/", picture: milk["kette-abschied-fest.webp"] },
    { href: "/schnullerfee/", picture: pacifier["fee-fort.webp"] },
    { href: "/kita/", picture: kita["kita-anschauen.webp"] },
  ],
  games: [
    { href: "/bilder/", picture: shots["bilder.webp"] },
    { href: "/tiere/", picture: shots["tiere.webp"] },
    // The book's name: its first game's, „Alltagssituationen“, would sound like the everyday helpers just shown.
    { href: "/gefuehle/", picture: feelings["baer-happy-b.webp"], title: categoryTitle("gefuehle") },
    { href: "/kettenreaktion/", picture: shots["kettenreaktion.webp"] },
    { href: "/zusammen/", picture: together["schneemann-karotte-2.webp"] },
    { href: "/kleine-abenteuer/", picture: shots["kleine-abenteuer.webp"] },
  ],
};

/** The game's name under its picture: the shelf's, in every language there is. */
export function gameTitle({ href, title }: GalleryGame): Texts {
  if (title) return title;
  const game = CATEGORIES.flatMap((category) => category.games).find((g) => g.href === href);
  if (!game) throw new Error(`No game at ${href}`);
  return game.title;
}

/** The everyday helpers' name: their category's, as on the shelf's sign. */
export const HELPERS_TITLE: Texts = categoryTitle("alltag");
