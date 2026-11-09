// What search engines and link previews see of each page: title, description and
// a short text. The build writes a page of its own for every entry (tools/build.ts),
// so Google gets a real page with status 200 instead of 404.html, and the app sets
// the same title and description while it runs (src/lib/title.ts, SeoHead) and shows
// the text below the first screen of a menu (SeoText).
// German pages have the plain address (/zaehne/); every other language of SEO_LANGUAGES
// has the same pages under its prefix (/en/zaehne/), its texts in seo.<id>.ts by German address.
// No `@/` imports here: tools/build.ts reads this file too.
import { isUnfinished } from "./games";
// The texts are what parents search for (see the research on /management/).
// No <meta name="keywords">: Google has ignored it since 2009 and Bing reads it as a hint of spam; the
// words parents search for belong in title, description and text instead.

/** The site's name, after every title. */
export const SITE_NAME = "Fun for Both";

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

/**
 * Languages with pages of their own for search engines, German first (it has no prefix): every language of the app
 * (APP_LANGUAGES), so parents searching in their own language find it there (A-22; all seven since November 2026).
 */
export const SEO_LANGUAGES = ["de", "en", "zh", "hi", "es", "ar", "ru"] as const;

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
export const SITE_PROMISE =
  "Kostenlos, ohne Werbung, ohne Anmeldung, funktioniert offline, in sieben Sprachen. Mit Touch oder Tastatur, am besten zusammen mit einem Erwachsenen.";

const scene = (id: string, title: string, things: string): PageSeo => ({
  path: `/bilder/${id}/`,
  title: `Wimmelbild ${title} für Kleinkinder`,
  description: `Wimmelbild ${title} zum Antippen: ${things} bewegen sich und machen Geräusche. Für Kleinkinder, kostenlos und ohne Werbung.`,
  text: `Ein lebendiges Wimmelbild: ${things} – jedes Antippen bringt etwas zum Leben, mit Geräusch und Bewegung. Dazu Suchen, Ausmalen und freies Entdecken.`,
});

