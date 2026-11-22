import type { Research } from "./types";

export const youtubeSuchen: Research = {
  id: "youtube-suchen",
  area: "youtube",
  date: "2026-11-21",
  emoji: "🔎",
  title: "Was Eltern auf YouTube suchen – und wer dort schon steht",
  question:
    "Mit welchen Wörtern suchen Eltern auf YouTube nach Videos zu den Alltagshelfern (Zähne putzen, Töpfchen, Timer, Schnullerfee, Abstillen, Kita-Start), auf Englisch und Deutsch, wie groß ist die Konkurrenz, und welche Titel sollen unsere Videos tragen? (Y-18)",
  method:
    "Am 21. November 2026 YouTubes Autovervollständigung (suggestqueries.google.com mit ds=yt, hl=en/gl=US und hl=de/gl=DE) für Anfänge wie „tooth brushing“, „töpfchen“, „timer für kinder“ abgefragt, dazu je Thema YouTubes Suche ausgelesen (die größten Videos mit Aufrufen). Alles über eine deutsche Verbindung, die englischen Ergebnisse können deutsch gefärbt sein; einige Vorschläge kamen mit einem anderen Typ zurück und sind vielleicht keine reinen YouTube-Suchen. Die Reihenfolge der Vorschläge heißt mehr Suchen, ist aber keine Zahl.",
  findings: [
    "Zähne putzen, Töpfchen und Timer sind von Riesen besetzt: Super Simple Songs „Brush Your Teeth“ 162 Mio., Cocomelon „Potty Training Song“ 448 Mio., PLEXKITS „5 Minute Clean up Song“ 34 Mio. Aufrufe – dort zählt ein Titel, der genau die Suche trifft, und die Reihe.",
    "Schnullerfee, Abstillen und Kita-Start haben echten Bedarf und kaum Konkurrenz: die größte Schnullerfee ist Sesame Street mit 1,2 Mio., auf Deutsch um 30–70 Tsd.; eine Abstill-Geschichte für Kinder fand sich auf Deutsch gar nicht.",
    "Ruhige Timer für Kinder auf Deutsch fehlen: Wer „timer für kinder“ sucht, bekommt englische Videos.",
    "Eltern suchen nach Länge („tooth brushing song 2 minutes“, „5 minute timer for kids“) und nach Zweck („clean up timer“, „aufräum timer mit musik“): Länge und Zweck gehören in den Titel.",
    "Deutsche Zahnputz-Suchen hängen oft eine Figur an (dino, bagger, feuerwehr, krokodil) – ein Hinweis für Shorts mit Kettenreaktion oder Fahrzeugen.",
    "„daycare story“ ist auf YouTube von einem Roblox-Spiel belegt; „first day of daycare story for toddlers“ trifft dagegen nur kleine, neue Kanäle.",
    "Die Titel unter „Gibt es schon“ übernimmt die Video-Seite als „📝 Text für YouTube“ (`src/video/youtubeTexts.ts`); beim Zähneputzen „Brush Along with Tapsi“. Eine eigene Fassung von genau 2 Minuten gibt es nicht: Das gesungene Putzen dauert gut 2 Minuten, und ungefähr 2 Minuten sind 2 Minuten (Entscheidung des Nutzers, 22. November 2026).",
  ],
  topics: [
    {
      emoji: "🪥",
      title: "Zähne putzen",
      searches: [
        "toothbrushing song for kids",
        "tooth brushing song 2 minutes",
        "tooth brushing video for toddlers",
        "brush your teeth song",
        "zähne putzen lied kinder",
        "zahnputzlied",
        "zähneputzen für kinder video",
      ],
      ideas: ["Y-06"],
    },
    {
      emoji: "🚽",
      title: "Töpfchen",
      searches: [
        "potty training song",
        "potty training videos for toddlers",
        "potty song",
        "töpfchen lied",
        "töpfchentraining lied",
        "töpfchentraining video für kinder",
        "töpfchen mit musik",
      ],
      ideas: ["Y-07", "Y-23", "Y-29"],
    },
    {
      emoji: "⏳",
      title: "Timer",
      searches: [
        "visual timer for kids",
        "5 minute timer for kids",
        "clean up timer 5 minutes",
        "timer für kinder",
        "countdown kinder 5 minuten",
        "aufräum timer mit musik",
        "visueller timer",
      ],
      ideas: ["Y-09"],
    },
    {
      emoji: "🧚",
      title: "Schnullerfee",
      searches: ["pacifier fairy story", "binky fairy story", "bye bye pacifier song", "schnullerfee", "schnuller abgewöhnen geschichte", "schnullerfee lied"],
      ideas: ["Y-08"],
    },
    {
      emoji: "🍼",
      title: "Abstillen",
      searches: ["weaning story", "weaning story book", "abstillen kleinkind", "abstillen mit 2 jahren"],
      ideas: ["Y-08"],
    },
    {
      emoji: "🎒",
      title: "Kita-Start",
      searches: [
        "first day of preschool story",
        "first day of daycare song",
        "kindergarten first day read aloud",
        "kita eingewöhnung",
        "erster tag kindergarten",
        "kita geschichten",
      ],
      ideas: ["Y-08"],
    },
  ],
  games: [
    {
      href: "/zaehne/",
      searches: ["toothbrushing song for kids", "zähne putzen lied kinder"],
      title: "Brush Your Teeth Song for Kids – Brush Along with Tapsi",
    },
    { href: "/toepfchen/", searches: ["potty training song", "töpfchen lied"], title: "Potty Training Song for Toddlers – Potty Time with Tapsi" },
    { href: "/timer/", searches: ["5 minute timer for kids", "timer für kinder"], title: "5 Minute Visual Timer for Kids – Calm Clean Up Countdown" },
    { href: "/schnullerfee/", searches: ["pacifier fairy story", "schnullerfee"], title: "Pacifier Fairy Story for Toddlers – Bye Bye Pacifier" },
    { href: "/abstillen/", searches: ["weaning story", "abstillen kleinkind"], title: "Weaning Story for Toddlers – Goodbye Milk, Hello Cuddles" },
    { href: "/kita/", searches: ["first day of preschool story", "kita eingewöhnung"], title: "First Day of Daycare Story for Toddlers – See You Later!" },
  ],
  excluded: [
    { title: "„daycare story“ im Titel", why: "Auf YouTube der Name eines Roblox-Spiels." },
    {
      title: "Titel voller Schlagwörter",
      why: "YouTube Kids schließt sie aus (siehe die Recherche zu Rechten); ein Titel nennt eine Suche und den Namen der Reihe.",
    },
  ],
  ideas: ["Y-18", "Y-10"],
  sources: [
    {
      label: "YouTube-Autovervollständigung (Beispiel)",
      url: "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&gl=US&q=potty+training",
    },
    { label: "YouTube-Suche „toothbrushing song for kids“", url: "https://www.youtube.com/results?search_query=toothbrushing+song+for+kids" },
    { label: "YouTube-Suche „töpfchen lied“", url: "https://www.youtube.com/results?search_query=t%C3%B6pfchen+lied" },
    { label: "YouTube-Suche „timer für kinder“", url: "https://www.youtube.com/results?search_query=timer+f%C3%BCr+kinder" },
    { label: "YouTube-Suche „schnullerfee“", url: "https://www.youtube.com/results?search_query=schnullerfee" },
    { label: "YouTube-Suche „first day of preschool story“", url: "https://www.youtube.com/results?search_query=first+day+of+preschool+story" },
  ],
};
