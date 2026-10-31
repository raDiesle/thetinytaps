// What search engines and link previews see of each page: title, description and
// a short text. The build writes a page of its own for every entry (tools/build.ts),
// so Google gets a real page with status 200 instead of 404.html, and the app sets
// the same title and description while it runs (src/lib/title.ts, SeoHead) and shows
// the text below the first screen of a menu (SeoText).
// German pages have the plain address (/zaehne/); every other language of SEO_LANGUAGES
// has the same pages under its prefix (/en/zaehne/), its texts in seo.<id>.ts by German address.
// No `@/` imports here: tools/build.ts reads this file too.
// The texts are what parents search for (see the research on /management/).
// No <meta name="keywords">: Google has ignored it since 2009 and Bing reads it as a hint of spam; the
// words parents search for belong in title, description and text instead.

/** The site's name, after every title. */
export const SITE_NAME = "Books for Both";

/** Search engines and previews for one address. */
export interface PageSeo {
  /** Address with slashes at both ends, e.g. "/zaehne/". */
  path: string;
  /** Title without the site name; at most about 50 characters so Google shows it whole. */
  title: string;
  /** One or two sentences for the search result, 80 to 160 characters. */
  description: string;
  /** A few sentences for the page before the app has started (and for crawlers without JavaScript). */
  text: string;
}

/** The picture link previews show (WhatsApp, Messenger, Google Discover): 1200 × 630, the shape they crop to. */
export const PREVIEW_IMAGE = {
  path: "/images/vorschau.jpg",
  width: 1200,
  height: 630,
  alt: "Eine Fuchs- und eine Bärenfamilie lesen auf einer Picknickdecke zusammen ein Bilderbuch.",
};

/** Languages with pages of their own for search engines, German first (it has no prefix). */
export const SEO_LANGUAGES = ["de", "en"] as const;

/** A language with pages of its own for search engines. */
export type SeoLanguage = (typeof SEO_LANGUAGES)[number];

/** A page's texts in another language than German. */
export type PageText = Omit<PageSeo, "path">;

/** What search engines read in a language besides German (seo.<id>.ts). */
export interface SeoTranslation {
  /** Language and country as link previews name it, e.g. "en_US". */
  locale: string;
  /** What every page says about the whole site (SITE_PROMISE). */
  promise: string;
  /** Each page's texts, by its German address. */
  pages: Record<string, PageText>;
  /** The preview picture's description (PREVIEW_IMAGE.alt). */
  imageAlt: string;
}

/** The start of the addresses of a language's pages: none for German, "/en" for English. */
export const languagePrefix = (language: SeoLanguage) => (language === "de" ? "" : `/${language}`);

/** The language an address is in, and the address without its prefix: "/en/zaehne/" → English, "/zaehne/". */
export function splitLanguage(pathname: string): { language: SeoLanguage; path: string } {
  for (const language of SEO_LANGUAGES) {
    const prefix = languagePrefix(language);
    if (prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))) return { language, path: pathname.slice(prefix.length) || "/" };
  }
  return { language: "de", path: pathname };
}

/** What every page says about the whole site, after its own text. */
export const SITE_PROMISE = "Kostenlos, ohne Werbung, ohne Anmeldung, funktioniert offline. Mit Touch oder Tastatur, am besten zusammen mit einem Erwachsenen.";

const scene = (id: string, title: string, things: string): PageSeo => ({
  path: `/bilder/${id}/`,
  title: `Wimmelbild ${title} für Kleinkinder`,
  description: `Wimmelbild ${title} zum Antippen: ${things} bewegen sich und machen Geräusche. Für Kleinkinder, kostenlos und ohne Werbung.`,
  text: `Ein lebendiges Wimmelbild: ${things} – jedes Antippen bringt etwas zum Leben, mit Geräusch und Bewegung. Dazu Suchen, Ausmalen und freies Entdecken.`,
});

