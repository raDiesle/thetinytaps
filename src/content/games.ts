export interface Game {
  href: string;
  emoji: string;
  title: string;
}

export interface Category {
  id: string;
  emoji: string;
  title: string;
  /** Under the title on the category's own page. */
  subtitle: string;
  games: Game[];
}

/** The home menu: first a category, then its games (on `/spiele/<id>/`). */
export const CATEGORIES: Category[] = [
  {
    id: "lebendige-welten",
    emoji: "🖼️",
    title: "Lebendige Welten",
    subtitle: "Bilder und Geschichten, die auf jedes Antippen antworten.",
    games: [
      { href: "/bilder/", emoji: "🖼️", title: "Lebendige Bilder" },
      { href: "/abenteuer/", emoji: "🏝️", title: "Bewegungsabenteuer" },
      { href: "/gefuehle/", emoji: "🐻", title: "Gefühle" },
      { href: "/kettenreaktion/", emoji: "🎳", title: "Kettenreaktion" },
      { href: "/kugelbahn/", emoji: "🎢", title: "Klingende Kugelbahn" },
      { href: "/kleine-abenteuer/", emoji: "🧭", title: "Kleine Abenteuer" },
    ],
  },
  {
    id: "zuordnen",
    emoji: "🧩",
    title: "Zuordnen",
    subtitle: "Was gehört zusammen? Antippen oder hinziehen.",
    games: [
      { href: "/tiere/", emoji: "🐰", title: "Was gehört zum Tier?" },
      { href: "/schatten/", emoji: "👤", title: "Schatten finden" },
    ],
  },
  {
    id: "buchstaben-zahlen",
    emoji: "🔤",
    title: "Buchstaben & Zahlen",
    subtitle: "Tasten drücken, Buchstaben finden, Wörter tippen.",
    games: [
      { href: "/buchstaben/", emoji: "🔤", title: "Buchstaben & Zahlen" },
      { href: "/woerter/", emoji: "✍️", title: "Wörter tippen" },
    ],
  },
  {
    id: "weitere",
    emoji: "🎈",
    title: "Weitere",
    subtitle: "Zähne putzen und laut oder leise rufen.",
    games: [
      { href: "/zaehne/", emoji: "🦷", title: "Zähne putzen" },
      { href: "/laut-leise/", emoji: "🦁", title: "Laut und leise" },
    ],
  },
];

export const categoryHref = (category: Category) => `/spiele/${category.id}/`;

/** The category a game page belongs to, e.g. for its back link. */
export function categoryOf(pathname: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return CATEGORIES.find((c) => c.games.some((g) => path.startsWith(g.href)));
}
