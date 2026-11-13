# Regeln für Bewegungsabenteuer-Level

Gesammelt aus dem Feedback zu „Die Schatzinsel“. Vor jedem neuen Level (und jeder größeren
Änderung an einem) durchgehen. Kommt neues Feedback, gehört es hier als Regel dazu, damit derselbe
Fehler in späteren Leveln nicht wieder passiert.

## Das Kind macht alles nach

- **Jede Bewegung des Fuchses wird nachgemacht**, auch die zwischen den Stationen. Das Kind steht
  vor dem Bildschirm im Zimmer und kann sich nicht frei durch den Raum bewegen. Darum geht, hüpft
  oder steigt die Figur nie von der Stelle: Sie wird getragen (Schatzinsel: auf dem Panzer einer
  Schildkröte, Wolkenreise: auf der Wolke Wolle, Feuerwehr: auf dem Schwebe-Roboter Robo) und macht alles auf der Stelle. Erlaubt sind nur kleine Schritte zur Seite und zurück.
  **Auch am Ende bleibt sie auf ihrem Träger** und springt nie von ihm herunter (Tapsi blieb nicht auf
  Ole): Was sie erreichen soll, kommt zu ihr (die Truhe wird direkt neben Ole abgestellt), und sie
  dreht sich höchstens mit kleinen Schritten auf ihm um.
  Steht die Figur dadurch höher, muss alles, was sie erreichen soll (Kurbel, Äpfel, Spinnweben,
  Schloss), mit hoch, und alles, was über sie hinweg soll (Baumstamm, Kisten), höher hängen.
- **Nichts verlangen, wofür das Kind im Zimmer kein Gegenüber hat**: kein Drücken gegen eine Tür
  (stattdessen Spinnweben wegwedeln), kein Balancieren auf Schienen, kein schnelles Drehen.
- **Nur zeigen, was zur Bewegung gehört.** Teile, die nicht Teil der Bewegung sind, sollen nicht
  auffallen: Beim Paddeln scheinen die Füße nicht durch den Körper, nur Arme. Leuchten und
  Durchscheinen folgen `clipFocus`. Was die Hauptbewegung macht, leuchtet aber mit, auch wenn der Clip
  zu einem anderen Teil gehört: Neigt sich der Fuchs zur Seite, leuchtet die Pfote, die auf dieser Seite
  hinausgreift (`MORE_FOCUS` in `three/clips/index.ts`).
- Erst zeigt der Fuchs die Bewegung allein, dann „Jetzt du!“. Bewegungen sind groß und halten kurz
  an ihren Enden, damit man sie gut erkennt.
- **Bewegungen gehen fließend ineinander über**, nie ruckartig: Wechseln sich die Pfoten ab (Ballons
  antippen), wartet die eine halb oben, während die andere hinausgreift, und keine springt beim Wechsel
  an einen anderen Platz (`clips.test.ts` misst es beim Antippen).
- **Jede Bewegung oft genug.** Zeigen und Mitmachen zusammen dauern etwa 12–25 s, also viele
  Runden, bevor es weitergeht. Lieber eine Station länger als eine mehr (Feuerwehr, Rückmeldung
  November 2026: sechs Kätzchen statt vier, damit das Fangen länger dauert).
- **Das Level beginnt im Stehen und gleich mit einer Bewegung** (Schatzinsel: erst Kiki winken, dann
  die Angel auswerfen), nicht mit Sitzen und Zuschauen.
- **Hinsetzen und Aufstehen sind eigene Schritte, aber nur die Bewegung selbst**: Der Fuchs setzt
  sich (oder steht auf) zusammen mit dem Kind, ohne Vormachen vorher und ohne Sitzen oder Stehen
  danach, und es geht gleich weiter (kurzes Lob). Nicht nebenbei im Lob oder im Weg davor.
- **Lieber ein klarer Treffer mit Ton als eine vage Bewegung.** Blumen mit den Armen „aufwecken“
  war zu unbestimmt; auf eine Trommel schlagen kennt jedes Kind.
