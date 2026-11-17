import type { Research } from "./types";

export const websiteDownload: Research = {
  id: "website-download",
  date: "2026-11-03",
  emoji: "📶",
  title: "Wie viel lädt ein Besuch der Startseite herunter?",
  question:
    "Chrome zeigte beim Öffnen der Startseite 5,6 MB übertragene Daten. Was davon braucht ein Besuch wirklich, und was lädt der Service Worker für die Offline-Nutzung, die die wenigsten verwenden?",
  method:
    "Den Build (bun run build) gemessen: welche Dateien der Service Worker beim ersten Besuch lädt (seine Liste in out/sw.js, Größen auf der Platte und gzip-gepackt), und im Vorschau-Browser mit leerem Cache, was die Startseite selbst lädt (Resource Timing). Danach dasselbe mit dem umgebauten Service Worker, und offline geprüft, indem der Server gestoppt und ein vorher gespieltes Spiel neu geladen wurde.",
  findings: [
    "Der Service Worker lud bei jedem ersten Besuch nach dem Laden der Seite alle 1885 Dateien der Seite herunter, 42 MB (gepackt 37 MB): die Bilder (18 MB) und Töne (17 MB) aller Spiele, den Code aller Spiele und die Seiten für Suchmaschinen. Nach jedem neuen Build lud er alles noch einmal, für jeden wiederkehrenden Besuch.",
    "Die Startseite selbst lädt rund 1,2 MB Code (27 Teile, davon die Seiten hinter den Büchern im Regal vorab, damit ein Tippen sofort weiterblättert), 160 KB Styles mit der Schrift darin, 170 KB Bilder und – bei eingeschalteter Musik – das Hintergrundlied mit 2,5 MB. Das Lied ist der größte Posten eines Besuchs.",
    "Jedes Spiel wird schon getrennt nachgeladen (eigene JS- und CSS-Teile je Seite); die Masse kam allein vom Service Worker.",
    "Umgebaut behält der Service Worker nur, was ein Besuch benutzt: beim Start 20 Dateien (900 KB, gepackt 520 KB, die die Seite ohnehin geladen hat), dann jedes Spiel, sobald es gespielt wird – auch das läuft danach offline. Alles lädt er nur für eine installierte App. Ein neuer Build übernimmt, was sich nicht geändert hat, statt alles neu zu laden.",
    "Mit Datensparmodus (Save-Data) oder auf 2G lädt die Startseite weder die Seiten hinter den Büchern noch das Lied vorab; sie kommen mit dem ersten Tippen.",
    "Weitere Hebel, nicht umgesetzt: das Lied kleiner kodieren oder erst beim ersten Tippen laden (dann spielt es dort später), und die Schrift aus dem Stylesheet lösen, das vor dem ersten Bild geladen sein muss.",
  ],
  topics: [],
  games: [],
  excluded: [
    {
      title: "Spiele einzeln nachladen",
      why: "Ist schon so: jede Spielseite ist ein eigener Teil (App.tsx lädt sie lazy), nur der Service Worker holte trotzdem alles.",
    },
  ],
  ideas: [],
  sources: [],
};
