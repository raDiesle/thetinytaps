import type { Research } from "./types";

export const youtubeTimerThemen: Research = {
  id: "youtube-timer-themen",
  area: "youtube",
  date: "2026-11-26",
  emoji: "⏳",
  title: "Timer für Kinder auf YouTube: welche Aufgabe, welches Thema",
  question:
    "Nach welchen Verbindungen aus Timer und Kinderthema suchen Leute auf YouTube am meisten – Timer für eine Aufgabe (Aufräumen, Zähneputzen, Anziehen, Schlafen …) und Timer mit einem Motiv (Rennen, Dino, Jahreszeit …) –, auf Englisch und Deutsch, und was heißt das für den Timer, die Mitsing-Helfer und die Timer-Videos (H-134 bis H-138, Y-09, Y-36)?",
  method:
    "Am 26. November 2026 YouTubes Autovervollständigung (suggestqueries.google.com, client=youtube, ds=yt; hl=en/gl=US und hl=de/gl=DE) für 112 Anfänge abgefragt, jeden auch mit angehängtem Buchstaben und Ziffer (a–z, 0–9): allgemeine („timer for kids“, „5 minute timer“, „classroom timer“, „timer kinder“), Motive („dinosaur timer“, „race timer“, „halloween timer“) und Aufgaben („clean up song“, „toothbrush timer“, „nap time timer“, „aufräumlied“, „zahnputz timer“) – rund 5 400 Abfragen, etwa 12 000 verschiedene Vorschläge. Gezählt wurde, wie viele verschiedene Vorschläge eine Aufgabe oder ein Motiv mit „timer“, „countdown“, „song“ oder „lied“ bekommt und an welcher Stelle sie unter den allgemeinen Anfängen stehen. Das zeigt, was gesucht wird und wie breit, ist aber keine Zahl der Suchen. Die Aufrufzahlen der Treffer ließen sich diesmal nicht lesen: YouTube leitete auf seine Zustimmungsseite um, und die wurde nicht für uns bestätigt; Zahlen zu Aufräumen und Zähneputzen stehen in der Recherche „youtube-suchen“ (21. November 2026). Die Vorschläge hängen an der Jahreszeit (kurz nach Halloween, vor Thanksgiving und Weihnachten) und wurden über eine deutsche Verbindung abgefragt. Wo YouTube zu wenig eigene Suchen hat, füllt es mit allgemeinen Web-Vorschlägen auf („… timer amazon“, „… timer javascript“, „… timer not working“) – ein Zeichen für wenig Nachfrage auf YouTube.",
  findings: [
    "Aufräumen ist mit Abstand die größte Aufgabe für einen Timer: über 600 verschiedene Vorschläge zu „clean up song/timer“ und „tidy up timer“, „5 minute timer clean up“ steht schon unter den ersten 14 Vorschlägen zu „5 minute timer“, und auf Deutsch ist „timer mit musik zum aufräumen“ der zweite Vorschlag zu „timer mit musik“ (dazu „aufräumen timer mit musik“, „aufräumlied kita/kindergarten“).",
    "Aufräumen wird nach Länge gesucht, am häufigsten 5, 10, 3 und 2 Minuten (in dieser Reihenfolge), und oft mit Musik; die Motive dazu sind Spannung („mission impossible“, „bomb“, „roller coaster“) und Jahreszeit („halloween“).",
    "Zähneputzen ist die zweite große Aufgabe: über 400 Vorschläge, fast immer 2 Minuten („toothbrush timer 2 minutes“, „tooth brushing song 2 minutes timer“), und dazu die Figur, die das Kind mag – Bluey, Paw Patrol, Mario, Pokémon, Lego, Frozen, Minecraft, Spider-Man, aber auch Auto, Zug, Lastwagen, Dino und Rennen. Auf Deutsch: „zahnputz timer kinder“, „zahnputz countdown“, „zähneputzen lied dino/feuerwehr/bagger/auto“.",
    "Anziehen und Hände waschen werden als Lied gesucht, nicht als Timer: „getting dressed song (for toddlers)“, „wash your hands song“, „händewaschen lied für kinder“, „anziehen lied kinder“ – „hand washing timer“ und „get dressed timer“ bekommen fast nur Web-Füller.",
    "Schlafen, Mittagsschlaf, Ruhezeit, Essen und Töpfchen als Timer sind dünn: „bedtime timer for toddlers“, „nap time timer“, „quiet time timer“, „snack time timer“ und „potty timer“ gibt es, ihre Vorschläge sind aber meist Web-Füller; gesucht wird dort das Lied („potty time song“, „schlafenszeit kinder lied“) oder ein Ablauf.",
    "Lesen, Hausaufgaben, Mittagspause, Duschen, Übergänge und „brain break“ haben viele Timer-Suchen, aber für Schulkinder und Lehrer – nicht unsere Kinder.",
    "Der allgemeine Timer ist die größte Suche überhaupt („5/10/2 minute timer“), gehört aber den Klassenzimmern: Seine ersten Vorschläge sind „with music for classroom“, „bomb“, „relaxing music“, „no music“, „with alarm“ und die Jahreszeiten (Halloween, Fall, Thanksgiving, Christmas). Motive ohne Aufgabe sind dort Unterhaltung und fremde Marken: Bombe, Achterbahn, Kugelbahn- und Autorennen, Minecraft, Pokémon, Mario, Dino, Ozean, Weltall, Vulkan.",
    "Daraus (Entscheidung des Nutzers, 26. November 2026): Ein allgemeines Timer- oder Countdown-Lied für Kinder ist Quatsch – ein Lied für einen Timer gehört immer zu einer Aufgabe, zuerst zum Aufräumen. H-134 ist verworfen; Mitsing-Helfer (H-135 bis H-138), Timer-Videos (Y-09) und die Reihe Y-36 werden nach der Aufgabe benannt und gebaut, ihre Länge so, wie sie gesucht wird.",
    "Die Reihenfolge der Aufgaben nach Nachfrage: Aufräumen (Timer und Lied) ≫ Zähneputzen (2 Minuten, Lied und Timer) > Anziehen und Hände waschen (als Lied) > Schlafen und Ruhe (als ruhiger Ablauf) > Töpfchen (als Lied, nicht als Timer).",
  ],
  topics: [
    {
      emoji: "🧸",
      title: "Aufräumen",
      searches: [
        "clean up song",
        "clean up timer 5 minutes",
        "clean up song 10 minutes",
        "clean up timer 3 minutes",
        "clean up song and timer",
        "tidy up timer",
        "timer mit musik zum aufräumen",
        "aufräumen timer mit musik",
        "aufräumlied kinder",
      ],
      ideas: ["H-119", "H-135", "Y-09"],
    },
    {
      emoji: "🪥",
      title: "Zähneputzen",
      searches: [
        "toothbrush timer 2 minutes",
        "toothbrush timer kids",
        "tooth brushing song 2 minutes timer",
        "toothbrush timer car",
        "toothbrush timer dinosaur",
        "zahnputz timer kinder",
        "zahnputz countdown",
        "zähneputzen lied dino",
      ],
      ideas: ["Y-06"],
    },
    {
      emoji: "👕",
      title: "Anziehen",
      searches: ["getting dressed song", "getting dressed songs for toddlers", "get dressed timer", "anziehen lied kinder", "schuhe anziehen lied"],
      ideas: ["H-137"],
    },
    {
      emoji: "🧼",
      title: "Hände waschen",
      searches: ["wash your hands song", "washing your hands song for 20 seconds", "händewaschen lied für kinder", "hände waschen lied kinder"],
      ideas: ["H-136", "H-07"],
    },
    {
      emoji: "🌙",
      title: "Schlafen und Ruhe",
      searches: ["bedtime timer for toddlers", "get ready for bed timer", "nap time timer", "quiet time timer", "calm down timer", "schlafenszeit kinder lied"],
      ideas: ["H-138", "H-153", "H-154", "Y-34"],
    },
    {
      emoji: "🏎️",
      title: "Motive ohne Aufgabe",
      searches: [
        "5 minute timer bomb",
        "race timer",
        "marble race timer",
        "roller coaster timer",
        "dinosaur timer",
        "halloween timer",
        "christmas timer",
        "timer 5 minuten achterbahn",
      ],
      ideas: [],
    },
  ],
  games: [
    {
      href: "/timer/",
      searches: ["clean up timer 5 minutes", "timer mit musik zum aufräumen"],
      title: "5 Minute Clean Up Timer for Kids – Tidy Up with Tapsi",
    },
    {
      href: "/zaehne/",
      searches: ["toothbrush timer 2 minutes", "zahnputz timer kinder"],
      title: "2 Minute Toothbrush Timer Song for Kids – Brush Along with Tapsi",
    },
  ],
  excluded: [
    {
      title: "Timer für Schlafen, Mittagsschlaf und Ruhezeit",
      why: "Auf YouTube dünn, und Schlafen endet mit dem Einschlafen oder Aufwachen, nicht mit einer Zeit: Die drei kommen ohne Timer als Teile des Buchs „Schlaf gut“ (H-138, H-153, H-154; Wunsch des Nutzers, 26. November 2026).",
    },
    {
      title: "Ein allgemeines Countdown-Lied für jeden Timer (H-134)",
      why: "Entscheidung des Nutzers, 26. November 2026: Ein Lied ohne Aufgabe ist Quatsch für Kinder; ein Timer-Lied gehört zu einer Aufgabe wie dem Aufräumen. Gesucht wird ohnehin die Aufgabe mit Länge, der allgemeine Timer gehört den Klassenzimmern.",
    },
    { title: "Bombe, „Mission Impossible“, Explosion", why: "Spannung und Schreck, wo die App ruhig bleibt; ein Timer drängt nie zur Eile." },
    {
      title: "Figuren fremder Marken (Bluey, Paw Patrol, Mario, Pokémon, Minecraft …)",
      why: "Nie ein fremder Name, auch nicht im Titel oder als Schlagwort (Recherche „tinyfingers-marke“); unsere Antwort sind eigene Figuren und Fahrzeuge (Tapsi, Auto, Zug, Bagger, Dino).",
    },
    {
      title: "Lese-, Hausaufgaben-, Pausen- und Klassenzimmer-Timer",
      why: "Viel gesucht, aber für Schulkinder und Lehrer, nicht für Kleinkinder mit ihren Eltern.",
    },
  ],
  ideas: ["H-134", "Y-36"],
  sources: [
    {
      label: "YouTube-Autovervollständigung (Beispiel „clean up timer“)",
      url: "https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=en&gl=US&q=clean+up+timer",
    },
    {
      label: "YouTube-Autovervollständigung (Beispiel „timer mit musik“)",
      url: "https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=de&gl=DE&q=timer+mit+musik",
    },
    { label: "YouTube-Suche „clean up timer 5 minutes“", url: "https://www.youtube.com/results?search_query=clean+up+timer+5+minutes" },
    { label: "YouTube-Suche „toothbrush timer 2 minutes“", url: "https://www.youtube.com/results?search_query=toothbrush+timer+2+minutes" },
    { label: "YouTube-Suche „timer mit musik zum aufräumen“", url: "https://www.youtube.com/results?search_query=timer+mit+musik+zum+aufr%C3%A4umen" },
  ],
};