- **Die Bewegung hat einen Sinn auf dem Weg.** Trommeln nur für einen Schmetterling war beliebig;
  jetzt sitzen Vögel auf dem Weg, und jeder Schlag scheucht einen weg, bis der Weg frei ist.
- **Das Ende ist kurz und bleibt Bewegung mit Wirkung**, kein langes Tanzen: Tanzen bewirkt nichts
  und trainiert nichts Bestimmtes. **Und was am Ende passiert, ergibt in der Geschichte Sinn**:
  Raketen aus den Pfoten waren beliebig. Schatzinsel: Die Krebse tragen die Truhe an den Strand und
  stellen sie direkt hinter Ole ab, Tapsi dreht sich auf Oles Rücken zu ihr um, greift tief hinein und
  wirft die Münzen mit beiden Armen hoch über sich – ein Goldregen.
- **Das Ende hat eine feste Reihenfolge**: erst mit dem Schlüssel die Truhe öffnen, dann das Gold
  werfen, dann freuen (zu uns umdrehen und jubeln), zum Schluss winken. Wird eine Station umgestellt,
  wandert alles mit, was zu ihr gehört (Krebse, Deckel, Papagei, Abenddämmerung, Sätze).

## Die Welt antwortet im Takt

- **Jede Bewegung wirkt auf etwas** (Kiki winken, Skorpione platt stampfen, Kurbel drehen …).
- **Was die Bewegung trifft, kommt in Bewegung an**, genau im Moment des Treffers: Ein Skorpion
  krabbelt noch, wenn der Fuß auf ihn tritt; er wartet nicht unter dem Fuß.
- **Zu jedem Treffer gibt es ein Ziel.** Tritt der Fuchs zehnmal, kommen zehn Skorpione, und die
  letzten Tritte gehen nicht ins Leere. Zählen: Anzahl der Treffer im Clip (Zeigen + Mitmachen)
  gegen die Anzahl der Dinge. Auch am Ende: Der Clip läuft eine ganze Zahl von Runden, sonst weicht
  der Fuchs zum Schluss noch aus, obwohl keine Nuss mehr kommt. Die Anzahl der Dinge aus der Länge
  rechnen, nicht von Hand (`CYCLES` in der Geschichte, ein Test prüft die ganzen Runden).
- **Was auf den Fuchs zukommt, kommt nah und klein**: Kokosnüsse rollen genau durch die Stelle, an der
  der Fuchs eben noch stand, und sind deutlich kleiner als er; der Schritt zur Seite ist groß. Man
  sieht, woher sie kommen (Affen werfen sie vom Baum).
- **Eine Station hat Abwandlungen statt immer gleich**: erst von rechts (Schritt zur Seite), dann von
  links (linkes Bein hoch, die Nuss rollt darunter durch), dann durch die Mitte (Beine breit).
- **Was ankommt, kommt nur, solange der Fuchs zieht**: Am Seil zieht er Hand über Hand, ruckweise,
  und das Floß rückt bei jedem Zug ein Stück näher und steht dazwischen still (`pulledIn`). Das
  Seil läuft von den Pfoten aus seitlich am Körper vorbei auf den Boden, nie in den Körper.
- **Bei jeder Runde passiert etwas**, nicht nur bei manchen: Hüpft der Fuchs zehnmal, stößt er zehnmal
  mit dem Kopf an eine Kiste. Ole läuft dafür so schnell, dass bei jedem Sprung eine neue Kiste
  über Tapsi hängt.
- **Was getroffen wird, hängt dort, wo die Pfote im Clip wirklich ankommt**: am Clip messen, nicht
  schätzen, und seitlich vom Körper, damit man den Treffer von hinten sieht. Lieber an der
  höchsten Stelle, die die Pfote erreicht (Äpfel), damit sich das Kind richtig streckt. Das gilt auch
  für alles, was der Fuchs von oben herunterzieht (der Griff der Feuerglocke, Rückmeldung November
  2026: „er soll sich mehr strecken“): Der Clip reckt die Arme ganz hoch, auf den Zehenspitzen und mit
  Blick nach oben, und der Griff hängt genau dort, wo die Pfoten dann sind.
