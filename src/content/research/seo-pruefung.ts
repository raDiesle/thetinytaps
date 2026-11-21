import type { Research } from "./types";

export const seoPruefung: Research = {
  id: "seo-pruefung",
  area: "technik",
  date: "2026-10-30",
  emoji: "🔎",
  title: "SEO-Prüfung: Was Google von toddlerfox.com sieht",
  question: "Passen Seitentitel, Beschreibungen, Sitemap, robots.txt und Ladezeit? Sollten die Spiele Meta-Keywords oder Beschreibungen bekommen?",
  method:
    "Die gebaute Seite (bun run build) Datei für Datei angesehen: Kopf jeder Seite, sitemap.xml, robots.txt, Größe der Dateien, die eine Seite vor dem ersten Bild lädt. Dann /zaehne/ im Browser mit englischer Browsersprache geöffnet und angesehen, was nach dem Start der App im Dokument steht – das ist, was Google aufnimmt. Gemessen ohne Drosselung auf dem eigenen Rechner; PageSpeed Insights ließ sich nicht starten (die API ohne Schlüssel war für den Tag aufgebraucht, pagespeed.web.dev im Browser gesperrt). Echte Werte für Handys gibt erst PageSpeed Insights oder die Search Console.",
  findings: [
    "Die Grundlage stimmt: Jede Spiel-, Kategorie- und Wimmelbildseite (40) hat eine eigene index.html mit Titel, Beschreibung, canonical-Link und Vorschau-Tags, alle stehen in der sitemap.xml, und content.test.ts prüft Länge und Einmaligkeit der Texte.",
    'Größter Fehler (behoben): Google liest die Seite, nachdem die App gelaufen ist, und zwar mit einem englischen Browser. Die App sprach darum Englisch: Titel „Brushing Teeth – The Tiny Taps“, <html lang="en">, englische Knöpfe – aber deutsche Beschreibung und deutsche Adresse. Jetzt spielen Suchmaschinen (Googlebot, Bingbot und andere, isCrawler in src/lib/locale.ts) auf Deutsch, der Sprache der gebauten Seiten. Spielerinnen und Spieler sind nicht betroffen.',
    "Zweitgrößter Punkt (umgesetzt, A-21): Der Text aus seo.ts und die Links zu den anderen Spielen stehen nur in der gebauten HTML-Datei. Sobald die App startet, ersetzt sie ihn – auf /zaehne/ bleiben danach vier Wörter („Zähne putzen“, „Los geht’s!“) und zwei Links. Google nimmt die Seite nach dem Start auf und findet darum kaum Text, an dem es sie einordnen kann. Die Links findet Google zwar noch im HTML, der Text zählt aber kaum. Jetzt steht er auf jedem Menü und Startbildschirm unter der ersten Bildschirmseite auf einem hellen Feld (SeoText), in der Sprache der App, wo es ihn gibt (Deutsch, Englisch). Spiele, die gleich losgehen (ein Wimmelbild, Aufs Töpfchen), haben keinen Platz dafür: Dort bleibt der Text nur in der gebauten Seite.",
    'Meta-Keywords nicht einsetzen: Google wertet <meta name="keywords"> seit 2009 gar nicht aus, Bing hat 2011 gesagt, ein vollgestopftes Keywords-Feld sehe es eher als Zeichen für Spam. Die gesuchten Wörter gehören in Titel, Beschreibung und sichtbaren Text – das macht seo.ts schon.',
    "Beschreibungen gibt es schon für jede Seite (80 bis 160 Zeichen, nach dem, was Eltern suchen). Google zeigt sie oft, schreibt sie aber auch selbst um, wenn die Seite zu wenig Text hat – noch ein Grund für A-21.",
    "robots.txt (behoben): Impressum und Datenschutz waren per Disallow gesperrt. So kann Google das noindex nicht lesen, und eine gesperrte, aber verlinkte Seite (das Impressum ist von der Startseite verlinkt) erscheint trotzdem als nackte Adresse in den Ergebnissen. Dazu kamen sie über 404.html mit Fehlercode 404. Jetzt hat jede dieser Seiten eine eigene index.html mit noindex, und robots.txt sperrt nichts mehr.",
    "Sitemap (behoben): Jede Adresse trug als <lastmod> das Baudatum, bei jedem Deploy neu. Google nutzt lastmod nur, wo es verlässlich stimmt, und lernt sonst, es zu übergehen. Es fällt weg, bis es ein echtes Datum pro Seite gibt.",
    "Vorschaubild (behoben): Wer einen Link per WhatsApp oder Messenger teilt, sah das kleine App-Symbol. Jetzt zeigt die Vorschau einen Ausschnitt des Buch-Covers (Fuchs- und Bärenfamilie, 1200 × 630, public/images/vorschau.jpg) als großes Bild.",
    "Seitenname (behoben): Die Startseite sagt Google jetzt mit WebSite-Daten, wie die Seite heißt. Der Name war noch „The Tiny Taps“, die Adresse toddlerfox.com – in den Ergebnissen passte das nicht zusammen, und „TinyTap“ ist die Marke einer anderen Kinder-App (Recherche „Domain“). Seit 31. Oktober 2026 heißen Name (SITE_NAME in seo.ts) und Adresse gleich: Books for Both, booksforboth.com.",
    "Ladezeit: Vor dem ersten Bild lädt eine Seite rund 250 KB (gepackt): das Programm 133 KB und 42 KB, kleine Teile, und das Stylesheet 62 KB, das das Bild aufhält. Fast die Hälfte des Stylesheets ist die Schrift Fredoka, als Text eingebettet – darunter eine hebräische Schrift (12 KB), die keine Sprache der App braucht. Umgesetzt (A-23): Nur die lateinischen Teile werden eingebettet (src/styles/font.css), das Stylesheet ist jetzt 53 statt 62 KB groß. Das Spiel selbst (z. B. Zähne putzen 105 KB + 17 KB) kommt danach. Die Hintergrundmusik (2,4 MB) lädt erst nach dem Laden der Seite und hält das erste Bild nicht auf.",
    "Für den Betreiber zu tun (nicht im Code): toddlerfox.com in der Google Search Console als Domain bestätigen (TXT-Eintrag bei Cloudflare), die Sitemap https://toddlerfox.com/sitemap.xml einreichen und mit „URL-Prüfung“ für /zaehne/ ansehen, was Google nach dem Rendern sieht; Bing Webmaster Tools kann die Search Console übernehmen. PageSpeed Insights für / und /zaehne/ auf dem Handy laufen lassen.",
    "Seiten auf Englisch (umgesetzt, A-22): Die Adresse ist englisch, die App spricht sieben Sprachen, aber Google fand nur deutsche Seiten. Jetzt hat jede der 40 Seiten eine englische Fassung unter /en/ (/en/zaehne/), mit Titeln nach dem, was englische Eltern suchen („toddler games“, „games for 2 year olds“, „free, no ads, offline“, „look-and-find“ für Wimmelbild, „visual schedule“ für Tagesplan), hreflang-Verweisen zwischen beiden und Englisch als Standard für alle anderen Sprachen (x-default). Die Sitemap hat 80 Adressen. Wer über /en/ kommt, spielt trotzdem in der Sprache seines Browsers; nur Suchmaschinen spielen in der Sprache der Adresse.",
  ],
  topics: [],
  games: [],
  excluded: [
    { title: "Meta-Keywords", why: "Google liest sie seit 2009 nicht, Bing sieht darin eher Spam. Die Wörter gehören in Titel, Beschreibung und Text." },
    {
      title: "Inhalt nur für Google (versteckter Text, eigene Seite für Bots)",
      why: "Google wertet Text ab, den Menschen nicht sehen, und eine andere Seite für Bots als für Menschen ist Cloaking. Suchmaschinen bekommen dieselbe deutsche Seite wie deutsche Eltern.",
    },
  ],
  ideas: ["A-21", "A-22", "A-23"],
  sources: [
    {
      label: "Google Search Central – Google nutzt das Keywords-Meta-Tag nicht (2009)",
      url: "https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag",
    },
    {
      label: "Google Search Central – Grundlagen zu JavaScript und SEO",
      url: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
    },
    {
      label: "Google Search Central – Sprachabhängige Seiten (Googlebot und Browsersprache)",
      url: "https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages",
    },
    {
      label: "Google Search Central – Seiten mit noindex aus der Suche halten",
      url: "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
    },
    {
      label: "Google Search Central – Sitemaps erstellen (lastmod)",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
    { label: "Google Search Central – Websitenamen in der Suche", url: "https://developers.google.com/search/docs/appearance/site-names" },
  ],
};
