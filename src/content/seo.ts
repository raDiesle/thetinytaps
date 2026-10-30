// What search engines and link previews see of each page: title, description and
// a short text. The build writes a page of its own for every entry (tools/build.ts),
// so Google gets a real page with status 200 instead of 404.html, and the app sets
// the same title and description while it runs (src/lib/title.ts, SeoHead).
// No `@/` imports here: tools/build.ts reads this file too.
// The texts are what parents search for (see the research on /management/).
// No <meta name="keywords">: Google has ignored it since 2009 and Bing reads it as a hint of spam; the
// words parents search for belong in title, description and text instead.

/** The site's name, after every title. */
export const SITE_NAME = "The Tiny Taps";

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

/** What every page says about the whole site, after its own text. */
export const SITE_PROMISE = "Kostenlos, ohne Werbung, ohne Anmeldung, funktioniert offline. Für Kinder ab 2 Jahren, mit Touch oder Tastatur.";

const scene = (id: string, title: string, things: string): PageSeo => ({
  path: `/bilder/${id}/`,
  title: `Wimmelbild ${title} für Kinder ab 2`,
  description: `Wimmelbild ${title} zum Antippen: ${things} bewegen sich und machen Geräusche. Für Kinder ab 2, kostenlos und ohne Werbung.`,
  text: `Ein lebendiges Wimmelbild: ${things} – jedes Antippen bringt etwas zum Leben, mit Geräusch und Bewegung. Dazu Suchen, Ausmalen und freies Entdecken.`,
});