- **Die Pfoten sind an dem, was sie drehen oder halten** (Kurbel, Paddel, Angel, Schlüssel): Hand
  und Ding bewegen sich zusammen, sonst dreht sich etwas wie von Geisterhand. **Und nichts davon reicht
  in den Körper**: Ein Schlüssel ragt von der Pfote nach vorn, also sitzt das Schloss eine
  Schlüssellänge vor der Pfote, nicht an ihr (sonst steckte der Schlüsselring im Bauch).
- **Was gedreht wird, steht neben dem Fuchs, ist groß und hebt sich ab** (Kurbel): Der Fuchs steht
  seitlich daneben, nicht dahinter, die Kurbel ist so groß, dass ihre Drehung eine große Bewegung ist,
  und sie hat eine Farbe, die sich vom Holz ringsum abhebt (rot).
- **Wer durch etwas hindurchfährt** (Tor), hat Luft über den Ohren: Die Öffnung ist höher als der
  Fuchs auf seinem Träger, mit Abstand; ein Test misst es (`treasureIsland.test.ts`).
- **Auswerfen wie echt** (Angel): ausholen über die Schulter, kurz halten, nach vorn schnellen und
  nachschwingen. Der Schwimmer hängt beim Ausholen hinter der Spitze, fliegt dann im Bogen hinaus, und
  die Schnur hängt durch, solange er draußen liegt. **Ausholen so groß wie möglich**: Pfoten hoch
  hinter den Kopf, die Angel zeigt fast waagerecht nach hinten, der Oberkörper dreht mit – dann fliegt
  der Schwimmer weit und in hohem Bogen hinaus (`CAST_REACH`, `CAST_ARC`), aber noch im Bild. Eine
  kleine Ausholbewegung mit kurzem Wurf sah nicht nach Werfen aus (Rückmeldung, November 2026).
- Kein Satz behauptet, das Kind gesehen zu haben (es gibt keine Kamera).
- **Was Tapsi sagt, stimmt mit dem überein, was passiert.** Ändert sich eine Handlung, ändert sich ihr
  Satz im selben Commit, in jeder Sprache. Kündigt ein Satz etwas an, das es nicht mehr gibt („Ich hüpfe
  runter!“, als Tapsi auf Ole blieb), fällt er weg, statt durch einen neuen ersetzt zu werden: Tapsi
  sagt dann einfach nichts dazu.

## Fuchs und Darstellung

- Der Fuchs soll natürlich aussehen: schlanke Gliedmaßen, die sich verjüngen, sichtbare Gelenke,
  Finger und Zehen mit runden Spitzen; Hände und Füße bewegen sich mit (Handgelenk, Fußgelenk),
  nichts wirkt wie steife Stäbe.
- **Ein Körper wie der eines Kindes** (Rückmeldung November 2026: zwei Kugeln für Brust und Becken,
  kein Hals und Kugelgelenke an den Schultern sahen nach Schneemann-Puppe aus): ein durchgehender Rumpf
  mit Schultern, die die Arme tragen, weicher Taille, Hüften, aus denen die Oberschenkel wachsen, rundem
  Bauch vorn und Po hinten; ein kurzer Hals, auf dem der Kopf sitzt (Kinn über den Schultergelenken),
  der Kopf etwa ein Viertel der Größe, nie ein Drittel. Schulterkappen statt Kugeln, Oberschenkel oben
  voll, Waden hinten am Schienbein. Das Fell bekommt seine Zeichnung über den Körper (das Creme läuft
  weich von der Kehle bis zum Bauch, `torsoGeometry` in `three/guide.ts`), nie als aufgesetzter Fleck.
  `three/guide.test.ts` prüft Hals und Kopfgröße. Die Gelenkpunkte (Schultern, Hüften, Armlängen)
  bleiben dabei, wo sie sind, sonst stimmt nichts mehr, was am Clip gemessen ist.
