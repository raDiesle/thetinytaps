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
| `movements/*.ts` | **Ergebnis B**: 100 Bewegungen, eine Datei pro Kategorie; `movement(id)` findet eine |
| `worlds.ts`, `scenarios.ts` | **Ergebnis C**: 18 Welten, jede mit 7–9 Momenten; jede Bewegung kommt in mindestens einer Welt vor |
| `sequences.ts` | **Ergebnis D**: 5 Abläufe mit 9–17 Bewegungen und Sekunden, 153–240 s lang |
| `situations.ts` | **Ergebnis F**: Situationskatalog, je 6 typische Situationen für jede der 72 Körperbewegungen; `situationsFor(id)` findet sie für eine Bewegung |
| diese Datei | **Ergebnis E**: Qualitätskontrolle |

Die IDs (`wave_hello`, `canoe_paddle` …) bleiben fest. Umbenennen heißt: neue ID, die alte
bleibt bis zum Aufräumen. Jede Bewegung nennt einen `motion`-Clip; die Clips für den Fuchs
stehen in `../three/clips.ts` (72 Clips, keiner fehlt).

## Neue Bewegung

1. In der passenden Datei unter `movements/` anlegen. Die ID ist englisch und in `snake_case`, alle Texte sind deutsch.
2. Einen vorhandenen `motion`-Clip wählen oder in `../three/clips.ts` einen neuen bauen.
3. In mindestens einem Szenario (`scenarios.ts`) einsetzen.
4. Bei einem neuen Clip: in `situations.ts` sechs Situationen dazuschreiben, mindestens zwei aus dem Alltag.
5. `yarn typecheck`.

## Ergebnis F: Situationskatalog

`scenarios.ts` geht von der Welt aus: Was passiert im Dschungel? `situations.ts` geht von der
Bewegung aus: Wann duckt man sich, ohne dass es einer sagt? Eine Bewegung erklärt sich am
besten selbst, wenn die Situation sie verlangt. Hängt die Wäscheleine tief, duckt man sich.
Sind die Hände nass und kein Handtuch da, schüttelt man sie aus.

Der Katalog hängt am Clip, also an der reinen Körperbewegung. Darum gilt jede Idee für alle
Bewegungen mit diesem Clip (`push_forward` passt zu Zaubertür, Schneeball und Glaswand).

- Jede Situation hat ein Gegenüber, auf das die Bewegung wirkt, und eine Antwort der Welt.
  Auch hier behauptet keine Antwort, das Kind gesehen zu haben.
- **Alltag** (`everyday`): Kennt das Kind aus seinem eigenen Tag, z. B. Socke anziehen, Ampelknopf
  drücken, links und rechts schauen. Daran knüpft eine Geschichte an, ohne zu erklären. Und
  das Kind findet die Bewegung später im echten Leben wieder.
- **Welten** (`worlds`): Wo die Idee hinpasst. Bauen sich daraus neue Szenarien oder
  Abläufe, steht der Moment danach in `scenarios.ts` bzw. `sequences.ts`.

Stand: 72 Clips (alle außer `idle`), 432 Situationen, davon 188 aus dem Alltag, jeder Clip mit
mindestens zwei. Am wenigsten Ideen haben Baustelle (5) und Eisenbahn (6). Keine Idee
verlangt mehr, als die Bewegung schon erlaubt: Es gibt kein schnelles Drehen und kein Drücken
gegen echte Möbel, und auf Schienen balanciert niemand.

## Ergebnis E: Qualitätskontrolle

Stand: 100 Bewegungen, keine doppelte ID, kein doppelter Name. Jedes Szenario und jeder Ablauf
verweist nur auf vorhandene Bewegungen, und jede Bewegung hat eine Sitz-Variante
(`adaptations.seated`). 79 Bewegungen sind „leicht“, 21 „mittel“, keine ist „schwer“.

### Bewegungen, die sich sehr ähnlich sind

Die Paare sind gewollt, weil derselbe Körper in einer anderen Welt eine andere Geschichte
erzählt. Im selben Ablauf sollten sie aber nicht beide vorkommen:

