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

/**
 * What the card says the site is, each as a small sign with its picture (idea Y-04). All of it is true of every page.
 * Written English first and translated into every app language (22 November 2026): the card speaks the video's language.
 */
export const SIGNS: readonly { icon: string; text: EnglishFirst }[] = [
  { icon: "🎁", text: { en: "Free", de: "Kostenlos", zh: "免费", hi: "मुफ़्त", es: "Gratis", ar: "مجاني", ru: "Бесплатно" } },
  { icon: "🚫", text: { en: "No ads", de: "Ohne Werbung", zh: "无广告", hi: "कोई विज्ञापन नहीं", es: "Sin anuncios", ar: "بلا إعلانات", ru: "Без рекламы" } },
  {
    icon: "✈️",
    text: {
      en: "Plays offline",
      de: "Spielt offline",
      zh: "离线也能玩",
      hi: "बिना इंटरनेट भी",
      es: "Funciona sin conexión",
      ar: "يعمل دون إنترنت",
      ru: "Работает без интернета",
    },
  },
  {
    icon: "🌐",
    text: {
      en: `${APP_LANGUAGES.length} languages`,
      de: `${APP_LANGUAGES.length} Sprachen`,
      zh: `${APP_LANGUAGES.length}种语言`,
      hi: `${APP_LANGUAGES.length} भाषाएँ`,
      es: `${APP_LANGUAGES.length} idiomas`,
      ar: `${APP_LANGUAGES.length} لغات`,
      ru: `${APP_LANGUAGES.length} языков`,
    },
  },
  {
    icon: "⏳",
    text: {
      en: "Play-time limit",
      de: "Spielzeit begrenzbar",
      zh: "可限制游戏时间",
      hi: "खेल-समय की सीमा",
      es: "Límite de tiempo de juego",
      ar: "تحديد وقت اللعب",
      ru: "Лимит времени игры",
    },
  },
];

/** The line over the code; grown-ups watch it, so it addresses them formally. */
export const SCAN: EnglishFirst = {
  en: "Scan to play",
  de: "Scannen und spielen",
  zh: "扫码开始玩",
  hi: "स्कैन करके खेलिए",
  es: "Escanee para jugar",
  ar: "امسحوا الرمز للعب",
  ru: "Сканируйте и играйте",
};

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