- **Hände wie echte Hände** (Rückmeldung November 2026): Der Daumen sitzt auf der Seite, auf der er
  bei dieser Handfläche wirklich sitzt (Handfläche vorn → Daumen außen), nie spiegelverkehrt. Die
  Handfläche zeigt, wohin eine echte zeigt: beim hängenden Arm zum Körper, beim vorgestreckten oder
  seitlich ausgestreckten Arm nach unten, beim hochgereckten nach vorn – nie immer nach oben
  (`forearmTurn` in `three/guide.ts`). Nur wo die Pfote fängt, wirft, antippt, hochdrückt oder etwas
  hält, öffnet sie sich (`palm` in der Pose des Clips; Halten macht `guide.hold`). Ein neuer Clip,
  der fängt oder wirft, setzt `palm`.
- **Arme wie bei einem Kind** (Rückmeldung November 2026: hochgereckt endeten sie unter den Ohren):
  hochgestreckt reicht die Pfote deutlich über die Ohrenspitzen, hängend endet sie über dem Knie.
  `three/guide.test.ts` prüft beides. Wer die Arme ändert, misst danach alles neu, was am Clip
  gemessen ist (`DRUM_HAND`, `CRANK_*`, `KEY_HAND` in `layout.ts`, `REACH_TOP` in `world.ts`), und
  schaut, dass sitzende Pfoten nicht im Boden stecken (`sitDown` in `three/player.ts`).
- Körper und Kopf verdecken keine Arme oder Beine, die gerade die Bewegung machen (halb
  durchsichtig dort), aber nur diese.
- Das Leuchten am Fuchs ist ein sauberer Rand um die Umrisse, ohne Spalten oder Nähte zwischen den
  Körperteilen (im Bild berechnet, nicht pro Teil), mit einem kleinen Abstand zum Körper. Was vor
  dem Fuchs steht, verdeckt auch das Leuchten.
- Kamera von hinten, damit links links ist; wo die Arme vor dem Körper arbeiten, höher und seitlich.
- **Am Anfang sieht man den Fuchs von vorn**: Beim Vorstellen schwenkt die Kamera erst vor ihn, so
  dass man sein Gesicht sieht, und geht erst danach hinter ihn. Während er winkt, steht er mittig im
  Bild, und wem er winkt (Kiki), ist neben ihm, nicht über oder hinter ihm – und ganz im Bild, auch
  am Anfang des Winkens (in der Wolkenreise flog Kiki erst außerhalb des Bildes).
- **Worauf der Fuchs steht, ist mit im Bild** (Wolle, Ole, Robo): Die Kamera steht so weit hinten, dass man
  den Träger ganz sieht, bei einer Wolke auch ihre Unterseite – nicht nur einen weißen Rand unter den
  Füßen. In jeder Station, auch beim Ducken, Hochgreifen und Fangen, und gerade wenn der Träger mit dem
  Fuchs aufsteigt (Robo am Haus hoch): Von oben schauend schwebte Tapsi auf nichts die Hauswand hinauf
  (Rückmeldung November 2026). Dann steht die Kamera weiter hinten und schaut tiefer.
- **Vor dem Festlegen der Kamera prüfen, was Kopf und Körper verdecken** (Feuerwehr, November 2026):
  Ziehen die Pfoten über dem Kopf (Glockenseil), verdeckte der Kopf sie von hinten – dort von der
  Seite. Schwenkt etwas nach links und rechts (Wasserstrahl), verdeckte der Körper von schräg hinten
  die eine Seite – dort hoch und mittig hinter dem Fuchs. Wird vor dem Bauch gefangen (Kätzchen),
  verdeckte der Rücken den Fang über die Schulter – dort schräg von hinten und weit genug weg, dass der
  ganze Fuchs im Bild bleibt.
