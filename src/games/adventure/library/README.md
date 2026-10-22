# Bewegungsbibliothek

Bewegungen für Kinder von 2 bis 4 Jahren, die ein Spiel vormacht und das Kind vor dem
Bildschirm mitmacht. Es gibt **keine Kamera**: Die Welt reagiert nach der Uhr, als hätte
das Kind mitgemacht. Deshalb behauptet kein Satz, das Kind gesehen zu haben („Super, trockene
Füße!“ statt „Du hast toll gehüpft!“).

Die Bewegung ist von Szene, Ton und Zeit getrennt: Eine Bewegung (`movements/`) weiß nur, was
der Körper tut. Wo sie passiert, steht in `scenarios.ts`, und wie lange sie in einer Geschichte
dauert, steht in `sequences.ts`. Die 3D-Geschichte (`../stories/`) fügt hinzu, was der Fuchs sagt
und wie die Welt antwortet.

| Datei | Inhalt |
| --- | --- |
| `types.ts` | Datenmodell (Bewegung, Welt, Szenario, Ablauf) |
| `categories.ts` | **Ergebnis A**: 15 Kategorien, jeweils mit dem, was *nicht* dazugehört |
| `movements/*.ts` | **Ergebnis B**: 94 Bewegungen, eine Datei pro Kategorie; `movement(id)` findet eine |
| `worlds.ts`, `scenarios.ts` | **Ergebnis C**: 18 Welten, jede mit 7–8 Momenten; jede Bewegung kommt in mindestens einer Welt vor |
| `sequences.ts` | **Ergebnis D**: 5 Abläufe mit 9–11 Bewegungen und Sekunden, 153–186 s lang |
| diese Datei | **Ergebnis E**: Qualitätskontrolle |

Die IDs (`wave_hello`, `canoe_paddle` …) bleiben fest. Umbenennen heißt: neue ID, die alte
bleibt bis zum Aufräumen. Jede Bewegung nennt einen `motion`-Clip; die Clips für den Fuchs
stehen in `../three/clips.ts` (67 Clips, keiner fehlt).

## Neue Bewegung

1. In der passenden Datei unter `movements/` anlegen. Die ID ist englisch und in `snake_case`, alle Texte sind deutsch.
2. Einen vorhandenen `motion`-Clip wählen oder in `../three/clips.ts` einen neuen bauen.
3. In mindestens einem Szenario (`scenarios.ts`) einsetzen.
4. `yarn typecheck`.

## Ergebnis E: Qualitätskontrolle

Stand: 94 Bewegungen, keine doppelte ID, kein doppelter Name. Jedes Szenario und jeder Ablauf
verweist nur auf vorhandene Bewegungen, und jede Bewegung hat eine Sitz-Variante
(`adaptations.seated`). 74 Bewegungen sind „leicht“, 20 „mittel“, keine ist „schwer“.

### Bewegungen, die sich sehr ähnlich sind

Die Paare sind gewollt, weil derselbe Körper in einer anderen Welt eine andere Geschichte
erzählt. Im selben Ablauf sollten sie aber nicht beide vorkommen:

- `magic_door_push` und `invisible_wall`: beide mit den Händen nach vorn drücken
- `rolling_ball_lean` und `peek_around`: beide zur Seite neigen
- `popcorn_pop` und `rocket_countdown`: beide aus der Hocke hochschnellen
- `sleeping_giant` und `tiptoe_sneak`: beide auf Zehenspitzen schleichen
- `jungle_stomp` und `train_march`: beide stampfen bzw. marschieren
- `bubble_wipe` und `window_wipe`: beide Kreise wischen
- `big_ball_catch` und `raindrop_catch`: beide mit den Armen auffangen
- `carousel_turn` und `turn_and_look`: beide sich drehen
- `rocket_countdown` und `seed_grow`: beide klein machen und dann groß werden
- `bridge_balance` und `line_walk`: beide auf einer Linie gehen

### Alter

- `flamingo_stand` und `line_walk` gelten erst ab 3 Jahren. Für Zweijährige gibt es nur die
  leichtere Variante (`adaptations.easier`: mit Festhalten bzw. breiter Spur).
- Alle anderen gelten von 2 bis 4 Jahren.

### Springen, Gleichgewicht, Platz

- **Springen** (`needs.jump`): `mushroom_bounce`, `puddle_jump`, `popcorn_pop`, `frog_hop`,
  `kangaroo_hop`, `rocket_countdown`. Nicht auf glattem Boden und nicht in Socken. Zweijährige
  springen oft noch nicht beidbeinig ab. Darum hat jede dieser Bewegungen eine leichtere Variante
  ohne Sprung: in den Knien federn, aufstampfen oder schnell aus der Hocke aufstehen. Von den Abläufen hat nur `space_trip` einen Sprung (`rocket_countdown`).
