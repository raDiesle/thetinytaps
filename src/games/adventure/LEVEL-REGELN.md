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

## Die Welt antwortet im Takt

- **Jede Bewegung wirkt auf etwas** (Kiki winken, Skorpione platt stampfen, Kurbel drehen …).
- **Was die Bewegung trifft, kommt in Bewegung an**, genau im Moment des Treffers: Ein Skorpion
  krabbelt noch, wenn der Fuß auf ihn tritt; er wartet nicht unter dem Fuß.
- **Zu jedem Treffer gibt es ein Ziel.** Tritt der Fuchs zehnmal, kommen zehn Skorpione, und die
  letzten Tritte gehen nicht ins Leere. Zählen: Anzahl der Treffer im Clip (Zeigen + Mitmachen)
  gegen die Anzahl der Dinge.
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
- Der Schwanz ist klein und verdeckt keine Beine.

## Technik

- **Kein Bild darf schwarz werden**: Positionen nie aus Werten außerhalb einer Strecke berechnen
  (z. B. `-Infinity * 0 = NaN`); eine `NaN`-Position der Figur macht über die Kamera das ganze Bild
  schwarz. Vor dem Abschluss die ganze Geschichte Bild für Bild durchlaufen und auf schwarze Bilder
  und `NaN` prüfen (Konsole: `__adventure.seek(t)`).
- Neue Stationen im Browser anschauen, nicht nur typprüfen.