- **Wo beide Arme vor dem Körper arbeiten** (Trommeln), steht die Kamera genau mittig und nah hinter
  den Schultern, nur wenig über dem Kopf, und schaut den Weg entlang: Pfoten und Trommeln neben dem
  Körper, und dahinter, worum es geht. Nie hoch und weit hinten mit dem Blick hinab auf die Trommeln –
  da sah man nicht, wofür getrommelt wird.
- **Ausholen geht seitlich über die Schulter** (Angel): Die Pfoten gehen neben dem Kopf hoch, nicht
  vor dem Gesicht vorbei oder in den Kopf. Wo ein Arm hinter dem Körper ist, scheint er durch; er
  geht aber nie in den Körper hinein. Das Ding in der Hand legt fest, wo die Pfoten sind, nicht
  umgekehrt. Wo der Arm weit hinter den Kopf geht, schwingt die Pfote auf dem Weg dorthin seitlich nach
  außen, damit die Angel nicht durch den Kopf streicht.
- **Wer weggescheucht wird, ist im Bild**: Viele und groß (die Vögel dreimal so groß wie gebaut, zwei
  je Trommelschlag), so dass man auf einen Blick sieht, wozu die Bewegung da ist. Sie sitzen, von der
  Kamera aus gesehen, neben dem Fuchs und neben dem, was er bewegt, nie dahinter: Kleine Vögel direkt
  vor dem Fuchs versteckten sich hinter Beinen und Trommeln (`drumBirdSpot`, der Test prüft es). Auf
  dem Handy und dem Tablet anschauen, auch das Bewegungsfenster unten rechts.
- **Malt der Fuchs, dann mit einem Werkzeug** (Regenbogen): ein Farbeimer und ein Pinsel in jeder
  Pfote; vor jedem Bogen bückt er sich und taucht den Pinsel ein, und Farbe im Eimer und am Pinsel
  ist die des Bandes, das er gleich malt. Mit leeren Pfoten in die Luft zu malen sah nach nichts aus.
- **Was die Hände tun, ist im Bild.** Verdeckt der Körper die Hände, geht die Kamera über die
  Schulter. Was in der Hand gedreht wird (Schlüssel im Schloss), sieht man von der Seite auf seiner
  Höhe: Die Kamera schwenkt dafür seitlich heran, solange gedreht wird. Was gedreht wird, muss so
  gebaut sein, dass man die Drehung sieht: Ein Schlüsselring steht längs zum Schaft; ein flacher
  Ring, der sich um sich selbst dreht, sieht aus, als stünde er still.
- **Was der Fuchs malt oder zeichnet, entsteht genau an der Pinselspitze**, so wie die Kamera sie
  sieht, nie daneben (Regenbogen der Wolkenreise): Die Spitze fährt die Form selbst ab (im selben
  Radius, Band für Band), und wie weit gemalt ist, wird jedes Bild aus der wirklichen Spitze nach dem
  Posieren gerechnet, nicht aus dem Zeitplan. Steht das Gemalte weit weg (am Himmel), ist es die
  vergrößerte Form, von der Kamera aus gesehen; die Kamera und der Boden des Fuchses stehen dann
  still, sonst rutschen nah und fern gegeneinander. Der Fuchs steht genau in der Mitte dessen, was
  er rundherum malt, und der Bogen liegt von der Kamera hinter ihm aus gesehen über Kopf und Ohren
  (auch auf dem Handy, 844×390): Was vor dem Fuchs gemalt wird, sieht sie von hinten und oben tiefer
  liegen, als es ist. `arc.test.ts` misst die Spitze am Gerüst.
