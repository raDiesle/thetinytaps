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
  /** One short line for grown-ups under the name on its book, like `Game.blurb`. */
  blurb: Localized;
  games: Game[];
  /**
   * Its games stand apart, each a book of its own: on the shelf they stand side by side with their spines out, each
   * spine carrying its game's name, and open their game directly. The category has no page and no book of its own.
   */
  apart?: boolean;
}

/** The home menu: the books on the shelf, one per category, then its games – the book's pages (on `/spiele/<id>/`). */
export const CATEGORIES: Category[] = [
  {
    id: "lebendige-welten",
    emoji: "🖼️",
    title: { de: "Lebendige Welten", ru: "Живые миры", en: "Living Worlds", zh: "生动的世界", hi: "जीवंत दुनिया", es: "Mundos vivos", ar: "عوالم حيّة" },
    blurb: {
      de: "Bilder und Geschichten, die antworten",
      en: "Pictures and stories that answer back",
      zh: "会回应的图画和故事",
      hi: "जवाब देने वाली तस्वीरें और कहानियाँ",
      es: "Imágenes e historias que responden",
      ar: "صور وقصص تتجاوب",
      ru: "Картинки и истории, которые отвечают",
    },
    games: [
      {
        href: "/bilder/",
        emoji: "🖼️",
        title: { de: "Lebendige Bilder", ru: "Живые картинки", en: "Living Pictures", zh: "会动的图画", hi: "जीवंत तस्वीरें", es: "Imágenes vivas", ar: "صور حيّة" },
        blurb: {
          de: "Wimmelbilder zum Antippen",
          en: "Busy pictures to tap",
          zh: "可以点的热闹大图",
          hi: "छूने के लिए भरी-पूरी तस्वीरें",
          es: "Láminas llenas de cosas para tocar",
          ar: "صور مزدحمة للّمس",
          ru: "Большие картинки, где всё можно нажать",
        },
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
        blurb: {
          de: "Hüpfen, strecken, schleichen – mitmachen",
          en: "Hop, stretch, sneak – join in",
          zh: "跳一跳、伸一伸、悄悄走——一起动",
          hi: "कूदना, खिंचना, दबे पाँव चलना – साथ में",
          es: "Saltar, estirarse, agacharse: ¡a moverse!",
          ar: "قفز وتمدّد ومشي على أطراف الأصابع – معًا",
          ru: "Прыгать, тянуться, красться – вместе",
        },
      },
      {
        href: "/gefuehle/",
        emoji: "🐻",
        title: { de: "Gefühle", ru: "Чувства", en: "Feelings", zh: "情绪", hi: "भावनाएँ", es: "Emociones", ar: "المشاعر" },
        blurb: {
          de: "Der kleine Bär und seine Gefühle",
          en: "Little Bear and his feelings",
          zh: "小熊和它的心情",
          hi: "भालू और उसकी भावनाएँ",
          es: "El osito y sus emociones",
          ar: "الدبدوب ومشاعره",
          ru: "Мишка и его чувства",
        },
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
        blurb: {
          de: "Eine Kugel stößt Maschinen an",
          en: "A marble sets machines going",
          zh: "一颗小球启动机器",
          hi: "एक गेंद मशीनें चलाती है",
          es: "Una canica pone en marcha máquinas",
          ar: "كرة صغيرة تُشغّل الآلات",
          ru: "Шарик запускает машины",
        },
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
        blurb: {
          de: "Aufzug fahren, Wege gehen, sammeln",
          en: "Ride the lift, walk the trails, collect",
          zh: "坐电梯、走小路、收集东西",
          hi: "लिफ़्ट, रास्ते और चीज़ें जमा करना",
          es: "Ascensor, caminos y cosas que recoger",
          ar: "ركوب المصعد والمشي في الطرق والجمع",
          ru: "Лифт, прогулки, собирать вещи",
        },
      },
    ],
  },
  {
    id: "zuordnen",
    emoji: "🧩",
    title: { de: "Zuordnen", ru: "Найди пару", en: "Matching", zh: "配一配", hi: "जोड़ी मिलाओ", es: "Emparejar", ar: "المطابقة" },
    blurb: {
      de: "Was gehört zusammen?",
      en: "What goes together?",
      zh: "什么和什么是一对？",
      hi: "क्या किसके साथ जाता है?",
      es: "¿Qué va con qué?",
      ar: "ما الذي يتناسب معًا؟",
      ru: "Что к чему подходит?",
    },
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
        blurb: {
          de: "Futter und Zuhause für die Tiere",
          en: "Food and homes for the animals",
          zh: "给动物找食物和家",
          hi: "जानवरों के लिए खाना और घर",
          es: "Comida y casa para los animales",
          ar: "طعام وبيوت للحيوانات",
          ru: "Корм и домики для зверей",
        },
      },
      {
        href: "/schatten/",
        emoji: "👤",
        title: { de: "Schatten finden", ru: "Найди тень", en: "Find the Shadow", zh: "找影子", hi: "परछाईं ढूँढो", es: "Busca la sombra", ar: "أين الظل؟" },
        blurb: {
          de: "Welcher Schatten passt zum Bild?",
          en: "Which shadow fits the picture?",
          zh: "哪个影子和图片一样？",
          hi: "कौन-सी परछाईं तस्वीर से मिलती है?",
          es: "¿Qué sombra va con el dibujo?",
          ar: "أي ظل يناسب الصورة؟",
          ru: "Какая тень подходит к картинке?",
        },
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
        blurb: {
          de: "Gleiche Socken finden",
          en: "Find matching socks",
          zh: "找一样的袜子",
          hi: "एक जैसे मोज़े ढूँढना",
          es: "Encontrar calcetines iguales",
          ar: "إيجاد الجوارب المتشابهة",
          ru: "Найти одинаковые носки",
        },
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
    blurb: {
      de: "Tasten drücken, Buchstaben finden",
      en: "Press keys, find letters",
      zh: "按按键，找字母",
      hi: "बटन दबाना, अक्षर ढूँढना",
      es: "Pulsar teclas, encontrar letras",
      ar: "الضغط على الأزرار وإيجاد الحروف",
      ru: "Нажимать клавиши, находить буквы",
    },
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
        blurb: {
          de: "Tasten drücken, Buchstaben finden",
          en: "Press keys, find letters",
          zh: "按按键，找字母",
          hi: "बटन दबाना, अक्षर ढूँढना",
          es: "Pulsar teclas, encontrar letras",
          ar: "الضغط على الأزرار وإيجاد الحروف",
          ru: "Нажимать клавиши, находить буквы",
        },
      },
    ],
  },
  {
    id: "alltag",
    emoji: "🌞",
    title: { de: "Für jeden Tag" },
    blurb: { de: "Zähne putzen, Töpfchen, Tagesplan" },
    // Each a book of its own on the shelf, its name on its spine (user decision, October 2026).
    apart: true,
    games: [
      {
        href: "/zaehne/",
        emoji: "🦷",
        title: { de: "Zähne putzen", ru: "Чистим зубы", en: "Brushing Teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان" },
        blurb: {
          de: "Zähneputzen mit Lied und Timer",
          en: "Brushing teeth with a song and a timer",
          zh: "跟着歌和计时器刷牙",
          hi: "गाने और टाइमर के साथ दाँत साफ़ करना",
          es: "Cepillarse con canción y temporizador",
          ar: "تنظيف الأسنان مع أغنية ومؤقّت",
          ru: "Чистим зубы с песенкой и таймером",
        },
      },
      {
        href: "/toepfchen/",
        emoji: "🚽",
        title: { de: "Aufs Töpfchen", ru: "На горшок", en: "Potty Time", zh: "坐便盆", hi: "पॉटी पर चलो", es: "Al orinal", ar: "إلى النونية" },
        blurb: {
          de: "Aufs Klo gehen, Schritt für Schritt",
          en: "Going to the toilet, step by step",
          zh: "一步一步上厕所",
          hi: "शौचालय जाना, क़दम-दर-क़दम",
          es: "Ir al baño, paso a paso",
          ar: "الذهاب إلى الحمّام خطوة بخطوة",
          ru: "Ходим в туалет шаг за шагом",
        },
      },
      {
        href: "/belohnungstafel/",
        also: ["/tagesplan/"],
        emoji: "🌟",
        title: {
          de: "Belohnungstafel & Tagesplan",
          en: "Reward Chart & Day Plan",
          zh: "奖励表和日程表",
          hi: "इनाम चार्ट और दिन की योजना",
          es: "Tabla de premios y plan del día",
          ar: "لوحة المكافآت وخطة اليوم",
          ru: "Таблица наград и план дня",
        },
        blurb: {
          de: "Belohnungstafel und Tagesplan in Bildern",
          en: "Reward chart and day plan in pictures",
          zh: "用图画做的奖励表和日程表",
          hi: "तस्वीरों में इनाम चार्ट और दिन की योजना",
          es: "Premios y plan del día en imágenes",
          ar: "لوحة المكافآت وخطة اليوم بالصور",
          ru: "Таблица наград и план дня в картинках",
        },
      },
      {
        href: "/laut-leise/",
        emoji: "🦁",
        title: { de: "Laut und leise", ru: "Громко и тихо", en: "Loud and Quiet", zh: "大声和小声", hi: "ज़ोर से और धीरे", es: "Fuerte y suave", ar: "عالٍ وخافت" },
        blurb: {
          de: "Laut und leise sprechen üben",
          en: "Practise speaking loud and quiet",
          zh: "练习大声和小声说话",
          hi: "ज़ोर से और धीरे बोलने का अभ्यास",
          es: "Practicar hablar fuerte y suave",
          ar: "التدرّب على الكلام بصوت عالٍ وخافت",
          ru: "Учимся говорить громко и тихо",
        },
      },
    ],
  },
];

