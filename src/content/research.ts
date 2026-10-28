// Research for grown-ups, shown on the hidden page /management/ next to the
// ideas: what was looked up, how, what came out and which ideas it led to.
// Newest first. Idea ids and game addresses are checked in content.test.ts.

/** One topic parents search for, and what the app could answer it with. */
export interface ResearchTopic {
  emoji: string;
  title: string;
  /** Searches as people type them (lower case, like Google suggests them). */
  searches: string[];
  /** Ideas this topic led to, e.g. "H-01". */
  ideas: string[];
}

/** A game that already answers searches, with a page title that would match them. */
export interface ResearchGameMatch {
  /** The game's address from the home menu, e.g. "/zaehne/". */
  href: string;
  searches: string[];
  /** Suggested title for Google. */
  title: string;
}

/** Something left out on purpose, so nobody suggests it again without a reason. */
export interface ResearchExclusion {
  title: string;
  why: string;
}

/** One piece of research with its results. */
export interface Research {
  id: string;
  /** When it was done, YYYY-MM-DD. */
  date: string;
  emoji: string;
  title: string;
  /** What the question was. */
  question: string;
  /** How the answer was found, and how far to trust it. */
  method: string;
  /** The most important results, one sentence each. */
  findings: string[];
  topics: ResearchTopic[];
  games: ResearchGameMatch[];
  excluded: ResearchExclusion[];
  /** Ideas that came out of it besides those of the topics. */
  ideas: string[];
  sources: { label: string; url: string }[];
}

