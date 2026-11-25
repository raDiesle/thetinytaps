// What search engines and link previews see of each page: title, description and
// a short text. The build writes a page of its own for every entry (tools/build.ts),
// so Google gets a real page with status 200 instead of 404.html, and the app sets
// the same title and description while it runs (src/lib/title.ts, SeoHead) and shows
// the text below the first screen of a menu (SeoText).
// German pages have the plain address (/zaehne/); every other language of SEO_LANGUAGES
// has the same pages under its prefix (/en/zaehne/), its texts in seo.<id>.ts by German address.
// No `@/` imports here: tools/build.ts reads this file too.
import { isUnfinished } from "./games";
import { pageOfLevel } from "./levelPages";
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

const scene = (id: string, title: string, things: string, more: string): PageSeo => ({
  path: `/bilder/${id}/`,
  title: `Wimmelbild ${title} für Kleinkinder`,
  description: `Wimmelbild ${title} zum Antippen: ${things} bewegen sich und machen Geräusche. Für Kleinkinder, kostenlos und ohne Werbung.`,
  text: `Ein lebendiges Wimmelbild: ${things} – jedes Antippen bringt etwas zum Leben, mit Geräusch und Bewegung. ${more} Neben dem freien Entdecken lässt sich das Bild ausmalen, absuchen, mit Fragen erkunden, beim Geräusch-Rätsel am Klang erraten und mit der Taschenlampe im Dunkeln entdecken – oder man malt Straßen, auf denen Auto, Traktor oder Dampflok durchs Bild fahren.`,
});