/**
 * A book of one game has no page of its own: it opens straight on its game, a menu with a single card would only be one
 * tap more. Nor has a category whose games stand apart, each a book of its own.
 */
export const hasPage = (category: Category) => !category.apart && category.games.length > 1;

/** Where the category's book on the shelf leads: its page, or its only game; the shelf for one whose games stand apart. */
export const categoryHref = (category: Category) => (category.apart ? "/" : hasPage(category) ? `/spiele/${category.id}/` : category.games[0].href);

/** A book on the shelf: a category's, or a game's that stands apart (`Category.apart`), standing with its spine out. */
export interface ShelfEntry {
  /** Its `data-book` on the shelf, by which the way back finds its gap. */
  id: string;
  href: string;
  category: Category;
  /** The game, for a game's own book. */
  game?: Game;
}

/** The game's own book's id: its address without slashes. */
const gameBookId = (game: Game) => game.href.replaceAll("/", "");

/** The books on the shelf, in order: one per category, or, for a category whose games stand apart, one per game. */
export const SHELF: ShelfEntry[] = CATEGORIES.flatMap((category) =>
  category.apart
    ? category.games.map((game) => ({ id: gameBookId(game), href: game.href, category, game }))
    : [{ id: category.id, href: categoryHref(category), category }],
);

