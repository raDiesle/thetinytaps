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
    "Lieder, die einen Handgriff des Tages tragen, so wie das Zahnputzlied das Putzen: eine Strophe pro Schritt, das Bild folgt dem Lied (die Strophen gemessen mit `bun run song` / `song:verses`), es läuft ohne Tippen, spielt auch bei „Musik aus“, weil es das Spiel selbst ist, und singt in der App-Sprache. Jedes ist zugleich ein Mitmach-Video für YouTube (Bereich Y). Gesammelt am 22. November 2026 auf Wunsch des Nutzers, der dafür ein weiteres Suno-Abo nutzen will: Qualität statt Masse – wenige, sehr gut gemachte Helfer. Die Bilder sollen realistisch aussehen, 3D ist dafür nicht nötig (Entscheidung des Nutzers, 22. November 2026): Nahaufnahmen von Bewegungen (Hände, Zähne) werden SVG und CSS wie bei Zähne putzen, Räume und Figuren malt Gemini im Stil der Bilderbücher, warm und detailreich, und was sich darin bewegt, sind freigestellte Teile als eigene HTML-Ebenen, bewegt per CSS (H-141). 3D bleibt eine Möglichkeit für später (H-139), falls beides einmal nicht reicht. Geld sparen durch Wiederverwenden: Ein Lied dient mehrfach (App, Video, Short, Tagesplan, andere Längen), alle Lieder haben denselben Stil (H-140), ein Lied, das schon etwa so lang ist wie gewünscht, bekommt keine zweite Fassung nur für die Länge (ungefähr 5 Minuten sind 5 Minuten), und Gemini-Bilder kommen über die Warteschlange, vier auf einem Bogen. Die Lieder macht der Nutzer später mit Suno Pro oder Premier (nur dann dürfen sie auf YouTube, Y-31); bis dahin kann das Bild schon gebaut werden und läuft im Dev-Server zu einem Platzhalter-Takt, für Spieler bleibt es `unfinished`. Jedes Lied gehört zu einer Aufgabe, nie ein allgemeines Timer- oder Countdown-Lied (Entscheidung des Nutzers, 26. November 2026: allgemeine Timer-Lieder für Kinder sind Quatsch; H-134 verworfen). Empfehlung der Reihenfolge: Hände waschen (H-136, fast alles dafür steckt schon in Zähne putzen), dann Aufräumen (H-135 mit dem Aufräumlied H-119 – auf YouTube die mit Abstand meistgesuchte Aufgabe für einen Timer, Recherche „youtube-timer-themen“).",
  ideas: [
    {
      id: "H-134",
      rejected: true,
      partial:
        "Verworfen am 26. November 2026 (Entscheidung des Nutzers): Allgemeine Timer-Lieder für Kinder sind Quatsch – ein Lied gehört konkret zu einer Aufgabe, etwa zum Aufräumen (H-119, H-135). Auch auf YouTube wird die Aufgabe mit ihrer Länge gesucht („clean up timer 5 minutes“, „timer mit musik zum aufräumen“), der allgemeine Timer mit Musik gehört den Klassenzimmern (Recherche „youtube-timer-themen“).",
      emoji: "⏱️",
      title: "Das Countdown-Lied: „Noch fünf Minuten“",
      text: "Ein fröhliches, allgemeines Lied von etwa 5 Minuten, das singt, wie viel Zeit noch bleibt, ohne zu sagen wofür: Jede Minute ist eine Strophe mit eigener Klangfarbe (erst Ukulele, dann Glockenspiel, Marimba …), und ihr Refrain singt die Zahl („Noch vier Minuten – wir machen weiter!“). In der letzten Minute wird es ruhiger, die letzten Sekunden zählt das Lied mit, am Ende ein „Geschafft!“ und der Schlussakkord. Weil jede Strophe eine Minute ist, beginnt ein 3-Minuten-Timer einfach bei der Strophe „Noch drei Minuten“: ein Lied je Sprache für 1, 2, 3, 4 und 5 Minuten. Es läuft im Timer unter jedem Bild als Wahl „mit Lied“ (Zug, Sanduhr, Kerze, Klötzchenhaus, Schatztunnel, Hüpf zur Fahne …), und die Länge des Timers ist die gemessene Länge der Strophen, nicht auf die Sekunde. Der Text drängt nie („schnell, schnell“ nie), er macht Mut, zählt und darf flink klingen („flink wie ein Fuchs“). Textentwurf auf /management/lieder/, schnell und ruhig. Für Suno: gleichmäßiges Tempo (120 BPM: 30 Takte sind eine Minute), jede Strophe gleich lang, der Refrain mit der Zahl immer an derselben Stelle.",
      why: "Kein Lied lässt sich öfter verwenden, und es braucht kein einziges neues Bild: Sieben Lieder (eins pro Sprache) machen jedes vorhandene und künftige Timer-Bild in fünf Längen zu einem Mitsing-Timer – fürs Aufräumen, Anziehen, Warten aufs Essen und „noch 5 Minuten spielen“, in der App und als YouTube-Video (Y-09 bekommt Musik: „5 minute timer with music“ und „aufräum timer mit musik“ gehören zu den großen Suchen). Billiger als H-57s ein Lied pro Länge, und die Spiel-Video-Bilder des Timers (H-125 bis H-132) bekommen damit den Ton, der ihnen fehlt.",
      effort: "M",
    },
    {
      id: "H-135",
      emoji: "🧸",
      title: "Aufräumen: ein gemaltes Kinderzimmer, in dem alles an seinen Platz hüpft",
      text: "Ein Kinderzimmer, von Gemini gemalt, warm und detailreich, im Licht eines Nachmittags: Regal, Kisten mit Bildern darauf, ein Korb, eine Spielzeuggarage, ein Bettchen für die Kuscheltiere, auf dem Boden ein Straßenteppich. Darüber liegen die Spielsachen, jede als eigenes freigestelltes Bild (Gemini mit durchsichtigem Hintergrund, vier auf einem Bogen) in einer eigenen kleinen Ebene. Strophe für Strophe räumt sich eine Sorte auf: die Bausteine hüpfen in hohem Bogen in ihre Kiste und der Deckel klappt zu, die Autos rollen in die Garage, die Bälle springen in den Korb, die Kuscheltiere legen sich ins Bettchen, die Bücher stellen sich ins Regal – jede Bewegung ein CSS-Bogen einer Ebene, mit weichem Schatten darunter. Mit jeder Sorte wird mehr vom Teppich sichtbar (wie H-122), am Ende fällt warmes Licht auf den freien Boden. In der App lässt ein Tippen auf ein Spielzeug es wackeln und klingen, die Zeit folgt dem Lied. Dazu das eigene Aufräumlied (H-119) – nie ein allgemeines Countdown-Lied (H-134 verworfen). Fürs Video in den Längen, nach denen gesucht wird: 5, 10, 3 und 2 Minuten (Recherche „youtube-timer-themen“). Das Lied nennt keine Spielsachen beim Namen, weil jedes Kinderzimmer anders ist (Wunsch des Nutzers, 26. November 2026); nur das Bild zeigt sie.",
      why: "„Clean up song“ und „Aufräumlied“ gehören zu den meistgesuchten Kinderliedern überhaupt. Ein gemaltes Zimmer sieht echt aus wie ein Bilderbuch, und das Kind räumt dabei sein eigenes Zimmer auf – das Zimmer im Bild ist der Fortschritt, ganz ohne Uhr. Etwa drei Bögen bei Gemini (Zimmer, Spielsachen, Kisten offen und zu).",
      effort: "M",
    },
    {
      id: "H-136",
      emoji: "🧼",
      title: "Hände waschen wie Zähne putzen, ein Lied von 30 Sekunden",
      text: "Gezeichnet in SVG und CSS wie Zähne putzen, und vieles kommt von dort: das Bad mit der Kamera, die von einem Bild zum nächsten schwenkt (`scenes.tsx`), das Waschbecken mit dem Chromhahn und die Hand im Ärmel (`prep.tsx`), die Kleider in den Farben von Junge oder Mädchen (`clothes.tsx`), die Zuckermonster, die sich auflösen. Das Bild schaut von oben auf die eigenen Hände über dem Becken, wie das Kind sie sieht: Ärmel hoch, Wasser an (ein Strahl aus Streifen, die sich als eigene Ebene bewegen), nass machen, Seife pumpen, und der Schaum wächst. Reiben wie in der Kita gelernt – Handflächen, Handrücken, zwischen den Fingern, Daumen, Fingerspitzen –, eine Zeile pro Schritt, und kleine Schmutzmonster auf den Händen lösen sich im Schaum auf wie die Zuckermonster. Abspülen, Wasser aus, Handtuch, die sauberen Hände glänzen. Realistisch heißt hier: Hände mit weichen Schatten, Knöcheln und Nägeln, nasser Glanz, Schaum aus vielen kleinen Blasen mit Lichtpunkten. Das Gegenstück zu H-07, mit einem gesungenen Lied von 20–30 Sekunden.",
      why: "Das kürzeste und damit billigste Lied, und es wird viermal gebraucht: allein in der App, als Schritt „Hände waschen“ bei Aufs Töpfchen (H-90), als Karte im Tagesplan und vor dem Essen. Auf YouTube ist „wash your hands song“ das ganze Jahr gefragt, und 30 Sekunden passen genau in ein Short. Weil Bad, Becken, Hand und Monster schon gezeichnet sind, ist es der günstigste Helfer mit neuem Bild.",
      effort: "M",
      done: true,
      partial:
        "Gebaut am 22. November 2026 als eigenes Spiel `/haende-waschen/` (src/games/handwash, noch `unfinished`, nur über „🚧 In Arbeit“): Becken, Hahn und Seifenspender von oben, die eigenen Hände mit Knöcheln, Nägeln und weichem Schatten in Ärmeln in den Farben von Junge oder Mädchen, zwölf Schritte vom Ärmel-Hochkrempeln bis zum Glänzen, fünf Reibe-Schritte wie in der Kita, sechs Schmutzmonster (Matsch, Gras, Farbe, Marmelade, Sand, Kakao), die sich im Schaum auflösen und beim Antippen kichern, ein Wasserstrahl als eigene Ebene, Handtuch. Jede bewegte Sache ist eine eigene HTML-Ebene, bewegt nur per `transform` und `opacity`. Läuft im Takt des Zahnputzlieds (112 BPM, etwa 42 Sekunden) zu einer Platzhalter-Melodie, mit Pause, Sprung über die Leiste unten und `?seite=<Schritt>`; dazu die Video-Seite `/management/video-haende/` im gemeinsamen Video-Rekorder (Y-36). Nicht übernommen: Bad und Kameraschwenk von Zähne putzen – das Bild bleibt beim Becken. Am 25. November 2026 auf Wunsch des Nutzers neu als klare Anleitung in dreizehn Schritten: Mama ruft zum Essen, ins Bad und auf den Tritt, Ärmel hoch, Seife aus dem Spender in die Handfläche, eine Hand seift die andere ein (Handflächen reiben aneinander, jede Hand reibt den Rücken der anderen, Finger verschränkt), Wasser an und die Wärme mit den Fingern fühlen (erst kalt, dann warm), abspülen unter dem Strahl, Wasser aus, die Hände gehen ins Handtuch und sein Ende klappt um sie, ab zum Essen. Die Hände sind neu gezeichnet, mit Handrücken und Handfläche, gespreizt oder geschlossen, Falten, Nägeln und Licht; statt der Schmutzmonster verblasst der Schmutz beim Reiben. Die drei Zimmer (Ruf, Bad mit Tritt, Essen) malt Gemini aus Sicht des Kinds und warten in der Bilder-Warteschlange; bis dahin fehlen diese Schritte für Spieler. Was fehlt, ist das Lied (H-142).",
    },
    {
      id: "H-137",
      emoji: "👕",
      title: "Anziehen: ein eigenes Buch mit Anziehlied, wie Zähne putzen",
      text: "Ein eigenes Buch im Regal bei den Alltagshelfern, neben Zähne putzen, und gebaut wie Zähne putzen (Wunsch des Nutzers, 26. November 2026): Es spielt sofort, sobald es aus dem Regal genommen ist, ein gesungenes Anziehlied trägt es, eine Strophe pro Stück, und das Bild folgt dem Lied (die Strophen gemessen mit `bun run song:verses`, wie `sung.ts`); Pause und Sprung über die Leiste unten wie dort, das Lied spielt auch bei „Musik aus“ und singt in der App-Sprache. Gezeichnet in SVG und CSS wie Zähne putzen und Hände waschen, damit das Kind „Junge / Mädchen“ folgt (Kleider aus `clothesOf` in `src/games/teeth/clothes.tsx`, der Schlafanzug von dort): Das Bild schaut, wie das Kind es sieht, von oben auf die eigenen Beine, Füße und Arme – Schlafanzug aus, Unterhose, Hose (ein Bein rein, das andere Bein rein, hochziehen), Socken (Zehen rein, über die Ferse), Unterhemd und Pulli (Kopf durch – kurz dunkel im Pulli, dann wieder hell –, Arm für Arm), zuletzt Schuhe. Zwischen den Strophen schwenkt die Kamera wie in Zähne putzen vom Schrank zum nächsten Stück, das schon bereitliegt; am Ende ein Blick in den Spiegel aufs ganz angezogene Kind und die Tür geht auf. Die Strophen singen die Bewegungen, die das Kind gleich mitmacht, und sind fröhlich und flott, ohne zu drängen. Morgens wie Zähne putzen nach der Uhr; später dieselben Strophen mit anderen Bildern für Regenjacke und Gummistiefel oder Schneeanzug, Mütze und Handschuhe. Dazu wie bei Zähne putzen eine Video-Seite im gemeinsamen `VideoRecorder` und die Karte 👕 im Tagesplan, die das Buch öffnet und abhakt.",
      why: "Anziehen ist an vielen Morgen der größte Kampf, und auf YouTube wird es als Lied gesucht, nicht als Timer („getting dressed song (for toddlers)“, „anziehen lied kinder“, „schuhe anziehen lied“; Recherche „youtube-timer-themen“) – genau das, was Zähne putzen schon kann: ein Lied, das den Handgriff Schritt für Schritt trägt. Vieles kommt von dort und von Hände waschen (Kamera, Kleider in den Farben des Kinds, Lied-Takt, Video-Rekorder); auf YouTube „Getting Dressed Song for Toddlers – Get Dressed with Tapsi“.",
      effort: "M",
    },
    {
      id: "H-138",
      emoji: "🌙",
      title: "Gute-Nacht-Ablauf, ganz ruhig, mit Licht, das ausgeht",
      text: "Ein langsames, leises Lied für den Abend, eine Strophe pro Schritt: Schlafanzug an, Zähne putzen (kurz, nur als Erinnerung), aufs Töpfchen, ein Buch, kuscheln, Licht aus. Je Schritt ein gemaltes Bild (Gemini) im Kinderzimmer in der Dämmerung: das Fuchskind tut es, Mama oder Papa Fuchs hilft (liest vor, deckt zu). Das Licht machen CSS-Ebenen über den Bildern: ein warmer Schein um die Lampe, ein Dunkel, das mit jeder Strophe dichter wird, Sterne, die im Fenster angehen. Die Kamera bewegt sich kaum, nichts blinkt. Am Ende geht die Lampe aus, das Zimmer wird dunkelblau, ein Nachtlicht malt Sterne an die Decke, und das Lied klingt aus. Kein eigenes Buch, sondern das Schlafen am Abend im Buch „Schlaf gut“ (/grosses-bett/, Wunsch des Nutzers, 26. November 2026) neben den Bett-Geschichten, Mittagsschlaf (H-153) und Ruhezeit (H-154), im selben Zimmer mit Hase und Mond-Nachtlicht – und ohne Timer: Es endet, wenn das Licht ausgeht.",
      why: "Einschlafen ist das größte Feld überhaupt („bedtime routine song“, „calm“, „low stimulation“, Y-34), und Gemini malt warmes Licht im Dunkeln besonders schön. Die Strophen passen zu den Abendkarten des Tagesplans, der so zu jeder Karte ihre Strophe spielen kann; zusammen mit N-03 ein ruhiges Ende des Tages.",
      effort: "M",
    },
    {
      id: "H-139",
      emoji: "🎬",
      title: "Später, falls nötig: die 3D-Bühne für Mitsing-Helfer",
      text: "Nicht nötig für die Helfer hier (Entscheidung des Nutzers, 22. November 2026: realistisch, aber nicht unbedingt 3D), nur eine Möglichkeit für später: die Bühne aus Bewegungsabenteuer (`three/stage.ts`: Renderer, Licht, Schatten), Tapsis Figur mit ihren Gelenken, Bewegungen und Umriss (`three/guide.ts`, `clips/`, `contour.ts`) und die Uhr des Spielers (`three/player.ts`, mit Springen und Pause), angetrieben von den gemessenen Strophenanfängen des Lieds wie bei Zähne putzen (`sung.ts`). Lohnt sich erst, wenn ein Helfer eine Figur frei im Raum bewegen muss, was gemalte Bilder und SVG nicht schaffen.",
      why: "Gemalte Bilder und SVG sind schneller gemacht und laufen auf alten Handys leichter; 3D hält die Tür offen, ohne dass etwas davon jetzt gebaut werden muss.",
      effort: "L",
    },
    {
      id: "H-140",
      emoji: "🎼",
      title: "Lied-Baukasten: alle Mitsing-Lieder im selben Stil",
      text: "Alle Lieder dieser Reihe haben dasselbe Tempo, dieselbe Tonart, dieselben Instrumente und gleich lange Strophen (wie das Zahnputzlied: fröhlich, eine warme Stimme, Ukulele, Glockenspiel, Marimba), und `/musik-erzeugen` bekommt dafür eine Vorlage für den Stil-Text bei Suno, in die nur noch die Strophen einer Sprache kommen. Dann lassen sich Strophen verschiedener Lieder zu einem Ablauf aneinanderreihen (der Tagesplan spielt zu jeder Karte ihre Strophe: Hände waschen → Anziehen → Schuhe), kurze Fassungen für Shorts werden an Strophengrenzen geschnitten, und eine neue Sprache braucht nur ihren Text. Solange das Abo läuft, werden alle Lieder einer Sprache in einem Rutsch gemacht, in der Reihenfolge, in der sie am meisten wiederverwendet werden: Hände waschen, Aufräumen, Gute Nacht, Anziehen.",
      why: "Spart Suno-Credits und Arbeit: Ein Lied, das zu den anderen passt, wird viel öfter verwendet als eins, das allein steht, und ein fester Stil macht die Reihe auf YouTube wiedererkennbar.",
      effort: "S",
    },
    {
      id: "H-141",
      emoji: "🖼️",
      title: "Die Bildtechnik: gemalte Räume, bewegte Teile darüber",
      text: "Wie die Helfer realistisch aussehen, ohne 3D: Was still steht (ein Zimmer, ein Bad bei Nacht, ein Kind in einer Haltung), malt Gemini im Stil der Bilderbücher der App, warm und detailreich, über die Bilder-Warteschlange vier auf einem Bogen. Was sich bewegt, ist ein freigestelltes Teil (Gemini mit durchsichtigem Hintergrund, oder SVG wo es klein und einfach ist) in einer eigenen HTML-Ebene, die per CSS `transform` und `opacity` hüpft, rollt oder auftaucht, mit einem weichen Schatten; Licht und Dämmerung sind Ebenen, deren Deckkraft sich ändert. Zwischen zwei gemalten Bildern ein sanfter Übergang und eine langsame Kamerafahrt (die ganze Ebene verschoben, nie das Bild neu gezeichnet), so dass es auf alten Handys flüssig bleibt. Nahaufnahmen, in denen sich viel bewegt (Hände reiben, Bürste putzt), bleiben SVG wie Zähne putzen (H-136).",
      why: "Gemalte Bilder sehen echter aus als alles, was sich in vertretbarer Zeit zeichnen lässt, kosten wenig und passen zu den Geschichten der App; die bewegten Ebenen bringen das Leben hinein, das ein Lied zum Mitmachen braucht. Die Grenze: Eine Figur, die sich frei bewegt, geht so nicht – dafür gibt es Bilder pro Schritt (H-137) oder später 3D (H-139).",
      effort: "M",
    },
    {
      id: "H-142",
      emoji: "🎵",
      title: "Das Händewasch-Lied singen lassen und das Spiel freigeben",
      text: "Das gesungene Lied zu „Hände waschen“ (H-136) mit Suno im Stil des Baukastens (H-140): eine Strophe pro Schritt in der Reihenfolge von `steps.ts` (Mama ruft zum Essen, ins Bad und auf den Tritt, Ärmel hoch, Seife, Handflächen, Handrücken, der andere Handrücken, zwischen den Fingern, Wasser an und fühlen, abspülen, Wasser aus, abtrocknen, ab zum Essen), die Reibe-Strophen zusammen mindestens 20 Sekunden, erst Englisch, dann die anderen Sprachen. Die Strophenanfänge mit `bun run song` messen, wie beim Zahnputzlied (`sung.ts`), statt der festen Takte in `steps.ts`; die Platzhalter-Melodie fällt weg. Danach `unfinished` aus `games.ts` nehmen, das Lied auf der Video-Seite als YouTube-Lied eintragen, und das Lied als Schritt „Hände waschen“ bei Aufs Töpfchen (H-90) und als Karte im Tagesplan spielen.",
      why: "Ohne Lied läuft das Bild zu einer Melodie aus dem Rechner; erst mit Gesang singt das Kind die Schritte mit, und erst dann taugt es für Spieler und für YouTube.",
      effort: "S",
    },
  ],
};