/** The texts of every page: home, categories, games, scenes – also of games still being built, ready for when they are out. */
export const SEO_TEXTS: PageSeo[] = [
  {
    path: "/",
    title: "Spiele & Alltagshelfer für Kleinkinder – kostenlos",
    description:
      "Lernspiele & Alltagshelfer für Kleinkinder: Wimmelbilder, Gefühle, Buchstaben, Timer, Zähneputzen, Töpfchen, Belohnungstafel, Abstillen, Haarewaschen.",
    text: "Fun for Both ist ein Regal voller Bilderbücher zum Spielen, für Groß und Klein zusammen: Jedes Antippen und jede Taste macht sofort etwas, es gibt kein Falsch und nichts zu lesen. In den Büchern warten Wimmelbilder, Bewegungsabenteuer, Kettenreaktionen und kleine Abenteuer, Gefühle, Buchstaben und Zahlen, Zuordnen und Erkennen. Und weil der Tag mit einem kleinen Kind seine eigenen kleinen Hürden hat, stehen gleich daneben unsere Alltagshelfer: ein Timer, der die Zeit in Bildern zeigt, Zähneputzen mit Lied, das Töpfchen-Spiel, eine Belohnungstafel, ein Tagesplan in Bildern und ein Countdown „Wie oft noch schlafen?“ – am Tablet oder zum Ausdrucken – und Vorlesegeschichten in Kapiteln fürs Abstillen, vom Fläschchen zum Becher, für den Abschied vom Schnuller mit der Schnullerfee, für den Start in der Kita, fürs Haarewaschen und für den Umzug ins große Bett. Wer ein Spiel oder eine Geschichte zu Ende spielt, bekommt dafür einen eigenen kleinen Pokal, und alle Pokale stehen auf Sockeln in einem kleinen Pokalzimmer gleich neben dem Regal. Und für die Allerkleinsten, die einfach drauflos tippen wollen, steht ein buntes Plakat der Zaubertasten im Regal: Jede Taste und jeder Tipp bringt sofort etwas Buntes mit Ton.",
  },
  {
    path: "/spiele/lebendige-welten/",
    title: "Wimmelbilder und Geschichten für Kleinkinder",
    description:
      "Lebendige Wimmelbilder, Bewegungsspiele, Kettenreaktionen und kleine Abenteuer, die auf jedes Antippen antworten. Für Kleinkinder, ohne Werbung.",
    text: "Bilder und Geschichten, die auf jedes Antippen antworten: über zwanzig Lebendige Bilder, Bewegungsabenteuer zum Mitmachen mit dem Fuchs Tapsi, einundzwanzig Kettenreaktionen und Kugelbahnen, und Kleine Abenteuer mit dem Aufzug, auf Wegen und in kleinen Filmen – mit der Feuerwehr, beim Bäcker, mit einem Brief für Oma oder im eigenen Garten. Vier Spiele stehen in diesem Buch, mal ruhig, mal lebhaft. In den Wimmelbildern, von der Baustelle bis zum Weltall, tippt das Kind an, was es entdeckt, malt aus, sucht oder leuchtet mit der Taschenlampe durchs Dunkle. Bei der Kettenreaktion genügt ein Tippen, und Kugeln rollen über Holz, Schnee und Wasser, oder eine Maschine in der Küche, im Garten oder im Zirkus stößt ein Ding nach dem anderen an. Die kleinen Abenteuer dauern nur ein paar Minuten, und unterwegs entscheidet das Kind mit. Und wenn die Beine zappeln, geht es mit Tapsi auf die Schatzinsel oder auf die Wolkenreise – hüpfen, ducken und strecken vor dem Bildschirm. Wer eine Bahn oder eine Geschichte zu Ende spielt, bekommt dafür einen kleinen Pokal.",
  },
  {
    path: "/spiele/gefuehle/",
    title: "Gefühle-Spiele für Kleinkinder",
    description:
      "Alltagssituationen mit dem kleinen Bären, Wie geht's dir? und Was ist passiert? – das Kind zeigt sein Gefühl, wie doll es ist, was hilft und warum.",
    text: "Ein Bilderbuch über Gefühle mit drei Spielen: In den Alltagssituationen erlebt der kleine Bär Tag für Tag, was Kinder kennen – Wut, Traurigkeit, Angst und Freude –, und das Kind wählt, was ihm hilft. Bei „Wie geht's dir?“ zeigt das Kind sein eigenes Gefühl und wie doll es ist, und bei „Was brauche ich?“, was ihm jetzt guttut. Bei „Was ist passiert?“ weint, lacht oder erschrickt der kleine Bär, und das Kind tippt unter zwei Bildern an, was passiert ist.",
  },
  {
    path: "/spiele/buchstaben-zahlen/",
    title: "Buchstaben und Zahlen lernen – Tastatur-Spiele",
    description:
      "Frei tippen, Zählen, Mitmachen und Wörter tippen: Jede Taste zeigt ihren Buchstaben mit Bild und Stimme, Zahlen kommen zum Zählen und Hüpfen.",
    text: "Sechs Spiele auf der Tastatur oder dem Bildschirm: Frei tippen mit Buchstabe, Bild und Wort, Zählen mit Zahlen und Dingen, der Zähl-Turm, an dem ein Haus Klotz für Klotz wächst, Zehnerreihe auf Zehnerreihe, bis hundert, Mitmachen, bei dem ein Fuchs- oder Bärenkind jede Zahl hüpft, klatscht oder stampft, und Wörter tippen mit ersten Wörtern, Farben, Tu-Wörtern und „Wo ist das B?“, und „Wo ist das kleine b?“, bei dem ein großer Buchstabe unter drei kleinen sein Kind sucht.",
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
    text: "Wimmelbilder, die lebendig werden: Bagger baggern, Kühe muhen, das Feuerwehrauto fährt los. Über zwanzig Bilder für Kleinkinder liegen in diesem Buch – Baustelle, Bauernhof, Zoo und Feuerwache, Vertrautes wie Küche, Badezimmer, Supermarkt, Kita und Kinderarzt, Fernes wie Weltall, Unterwasser und Dinotal, dazu Winter, Herbst, Ostern und ein Gute-Nacht-Bild für den Abend. Über den Bildern wählen wir, wie gespielt wird. Beim „Freien Entdecken“ antwortet alles, was das Kind antippt, mit Bewegung und Geräusch, hinter mancher Tür schaut eine Überraschung hervor, und ist alles entdeckt, wird das Licht abendlich warm und alles Gefundene verbeugt sich nacheinander. Beim „Ausmalen“ bekommt das graue Bild Tupfer für Tupfer seine Farben zurück, bei „Suchen“ zeigt eine Blase, was gefunden werden will, und bei „Fragen“ geht es darum, was rot ist, was fliegen kann oder Räder hat. Beim Geräusch-Rätsel („Sounds“) ist nur ein Geräusch zu hören – ein Hund bellt, ein Bagger brummt –, und das Kind sucht, wer das war. Mit der „Taschenlampe“ leuchtet das Kind durch das dunkle Bild, und bei „Straßen“ malt es mit dem Finger einen Weg, auf dem Auto, Traktor oder Dampflok losfahren. Ab und zu fährt ein Fahrzeug sogar hinüber ins nächste Bild.",
  },
  {
    path: "/abenteuer/",
    title: "Bewegungsspiele für Kleinkinder drinnen",
    description:
      "Bewegungsabenteuer zum Mitmachen: Der Fuchs Tapsi zeigt Hüpfen, Strecken und Schleichen, das Kind macht vor dem Bildschirm mit. Ohne Werbung.",
    text: "Bewegungsgeschichten für drinnen, auf der Schatzinsel oder auf einer Reise mit der kleinen Wolke: Tapsi springt, duckt sich und streckt sich, das Kind macht mit, und die Welt antwortet. Ohne Lesen, Tapsi sagt alles. Auf der Schatzinsel, etwa sechs Minuten lang, winkt der Fuchs seinem Papagei, wirft die Angel aus, paddelt auf einer Schildkröte zum Strand, stampft, hüpft, trommelt, dreht an einer Kurbel und zieht am Seil, bis der Schlüssel die Schatztruhe öffnet und die Goldmünzen durch die Luft fliegen. Auf der Wolkenreise, etwa drei Minuten, flattert er mit den Armen, damit die Wolke steigt, duckt sich unter kleinen Flugzeugen, tippt Luftballons an, lehnt sich in die Kurven, schiebt die Regenwolke weg und malt mit großen Armbögen einen Regenbogen. Jede Bewegung macht Tapsi erst vor, eine dunkle Tanzfigur zeigt sie mit, und dann ist das Kind dran – eine Kamera braucht es dafür nicht. Ein Tippen aufs Bild macht Pause, und klein in der Ecke sehen wir Große, wie lange die Geschichte noch dauert.",
  },
  {
    path: "/gefuehle/",
    title: "Gefühle erklärt – Alltagssituationen für Kleinkinder",
    description:
      "Wütend, traurig, ängstlich, fröhlich: Der kleine Bär erlebt Alltagssituationen zu Hause und in der Kita, und das Kind wählt, was hilft. Ohne Werbung.",
    text: "Kleine Geschichten vom Bären, erzählt als Tage vom Morgen bis zum Abend: Er ist wütend, traurig, hat Angst oder freut sich, und das Kind wählt zwischen zwei Ideen, was hilft. Die Szenen gibt es auch nach Gefühlen geordnet. Unter den Bildern steht der ganze Text: Wer die Geschichte lieber selbst erzählt oder vorliest, schaltet die Stimme mit einem Tippen aus. Für Gespräche über Gefühle mit Kleinkindern.",
  },
  {
    path: "/wie-gehts-dir/",
    title: "Wie geht's dir? Gefühle zeigen für Kleinkinder",
    description: "Fröhlich, stolz, müde oder wütend: Das Kind tippt auf das Bild, das zu seinem Gefühl passt, und zeigt, wie doll es gerade ist. Ohne Werbung.",
    text: "Acht Gefühle in zwei Gruppen, die angenehmen und die unangenehmen, jedes mit dem kleinen Bären in einem Moment, den Kinder kennen. Das Kind tippt auf sein Gefühl, dann zeigen drei Bilder dasselbe Gefühl ein bisschen, schon ziemlich und ganz doll, und das Kind wählt, wie doll es gerade ist. Auf der Startseite steht auch „Was brauche ich?“: Dort zeigt das Kind mit einem Bild, was ihm jetzt guttut – in den Arm nehmen, allein sein, toben, trinken, essen, ausruhen, aufs Töpfchen, warm anziehen, ein Pflaster oder frische Luft. Ein Anfang für Gespräche über Gefühle.",
  },
  {
    path: "/was-ist-passiert/",
    title: "Was ist passiert? Gefühle verstehen für Kleinkinder",
    description: "Der kleine Bär weint, lacht oder erschrickt, und das Kind tippt, was passiert ist: Der Luftballon fliegt weg, Oma kommt. Ohne Werbung.",
    text: "Dreißig kleine Szenen mit dem kleinen Bären: Er ist traurig, wütend, hat Angst, freut sich, ist stolz oder findet etwas eklig. Zwei Bilder zeigen, was kurz davor passiert sein könnte – sein Eis fällt herunter, der Waschbär nimmt ihm die Schaufel weg, Papa kitzelt ihn –, und das Kind tippt das Bild, das passt. Darunter lesen Erwachsene, was sie das Kind fragen können und warum der Bär sich so fühlt. So sieht das Kind, dass Gefühle einen Grund haben – ein Anfang, um mit Kleinkindern über das Warum zu sprechen.",
  },
  {
    path: "/kettenreaktion/",
    title: "Kettenreaktion-Maschinen und Kugelbahn für Kinder",
    description:
      "Ein Tippen, und eine Minute lang stößt ein Ding das nächste an: Kugelbahnen und Kettenreaktionen zum Staunen, mit Pause jederzeit. Ohne Werbung.",
    text: "Einundzwanzig Bahnen und Maschinen, jede etwa eine Minute lang: Kugeln rollen über Holz, Schnee, Wasserrutschen und Förderbänder, kreiseln einen Wendelturm hinunter, fliegen über eine Sprungschanze, fahren mit dem Sessellift hinauf oder drehen sich im Strudel, und Alltagsdinge fallen um wie Dominosteine. In den Maschinen stößt ein Ding das nächste an: In der Küche knallt ein Korken aus der Flasche, im Badezimmer läuft die Waschmaschine davon, im Garten fährt ein Mähroboter los, im Zirkus klingelt der Hau-den-Lukas, und beim Raketenstart hüpft ein Weltraum-Känguru zum Funkmast. Auf der Farbenbahn sucht das Kind für jede Kugel Rot, Gelb oder Blau aus, und unten fällt sie in die Röhre ihrer Farbe und wird mitgezählt. Ein Tippen startet die Kettenreaktion, und dann läuft alles von selbst bis zum Ende: Das Kind darf mitmachen, muss aber nie wieder tippen. Mit dem Pausenknopf hält alles jederzeit an, und von dort geht es auch gleich zur nächsten Bahn. Am Ende zeigt ein Bild die nächste Bahn und ein runder Pfeil das Nochmal – so muss niemand lesen können, um weiterzuspielen.",
  },
  {
    path: "/kleine-abenteuer/",
    title: "Kleine Abenteuer – Bildergeschichten für Kleinkinder",
    description:
      "Kurze Bilder-Abenteuer für Kleinkinder: Aufzug fahren, Wege entlanglaufen und kleine Filme wie beim Bäcker. Jedes Tippen bringt die Geschichte weiter.",
    text: "Abenteuer von wenigen Minuten: mit dem Aufzug fahren und auf jedem Stockwerk etwas entdecken, einen Weg entlanglaufen – dem Ball, dem Drachen oder der kleinen Lok hinterher – und am Ende feiern, oder einen kleinen Film erleben: mit der Feuerwehr ausrücken, mit dem Krankenwagen zu einem gestürzten Bärenkind fahren und ein Pflaster aufkleben, einen Brief zu Oma bringen, mit dem Traktor Korn säen und es über die Mühle bis zum Bäcker begleiten, mit Bagger und Kran ein Haus bauen und einziehen, mit dem Müllauto die Tonne leeren und Glas, Papier und Plastik zum Wertstoffhof bringen, beim Bäcker Brötchen, eine Brezel oder einen Kuchen backen oder im Garten eine Sonnenblume, Karotten oder Erdbeeren säen, gießen und wachsen sehen. Unterwegs entscheidet das Kind mit.",
  },
  {
    path: "/tiere/",
    title: "Tiere füttern – Tierspiel für Kleinkinder",
    description:
      "Was gehört zum Tier? Was frisst es, was gibt es uns, wo wohnt es, und was wird aus der Raupe? Mit Tiergeräuschen, für Kleinkinder, ohne Werbung.",
    text: "Der Hase will eine Möhre, der Elefant Erdnüsse, die Kuh gibt uns Milch, der Biber sucht seine Burg, aus der Raupe wird ein Schmetterling und aus dem Samen eine Sonnenblume: Futter, Milch, Ei oder Zuhause antippen, und das Tier freut sich und macht sein Geräusch. Viele Tiere vom Bauernhof, aus Wald, Zoo und Meer. Und hinter einem kleinen Vorhang muht, bellt oder brüllt es: Wer war das? Das Spiel wird von selbst leichter oder schwerer.",
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
    text: "Die Socken purzeln aus der Waschmaschine. Gleiche Socken klingen gleich; ein Paar hüpft an die Wäscheleine. Erst wenige Paare in bunten Farben, dann mehr, mit Mustern und unter Wäschekörben wie bei Memory – sobald das Kind sicher wird. Danach kommen Fäustlinge, Gummistiefel und Bärenhausschuhe, je ein linker und ein rechter. Das Spiel fängt von selbst an: Die volle Maschine wäscht, die Tür geht auf, die Leine senkt sich, und die Socken liegen auf dem Boden. Tippt das Kind eine an, hebt sie sich und spielt ihren Ton, und findet es die zweite dazu, hängen beide mit Klammern an der Leine. Eine andere Socke ist nie falsch, dann hebt sich einfach die neue. Hängen alle Paare, hüpfen sie einmal vor Freude, die Leine wird aus dem Bild gezogen, und schon purzelt die nächste Wäsche heraus, so lange das Kind mag. Schwerer wird es nur in dem, was es zu sehen und zu merken gibt, nie durch eine Uhr: Aus zwei Paaren werden bis zu sechs, und später verrät nur noch das Muster, welche Socken zusammengehören.",
  },
  {
    path: "/drauflos/",
    title: "Zaubertasten – Tastatur-Spiel zum Draufhauen",
    description:
      "Jede Taste, jeder Tipp und jeder Klick bringt sofort etwas Buntes mit Ton: Buchstaben, Zahlen, Formen, Feuerwerk. Für Kleinkinder, ohne Werbung.",
    text: "Ein Spiel für die Kleinsten, die einfach auf die Tastatur hauen, mit der Maus klicken oder auf den Bildschirm patschen wollen: Was auch immer die kleine Hand trifft, sofort passiert etwas Buntes mit einem Ton, und nichts kann kaputtgehen. Es steht nicht in einem Buch, sondern als Plakat aus dem Spiel neben den Bilderbüchern im Regal und beginnt gleich nach dem Antippen. Drückt das Kind einen Buchstaben, springt er groß und bunt auf die Seite, mit einem hellen Ton, und die Stimme sagt ihn; eine Zahl kommt mit genauso vielen bunten Formen rundherum, drei Sterne um die Drei. Jede andere Taste und jeder Tipp oder Klick öffnet genau dort eine Überraschung: ein Feuerwerk, ein Geschenk, ein Ei, aus dem ein Tier schlüpft, ein Luftballon, der platzt, Seifenblasen, ein Schmetterling, ein Frosch, der hochspringt und quakt, ein Springteufel aus seiner Kiste, ein Fisch, der aus einer Pfütze hüpft, eine kleine Regenwolke – oder eine bunte Form wie ein Stern, ein Herz, ein Mond oder eine Blume, die mit einem Plopp erscheint. Am häufigsten kommt Feuerwerk, in vielen Arten – eine Rakete, die zu einem lachenden Gesicht zerplatzt, ein sich drehendes Feuerrad, ein Sternenknall, der zu Glitzer knistert –, und jeder Buchstabe und jede Zahl springt mit einem kleinen Funkenkranz aufs Blatt. Bewegt sich die Maus, zieht sie eine kurze Glitzerspur hinter sich her. Es gibt nichts zu finden und nichts falsch zu machen, keine Punkte und kein Ende. Wer schnell nacheinander drückt, sieht mehreres zugleich, jedes mit Platz neben dem anderen – und doch kommen nie zu viele Dinge auf einmal, und dieselbe Taste kommt erst nach einer kleinen Pause wieder. Am besten sitzt das Kind dabei auf dem Schoß eines Großen, der mitstaunt.",
  },
  {
    path: "/buchstaben/",
    title: "Frei tippen – Buchstaben lernen mit der Tastatur",
    description:
      "Das Kind haut auf irgendeine Taste, und sie zeigt ihren Buchstaben mit Bild und Stimme: B wie Bär. Ein Tastatur-Spiel für Babys und Kleinkinder, ohne Werbung.",
    text: "Ein Tastatur-Spiel für Babys und Kleinkinder, die am Computer oder Laptop einfach drauflos hauen wollen – am besten auf dem Schoß eines Großen: Welche Taste die kleine Hand auch trifft, es passiert etwas, und nichts ist falsch. Freies Tippen auf der Tastatur oder dem Bildschirm: Jeder Buchstabe kommt mit Bild und Wort, jede Zahl mit Dingen zum Zählen. Auf Wunsch große und kleine Buchstaben, Nachspuren mit dem Finger und Bilder zu einem Thema. Das Spiel beginnt sofort und kennt kein Falsch: Drückt das Kind das B, erscheint der Buchstabe groß auf einer Karte, daneben ein Bär mit seinem Wort, und die Stimme sagt „B wie Bär!“. Drückt es die Drei, liegen neben der Ziffer drei Dinge, zum Beispiel drei Äpfel. Jede andere Taste und jeder Tipp neben die Karte öffnet eine Überraschung: Feuerwerk in vielen Arten, eine Wunderkerze, die ein Herz malt, eine Sternschnuppe, eine Schneeflocke, einen Farbklecks, ein Windrad, einen hüpfenden Ball, ein Geschenk, ein Ei, aus dem ein Tier schlüpft, einen Luftballon, eine Blume, Seifenblasen, einen Schmetterling, einen Frosch, einen Springteufel, einen springenden Fisch oder eine Regenwolke – jedes Mal etwas anderes. Am Tablet stehen die Tasten als große Felder auf dem Bildschirm. Alles Weitere wartet hinter dem Zahnrad oben rechts, das wir Großen gedrückt halten, während das Spiel weiterläuft: ob die Dinge einer Zahl gleich dastehen oder vorgezählt werden, ob der Buchstabe aus Punkten zum Nachspuren erscheint und Sterne dem Finger folgen, und ob die Bilder bunt gemischt kommen oder aus einem Thema wie Tiere, Fahrzeuge, Essen oder Familie. Wer schon weiter ist, schaltet dort auch zweistellige Zahlen ein: Dann machen zwei Tasten eine Zahl, die Zwei und dann die Drei die 23, mit den Dingen in Zehnerreihen. Für den Abend gibt es dort auch eine dunkle Seite mit hellen Buchstaben auf Nachtfarben.",
  },
  {
    path: "/zaehlen/",
    title: "Zählen lernen – Zahlen-Spiel für Kleinkinder",
    description:
      "Jede Taste bringt eine Zahl mit so vielen Dingen zum Zählen: alles auf einmal, vorgezählt, Schritt für Schritt oder selbst gezählt. Ohne Werbung.",
    text: "Ein Zahlen-Spiel auf der Tastatur oder dem Bildschirm: Jede Ziffer zeigt sich mit so vielen Dingen, jede andere Taste bringt eine Zahl von 1 bis 9. Die Dinge kommen alle auf einmal, werden vorgezählt, kommen Schritt für Schritt, oder das Kind tippt jedes an und zählt selbst. Drückt es die Vier, liegen zum Beispiel vier Äpfel neben der großen Ziffer, und die Stimme sagt, wie viele es sind. Wie die Dinge kommen, wählen wir Großen hinter dem Zahnrad oben rechts, das wir gedrückt halten: Bei „Alles sofort“ sind sie gleich da, bei „Vorzählen“ erscheint eins nach dem anderen und wird laut mitgezählt, bei „Schritt für Schritt“ bringt jeder Tastendruck das nächste, und bei „Selbst zählen“ tippt das Kind jedes Ding an, bis am Ende die Ziffer dasteht. Wer mag, lässt die Ziffer erst kommen, wenn dieselbe Zahl gleich noch einmal gedrückt wird, damit zuerst die Menge zählt, oder lässt sie aus Punkten erscheinen, zum Nachspuren mit dem Finger. Für Größere gibt es zweistellige Zahlen: Dann machen zwei Tasten eine Zahl, die Zwei und dann die Drei die 23, und die Dinge liegen in Zehnerreihen, damit man die Zehner sieht. Am Tablet liegen die Zifferntasten groß auf dem Bildschirm. Oder umgekehrt, als „Wo ist die 3?“: Drei Äpfel erscheinen, und das Kind sucht selbst die Taste mit der passenden Zahl – erst bis drei, dann bis fünf und bis neun, sobald es sie sicher findet.",
  },
  {
    path: "/zaehlturm/",
    title: "Zähl-Turm – bis hundert zählen, Zehner für Zehner",
    description:
      "Ein Kran bringt Klotz für Klotz, zehn in jeder Reihe: Stockwerk um Stockwerk wächst ein Haus bis zur Hundert, und die Stimme zählt mit. Ohne Werbung.",
    text: "Ein Zahlen-Spiel zum Bauen, in einem Zug von 1 bis 100: Am Haken eines Krans schwebt ein großer Holzklotz mit einem Fragezeichen: Welche Zahl kommt jetzt? Tippt das Kind auf den Bildschirm oder drückt irgendeine Taste, senkt der Haken ihn an seinen Platz, erst dort zeigt er seine Zahl, das Fuchs- oder Bärenkind hüpft hinauf, und die Stimme zählt. Die Klötze liegen in Zehnerreihen über die ganze Breite des Bildschirms, von links nach rechts. Ist eine Reihe voll, gleitet ein bunter Holzbalken obendrauf, das Kind läuft zurück an den Anfang, und das Bild rollt nach oben wie in einem Jump-and-Run-Spiel: Darauf entstehen die nächsten zehn, 11 bis 20, 21 bis 30 und so weiter. So sieht man die Zehner ganz von selbst, denn jedes Stockwerk des Hauses ist ein Zehner. Jedes Stockwerk sieht anders aus, mit eigenen Farben und Mustern aus Ziegeln, Steinen, Brettern, Baumstämmen, Punkten, Sternen oder Glas, und kein Klotz sieht aus wie ein anderer: Jeder trägt rund um seine Zahl etwas Eigenes – Katzen- oder Hasenohren, Kopfhörer, eine Krone, Räder, Stacheln wie ein Igel, Blumen, Flügel, eine Fliege, eine Geburtstagskerze oder Wasser, in dem die Zahl schwimmt –, oft mit einem eigenen kleinen Klang. Die Zahl selbst steht auf jedem Klotz gleich groß und klar. Ein kleines Plus neben der nächsten Reihe legt für uns Große den Rest eines Zehners auf einmal hin, damit es gleich bei 11, 21 oder 31 weitergehen kann, und mit einem Wisch nach oben oder unten (oder dem Mausrad) schaut man sich die fertigen Stockwerke an. Während das Haus wächst, wird es am Himmel Abend und dann Nacht, und ganz oben steht der Mond. Bei 100 kommt das Dach darauf, aus dem Schornstein steigt Rauch, eine Fahne geht hoch, das Bild zoomt hinaus auf das ganze Haus aus hundert Klötzen, und es gibt einen Pokal. „Nochmal“ baut es wieder von 1 an. Wo das Kind aufgehört hat, bleibt für den nächsten Besuch gespeichert. Es gibt kein Falsch und keine Eile.",
  },
  {
    path: "/mitmachen/",
    title: "Zahlen zum Mitmachen – hüpfen, klatschen, stampfen",
    description: "Bei jeder Zahl hüpft, klatscht oder stampft ein Fuchs- oder Bärenkind genau so oft und zählt laut mit – das Kind macht mit. Ohne Werbung.",
    text: "Ein Zahlen-Spiel zum Mitbewegen: Jede Ziffer auf der Tastatur oder dem Bildschirm, jede andere Taste bringt eine Zahl von 1 bis 9. Ein Fuchs- oder Bärenkind lädt ein – „Hüpf mit!“ – und hüpft, klatscht oder stampft so oft, wie die Zahl sagt, und unter der Ziffer füllt sich für jedes Mal ein Zeichen. Jedes Mal wird laut mitgezählt und kurz gewartet, damit das Kind mitmachen kann. So wird die Zahl zur Menge im eigenen Körper.",
  },
  {
    path: "/woerter/",
    title: "Wörter tippen – erste Wörter für Kleinkinder",
    description:
      "Erste Wörter Buchstabe für Buchstabe tippen: Bär, Ball, Farben und Tu-Wörter. Oder „Wo ist das B?“ – die Taste zum Buchstaben finden. Ohne Werbung.",
    text: "Ein Bild und sein Wort: Das Kind tippt es Buchstabe für Buchstabe auf der Tastatur oder dem Bildschirm. Bildwörter, Farben, Tu-Wörter oder alles gemischt, in drei Längen. Oder nur der erste Buchstabe: „Wo ist das B?“ – die Taste dazu finden. Der Buchstabe, der dran ist, wartet unter dem Bild. Auf dem Tablet stehen statt der ganzen Tastatur ein paar große Tasten daneben: die richtige und zwei bis fünf andere, umso mehr, je sicherer das Kind sie findet, und nach ein paar Versuchen wird die richtige markiert. Jede richtige Taste setzt ihn ins Wort und nennt seinen Namen; eine andere Taste ist kein Fehler, und nach ein paar Versuchen sagt die Stimme den gesuchten Buchstaben noch einmal. Ist das Wort fertig, wird es gesagt und gelobt: Bei einem Farbwort nimmt der Bildschirm seine Farbe an, und ein Tu-Wort wie „Hüpf“ macht das Bild vor und lädt zum Mitmachen ein. Hinter dem Zahnrad, das wir Großen gedrückt halten, wählen wir die Art der Wörter, ihre Länge von höchstens drei, vier oder sieben Buchstaben und ob große, kleine oder beide Buchstaben zu sehen sind.",
  },
  {
    path: "/gross-klein/",
    title: "Wo ist das kleine b? – große und kleine Buchstaben",
    description: "Ein großer Buchstabe sucht sein Kind: Von drei kleinen Buchstaben gehört einer dazu und läuft zu ihm hinüber.",
    text: "Ein Buchstaben-Spiel über große und kleine Buchstaben: Ein großer Buchstabe sucht sein Kind. Unten stehen drei kleine Buchstaben, nur einer gehört zu ihm. Angetippt läuft er zum großen hinüber und stellt sich neben ihn; ein falscher schüttelt den Kopf. Erst sehen die drei ganz verschieden aus, später ähnlich, wie b, d und p. Das Spiel beginnt sofort, und einzustellen gibt es nichts: Tippt das Kind den passenden Buchstaben an oder drückt seine Taste, hüpft er in kleinen Sprüngen hinüber, und die Stimme nennt seinen Namen. Findet das Kind dreimal hintereinander gleich den richtigen, werden die drei einander ähnlicher, und nach einem Griff daneben sind sie wieder deutlich verschieden – so bleibt es weder zu leicht noch zu schwer. Die Buchstaben sind schlicht gezeichnet, ohne Augen und Gesichter, damit der Blick auf ihrer Form bleibt. Nebenbei merkt das Kind, dass das große A und das kleine a zusammengehören.",
  },
  {
    path: "/haende-waschen/",
    title: "Hände waschen für Kinder – Schritt für Schritt",
    description:
      "Händewaschen zum Mitmachen: Ärmel hoch, Wasser, Seife, fünfmal reiben, und die Schmutzmonster lösen sich im Schaum auf. Für Kleinkinder am Waschbecken.",
    text: "Ein Begleiter fürs Händewaschen, etwa vierzig Sekunden lang, der ganz von selbst im Takt läuft, während das Kind am echten Waschbecken mitwäscht. Das Bild zeigt die eigenen Hände von oben, so wie das Kind sie sieht: Erst werden die Ärmel hochgeschoben, dann geht das Wasser an, die Hände werden nass, und eine Hand holt Seife aus dem Spender. Danach wird gerieben, wie es in der Kita gelernt wird – Handflächen, Handrücken, zwischen den Fingern, die Daumen und die Fingerspitzen –, und bei jedem Schritt löst sich ein kleines Schmutzmonster im Schaum auf: Matsch, Gras, Farbe, Marmelade, Sand und Kakao. Zusammen dauert das Reiben gut zwanzig Sekunden, so lange, wie Händewaschen dauern soll. Dann wird abgespült, das Wasser geht aus, ein weiches Handtuch trocknet ab, und die sauberen Hände glänzen. Morgens trägt das Kind sein T-Shirt, abends den Schlafanzug. Ein Tippen aufs Bild lässt ein Monster kichern, und über die Leiste unten halten Große an oder springen zu jedem Schritt.",
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
      "Belohnungstafel für Kleinkinder gestalten: Tag, Woche, Monat oder Sterne sammeln, mit Bildern und Belohnung. Am Tablet, auf A4 zum Ausmalen oder als Fotoposter.",
    text: "Eine Belohnungstafel für Kleinkinder, frei einstellbar: Wochentafel mit Aufgaben und Tagen, Monatstafel als Kalender, Tagestafel für Morgen oder Abend, oder Sterne sammeln, für jede Aufgabe auf einem eigenen Weg zu ihrer Belohnung. Aufgaben als Bilder (Zähne putzen, Töpfchen, Anziehen, im eigenen Bett schlafen …), der Name des Kindes und eine Belohnung, am liebsten Zeit zusammen. Ein Assistent führt Schritt für Schritt zur eigenen Tafel und zeigt jede Wahl als Bild. Am Tablet hält ein Erwachsener ein Feld gedrückt und das Kind tippt den Stern hinein; zum Ausdrucken als A4 quer oder hochkant, mit Feldern zum Ausmalen und Sternen zum Ausschneiden. Gedruckt wird in Farbe oder schwarz-weiß, und schwarz-weiß ist mehr als ein grauer Ausdruck: Jedes Bild der Tafel ist dafür noch einmal als Ausmalbild gezeichnet, mit klaren, dicken Linien. Das spart Tinte, und das Kind malt seine Tafel selbst bunt. Wer mag, legt ein Foto des Kindes mit auf die Tafel, oben links, oben rechts oder neben die Überschrift – es bleibt nur auf diesem Gerät und wird nie gesendet. Keine Strafen, nichts wird weggenommen. Oder die ganze Tafel als Fotoposter: ein Bild in 20 × 30, 30 × 40 oder 40 × 60 cm, mit einem Rahmen fürs ganze Jahr oder für Ostern, Geburtstag, Herbst und Advent, das jede Drogerie auf Fotopapier belichtet – fest und abwischbar, hinter einem Bilderrahmen mit Glas hakt man mit einem Whiteboard-Stift ab, und auf 40 × 60 cm passen Tagesplan und Tafel übereinander. Auf derselben Seite: ein Tagesplan in Bildern und der Countdown „Wie oft noch schlafen?“. Und statt eines Bildes kann eine Aufgabe ein eigenes Foto bekommen – vom eigenen Töpfchen, der Zahnbürste oder der Kita-Tür, das erkennt ein kleines Kind am besten; auch das bleibt nur auf diesem Gerät.",
  },
  {
    path: "/timer/",
    title: "Visueller Timer für Kinder – Zeitscheibe und Sanduhr",
    description:
      "Ein Timer ohne Zahlen für Kleinkinder: Die rote Scheibe schrumpft, Sand rinnt, Kerzen brennen, bis zu vier Kinder wechseln sich ab. 10 Sekunden bis 3 Stunden.",
    text: "Ein visueller Timer für Kinder, die noch keine Uhr lesen – einer unserer Alltagshelfer. Ein Erwachsener stellt 10 oder 30 Sekunden oder 1 bis 10 Minuten ein, jede andere Zeit bis zu drei Stunden oder eine Uhrzeit, bis zu der es dauert, und das Kind sieht die Zeit vergehen: Die rote Scheibe, wie Kinder sie aus der Kita kennen, wird kleiner, Sand rinnt durch eine große Sanduhr, sechs Kerzen brennen nacheinander herunter, und jede zündet über eine Zündschnur die nächste an, ein Apfelbaum wächst, blüht und trägt Äpfel, eine Pizza wird Stück für Stück gegessen, ein Kinderwecker zählt herunter, ein Spielzeugkran räumt die Spielsachen eins nach dem anderen in die Kiste, Spielsachen hüpfen Sorte für Sorte in fünf bunte Kisten, deren Deckel nacheinander zuklappen, der Strahl eines schwebenden Kristalls trägt wie in einem Bauspiel einen Klotz nach dem anderen aus einem Durcheinander langsam an seinen Platz in einem Klötzchenhaus, bis drinnen das Licht angeht, eine Spitzhacke gräbt Klotz für Klotz einen Tunnel durch einen Klötzchenberg, bis die Schatzkiste am Ende aufgeht, ein kleiner Fuchs schwimmt mit Schnorchel und Meerjungfrauenflosse aus einem See nach oben, läuft über die Wiese, hüpft federnd auf Holzstufen den Baumstamm hinauf ins Baumhaus, fährt mit einer Seilbahn zum Fenster eines Hochhauses, saust im gläsernen Aufzug aufs Dach, schwebt mit Luftballons an den Wolken vorbei, holt sich auf der höchsten Wolke einen Raketenrucksack und fliegt damit einmal um den Mond, bevor er darauf landet – das Bild wandert dabei mit ihm nach oben, Vögel, Wind und Fische ziehen vorbei, und er fängt Stern für Stern –, und am Ende schwebt er am Fallschirm hin und her schaukelnd an allem vorbei wieder hinunter und plumpst mitten in eine Torte, die nach allen Seiten zerspritzt, bunte Murmeln hüpfen wie auf einem Nagelbrett von Nagel zu Nagel und füllen Reihe für Reihe ein großes Glas, ein Zug rollt zum Bahnhof, eine Raupe frisst ihr Blatt, eine Blume wächst und blüht, oder die Sonne geht auf. Tippt das Kind aufs Bild, leuchtet kurz auf, was noch bleibt, und klein in der Ecke steht für uns Große die restliche Zeit, und ist sie um, blinkt dort rot 0:00. Eine Leiste ganz unten füllt sich dazu bis zu einem kleinen Fähnchen, und in den letzten Sekunden sammelt sich ein warmes Licht vom Rand her, während leise, steigende Töne bis zum Ende zählen. Zum Abwechseln unter Geschwistern steht die Sanduhr zwischen zwei Kissen: Eine Lampe zeigt, wer dran ist, das Spielzeug liegt dort, bis der Sand durch ist, dann hüpft es hinüber, und die Sanduhr dreht sich von selbst um. Oder sie wippen: Ein Küken läuft über das Brett, und der Sitz, zu dem es geht, sinkt ganz langsam, bis er unten aufsetzt, und das wartende Kind sieht dabei seinen eigenen Sitz nach oben steigen. Oder zwei bis vier Kinder wechseln sich an einer Kugelbahn ab: Die ganze Runde lang rollt eine Murmel die Zickzack-Bahn hinunter in den Becher des Kindes, das als Nächstes dran ist, der Platz des Kindes, das gerade dran ist, liegt im warmen Licht, die anderen warten im Schatten, und in jedem Becher bleibt eine Murmel liegen, bis alle einmal dran waren. Oder Fuchskind und Bärenkind fahren abwechselnd ein Kart über eine Rennstrecke in Form einer Acht, mit Brücke, Tribünen und Startampel: Wer dran ist, fährt eine ganze Runde, so lange wie eingestellt, die gefahrene Strecke färbt sich in seiner Farbe, und an der Ziellinie steigt es aus und das andere Kind hüpft hinein. Ist die Zeit um, färbt sich das ganze Bild golden und ein leuchtender Rahmen kommt ringsum, so dass man es auch von weitem sieht, und es klingen ein Jubel und eine fröhliche Melodie. Ein Knopf am Anfang der Leiste oder ein Tippen aufs Bild hält den Timer an, etwa wenn es an der Tür klingelt, und von dort läuft er weiter oder beginnt von vorn. Für „noch fünf Minuten spielen“, das Warten aufs Essen oder fürs Aufräumen; der Bildschirm bleibt dabei an, und der Timer läuft auch, wenn die Spielzeit vorbei ist.",
  },
  {
    path: "/tagesplan/",
    title: "Tagesplan für Kinder – Tag und Woche in Bildern",
    description:
      "Tagesablauf, Morgen- und Abendroutine oder Wochenplan für Kleinkinder in Bildern: das Kind tippt ab, was geschafft ist. Bildkarten zum Drucken und Ausmalen.",
    text: "Ein Tagesplan in Bildern (Strukturtafel) für Kleinkinder: die Schritte des Tages als große Bildkarten – was jetzt dran ist, leuchtet, das Kind tippt es ab, wenn es geschafft ist, und die nächste Karte leuchtet. Vorlagen für die Morgenroutine, die Abendroutine, einen Tagesablauf mit Kita und eine Erst-dann-Tafel; ein Wochenplan zeigt, was an welchem Tag ist, mit Monden für jedes Mal Schlafen bis dahin. Dazu Karten mit Worten für uns Eltern – Mutmach-Sätze am Morgen, Erzählen nach der Kita, Gute-Nacht-Sätze –, und die Zahnputz-Karte startet gleich das Zähneputzen mit Lied. Ein Assistent führt in Bildern zum eigenen Plan, und zum Ausdrucken gibt es A4 mit allen Bildern als Karten zum Ausschneiden für eine Klett-Tafel – in Farbe oder schwarz-weiß, wo jede Karte als Ausmalbild mit klaren Linien gezeichnet ist, damit das Kind seinen Plan selbst ausmalt. Auch ein Foto des Kindes kann mit auf den Plan, oben links, oben rechts oder neben die Überschrift – es bleibt nur auf diesem Gerät und wird nie gesendet. Oder der ganze Plan fest auf einem Bild, nichts zu schneiden: als Fotoposter in 20 × 30, 30 × 40 oder 40 × 60 cm, ein ganzer Tag in einer Reihe auch als Panorama 30 × 90 cm, mit einem Rahmen nach der Jahreszeit; eine Wäscheklammer am Rand zeigt, was jetzt dran ist. Auf derselben Seite: eine Belohnungstafel zum Sterne sammeln und der Countdown „Wie oft noch schlafen?“. Und statt eines Bildes kann eine Karte ein eigenes Foto bekommen – vom eigenen Töpfchen, der Zahnbürste oder der Kita-Tür, das erkennt ein kleines Kind am besten; auch das bleibt nur auf diesem Gerät.",
  },
  {
    path: "/wie-lange-warten/",
    title: "Countdown für Kinder – Wie oft noch schlafen?",
    description:
      "Bis zum Geburtstag, zum Urlaub oder bis Oma kommt: ein Feld mit dem schlafenden Fuchs- oder Bärenkind für jede Nacht – jeden Morgen kommt ein Stern hinein.",
    text: "Kleine Kinder verstehen „in fünf Tagen“ noch nicht, aber „noch fünfmal schlafen“ schon – und darum zählt dieser Countdown in Nächten. Für jede Nacht bis zum großen Tag steht ein Feld mit einem Bild darin, das Fuchs- oder Bärenkind schläft in seinem Bett, und darunter ein Kreis wie auf der Belohnungstafel. Daneben wartet das Bild vom Tag selbst: Geburtstag, Urlaub, Oma und Opa, der erste Kita-Tag. Jeden Morgen leuchtet das Feld der vergangenen Nacht, das Kind tippt es an, der Hahn kräht, und ein Stern landet im Kreis. So werden die Sterne mehr und die Nächte bis zum großen Tag weniger, bis das Bild groß dasteht. Wir stellen den Tag und das Bild ein, tippen auf ＋ für eine Nacht mehr und auf den Papierkorb für eine weniger, und wer mag, druckt die Nächte aus – in Farbe oder zum Ausmalen – und klebt jeden Morgen einen Sticker in den Kreis. Auch als Fotoposter, quadratisch 30 × 30 cm: einmal bestellt, hängt es fest an der Tür, und die Sterne kommen als Sticker darauf. Im selben Regalfach: die Belohnungstafel und der Tagesplan in Bildern.",
  },
  {
    path: "/schnullerfee/",
    title: "Schnullerfee – Schnuller abgewöhnen mit Geschichte",
    description:
      "Eine Vorlesegeschichte in Kapiteln: Tapsi der Fuchs sammelt seine drei Schnuller ein, und nachts tauscht die Schnullerfee sie gegen ein Geschenk.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, wenn der Schnuller gehen soll. Tapsi der Fuchs hat drei Schnuller, einen roten, einen blauen und einen gelben, und mit Schnuller im Mund versteht Mama nur „Mmm-mmm“. Mama und Papa erzählen von der Schnullerfee, die die Schnuller zu den kleinen Babys bringt. Erst wohnt der Schnuller nur noch im Bett und darf nur zum Einschlafen in den Mund. Dann sagt Tapsi selbst, dass die Fee kommen darf, Papa klebt drei Sterne ans Fenster, und jeden Morgen nimmt Tapsi einen ab. Am großen Tag sucht Tapsi alle Schnuller zusammen, legt sie in eine Schachtel, gibt jedem einen Abschiedskuss und stellt sie mit einem gemalten Bild aufs Fensterbrett. Die erste Nacht ist schwer, Tapsi weint, und Mama und Papa bleiben da, trösten und singen. Nachts fliegt die Schnullerfee herein, nimmt die Schachtel und legt ein Geschenk hin: einen Kuschelhasen, der jetzt beim Einschlafen hilft. Tapsi darf den Schnuller vermissen und traurig sein, und Mama und Papa haben Tapsi lieb, mit Schnuller und ohne. Das Buch beginnt mit einer Wahl: diese Geschichte ganz oder als Kurzfassung oder eine zweite Geschichte ohne Fee, in der Tapsi die Schnuller an den Schnullerbaum im Park hängt, auch sie ganz oder kurz; bei jeder steht, wie viele Bilder sie hat und wie lange sie ungefähr dauert, und gelesen wird immer von vorn; unter jedem Bild steht der Satz zum Vorlesen, und jedes Tippen blättert weiter.",
  },
  {
    path: "/schnullerfee/kurz/",
    title: "Schnullerfee kurz erzählt – die Kurzfassung",
    description:
      "Die Kurzfassung der Schnullerfee-Geschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs, nur das Wichtigste – in wenigen Minuten gelesen.",
    text: "Die Kurzfassung von „Tapsi und die Schnullerfee“, für Abende, an denen die ganze Geschichte zu lang ist, oder für ein Kind, das sie schon kennt. Sie erzählt dieselbe Geschichte mit denselben Bildern, nur das Wichtigste: Tapsi der Fuchs hat als Baby mit dem Schnuller getröstet und eingeschlafen und ist jetzt groß. Mama und Papa erzählen von der Schnullerfee, die die Schnuller zu den kleinen Babys bringt und dafür ein Geschenk dalässt, und Tapsi sagt selbst, dass sie kommen darf. Die drei Schnuller kommen in eine Schachtel, jeder bekommt einen Abschiedskuss, und die Schachtel steht mit einem gemalten Bild auf dem Fensterbrett. Die erste Nacht ist schwer, Tapsi weint, und Mama bleibt da. Nachts holt die Fee die Schachtel, am Morgen liegt ein Kuschelhase da, und jeden Abend geht das Einschlafen ein bisschen leichter. Mama und Papa haben Tapsi lieb, mit Schnuller und ohne. Unter jedem Bild steht ein kurzer Satz zum Vorlesen, jedes Tippen blättert weiter, und im Buch „Schnullerfee“ steht sie neben der ganzen Geschichte, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer.",
  },
  {
    path: "/schnullerfee/baum/",
    title: "Schnullerbaum – Schnuller abgewöhnen ohne Fee",
    description: "Eine Vorlesegeschichte ohne Fee: Tapsi der Fuchs bindet seine drei Schnuller an den Schnullerbaum im Park und sagt Tschüss – ganz oder kurz.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, für Familien, die den Schnuller ohne Fee verabschieden möchten. Tapsi der Fuchs hat drei Schnuller, einen roten, einen blauen und einen gelben. Papa zeigt Tapsi ein Buch mit dem Schnullerbaum, an den Kinder ihre Schnuller hängen, um Tschüss zu sagen. Tapsi will die Schnuller erst nicht hergeben und darf traurig sein. Am Tag bleiben die Schnuller nun im Bett, und Tapsi sucht selbst aus, wann es zum Baum geht, und für jeden Schnuller ein Band. Im Park hebt Papa Tapsi hoch, Tapsi bindet die Schnuller an einen Ast und winkt ihnen zu. In der ersten Nacht weint Tapsi, Mama hält Tapsi, Papa singt, und am Morgen ist Tapsi stolz. Beim Spaziergang besucht Tapsi die Schnuller im Baum. Kürzer als die Geschichte von der Schnullerfee, und auch als Kurzfassung in wenigen Minuten gelesen.",
  },
  {
    path: "/schnullerfee/baum/kurz/",
    title: "Schnullerbaum kurz erzählt – die Kurzfassung",
    description:
      "Die Kurzfassung der Schnullerbaum-Geschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs, nur das Wichtigste – in drei Minuten gelesen.",
    text: "Die Kurzfassung von „Tapsi und der Schnullerbaum“, für Abende, an denen es schnell gehen soll, oder für ein Kind, das die Geschichte schon kennt. Mit denselben Bildern erzählt sie das Wichtigste: Tapsi der Fuchs hat drei Schnuller, Papa zeigt im Buch den Schnullerbaum, und Tapsi sucht selbst aus, wann es dorthin geht. Im Park bindet Tapsi die Schnuller an einen Ast und sagt Tschüss. In der ersten Nacht weint Tapsi und wird gehalten, am Morgen ist Tapsi stolz, und Mama und Papa haben Tapsi lieb, mit Schnuller und ohne.",
  },
  {
    path: "/kita/",
    title: "Kita-Eingewöhnung und Abschied – eine Geschichte",
    description:
      "Eine Vorlesegeschichte in Kapiteln für die Kita-Eingewöhnung und den Abschied am Morgen: Tapsi der Fuchs kommt in die Kita, und Mama kommt immer wieder.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, wenn die Kita beginnt oder der Abschied am Morgen schwerfällt. Mama und Papa erzählen Tapsi dem Fuchs von der Kita, Papa und Tapsi schauen sie sich von außen an, und zusammen packen sie den Rucksack mit Hausschuhen und dem Kuschelhasen. In den ersten Tagen bleibt Mama mit in der Kita, auf einem kleinen Stuhl, während Tapsi Mia kennenlernt, die Erzieherin, und mit Bruno spielt. Dann geht Mama zum ersten Mal kurz hinaus und sagt vorher, dass sie wiederkommt; Tapsi weint, Mia tröstet, und Mama ist bald wieder da. Mia hilft beim Frühstück und pustet aufs Knie, und jeden Tag bleibt Mama etwas länger weg. Ein Kapitel ist das Abschiedsritual, das man jeden Morgen lesen kann: Jacke an den Haken mit dem Stern, einmal fest drücken, ein Kuss auf die Nase, „Ich hole dich nach dem Mittagsschlaf ab“ und Winken am Fenster – Mama schleicht sich nie weg. Dann Tapsis Tag mit Morgenkreis, Turmbauen, Sandkasten, Mittagessen und Mittagsschlaf, und genau danach steht Mama in der Tür. Das Buch beginnt mit einer Wahl: diese Geschichte ganz oder als Kurzfassung oder eine zweite Geschichte über die Eingewöhnung bei einer Tagesmutter, bei Lotta in ihrer Wohnung, auch sie ganz oder kurz; bei jeder steht, wie viele Bilder sie hat und wie lange sie ungefähr dauert, und gelesen wird immer von vorn; unter jedem Bild steht der Satz zum Vorlesen, und jedes Tippen blättert weiter. Nach dem Berliner Eingewöhnungsmodell.",
  },
  {
    path: "/kita/kurz/",
    title: "Kita-Eingewöhnung kurz erzählt – die Kurzfassung",
    description:
      "Die Kurzfassung der Kita-Geschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs, nur das Wichtigste – gut für jeden Morgen vor der Kita.",
    text: "Die Kurzfassung von „Tapsi geht in die Kita“, für Morgen und Abende, an denen die ganze Geschichte zu lang ist, oder für ein Kind, das sie schon kennt. Sie erzählt dieselbe Geschichte mit denselben Bildern, nur das Wichtigste: Mama und Papa erzählen Tapsi dem Fuchs von der Kita, und zusammen packen sie den Rucksack mit dem Kuschelhasen. Am ersten Tag bleibt Mama auf einem kleinen Stuhl dabei, während Tapsi Mia kennenlernt, die Erzieherin. Dann geht Mama kurz hinaus und sagt vorher, dass sie wiederkommt; Tapsi weint, Mia tröstet, und Mama ist wieder da, genau wie sie gesagt hat. Jeden Tag bleibt Mama etwas länger weg, und jeden Morgen ist der Abschied gleich: derselbe Weg, ein Kuss auf die Nase, „Ich hole dich nach dem Mittagsschlaf ab“, Mias Hand und Winken am Fenster – Mama schleicht sich nie weg. Nach dem Mittagsschlaf steht Mama in der Tür, wie sie gesagt hat. Unter jedem Bild steht ein kurzer Satz zum Vorlesen, jedes Tippen blättert weiter, und im Buch „Kita-Start“ steht sie neben der ganzen Geschichte, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer.",
  },
  {
    path: "/kita/tagesmutter/",
    title: "Eingewöhnung bei der Tagesmutter – eine Geschichte",
    description:
      "Eine Vorlesegeschichte für die Eingewöhnung in der Kindertagespflege: Tapsi der Fuchs geht zu Lotta, der Tagesmutter, und Mama kommt immer wieder.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, wenn das Kind zu einer Tagesmutter kommt oder der Abschied am Morgen schwerfällt. Mama und Papa erzählen Tapsi dem Fuchs von Lotta, die in ihrer Wohnung auf ein paar Kinder aufpasst, Papa und Tapsi besuchen sie, und zusammen packen sie den Rucksack mit Hausschuhen, Wechselsachen und dem Kuschelhasen. Am ersten Tag sitzt Mama auf Lottas Sofa, Tapsi auf ihrem Schoß, und dann klettert Tapsi hinunter und spielt mit Emil Eisenbahn. Ein paar Tage später sagt Mama: „Ich gehe kurz hinaus, dann komme ich wieder.“ Tapsi weint, Lotta nimmt Tapsi in den Arm, und Mama ist wieder da, wie sie gesagt hat. Lotta hilft beim Apfel am großen Küchentisch und bleibt nah, wenn Tapsi traurig ist, und Mama bleibt jeden Tag etwas länger weg. Ein Kapitel ist das Abschiedsritual für jeden Morgen: derselbe Weg zu Lottas Tür, die Jacke an den Haken mit dem Marienkäfer, einmal fest drücken, ein Kuss auf die Nase, „Ich hole dich nach dem Mittagsschlaf ab“, Lottas Hand und Winken am Küchenfenster – Mama schleicht sich nie weg. Dann Tapsis Tag: mit dem Bollerwagen zum Spielplatz, Sandkasten, Nudeln am Küchentisch und Mittagsschlaf in einem kleinen Bett bei Lotta, und genau danach steht Mama da. Im Buch „Kita-Start“ steht sie neben der Geschichte von der Kita, ganz und als Kurzfassung, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer.",
  },
  {
    path: "/kita/tagesmutter/kurz/",
    title: "Eingewöhnung bei der Tagesmutter – die Kurzfassung",
    description:
      "Die Kurzfassung der Tagesmutter-Geschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs bei Lotta, nur das Wichtigste – gut für jeden Morgen.",
    text: "Die Kurzfassung von „Tapsi geht zu Lotta“, für Morgen und Abende, an denen die ganze Geschichte zu lang ist, oder für ein Kind, das sie schon kennt. Mit denselben Bildern erzählt sie das Wichtigste: Mama und Papa erzählen Tapsi dem Fuchs von Lotta, der Tagesmutter, die in ihrer Wohnung auf ein paar Kinder aufpasst. Am ersten Tag kommt Mama mit und sitzt auf Lottas Sofa. Ein paar Tage später geht Mama kurz hinaus und sagt vorher, dass sie wiederkommt; Tapsi weint, Lotta tröstet, und Mama ist wieder da. Bald hilft Lotta am großen Küchentisch, und jeden Morgen ist der Abschied gleich: ein Kuss auf die Nase, „Ich hole dich nach dem Mittagsschlaf ab“ und Winken am Küchenfenster. Nach dem Mittagsschlaf bei Lotta steht Mama da, wie sie gesagt hat, und Mama und Papa haben Tapsi lieb, zu Hause und bei Lotta. Unter jedem Bild steht ein kurzer Satz zum Vorlesen, und jedes Tippen blättert weiter.",
  },
  {
    path: "/haare-waschen/",
    title: "Haare waschen ohne Tränen – eine Geschichte",
    description:
      "Eine Vorlesegeschichte in Kapiteln fürs Haarewaschen: Tapsi der Fuchs hält den Waschlappen selbst, sagt „Jetzt!“ und bekommt eine Schaumkrone.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, wenn Haarewaschen Tränen bringt oder Angst macht. Tapsi der Fuchs hat Brei und Sand in den Haaren, und Mama sagt vorher, was heute kommt: erst Wasser, dann Schaum, dann wieder Wasser, und danach das warme Handtuch – nicht jeden Abend, nur heute. Tapsi mag kein Wasser in den Augen, und Mama hört zu. Zuerst wäscht Tapsi dem Kuschelhasen die Haare, mit leerem Becher, und dann Mama mit echtem Wasser. Tapsi sucht den roten Becher und das Apfel-Shampoo aus, fühlt, ob das Wasser warm ist, und hält den Waschlappen selbst vor die Augen. In der Wanne geht der Kopf in den Nacken, die Augen schauen hoch zur Sonne an der Decke, Mama formt eine Schaumkrone für den Handspiegel, und wenn Tapsi „Jetzt!“ sagt, zählt Mama bis drei und spült hinten herunter. Einmal läuft doch ein Tropfen ins Auge: Mama hört sofort auf, trocknet das Gesicht und tröstet, und Tapsi entscheidet, wie es weitergeht. Dann das warme Handtuch, Papa rubbelt die Haare trocken und sagt, was Tapsi selbst geschafft hat. Das Buch beginnt mit einer Wahl: diese Geschichte ganz oder als Kurzfassung oder eine zweite Geschichte unter der Dusche, in der Tapsi auf der Matte sitzt und das Wasser warm und von unten kommt, auch sie ganz oder kurz; bei jeder steht, wie viele Bilder sie hat und wie lange sie ungefähr dauert, und gelesen wird immer von vorn; unter jedem Bild steht der Satz zum Vorlesen, und jedes Tippen blättert weiter.",
  },
  {
    path: "/haare-waschen/kurz/",
    title: "Haare waschen ohne Tränen – die Kurzfassung",
    description:
      "Die Kurzfassung der Haarewasch-Geschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs, nur das Wichtigste – kurz vor dem Baden gelesen.",
    text: "Die Kurzfassung von „Tapsi und die Schaumkrone“, für Abende, an denen die ganze Geschichte vor dem Baden zu lang ist, oder für ein Kind, das sie schon kennt. Sie erzählt dieselbe Geschichte mit denselben Bildern, nur das Wichtigste: Tapsi der Fuchs hat Brei und Sand in den Haaren, und Mama sagt vorher, dass heute Haarewaschen ist. Tapsi mag kein Wasser in den Augen, und Mama hört zu. Erst wäscht Tapsi dem Kuschelhasen die Haare, dann gießt Mama in der Wanne langsam warmes Wasser hinten herunter, Tapsi reibt den Schaum selbst ein und sieht im Spiegel eine Schaumkrone. Mit dem Waschlappen vor den Augen sagt Tapsi „Jetzt!“, Mama zählt bis drei und spült, und die Augen bleiben trocken. Läuft doch einmal ein Tropfen ins Auge, hört Mama sofort auf und tröstet. Dann kommt das warme Handtuch, und Mama und Papa haben Tapsi lieb, mit klebrigen Haaren und mit sauberen. Unter jedem Bild steht ein kurzer Satz zum Vorlesen, jedes Tippen blättert weiter, und im Buch „Haare waschen“ steht sie neben der ganzen Geschichte, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer.",
  },
  {
    path: "/haare-waschen/dusche/",
    title: "Haare waschen unter der Dusche – eine Geschichte",
    description:
      "Eine Vorlesegeschichte fürs Haarewaschen ohne Badewanne: Tapsi der Fuchs sitzt in der Dusche, der Regen kommt tief von unten, die Augen bleiben trocken.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, für Familien mit Dusche und ohne Badewanne, wenn Haarewaschen Tränen bringt oder Angst macht. Tapsi der Fuchs hat Sand in den Haaren, und Papa sagt vorher, was kommt: heute Abend unter der Dusche, erst die Füße, dann die Haare. Tapsi findet die Dusche laut und mag keinen Regen in den Augen, und Papa hört zu: Der Regen wird sanft und kommt tief unten, und Tapsi sagt, wann. Zuerst spielt Tapsi mit dem Kuschelhasen und einer leeren Gießkanne Duschen und lässt es dann auf Papas Füße regnen. In der Dusche sitzt Tapsi auf einer weichen Matte am Boden, Papa kniet direkt daneben, und der warme Regen kommt zuerst auf die Zehen, dann hält Tapsi die Brause selbst. Kopf nach hinten, die Augen schauen hoch zum Fisch auf den Fliesen, Tapsi reibt den Schaum zu Igelstacheln, hält den Waschlappen vor die Augen und sagt „Jetzt!“, und Papa spült von hinten, nie von oben. Spritzt doch einmal Wasser ins Gesicht, dreht Papa sofort ab, tröstet, und Tapsi wählt: weiter mit der Dusche oder mit dem Becher. Dann das warme Handtuch. Im Buch „Haare waschen“ steht sie neben der Geschichte in der Badewanne, ganz und als Kurzfassung, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer.",
  },
  {
    path: "/haare-waschen/dusche/kurz/",
    title: "Haare waschen unter der Dusche – die Kurzfassung",
    description:
      "Die Kurzfassung der Dusch-Geschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs unter der Dusche, nur das Wichtigste – kurz vorher gelesen.",
    text: "Die Kurzfassung von „Tapsi und der warme Regen“, für Abende, an denen die ganze Geschichte vor dem Duschen zu lang ist, oder für ein Kind, das sie schon kennt. Mit denselben Bildern erzählt sie das Wichtigste: Tapsi der Fuchs hat Sand in den Haaren, Papa sagt vorher, dass heute unter der Dusche Haare gewaschen werden, und hört zu, als Tapsi sagt, dass die Dusche laut ist. In der Dusche kommt der warme Regen tief unten zuerst auf die Zehen, Tapsi legt den Kopf zurück und schaut zum Fisch auf den Fliesen, wird mit dem Schaum zum kleinen Igel, sagt mit dem Waschlappen vor den Augen „Jetzt!“, und Papa spült von hinten. Spritzt doch Wasser ins Gesicht, dreht Papa sofort ab und tröstet. Mama und Papa haben Tapsi lieb, mit Sand in den Haaren und mit sauberen. Unter jedem Bild steht ein kurzer Satz zum Vorlesen, und jedes Tippen blättert weiter.",
  },
  {
    path: "/flaeschchen/",
    title: "Fläschchen abgewöhnen – „Tschüss, Fläschchen!“",
    description:
      "Eine Vorlesegeschichte in Kapiteln vom Fläschchen zum Becher: Tapsi der Fuchs sucht sich einen Becher aus, und die Flasche sagt nach und nach Tschüss.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, wenn das Fläschchen gehen soll – für jedes Kind, das aus der Flasche trinkt, ob gestillt oder nicht. Als Baby hat Tapsi der Fuchs in Papas Arm aus der Flasche getrunken, jetzt ist Tapsi groß, und Mama erzählt, dass die Flasche nach und nach Tschüss sagt, nicht alles auf einmal. Tapsi sucht sich einen grünen Becher ohne Deckel aus, übt mit Wasser, kleckert – das ist in Ordnung – und gibt auch dem Kuschelhasen einen Schluck. Zuerst geht die Flasche am Tag: Sie ruht im Schrank, die Milch kommt zum Mittagessen im Becher, und wenn Tapsi doch nach ihr fragt, gibt es eine Umarmung und Spielen im Garten. Dann kommt die Milch am Morgen im Becher, und das Kuscheln auf dem Sofa bleibt. Zuletzt geht die Abendflasche: Milch am Tisch, Zähne putzen, und im Bett ein Buch, ein Lied und der Hase – Tapsi darf traurig sein, und Mama hält Tapsi fest. Nachts gibt es Wasser im Becher und Papas leises Summen. Am Ende waschen Tapsi und Papa die Flasche ein letztes Mal, und Tapsi legt sie in eine Kiste: zur Erinnerung, oder eines Tages für ein Baby. Das Buch beginnt mit der Wahl zwischen der ganzen Geschichte und einer Kurzfassung, bei jeder steht, wie viele Bilder sie hat und wie lange sie ungefähr dauert, und gelesen wird immer von vorn; unter jedem Bild steht der Satz zum Vorlesen, und jedes Tippen blättert weiter.",
  },
  {
    path: "/flaeschchen/kurz/",
    title: "Fläschchen abgewöhnen – die Kurzfassung",
    description:
      "Die Kurzfassung der Fläschchen-Geschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs, vom Fläschchen zum Becher – in wenigen Minuten gelesen.",
    text: "Die Kurzfassung von „Tschüss, Fläschchen!“, für Abende, an denen die ganze Geschichte zu lang ist, oder für ein Kind, das sie schon kennt. Sie erzählt dieselbe Geschichte mit denselben Bildern, nur das Wichtigste: Als Baby hat Tapsi der Fuchs in Papas Arm aus der Flasche getrunken, jetzt ist Tapsi groß, und Mama erzählt, dass die Flasche nach und nach Tschüss sagt. Tapsi trinkt den ersten Schluck aus dem grünen Becher. Zuerst ruht die Flasche am Tag im Schrank, und die Milch kommt zum Mittagessen im Becher, dann auch am Morgen. Zuletzt geht die Abendflasche: Milch am Tisch, und im Bett gibt es keine Flasche mehr, sondern den Hasen, ein Buch und Mamas Lied. Tapsi vermisst sie und weint, und Mama hält Tapsi fest; nachts bringt Papa Wasser im Becher. Am Ende legt Tapsi die Flasche in eine Kiste und sagt danke und Tschüss, und Mama und Papa haben Tapsi lieb. Unter jedem Bild steht ein kurzer Satz zum Vorlesen, jedes Tippen blättert weiter, und im Buch „Flasche abgewöhnen“ steht sie neben der ganzen Geschichte, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer.",
  },
  {
    path: "/grosses-bett/",
    title: "Im großen Bett schlafen – eine Geschichte",
    description:
      "Zwei Vorlesegeschichten in Kapiteln mit Tapsi dem Fuchs: vom Gitterbett ins große Bett und aus dem Elternbett ins eigene – mit Hase, Mondlicht und viel Nähe.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, wenn das Gitterbett zu klein wird und ein großes Bett kommt. Tapsi der Fuchs stößt beim Strecken mit den Füßen ans Ende und klettert über die Stäbe, und Papa ist gleich da. Mama schaut mit Tapsi ein Bilderbuch an und erzählt, dass das große Bett genau dort stehen wird, wo jetzt das Gitterbett steht, und dass der Kuschelhase, die kleine gelbe Decke und ihr Lied mitkommen. Tapsi sucht die blaue Bettwäsche aus, sagt dem Gitterbett Tschüss und danke, reicht Papa beim Aufbauen die Bretter und macht mit Mama das Bett. Ein kleines Gitter hält Tapsi im Bett, ein Nachtlicht in Mondform leuchtet, und das erste Schlafen im großen Bett ist ein Mittagsschlaf. Am Abend ist alles wie immer – Schlafanzug, Zähne, Geschichte, Lied –, und Papa verspricht nachzuschauen und kommt auch. Steht Tapsi nachts auf, bringt Papa Tapsi ruhig zurück, so oft es nötig ist. Mama sitzt beim Einschlafen auf einem Stühlchen am Bett und rückt jeden Abend ein Stück weiter zur Tür, und am Morgen freuen sich alle mit Tapsi. Danach zieht Tapsis Bärenfreund Bruno aus dem Bett der Eltern in sein eigenes, und nach einem bösen Traum kommt Mama sofort, hört zu und bleibt. Ohne Schimpfen, ohne Schreienlassen, ohne Stickerplan. Das Buch „Bett“ beginnt mit einer Wahl: diese Geschichte oder eine zweite für Familien, deren Kind aus dem Elternbett ins eigene Bett zieht – mit dem Kissen, das nach Zuhause riecht, offener Tür, Papa, der jeden Abend ein Stück weiter weg sitzt, und Morgenkuscheln im großen Bett. Bei jeder steht, wie viele Bilder sie hat und wie lange sie ungefähr dauert, und gelesen wird immer von vorn; unter jedem Bild steht der Satz zum Vorlesen, und jedes Tippen blättert weiter.",
  },
  {
    path: "/grosses-bett/eigenes-bett/",
    title: "Im eigenen Bett schlafen – eine Geschichte",
    description:
      "Eine Vorlesegeschichte in Kapiteln aus dem Elternbett: Tapsi der Fuchs zieht ins eigene Bett, mit Hase, Mondlicht und Morgenkuscheln im großen Bett.",
    text: "Eine Geschichte zum Vorlesen, Kapitel für Kapitel, für Familien, die möchten, dass ihr Kind im eigenen Bett schläft statt im Elternbett. Tapsi der Fuchs schläft zwischen Mama und Papa im großen Bett, dreht sich nachts und strampelt, und Papa liegt ganz am Rand. Mama erzählt Tapsi vorher, dass Tapsi bald im eigenen Bett schläft, im eigenen Zimmer, und als Tapsi sagt „Aber ich will bei euch schlafen!“, hört sie zu und nimmt Tapsi in den Arm: Wir sind immer ganz nah. Papa verspricht, dass es jeden Morgen Kuscheln im großen Bett gibt. Tapsi trägt das Kissen, das nach Zuhause riecht, ins neue Bett, der Kuschelhase sitzt darauf, ein Nachtlicht in Mondform leuchtet, und die Tür bleibt offen. Zuerst gibt es dort nur den Mittagsschlaf, und Mama liegt auf dem Teppich daneben. Am Abend ist alles wie immer – Schlafanzug, Zähne, Geschichte, Lied –, Papa liegt neben dem Bett und hält Tapsis Pfote und sitzt dann jeden Abend ein Stückchen weiter weg, bis er an der Tür summt. Kommt Tapsi nachts herüber, nimmt Mama Tapsi in den Arm und bringt Tapsi ruhig zurück, so oft es nötig ist, und bleibt, bis Tapsi schläft. Am Morgen klettert Tapsi stolz zum Kuscheln ins große Bett. Ohne Schimpfen, ohne Schreienlassen, ohne Stickerplan. Im Buch „Bett“ steht sie neben der Geschichte vom Gitterbett ins große Bett, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer; unter jedem Bild steht der Satz zum Vorlesen, und jedes Tippen blättert weiter.",
  },
  {
    path: "/abstillen/",
    title: "Abstillen mit Geschichte – Tapsis Milchkette",
    description:
      "Eine Vorlesegeschichte in Kapiteln zum sanften Abstillen: erst die Milch am Tag, dann am Abend, in der Nacht und zuletzt am Morgen – mit Tapsi dem Fuchs.",
    text: "Eine längere Geschichte zum Vorlesen, Kapitel für Kapitel, wenn das Stillen langsam zu Ende gehen soll. Tapsi der Fuchs hat als Baby an Mamas Brust getrunken und ist jetzt groß. Mama erzählt, warum die Milch nun gehen darf: Ihre Brust hat so lange Milch gemacht und möchte ausruhen. Über Tapsis Bett hängt eine Kette mit einem Milchtropfen für jede Stillzeit, und Kapitel für Kapitel geht einer: zuerst die Milch am Tag, wenn Spielen, Essen und der Becher helfen, dann die am Abend, wenn Tapsi mit Buch und Lied einschläft, dann die in der Nacht, wenn Papa tröstet, und zuletzt die am Morgen, mit einem Abschied. Tapsi darf wütend und traurig sein, Mama und Papa bleiben ganz nah. Unter jedem Bild steht der Satz zum Vorlesen. Das Buch „Abstillen“ beginnt mit einer Wahl: diese lange Geschichte als Ganzes oder in einer Kurzfassung mit den wichtigsten Bildern, eine Geschichte für Familien, die nur nachts abstillen, oder eine kurze mit Abschiedsfest für Familien, die an einem festen Tag abstillen. Bei jeder steht, wie viele Bilder sie hat und wie viele Minuten sie ungefähr dauert, und ein Tippen auf „Lesen“ schlägt sie auf. Jedes Tippen blättert eine Seite weiter. Für sanftes Abstillen von Kleinkindern, ohne Druck und ohne Schimpfen.",
  },
  {
    path: "/abstillen/nachts/",
    title: "Nachts abstillen: Die Milch schläft",
    description:
      "Eine Vorlesegeschichte in Kapiteln fürs nächtliche Abstillen: Wenn der Mond scheint, schläft die Milch – nachts tröstet Papa, am Tag trinkt Tapsi weiter.",
    text: "Eine kurze Geschichte zum Vorlesen, Kapitel für Kapitel, für Familien, die nachts abstillen und am Tag weiter stillen. Tapsi der Fuchs trinkt an Mamas Brust, am Tag und auch in der Nacht. Mama erzählt mit einem kleinen Bilderbuch von Mond und Sonne: Wenn der Mond scheint, schläft die Milch, und wenn die Sonne aufgeht, wacht sie wieder auf. Am Tag gibt es Milch und Kuscheln, so viel Tapsi mag, und Papa verspricht, nachts zu kommen. Am Abend trinkt Tapsi noch einmal, winkt dem Mond „Gute Nacht, Milch!“ zu, und Papa liest vor. Wacht Tapsi nachts auf, ist Papa sofort da: Tapsi darf wütend sein und weinen, Papa hält Tapsi fest, gibt einen Schluck Wasser aus dem blauen Becher, trägt Tapsi hin und her und summt, bis Tapsi in seinem Arm einschläft. Am Morgen ist die Milch wieder wach. Nacht für Nacht kommt Papa wieder, und ein paar Nächte später sieht Tapsi den Mond, nimmt den Teddy in den Arm und schläft weiter. Unter jedem Bild steht der Satz zum Vorlesen, das Buch „Abstillen“ beginnt mit der Wahl zwischen ihr und der langen Geschichte, jede mit der Zahl ihrer Bilder und ihrer ungefähren Dauer, und jedes Tippen blättert weiter. Ohne Druck, ohne Schimpfen und ohne Uhrzeit – jede Familie hat ihre eigene Nacht.",
  },
  {
    path: "/abstillen/kurz/",
    title: "Abstillen kurz erzählt – Tapsis Milchkette als Kurzfassung",
    description: "Die Kurzfassung der Abstillgeschichte zum Vorlesen: dieselben Bilder von Tapsi dem Fuchs, nur das Wichtigste – in wenigen Minuten gelesen.",
    text: "Die Kurzfassung von „Tapsis Milchkette“, für Abende, an denen die lange Geschichte zu lang ist, oder für ein Kind, das sie schon kennt. Sie erzählt dieselbe Geschichte mit denselben Bildern, nur das Wichtigste: Tapsi der Fuchs hat als Baby an Mamas Brust getrunken und ist jetzt groß, Mama erzählt, dass die Milch gehen darf, und über Tapsis Bett hängt eine Kette mit einem Milchtropfen für jede Stillzeit. Erst geht die Milch am Tag, dann die am Abend, wenn Tapsi mit einem Buch einschläft, dann die in der Nacht, wenn Papa tröstet und summt, und an einem Morgen trinkt Tapsi ein letztes Mal und sagt der Milch danke und Tschüss. Tapsi darf traurig und wütend sein, Mama und Papa halten Tapsi fest, und lieb haben sie Tapsi wie immer. Unter jedem Bild steht ein kurzer Satz zum Vorlesen, jedes Tippen blättert weiter, und in wenigen Minuten ist sie gelesen. Im Buch „Abstillen“ steht sie neben der ganzen Geschichte, und bei jeder steht, wie viele Bilder sie hat und wie lange sie ungefähr dauert.",
  },
  {
    path: "/abstillen/abschied/",
    title: "Abstillen mit Abschiedsfest – Noch dreimal schlafen",
    description:
      "Eine kurze Vorlesegeschichte zum Abstillen an einem festen Tag: Drei Papierherzen zählen die Nächte, dann sagt Tapsi der Milch danke und feiert.",
    text: "Eine kurze Geschichte zum Vorlesen, in vier Kapiteln, für Familien, die an einem festen Tag ganz abstillen möchten statt eine Stillzeit nach der anderen über Wochen. Tapsi der Fuchs ist groß und trinkt noch an Mamas Brust. Mama erzählt: Ihre Brust hat so lange Milch gemacht, und noch dreimal schlafen, dann sagen sie der Milch Tschüss. Tapsi will das nicht, und Mama nimmt Tapsi in den Arm: Traurigsein darf sein. Auf Tapsis Regal stehen drei rote Papierherzen, jeden Morgen nimmt Tapsi eines weg, und bis dahin gibt es noch Milch und langes Kuscheln. Mit Papa backt Tapsi einen Kuchen für das Abschiedsfest. Als das letzte Herz weg ist, trinkt Tapsi ein letztes Mal, ganz langsam, winkt „Danke, Mama-Brust! Tschüss, Milch!“, und dann gibt es Kuchen für alle und einen neuen Becher nur für Tapsi. Am Abend will Tapsi doch Milch, ist wütend und weint, und Mama und Papa halten Tapsi fest, bis die Tränen fertig sind. Jeden Tag wird es ein bisschen leichter: Die Milch ist weg, aber Kuscheln bleibt. Unter jedem Bild steht der Satz zum Vorlesen, und jedes Tippen blättert weiter. Ohne Druck und ohne Schimpfen.",
  },
  scene(
    "baustelle",
    "Baustelle",
    "Bagger, Kran und Betonmischer",
    "Der Bagger gräbt, der Kran hebt die Steine hoch, die Walze macht die Straße glatt, und im Bauwagen gibt es Kakao. Zwischen den Maschinen schauen Igel, Maulwurf und Schnecke vorbei, und der Kipper fährt auf Wunsch hinüber in die Stadt.",
  ),
  scene(
    "stadt",
    "Stadt",
    "Bus, Ampel und Polizeiauto",
    "Die Ampel springt von Rot auf Grün, Bus, Polizeiauto und Müllauto fahren durch die Straßen, und zwischen Bäckerei, Kirche und Brunnen sind Oma, Enten und Tauben unterwegs. Auf Wunsch fährt das Feuerwehrauto hinüber zur Feuerwache und der Bus in den Zoo.",
  ),
  scene(
    "bauernhof",
    "Bauernhof",
    "Kuh, Schwein und Traktor",
    "Kuh, Schwein, Pferd, Schaf und Ziege machen ihre Geräusche, der Hahn kräht, und Traktor und Mähdrescher sind auf dem Feld. Rund um den Bauern laufen Gans, Huhn, Küken und Ferkel, und der Traktor fährt auf Wunsch hinüber in den Wald.",
  ),
  scene(
    "hof",
    "Hof am Teich",
    "Ente, Huhn und Windmühle",
    "Am Teich quakt der Frosch und schwimmt die Ente, am Hühnerstall kräht der Hahn, und die Windmühle dreht sich. Lamm, Ferkel, Küken und die Bienen am Bienenstock wollen entdeckt werden, und neben der Vogelscheuche liegt ein Kürbis.",
  ),
  scene(
    "zoo",
    "Zoo",
    "Löwe, Giraffe, Elefant und Affe",
    "Der Löwe mit seinem Jungen, der Elefant mit seinem Kleinen, Giraffe, Zebra und die Pinguine mit ihrem Küken warten darauf, angetippt zu werden. Dazu Panda, Koala, Känguru, Nashorn, Flusspferd, Flamingo, Robbe und eine kleine Bahn – und manchmal kommt der Bus aus der Stadt zu Besuch.",
  ),
  scene(
    "unterwasser",
    "Unterwasser",
    "Wal, Delfin, Krake und Schildkröte",
    "Unter dem Meer schwimmen Wal, Delfin, Hai, Rochen, Krake, Seepferdchen und Clownfisch, und eine Meerjungfrau, ein Taucher und ein U-Boot sind unterwegs. Auf dem Grund liegen eine Schatztruhe, eine Flaschenpost und ein Anker, oben leuchtet der Leuchtturm.",
  ),
  scene(
    "badezimmer",
    "Badezimmer",
    "Badewanne, Dusche und Zahnbürste",
    "In der Badewanne wächst ein Berg aus Schaum, die Quietscheente schwimmt, die Toilette spült, und Zahnbürste und Zahnpasta stehen bereit. Dazu Waschmaschine, Föhn, Töpfchen, Hausschuhe und Badetiere wie Krokodil, Wal und Frosch – ein Bild, das zum eigenen Bad am Abend passt.",
  ),
  scene(
    "wald",
    "Wald",
    "Fuchs, Reh, Igel und Eule",
    "Auf der Lichtung am Bach leben Fuchs, Reh mit Kitz, Hirsch, Dachs, Biber und Wildschwein mit Frischlingen, der Specht klopft, und die Eule ruft. Über die Brücke geht es zum Wegweiser, im Wald wachsen Fliegenpilz und Farn, und manchmal kommt der Traktor vom Bauernhof vorbei.",
  ),
  scene(
    "feuerwache",
    "Feuerwache",
    "Feuerwehrauto, Sirene und Helme",
    "Die Sirene heult, und das Feuerwehrauto rückt aus – mit Feuerwehrfrau, Feuerwehrmann und Feuerwehrhund. Rund um die Wache gibt es Rutschstange, Schlauchturm, Hydrant, Krankenwagen und eine Übungspuppe zu entdecken, und das Feuerwehrauto aus der Stadt kommt auf Wunsch zu Besuch.",
  ),
  scene(
    "weltall",
    "Weltall",
    "Rakete, Astronaut und Mondauto",
    "Auf dem Mond warten Mondauto, Mondbagger, Landefähre und ein Roboterhund, darüber ziehen Erde, Mars und Saturn, eine Sternschnuppe und ein Komet. Ein Astronaut, die Raumstation und ein kleines Alien mit seinem Baby wollen entdeckt werden – und im Gewächshaus wächst eine Weltraumblume.",
  ),
  scene(
    "spielplatz",
    "Spielplatz",
    "Rutsche, Schaukel und Eiswagen",
    "Schaukel, Rutsche, Wippe und Kletterturm kommen in Bewegung, im Sandkasten stehen Sandburg, Eimer, Förmchen und ein kleiner Bagger, und der Eiswagen ist da. Opa, Mama mit dem Kinderwagen, ein Drachen und ein Luftballon sind auch dabei – ein Bild wie der Spielplatz um die Ecke.",
  ),
  scene(
    "kueche",
    "Küche",
    "Toaster, Wasserkocher und Kühlschrank",
    "Der Topf blubbert, der Toaster springt, der Wasserkocher kocht, und im Ofen geht der Kuchen auf. Mama, Papa und das Baby sind in der Küche, Katze und Hund auch, und Küchenwecker, Nudelholz, Waage und Mixer warten darauf, ausprobiert zu werden.",
  ),
  scene(
    "supermarkt",
    "Supermarkt",
    "Einkaufswagen, Kasse und Bäckerin",
    "Die Kasse piept, der Einkaufswagen rollt, und das Obst wird auf der Waage gewogen. An der Brottheke steht die Bäckerin, im Kühlregal gibt es Milch und Käse, und Kaugummiautomat, Pfandautomat und der Turm aus Dosen warten aufs Antippen – fast wie beim Einkaufen zusammen.",
  ),
  scene(
    "flughafen",
    "Flughafen und Bahnhof",
    "Flugzeug, Zug und Gepäckband",
    "Auf dem Vorfeld winkt der Einweiser das Flugzeug heran, das Gepäck fährt übers Band, und Tankwagen, Follow-me-Auto, Bus und Taxi sind unterwegs. Am Bahnhof daneben steht der Zug mit Speisewagen, die Bahnhofsuhr tickt, und der Schaffner, die Reisenden und die Pilotin warten auf ihre Reise.",
  ),
  scene(
    "winterbaustelle",
    "Winter-Baustelle",
    "Schneepflug, Bagger, Bauwagen",
    "Die Baustelle im Schnee: Bagger, Kran, Kipper und Gabelstapler arbeiten weiter, während Kinder einen Schneemann bauen und Schlitten fahren. Am Feuerfass ist es warm, am Futterhaus sitzen Blaumeise und Rotkehlchen, und auch ein Iglu und die Fußspuren im Schnee wollen entdeckt werden.",
  ),
  scene(
    "kita",
    "Kita",
    "Garderobe, Puppenwagen und Geburtstagszug",
    "Ein Tag in der Kita: Jacken an die Haken, spielen in der Bauecke, ein Bilderbuch lesen, Mittagessen mit Nudeln und Pudding und danach Mittagsschlaf. Der Geburtstagszug, der Hamster, Trommel, Xylophon und Spieluhr wollen angetippt werden – schön zum Erzählen vor dem ersten Kita-Tag.",
  ),
  scene(
    "kinderarzt",
    "Kinderarzt",
    "Stethoskop, Waage und Pflaster",
    "Beim Kinderarzt wird gemessen und gewogen, mit dem Stethoskop abgehört und mit der Ohrenlampe ins Ohr geschaut, und am Ende gibt es einen Sticker. Im Wartezimmer warten Papa, Kinderwagen, Kugelbahn, Schaukelpferd und ein Aquarium – so wird der nächste echte Besuch ein bisschen vertrauter.",
  ),
  scene(
    "strand",
    "Strand",
    "Sandburg, Leuchtturm, Möwe und Segelboot",
    "Die Wellen rollen, die Möwe ruft, und die Sandburg wächst mit Eimer und Schaufel. Draußen fahren Boot und Schiff, ein Delfin springt, am Strand liegen Krebs, Seestern und Muschel, und es gibt Pommes, Sonnencreme, eine Strandmuschel und den Turm der Rettungsschwimmer.",
  ),
  scene(
    "dinotal",
    "Dinotal",
    "T-Rex, Brachiosaurus und Vulkan",
    "Der T-Rex muss niesen, der Brachiosaurus reckt seinen langen Hals, und im Nest liegen Dino-Eier. Dazu ein Triceratops-Kind, ein Ankylosaurus, ein Flugsaurier-Baby, ein Plesiosaurus im Wasser, eine Höhle, ein Stück Bernstein und riesige Farne – eine Urzeit zum Antippen.",
  ),
  scene(
    "gutenacht",
    "Gute Nacht",
    "Mond, Sterne, Teddy und Spieluhr",
    "Das Bild für den Abend: Alles, was angetippt wird, schläft ein – der Teddy, das Schaukelpferd, der Goldfisch, der Roboter und die Spielsachen –, und wenn alle schlafen, wird das Zimmer dunkel. Mond, Sterne, Glühwürmchen, Spieluhr und Gutenachtbuch machen es leise und gemütlich.",
  ),
  scene(
    "winter",
    "Winter",
    "Schneemann, Schlitten und Eichhörnchen",
    "Im Schnee bauen Kinder einen Schneemann und machen einen Schneeengel, ein Schlittschuhläufer dreht Runden auf dem Eis, und der Pferdeschlitten fährt vorbei. Bei der Blockhütte warten Opa, Mama mit heißem Kakao, Reh, Hase und Eichhörnchen, und am Vogelhaus sitzen Blaumeise und Rotkehlchen.",
  ),
  scene(
    "herbst",
    "Herbst",
    "Igel, Kastanien, Drachen und Traktor",
    "Der Wind wirbelt die bunten Blätter, der Drachen steigt, und die Wildgänse ziehen über das Bild. Oma, Opa, ein Junge und der Bauer sind draußen, und zwischen Kastanien, Pilzen, Pfütze und Apfelkorb wohnen Igel, Eichhörnchen, Amsel und Regenwurm – sogar ein Kastanienmännchen ist dabei.",
  ),
  scene(
    "ostern",
    "Ostern",
    "Osterhase, Lämmchen und Kirschbaum",
    "Im Garten hat der Osterhase bunte Eier versteckt – ein rotes, ein gelbes, ein grünes und ein blaues wollen gefunden werden. Am Maltisch werden Eier bemalt, Lamm, Küken und Henne sind da, und zwischen Tulpen, Narzissen und Löwenzahn summt die Hummel.",
  ),
];