- **Kommt etwas auf den Fuchs zu** (rollende Kokosnüsse, Sterne), steht die Kamera genau mittig hinter ihm
  und etwas tiefer, damit man sieht, wie es heranrollt. Weicht er aus, dann schnell und weit genug zur
  Seite, dass das, was kommt, frei neben ihm vorbeizieht und man es sieht (Wolkenreise: Wolle springt
  zur Seite, die Kamera geht nur halb mit, der Stern fliegt durch die Mitte des Bildes).
- **Duckt sich der Fuchs unter etwas** (Flugzeuge), steht die Kamera weiter weg, tiefer und schaut
  etwas nach oben: Man sieht den ganzen Körper beim Ducken und das, was über ihn hinwegfliegt. Was
  heranfliegt, kommt schräg von oben herab, vom oberen Bildrand, nah genug und groß genug, dass man
  es sieht – nie frontal auf Kopfhöhe von vorn, da steckte es hinter dem Kopf und war winzig. Nach
  dem Kopf fliegt es weiter auf uns zu und aus dem Bild, nie nach oben weg (Wolkenreise, November 2026).
- **Kommt etwas zu den Händen** (Luftballons zum Antippen), kommt es von vorn schräg seitlich auf
  Höhe der Hände angeschwebt, nie von oben, und die Kamera schaut von hinten: So sieht man es kommen
  und die Pfote treffen. Die Pfote greift nach vorn **und zur Seite** hinaus, nie nur gerade nach vorn:
  Von hinten verdeckten Kopf und Arm sonst Ballon und Pfote. Der Ballon schwebt langsamer werdend an
  seinen Platz und wartet dort kurz, und er platzt in dem Moment, in dem die Pfote ihn berührt – nie
  erst, wenn die Pfote schon in ihm steckt (`popAt` misst die Berührung).
- **Schiebt der Fuchs etwas weg** (graue Wolken), steht die Kamera weit hinter ihm: Man sieht, wie es
  kommt und wie es weggeschoben wird, nicht nur die Pfoten davor.
- **Schwingt etwas über den Fuchs hinweg** (Baumstamm), steht die Kamera weit hinter ihm und tief
  und schaut schräg nach oben: So sieht man den ganzen Schwung, von vorn über den Kopf hinweg, und
  nicht nur das Stück direkt über dem Kopf. Was dabei zwischen Kamera und Schwung hängen würde
  (Bäume am Rand, Dinge der Station davor), kommt aus dem Bild.
- **Was über dem Fuchs hängt** (Äpfel), sieht man mittig von hinten mit Abstand und etwas erhöht: Die
  Äpfel hängen frei über Kopf und Pfoten, nie hinter dem Kopf. Jeder Apfel hängt sichtbar an einem
  Stiel unter einem Ast, mit Blatt.
- **Nichts hängt zwischen Kamera und dem, worum es geht.** Was eine Station gebraucht hat und danach
  noch in der Luft hängt (die Sternkisten über dem Weg), verschwindet, bevor eine spätere Kamera durch
  es hindurchschaut: Es fliegt davon.
- **Was rollt, bleibt im Bild.** Steht etwas Hohes vor dem Fuchs (Schildkrötenkopf), wird der Boden
  davor angehoben, damit eine rollende Nuss nicht dahinter verschwindet, und sie hüpft darüber.
