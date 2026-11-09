import { ALLTAG_BLURB, ALLTAG_TITLE, BOOK_BLURB, BOOK_TITLE, MOOD_BLURB, MOOD_TITLE } from "@/games/feelings/names";
import { COUNT_BLURB, COUNT_TITLE, FREE_BLURB, FREE_TITLE, MOVE_BLURB, MOVE_TITLE, WORDS_BLURB, WORDS_TITLE } from "@/games/letters/names";
import { WAIT_BOOK } from "@/games/rewards/names";
import { SHADOWS_BLURB, SHADOWS_TITLE } from "@/games/shadows/names";
import { TOGETHER_BLURB, TOGETHER_TITLE } from "@/games/together/names";
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
  /**
   * On the shelf the game stands as these books side by side, tied with a ribbon, one for each part it opens on
   * (`also`), each with its own name on its spine.
   */
  volumes?: Volume[];
  /**
   * Still being built: it stands neither on the shelf nor in its book and is in no search result or sitemap; only the
   * management page links to it, and its way back leads there (user decision, November 2026). Drop the mark to publish it.
   */
  unfinished?: true;
}

/** One of a game's books tied together on the shelf (`Game.volumes`): an address of the game, its emoji and name. */
export interface Volume {
  href: string;
  emoji: string;
  title: Localized;
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
    id: "alltag",
    emoji: "🌞",
    title: {
      de: "Alltagshelfer",
      ru: "Помощники на каждый день",
      en: "Everyday Helpers",
      zh: "日常小帮手",
      hi: "रोज़ के मददगार",
      es: "Ayudantes del día a día",
      ar: "مساعدون لكل يوم",
    },
    blurb: {
      de: "Zähne putzen, Töpfchen, Tagesplan",
      en: "Brushing teeth, potty, daily schedule",
      zh: "刷牙、便盆、日程",
      hi: "दाँत साफ़ करना, पॉटी, दिनचर्या",
      es: "Dientes, orinal, horario",
      ar: "تنظيف الأسنان والنونية وجدول اليوم",
      ru: "Зубы, горшок, распорядок дня",
    },
    // Each a book of its own on the shelf, its name on its spine (user decision, October 2026). First on the shelf, top
    // left: the everyday helpers are what parents need most, and the Timer is the very first book (user decision,
    // November 2026); the Belohnungstafel's books, the shelf's eye-catcher, stand right of Aufs Töpfchen (user feedback,
    // November 2026).
    apart: true,
    games: [
      {
        href: "/timer/",
        emoji: "⏳",
        title: { de: "Timer", ru: "Таймер", en: "Timer", zh: "计时器", hi: "टाइमर", es: "Temporizador", ar: "المؤقّت" },
        blurb: {
          de: "Warten in Bildern: Zug, Sanduhr, Kerze",
          en: "Wait with a train, hourglass or candle",
          zh: "用图画等待：火车、沙漏、蜡烛",
          hi: "इंतज़ार: ट्रेन, रेत घड़ी, मोमबत्ती",
          es: "Esperar con tren, reloj de arena o vela",
          ar: "الانتظار بالصور: قطار وساعة رملية وشمعة",
          ru: "Ожидание: поезд, песочные часы, свеча",
        },
      },
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
        also: ["/tagesplan/", "/wie-lange-warten/"],
        // On the shelf books tied together, each opening its own part (user feedback, November 2026): „Wie lange
        // warten?“ (a Countdown to a big day, H-05), then the Zeitplan, then the Belohnungstafel, which stays bound in gold.
        volumes: [
          { href: "/wie-lange-warten/", emoji: "🌙", title: WAIT_BOOK },
          {
            href: "/tagesplan/",
            emoji: "🗓️",
            title: { de: "Zeitplan", en: "Schedule", zh: "时间表", hi: "समय-सारणी", es: "Horario", ar: "الجدول الزمني", ru: "Расписание" },
          },
          {
            href: "/belohnungstafel/",
            emoji: "🌟",
            title: {
              de: "Belohnungstafel",
              en: "Reward chart",
              zh: "奖励表",
              hi: "इनाम चार्ट",
              es: "Tabla de premios",
              ar: "لوحة المكافآت",
              ru: "Таблица наград",
            },
          },
        ],
        emoji: "📅",
        title: {
          de: "Belohnungstafel & Zeitplan",
          en: "Reward Chart & Schedule",
          zh: "奖励表和时间表",
          hi: "इनाम चार्ट और समय-सारणी",
          es: "Tabla de premios y horario",
          ar: "لوحة المكافآت والجدول الزمني",
          ru: "Таблица наград и расписание",
        },
        blurb: {
          de: "Belohnungstafel und Zeitplan in Bildern",
          en: "Reward chart and schedule in pictures",
          zh: "用图画做的奖励表和时间表",
          hi: "तस्वीरों में इनाम चार्ट और समय-सारणी",
          es: "Premios y horario en imágenes",
          ar: "لوحة المكافآت والجدول الزمني بالصور",
          ru: "Таблица наград и расписание в картинках",
        },
      },
      {
        href: "/schnullerfee/",
        unfinished: true,
        emoji: "🧚",
        title: {
          de: "Die Schnullerfee",
          ru: "Фея пустышек",
          en: "The Pacifier Fairy",
          zh: "奶嘴仙子",
          hi: "चुसनी परी",
          es: "El hada del chupete",
          ar: "جنّية اللهّاية",
        },
        blurb: {
          de: "Abschied vom Schnuller als Geschichte",
          en: "Saying goodbye to the pacifier, as a story",
          zh: "在故事里和奶嘴说再见",
          hi: "कहानी के साथ चुसनी को अलविदा",
          es: "Despedirse del chupete con un cuento",
          ar: "وداع اللهّاية في قصة",
          ru: "Прощаемся с пустышкой: история",
        },
      },
      {
        href: "/abstillen/",
        unfinished: true,
        emoji: "🤱",
        title: { de: "Abstillen", ru: "Отлучение от груди", en: "Weaning", zh: "断奶", hi: "दूध छुड़ाना", es: "El destete", ar: "الفطام" },
        blurb: {
          de: "Tschüss, Mama-Milch – eine Geschichte",
          en: "Bye-bye, Mommy’s milk – a story",
          zh: "再见，妈妈的奶——一个故事",
          hi: "टाटा, मम्मी का दूध – एक कहानी",
          es: "Adiós, leche de mamá: un cuento",
          ar: "وداعًا يا حليب ماما – قصة",
          ru: "Пока, мамино молоко – история",
        },
      },
    ],
  },
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
    ],
  },
  {
    // A book of its own (user decision, November 2026): everyday scenes by feeling first (user wish, November 2026),
    // then how the child feels and how strong, and what it needs now (user feedback, November 2026: needs are a game
    // of their own; copying faces was removed).
    id: "gefuehle",
    emoji: "🐻",
    title: BOOK_TITLE,
    blurb: BOOK_BLURB,
    games: [
      { href: "/gefuehle/", emoji: "🐻", title: ALLTAG_TITLE, blurb: ALLTAG_BLURB },
      // „Wie geht's dir?“ holds both: its start screen offers „Was brauche ich?“ as its second card.
      { href: "/wie-gehts-dir/", emoji: "😊", title: MOOD_TITLE, blurb: MOOD_BLURB },
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
          de: "Verstecke, Futter, Milch, Zuhause, Wachsen",
          en: "Hiding, food, milk, homes, growing up",
          zh: "藏身处、食物、奶、家、长大",
          hi: "छिपने की जगह, खाना, दूध, घर, बड़ा होना",
          es: "Escondites, comida, leche, casas, crecer",
          ar: "مخابئ وطعام وحليب وبيوت ونموّ",
          ru: "Укрытия, корм, молоко, дом, рост",
        },
      },
      {
        href: "/zusammen/",
        emoji: "🔑",
        title: TOGETHER_TITLE,
        blurb: TOGETHER_BLURB,
      },
      {
        href: "/schatten/",
        emoji: "👤",
        title: SHADOWS_TITLE,
        blurb: SHADOWS_BLURB,
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
    // Four games, each a page of the book's table of contents, never ways to play behind ⚙️ of one game (user
    // feedback, November 2026).
    games: [
      { href: "/buchstaben/", emoji: "⌨️", title: FREE_TITLE, blurb: FREE_BLURB },
      { href: "/zaehlen/", emoji: "🔢", title: COUNT_TITLE, blurb: COUNT_BLURB },
      { href: "/mitmachen/", emoji: "🐸", title: MOVE_TITLE, blurb: MOVE_BLURB },
      { href: "/woerter/", emoji: "✍️", title: WORDS_TITLE, blurb: WORDS_BLURB },
    ],
  },
];

