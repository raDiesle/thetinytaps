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

/** One address checked for a domain research: which endings were free, and how well it fits. */
export interface ResearchDomain {
  /** The name without ending, e.g. "tapsiland". */
  name: string;
  /** 1 is the best; same number, same fit. */
  rank: number;
  /** Endings that were free on the research date, e.g. ["de", "com"]. */
  free: string[];
  /** Endings already registered by someone. */
  taken: string[];
  /** Why it is ranked so, in one or two sentences. */
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
  /** For a domain research: the addresses checked, best first. */
  domains?: ResearchDomain[];
}

export const RESEARCH: Research[] = [
  {
    id: "domain",
    date: "2026-10-29",
    emoji: "🌐",
    title: "Welche Domain? Name, Suche und was noch frei ist",
    question:
      "Welche Adresse passt zu allem, was die App heute kann (Wimmelbilder, Bewegungsabenteuer mit dem Fuchs Tapsi, Gefühle, Kettenreaktion, Zuordnen, Buchstaben und Zahlen, Zähne putzen, Töpfchen, Belohnungstafel, Tagesplan, Laut und leise – offline, ohne Werbung und Konto), hilft bei Google, bleibt Eltern im Kopf und ist noch zu haben?",
    method:
      "Verfügbarkeit am 29. Oktober 2026 für 57 Namen mit je sechs Endungen (.de, .com, .app, .net, .eu, .io) über die Register selbst abgefragt: RDAP von DENIC, Verisign und Google Registry, whois von EURid und NIC.io; die .de-Treffer zusätzlich im DENIC-whois bestätigt. „Frei“ heißt nur: nicht registriert – Premium-Preise oder gesperrte Namen zeigt das nicht, und frei ist es nur bis jemand anderes kauft. Dazu rund 30 Abfragen der Google-Autovervollständigung (Deutschland, Deutsch) und sechs Websuchen zu Googles Aussagen über Domains, zu Länder-Endungen, Namensregeln und Marken. Markenregister (DPMA, EUIPO) sind nicht durchsucht – das steht vor dem Kauf noch aus.",
    findings: [
      "Wörter in der Domain bringen bei Google keinen Vorsprung: John Mueller (Google) sagt seit 2011 immer wieder, eine Keyword-Domain sei kein Rankingfaktor; das EMD-Update 2012 hat dünne Keyword-Domains sogar abgewertet. Was zählt, sind die Seiten selbst (Titel und Texte in seo.ts) und Erwähnungen – ein Name, den Eltern sich merken und wieder eintippen, baut genau das auf.",
      "Eltern suchen nach dem, was die App ist, nicht nach einem Namen: „spiele für kleinkinder (online, kostenlos, ab 2 jahren)“, „kleinkind spiele app“, „kinderspiele ab 2 online kostenlos“, „app für kleinkinder offline“, „wimmelbild app ohne werbung“, „erste spiele ab 2“. Diese Wörter gehören in Seitentitel und Texte; als Domain wären sie lang, mit Bindestrich oder Zahl, und nicht zu schützen.",
      "„spiele-ab-2“ ist doppeldeutig: Google ergänzt es sofort zu „spiele ab 2 personen“ (Brettspiele zu zweit). Bindestrich und Zahl fallen außerdem beim Vorlesen durch – wer den Namen einmal hört, tippt ihn falsch.",
      "Der jetzige Name passt schlecht: „TinyTap“ ist eine bekannte Lern-App für Kinder (TinyTap Ltd., seit 2022 bei Animoca Brands) mit eingetragener US-Wortmarke für Software und Bildung (Klassen 9 und 41, seit 2014) – „The Tiny Taps“ liegt einen Buchstaben daneben. Google ergänzt „tiny taps“ zu einer Bar in Chicago und Zapfanlagen; deutsche Eltern verstehen „taps“ nicht, und „The“ ist ein Füllwort, das beim Tippen vergessen wird.",
      "Tapsi trägt den Namen schon: Der Fuchs führt durch Bewegungsabenteuer, Zähne putzen und Töpfchen, und „tapsig“ ist im Deutschen genau, wie Zweijährige laufen – Eltern verstehen es sofort, man schreibt es, wie man es hört. „tapsi“ allein ist überall vergeben und wird auch anders benutzt (die Katze in HABAs „Tapsi, Flo & Co“, 2023; Überraschungsei-Schildkröten von 1992; Pflaster), als Zusammensetzung aber frei.",
      "„Tapsiland“ ist auf allen sechs Endungen frei, 9 Buchstaben, ohne Bindestrich, auf Deutsch und Englisch gleich auszusprechen und groß genug für alle Spiele und für neue – deshalb Platz 1. „Tapsiwelt“ und „Tapsispiele“ sind ebenso frei, aber nur auf Deutsch verständlich bzw. länger.",
      "Endung: Alle Suchmaschinen-Seiten sind Deutsch (seo.ts), also .de als Hauptadresse – sie zielt bei Google auf Deutschland und ist die Endung, der deutsche Eltern am meisten trauen. .com und .app gelten bei Google als allgemein ohne Land; sie dazu kaufen und auf .de umleiten, als Reserve für den Tag, an dem andere Sprachen eigene Seiten bekommen. .app erzwingt HTTPS, was GitHub Pages kann. .io und .net sagen Eltern nichts.",
      "Eine Keyword-Domain wie kleinkindspiele.de (frei, .com vergeben) kann man billig sichern und umleiten, nur damit sie kein Nachahmer bekommt; Suchplätze bringt die Umleitung nicht.",
      "Umzug früh machen: Gespeichertes hängt an der Adresse – Einstellungen, Sterne der Belohnungstafel, Spielzeit und die installierte App bleiben bei radiesle.github.io zurück und fangen auf der neuen Domain leer an. Technisch reicht in GitHub Pages die eigene Domain (GitHub leitet die alte Adresse um) und im Bau SITE_ORIGIN mit PUBLIC_BASE_PATH „/“ statt „/<repo>“.",
      "Vor dem Kauf noch prüfen: Wortmarken „Tapsi“ und „Tapsiland“ im DPMA-Register und bei der EUIPO (Klassen 9, 28, 41), sowie ob die Namen bei App-Stores und sozialen Netzen frei sind.",
    ],
    topics: [
      {
        emoji: "🔎",
        title: "Was Eltern suchen (gehört in Titel, nicht in die Domain)",
        searches: [
          "spiele für kleinkinder",
          "spiele für kleinkinder ab 2 jahren online kostenlos",
          "kleinkind spiele app",
          "kinderspiele ab 2 online kostenlos",
          "app für kleinkinder offline",
          "wimmelbild app ohne werbung",
          "erste spiele ab 2",
        ],
        ideas: [],
      },
      {
        emoji: "🏷️",
        title: "Namen, die schon jemand trägt",
        searches: ["tinytap", "tiny taps app", "tapsi katjes", "tapsi pflaster", "tapsi törtels"],
        ideas: [],
      },
    ],
    games: [],
    excluded: [
      { title: "Umlaute in der Domain (kleinkindspiele-für-…)", why: "Werden als xn--… angezeigt und geteilt und auf englischen Tastaturen nicht getippt." },
      { title: "Zahlen und Bindestriche (spiele-ab-2.de)", why: "Fallen beim Vorlesen durch, und „spiele ab 2“ heißt bei Google auch Brettspiele zu zweit." },
      {
        title: "Domain mit „TinyTap“ (tinytaps.eu, tinytaps.io)",
        why: "Fast die Marke einer bekannten Kinder-Lern-App – Verwechslung und Ärger, keine Suchplätze.",
      },
    ],
    ideas: [],
    sources: [
      {
        label: "Google Search Central – Mehrsprachige und regionale Websites",
        url: "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
      },
      {
        label: "Search Engine Roundtable – Keywords in der Domain sind nicht nötig (Mueller)",
        url: "https://www.seroundtable.com/google-keywords-domain-unnecessary-18667.html",
      },
      { label: "Search Engine Journal – Ist der Domainname ein Rankingfaktor?", url: "https://www.searchenginejournal.com/ranking-factors/domain-name/" },
      { label: "Saw.com – Der Radio-Test für Domainnamen", url: "https://saw.com/blog/en/articles/saw-video-the-radio-test" },
      { label: "Trademark-Verzeichnis – TINYTAP (US 85972963)", url: "https://trademarkdir.com/trademark/tinytap-85972963" },
      { label: "App Store – TinyTap: Kids' Learning Games", url: "https://apps.apple.com/DE/app/id493868874" },
    ],
    domains: [
      {
        name: "tapsiland",
        rank: 1,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Der Fuchs der App plus „Land“ für alle Spiele; deutsch wie englisch verständlich, 9 Buchstaben, schreibt sich, wie man es hört. Hauptadresse .de, dazu .com.",
      },
      {
        name: "tapsiwelt",
        rank: 2,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Gleich gut auf Deutsch, aber „welt“ sagt Kindern und Eltern anderer Sprachen nichts. Gute Reserve.",
      },
      {
        name: "tapsispiele",
        rank: 3,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Name und „Spiele“ in einem – klar, aber 11 Buchstaben und nur deutsch; Belohnungstafel und Tagesplan sind keine Spiele.",
      },
      {
        name: "erstespiele",
        rank: 3,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Trifft „erste spiele ab 2“, ist aber kaum zu unterscheiden von HABAs Reihe „Meine ersten Spiele“ (meine-ersten-spiele.de ist vergeben).",
      },
      {
        name: "kleinkindspiele",
        rank: 4,
        free: ["de", "app", "net", "eu", "io"],
        taken: ["com"],
        why: "Genau ein Suchwort, aber ohne Vorsprung bei Google, nicht als Marke zu schützen und wie ein Portal. Höchstens billig sichern und umleiten.",
      },
      {
        name: "kleinkinderspiele",
        rank: 4,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Google ergänzt „kleinkindspiele“ hierzu; sonst wie kleinkindspiele.",
      },
      {
        name: "tipptapsi",
        rank: 5,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Tippen und Tapsi, verspielt – aber beim Hören unklar, ob „tip“ oder „tipp“.",
      },
      {
        name: "tappsiland",
        rank: 5,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Häufiger Tippfehler von Tapsiland; nur als Umleitung, wenn Tapsiland gekauft wird.",
      },
      {
        name: "thetinytaps",
        rank: 6,
        free: ["de", "com", "app", "net", "eu", "io"],
        taken: [],
        why: "Der jetzige Name, überall frei – aber nah an der Marke TinyTap, „taps“ verstehen deutsche Eltern nicht, und „the“ wird vergessen.",
      },
      {
        name: "tinytaps",
        rank: 7,
        free: ["eu", "io"],
        taken: ["de", "com", "app", "net"],
        why: "Fast überall vergeben, und noch näher an TinyTap.",
      },
      {
        name: "tapsi",
        rank: 7,
        free: [],
        taken: ["de", "com", "app", "net", "eu", "io"],
        why: "Überall vergeben.",
      },
    ],
  },
  {
    id: "tagesplan",
    date: "2026-10-28",
    emoji: "🗓️",
    title: "Tagesplan und Strukturtafel – wonach Eltern suchen",
    question: "Suchen Eltern von Zwei- und Dreijährigen nach Tagesplänen in Bildern (Strukturtafel, Tagesablauf, Wochenplan), und in welcher Form?",
    method:
      "Google-Autovervollständigung (Deutschland, Deutsch) für 26 Anfänge wie „tagesablauf kinder“, „strukturtafel“, „wochenplan kinder“, „routinekarten“, „first then board“, „visual schedule toddler“, am 28. Oktober 2026. Sie zeigt, was viele eintippen, aber keine Zahlen.",
    findings: [
      "Gesucht wird in Bildern und zum Ausdrucken: „tagesablauf kindergarten bildkarten (pdf)“, „bildkarten tagesablauf kostenlos ausdrucken“, „piktogramme tagesablauf kinder“, „routinekarten kinder pdf kostenlos“.",
      "Morgen und Abend sind eigene Suchen: „morgenroutine kinder bilder zum ausdrucken“, „abendroutine kinder vorlage“, „ablaufplan morgenroutine kinder“.",
      "Der Wochenplan ist eine Tafel mit Symbolen, oft magnetisch: „wochenplan kinder symbole zum ausdrucken kostenlos“, „wochenplan kinder magnet (selber machen)“, „wochenplaner kinder montessori“.",
      "Nach dem Alter: „tagesablauf kleinkind 2 jahre“, „… 18 monate“, „… 3 jahre“ – Eltern suchen, wie ein Tag in dem Alter aussieht.",
      "„Strukturtafel“ selbst wird kaum gesucht (nur „strukturtafel kinder“); „Erst-dann-Karten“ kennt man vor allem aus METACOM, auf Englisch ist das „first then board“ (printable, autism, ABA) häufig.",
      "Darum: ein Tagesplan mit Vorlagen (Morgen, Abend, Tag mit Kita, Erst–Dann, Wochenplan), auf dem Bildschirm zum Abtippen und gedruckt mit allen Bildern als Karten zum Ausschneiden.",
    ],
    topics: [
      {
        emoji: "🃏",
        title: "Bildkarten zum Ausdrucken",
        searches: [
          "tagesablauf kindergarten bildkarten pdf",
          "bildkarten tagesablauf kostenlos ausdrucken",
          "piktogramme tagesablauf kinder",
          "routinekarten kinder pdf kostenlos",
        ],
        ideas: ["H-03", "T-20", "H-42"],
      },
      {
        emoji: "🌅",
        title: "Morgen- und Abendroutine",
        searches: ["morgenroutine kinder bilder zum ausdrucken", "abendroutine kinder vorlage", "ablaufplan morgenroutine kinder", "routineplan kinder"],
        ideas: ["H-03", "H-43"],
      },
      {
        emoji: "📅",
        title: "Wochenplan mit Symbolen",
        searches: ["wochenplan kinder symbole zum ausdrucken kostenlos", "wochenplan kinder magnet", "wochenplaner kinder montessori", "kinderplaner woche"],
        ideas: ["H-41"],
      },
      {
        emoji: "➡️",
        title: "Erst – Dann",
        searches: ["erst dann karten", "first then board", "first then board printable"],
        ideas: ["H-03"],
      },
    ],
    games: [
      {
        href: "/tagesplan/",
        searches: ["tagesablauf kinder", "tagesplan kinder bilder", "wochenplan kinder", "morgenroutine kinder bilder"],
        title: "Tagesplan für Kinder – Tag und Woche in Bildern",
      },
    ],
    excluded: [
      {
        title: "Uhrzeiten auf den Karten",
        why: "Zweijährige lesen keine Uhr; die Reihenfolge und „Jetzt – Dann“ zählen, die Woche zählt Monde bis zu einem Tag.",
      },
      { title: "Kleine Magnete", why: "Verschluckungsgefahr unter drei Jahren; die gedruckten Karten sind groß und halten mit Klett." },
    ],
    ideas: ["H-41", "H-42", "H-43"],
    sources: [],
  },
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
