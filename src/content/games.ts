import type { Localized } from "@/lib/language";

export interface Game {
  href: string;
  /** More addresses of the same page, each with its own search entry: `/tagesplan/` opens the Belohnungstafel's page on a plan. */
  also?: string[];
  emoji: string;
  /** The game's name in every language of the app (see lib/language.ts). */
  title: Localized;
  /** One short line for grown-ups under the name, what the game is; shown only on tablets and computers. */
  blurb: Localized;
}

export interface Category {
  id: string;
  emoji: string;
  title: Localized;
  /** One short line for grown-ups under the name on its home card, like `Game.blurb` (none for one without a card). */
  blurb?: Localized;
  /** Its games stand on the home page itself, together on a frame with the category's name above, instead of behind a card of their own. */
  onHome?: boolean;
  games: Game[];
}

/** The home menu: first a category, then its games (on `/spiele/<id>/`). */
export const CATEGORIES: Category[] = [
  {
    id: "lebendige-welten",
    emoji: "🖼️",
    title: { de: "Lebendige Welten", ru: "Живые миры", en: "Living Worlds", zh: "生动的世界", hi: "जीवंत दुनिया", es: "Mundos vivos", ar: "عوالم حيّة" },
    blurb: { de: "Bilder und Geschichten, die antworten" },
    games: [
      {
        href: "/bilder/",
        emoji: "🖼️",
        title: { de: "Lebendige Bilder", ru: "Живые картинки", en: "Living Pictures", zh: "会动的图画", hi: "जीवंत तस्वीरें", es: "Imágenes vivas", ar: "صور حيّة" },
        blurb: { de: "Wimmelbilder zum Antippen" },
      },
      {
        href: "/abenteuer/",
        emoji: "🏝️",
        title: {
          de: "Bewegungsabenteuer",
          ru: "Приключения в движении",
          en: "Move-Along Adventures",
          zh: "动起来大冒险",
          hi: "हिलो-डुलो रोमांच",
          es: "Aventuras en movimiento",
          ar: "مغامرات الحركة",
        },
        blurb: { de: "Hüpfen, strecken, schleichen – mitmachen" },
      },
      {
        href: "/gefuehle/",
        emoji: "🐻",
        title: { de: "Gefühle", ru: "Чувства", en: "Feelings", zh: "情绪", hi: "भावनाएँ", es: "Emociones", ar: "المشاعر" },
        blurb: { de: "Der kleine Bär und seine Gefühle" },
      },
      {
        href: "/kettenreaktion/",
        emoji: "🎳",
        title: {
          de: "Kettenreaktion",
          ru: "Цепная реакция",
          en: "Chain Reaction",
          zh: "连锁反应",
          hi: "चेन रिएक्शन",
          es: "Reacción en cadena",
          ar: "تفاعل متسلسل",
        },
        blurb: { de: "Eine Kugel stößt Maschinen an" },
      },
      {
        href: "/kleine-abenteuer/",
        emoji: "🧭",
        title: {
          de: "Kleine Abenteuer",
          ru: "Маленькие приключения",
          en: "Little Adventures",
          zh: "小小冒险",
          hi: "छोटे-छोटे रोमांच",
          es: "Pequeñas aventuras",
          ar: "مغامرات صغيرة",
        },
        blurb: { de: "Aufzug fahren, Wege gehen, sammeln" },
      },
    ],
  },
  {
    id: "zuordnen",
    emoji: "🧩",
    title: { de: "Zuordnen", ru: "Найди пару", en: "Matching", zh: "配一配", hi: "जोड़ी मिलाओ", es: "Emparejar", ar: "المطابقة" },
    blurb: { de: "Was gehört zusammen?" },
    games: [
      {
        href: "/tiere/",
        emoji: "🐰",
        title: {
          de: "Was gehört zum Tier?",
          ru: "Что нужно зверюшке?",
          en: "What Does the Animal Need?",
          zh: "小动物要什么？",
          hi: "जानवर को क्या चाहिए?",
          es: "¿Qué necesita el animal?",
          ar: "ماذا يحتاج الحيوان؟",
        },
        blurb: { de: "Futter und Zuhause für die Tiere" },
      },
      {
        href: "/schatten/",
        emoji: "👤",
        title: { de: "Schatten finden", ru: "Найди тень", en: "Find the Shadow", zh: "找影子", hi: "परछाईं ढूँढो", es: "Busca la sombra", ar: "أين الظل؟" },
        blurb: { de: "Welcher Schatten passt zum Bild?" },
      },
      {
        href: "/socken/",
        emoji: "🧦",
        title: {
          de: "Socken-Paare",
          ru: "Пары носочков",
          en: "Sock Pairs",
          zh: "袜子配对",
          hi: "मोज़ों की जोड़ियाँ",
          es: "Pares de calcetines",
          ar: "أزواج الجوارب",
        },
        blurb: { de: "Gleiche Socken finden" },
      },
    ],
  },
  {
    id: "buchstaben-zahlen",
    emoji: "🔤",
    title: {
      de: "Buchstaben & Zahlen",
      ru: "Буквы и цифры",
      en: "Letters & Numbers",
      zh: "字母和数字",
      hi: "अक्षर और अंक",
      es: "Letras y números",
      ar: "الحروف والأرقام",
    },
    blurb: { de: "Tasten drücken, Buchstaben finden" },
    // One game, so the home card opens it directly (see categoryHref).
    games: [
      {
        href: "/buchstaben/",
        emoji: "🔤",
        title: {
          de: "Buchstaben & Zahlen",
          ru: "Буквы и цифры",
          en: "Letters & Numbers",
          zh: "字母和数字",
          hi: "अक्षर और अंक",
          es: "Letras y números",
          ar: "الحروف والأرقام",
        },
        blurb: { de: "Tasten drücken, Buchstaben finden" },
      },
    ],
  },
  {
    id: "weitere",
    emoji: "🎈",
    title: { de: "Weitere", ru: "Ещё", en: "More", zh: "更多", hi: "और भी", es: "Más", ar: "المزيد" },
    // Its games are few and stand apart from each other, so a tap on „Weitere“ first would only hide them.
    onHome: true,
    games: [
      {
        href: "/zaehne/",
        emoji: "🦷",
        title: { de: "Zähne putzen", ru: "Чистим зубы", en: "Brushing Teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان" },
        blurb: { de: "Zähneputzen mit Lied und Timer" },
      },
      {
        href: "/toepfchen/",
        emoji: "🚽",
        title: { de: "Aufs Töpfchen", ru: "На горшок", en: "Potty Time", zh: "坐便盆", hi: "पॉटी पर चलो", es: "Al orinal", ar: "إلى النونية" },
        blurb: { de: "Aufs Klo gehen, Schritt für Schritt" },
      },
      {
        href: "/belohnungstafel/",
        also: ["/tagesplan/"],
        emoji: "🌟",
        title: { de: "Sterne & Tagesplan" },
        blurb: { de: "Belohnungstafel und Tagesplan in Bildern" },
      },
      {
        href: "/laut-leise/",
        emoji: "🦁",
        title: { de: "Laut und leise", ru: "Громко и тихо", en: "Loud and Quiet", zh: "大声和小声", hi: "ज़ोर से और धीरे", es: "Fuerte y suave", ar: "عالٍ وخافت" },
        blurb: { de: "Laut und leise sprechen üben" },
      },
    ],
  },
];

