import type { Localized } from "@/lib/language";

export interface Game {
  href: string;
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
    title: { de: "Lebendige Welten", ru: "Живые миры" },
    subtitle: { de: "Bilder und Geschichten, die auf jedes Antippen antworten.", ru: "Картинки и истории, которые отвечают на каждое касание." },
    games: [
      { href: "/bilder/", emoji: "🖼️", title: { de: "Lebendige Bilder", ru: "Живые картинки" } },
      { href: "/abenteuer/", emoji: "🏝️", title: { de: "Bewegungsabenteuer", ru: "Приключения в движении" } },
      { href: "/gefuehle/", emoji: "🐻", title: { de: "Gefühle", ru: "Чувства" } },
      { href: "/kettenreaktion/", emoji: "🎳", title: { de: "Kettenreaktion", ru: "Цепная реакция" } },
      { href: "/kleine-abenteuer/", emoji: "🧭", title: { de: "Kleine Abenteuer", ru: "Маленькие приключения" } },
    ],
  },
  {
    id: "zuordnen",
    emoji: "🧩",
    title: { de: "Zuordnen", ru: "Найди пару" },
    subtitle: { de: "Was gehört zusammen? Antippen oder hinziehen.", ru: "Что к чему подходит? Коснуться или перетащить." },
    games: [
      { href: "/tiere/", emoji: "🐰", title: { de: "Was gehört zum Tier?", ru: "Что нужно зверюшке?" } },
      { href: "/schatten/", emoji: "👤", title: { de: "Schatten finden", ru: "Найди тень" } },
      { href: "/socken/", emoji: "🧦", title: { de: "Socken-Paare", ru: "Пары носочков" } },
    ],
  },
  {
    id: "buchstaben-zahlen",
    emoji: "🔤",
    title: { de: "Buchstaben & Zahlen", ru: "Буквы и цифры" },
    subtitle: { de: "Tasten drücken, Buchstaben finden, Wörter tippen.", ru: "Нажимать клавиши, искать буквы, печатать слова." },
    // One game, so the home card opens it directly (see categoryHref).
    games: [{ href: "/buchstaben/", emoji: "🔤", title: { de: "Buchstaben & Zahlen", ru: "Буквы и цифры" } }],
  },
  {
    id: "weitere",
    emoji: "🎈",
    title: { de: "Weitere", ru: "Ещё" },
    subtitle: { de: "Zähne putzen, aufs Töpfchen gehen, Sterne sammeln und laut oder leise rufen." },
    games: [
      { href: "/zaehne/", emoji: "🦷", title: { de: "Zähne putzen", ru: "Чистим зубы" } },
      { href: "/toepfchen/", emoji: "🚽", title: { de: "Aufs Töpfchen", ru: "На горшок" } },
      { href: "/belohnungstafel/", emoji: "🌟", title: { de: "Belohnungstafel" } },
      { href: "/laut-leise/", emoji: "🦁", title: { de: "Laut und leise", ru: "Громко и тихо" } },
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
  return CATEGORIES.find((c) => hasPage(c) && c.games.some((g) => path.startsWith(g.href)));
}