/** Whether a page belongs to the game: its address or one below it. */
const isGamePage = (game: Game, path: string) => [game.href, ...(game.also ?? [])].some((href) => path.startsWith(href));

const withSlash = (pathname: string) => (pathname.endsWith("/") ? pathname : `${pathname}/`);

/** The category page a game page belongs to, for its back link; none for the only game of a category (back to home then). */
export function categoryOf(pathname: string) {
  const path = withSlash(pathname);
  return CATEGORIES.find((c) => hasPage(c) && c.games.some((g) => isGamePage(g, path)));
}

/** The page a category's `index`-th game starts on, as its book's table of contents lists it: the first game on page 1. */
export const gamePage = (index: number) => index + 1;

/**
 * Where a menu is in its book, in the book look: its category's table of contents on page 0 (unnumbered), each game's
 * start screen on its `gamePage`. None for any other page (the shelf, a game while playing, a scene inside a game).
 */
export function bookPage(pathname: string): { book: string; page: number } | undefined {
  const path = withSlash(pathname);
  for (const c of CATEGORIES.filter(hasPage)) {
    if (path === categoryHref(c)) return { book: c.id, page: 0 };
    const index = c.games.findIndex((g) => g.href === path);
    if (index >= 0) return { book: c.id, page: gamePage(index) };
  }
}

/** How many pages turn going from one menu to another: between two pages of one book as many as lie between them, else one. */
export function pagesBetween(from: string, to: string) {
  const [a, b] = [bookPage(from), bookPage(to)];
  return a && b && a.book === b.book ? Math.max(1, Math.abs(a.page - b.page)) : 1;
}

/** The book on the shelf a page is in: its category's (its page and its games), or a game's own. */
export function shelfEntryOf(pathname: string): ShelfEntry | undefined {
  const path = withSlash(pathname);
  return SHELF.find((entry) =>
    entry.game ? isGamePage(entry.game, path) : path.startsWith(`/spiele/${entry.category.id}/`) || entry.category.games.some((g) => isGamePage(g, path)),
  );
}

/**
 * The category whose world (backdrop and card colours, see Worlds.tsx) a page shows: its own page or one of its
 * games, also for a category without a page of its own. None for the home page.
 */
export function worldOf(pathname: string) {
  const path = withSlash(pathname);
  return CATEGORIES.find((c) => path.startsWith(`/spiele/${c.id}/`) || c.games.some((g) => isGamePage(g, path)));
}