/**
 * Another address of a published game whose content players can't see yet – a story of a book whose pictures are still
 * in the queue: its texts wait here like an unfinished game's, out of the search pages and `noindex` until it shows.
 */
const WAITING_PATHS: string[] = [];

/** Every page that should be found: all but the games still being built (`Game.unfinished`), which no one is to find yet. */
export const SEO_PAGES: PageSeo[] = SEO_TEXTS.filter((page) => !isUnfinished(page.path) && !WAITING_PATHS.includes(page.path));

/**
 * Pages that had an entry here, and so stood in the sitemap, and moved: their old address and where it leads now. The
 * build writes a page there in every language that sends on at once with a canonical link to the new address, which
 * Google takes as a permanent redirect; without it GitHub Pages answers 404 and the page's place in Google is lost.
 * App.tsx leads the old address there too (`<Navigate>`), for a visit that starts in the app; `content.test.ts` checks both.
 */
export const MOVED_PATHS: Record<string, string> = {
  "/was-brauche-ich/": "/wie-gehts-dir/",
};

/**
 * Addresses that must never be in a search result: the pages for grown-ups only (the Impressum names a private
 * address) and the games still being built.
 */
export const NO_INDEX_PATHS = [
  "/management/",
  // The trophy room shows what this one child has won, nothing for a search.
  "/pokale/",
  "/management/bilder/",
  "/management/recherchen/",
  "/management/video-zaehne/",
  "/management/video-haende/",
  "/management/video-intro/",
  "/management/video-outro/",
  "/management/video-toepfchen/",
  "/management/video-toepfchen-eltern/",
  "/ideen/",
  "/impressum/",
  "/datenschutz/",
  ...WAITING_PATHS,
  ...SEO_TEXTS.filter((page) => isUnfinished(page.path)).map((page) => page.path),
];