- **Keine Grafik geht in eine andere**, in jedem Abenteuer: Feste Dinge überschneiden sich nicht;
  nur was keine feste Form hat (Wasser, Luft, Wolken, die dünne Angelschnur), darf man durchdringen.
  Füße, Beine und Körper bleiben über dem Panzer (im Sitzen: Beine gerade nach vorn, auf den Fersen),
  Stangen, Seile und Taschen gehen nicht durch den Körper. Im Zweifel weglassen (ein Taschenriemen lief
  als brauner Ring durch den Fuchs). Von der Seite anschauen und nachmessen. **Ein Test prüft es**
  (`three/collisions.test.ts`): Er spielt jede Geschichte Bild für Bild ohne Bildschirm ab und meldet
  jeden Moment, in dem eine Pfote oder etwas, das Tapsi hält, aufhebt oder ablegt, in Rumpf oder Kopf
  steckt (beim Aufheben der Angel steckten Pfote und Angel im Bauch, Rückmeldung November 2026). Jedes
  neue Ding in Tapsis Pfoten kommt in `held()` der Geschichte. **Aufheben und Ablegen gehen um den
  Körper herum**: erst zur Seite neben den Körper, dann nach vorn in die Pfoten; die zweite Pfote greift
  erst zu, wenn das Ding vor der Brust ist, und lässt beim Ablegen zuerst los. Dreht sich etwas Langes
  dabei (das Paddel aufs Ufer), dreht es sich erst weit draußen und so herum, dass das nahe Ende vom
  Körper weg schwingt. Und ein Clip spielt nicht ins Lob weiter, während schon abgelegt wird: Ein
  zweites Ausholen beim Ablegen schlug die Angel in den Körper. Was auf dem Panzer abgelegt ist (die Angel beim Paddeln, das Paddel davor),
  liegt oben auf und folgt seiner Wölbung, statt hineinzustecken, und liegt dort, wo es keiner Kamera
  im Weg steht: Ein aufrecht im Wasser stehendes Paddel versperrte die Sicht auf den Schwimmer.
- Der Schwanz ist klein und verdeckt keine Beine.
- **Sprechen sieht aus wie Sprechen**: Der Mund öffnet sich weich im Takt der Silben, mal weiter, mal
  weniger, als kleiner offener Mund mit Zunge (wie beim Lachen), und schließt sich weich, wenn der Satz
  endet. Nie eine Lächellinie, die sich auf und ab dehnt; das sah komisch aus.
- **Der Fuchs ist groß im Bild**, in jeder Station: Die Kamera geht so nah heran, wie es die
  Bewegung erlaubt; das Kind muss jede Pfote erkennen, auch auf dem Handy.
- **Aufstehen und Hinsetzen wie ein Kind**: über die Hocke mit den Füßen unter der Hüfte, Knie
  angezogen, Oberkörper vorgebeugt über die Füße, dann hochdrücken. Nicht steif aus dem Sitzen
  hochklappen.
- **Auf dem Handy gehört das Bild dem Fuchs**: Die Wegleiste unten ist klein und auf schmalen oder
  niedrigen Bildschirmen ganz weg; Springen geht weiter über ⏮ ⏭ oben.
- **Neigen geht mit dem Kopf**: Beim Ausweichen zur Seite (Nüsse von oben) neigt sich der Kopf
  deutlich mit, nicht nur der Körper.
- **Hinter durchsichtigen Dingen sieht man durch** (Spinnweben): keine weiße oder helle Fläche
  dahinter, die wie eine Wand wirkt.
- **Begleiter halten Abstand und fliegen hin und her** (Kiki): nicht immer dicht neben dem Fuchs,
  sondern ein Stück weg, in einer langsamen, weiten Schleife mal näher, mal ferner, mal höher (am
  Anfang beim Winken nah genug, dass man sieht, wem er winkt).
- **Begleiter fliegen nie durchs Bild** (Kiki): Sie bleiben weit genug vor der Kamera und wechseln
  höchstens einmal die Seite, vor dem Fuchs und in einem Schritt, in dem die Kamera von hinten schaut.
  Von der Kamera aus gesehen sitzen sie nie auf dem Kopf des Fuchses und nie vor dem, worauf er
  schaut (Schwimmer): Jede Kamera einer Station prüfen, nicht nur die von hinten. Wird etwas geworfen
  (die Angel), fliegt der Begleiter weit rechts oben davon und weiter weg als das Geworfene, aber ganz
  im Bild: In der Mitte zwischen Kopf und Schwimmer schien Kiki vor der ausgeworfenen Angel zu sein,
  obwohl er weiter weg war (Rückmeldung, November 2026); am Bildrand halb abgeschnitten ist er auch
  falsch.
  Jeden Übergang zwischen zwei Stationen anschauen, nicht nur die Stationen selbst: Ein Papagei, der
  beim Umdrehen oder Seitenwechsel vor der Linse vorbeifliegt, verdeckt den Fuchs ganz. Dreht sich der
  Träger mit dem Fuchs um, drehen sich die Plätze des Begleiters nicht mit: Sie bleiben in der Welt
  stehen, sonst schwenkt er mit herum in die Kamera.