export const RESEARCH: Research[] = [
  {
    id: "belohnungstafel",
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
        ideas: ["T-04", "T-05", "T-06", "T-07", "T-08", "T-20"],
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
        searches: ["belohnungstafel woche", "morgenroutine kinder bilder", "abendroutine kinder bilder", "routine chart toddler"],
        ideas: ["T-01", "T-03", "T-17", "T-18"],
      },
      {
        emoji: "🪥",
        title: "Zähne putzen und Töpfchen",
        searches: ["belohnungstafel zähneputzen", "belohnungstafel töpfchen", "töpfchentraining belohnung", "potty training reward chart"],
        ideas: ["T-10", "H-06"],
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
  },
  {
    id: "toepfchen-oder-hygiene",
    date: "2026-10-26",
    emoji: "🚽",
    title: "Töpfchen oder Hygiene – was wird mehr gesucht?",
    question: "Suchen Eltern bei Google mehr zu „Töpfchen und trocken werden“ oder zu „Hygiene, die das Kind nicht mag“ (Hände, Haare, Nase, Baden)?",
    method:
      "Google Trends war gesperrt (Firmen-Richtlinie im Browser), Zahlen zum Suchvolumen fanden sich im Netz nicht. Stattdessen Google-Autovervollständigung (Deutschland, Deutsch): zehn Eltern-Anfänge wie „kind will nicht“, „kleinkind will nicht“, „kind verweigert“, „kind hasst“, „kind 3 jahre“, je ohne und mit einem Buchstaben a–ü (rund 300 Abfragen), dann die Vorschläge je Thema gezählt; Fremdes wie „trockener husten“ oder „kaut fingernägel“ nicht mitgezählt. Mehr verschiedene und frühere Vorschläge heißen mehr Suchen – ein deutliches Zeichen, aber keine Zahl.",
    findings: [
      "Töpfchen und trocken werden liegt klar vorn: etwa 73 verschiedene Vorschläge gegen etwa 39 für Hygiene, also rund doppelt so viele.",
      "Bei „kleinkind will nicht “ ohne einen Buchstaben schlägt Google schon „aufs töpfchen“ und „auf toilette“ vor, keine Hygiene; bei „kind verweigert “ zweimal Stuhlgang.",
      "Hygiene erscheint ohne Buchstaben nur einmal: „kind hasst haare waschen“ (Platz 4).",
      "Innerhalb der Hygiene führen Baden und Duschen, dann Haare waschen; Hände waschen und Nase putzen kommen seltener.",
      "Eltern suchen beim Töpfchen vor allem das Verweigern: groß machen, Angst vor der Toilette, plötzlich nicht mehr, Windel nicht hergeben.",
    ],
    topics: [
      {
        emoji: "🚽",
        title: "Töpfchen und trocken werden",
        searches: [
          "kleinkind will nicht aufs töpfchen",
          "kind will nicht groß aufs klo",
          "kind angst vor toilette",
          "kleinkind will plötzlich nicht mehr aufs töpfchen",
          "kind will nicht trocken werden",
        ],
        ideas: ["H-06"],
      },
      {
        emoji: "🧼",
        title: "Hygiene, die das Kind nicht mag",
        searches: [
          "kind hasst haare waschen",
          "kind will nicht baden",
          "kind will nicht duschen",
          "kind will nicht hände waschen",
          "kind will nicht nase putzen",
        ],
        ideas: ["H-14", "H-07", "H-08"],
      },
    ],
    games: [],
    excluded: [{ title: "Stuhlgang-Farbe und Verstopfung", why: "Wird oft vorgeschlagen („grüner stuhlgang“), ist aber medizinischer Rat." }],
    ideas: [],
    sources: [],
  },
  {
    id: "google-eltern",
    date: "2026-10-26",
    emoji: "🔍",
    title: "Was Eltern von Kleinkindern bei Google suchen",
    question:
      "Welche Themen und Suchbegriffe von Eltern passen zur App – für neue Spiele, für Werkzeuge für Eltern (z. B. eine Belohnungstafel) und damit Eltern die App finden?",
    method:
      "Google-Autovervollständigung (Deutschland, Deutsch) für rund 70 Anfänge wie „kind will nicht“, „belohnungstafel“, „töpfchen“, „zähne putzen kind“. Sie zeigt, was viele tatsächlich eintippen, aber keine Zahlen; die Reihenfolge der Themen ist eine Einschätzung. Echte Suchvolumen bräuchten den Google Keyword Planner oder ein SEO-Werkzeug.",
    findings: [
      "Google kennt wohl nur die Startseite: Jede Spielseite kommt über 404.html mit Fehlercode 404, und alle Seiten haben denselben Titel und dieselbe Beschreibung (A-19).",
      "Vieles, was Eltern suchen, gibt es schon: Zähne putzen, Bewegungsspiele für drinnen, Tiergeräusche, Gefühle, Lernspiele ab 2.",
      "„zum ausdrucken pdf kostenlos“ hängt an fast jedem Alltags-Thema: Belohnungstafel, Abendroutine, Wochenplan, Schnullerfee-Brief (H-02).",
      "Die großen Alltags-Themen mit zwei bis drei: Routinen, Belohnung, Töpfchen, Warten, Wut, Abschied in der Kita, Schnuller, Geschwisterchen, Arzt.",
      "„kostenlos, ohne Werbung, offline, ab 2“ ist ein Vorteil, den Eltern sogar mitsuchen („einschlafmusik baby ohne werbung“).",
      "Belohnungssysteme sind umstritten (z. B. Jesper Juul). Darum heißt Belohnung hier Mitfreuen: keine Strafen, nichts geht verloren.",
    ],
    topics: [
      {
        emoji: "🌟",
        title: "Belohnung",
        searches: ["belohnungstafel kinder zum ausdrucken pdf kostenlos", "belohnungssystem kinder 3 jahre", "belohnungstafel app"],
        ideas: ["H-01"],
      },
      {
        emoji: "🖨️",
        title: "Zum Ausdrucken",
        searches: ["abendroutine kinder vorlage pdf", "wochenplan kinder symbole zum ausdrucken kostenlos", "schnullerfee brief zum ausdrucken kostenlos"],
        ideas: ["H-02"],
      },
      {
        emoji: "🛁",
        title: "Routinen und Tagesablauf",
        searches: ["abendroutine kinder bilder zum ausdrucken", "tagesablauf kleinkind 2 jahre", "kind will nicht schlafen"],
        ideas: ["H-03"],
      },
      {
        emoji: "⏳",
        title: "Warten und Zeit",
        searches: ["visueller timer kinder online", "sanduhr kinder", "countdown kinder geburtstag", "countdown kindergartenstart"],
        ideas: ["H-04", "H-05"],
      },
      {
        emoji: "🚽",
        title: "Töpfchen und trocken werden",
        searches: ["töpfchen lied", "töpfchen app", "töpfchen mit applaus", "töpfchentraining ab wann", "belohnungssystem kinder toilette"],
        ideas: ["H-06"],
      },
      {
        emoji: "🧼",
        title: "Hygiene, die das Kind nicht mag",
        searches: ["kind verweigert hände waschen", "nase putzen kinder lernen", "kind haare waschen drama"],
        ideas: ["H-07", "H-08", "H-14"],
      },
      {
        emoji: "🎈",
        title: "Wut und Beruhigen",
        searches: ["wutanfall kleinkind 2 jahre", "kind beruhigen bei wutanfall", "atemübungen kinder wut"],
        ideas: ["H-09"],
      },
      {
        emoji: "👋",
        title: "Kita und Abschied",
        searches: ["kita eingewöhnung 2 jährige", "kind weint beim abschied kita", "kind will nicht in den kindergarten"],
        ideas: ["H-10"],
      },
      {
        emoji: "🧚",
        title: "Große Umbrüche",
        searches: ["schnullerfee brief pdf", "kind 2 jahre schnuller abgewöhnen", "geschwisterchen bekommen buch", "kind angst arzt", "kind impfung angst"],
        ideas: ["H-11", "H-12", "H-13"],
      },
      {
        emoji: "🌡️",
        title: "Kleidung nach Temperatur",
        searches: ["kind anziehen 20 grad", "kind anziehen nachts 22 grad", "kind schlafen 22 grad"],
        ideas: ["H-15"],
      },
      {
        emoji: "✈️",
        title: "Unterwegs",
        searches: ["beschäftigung kleinkind flugzeug", "beschäftigung kleinkind auto", "spiele für 2 jährige im flugzeug"],
        ideas: ["H-16"],
      },
      {
        emoji: "🚒",
        title: "Zahnputzlieder",
        searches: ["zahnputzlied feuerwehr", "zahnputzlied krokodil", "zahnputzlied kinder 3 minuten"],
        ideas: ["X-13", "X-01"],
      },
    ],
    games: [
      {
        href: "/zaehne/",
        searches: ["zähne putzen kinder app", "zahnputzlied kinder", "timer kinder zähneputzen"],
        title: "Zähneputzen für Kinder – Zahnputzlied mit Timer",
      },
      {
        href: "/abenteuer/",
        searches: ["bewegungsspiele kleinkinder drinnen", "bewegungsspiele kleinkind 2 jahre", "kinderlieder zum tanzen"],
        title: "Bewegungsspiele für Kleinkinder drinnen",
      },
      { href: "/tiere/", searches: ["tiergeräusche für kinder", "tiergeräusche anhören"], title: "Tiergeräusche für Kinder – Was gehört zum Tier?" },
      { href: "/bilder/", searches: ["tiergeräusche für kinder", "lernspiele für 2 jährige"], title: "Wimmelbilder zum Antippen für Kinder ab 2" },
      { href: "/gefuehle/", searches: ["gefühle kinder erklären", "gefühle kinder material"], title: "Gefühle Kindern erklären – Spiel ab 2" },
      { href: "/buchstaben/", searches: ["zahlen lernen kinder", "kinder lern app ab 2 jahre"], title: "Buchstaben und Zahlen lernen ab 2" },
      { href: "/socken/", searches: ["lernspiele für 2 jährige", "spiele für 2 jährige"], title: "Socken-Paare – erstes Zuordnen ab 2" },
      { href: "/laut-leise/", searches: ["kind spricht sehr laut", "kind sprachentwicklung fördern"], title: "Laut und leise – Stimme spielen ab 2" },
    ],
    excluded: [
      {
        title: "Krankheit (Fieber, Durchfall, Erbrechen)",
        why: "Steht bei „kleinkind …“ ganz oben, ist aber medizinischer Rat und passt nicht zur App.",
      },
      { title: "Aufräumen", why: "„aufräumlied“ wird oft gesucht, das Spiel Aufräumen (N-28) ist aber abgelehnt." },
      { title: "Anziehen fürs Wetter als Spiel", why: "Das Spiel (N-16) ist abgelehnt; H-15 ist nur ein Werkzeug für Eltern." },
    ],
    ideas: ["A-19"],
    sources: [
      {
        label: "familie.de: Belohnungstafel für Kinder",
        url: "https://www.familie.de/testberichte/belohnungstafel-fuer-kinder-so-funktioniert-das-belohnungssystem--01HDR410GMVDREKD2X7ETVDR75",
      },
      { label: "VocoVision: Most Googled Parenting Questions (USA)", url: "https://www.vocovision.com/blog/the-most-googled-parenting-questions-in-america/" },
      { label: "Motherly: Top parenting Google searches 2024 (USA)", url: "https://mother.ly/parenting/top-parenting-google-searches-2024/" },
      { label: "Baby Chick: Top googled parenting questions (USA)", url: "https://www.baby-chick.com/top-googled-parenting-questions/" },
    ],
  },
];