- `magic_door_push` und `invisible_wall`: beide mit den Händen nach vorn drücken
- `rolling_ball_lean` und `peek_around`: beide zur Seite neigen
- `popcorn_pop` und `rocket_countdown`: beide aus der Hocke hochschnellen
- `sleeping_giant` und `tiptoe_sneak`: beide auf Zehenspitzen schleichen
- `jungle_stomp` und `train_march`: beide stampfen bzw. marschieren
- `bubble_wipe` und `window_wipe`: beide Kreise wischen
- `cobweb_brush` und `bubble_wipe`: beide mit der Pfote vor sich weg wischen
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
  `kangaroo_hop`, `rocket_countdown`, `stone_jump`. Nicht auf glattem Boden und nicht in Socken. Zweijährige
  springen oft noch nicht beidbeinig ab. Darum hat jede dieser Bewegungen eine leichtere Variante
  ohne Sprung: in den Knien federn, aufstampfen oder schnell aus der Hocke aufstehen. Von den Abläufen haben `space_trip` (`rocket_countdown`) und `treasure_island` (`stone_jump`) einen Sprung.
- **Gleichgewicht** (`needs.balance`): `bridge_balance`, `tiptoe_sneak`, `flamingo_stand`,
  `line_walk`, `tray_carry`, `sleeping_giant`. Hier kippen Kleine leicht um. Jede hat deshalb eine
  leichtere Variante: auf der Stelle bleiben, auf ganzen Füßen gehen oder sich festhalten.
- **Viel Platz** (`needs.space: "large"`): `starfish_shape` (Arme und Beine weit) und
  `carousel_turn` (sich drehen; manchen wird dabei schwindlig, die leichtere Variante ist eine
  halbe Drehung und zurück).
  31 weitere brauchen „mittel“, also einen Schritt Platz zu jeder Seite.

### Abläufe (Ergebnis D)

| Ablauf | Bewegungen | Dauer | Energie (r = ruhig, m = mittel, l = lebhaft) |
| --- | --- | --- | --- |
| `treasure_island` (spielbar) | 17 | 240 s | r m l l l r m m l r r m m r l l r |
| `space_trip` | 9 | 160 s | r m l m m m l r l |
| `underwater_dive` | 9 | 158 s | r m m m m l r m l |
| `winter_forest_walk` | 9 | 156 s | r m m m l r r l m |
| `farm_morning` | 9 | 153 s | r r m l m l m r m |

Die 3D-Geschichte der Schatzinsel dauert länger als die 240 s der Tabelle, etwa 5 Minuten. Vorher
zeigt eine rote Punktspur wie auf einer Schatzkarte den Weg bis zur Truhe (8 s). Danach macht
Tapsi jede Bewegung erst einmal allein vor, bevor das Kind mitmacht (2–4 s je Bewegung, beim Stopptanz eine ganze Runde). Die
Wege zwischen den Stationen sind kurz (2–5 s), damit es ohne lange Pausen weitergeht. Eltern
können oben links pausieren und vor- oder zurückspringen, unten auf ein Bild tippen springt zu
dieser Bewegung.

Alle beginnen ruhig, und nach jeder lebhaften Bewegung kommt bald eine ruhige. `space_trip`
und `underwater_dive` enden lebhaft. Wenn die Geschichte vor dem Schlafen läuft, sollte dort
noch ein ruhiger Abschied dazukommen.

### Unsicherheiten

- **Keine Erkennung.** Die Welt reagiert, auch wenn das Kind nur zuschaut. Das ist gewollt,
  denn es gibt kein „falsch“. Es heißt aber auch, dass das Spiel nie erfährt, ob eine Bewegung
  zu schwer war. Das sehen nur die Eltern.
- **Kein Text im Spiel.** Kinder in diesem Alter lesen nicht. Alles sagt der Fuchs, und unten
  zeigt die Leiste nur Bilder. Ist die Sprachausgabe aus, bleibt nur das Vormachen. Deshalb
  müssen die Bewegungen des Fuchses deutlich sein.
- **Leuchtende Kontur am Fuchs** (`../three/contour.ts`): Während einer Bewegung leuchtet
  nur der Körperteil, um den es geht (`clipFocus` in `../three/clips.ts`: an der Kurbel die Arme,
  beim Stampfen die Beine), als schmaler neongrüner Rand ohne Muster, und nur solange er sich
  bewegt. Das wird aus der Geschwindigkeit der Gelenke berechnet, bei allen Bewegungen. Hält eine Bewegung lange still (z. B. Flamingo), verblasst das Leuchten. Das ist
  gewollt, aber noch nicht mit Kindern ausprobiert.
