import type { Research } from "./types";

export const belohnungstafel: Research = {
  id: "belohnungstafel",
  area: "suchen",
  date: "2026-10-28",
  emoji: "🌟",
  title: "Belohnungstafel – was Eltern brauchen",
  question:
    "Was erwarten Eltern von einer Wochen- oder Tagestafel für Zwei- und Dreijährige, was bieten Vorlagen, Magnettafeln und Apps, und was raten Fachleute – auch dagegen?",
  method:
    "Rund 17 Websuchen (Deutsch und Englisch: Vorlagen zum Ausdrucken, Magnettafeln, Belohnungs-Apps, Ratgeber, Kritik) und 12 gelesene Seiten von Elternmagazinen, Herstellern, App-Seiten und einem Psychologie-Lexikon. Keine Zahlen zum Suchvolumen und keine Befragung: was „häufig“ heißt, ist aus den Angeboten gezählt, nicht gemessen.",
  findings: [
    "Fast alle Tafeln sind eins von wenigen Mustern: Wochenraster (Aufgaben × Tage), N Sterne sammeln (meist 5 oder 10), ein Weg oder Zug zum Ziel, Morgen- und Abendstreifen, ein Glas zum Füllen.",
    "Üblich sind ein Feld für den Namen, ein Thema zum Auswählen und ein Kästchen oder Menü für die Belohnung; wiederverwendbar heißt magnetisch, abwischbar oder laminiert.",
    "Magnettafeln haben kleine Teile – für Unter-Dreijährige eine Verschluckungsgefahr.",
    "Apps zielen auf Kinder ab vier, meist mit Konto, Abo oder Werbung; für Zweijährige zum selbst Tippen gibt es kaum etwas.",
    "Ratgeber für Kleine: ein bis drei klare Aufgaben, eine davon leicht; der Stern sofort, die Belohnung bald (täglich oder nach etwa fünf Sternen) – eine ganze Woche ist zu lang; Bilder statt Wörter; das Kind klebt selbst.",
    "Nie Sterne wegnehmen, nie strafen; als Belohnung am besten gemeinsame Zeit, und die Tafel nach einer Weile ausklingen lassen.",
    "Kritik: Belohnungen können lenken statt verbinden (Juul) und eigene Freude verdrängen (Überrechtfertigungs-Effekt, Lepper, Greene und Nisbett 1973); Lob für Mühe statt Können (Dweck); für Grundbedürfnisse wie Töpfchen raten manche ganz ab.",
    "Lücken, die kein gefundenes Angebot füllt: Ausmalen statt Aufkleber, ein tintensparender Schwarz-weiß-Druck, Bildschirm und Papier genau gleich, und eine Tafel, auf der ein Zweijähriger seinen Stern selbst antippt.",
    "Monatstafeln werden gesucht (Google-Autovervollständigung, 28. Oktober 2026): „belohnungskalender kinder (zum ausdrucken)“, „belohnungskalender toilette“, „monthly reward chart printable“, „monthly sticker reward chart“ – auf Deutsch eher als Kalender als als „belohnungstafel monat“. Tag und Woche: „daily reward chart“, „tagesplan kinder“, „belohnungstafel kinder wochenplan“. Darum bleiben Tag, Woche und Monat die drei Ansichten.",
  ],
  topics: [
    {
      emoji: "🖨️",
      title: "Zum Ausdrucken, selbst gestaltet",
      searches: [
        "belohnungstafel zum ausdrucken",
        "belohnungstafel kinder pdf kostenlos",
        "belohnungstafel selbst gestalten",
        "wochenplan kinder zum ausdrucken",
        "reward chart printable toddler",
      ],
      ideas: ["T-04", "T-05", "T-06", "T-07", "T-08", "T-20", "T-24", "T-25"],
    },
    {
      emoji: "⭐",
      title: "Für die Kleinsten: schnell und selbst",
      searches: ["belohnungssystem kinder 2 jahre", "belohnungstafel kleinkind", "sticker chart toddler", "belohnungssystem kinder 3 jahre"],
      ideas: ["T-02", "T-03", "T-09", "T-14"],
    },
    {
      emoji: "📅",
      title: "Wochen- und Tagesroutine",
      searches: [
        "belohnungstafel woche",
        "belohnungskalender kinder",
        "monthly reward chart",
        "morgenroutine kinder bilder",
        "abendroutine kinder bilder",
        "routine chart toddler",
      ],
      ideas: ["T-01", "T-03", "T-17", "T-18", "T-22", "T-26"],
    },
    {
      emoji: "🪥",
      title: "Zähne putzen und Töpfchen",
      searches: ["belohnungstafel zähneputzen", "belohnungstafel töpfchen", "töpfchentraining belohnung", "potty training reward chart"],
      ideas: ["T-10", "T-23", "H-06"],
    },
    {
      emoji: "🌱",
      title: "Belohnung, die verbindet – und das Ende",
      searches: ["belohnungssystem kinder sinnvoll", "belohnungssystem kinder kritik", "belohnung ohne süßigkeiten kinder", "belohnungssystem beenden"],
      ideas: ["T-14", "T-15", "T-16"],
    },
  ],
  games: [
    {
      href: "/belohnungstafel/",
      searches: ["belohnungstafel zum ausdrucken", "belohnungstafel kinder", "belohnungstafel selbst gestalten"],
      title: "Belohnungstafel für Kinder – gestalten und drucken",
    },
    { href: "/zaehne/", searches: ["belohnungstafel zähneputzen", "zähneputzen kinder motivieren"], title: "Zähne putzen mit Tapsi – Lied und Sternentafel" },
  ],
  excluded: [
    { title: "Sterne abziehen oder Strafen", why: "Ratgeber raten klar davon ab; auf der Tafel kann ein Stern nur kurz nach einem Vertippen zurück." },
    { title: "Bildschirmzeit als Belohnung", why: "Passt nicht zu Kleinkindern und nicht zur Spielzeit-Grenze der App (T-21 abgelehnt)." },
    { title: "Süßigkeiten als Standard", why: "Ein Eis steht als letzte Wahl im Katalog; vorne stehen gemeinsame Zeit und Erlebnisse." },
    { title: "Konto, Cloud oder Abo", why: "Alles bleibt auf dem Gerät; der Name des Kindes verlässt den Browser nie." },
    { title: "Magnet-Teile zum Nachbauen", why: "Verschluckungsgefahr unter drei Jahren; der Ausdruck nimmt Ausmalen oder Papier-Sterne mit Klebestift." },
  ],
  ideas: ["H-01", "H-02", "T-12", "T-13", "T-19"],
  sources: [
    {
      label: "familie.de – Belohnungssystem für Kinder: 10 Tipps",
      url: "https://www.familie.de/schulkind/entwicklung-beziehung/belohnungssystem-fuer-kinder-10-tipps-wie-es-funktioniert/",
    },
    {
      label: "familie.de – Belohnungstafel im Test",
      url: "https://www.familie.de/testberichte/belohnungstafel-fuer-kinder-so-funktioniert-das-belohnungssystem--01HDR410GMVDREKD2X7ETVDR75",
    },
    { label: "kita.de – Belohnungssysteme für Kinder", url: "https://www.kita.de/wissen/belohnungssysteme-fuer-kinder/" },
    {
      label: "babyartikel.de – Töpfchentraining mit Belohnung? Lieber nicht",
      url: "https://www.babyartikel.de/magazin/toepfchentraining-mit-belohnung-lieber-nicht%EF%BB%BF",
    },
    { label: "Help Kids Thrive – Seven tips for making a sticker chart", url: "https://helpkidsthrive.substack.com/p/seven-tips-for-making-a-sticker-chart" },
    { label: "Happiest Baby – Reward charts for kids", url: "https://www.happiestbaby.com/blogs/toddler/reward-charts-kids" },
    { label: "Melissa & Doug – Magnetic Responsibility Chart", url: "https://www.melissaanddoug.com/products/magnetic-responsibility-chart" },
    { label: "Joon – Reward ideas for kids", url: "https://joonapp.io/post/10-fun-and-creative-reward-ideas-for-kids" },
    { label: "PottyWhiz – Töpfchen-Belohnungstafel zum Ausdrucken", url: "https://pottywhiz.app/tools/free-printable-potty-training-reward-chart?locale=de" },
    {
      label: "Spektrum Lexikon der Psychologie – Rechtfertigung, übermäßige",
      url: "https://www.spektrum.de/lexikon/psychologie/rechtfertigung-uebermaessige/12591",
    },
  ],
};