- **Begleiter fliegen um Dinge herum, nie hindurch, und verstecken sich nicht** (Feuerwehr, Rückmeldung
  November 2026: Kiki flog durch die Hauswand und schwebte beim Winken die ganze Zeit hinter dem Pfosten
  der Glocke). Sein Platz in jeder Station liegt frei von Häusern, Pfosten, Wäsche und dem Fuchs, auch
  mit seiner Schleife, und von der Kamera der Station aus gesehen vor allem, nicht dahinter; gegen eine
  Dachkante gesehen wirkt er wie eins der Dinge darauf (Kiki neben den Kätzchen), und unten rechts liegt
  er unter dem Kasten mit der Tänzerfigur. Auch woher er am Anfang kommt, ist freie Luft.
  `three/companions.test.ts` spielt die Geschichte Bild für Bild durch und prüft, dass sein Weg durch
  nichts geht und er nie länger als einen Moment verdeckt, außerhalb des Bildes oder unter dem Kasten
  ist; eine neue Geschichte mit Begleiter kommt dort dazu (sein Objekt bekommt einen Namen).
- **Die Kamera steht frei, auch am Anfang**: Nicht in oder knapp vor Wolken oder Bergen starten. Das,
  was gezeigt werden soll (die Regenwolke), sieht man aus Abstand ganz. Ein grauer Himmel hat keinen
  hellen Sonnenschein.
- **Keine Felswand füllt das Bild.** In engen Buchten erst von oben nachsehen, wo die Wände sind,
  und Figur, Truhe und Kamera so stellen, dass die Kamera frei steht und die Wand höchstens am Rand
  zu sehen ist.
- **Karte und Pokal zeigen eine Szene des Levels**, nie den Kasten mit der Tänzerfigur (Rückmeldung
  November 2026: die Pokale zeigten „das Skelett“): Das Bild in `vorschau/<level>.webp` kommt aus
  `bun run previews /abenteuer/`, das für die Geschichten den Kasten und die Reihe der Stationen
  ausblendet (`HIDE_ALSO` in `tools/previews.ts`), und zeigt eine Station mitten im Tun mit Fuchs und
  Träger (`PLAYS`: Feuerwehr beim Spritzen). Kommt eine Station dazu, die Tastendrücke dort anpassen.

## Technik

- **Kein Bild darf schwarz werden**: Positionen nie aus Werten außerhalb einer Strecke berechnen
  (z. B. `-Infinity * 0 = NaN`); eine `NaN`-Position der Figur macht über die Kamera das ganze Bild
  schwarz. Vor dem Abschluss die ganze Geschichte Bild für Bild durchlaufen und auf schwarze Bilder
  und `NaN` prüfen (Konsole: `__adventure.seek(t)`).
- Neue Stationen im Browser anschauen, nicht nur typprüfen.
- **Ein Tipp oder Klick aufs Bild hält an**, in jedem Abenteuer, und ▶ in der Mitte geht weiter
  (`AdventurePlay`); ein schneller zweiter Tipp ändert nichts (`screenTap`).
- **Keine Schnitte und kein Weiß zwischen den Stationen.** Ole trägt Tapsi den ganzen Weg, und die
  Kamera fährt mit (in engen Schluchten dicht hinter Tapsi, nie durch Felsen). Nichts Großes, Helles
  steht im Weg von Kamera oder Figur: Ein Lichtschein in einer Türöffnung wird ausgeblendet, bevor
  jemand hindurchgeht, sonst wird das ganze Bild weiß.
