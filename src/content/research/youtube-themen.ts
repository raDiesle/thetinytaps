import type { Research } from "./types";

export const youtubeThemen: Research = {
  id: "youtube-themen",
  area: "youtube",
  date: "2026-11-21",
  emoji: "🧭",
  title: "Welche neuen Geschichten und Spiele mehr Suchen auf die Seite bringen",
  question:
    "Wenn YouTube-Videos aus den Spielen für die Seite werben: Welche Themen sollten wir als Nächstes anbieten, damit möglichst viele Suchen bei uns landen – zum Beispiel mehrere Geschichten zum Abstillen? Wo suchen Eltern, und wo steht noch kaum jemand?",
  method:
    "Am 21. November 2026 YouTubes Autovervollständigung (suggestqueries.google.com mit ds=yt, hl=de/gl=DE und hl=en/gl=US) für rund 80 Anfänge zu Übergängen im Alltag abgefragt (Abstillen, Fläschchen, Geschwisterchen, Arzt, Zahnarzt, Impfung, Friseur, großes Bett, nachts trocken, Umzug, Einschlafen, Trauer, Trennung …), dann für 17 Suchen YouTubes Ergebnisliste ausgelesen (die ersten fünf Videos mit Aufrufen und Kanal). Alles über eine deutsche Verbindung, die englischen Ergebnisse können deutsch gefärbt sein. Vorschläge zeigen, dass gesucht wird, nicht wie oft; Aufrufe der Treffer zeigen die Konkurrenz, nicht die Nachfrage. Echte Suchvolumen bräuchten ein Werkzeug wie den Keyword Planner. Baut auf der Recherche „Was Eltern auf YouTube suchen“ auf, die die sechs vorhandenen Alltagshelfer schon abdeckt.",
  findings: [
    "Mehrere Abstill-Geschichten lohnen sich nur, wenn jede eine andere Lage trifft, nicht dieselbe Geschichte noch einmal: zwei Videos zur selben Suche nehmen sich gegenseitig die Plätze weg. Die Suchen teilen sich klar in nachts abstillen, die Flasche abgewöhnen und ganz abstillen (das hat die Milchkette schon).",
    "„nachts abstillen“ hat die meisten Vorschläge aller Abstill-Suchen (2 Jahre, 1 Jahr, 1,5 Jahre, nach Gordon, Kleinkind), „night weaning“ zehn auf Englisch. Die Treffer sind Elternvideos (Jay Gordons Plan 387 Tsd., Nicola Schmidt 57 Tsd.); eine Geschichte fürs Kind gibt es auf Deutsch gar nicht, auf Englisch nur kleine Vorlesevideos („Booby Moon“ 63 Tsd., „Sometimes I'm Big“ 47 Tsd.).",
    "Die Flasche erreicht mehr Familien als das Stillen: „bottle weaning 1 year old“, „… 2 year old“, „flasche abgewöhnen nachts“ – das einzige passende Kinderlied hat 2.900 Aufrufe.",
    "„social story“ ist auf Englisch eine Suche für sich, mit festen Anhängseln (going to the doctor, haircut, dentist, potty training, starting kindergarten, sleeping in own bed). Die Kanäle sind klein (Haarschnitt 21 Tsd., Arzt 2 Tsd.), und unsere Kapitelbücher sind schon fast genau das: ruhig, Schritt für Schritt, was gleich passiert.",
    "Geschwisterchen: viel gesucht („geschwisterchen kommt wie erklären“, „new baby story for toddlers“), aber die Treffer sind Reaktions-Shorts von Familien mit Millionen Aufrufen; eine Geschichte fürs Kind ist selten (sigikid „Ella bekommt ein Geschwisterchen“ 31 Tsd.).",
    "Arzt und Zahnarzt: Auf Deutsch steht Bobo beim Kinderarzt (19 Mio.) und „Julia beim Arzt“ (1,4 Mio.), schwer zu schlagen. Beim ersten Zahnarztbesuch sind die Treffer echte Praxis-Videos (1,7–5 Mio.), eine Geschichte für Kleinkinder fehlt – und Zähne putzen ist schon unser Thema.",
    "Großes Bett: „transition to toddler bed“, „big kid bed“, „kind im eigenen bett schlafen lernen“; die großen Treffer sind Lieder (CoComelon 133 Mio.), Geschichten zum Vorlesen gibt es wenige und kleine (Hoots & Tales „Big Kid Bed“ 101 Tsd.), auf Deutsch keine.",
    "Einschlafen ist das größte Feld: „bedtime story for toddlers“ mit „short“, „to sleep“, „no ads“, „low stimulation“, „10 minutes“, „einschlafgeschichten ohne werbung“. Ruhige Videos sind gefragt – das ist unser Stil.",
    "Fast jedes Alltagsthema hat auch ein „… lied“ oder „… song“ (geschwisterchen lied, zahnarzt kinder lied, fieber kinderlied, abschied kita lied): ein kurzes Lied zu einer Geschichte ist ein zweites Video, das auf dieselbe Seite zeigt.",
    "Nachts trocken werden ist kaum besetzt („Last Potty Before Bed“ 7 Aufrufe), aber auch wenig gesucht; es bleibt bei H-95 in Aufs Töpfchen.",
  ],
  topics: [
    {
      emoji: "🌙",
      title: "Nachts abstillen",
      searches: [
        "nachts abstillen 2 jahre",
        "nachts abstillen 1 jahr",
        "kleinkind nachts abstillen",
        "night weaning toddler",
        "night weaning breastfed toddler",
        "night weaning co sleeping toddler",
      ],
      ideas: ["H-104"],
    },
    {
      emoji: "🍼",
      title: "Fläschchen abgewöhnen",
      searches: ["flasche abgewöhnen", "flasche abgewöhnen nachts", "bottle weaning 1 year old", "bottle weaning 2 year old", "toddler bottle weaning"],
      ideas: ["H-105", "Y-35"],
    },
    {
      emoji: "👶",
      title: "Ein Geschwisterchen kommt",
      searches: [
        "geschwisterchen bekommen",
        "geschwisterchen kommt wie erklären",
        "geschwisterchen lied",
        "new baby story for toddlers",
        "new baby sister song",
      ],
      ideas: ["H-12", "Y-35"],
    },
    {
      emoji: "🦷",
      title: "Zahnarzt und Arzt",
      searches: [
        "first dentist visit toddler",
        "zahnarzt kinder angst",
        "zahnarzt geschichte für kinder",
        "zahnarzt kinder lied",
        "kinderarzt spritze",
        "impfung kinder angst",
        "going to the doctor social story",
      ],
      ideas: ["H-107", "H-13", "Y-33"],
    },
    {
      emoji: "🛏️",
      title: "Großes Bett, eigenes Bett",
      searches: [
        "transition to toddler bed",
        "big kid bed",
        "sleeping in own bed social story",
        "kind im eigenen bett schlafen lernen",
        "toddler big bed transition",
      ],
      ideas: ["H-106"],
    },
    {
      emoji: "🧩",
      title: "Social Stories",
      searches: [
        "social story for toddlers",
        "social story haircut",
        "social story dentist visit",
        "social story potty training",
        "starting kindergarten social story",
      ],
      ideas: ["Y-33"],
    },
    {
      emoji: "😴",
      title: "Einschlafen",
      searches: [
        "bedtime story for toddlers",
        "toddler bedtime story low stimulation",
        "bedtime story for toddlers no ads",
        "einschlafgeschichten für kinder",
        "einschlafgeschichten ohne werbung",
      ],
      ideas: ["Y-34", "N-03"],
    },
  ],
  games: [
    {
      href: "/abstillen/",
      searches: ["weaning story for toddlers", "abstillen kleinkind"],
      title: "Weaning Story for Toddlers – Goodbye Milk, Hello Cuddles",
    },
    {
      href: "/kita/",
      searches: ["starting kindergarten social story", "first day of preschool story"],
      title: "First Day of Daycare – Social Story for Toddlers",
    },
    {
      href: "/haare-waschen/",
      searches: ["social story for toddlers", "kind haare waschen drama"],
      title: "Hair Washing Without Tears – Social Story for Toddlers",
    },
  ],
  excluded: [
    {
      title: "Ratgeber-Videos für Eltern („abstillen tipps“, „nach Gordon“)",
      why: "Dort sind die meisten Aufrufe, aber wir sind keine Stillberaterinnen; unsere Videos sind Geschichten fürs Kind, die Seite verweist auf Fachstellen.",
    },
    {
      title: "Dieselbe Geschichte mehrmals zur selben Suche",
      why: "Zwei Videos zur gleichen Suche nehmen sich die Plätze weg; jede neue Geschichte trifft eine eigene Lage (nachts, Flasche, ganz).",
    },
    {
      title: "Reaktions-Shorts („new baby sibling reaction“)",
      why: "Riesige Zahlen, aber echte Familien vor der Kamera – nicht unser Genre und nicht unser Publikum.",
    },
    {
      title: "Trauer, Trennung der Eltern, Krankenhaus",
      why: "Werden gesucht („trennung eltern kindern erklären“, „grief for kids“), sind aber heikel; nur nach einer Recherche aus der Fachliteratur, nicht aus Suchvorschlägen.",
    },
    {
      title: "„ohne Werbung“ oder „no ads“ im Titel",
      why: "Ob YouTube vor einem Kindervideo Werbung zeigt, entscheidet YouTube; der Titel verspräche etwas, das wir nicht in der Hand haben. Die Seite selbst ist ohne Werbung, das darf das Video sagen.",
    },
  ],
  ideas: ["H-104", "H-105", "H-106", "H-107", "Y-33", "Y-34", "Y-35"],
  sources: [
    {
      label: "YouTube-Autovervollständigung (Beispiel „nachts abstillen“)",
      url: "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=de&gl=DE&q=nachts+abstillen",
    },
    { label: "YouTube-Suche „night weaning story for toddlers“", url: "https://www.youtube.com/results?search_query=night+weaning+story+for+toddlers" },
    { label: "YouTube-Suche „abstillen geschichte kinder“", url: "https://www.youtube.com/results?search_query=abstillen+geschichte+kinder" },
    { label: "YouTube-Suche „goodbye bottle song“", url: "https://www.youtube.com/results?search_query=goodbye+bottle+song" },
    { label: "YouTube-Suche „going to the doctor social story“", url: "https://www.youtube.com/results?search_query=going+to+the+doctor+social+story" },
    { label: "YouTube-Suche „haircut social story“", url: "https://www.youtube.com/results?search_query=haircut+social+story" },
    { label: "YouTube-Suche „geschwisterchen geschichte kinder“", url: "https://www.youtube.com/results?search_query=geschwisterchen+geschichte+kinder" },
    {
      label: "YouTube-Suche „first dentist visit for toddler video“",
      url: "https://www.youtube.com/results?search_query=first+dentist+visit+for+toddler+video",
    },
    { label: "YouTube-Suche „big kid bed song“", url: "https://www.youtube.com/results?search_query=big+kid+bed+song" },
  ],
};
