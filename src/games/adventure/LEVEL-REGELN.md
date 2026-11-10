# Regeln für Bewegungsabenteuer-Level

Gesammelt aus dem Feedback zu „Die Schatzinsel“. Vor jedem neuen Level (und jeder größeren
Änderung an einem) durchgehen. Kommt neues Feedback, gehört es hier als Regel dazu, damit derselbe
Fehler in späteren Leveln nicht wieder passiert.

## Das Kind macht alles nach

- **Jede Bewegung des Fuchses wird nachgemacht**, auch die zwischen den Stationen. Das Kind steht
  vor dem Bildschirm im Zimmer und kann sich nicht frei durch den Raum bewegen. Darum geht, hüpft
  oder steigt die Figur nie von der Stelle: Sie wird getragen (Schatzinsel: auf dem Panzer einer
  Schildkröte) und macht alles auf der Stelle. Erlaubt sind nur kleine Schritte zur Seite und zurück.
  **Auch am Ende bleibt sie auf ihrem Träger** und springt nie von ihm herunter (Tapsi blieb nicht auf
  Ole): Was sie erreichen soll, kommt zu ihr (die Truhe wird direkt neben Ole abgestellt), und sie
  dreht sich höchstens mit kleinen Schritten auf ihm um.
  Steht die Figur dadurch höher, muss alles, was sie erreichen soll (Kurbel, Äpfel, Spinnweben,
  Schloss), mit hoch, und alles, was über sie hinweg soll (Baumstamm, Kisten), höher hängen.
- **Nichts verlangen, wofür das Kind im Zimmer kein Gegenüber hat**: kein Drücken gegen eine Tür
  (stattdessen Spinnweben wegwedeln), kein Balancieren auf Schienen, kein schnelles Drehen.
- **Nur zeigen, was zur Bewegung gehört.** Teile, die nicht Teil der Bewegung sind, sollen nicht
  auffallen: Beim Paddeln scheinen die Füße nicht durch den Körper, nur Arme. Leuchten und
  Durchscheinen folgen `clipFocus`.
- Erst zeigt der Fuchs die Bewegung allein, dann „Jetzt du!“. Bewegungen sind groß und halten kurz
  an ihren Enden, damit man sie gut erkennt.
- **Jede Bewegung oft genug.** Zeigen und Mitmachen zusammen dauern etwa 12–25 s, also viele
  Runden, bevor es weitergeht. Lieber eine Station länger als eine mehr.
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
  höchsten Stelle, die die Pfote erreicht (Äpfel), damit sich das Kind richtig streckt.
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
  die Schnur hängt durch, solange er draußen liegt.
- Kein Satz behauptet, das Kind gesehen zu haben (es gibt keine Kamera).
- **Was Tapsi sagt, stimmt mit dem überein, was passiert.** Ändert sich eine Handlung, ändert sich ihr
  Satz im selben Commit, in jeder Sprache. Kündigt ein Satz etwas an, das es nicht mehr gibt („Ich hüpfe
  runter!“, als Tapsi auf Ole blieb), fällt er weg, statt durch einen neuen ersetzt zu werden: Tapsi
  sagt dann einfach nichts dazu.

## Fuchs und Darstellung

- Der Fuchs soll natürlich aussehen: schlanke Gliedmaßen, die sich verjüngen, sichtbare Gelenke,
  Finger und Zehen mit runden Spitzen; Hände und Füße bewegen sich mit (Handgelenk, Fußgelenk),
  nichts wirkt wie steife Stäbe.
- Körper und Kopf verdecken keine Arme oder Beine, die gerade die Bewegung machen (halb
  durchsichtig dort), aber nur diese.
- Das Leuchten am Fuchs ist ein sauberer Rand um die Umrisse, ohne Spalten oder Nähte zwischen den
  Körperteilen (im Bild berechnet, nicht pro Teil), mit einem kleinen Abstand zum Körper. Was vor
  dem Fuchs steht, verdeckt auch das Leuchten.
- Kamera von hinten, damit links links ist; wo die Arme vor dem Körper arbeiten, höher und seitlich.
- **Am Anfang sieht man den Fuchs von vorn**: Beim Vorstellen schwenkt die Kamera erst vor ihn, so
  dass man sein Gesicht sieht, und geht erst danach hinter ihn. Während er winkt, steht er mittig im
  Bild, und wem er winkt (Kiki), ist neben ihm, nicht über oder hinter ihm.
