// What search engines and link previews see of each page: title, description and
// a short text. The build writes a page of its own for every entry (rsbuild.config.ts),
// so Google gets a real page with status 200 instead of 404.html, and the app sets
// the same title and description while it runs (src/lib/title.ts, SeoHead).
// No `@/` imports here: rsbuild.config.ts reads this file too.
// The texts are what parents search for (see the research on /management/).

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
    path: "/spiele/buchstaben-zahlen/",
    title: "Buchstaben und Zahlen lernen ab 2 Jahren",
    description:
      "Tasten drücken, Buchstaben finden, erste Wörter tippen: Buchstaben und Zahlen spielerisch für Kleinkinder, mit Bildern und Stimme, ohne Werbung.",
    text: "Jede Taste zeigt ihren Buchstaben mit einem Bild und sagt ihn. Dazu Zahlen mit Dingen zum Zählen, „Wo ist das B?“, der Buchstaben-Zug und erste Wörter.",
  },
  {
    path: "/spiele/weitere/",
    title: "Zähneputzen und Laut-leise-Spiel für Kleinkinder",
    description: "Zähneputzen mit Lied und Timer und ein Spiel für laute und leise Stimme – für Kinder ab 2 Jahren, kostenlos, ohne Werbung und offline.",
    text: "Zähne putzen mit Zahnputzlied, Zuckermonstern und Sternentafel, und Laut und leise: Brüllen lässt den Löwen springen, Flüstern die Maus piepsen.",
  },
  {
    path: "/bilder/",
    title: "Lebendige Wimmelbilder zum Antippen für Kinder",
    description: "Über 20 Wimmelbilder für Kleinkinder: Baustelle, Bauernhof, Zoo, Feuerwache und mehr. Alles bewegt sich und macht Geräusche – ohne Werbung.",
    text: "Wimmelbilder, die lebendig werden: Bagger baggern, Kühe muhen, das Feuerwehrauto fährt los. Mit Suchen, Ausmalen und Entdecken, für Kinder ab 2 Jahren.",
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
    text: "Zwölf Maschinen: Kugeln rollen, Dominosteine fallen, eins stößt das nächste an. Ein Tippen startet die Kettenreaktion – zum Staunen und Nochmal-Machen.",
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
      "Welcher Schatten gehört zur Giraffe? Ein Bild sucht seinen Schatten unter zwei bis vier – erstes Zuordnen für Kinder ab 2 Jahren, ohne Werbung.",
    text: "Tiere, Fahrzeuge, Essen und Dinge suchen ihren Schatten. Antippen oder hinziehen; ein falscher Schatten zeigt kurz, wer er ist.",
  },
  {
    path: "/socken/",
    title: "Socken-Paare finden – Spiel für Kleinkinder",
    description: "Die Waschmaschine ist fertig: Socken-Paare finden und an die Wäscheleine hängen. Erstes Paare-Suchen für Kinder ab 2 Jahren, ohne Werbung.",
    text: "Die Socken purzeln aus der Waschmaschine. Gleiche Socken klingen gleich; ein Paar hüpft an die Wäscheleine.",
  },
  {
    path: "/buchstaben/",
    title: "Buchstaben und Zahlen lernen – Tastatur-Spiel ab 2",
    description: "Jede Taste zeigt ihren Buchstaben mit Bild und Stimme: B wie Bär. Zahlen zum Zählen, „Wo ist das B?“ und der Buchstaben-Zug. Ab 2 Jahren.",
    text: "Freies Tippen auf der Tastatur oder dem Bildschirm: Buchstaben mit Bild und Wort, Zahlen mit Dingen zum Zählen, Buchstaben suchen und ein Zug aus Buchstaben.",
  },
  {
    path: "/woerter/",
    title: "Erste Wörter tippen – Lernspiel für Kinder",
    description: "Ein Bild, ein Wort: Kinder tippen Buchstabe für Buchstabe auf der Tastatur. Ganze Wörter, nur der Anfangsbuchstabe, Farben und Tun-Wörter.",
    text: "Erste Wörter auf der Tastatur: Zu jedem Bild das Wort tippen, Buchstabe für Buchstabe, oder für die Kleinsten nur den ersten Buchstaben.",
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
      "Tapsi muss mal: hinlaufen, Hose runter, warten, abziehen, Hände waschen – ein Tippen pro Schritt. Dazu Applaus und ein Stern, wenn es wirklich geklappt hat.",
    text: "Ein Töpfchen-Spiel für Kleinkinder: Fuchs, Bär oder Hase gehen Schritt für Schritt aufs Töpfchen, mit Warte-Liedchen beim Sitzen. „Hat geklappt!“ feiert echte Erfolge mit einem Stern auf der Wochentafel.",
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

/** Addresses that must never be in a search result (for grown-ups only). */
export const NO_INDEX_PATHS = ["/management/", "/ideen/"];

/** The entry for an address (with or without the trailing slash), if it has one. */
export function seoFor(pathname: string): PageSeo | undefined {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return SEO_PAGES.find((page) => page.path === path);
}

/** The full title as the browser tab and Google show it. */
export const fullTitle = (page: PageSeo) => `${page.title} | ${SITE_NAME}`;
