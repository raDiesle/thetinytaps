export interface Game {
  href: string;
  emoji: string;
  title: string;
  text: string;
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
    id: "buchstaben-zahlen",
    emoji: "🔤",
    title: "Buchstaben & Zahlen",
    subtitle: "Tasten drücken, Buchstaben finden, Wörter tippen.",
    games: [
      { href: "/buchstaben/", emoji: "🔤", title: "Buchstaben & Zahlen", text: "Taste drücken – Bild, Buchstabe und Zahl erscheinen." },
      { href: "/woerter/", emoji: "✍️", title: "Wörter tippen", text: "Kurze Wörter Buchstabe für Buchstabe tippen." },
    ],
  },
  {
    id: "zuordnen",
    emoji: "🧩",
    title: "Zuordnen",
    subtitle: "Was gehört zusammen? Antippen oder hinziehen.",
    games: [
      { href: "/tiere/", emoji: "🐰", title: "Was gehört zum Tier?", text: "Tiere füttern und ihr Zuhause finden." },
      { href: "/schatten/", emoji: "👤", title: "Schatten finden", text: "Welcher Schatten gehört zum Bild? Antippen oder hinziehen." },
    ],
  },
  {
    id: "lebendige-stories",
    emoji: "🖼️",
    title: "Lebendige Stories",
    subtitle: "Bilder und Geschichten, die auf jedes Antippen antworten.",
    games: [
      { href: "/bilder/", emoji: "🖼️", title: "Lebendige Bilder", text: "Wimmelbilder zum Antippen – alles bewegt sich und spricht." },
      { href: "/abenteuer/", emoji: "🏝️", title: "Bewegungsabenteuer", text: "Mit dem Fuchs Tapsi zur Schatzinsel – paddeln, ducken, ziehen und mitmachen." },
      { href: "/gefuehle/", emoji: "🐻", title: "Gefühle", text: "Den Bären trösten – und üben, was man im Kindergarten tun kann." },
    ],
  },
  {
    id: "weitere",
    emoji: "🎈",
    title: "Weitere",
    subtitle: "Putzen, rufen, rollen lassen und Aufzug fahren.",
    games: [
      { href: "/zaehne/", emoji: "🦷", title: "Zähne putzen", text: "Zwei Minuten putzen, bis alle Zuckermonster weg sind." },
      { href: "/laut-leise/", emoji: "🦁", title: "Laut und leise", text: "Laut rufen – der Löwe brüllt. Leise flüstern – die Maus piepst." },
      { href: "/kugelbahn/", emoji: "🎢", title: "Kugelbahn", text: "Tippen – die Kugel rollt, klingelt und plumpst in den Korb. Oder alles fällt um, oder eine ganze Maschine läuft los." },
      { href: "/aufzug/", emoji: "🛗", title: "Aufzug", text: "Großen Knopf drücken – der Aufzug fährt, pling, und ein Tier steigt ein oder aus." },
    ],
  },
];

export const categoryHref = (category: Category) => `/spiele/${category.id}/`;

/** The category a game page belongs to, e.g. for its back link. */
export function categoryOf(pathname: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return CATEGORIES.find((c) => c.games.some((g) => path.startsWith(g.href)));
}