- **Wo beide Arme vor dem Körper arbeiten** (Trommeln), steht die Kamera genau mittig hinter dem
  Fuchs und so hoch, dass man über die Schultern auf die Pfoten sieht.
- **Ausholen geht seitlich über die Schulter** (Angel): Die Pfoten gehen neben dem Kopf hoch, nicht
  vor dem Gesicht vorbei oder in den Kopf. Wo ein Arm hinter dem Körper ist, scheint er durch; er
  geht aber nie in den Körper hinein. Das Ding in der Hand legt fest, wo die Pfoten sind, nicht
  umgekehrt.
- **Wer weggescheucht wird, ist im Bild**: Kamera so hoch, dass man über den Fuchs hinweg sieht,
  was auf dem Weg sitzt, und groß genug, um es zu erkennen.
- **Was die Hände tun, ist im Bild.** Verdeckt der Körper die Hände, geht die Kamera über die
  Schulter. Was in der Hand gedreht wird (Schlüssel im Schloss), sieht man von der Seite auf seiner
  Höhe: Die Kamera schwenkt dafür seitlich heran, solange gedreht wird. Was gedreht wird, muss so
  gebaut sein, dass man die Drehung sieht: Ein Schlüsselring steht längs zum Schaft; ein flacher
  Ring, der sich um sich selbst dreht, sieht aus, als stünde er still.
- **Kommt etwas auf den Fuchs zu** (rollende Kokosnüsse), steht die Kamera genau mittig hinter ihm
  und etwas tiefer, damit man sieht, wie es heranrollt.
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
- **Keine Grafik geht in eine andere.** Füße, Beine und Körper bleiben über dem Panzer (im Sitzen:
  Beine gerade nach vorn, auf den Fersen), Stangen, Seile und Taschen gehen nicht durch den Körper.
  Im Zweifel weglassen (ein Taschenriemen lief als brauner Ring durch den Fuchs). Von der Seite
  anschauen und nachmessen. Was auf dem Panzer abgelegt ist (die Angel beim Paddeln, das Paddel davor),
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
- **Begleiter fliegen nie durchs Bild** (Kiki): Sie bleiben weit genug vor der Kamera und wechseln
  höchstens einmal die Seite, vor dem Fuchs und in einem Schritt, in dem die Kamera von hinten schaut.
  Von der Kamera aus gesehen sitzen sie nie auf dem Kopf des Fuchses und nie vor dem, worauf er
  schaut (Schwimmer): Jede Kamera einer Station prüfen, nicht nur die von hinten.
  Jeden Übergang zwischen zwei Stationen anschauen, nicht nur die Stationen selbst: Ein Papagei, der
  beim Umdrehen oder Seitenwechsel vor der Linse vorbeifliegt, verdeckt den Fuchs ganz.
- **Die Kamera steht frei, auch am Anfang**: Nicht in oder knapp vor Wolken oder Bergen starten. Das,
  was gezeigt werden soll (die Regenwolke), sieht man aus Abstand ganz. Ein grauer Himmel hat keinen
  hellen Sonnenschein.
- **Keine Felswand füllt das Bild.** In engen Buchten erst von oben nachsehen, wo die Wände sind,
  und Figur, Truhe und Kamera so stellen, dass die Kamera frei steht und die Wand höchstens am Rand
  zu sehen ist.

## Technik

- **Kein Bild darf schwarz werden**: Positionen nie aus Werten außerhalb einer Strecke berechnen
  (z. B. `-Infinity * 0 = NaN`); eine `NaN`-Position der Figur macht über die Kamera das ganze Bild
  schwarz. Vor dem Abschluss die ganze Geschichte Bild für Bild durchlaufen und auf schwarze Bilder
  und `NaN` prüfen (Konsole: `__adventure.seek(t)`).
- Neue Stationen im Browser anschauen, nicht nur typprüfen.
- **Keine Schnitte und kein Weiß zwischen den Stationen.** Ole trägt Tapsi den ganzen Weg, und die
  Kamera fährt mit (in engen Schluchten dicht hinter Tapsi, nie durch Felsen). Nichts Großes, Helles
  steht im Weg von Kamera oder Figur: Ein Lichtschein in einer Türöffnung wird ausgeblendet, bevor
  jemand hindurchgeht, sonst wird das ganze Bild weiß.