/**
 * The entry for an address (with or without the trailing slash), if it has one. A level's address
 * (`/abenteuer/schatzinsel/`) has its game's: the level is the game's page with another card picked, so title, text
 * and canonical link are the game's (`pageOfLevel`).
 */
export function seoFor(pathname: string): PageSeo | undefined {
  const path = pageOfLevel(pathname);
  return SEO_PAGES.find((page) => page.path === path);
}

/** Whether an address must stay out of search results (NO_INDEX_PATHS), a level's with its game. */
export const isNoIndex = (pathname: string) => NO_INDEX_PATHS.includes(pageOfLevel(pathname));

/** How wide a search result shows a title before it cuts it, counted in Latin letters (`titleWidth`). */
export const TITLE_WIDTH = 60;

/**
 * How wide a title is in a search result, in Latin letters: Google cuts by width, not by count. A Chinese sign (and its
 * full-width punctuation) is as wide as two, and a mark that sits above or below its letter (Hindi's vowel signs,
 * Arabic's) takes no room of its own.
 */
export function titleWidth(title: string) {
  let width = 0;
  for (const sign of title) width += /\p{Mn}/u.test(sign) ? 0 : /[\p{Script=Han}\u3000-\u303F\uFF00-\uFFEF]/u.test(sign) ? 2 : 1;
  return width;
}

/**
 * The full title as the browser tab and Google show it: the page's with the site's name after it – but the page's alone
 * where both together would be cut off in a search result (TITLE_WIDTH), since the words parents search for count more
 * than the name. The home page (`path` "/") always keeps the name: there it is what is searched for.
 */
export function fullTitle(page: PageText, path: string) {
  const named = `${page.title} | ${SITE_NAME}`;
  return path === "/" || titleWidth(named) <= TITLE_WIDTH ? named : page.title;
}