- **Gleichgewicht** (`needs.balance`): `bridge_balance`, `tiptoe_sneak`, `flamingo_stand`,
  `line_walk`, `tray_carry`, `sleeping_giant`. Hier kippen Kleine leicht um. Jede hat deshalb eine
  leichtere Variante: auf der Stelle bleiben, auf ganzen Füßen gehen oder sich festhalten.
- **Viel Platz** (`needs.space: "large"`): `starfish_shape` (Arme und Beine weit) und
  `carousel_turn` (sich drehen; manchen wird dabei schwindlig, die leichtere Variante ist eine
  halbe Drehung und zurück).
  29 weitere brauchen „mittel“, also einen Schritt Platz zu jeder Seite.

### Abläufe (Ergebnis D)

| Ablauf | Bewegungen | Dauer | Energie (r = ruhig, m = mittel, l = lebhaft) |
| --- | --- | --- | --- |
| `treasure_island` (spielbar) | 11 | 186 s | r m m l r m m m l l r |
| `space_trip` | 9 | 160 s | r m l m m m l r l |
| `underwater_dive` | 9 | 158 s | r m m m m l r m l |
| `winter_forest_walk` | 9 | 156 s | r m m m l r r l m |
| `farm_morning` | 9 | 153 s | r r m l m l m r m |

Die 3D-Geschichte der Schatzinsel dauert länger als die 186 s der Tabelle, etwa 3:55. Vorher
zeigt eine rote Punktspur wie auf einer Schatzkarte den Weg bis zur Truhe (16 s). Danach macht
Tapsi jede Bewegung erst einmal allein vor, bevor das Kind mitmacht (2–4 s je Bewegung).

Alle beginnen ruhig, und nach jeder lebhaften Bewegung kommt bald eine ruhige. `space_trip`
und `underwater_dive` enden lebhaft. Wenn die Geschichte vor dem Schlafen läuft, sollte dort
noch ein ruhiger Abschied dazukommen.

### Unsicherheiten

- **Keine Erkennung.** Die Welt reagiert, auch wenn das Kind nur zuschaut. Das ist gewollt,
  denn es gibt kein „falsch“. Es heißt aber auch, dass das Spiel nie erfährt, ob eine Bewegung
  zu schwer war. Das sehen nur die Eltern, und dafür gibt es das ruhige Tempo (×1,3).
- **Kein Text im Spiel.** Kinder in diesem Alter lesen nicht. Alles sagt der Fuchs, und unten
  zeigt die Leiste nur Bilder. Ist die Sprachausgabe aus, bleibt nur das Vormachen. Deshalb
  müssen die Bewegungen des Fuchses deutlich sein.
- **Leuchtende Kontur am Fuchs** (`../three/contour.ts`): Während einer Bewegung leuchtet,
  was sich gerade bewegt. Das wird aus der Geschwindigkeit der Gelenke berechnet, bei allen
  Bewegungen. Hält eine Bewegung lange still (z. B. Flamingo), verblasst das Leuchten. Das ist
  gewollt, aber noch nicht mit Kindern ausprobiert.
- **Umriss-Hilfe** (leuchtende Kinderfigur wie bei „Just Dance“, `../three/silhouette.ts`):
  bisher nur beim Winken (`wave_hello`) zum Ausprobieren. Sie zeigt eine Vorderansicht. Bei
  Bewegungen nach vorn (ducken, drücken, paddeln) sieht man von vorn wenig Tiefe, und die Figur
  bräuchte dort wohl einen leicht schrägen Blick.
- **Kamera von vorn.** Während Tapsi eine Bewegung vormacht und das Kind mitmacht, steht die
  Kamera vor Tapsi, und Tapsi ist groß in der Mitte. Nur beim Paddeln sieht man Tapsi von
  hinten, wie aus dem Kanu. Bei der Tür und beim Seil liegt das, worauf Tapsi zugeht, deshalb
  hinter der Kamera: Die Tür zeigt sich nur durch ihr Licht auf Tapsi, die Truhe erst am Ende.
  Ob Kinder das verstehen, ist noch offen.
- **Clips nur teilweise angeschaut.** Im Browser geprüft sind die 10 Clips der Schatzinsel
  (`wave`, `paddle`, `high_knees`, `duck`, `bloom`, `lean_side`, `push_forward`, `pull_rope`,
  `cheer`, `shake`). Die übrigen 57 sind programmiert und typgeprüft, aber noch nicht angesehen.
- **Zeiten sind geschätzt.** Die Sekunden der Abläufe sind nicht mit Kindern gemessen. Wird
  eine Bewegung zu lang, merkt man das daran, dass das Kind aufhört; dann diese Bewegung kürzen.
