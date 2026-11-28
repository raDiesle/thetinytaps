import { CATEGORIES } from "@/content/games";
import adventure from "../../games/adventure/vorschau/*.webp?glob";
import feelings from "../../games/feelings/bilder/*.webp?glob";
import kita from "../../games/kitastory/bilder/*.webp?glob";
import milk from "../../games/milkchain/bilder/*.webp?glob";
import pacifier from "../../games/pacifierstory/bilder/*.webp?glob";
import pacifierTree from "../../games/pacifiertree/bilder/*.webp?glob";
import potty from "../../games/potty/bilder/*.webp?glob";
import together from "../../games/together/bilder/*.webp?glob";
import shots from "./bilder/*.webp?glob";
import pins from "./pinnwand/*.webp?glob";
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
  ["/schnullerfee/", "Schnuller abgewöhnen"],
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
  /** The name on its frame where the shelf's would mislead (as `GalleryGame.title`). */
  title?: Texts;
  /** What is in it, short, where the game's name on the shelf would not say it. */
  word?: EnglishFirst;
  /** Only this part of the picture, 3 : 2, in the pixels of the picture `of` px wide (a page's sofa, not the whole room). */
  crop?: { x: number; y: number; width: number; of: number };
  /** The picture in each language, where it has words in it (Gefühle's choices with their names). */
  byLanguage?: Partial<Record<SeoLanguage, string>>;
}

/**
 * The photos pinned to the cork board, in the order of their places (`PIN_SLOTS`): the first five fill the top row,
 * the next two stand left and right of the address, the last five fill the bottom row. Which photo hangs there is the
 * user's choice, made on 27 and changed on 28 November 2026 – swap one only when they ask: Zähne putzen's mouth from the
 * side, the Timer's red disc a quarter round, Abstillen's first page cut to the child and Mama on the sofa, the pacifier
 * tree, Bewegungsabenteuer's treasure island (its card's picture), and the animal and campfire rounds the Zuordnen
 * book's lines show (`bun run previews --pinnwand` makes those not taken from a game or a menu, same seed as the menu's).
 * None has words in it but Gefühle's, which has a photo per language; the word on a frame is the video's own.
 */
export const PINBOARD: readonly PinnedPhoto[] = [
  { href: "/zaehne/", picture: pins["zaehne-seite.webp"] },
  { href: "/toepfchen/", picture: potty["fox-sitzen.webp"] },
  { href: "/timer/", picture: pins["timer-scheibe.webp"] },
  { href: "/abstillen/", picture: milk["kette-baby.webp"], crop: { x: 560, y: 120, width: 640, of: 1200 } },
  { href: "/schnullerfee/", picture: pacifierTree["baum-baum.webp"] },
  { href: "/abenteuer/", picture: adventure["schatzinsel.webp"] },
  { href: "/bilder/", picture: shots["bilder.webp"] },
  {
    href: "/tiere/",
    picture: pins["tiere.webp"],
    word: {
      en: "Match the animals",
      de: "Tiere zuordnen",
      zh: "动物配对",
      hi: "जानवरों का मिलान",
      es: "Emparejar animales",
      ar: "مطابقة الحيوانات",
      ru: "Подбери к животному",
    },
  },
  {
    href: "/gefuehle/",
    picture: pins["gefuehle-de.webp"],
    byLanguage: Object.fromEntries(APP_LANGUAGES.map((language) => [language, pins[`gefuehle-${language}.webp`]])),
    // The book's name: its first game's, „Alltagssituationen“, would sound like the everyday helpers beside it.
    title: categoryTitle("gefuehle"),
  },
  { href: "/kettenreaktion/", picture: shots["kettenreaktion.webp"] },
  { href: "/zusammen/", picture: pins["zusammen.webp"] },
  { href: "/kleine-abenteuer/", picture: shots["kleine-abenteuer.webp"] },
];

/** The word on a photo's frame: its own, else the game's name on the shelf. */
export const photoWord = (photo: PinnedPhoto): Texts => photo.word ?? gameTitle(photo);

/** The address in the middle of the board, as people read it off a television: with www, never https or a slash. */
export const BOARD_ADDRESS = "www.littlestepstogrow.com";
