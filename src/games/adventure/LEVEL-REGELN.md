# Regeln für Bewegungsabenteuer-Level

Gesammelt aus dem Feedback zu „Die Schatzinsel“. Vor jedem neuen Level (und jeder größeren
Änderung an einem) durchgehen. Kommt neues Feedback, gehört es hier als Regel dazu, damit derselbe
Fehler in späteren Leveln nicht wieder passiert.

## Das Kind macht alles nach

- **Jede Bewegung des Fuchses wird nachgemacht**, auch die zwischen den Stationen. Das Kind steht
  vor dem Bildschirm im Zimmer und kann sich nicht frei durch den Raum bewegen. Darum geht, hüpft
  oder steigt die Figur nie von der Stelle: Sie wird getragen (Schatzinsel: auf dem Panzer einer
  Schildkröte) und macht alles auf der Stelle. Erlaubt sind nur kleine Schritte zur Seite und zurück.
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
  Raketen aus den Pfoten waren beliebig. Schatzinsel: Die Krebse tragen die Truhe an den Strand,
  Tapsi hüpft hinunter, greift aus dem Stand tief in die Truhe und wirft die Münzen mit beiden
  Armen hoch über sich – ein Goldregen.
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
  und Ding bewegen sich zusammen, sonst dreht sich etwas wie von Geisterhand.
- Kein Satz behauptet, das Kind gesehen zu haben (es gibt keine Kamera).

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
  dass man sein Gesicht sieht, und geht erst danach hinter ihn.
- **Ausholen geht seitlich über die Schulter** (Angel): Die Pfoten gehen neben dem Kopf hoch, nicht
  vor dem Gesicht vorbei oder in den Kopf. Wo ein Arm hinter dem Körper ist, scheint er durch; er
  geht aber nie in den Körper hinein. Das Ding in der Hand legt fest, wo die Pfoten sind, nicht
  umgekehrt.
- **Wer weggescheucht wird, ist im Bild**: Kamera so hoch, dass man über den Fuchs hinweg sieht,
  was auf dem Weg sitzt, und groß genug, um es zu erkennen.
- **Was die Hände tun, ist im Bild.** Verdeckt der Körper die Hände, geht die Kamera über die
  Schulter (Schlüssel im Schloss). Was gedreht wird, muss so gebaut sein, dass man die Drehung
  sieht: Ein Schlüsselring steht längs zum Schaft; ein flacher Ring, der sich um sich selbst dreht,
  sieht aus, als stünde er still.
- **Kommt etwas auf den Fuchs zu** (rollende Kokosnüsse), steht die Kamera genau mittig hinter ihm
  und etwas tiefer, damit man sieht, wie es heranrollt.
- **Schwingt oder fliegt etwas auf den Fuchs zu** (Baumstamm), ist die Kamera direkt hinter seinem
  Kopf, knapp darüber, und schaut genau in seine Blickrichtung: Der Kopf sitzt unten im Bild, und die
  Gefahr kommt auf uns selbst zu. Nicht auf Kopfhöhe, sonst verdeckt der Kopf, was kommt.
- **Was über dem Fuchs hängt** (Äpfel), sieht man von hinten wie beim Baumstamm, aber tiefer und
  schräg nach oben: Jeder Apfel hängt sichtbar an einem Stiel unter einem Ast, mit Blatt.
- **Was rollt, bleibt im Bild.** Steht etwas Hohes vor dem Fuchs (Schildkrötenkopf), wird der Boden
  davor angehoben, damit eine rollende Nuss nicht dahinter verschwindet, und sie hüpft darüber.
- **Keine Grafik geht in eine andere.** Füße, Beine und Körper bleiben über dem Panzer (im Sitzen:
  Beine gerade nach vorn, auf den Fersen), Stangen, Seile und Taschen gehen nicht durch den Körper.
  Im Zweifel weglassen (ein Taschenriemen lief als brauner Ring durch den Fuchs). Von der Seite
  anschauen und nachmessen. Was auf dem Panzer abgelegt ist (die Angel beim Paddeln), liegt oben
  auf und folgt seiner Wölbung, statt hineinzustecken.
- Der Schwanz ist klein und verdeckt keine Beine.
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