/**
 * A book of one game has no page of its own: it opens straight on its game, a menu with a single card would only be one
 * tap more. Nor has a category whose games stand apart, each a book of its own.
 */
export const hasPage = (category: Category) => !category.apart && listedGames(category).length > 1;

/** A category's games a child finds on the shelf or in its book: all but those still being built (`Game.unfinished`). */
export const listedGames = (category: Category) => category.games.filter((game) => !game.unfinished);

/** The games still being built (`Game.unfinished`), linked only from the management page. */
export const UNFINISHED: Game[] = CATEGORIES.flatMap((category) => category.games.filter((game) => game.unfinished));

/** Where the category's book on the shelf leads: its page, or its only game; the shelf for one whose games stand apart. */
export const categoryHref = (category: Category) => (category.apart ? "/" : hasPage(category) ? `/spiele/${category.id}/` : listedGames(category)[0].href);

/** A book on the shelf: a category's, or a game's that stands apart (`Category.apart`), standing with its spine out. */
export interface ShelfEntry {
  /** Its `data-book` on the shelf, by which the way back finds its gap. */
  id: string;
  href: string;
  category: Category;
  /** The game, for a game's own book. */
  game?: Game;
}

/** The id of a game's own book, or of one of its volumes: its address without slashes. */
export const bookIdOf = (href: string) => href.replaceAll("/", "");