/** Every page that should be found: home, categories, games, scenes. */
export const SEO_PAGES: PageSeo[] = [
  {
    path: "/",
    title: "Spiele für Kleinkinder – kostenlos, ohne Werbung",
    description: "Lernspiele für Kleinkinder: Wimmelbilder, Zähneputzen mit Lied, Bewegungsspiele, Buchstaben und Tiere. Kostenlos, ohne Werbung, offline.",
    text: "Books for Both ist ein Regal voller Bilderbücher zum Spielen, für Groß und Klein zusammen: Jedes Antippen und jede Taste macht sofort etwas, es gibt kein Falsch und nichts zu lesen. Wimmelbilder, Zähneputzen mit Lied, Bewegungsabenteuer, Gefühle, Buchstaben und Zahlen, Zuordnen und mehr.",
  },
  {
    path: "/spiele/lebendige-welten/",
    title: "Wimmelbilder und Geschichten für Kleinkinder",
    description: "Lebendige Wimmelbilder, Bewegungsspiele, Gefühle und kleine Abenteuer, die auf jedes Antippen antworten. Für Kleinkinder, ohne Werbung.",
    text: "Bilder und Geschichten, die auf jedes Antippen antworten: Lebendige Bilder, Bewegungsabenteuer zum Mitmachen, Gefühle, Kettenreaktionen und Kleine Abenteuer.",
  },
  {
    path: "/spiele/zuordnen/",
    title: "Zuordnen lernen – Spiele für Kleinkinder",
    description:
      "Was gehört zusammen? Tiere füttern, Schatten finden und Socken-Paare suchen – erste Zuordnungsspiele für Kleinkinder, kostenlos und ohne Werbung.",
    text: "Erste Zuordnungsspiele: Futter zum Tier bringen, den passenden Schatten finden, Socken-Paare an die Leine hängen. Antippen oder hinziehen, ohne Fehler.",
  },
  {
    path: "/spiele/alltag/",
    title: "Zähneputzen, Töpfchen und Tagesplan für Kleinkinder",
    description:
      "Hilfen für jeden Tag: Zähneputzen mit Lied, aufs Töpfchen gehen, Belohnungstafel und Tagesplan in Bildern, laut und leise sprechen. Ohne Werbung.",
    text: "Was jeden Tag dran ist, als Spiel: Zähne putzen mit Lied und Spiegel, aufs Töpfchen gehen, Sterne sammeln und den Tag in Bildern planen, laut und leise sprechen.",
  },
  {
    path: "/bilder/",
    title: "Lebendige Wimmelbilder zum Antippen für Kinder",
    description: "Über 20 Wimmelbilder für Kleinkinder: Baustelle, Bauernhof, Zoo, Feuerwache und mehr. Alles bewegt sich und macht Geräusche – ohne Werbung.",
    text: "Wimmelbilder, die lebendig werden: Bagger baggern, Kühe muhen, das Feuerwehrauto fährt los. Mit Suchen, Ausmalen, Straßen malen und Entdecken, für Kleinkinder.",
  },
  {
    path: "/abenteuer/",
    title: "Bewegungsspiele für Kleinkinder drinnen",
    description:
      "Bewegungsabenteuer zum Mitmachen: Der Fuchs Tapsi zeigt Hüpfen, Strecken und Schleichen, das Kind macht vor dem Bildschirm mit. Ohne Werbung.",
    text: "Eine Bewegungsgeschichte für drinnen: Tapsi springt, duckt sich und streckt sich, das Kind macht mit, und die Welt antwortet. Ohne Lesen, Tapsi sagt alles.",
  },
  {
    path: "/gefuehle/",
    title: "Gefühle für Kinder erklärt – Spiel für Kleinkinder",
    description:
      "Wütend, traurig, fröhlich: Der kleine Bär erlebt Gefühle zu Hause und in der Kita, und das Kind hilft ihm. Gefühle Kindern spielerisch erklären.",
    text: "Kleine Geschichten vom Bären: Er ist wütend, traurig oder froh, und das Kind entscheidet, was ihm hilft. Für Gespräche über Gefühle mit Kleinkindern.",
  },
  {
    path: "/kettenreaktion/",
    title: "Kettenreaktion und Kugelbahn für Kinder",
    description: "Eine Kugel rollt los und stößt eine Maschine an: Kugelbahn und Kettenreaktionen zum Antippen und Staunen, für Kleinkinder, ohne Werbung.",
    text: "Zwanzig Bahnen und Maschinen: Kugeln rollen über Holz, Schnee, Wasserrutschen und Förderbänder, Dominosteine fallen, eins stößt das nächste an. Ein Tippen startet die Kettenreaktion – zum Staunen und Nochmal-Machen.",
  },
  {
    path: "/kleine-abenteuer/",
    title: "Kleine Abenteuer – Bildergeschichten für Kleinkinder",
    description:
      "Kurze Bilder-Abenteuer für Kleinkinder: mit dem Aufzug fahren, einen Weg entlanglaufen, Dinge einsammeln. Jedes Tippen bringt die Geschichte weiter.",
    text: "Abenteuer von wenigen Minuten: Aufzug fahren und auf jedem Stockwerk etwas entdecken, oder einen Weg entlanglaufen und am Ende feiern.",
  },
  {
    path: "/tiere/",
    title: "Tiere füttern – Tierspiel für Kleinkinder",
    description:
      "Was gehört zum Tier? Futter zum hungrigen Tier ziehen oder das Tier in sein Zuhause bringen, mit Tiergeräuschen. Für Kleinkinder, ohne Werbung.",
    text: "Der Hase will eine Möhre, der Hund einen Knochen: Futter zum Tier ziehen oder antippen, das Tier freut sich und macht sein Geräusch.",
  },
  {
    path: "/schatten/",
    title: "Schatten finden – Zuordnungsspiel für Kinder",
    description: "Welcher Schatten gehört zur Giraffe? Ein Bild sucht seinen Schatten unter zwei bis sechs – erstes Zuordnen für Kleinkinder, ohne Werbung.",
    text: "Tiere, Fahrzeuge, Essen und Dinge suchen ihren Schatten. Antippen oder hinziehen; ein falscher Schatten zeigt kurz, wer er ist. Erst zwei ganz verschiedene Schatten, dann mehr und ähnlichere, sobald das Kind sicher wird.",
  },
  {
    path: "/socken/",
    title: "Socken-Paare finden – Spiel für Kleinkinder",
    description: "Die Waschmaschine ist fertig: Socken-Paare finden und an die Wäscheleine hängen. Erstes Paare-Suchen für Kleinkinder, ohne Werbung.",
    text: "Die Socken purzeln aus der Waschmaschine. Gleiche Socken klingen gleich; ein Paar hüpft an die Wäscheleine. Erst wenige Paare in bunten Farben, dann mehr, mit Mustern und unter Wäschekörben wie bei Memory – sobald das Kind sicher wird.",
  },
  {
    path: "/buchstaben/",
    title: "Buchstaben und Zahlen lernen – Tastatur-Spiel",
    description: "Jede Taste zeigt ihren Buchstaben mit Bild und Stimme: B wie Bär. Dazu Zählen, „Wo ist das B?“ und erste Wörter tippen. Ohne Werbung.",
    text: "Freies Tippen auf der Tastatur oder dem Bildschirm: Buchstaben mit Bild und Wort, Zahlen mit Dingen zum Zählen, Buchstaben suchen und erste Wörter, Farben und Tu-Wörter tippen.",
  },
  {
    path: "/zaehne/",
    title: "Zähneputzen für Kinder – Zahnputzlied mit Timer",
    description:
      "Zähneputzen mit Lied: Schritt für Schritt putzen, die Zuckermonster verschwinden, morgens und abends ein Stern. Zahnputz-Timer für Kleinkinder.",
    text: "Ein Zahnputz-Begleiter: Zahnputzlied, sieben Schritte nach KAI (Kauflächen, außen, innen), Zuckermonster auf den Zähnen und eine Wochentafel mit Sonne und Mond.",
  },
  {
    path: "/toepfchen/",
    title: "Töpfchentraining spielerisch – das Töpfchen-Spiel",
    description:
      "Tapsi muss Pipi oder Kaka: Mama und Papa rufen, Hose runter, sitzen, abziehen, Hände waschen – ein Tippen pro Schritt. Ein Stern, wenn es wirklich klappt.",
    text: "Ein Töpfchen-Spiel für Kleinkinder in bewegten Bildern: Tapsi der Fuchs isst und trinkt, merkt, dass er muss, ruft Mama und Papa und geht Schritt für Schritt aufs Töpfchen. Beim Sitzen machen Mama und Papa Quatsch, gießen Blumen oder drücken Zahnpasta – bis ein grüner Haken „fertig“ sagt: der Erwachsene tippt, ob Pipi, Kaka oder beides kam. Am Ende feiert eine Wochentafel echte Erfolge mit einem Stern.",
  },
  {
    path: "/belohnungstafel/",
    title: "Belohnungstafel für Kinder – gestalten und drucken",
    description:
      "Belohnungstafel für Kleinkinder selbst gestalten: Tag, Woche, Monat oder Sterne sammeln, mit Bildern, Name und Belohnung. Am Tablet nutzen oder A4 ausdrucken.",
    text: "Eine Belohnungstafel für Kleinkinder, frei einstellbar: Wochentafel mit Aufgaben und Tagen, Monatstafel als Kalender, Tagestafel für Morgen oder Abend, oder ein Weg aus Sternen bis zur Belohnung. Aufgaben als Bilder (Zähne putzen, Töpfchen, Anziehen, im eigenen Bett schlafen …), der Name des Kindes und eine Belohnung, am liebsten Zeit zusammen. Ein Assistent führt Schritt für Schritt zur eigenen Tafel und zeigt jede Wahl als Bild. Am Tablet hält ein Erwachsener ein Feld gedrückt und das Kind tippt den Stern hinein; zum Ausdrucken als A4 quer oder hochkant, in Farbe oder Schwarz-weiß, mit Feldern zum Ausmalen und Sternen zum Ausschneiden. Keine Strafen, nichts wird weggenommen. Auf derselben Seite: ein Tagesplan in Bildern.",
  },
  {
    path: "/tagesplan/",
    title: "Tagesplan für Kinder – Tag und Woche in Bildern",
    description:
      "Tagesablauf, Morgen- und Abendroutine oder Wochenplan für Kleinkinder in Bildern: das Kind tippt ab, was geschafft ist. Mit Bildkarten zum Ausdrucken.",
    text: "Ein Tagesplan in Bildern (Strukturtafel) für Kleinkinder: die Schritte des Tages als große Bildkarten – was jetzt dran ist, leuchtet, das Kind tippt es ab, wenn es geschafft ist, und die nächste Karte leuchtet. Vorlagen für die Morgenroutine, die Abendroutine, einen Tagesablauf mit Kita und eine Erst-dann-Tafel; ein Wochenplan zeigt, was an welchem Tag ist, mit Monden für jedes Mal Schlafen bis dahin. Ein Assistent führt in Bildern zum eigenen Plan, und zum Ausdrucken gibt es A4 mit allen Bildern als Karten zum Ausschneiden für eine Klett-Tafel. Auf derselben Seite: eine Belohnungstafel zum Sterne sammeln.",
  },
  {
    path: "/laut-leise/",
    title: "Laut und leise – Stimmspiel für Kleinkinder",
    description:
      "Brüllen lässt den Löwen springen, Flüstern die Maus piepsen: Laut und leise sprechen spielerisch üben. Nichts wird aufgenommen, ohne Werbung.",
    text: "Das Mikrofon misst nur, wie laut es ist: Laut ruft den Löwen, leise die Maus. Antippen geht auch. Nichts wird aufgenommen.",
  },
  scene("baustelle", "Baustelle", "Bagger, Kran und Betonmischer"),
  scene("stadt", "Stadt", "Bus, Ampel und Polizeiauto"),
  scene("bauernhof", "Bauernhof", "Kuh, Schwein und Traktor"),
  scene("hof", "Hof am Teich", "Ente, Huhn und Windmühle"),
  scene("zoo", "Zoo", "Löwe, Giraffe, Elefant und Affe"),
  scene("unterwasser", "Unterwasser", "Wal, Delfin, Krake und Schildkröte"),
  scene("badezimmer", "Badezimmer", "Badewanne, Dusche und Zahnbürste"),
  scene("wald", "Wald", "Fuchs, Reh, Igel und Eule"),
  scene("feuerwache", "Feuerwache", "Feuerwehrauto, Sirene und Helme"),
  scene("weltall", "Weltall", "Rakete, Astronaut und Mondauto"),
  scene("spielplatz", "Spielplatz", "Rutsche, Schaukel und Eiswagen"),
  scene("kueche", "Küche", "Toaster, Wasserkocher und Kühlschrank"),
  scene("supermarkt", "Supermarkt", "Einkaufswagen, Kasse und Bäckerin"),
  scene("flughafen", "Flughafen und Bahnhof", "Flugzeug, Zug und Gepäckband"),
  scene("winterbaustelle", "Winter-Baustelle", "Schneepflug, Bagger, Bauwagen"),
  scene("kita", "Kita", "Garderobe, Puppenwagen und Geburtstagszug"),
  scene("kinderarzt", "Kinderarzt", "Stethoskop, Waage und Pflaster"),
  scene("strand", "Strand", "Sandburg, Leuchtturm, Möwe und Segelboot"),
  scene("dinotal", "Dinotal", "T-Rex, Brachiosaurus und Vulkan"),
  scene("gutenacht", "Gute Nacht", "Mond, Sterne, Teddy und Spieluhr"),
  scene("winter", "Winter", "Schneemann, Schlitten und Eichhörnchen"),
  scene("herbst", "Herbst", "Igel, Kastanien, Drachen und Traktor"),
  scene("ostern", "Ostern", "Osterhase, Lämmchen und Kirschbaum"),
];

/** Addresses that must never be in a search result (for grown-ups only; the Impressum names a private address). */
export const NO_INDEX_PATHS = ["/management/", "/ideen/", "/impressum/", "/datenschutz/"];

/** The entry for an address (with or without the trailing slash), if it has one. */
export function seoFor(pathname: string): PageSeo | undefined {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return SEO_PAGES.find((page) => page.path === path);
}

/** The full title as the browser tab and Google show it. */
export const fullTitle = (page: PageText) => `${page.title} | ${SITE_NAME}`;