/** The texts of every page: home, categories, games, scenes – also of games still being built, ready for when they are out. */
export const SEO_TEXTS: PageSeo[] = [
  {
    path: "/",
    title: "Spiele & Alltagshelfer für Kleinkinder – kostenlos",
    description:
      "Lernspiele und Alltagshelfer für Kleinkinder: Wimmelbilder, Gefühle, Buchstaben, Timer, Zähneputzen, Töpfchen, Belohnungstafel. Ohne Werbung.",
    text: "Fun for Both ist ein Regal voller Bilderbücher zum Spielen, für Groß und Klein zusammen: Jedes Antippen und jede Taste macht sofort etwas, es gibt kein Falsch und nichts zu lesen. In den Büchern warten Wimmelbilder, Bewegungsabenteuer, Kettenreaktionen und kleine Abenteuer, Gefühle, Buchstaben und Zahlen, Zuordnen und Erkennen. Und weil der Tag mit einem kleinen Kind seine eigenen kleinen Hürden hat, stehen gleich daneben unsere Alltagshelfer: ein Timer, der die Zeit in Bildern zeigt, Zähneputzen mit Lied, das Töpfchen-Spiel, eine Belohnungstafel, ein Tagesplan in Bildern und ein Countdown „Wie oft noch schlafen?“ – am Tablet oder zum Ausdrucken.",
  },
  {
    path: "/spiele/lebendige-welten/",
    title: "Wimmelbilder und Geschichten für Kleinkinder",
    description:
      "Lebendige Wimmelbilder, Bewegungsspiele, Kettenreaktionen und kleine Abenteuer, die auf jedes Antippen antworten. Für Kleinkinder, ohne Werbung.",
    text: "Bilder und Geschichten, die auf jedes Antippen antworten: über zwanzig Lebendige Bilder, Bewegungsabenteuer zum Mitmachen mit dem Fuchs Tapsi, zwanzig Kettenreaktionen und Kugelbahnen, und Kleine Abenteuer mit dem Aufzug, auf Wegen und in kleinen Filmen – mit der Feuerwehr, beim Bäcker oder mit einem Brief für Oma.",
  },
  {
    path: "/spiele/gefuehle/",
    title: "Gefühle-Spiele für Kleinkinder",
    description: "Alltagssituationen mit dem kleinen Bären, Wie geht's dir? und Was brauche ich? – das Kind zeigt sein Gefühl, wie doll es ist und was hilft.",
    text: "Ein Bilderbuch über Gefühle mit vier Spielen: In den Alltagssituationen erlebt der kleine Bär Tag für Tag, was Kinder kennen – Wut, Traurigkeit, Angst und Freude –, und das Kind wählt, was ihm hilft. Bei „Wie geht's dir?“ zeigt das Kind sein eigenes Gefühl und wie doll es ist, und bei „Was brauche ich?“, was ihm jetzt guttut. Bei „Was ist passiert?“ sieht das Kind, warum ein Gefühl da ist.",
  },
  {
    path: "/spiele/buchstaben-zahlen/",
    title: "Buchstaben und Zahlen lernen – Tastatur-Spiele",
    description:
      "Frei tippen, Zählen, Mitmachen und Wörter tippen: Jede Taste zeigt ihren Buchstaben mit Bild und Stimme, Zahlen kommen zum Zählen und Hüpfen.",
    text: "Vier Spiele auf der Tastatur oder dem Bildschirm: Frei tippen mit Buchstabe, Bild und Wort, Zählen mit Zahlen und Dingen, Mitmachen, bei dem ein Fuchs- oder Bärenkind jede Zahl hüpft, klatscht oder stampft, und Wörter tippen mit ersten Wörtern, Farben, Tu-Wörtern und „Wo ist das B?“.",
  },
  {
    path: "/spiele/zuordnen/",
    title: "Zuordnen lernen – Spiele für Kleinkinder",
    description:
      "Was gehört zum Tier, was gehört zusammen, welcher Schatten passt, welche Socken sind gleich? Erste Zuordnungsspiele für Kleinkinder, ohne Werbung.",
    text: "Vier erste Zuordnungsspiele: Bei „Was gehört zum Tier?“ bekommt das Tier sein Futter und sein Zuhause, bei „Was gehört zusammen?“ finden Zahnbürste und Zahnpasta oder die Feuerwehr und ihr Schlauch zueinander, bei „Erkennen“ sucht das Kind Schatten und Tiere im Busch, und bei „Socken-Paare“ hängen gleiche Socken an die Leine. Antippen oder hinziehen, ohne Fehler – und jedes Spiel wird von selbst leichter oder schwerer.",
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
    title: "Gefühle erklärt – Alltagssituationen für Kleinkinder",
    description:
      "Wütend, traurig, ängstlich, fröhlich: Der kleine Bär erlebt Alltagssituationen zu Hause und in der Kita, und das Kind wählt, was hilft. Ohne Werbung.",
    text: "Kleine Geschichten vom Bären, erzählt als Tage vom Morgen bis zum Abend: Er ist wütend, traurig, hat Angst oder freut sich, und das Kind wählt zwischen zwei Ideen, was hilft. Die Szenen gibt es auch nach Gefühlen geordnet. Wer die Geschichte lieber selbst erzählt, schaltet die Stimme mit einem Tippen aus und öffnet den ganzen Text zum Vorlesen. Für Gespräche über Gefühle mit Kleinkindern.",
  },
  {
    path: "/wie-gehts-dir/",
    title: "Wie geht's dir? Gefühle zeigen für Kleinkinder",
    description: "Fröhlich, stolz, müde oder wütend: Das Kind tippt auf das Bild, das zu seinem Gefühl passt, und zeigt, wie doll es gerade ist. Ohne Werbung.",
    text: "Acht Gefühle in zwei Gruppen, die angenehmen und die unangenehmen, jedes mit dem kleinen Bären in einem Moment, den Kinder kennen. Das Kind tippt auf sein Gefühl, dann zeigen drei Bilder dasselbe Gefühl ein bisschen, schon ziemlich und ganz doll, und das Kind wählt, wie doll es gerade ist. Von dort geht es weiter zu „Was brauche ich?“. Ein Anfang für Gespräche über Gefühle.",
  },
  {
    path: "/was-ist-passiert/",
    title: "Was ist passiert? Gefühle verstehen für Kleinkinder",
    description: "Das Kind sieht ein Gefühl und tippt, was passiert ist: der Luftballon fliegt weg, Oma kommt, ein Hund bellt. Ohne Werbung.",
    text: "Ein Kind weint, lacht, ist wütend oder erschrickt, und zwei Bilder zeigen, was passiert sein könnte. Das Kind tippt das Bild, das passt, und sieht, dass Gefühle einen Grund haben. Ein Anfang, um mit Kleinkindern über das Warum zu sprechen.",
  },
  {
    path: "/was-brauche-ich/",
    title: "Was brauche ich? Bedürfnisse zeigen für Kleinkinder",
    description: "Kuscheln, allein sein, toben, pusten, trinken oder ausruhen: Das Kind zeigt mit einem Bild, was ihm jetzt guttut. Ohne Werbung.",
    text: "Wenn ein Gefühl groß ist, hilft es zu wissen, was man braucht. Das Kind tippt auf ein Bild – in den Arm nehmen, allein sein, toben, stampfen und pusten, etwas trinken, essen, ausruhen oder ein Lied – und die Eltern sehen, was ihm jetzt guttut.",
  },
  {
    path: "/kettenreaktion/",
    title: "Kettenreaktion und Kugelbahn für Kinder",
    description: "Eine Kugel rollt los und stößt eine Maschine an: Kugelbahn und Kettenreaktionen zum Antippen und Staunen, für Kleinkinder, ohne Werbung.",
    text: "Zwanzig Bahnen und Maschinen: Kugeln rollen über Holz, Schnee, Wasserrutschen und Förderbänder, Dominosteine und Alltagsdinge fallen um, eins stößt das nächste an. Ein Tippen startet die Kettenreaktion, und an einer Stelle wartet die Maschine, bis das Kind sie mit einem Tippen weiterlaufen lässt – zum Staunen und Nochmal-Machen.",
  },
  {
    path: "/kleine-abenteuer/",
    title: "Kleine Abenteuer – Bildergeschichten für Kleinkinder",
    description:
      "Kurze Bilder-Abenteuer für Kleinkinder: Aufzug fahren, Wege entlanglaufen und kleine Filme wie beim Bäcker. Jedes Tippen bringt die Geschichte weiter.",
    text: "Abenteuer von wenigen Minuten: mit dem Aufzug fahren und auf jedem Stockwerk etwas entdecken, einen Weg entlanglaufen – dem Ball, dem Drachen oder der kleinen Lok hinterher – und am Ende feiern, oder einen kleinen Film erleben: mit der Feuerwehr ausrücken, einen Brief zu Oma bringen oder beim Bäcker Brötchen, eine Brezel oder einen Kuchen backen. Unterwegs entscheidet das Kind mit.",
  },
  {
    path: "/tiere/",
    title: "Tiere füttern – Tierspiel für Kleinkinder",
    description:
      "Was gehört zum Tier? Was frisst es, was gibt es uns, wo wohnt es, und was wird aus der Raupe? Mit Tiergeräuschen, für Kleinkinder, ohne Werbung.",
    text: "Der Hase will eine Möhre, der Elefant Erdnüsse, die Kuh gibt uns Milch, der Biber sucht seine Burg, aus der Raupe wird ein Schmetterling und aus dem Samen eine Sonnenblume: Futter, Milch, Ei oder Zuhause antippen, und das Tier freut sich und macht sein Geräusch. Viele Tiere vom Bauernhof, aus Wald, Zoo und Meer. Das Spiel wird von selbst leichter oder schwerer.",
  },
  {
    path: "/zusammen/",
    title: "Was gehört zusammen? – Zuordnen für Kleinkinder",
    description:
      "Zahnbürste und Zahnpasta, Schlüssel und Tür, die Feuerwehr und ihr Schlauch: Kleinkinder finden, was zusammengehört, und sehen es gleich wirken. Ohne Werbung.",
    text: "Oben liegt die Zahnbürste, unten Zahnpasta, Schlüssel und Deckel: Das Kind tippt, was dazugehört, und die beiden legen los – die Zahnpasta drückt einen Klecks auf die Bürste, der Schlüssel dreht sich und die Tür geht auf. Dazwischen brauchen Helfer als Fuchs und Bär ihr Werkzeug: Die Feuerwehr löscht mit dem Schlauch, die Ärztin hört mit dem Hörrohr, die Friseurin schneidet mit der Schere. Fast 200 Paare in über zwanzig Themen, vom Bad über die Kita bis zum Bauernhof. Das Spiel wird von selbst leichter oder schwerer.",
  },
  {
    path: "/schatten/",
    title: "Erkennen – Schatten und Tiere für Kinder",
    description: "Welcher Schatten gehört zur Giraffe? Wer schaut da aus dem Busch? Erstes Erkennen für Kleinkinder, ohne Werbung.",
    text: "Ein Bild sucht seinen Schatten unter zwei bis sechs – Tiere, Fahrzeuge, Essen und Dinge; danach schaut ein Tier aus dem Busch oder dem Teich, und das Kind tippt, wer es ist. Antippen oder hinziehen; ein falscher Schatten zeigt kurz, wer er ist. Erst wenige ganz verschiedene Bilder, dann mehr und ähnlichere, sobald das Kind sicher wird, später gedrehte und gespiegelte Schatten und welche unter Papierklappen zum Merken.",
  },
  {
    path: "/socken/",
    title: "Socken-Paare finden – Spiel für Kleinkinder",
    description: "Die Waschmaschine ist fertig: Socken-Paare finden und an die Wäscheleine hängen. Erstes Paare-Suchen für Kleinkinder, ohne Werbung.",
    text: "Die Socken purzeln aus der Waschmaschine. Gleiche Socken klingen gleich; ein Paar hüpft an die Wäscheleine. Erst wenige Paare in bunten Farben, dann mehr, mit Mustern und unter Wäschekörben wie bei Memory – sobald das Kind sicher wird. Danach kommen Fäustlinge, Gummistiefel und Bärenhausschuhe, je ein linker und ein rechter.",
  },
  {
    path: "/buchstaben/",
    title: "Frei tippen – Buchstaben lernen mit der Tastatur",
    description: "Jede Taste zeigt ihren Buchstaben mit Bild und Stimme: B wie Bär. Zahlen kommen mit Dingen zum Zählen. Ein Tastatur-Spiel ohne Werbung.",
    text: "Freies Tippen auf der Tastatur oder dem Bildschirm: Jeder Buchstabe kommt mit Bild und Wort, jede Zahl mit Dingen zum Zählen. Auf Wunsch große und kleine Buchstaben, Nachspuren mit dem Finger und Bilder zu einem Thema.",
  },
  {
    path: "/zaehlen/",
    title: "Zählen lernen – Zahlen-Spiel für Kleinkinder",
    description:
      "Jede Taste bringt eine Zahl mit so vielen Dingen zum Zählen: alles auf einmal, vorgezählt, Schritt für Schritt oder selbst gezählt. Ohne Werbung.",
    text: "Ein Zahlen-Spiel auf der Tastatur oder dem Bildschirm: Jede Ziffer zeigt sich mit so vielen Dingen, jede andere Taste bringt eine Zahl von 1 bis 9. Die Dinge kommen alle auf einmal, werden vorgezählt, kommen Schritt für Schritt, oder das Kind tippt jedes an und zählt selbst.",
  },
  {
    path: "/mitmachen/",
    title: "Zahlen zum Mitmachen – hüpfen, klatschen, stampfen",
    description: "Bei jeder Zahl hüpft, klatscht oder stampft ein Fuchs- oder Bärenkind genau so oft und zählt laut mit – das Kind macht mit. Ohne Werbung.",
    text: "Ein Zahlen-Spiel zum Mitbewegen: Jede Ziffer auf der Tastatur oder dem Bildschirm, jede andere Taste bringt eine Zahl von 1 bis 9. Ein Fuchs- oder Bärenkind lädt ein – „Hüpf mit!“ – und hüpft, klatscht oder stampft so oft, wie die Zahl sagt, neben ihm sein Großer. Jedes Mal wird laut mitgezählt und kurz gewartet, damit das Kind mitmachen kann. So wird die Zahl zur Menge im eigenen Körper.",
  },
  {
    path: "/woerter/",
    title: "Wörter tippen – erste Wörter für Kleinkinder",
    description:
      "Erste Wörter Buchstabe für Buchstabe tippen: Bär, Ball, Farben und Tu-Wörter. Oder „Wo ist das B?“ – die Taste zum Buchstaben finden. Ohne Werbung.",
    text: "Ein Bild und sein Wort: Das Kind tippt es Buchstabe für Buchstabe auf der Tastatur oder dem Bildschirm. Bildwörter, Farben, Tu-Wörter oder alles gemischt, in drei Längen. Oder nur der erste Buchstabe: „Wo ist das B?“ – die Taste dazu finden.",
  },
  {
    path: "/zaehne/",
    title: "Zähneputzen für Kinder – Zahnputzlied mit Timer",
    description:
      "Zähneputzen mit Lied: Schritt für Schritt putzen, die Zuckermonster verschwinden, morgens und abends ein Stern. Zahnputz-Timer für Kleinkinder.",
    text: "Ein Zahnputz-Begleiter, so lang wie sein Lied, etwa zwei Minuten: Erst zeigt eine kleine Geschichte, wo die Zuckermonster herkommen, dann führen sieben Schritte nach KAI (Kauflächen, außen, innen) durchs Putzen, und die Monster verschwinden. Morgens geht die Sonne auf, abends der Mond, und eine Wochentafel sammelt die Sterne. Das Zahnputzlied singt in der Sprache der App – auf Deutsch, Englisch, Spanisch, Russisch, Chinesisch, Hindi oder Arabisch.",
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
      "Belohnungstafel für Kleinkinder gestalten: Tag, Woche, Monat oder Sterne sammeln, mit Bildern und Belohnung. Am Tablet nutzen oder drucken – auch zum Ausmalen.",
    text: "Eine Belohnungstafel für Kleinkinder, frei einstellbar: Wochentafel mit Aufgaben und Tagen, Monatstafel als Kalender, Tagestafel für Morgen oder Abend, oder Sterne sammeln, für jede Aufgabe auf einem eigenen Weg zu ihrer Belohnung. Aufgaben als Bilder (Zähne putzen, Töpfchen, Anziehen, im eigenen Bett schlafen …), der Name des Kindes und eine Belohnung, am liebsten Zeit zusammen. Ein Assistent führt Schritt für Schritt zur eigenen Tafel und zeigt jede Wahl als Bild. Am Tablet hält ein Erwachsener ein Feld gedrückt und das Kind tippt den Stern hinein; zum Ausdrucken als A4 quer oder hochkant, mit Feldern zum Ausmalen und Sternen zum Ausschneiden. Gedruckt wird in Farbe oder schwarz-weiß, und schwarz-weiß ist mehr als ein grauer Ausdruck: Jedes Bild der Tafel ist dafür noch einmal als Ausmalbild gezeichnet, mit klaren, dicken Linien. Das spart Tinte, und das Kind malt seine Tafel selbst bunt. Keine Strafen, nichts wird weggenommen. Auf derselben Seite: ein Tagesplan in Bildern und der Countdown „Wie oft noch schlafen?“.",
  },
  {
    path: "/timer/",
    title: "Visueller Timer für Kinder – Zeitscheibe und Sanduhr",
    description:
      "Ein Timer ohne Zahlen für Kleinkinder: Die rote Scheibe schrumpft, Sand rinnt, Kerzen brennen, ein Zug fährt zum Bahnhof. 10 Sekunden bis 3 Stunden.",
    text: "Ein visueller Timer für Kinder, die noch keine Uhr lesen – einer unserer Alltagshelfer. Ein Erwachsener stellt 10 oder 30 Sekunden oder 1 bis 10 Minuten ein, jede andere Zeit bis zu drei Stunden oder eine Uhrzeit, bis zu der es dauert, und das Kind sieht die Zeit vergehen: Die rote Scheibe, wie Kinder sie aus der Kita kennen, wird kleiner, Sand rinnt durch eine große Sanduhr, Kerzen brennen herunter, ein Apfelbaum wächst, blüht und trägt Äpfel, eine Pizza wird Stück für Stück gegessen, ein Kinderwecker zählt herunter, ein Zug rollt zum Bahnhof, eine Raupe frisst ihr Blatt, eine Blume wächst und blüht, oder die Sonne geht auf. Tippt das Kind aufs Bild, leuchtet kurz auf, was noch bleibt, und klein in der Ecke steht für uns Große die restliche Zeit. Zum Abwechseln unter Geschwistern steht die Sanduhr zwischen zwei Kissen: Eine Lampe zeigt, wer dran ist, das Spielzeug liegt dort, bis der Sand durch ist, dann hüpft es hinüber, und die Sanduhr dreht sich von selbst um. Am Ende klingen ein Jubel und eine fröhliche Melodie. Für „noch fünf Minuten spielen“, das Warten aufs Essen oder fürs Aufräumen; der Bildschirm bleibt dabei an, und der Timer läuft auch, wenn die Spielzeit vorbei ist.",
  },
  {
    path: "/tagesplan/",
    title: "Tagesplan für Kinder – Tag und Woche in Bildern",
    description:
      "Tagesablauf, Morgen- und Abendroutine oder Wochenplan für Kleinkinder in Bildern: das Kind tippt ab, was geschafft ist. Bildkarten zum Drucken und Ausmalen.",
    text: "Ein Tagesplan in Bildern (Strukturtafel) für Kleinkinder: die Schritte des Tages als große Bildkarten – was jetzt dran ist, leuchtet, das Kind tippt es ab, wenn es geschafft ist, und die nächste Karte leuchtet. Vorlagen für die Morgenroutine, die Abendroutine, einen Tagesablauf mit Kita und eine Erst-dann-Tafel; ein Wochenplan zeigt, was an welchem Tag ist, mit Monden für jedes Mal Schlafen bis dahin. Dazu Karten mit Worten für uns Eltern – Mutmach-Sätze am Morgen, Erzählen nach der Kita, Gute-Nacht-Sätze –, und die Zahnputz-Karte startet gleich das Zähneputzen mit Lied. Ein Assistent führt in Bildern zum eigenen Plan, und zum Ausdrucken gibt es A4 mit allen Bildern als Karten zum Ausschneiden für eine Klett-Tafel – in Farbe oder schwarz-weiß, wo jede Karte als Ausmalbild mit klaren Linien gezeichnet ist, damit das Kind seinen Plan selbst ausmalt. Auf derselben Seite: eine Belohnungstafel zum Sterne sammeln und der Countdown „Wie oft noch schlafen?“.",
  },
  {
    path: "/wie-lange-warten/",
    title: "Countdown für Kinder – Wie oft noch schlafen?",
    description:
      "Bis zum Geburtstag, zum Urlaub oder bis Oma kommt: ein Feld mit dem schlafenden Fuchs- oder Bärenkind für jede Nacht – jeden Morgen kommt ein Stern hinein.",
    text: "Kleine Kinder verstehen „in fünf Tagen“ noch nicht, aber „noch fünfmal schlafen“ schon – und darum zählt dieser Countdown in Nächten. Für jede Nacht bis zum großen Tag steht ein Feld mit einem Bild darin, das Fuchs- oder Bärenkind schläft in seinem Bett, und darunter ein Kreis wie auf der Belohnungstafel. Daneben wartet das Bild vom Tag selbst: Geburtstag, Urlaub, Oma und Opa, der erste Kita-Tag. Jeden Morgen leuchtet das Feld der vergangenen Nacht, das Kind tippt es an, der Hahn kräht, und ein Stern landet im Kreis. So werden die Sterne mehr und die Nächte bis zum großen Tag weniger, bis das Bild groß dasteht. Wir stellen den Tag und das Bild ein, tippen auf ＋ für eine Nacht mehr und auf den Papierkorb für eine weniger, und wer mag, druckt die Nächte aus – in Farbe oder zum Ausmalen – und klebt jeden Morgen einen Sticker in den Kreis. Im selben Regalfach: die Belohnungstafel und der Tagesplan in Bildern.",
  },
  {
    path: "/schnullerfee/",
    title: "Schnullerfee – Abschied vom Schnuller als Geschichte",
    description:
      "Die Schnullerfee holt die Schnuller: einsammeln, ins Kästchen oder an den Luftballon, Licht aus – am Morgen liegt ein Geschenk da. Zum Schnuller abgewöhnen.",
    text: "Eine Geschichte zum Schnuller abgewöhnen, zum Spielen am Abend davor: Tapsi der Fuchs sammelt seine Schnuller ein und legt sie ins Schnullerkästchen auf die Fensterbank – oder bindet sie an einen Luftballon, der aus dem Fenster fliegt. Dann geht das Licht aus, Mama gibt einen Gute-Nacht-Kuss, und in der Nacht kommt die Schnullerfee durchs Fenster, glitzert und tauscht die Schnuller gegen ein Geschenk. Am Morgen weckt das Kind Tapsi, und das Geschenk wartet auf der Fensterbank. Welches Geschenk es ist und ob Kästchen oder Luftballon, stellen die Eltern ein, damit die Geschichte zum echten Abschied passt.",
  },
  {
    path: "/abstillen/",
    title: "Abstillen mit Geschichte – Tschüss, Mama-Milch",
    description:
      "Eine Bildgeschichte zum Abstillen für Kleinkinder: Tapsi der Fuchs sagt Tschüss zur Mama-Milch, ist traurig, kuschelt mit Mama und schläft ohne Stillen ein.",
    text: "Eine Bildgeschichte zum Vorlesen, wenn das Stillen zu Ende geht: Tapsi der Fuchs war ein Baby und hat bei Mama getrunken, jetzt ist Tapsi groß, isst einen Apfel und trinkt aus dem Becher. Mama erzählt, dass die Mama-Milch bald alle ist, und Tapsi winkt ihr zum Abschied. Am Abend möchte Tapsi doch trinken und ist traurig – Mama ist ganz nah, nimmt Tapsi in den Arm, liest ein Buch vor und singt ein Schlaflied, bis Tapsi einschläft. Am Morgen sind Mama und Papa stolz. Jedes Tippen blättert eine Seite weiter, und der Satz jeder Seite steht klein darunter zum Vorlesen. Für sanftes Abstillen von Kleinkindern, ohne Druck und ohne Schimpfen.",
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

/** Every page that should be found: all but the games still being built (`Game.unfinished`), which no one is to find yet. */
export const SEO_PAGES: PageSeo[] = SEO_TEXTS.filter((page) => !isUnfinished(page.path));

/**
 * Addresses that must never be in a search result: the pages for grown-ups only (the Impressum names a private
 * address) and the games still being built.
 */
export const NO_INDEX_PATHS = [
  "/management/",
  "/ideen/",
  "/impressum/",
  "/datenschutz/",
  ...SEO_TEXTS.filter((page) => isUnfinished(page.path)).map((page) => page.path),
];

/** The entry for an address (with or without the trailing slash), if it has one. */
export function seoFor(pathname: string): PageSeo | undefined {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return SEO_PAGES.find((page) => page.path === path);
}

/** The full title as the browser tab and Google show it. */
export const fullTitle = (page: PageText) => `${page.title} | ${SITE_NAME}`;