- **Umriss-Hilfe** (dunkle Kinderfigur mit leuchtendem Rand wie bei „Just Dance“,
  `../three/silhouette.ts`): bei allen Bewegungen, mit einem hellen Strichskelett, Gelenkpunkten
  und Fingern, damit man die Gelenke gut erkennt. Sie zeigt die Figur von derselben Seite, von
  der die Kamera Tapsi sieht, meist also von hinten. Beim Drücken und Ziehen sieht man sie
  deshalb schräg von der Seite, sonst wären die Arme hinter dem Körper versteckt.
- **Kamera von hinten.** Tapsi schaut immer zur Insel, und die Kamera steht hinter Tapsi: Das
  Kind sieht, was Tapsi sieht, und links ist links. Wo die Arme vor dem Körper arbeiten (Tür,
  Seil, Blumen), steht sie höher und seitlich, damit die Arme sichtbar bleiben. Tapsis Gesicht
  sieht das Kind dabei kaum; erst nach dem Aufschließen der Truhe dreht Tapsi sich um und jubelt,
  tanzt und winkt uns von vorne zu, mit fröhlichem Gesicht. Ob Kinder so besser mitmachen als mit
  einem Fuchs, der sie anschaut, ist noch offen.
- **Jede Bewegung hat ein Gegenüber.** Tapsi winkt Kiki zu (Kiki fliegt am Anfang heran und am
  Ende davon), paddelt im Kanu sitzend, stampft Skorpione platt, springt über die Steine im Bach und stößt
  mit dem Kopf an schwebende Sternkisten (von der Seite gefilmt wie ein Jump-and-Run), duckt sich unter dem
  schaukelnden Baumstamm, öffnet mit den Armen die Blumen, kurbelt das Holztor hoch, macht den
  rollenden Kokosnüssen Platz, weicht den Nüssen der Affen in Zeitlupe mit dem Oberkörper aus,
  pflückt Äpfel in den Korb, löst das Bilderrätsel an der Tür (groß, breit, klein), wedelt die
  Spinnweben dahinter weg (statt eine Tür aufzudrücken, gegen die das Kind im Zimmer nichts zum Drücken hätte), zieht die Truhe am Seil heran, schließt sie mit dem
  Schlüssel auf, jubelt und macht mit Kiki und den Krebsen Stopptanz, und zum Schluss gibt es ein Feuerwerk.
- **Stopptanz** (`freeze` in `../three/clips.ts`, `STOP_DANCE`): Musik an, alle tanzen; hört sie
  auf, frieren Tapsi, Kiki und die Krebse ein, mal wackelig, mal als Statue auf einem Bein, mal
  lustig mit einem Arm hoch. Die Pausen sind verschieden lang (1,5–3 s), damit niemand mitzählen
  kann. Das Zeichen ist nur die Stille: Tapsi sagt kein „Stopp!“. Ist die Musik ausgeschaltet,
  bleibt nur das Bild, dann frieren alle trotzdem ein.
- **Kein Hüpfen nach vorne.** Das Kind soll sich nicht durch den Raum bewegen. Tapsi hüpft
  zwar über die Brücke, das Kind aber auf der Stelle (`stone_jump`, leichter: auf die Zehenspitzen
  und den Kopf hochstrecken). Sonst gibt es nur kleine Schritte zur Seite und zurück.
- **Clips nur teilweise angeschaut.** Im Browser geprüft sind die Clips der Schatzinsel
  (`wave`, `paddle`, `stomp`, `jump`, `duck`, `bloom`, `crank`, `step_side`, `lean_side`,
  `reach_up`, `shapes`, `brush_away`, `pull_rope`, `turn_key`, `cheer`, `shake`). Die übrigen sind
  programmiert und typgeprüft, aber noch nicht angesehen.
- **Zeiten sind geschätzt.** Die Sekunden der Abläufe sind nicht mit Kindern gemessen. Wird
  eine Bewegung zu lang, merkt man das daran, dass das Kind aufhört; dann diese Bewegung kürzen.