/** The books on the shelf, in order: one per category, or, for a category whose games stand apart, one per game. */
export const SHELF: ShelfEntry[] = CATEGORIES.flatMap((category) =>
  category.apart
    ? listedGames(category).map((game) => ({ id: bookIdOf(game.href), href: game.href, category, game }))
    : [{ id: category.id, href: categoryHref(category), category }],
);

/** Whether a page belongs to the game: its address or one below it. */
const isGamePage = (game: Game, path: string) => [game.href, ...(game.also ?? [])].some((href) => path.startsWith(href));

const withSlash = (pathname: string) => (pathname.endsWith("/") ? pathname : `${pathname}/`);

/** Whether a page belongs to a game still being built (`Game.unfinished`). */
export const isUnfinished = (pathname: string) => UNFINISHED.some((game) => isGamePage(game, withSlash(pathname)));

/** The category page a game page belongs to, for its back link; none for the only game of a category (back to home then). */
export function categoryOf(pathname: string) {
  const path = withSlash(pathname);
  return CATEGORIES.find((c) => hasPage(c) && c.games.some((g) => isGamePage(g, path)));
}

/** The page a category's `index`-th game starts on, as its book's table of contents lists it: the first game on page 1. */
export const gamePage = (index: number) => index + 1;

/**
 * Where a menu is in its book: its category's table of contents on page 0 (unnumbered), each game's
 * start screen on its `gamePage`. None for any other page (the shelf, a game while playing, a scene inside a game).
 */
export function bookPage(pathname: string): { book: string; page: number } | undefined {
  const path = withSlash(pathname);
  for (const c of CATEGORIES.filter(hasPage)) {
    if (path === categoryHref(c)) return { book: c.id, page: 0 };
    const index = listedGames(c).findIndex((g) => g.href === path);
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
