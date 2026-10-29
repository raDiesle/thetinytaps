import type { Localized } from "@/lib/language";

export interface Game {
  href: string;
  /** More addresses of the same page, each with its own search entry: `/tagesplan/` opens the Belohnungstafel's page on a plan. */
  also?: string[];
  emoji: string;
  /** The game's name in every language of the app (see lib/language.ts). */
  title: Localized;
}

export interface Category {
  id: string;
  emoji: string;
  title: Localized;
  /** Under the title on the category's own page. */
  subtitle: Localized;
  games: Game[];
}

/** The home menu: first a category, then its games (on `/spiele/<id>/`). */
export const CATEGORIES: Category[] = [
  {
    id: "lebendige-welten",
    emoji: "🖼️",
    title: { de: "Lebendige Welten", ru: "Живые миры", en: "Living Worlds", zh: "生动的世界", hi: "जीवंत दुनिया", es: "Mundos vivos", ar: "عوالم حيّة" },
    subtitle: {
      de: "Bilder und Geschichten, die auf jedes Antippen antworten.",
      ru: "Картинки и истории, которые отвечают на каждое касание.",
      en: "Pictures and stories that answer every tap.",
      zh: "每次点一点都会回应的图画和故事。",
      hi: "तस्वीरें और कहानियाँ, जो हर टैप पर जवाब देती हैं।",
      es: "Imágenes e historias que responden a cada toque.",
      ar: "صور وقصص تستجيب لكل لمسة.",
    },
    games: [
      {
        href: "/bilder/",
        emoji: "🖼️",
        title: { de: "Lebendige Bilder", ru: "Живые картинки", en: "Living Pictures", zh: "会动的图画", hi: "जीवंत तस्वीरें", es: "Imágenes vivas", ar: "صور حيّة" },
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
      },
      { href: "/gefuehle/", emoji: "🐻", title: { de: "Gefühle", ru: "Чувства", en: "Feelings", zh: "情绪", hi: "भावनाएँ", es: "Emociones", ar: "المشاعر" } },
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
      },
    ],
  },
  {
    id: "zuordnen",
    emoji: "🧩",
    title: { de: "Zuordnen", ru: "Найди пару", en: "Matching", zh: "配一配", hi: "जोड़ी मिलाओ", es: "Emparejar", ar: "المطابقة" },
    subtitle: {
      de: "Was gehört zusammen? Antippen oder hinziehen.",
      ru: "Что к чему подходит? Коснуться или перетащить.",
      en: "What goes together? Tap or drag.",
      zh: "什么和什么配成一对？点一点或拖过去。",
      hi: "क्या किसके साथ जाता है? छूकर या खींचकर।",
      es: "¿Qué va con qué? Tocar o arrastrar.",
      ar: "ما الذي يتناسب معًا؟ باللمس أو بالسحب.",
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
      },
      {
        href: "/schatten/",
        emoji: "👤",
        title: { de: "Schatten finden", ru: "Найди тень", en: "Find the Shadow", zh: "找影子", hi: "परछाईं ढूँढो", es: "Busca la sombra", ar: "أين الظل؟" },
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
    subtitle: {
      de: "Tasten drücken, Buchstaben finden, Wörter tippen.",
      ru: "Нажимать клавиши, искать буквы, печатать слова.",
      en: "Press keys, find letters, type words.",
      zh: "按按键，找字母，打单词。",
      hi: "बटन दबाना, अक्षर ढूँढना, शब्द टाइप करना।",
      es: "Pulsar teclas, buscar letras, escribir palabras.",
      ar: "ضغط المفاتيح، والبحث عن الحروف، وكتابة الكلمات.",
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
      },
    ],
  },
  {
    id: "weitere",
    emoji: "🎈",
    title: { de: "Weitere", ru: "Ещё", en: "More", zh: "更多", hi: "और भी", es: "Más", ar: "المزيد" },
    subtitle: { de: "Zähne putzen, aufs Töpfchen gehen, Sterne sammeln, den Tag in Bildern sehen und laut oder leise rufen." },
    games: [
      {
        href: "/zaehne/",
        emoji: "🦷",
        title: { de: "Zähne putzen", ru: "Чистим зубы", en: "Brushing Teeth", zh: "刷牙", hi: "दाँत साफ़ करना", es: "Lavarse los dientes", ar: "تنظيف الأسنان" },
      },
      {
        href: "/toepfchen/",
        emoji: "🚽",
        title: { de: "Aufs Töpfchen", ru: "На горшок", en: "Potty Time", zh: "坐便盆", hi: "पॉटी पर चलो", es: "Al orinal", ar: "إلى النونية" },
      },
      { href: "/belohnungstafel/", also: ["/tagesplan/"], emoji: "🌟", title: { de: "Sterne & Tagesplan" } },
      {
        href: "/laut-leise/",
        emoji: "🦁",
        title: { de: "Laut und leise", ru: "Громко и тихо", en: "Loud and Quiet", zh: "大声和小声", hi: "ज़ोर से और धीरे", es: "Fuerte y suave", ar: "عالٍ وخافت" },
      },
    ],
  },
];

/** A category of one game has no page of its own: a menu with a single card would only be one tap more. */
export const hasPage = (category: Category) => category.games.length > 1;

/** Where the category's home card leads: its page, or its only game. */
export const categoryHref = (category: Category) => (hasPage(category) ? `/spiele/${category.id}/` : category.games[0].href);

/** The category page a game page belongs to, for its back link; none for the only game of a category (back to home then). */
export function categoryOf(pathname: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return CATEGORIES.find((c) => hasPage(c) && c.games.some((g) => [g.href, ...(g.also ?? [])].some((href) => path.startsWith(href))));
}
