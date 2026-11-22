import type { IdeaArea } from "./types";

/**
 * H as well, for the sing-along helpers: songs that carry a step of the day the way the Zahnputzlied carries the
 * brushing. They share the prefix with the Alltagshelfer and the Timer, since they are everyday helpers too – a new
 * H idea takes the next free number of all three files.
 */
export const songHelpersIdeas: IdeaArea = {
  key: "H-lieder",
  prefix: "H",
  emoji: "🎶",
  title: "Mitsing-Helfer (Lieder für den Alltag)",
  intro:
    "Lieder, die einen Handgriff des Tages tragen, so wie das Zahnputzlied das Putzen: eine Strophe pro Schritt, das Bild folgt dem Lied (die Strophen gemessen mit `bun run song` / `song:verses`), es läuft ohne Tippen, spielt auch bei „Musik aus“, weil es das Spiel selbst ist, und singt in der App-Sprache. Jedes ist zugleich ein Mitmach-Video für YouTube (Bereich Y). Gesammelt am 22. November 2026 auf Wunsch des Nutzers, der dafür ein weiteres Suno-Abo nutzen will: Qualität statt Masse – wenige, sehr gut gemachte Helfer, die wie ein Spiel aussehen, am liebsten in 3D. Dafür hat die App schon alles: die 3D-Bühne von Bewegungsabenteuer (three.js, Licht, Himmel, Schatten, Tapsi als bewegliche Figur mit Umriss, eine Uhr, die springen kann). Geld sparen durch Wiederverwenden: Ein Lied dient mehrfach (App, Video, Short, Tagesplan, andere Längen), alle Lieder haben denselben Stil (H-140), und ein Lied, das schon etwa so lang ist wie gewünscht, bekommt keine zweite Fassung nur für die Länge (ungefähr 5 Minuten sind 5 Minuten). Die Lieder macht der Nutzer später mit Suno Pro oder Premier (nur dann dürfen sie auf YouTube, Y-31); bis dahin kann das Bild schon gebaut werden und läuft im Dev-Server zu einem Platzhalter-Takt, für Spieler bleibt es `unfinished`. Empfehlung der Reihenfolge: zuerst das Countdown-Lied (H-134, die meiste Wiederverwendung), als erstes 3D-Bild das Händewaschen (H-136, das kürzeste und billigste Lied, prüft die Bühne H-139), dann Aufräumen in 3D (H-135).",
  ideas: [
    {
      id: "H-134",
      emoji: "⏱️",
      title: "Das Countdown-Lied: „Noch fünf Minuten“ (Empfehlung zuerst)",
      text: "Ein fröhliches, allgemeines Lied von etwa 5 Minuten, das singt, wie viel Zeit noch bleibt, ohne zu sagen wofür: Jede Minute ist eine Strophe mit eigener Klangfarbe (erst Ukulele, dann Glockenspiel, Marimba …), und ihr Refrain singt die Zahl („Noch vier Minuten – wir machen weiter!“). In der letzten Minute wird es ruhiger, die letzten Sekunden zählt das Lied mit, am Ende ein „Geschafft!“ und der Schlussakkord. Weil jede Strophe eine Minute ist, beginnt ein 3-Minuten-Timer einfach bei der Strophe „Noch drei Minuten“: ein Lied je Sprache für 1, 2, 3, 4 und 5 Minuten. Es läuft im Timer unter jedem Bild als Wahl „mit Lied“ (Zug, Sanduhr, Kerze, Klötzchenhaus, Schatztunnel, Hüpf zur Fahne …), und die Länge des Timers ist die gemessene Länge der Strophen, nicht auf die Sekunde. Der Text drängt nie („schnell, schnell“ nie), er macht Mut und zählt nur. Für Suno: gleichmäßiges Tempo (120 BPM: 30 Takte sind eine Minute), jede Strophe gleich lang, der Refrain mit der Zahl immer an derselben Stelle.",
      why: "Kein Lied lässt sich öfter verwenden: Sieben Lieder (eins pro Sprache) machen jedes vorhandene und künftige Timer-Bild in fünf Längen zu einem Mitsing-Timer – fürs Aufräumen, Anziehen, Warten aufs Essen und „noch 5 Minuten spielen“, in der App und als YouTube-Video (Y-09 bekommt Musik: „5 minute timer with music“ und „aufräum timer mit musik“ gehören zu den großen Suchen). Billiger als H-57s ein Lied pro Länge, und die Spiel-Video-Bilder des Timers (H-125 bis H-132) bekommen damit den Ton, der ihnen fehlt.",
      effort: "M",
    },
    {
      id: "H-135",
      emoji: "🧸",
      title: "Aufräumen in 3D: Tapsis Kinderzimmer",
      text: "Ein gemütliches Kinderzimmer in 3D, schräg von oben wie in einem Aufbauspiel, warmes Licht durchs Fenster, weiche Schatten. Tapsi (die 3D-Figur aus Bewegungsabenteuer, in Pulli und Hose) räumt Strophe für Strophe eine Sorte auf: die Bausteine hüpfen in hohem Bogen in ihre Kiste und der Deckel klappt zu, die Autos rollen in ihre Garage, die Bälle springen in den Korb, die Kuscheltiere kuscheln sich ins Bett, die Bücher stellen sich ins Regal. Mit jeder Sorte wird mehr vom Teppich darunter sichtbar (eine Straße, wie H-122), und am Ende plumpst Tapsi zufrieden auf den freien Teppich. Die Kamera schwenkt langsam zur Ecke, die gerade dran ist. In der App lässt ein Tippen auf ein Spielzeug es wackeln und klingen, die Zeit folgt aber dem Lied. Zwei Fassungen zum Wählen: zum Countdown-Lied (H-134, kostet nichts extra) oder zu einem eigenen Aufräumlied (H-119), dessen Strophen die Spielsachen beim Namen nennen.",
      why: "„Clean up song“ und „Aufräumlied“ gehören zu den meistgesuchten Kinderliedern überhaupt. In 3D sieht es aus wie ein Spiel, das große Geschwister kennen, und das Kind räumt dabei sein echtes Zimmer auf – das Zimmer im Bild ist der Fortschritt, ganz ohne Uhr.",
      effort: "L",
    },
    {
      id: "H-136",
      emoji: "🧼",
      title: "Hände waschen in 3D, ein Lied von 30 Sekunden",
      text: "Tapsi steht auf einem Hocker an einem 3D-Waschbecken: Ärmel hoch, Wasser an, nass machen, Seife pumpen, und der Schaum wächst über die Pfoten, mit Seifenblasen, die im Licht schillern. Reiben wie in der Kita gelernt – Handflächen, Handrücken, zwischen den Fingern, Daumen, Fingerspitzen –, eine Zeile pro Schritt, und kleine Schmutzmonster auf den Pfoten lösen sich im Schaum auf wie die Zuckermonster beim Zähneputzen. Abspülen, Wasser aus, Handtuch, und die sauberen Pfoten glänzen. Das 3D-Gegenstück zu H-07. Das Lied ist 20–30 Sekunden kurz, die Schritte gesungen.",
      why: "Das kürzeste und damit billigste Lied, und es wird viermal gebraucht: allein in der App, als Schritt „Hände waschen“ bei Aufs Töpfchen (H-90), als Karte im Tagesplan und vor dem Essen. Auf YouTube ist „wash your hands song“ das ganze Jahr gefragt, und 30 Sekunden passen genau in ein Short. Als erstes 3D-Bild prüft es die Bühne (H-139) mit wenig Aufwand: ein Raum, eine Figur, Pfoten, die es schon gibt.",
      effort: "M",
    },
    {
      id: "H-137",
      emoji: "👕",
      title: "Anziehen in 3D: Stück für Stück",
      text: "Morgens vor dem Schrank: Tapsi im Schlafanzug, und Strophe für Strophe kommt ein Stück aus dem Schrank geflogen – Unterhemd, Hose, Socken, Pulli, zuletzt Jacke und Schuhe. Tapsi macht die Bewegung, die das Kind gleich mitmacht (ein Bein rein, das andere Bein rein, Kopf durch, Arm für Arm), und das Stück legt sich passend um den Körper wie in einem Anzieh-Spiel – ohne Stoff-Simulation: jedes Teil ist eine Hülle, die sich von den Füßen nach oben oder vom Kopf nach unten über die Figur schiebt. Am Ende steht Tapsi angezogen vor dem Spiegel, und die Tür nach draußen geht auf. Die Strophen nennen die Bewegungen, nicht die Kleider, so passt dasselbe Lied später auch zu Regenjacke und Gummistiefeln oder zum Schneeanzug (nur andere Teile im Bild).",
      why: "Anziehen ist an vielen Morgen der größte Kampf, und „getting dressed song“ wird gesucht. Die Kleider, die dafür auf Tapsis Figur entstehen, braucht auch jede andere 3D-Geschichte (Fuchs und Bär tragen immer Kleidung).",
      effort: "L",
    },
    {
      id: "H-138",
      emoji: "🌙",
      title: "Gute-Nacht-Ablauf in 3D, ganz ruhig",
      text: "Ein langsames, leises Lied für den Abend, eine Strophe pro Schritt: Schlafanzug an, Zähne putzen (kurz, nur als Erinnerung), aufs Töpfchen, ein Buch, kuscheln, Licht aus. Ein Kinderzimmer in der Dämmerung, eine Lampe mit warmem Licht, das in 3D wirklich scheint und Schatten wirft; draußen gehen im Fenster die Sterne an, der Mond steigt. Die Kamera bewegt sich kaum, nichts blinkt, die Farben werden mit jeder Strophe gedämpfter. Am Ende geht die Lampe aus, das Zimmer wird dunkelblau, ein Nachtlicht malt Sterne an die Decke, und das Lied klingt aus.",
      why: "Einschlafen ist das größte Feld überhaupt („bedtime routine song“, „calm“, „low stimulation“, Y-34), und Licht in der Dunkelheit ist, was 3D viel schöner kann als eine Zeichnung. Die Strophen passen zu den Abendkarten des Tagesplans, der so zu jeder Karte ihre Strophe spielen kann; zusammen mit N-03 ein ruhiges Ende des Tages.",
      effort: "L",
    },
    {
      id: "H-139",
      emoji: "🎬",
      title: "Eine 3D-Bühne für alle Mitsing-Helfer",
      text: "Was H-135 bis H-138 teilen, einmal gebaut: die Bühne aus Bewegungsabenteuer (`three/stage.ts`: Renderer, Licht, Schatten), Tapsis Figur mit ihren Gelenken, Bewegungen und Umriss (`three/guide.ts`, `clips/`, `contour.ts`) und die Uhr des Spielers (`three/player.ts`, mit Springen und Pause) – angetrieben von den gemessenen Strophenanfängen des Lieds, wie Zähne putzen es mit `sung.ts` macht. Dazu ein kleiner Baukasten für Zimmer (Wände, Boden, Fenster, Möbel als zusammengefügte Teile, `mergeParts`) und eine Kamerafahrt pro Strophe. Nach den 3D-Regeln von Bewegungsabenteuer (wenige Objekte, gebacken, was sich nicht bewegt), mit einem Szenario in `bun run perf`, und nur auf seiner Seite geladen.",
      why: "Ein Mal gebaut, kostet jeder weitere Helfer nur noch sein Zimmer und seine Bewegungen. Und weil die Uhr springen kann, lässt sich jedes 3D-Lied Bild für Bild in 1920 × 1080 bei 60 Bildern pro Sekunde rendern wie schon das Intro (`bun run video intro`), mit dem Lied als Tonspur aus der Datei: ruckelfreie Videos, ohne dass je ein Ton laut spielt (Y-12, Y-13 für 3D fast geschenkt).",
      effort: "L",
    },
    {
      id: "H-140",
      emoji: "🎼",
      title: "Lied-Baukasten: alle Mitsing-Lieder im selben Stil",
      text: "Alle Lieder dieser Reihe haben dasselbe Tempo, dieselbe Tonart, dieselben Instrumente und gleich lange Strophen (wie das Zahnputzlied: fröhlich, eine warme Stimme, Ukulele, Glockenspiel, Marimba), und `/musik-erzeugen` bekommt dafür eine Vorlage für den Stil-Text bei Suno, in die nur noch die Strophen einer Sprache kommen. Dann lassen sich Strophen verschiedener Lieder zu einem Ablauf aneinanderreihen (der Tagesplan spielt zu jeder Karte ihre Strophe: Hände waschen → Anziehen → Schuhe), kurze Fassungen für Shorts werden an Strophengrenzen geschnitten, und eine neue Sprache braucht nur ihren Text. Solange das Abo läuft, werden alle Lieder einer Sprache in einem Rutsch gemacht, in der Reihenfolge, in der sie am meisten wiederverwendet werden: Countdown, Hände waschen, Aufräumen, Gute Nacht, Anziehen.",
      why: "Spart Suno-Credits und Arbeit: Ein Lied, das zu den anderen passt, wird viel öfter verwendet als eins, das allein steht, und ein fester Stil macht die Reihe auf YouTube wiedererkennbar.",
      effort: "S",
    },
    {
      id: "H-141",
      emoji: "🖼️",
      title: "Zum Vergleich statt 3D: gemalte Bilder in Ebenen",
      text: "Die andere Art zu sehr guten Bildern: jeder Schritt ein Bild im Stil der Bilderbücher der App (Gemini, über die Bilder-Warteschlange, vier auf einem Bogen), freigestellt in zwei bis drei Ebenen – Hintergrund, Tapsi, Vordergrund –, die sich zum Lied sanft gegeneinander verschieben, mit einem langsamen Zoom wie eine Kamerafahrt über ein Buch. Sieht aus wie die Geschichten der App, nicht wie ein Spiel, und Bewegungen wie das Händereiben lassen sich nur andeuten. Gut für den ruhigen Abend (H-138), falls 3D dort zu sehr nach Spiel aussieht.",
      why: "Damit sich vor dem Bauen vergleichen lässt: 3D ist lebendiger und lässt sich frei bewegen (und jedes Video neu rendern), gemalte Bilder sind schneller gemacht und malerischer, kosten aber je Bild und lassen sich nach dem Malen kaum noch ändern.",
      effort: "M",
    },
  ],
};