/**
 * A category of one game has no page of its own: a menu with a single card would only be one tap more.
 * Neither has one whose games stand on the home page.
 */
export const hasPage = (category: Category) => !category.onHome && category.games.length > 1;

/** Where the category's home card leads: its page, or its only game; the home page for one whose games stand there. */
export const categoryHref = (category: Category) => (category.onHome ? "/" : hasPage(category) ? `/spiele/${category.id}/` : category.games[0].href);

/** Whether a page belongs to the game: its address or one below it. */
const isGamePage = (game: Game, path: string) => [game.href, ...(game.also ?? [])].some((href) => path.startsWith(href));

const withSlash = (pathname: string) => (pathname.endsWith("/") ? pathname : `${pathname}/`);

/** The category page a game page belongs to, for its back link; none for the only game of a category (back to home then). */
export function categoryOf(pathname: string) {
  const path = withSlash(pathname);
  return CATEGORIES.find((c) => hasPage(c) && c.games.some((g) => isGamePage(g, path)));
}

/**
 * The category whose world (backdrop and card colours, see Worlds.tsx) a page shows: its own page or one of its
 * games, also for a category without a page of its own. None for the home page.
 */
export function worldOf(pathname: string) {
  const path = withSlash(pathname);
  return CATEGORIES.find((c) => path.startsWith(`/spiele/${c.id}/`) || c.games.some((g) => isGamePage(g, path)));
}
