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
export const SITE = "https://www.littlestepstogrow.com";

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

/** The address as people say and type it: no https, no www, no slash at the end („littlestepstogrow.com/en/zaehne“). */
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

// ----- The outro „Pinnwand“ (`PinboardScene`) -----

/** A photo pinned to the board: a game's picture and the word written on its white frame. */
export interface PinnedPhoto {
  href: string;
  picture: string | undefined;
  /** What is in it, short: one or two words, where the game's name on the shelf is a whole question. */
  word?: EnglishFirst;
}

/**
 * The photos pinned to the cork board, in the order they are pinned (user request, 27 November 2026: the pictures one
 * after another went by too fast to take in, so all of them hang together on one board). The first five fill the top
 * row, the next two stand left and right of the address, the last five fill the bottom row (`PIN_SLOTS`). The same
 * pictures as `GALLERY`'s, so none has words in it; the word on its frame is the video's own, in its language. The
 * user chose these twelve (27 November 2026): swap one only when they ask.
 */
export const PINBOARD: readonly PinnedPhoto[] = [
  GALLERY.helpers[0]!,
  GALLERY.helpers[1]!,
  GALLERY.helpers[2]!,
  GALLERY.helpers[3]!,
  GALLERY.helpers[4]!,
  GALLERY.helpers[5]!,
  GALLERY.games[0]!,
  {
    ...GALLERY.games[1]!,
    word: { en: "Animals", de: "Tiere", zh: "动物", hi: "जानवर", es: "Animales", ar: "الحيوانات", ru: "Животные" },
  },
  GALLERY.games[2]!,
  GALLERY.games[3]!,
  {
    ...GALLERY.games[4]!,
    word: { en: "Pairs", de: "Paare", zh: "配对", hi: "जोड़ियाँ", es: "Parejas", ar: "أزواج", ru: "Пары" },
  },
  GALLERY.games[5]!,
];

/** The word on a photo's frame: its own, else the game's name on the shelf. */
export const photoWord = (photo: PinnedPhoto): Texts => photo.word ?? gameTitle(photo);

/** The address in the middle of the board, as people read it off a television: with www, never https or a slash. */
export const BOARD_ADDRESS = "www.littlestepstogrow.com";

/** The short line under the address: what the site holds, in the categories' words. */
export const BOARD_LINE: EnglishFirst = {
  en: "Everyday helpers & learning games",
  de: "Alltagshelfer & Lernspiele",
  zh: "日常小帮手和益智游戏",
  hi: "रोज़ के मददगार और सीखने के खेल",
  es: "Ayudantes del día a día y juegos para aprender",
  ar: "مساعدون لكل يوم وألعاب تعليمية",
  ru: "Помощники на каждый день и развивающие игры",
};