/** Every page that should be found: home, categories, games, scenes. */
export const SEO_PAGES: PageSeo[] = [
  {
    path: "/",
    title: "Spiele für Kinder ab 2 – kostenlos, ohne Werbung",
    description:
      "Lernspiele für 2- bis 3-Jährige: Wimmelbilder, Zähneputzen mit Lied, Bewegungsspiele, Buchstaben und Tiere. Kostenlos, ohne Werbung, offline.",
    text: "The Tiny Taps sind einfache Spiele für die Kleinsten: Jedes Antippen und jede Taste macht sofort etwas, es gibt kein Falsch und nichts zu lesen. Wimmelbilder, Zähneputzen mit Lied, Bewegungsabenteuer, Gefühle, Buchstaben und Zahlen, Zuordnen und mehr.",
  },
  {
    path: "/spiele/lebendige-welten/",
    title: "Wimmelbilder und Geschichten für Kinder ab 2",
    description:
      "Lebendige Wimmelbilder, Bewegungsspiele, Gefühle und kleine Abenteuer, die auf jedes Antippen antworten. Für Kinder ab 2 Jahren, ohne Werbung.",
    text: "Bilder und Geschichten, die auf jedes Antippen antworten: Lebendige Bilder, Bewegungsabenteuer zum Mitmachen, Gefühle, Kettenreaktionen und Kleine Abenteuer.",
  },
  {
    path: "/spiele/zuordnen/",
    title: "Zuordnen lernen – Spiele für Kinder ab 2",
    description:
      "Was gehört zusammen? Tiere füttern, Schatten finden und Socken-Paare suchen – erste Zuordnungsspiele für Kleinkinder, kostenlos und ohne Werbung.",
    text: "Erste Zuordnungsspiele: Futter zum Tier bringen, den passenden Schatten finden, Socken-Paare an die Leine hängen. Antippen oder hinziehen, ohne Fehler.",
  },
  {
    path: "/bilder/",
    title: "Lebendige Wimmelbilder zum Antippen für Kinder",
    description: "Über 20 Wimmelbilder für Kleinkinder: Baustelle, Bauernhof, Zoo, Feuerwache und mehr. Alles bewegt sich und macht Geräusche – ohne Werbung.",
    text: "Wimmelbilder, die lebendig werden: Bagger baggern, Kühe muhen, das Feuerwehrauto fährt los. Mit Suchen, Ausmalen, Straßen malen und Entdecken, für Kinder ab 2 Jahren.",
  },
  {
    path: "/abenteuer/",
    title: "Bewegungsspiele für Kleinkinder drinnen",
    description: "Bewegungsabenteuer zum Mitmachen: Der Fuchs Tapsi zeigt Hüpfen, Strecken und Schleichen, das Kind macht vor dem Bildschirm mit. Ab 2 Jahren.",
    text: "Eine Bewegungsgeschichte für drinnen: Tapsi springt, duckt sich und streckt sich, das Kind macht mit, und die Welt antwortet. Ohne Lesen, Tapsi sagt alles.",
  },
  {
    path: "/gefuehle/",
    title: "Gefühle für Kinder erklärt – Spiel ab 2 Jahren",
    description:
      "Wütend, traurig, fröhlich: Der kleine Bär erlebt Gefühle zu Hause und in der Kita, und das Kind hilft ihm. Gefühle Kindern spielerisch erklären.",
    text: "Kleine Geschichten vom Bären: Er ist wütend, traurig oder froh, und das Kind entscheidet, was ihm hilft. Für Gespräche über Gefühle mit Kleinkindern.",
  },
  {
    path: "/kettenreaktion/",
    title: "Kettenreaktion und Kugelbahn für Kinder",
    description:
      "Eine Kugel rollt los und stößt eine Maschine an: Kugelbahn und Kettenreaktionen zum Antippen und Staunen, für Kinder ab 2 Jahren, ohne Werbung.",
    text: "Zwanzig Bahnen und Maschinen: Kugeln rollen über Holz, Schnee, Wasserrutschen und Förderbänder, Dominosteine fallen, eins stößt das nächste an. Ein Tippen startet die Kettenreaktion – zum Staunen und Nochmal-Machen.",
  },
  {
    path: "/kleine-abenteuer/",
    title: "Kleine Abenteuer – Bildergeschichten ab 2",
    description:
      "Kurze Bilder-Abenteuer für 2- bis 3-Jährige: mit dem Aufzug fahren, einen Weg entlanglaufen, Dinge einsammeln. Jedes Tippen bringt die Geschichte weiter.",
    text: "Abenteuer von wenigen Minuten: Aufzug fahren und auf jedem Stockwerk etwas entdecken, oder einen Weg entlanglaufen und am Ende feiern.",
  },
  {
    path: "/tiere/",
    title: "Tiere füttern – Tierspiel für Kinder ab 2",
    description:
      "Was gehört zum Tier? Futter zum hungrigen Tier ziehen oder das Tier in sein Zuhause bringen, mit Tiergeräuschen. Für Kleinkinder, ohne Werbung.",
    text: "Der Hase will eine Möhre, der Hund einen Knochen: Futter zum Tier ziehen oder antippen, das Tier freut sich und macht sein Geräusch.",
  },
  {
    path: "/schatten/",
    title: "Schatten finden – Zuordnungsspiel für Kinder",
    description:
      "Welcher Schatten gehört zur Giraffe? Ein Bild sucht seinen Schatten unter zwei bis sechs – erstes Zuordnen für Kinder ab 2 Jahren, ohne Werbung.",
    text: "Tiere, Fahrzeuge, Essen und Dinge suchen ihren Schatten. Antippen oder hinziehen; ein falscher Schatten zeigt kurz, wer er ist. Erst zwei ganz verschiedene Schatten, dann mehr und ähnlichere, sobald das Kind sicher wird.",
  },
  {
    path: "/socken/",
    title: "Socken-Paare finden – Spiel für Kleinkinder",
    description: "Die Waschmaschine ist fertig: Socken-Paare finden und an die Wäscheleine hängen. Erstes Paare-Suchen für Kinder ab 2 Jahren, ohne Werbung.",
    text: "Die Socken purzeln aus der Waschmaschine. Gleiche Socken klingen gleich; ein Paar hüpft an die Wäscheleine. Erst wenige Paare in bunten Farben, dann mehr, mit Mustern und unter Wäschekörben wie bei Memory – sobald das Kind sicher wird.",
  },
  {
    path: "/buchstaben/",
    title: "Buchstaben und Zahlen lernen – Tastatur-Spiel ab 2",
    description: "Jede Taste zeigt ihren Buchstaben mit Bild und Stimme: B wie Bär. Dazu Zählen, „Wo ist das B?“ und erste Wörter tippen. Ab 2 Jahren.",
    text: "Freies Tippen auf der Tastatur oder dem Bildschirm: Buchstaben mit Bild und Wort, Zahlen mit Dingen zum Zählen, Buchstaben suchen und erste Wörter, Farben und Tu-Wörter tippen.",
  },
  {
    path: "/zaehne/",
    title: "Zähneputzen für Kinder – Zahnputzlied mit Timer",
    description:
      "Zähneputzen mit Lied: Schritt für Schritt putzen, die Zuckermonster verschwinden, morgens und abends ein Stern. Zahnputz-Timer für Kinder ab 2.",
    text: "Ein Zahnputz-Begleiter: Zahnputzlied, sieben Schritte nach KAI (Kauflächen, außen, innen), Zuckermonster auf den Zähnen und eine Wochentafel mit Sonne und Mond.",
  },
  {
    path: "/toepfchen/",
    title: "Töpfchentraining spielerisch – Töpfchen-Spiel ab 2",
    description:
      "Tapsi muss Pipi oder Kaka: Mama und Papa rufen, Hose runter, sitzen, abziehen, Hände waschen – ein Tippen pro Schritt. Ein Stern, wenn es wirklich klappt.",
    text: "Ein Töpfchen-Spiel für Kleinkinder in bewegten Bildern: Tapsi der Fuchs isst und trinkt, merkt, dass er muss, ruft Mama und Papa und geht Schritt für Schritt aufs Töpfchen. Beim Sitzen machen Mama und Papa Quatsch, gießen Blumen oder drücken Zahnpasta – bis ein grüner Haken „fertig“ sagt: der Erwachsene tippt, ob Pipi, Kaka oder beides kam. Am Ende feiert eine Wochentafel echte Erfolge mit einem Stern.",
  },
  {
    path: "/belohnungstafel/",
    title: "Belohnungstafel für Kinder – gestalten und drucken",
    description:
      "Belohnungstafel für Kleinkinder selbst gestalten: Tag, Woche, Monat oder Sterne sammeln, mit Bildern, Name und Belohnung. Am Tablet nutzen oder A4 ausdrucken.",
    text: "Eine Belohnungstafel für Kinder ab 2, frei einstellbar: Wochentafel mit Aufgaben und Tagen, Monatstafel als Kalender, Tagestafel für Morgen oder Abend, oder ein Weg aus Sternen bis zur Belohnung. Aufgaben als Bilder (Zähne putzen, Töpfchen, Anziehen, im eigenen Bett schlafen …), der Name des Kindes und eine Belohnung, am liebsten Zeit zusammen. Ein Assistent führt Schritt für Schritt zur eigenen Tafel und zeigt jede Wahl als Bild. Am Tablet hält ein Erwachsener ein Feld gedrückt und das Kind tippt den Stern hinein; zum Ausdrucken als A4 quer oder hochkant, in Farbe oder Schwarz-weiß, mit Feldern zum Ausmalen und Sternen zum Ausschneiden. Keine Strafen, nichts wird weggenommen. Auf derselben Seite: ein Tagesplan in Bildern.",
  },
  {
    path: "/tagesplan/",
    title: "Tagesplan für Kinder – Tag und Woche in Bildern",
    description:
      "Tagesablauf, Morgen- und Abendroutine oder Wochenplan für Kleinkinder in Bildern: das Kind tippt ab, was geschafft ist. Mit Bildkarten zum Ausdrucken.",
    text: "Ein Tagesplan in Bildern (Strukturtafel) für Kinder ab 2: die Schritte des Tages als große Bildkarten – was jetzt dran ist, leuchtet, das Kind tippt es ab, wenn es geschafft ist, und die nächste Karte leuchtet. Vorlagen für die Morgenroutine, die Abendroutine, einen Tagesablauf mit Kita und eine Erst-dann-Tafel; ein Wochenplan zeigt, was an welchem Tag ist, mit Monden für jedes Mal Schlafen bis dahin. Ein Assistent führt in Bildern zum eigenen Plan, und zum Ausdrucken gibt es A4 mit allen Bildern als Karten zum Ausschneiden für eine Klett-Tafel. Auf derselben Seite: eine Belohnungstafel zum Sterne sammeln.",
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
export const fullTitle = (page: PageSeo) => `${page.title} | ${SITE_NAME}`;
