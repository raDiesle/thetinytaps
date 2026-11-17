# Bilder für „Gefühle“

Das Spiel besteht nur aus diesen Bildern, ohne gezeichnete Figuren und ohne Text:
ein großes Bild in der Mitte zeigt, was gerade passiert, darunter stehen die
Auswahl-Karten. Fehlt ein Bild, bleibt die Stelle leer.
- **Dateiname** genau wie in den Listen unten, z. B. `push-1.webp`
- **Format:** WebP, 1200 × 900 Pixel (4:3, quer), Qualität 65 – so bleibt jedes Bild unter ~60 KB.
- **Bewegung:** Ein zweites Bild mit `-b` dahinter (`push-1-b.webp`) ist der zweite
  Frame. Er zeigt dieselbe Szene mit einer kleinen Bewegung; in der Mitte blenden
  die Frames im Wechsel ineinander über, wie ein kleines GIF – auch auf den Karten,
  solange das Kind sie wählen kann.

Mit Gemini direkt aus dem Projekt (Key in `GEMINI_API_KEY`, Modell Nano Banana 2 Lite – das günstigste, 1K reicht; läuft als Batch zum halben Preis, das Skript wartet, bis die Bilder da sind):

```
bun run image src/games/feelings/bilder/push-1.webp "<Stilblock> <Figuren> <Prompt>" --aspect 4:3 --size 1200x900 --quality 65 --ref src/games/feelings/bilder/push-2.webp
```

Neues bewegtes Bild: erst den ersten Frame allein, dann den zweiten mit dem ersten als Referenz,
in dem nur die Bewegung beschrieben ist. Nicht beide als `--grid 1x2` in einem Auftrag: dort zeichnet
Gemini die Szene zweimal, Kamera, Kinder, Luftballons oder ein Tisch springen, und beim Überblenden wird
es unruhig, man kann der Geschichte kaum folgen.

```
bun run image src/games/feelings/bilder/push-1-b.webp "Redraw this exact picture as the second frame of a tiny two-frame animation. Keep EVERYTHING identical: same characters at exactly the same places and sizes, same clothes, colours, background, every object where it is, same camera framing (no zoom, no shift), same composition and line style. Nothing appears, disappears or moves except this small movement: <Bewegung>. No text, no letters." --ref src/games/feelings/bilder/push-1.webp --aspect 4:3 --size 1200x900 --quality 65
```

Danach `bun run frames` (oder `bun run frames <datei-b.webp>`): listet Paare, bei denen mehr als die Bewegung
anders ist, vor allem am Rand, wo fast immer Hintergrund ist. `baer-scared` darf auffallen – dort blitzt es.

## Wo die Prompts stehen

Diese Datei hat nur, was für jedes Bild gilt (Format, Befehle, die Regeln für Szene und Karten, Stilblock und Figuren); die Prompts und Listen der einzelnen Spiele und Geschichten stehen nach Thema getrennt in [`prompts/`](prompts/), damit man nur liest, was man braucht – die Prompts einer neuen Geschichte kommen dort in die passende Datei, ein neues Thema bekommt eine neue Datei und eine Zeile in dieser Liste, und eine Datei, die über etwa 60 KB wächst, wird an ihren Überschriften geteilt (`feelings.test.ts` prüft Liste und Größe).

| Datei                                                                  | Was darin steht                                                                                                                                                                                       |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [prompts/kindergarten.md](prompts/kindergarten.md)                     | „Im Kindergarten“: `push`, `kick`, `grab`, `slide`, `want`, `angry`, `bye`, `new`, `fall`, `stop`, die nicht so guten Ideen bei Schritt 2 und 3, das gute Ende (`…-ende`)                             |
| [prompts/zuhause.md](prompts/zuhause.md)                               | „Zu Hause (den Bären trösten)“: `baer-…`                                                                                                                                                              |
| [prompts/mehr-gefuehle.md](prompts/mehr-gefuehle.md)                   | „Mehr Gefühle“ (`selbst.ts`), erste Runde: `cookie`, `baby`, `broccoli`, `oops`, `snow`; „Nur die eigenen Figuren nennen“, das Bärenbaby                                                              |
| [prompts/mehr-gefuehle-runde-2a.md](prompts/mehr-gefuehle-runde-2a.md) | „Mehr Gefühle, zweite Runde“: wie die 19 gemacht sind, neue Figuren (Hund, Kassiererin, Ärztin, Oma Bär …), `leave`, `screen`, `checkout`, `jacket`, `pancake`, `vacuum`, `dog`, `doctor`, `hairwash` |
| [prompts/mehr-gefuehle-runde-2b.md](prompts/mehr-gefuehle-runde-2b.md) | „Mehr Gefühle, zweite Runde“, Fortsetzung: `night`, `lost`, `join`, `loud`, `proud`, `miss`, `shy`, `bored`, `empathy`, `startle`                                                                     |
| [prompts/tagesgeschichten.md](prompts/tagesgeschichten.md)             | „Tagesgeschichten“ (`days.ts`): die Seiten `tag…`, auch Tag 9 bis Tag 15                                                                                                                              |
| [prompts/wie-gehts-dir.md](prompts/wie-gehts-dir.md)                   | „Wie geht's dir?“: der kleine Bär allein (`gefuehl-…`) und „Wie doll ist es?“ (`…-wenig`, `…-doll`)                                                                                                   |
| [prompts/was-brauche-ich.md](prompts/was-brauche-ich.md)               | „Was brauche ich?“ (`brauche-…`) und die Grundbedürfnisse                                                                                                                                             |
| [prompts/alltagssituationen-1.md](prompts/alltagssituationen-1.md)     | „Alltagssituationen, neue Szenen“ (`alltag.ts`): wie sie gemacht sind, `puzzle`, `race`, `farewell`, `myself`, `homesick`, `barber`                                                                   |
| [prompts/alltagssituationen-2.md](prompts/alltagssituationen-2.md)     | `accident`, `laughed`, `excited`, `envy`, `supermarket`, `pointing`                                                                                                                                   |
| [prompts/alltagssituationen-3.md](prompts/alltagssituationen-3.md)     | `bee`, `phone`, `hit`, `pickup`, `bath`, `butterfly`                                                                                                                                                  |
| [prompts/alltagssituationen-4.md](prompts/alltagssituationen-4.md)     | `morning`, `worn`, `sick`, `car`, `sticky`, `nappy`                                                                                                                                                   |
| [prompts/alltagssituationen-5.md](prompts/alltagssituationen-5.md)     | `socks`, `lick`, `paintbrush`, `bluecup`, `nap`, `teeth`, `bedtime`                                                                                                                                   |
| [prompts/geplant.md](prompts/geplant.md)                               | „Geplant (noch nicht erzeugt)“: Bilder, die das Spiel schon anfragt, mit ihrem Prompt                                                                                                                 |
| [prompts/archiv.md](prompts/archiv.md)                                 | Aufgehoben: die Wetterkarten, „Was hilft dir jetzt?“ (C-31) und die Gesichter (C-29, C-30)                                                                                                            |

## So bleibt die Szene gleich

Was sich bewegen soll, ist der Kern des Bildes: was der Bär und die anderen gerade tun. Alles drumherum
bleibt von Bild zu Bild einer Geschichte gleich – Himmel, Wiese, Baum, Rutsche, Teppich, Regal, Bett,
Fenster, Kamera. Springt der Hintergrund, schaut ein Kleinkind auf das Neue statt auf die Handlung.
- **Das erste Bild einer Geschichte legt alles fest:** `…-passiert` im Kindergarten, `baer-…` zu Hause.
  Jedes weitere Bild der Geschichte wird mit genau diesem Bild als **einziger** `--ref` gezeichnet
  (auch `…-nein-2`, `…-nein-3` und `…-ende`). Eine Referenz für den Raum und eine zweite für die Pose
  verwechselt das Lite-Modell und erfindet den Raum neu. Darum muss das erste Bild stimmen, bevor die
  anderen kommen: richtige Figuren, jedes Ding nur einmal (ein Traktor, nicht zwei).
- **Die Figuren stehen fest:** wer im ersten Bild ist, bleibt da (auch wer nur zuschaut); Erwachsene kommen
  erst, wenn ein Schritt sie holt, und bleiben dann. Niemand kommt ohne Grund dazu, niemand doppelt.
  Im Prompt darum immer alle Figuren aufzählen, „each exactly once … Nobody else“.
- **Dinge bleiben dieselben:** ein Spielzeugauto bleibt ein kleines Spielzeugauto, die Decke im Bett bleibt
  dieselbe Decke. Neue Dinge nur, wenn die Handlung sie braucht (der Ball beim Warten).
- **Was sich bewegt, bleibt auch am alten Platz:** Verlässt eine Figur oder ein Ding seinen Platz aus dem ersten
  Bild, malt das Lite-Modell es oft dort noch einmal – „each exactly once“ hin oder her. In der zweiten Runde kamen so
  der kleine Bär oben auf der Rutsche und zugleich im Sandkasten, ein zweiter Fuchs, zwei Plüschhasen, die Ente auf dem
  Regal und in der Pfote, der Kuchen auf dem Tisch und am Boden. Auch ein Platz, den der Prompt ausdrücklich leer nennt, füllt es oft wieder: beim Kochen am Regentag (`bored-1`) stand dreimal ein dritter Topf da, wo der aufgehobene rote gestanden hatte. Lieber eine Handlung wählen, bei der nichts seinen Platz verlässt (der Bär kniet sich zum Ding hin), und nach drei Versuchen das beste Bild nehmen. Der Prompt sagt darum, dass der alte Platz jetzt leer
  ist („the slide is empty“, „he has taken the bunny from the sofa, so the sofa is empty now“), und „exactly ONE … in
  the whole picture“; bei vielen Kindern (die Party) jedes mit „only ONE“. Ebenso ausdrücklich: Pfoten um den Mund
  „holds nothing“ (sonst ein Megafon), ein Schreck „no speech bubble, no sound word“ (sonst ein „Ah!“), und was platzt
  oder reißt, fliegt als kleine Gummifetzen, „no red splashes“ – rote Fetzen eines Ballons sahen aus wie Blut.
- **Was passiert ist, bleibt zu sehen:** Was das erste Bild zeigt, das passiert ist, bleibt in jedem weiteren Bild – die
  Fetzen des geplatzten Ballons liegen auf dem Boden, der Bär behält den Partyhut. Ohne Satz im Prompt lässt das Modell
  sie weg; darum ausdrücklich nennen.
- **Ein neuer Ort nur, wenn die Geschichte hingeht:** beim Abschied von der Tür ans Fenster ins Spielzimmer.

Prompt für jedes weitere Bild einer Geschichte (ohne Stilblock – den Stil bringt die Referenz mit):

```
bun run image src/games/feelings/bilder/push-2.webp "Redraw this exact picture as a later moment of the same story. Keep the place exactly as it is: the same background, sky, ground, trees, playground things, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. <Was sonst gleich bleibt, z. B. Exactly one small red toy car.> Only the characters' poses, faces and places change. In the picture, each exactly once: <Figuren mit Kurzbeschreibung>. Nobody else: no other children, no other grown-ups. Now this happens: <Handlung>. Gentle, no injuries, no blood. No text, no letters." --ref src/games/feelings/bilder/push-passiert.webp --aspect 4:3 --size 1200x900 --quality 65
```

Zu Hause: „Redraw this exact picture. Keep the room exactly as it is: the same walls, window, curtains, bed,
furniture, shelves, toys and rug at the same places, the same light and time of day, the same camera framing
(no zoom, no shift), the same colours and line style. The little bear is the only character; a child's hands
or arms may come in from the bottom edge, never a whole child, no child's face. Change only what happens: …“
mit `baer-…` als `--ref`. Tut der Bär es selbst (stampfen, pusten, werfen), heißt der Satz stattdessen „The little
bear is the only character, seen whole from head to feet. No hands, no arms come in from the edges“ – sonst malt
Gemini eine Kinderhand dazu, die auf ihn zeigt, und man fragt sich, wer da was tut. Liegt der Bär im Bett, während er in `baer-…`
sitzt (`baer-tired`: auf der Bettkante), behält das Modell das Sitzen – unter der Decke, die Füße hängen heraus –,
bis der Prompt es ausdrücklich verneint: „He is NOT sitting: he lies flat on his back along the bed, head on the
pillow … no legs or feet hang over the edge of the bed“. Auch so kam er beim Teddy noch zweimal sitzend zurück: Bilder, in denen er weiter
liegt (`trost-cuddle`, `baer-tired-gut`), werden darum aus einem Bild gezeichnet, in dem er schon liegt
(`trost-lullaby` als einzige `--ref`, „keeps lying exactly as he lies here … does NOT sit up“). Karten, die bei mehreren Gefühlen vorkommen (`trost-hug`, `trost-teddy`), passen
nicht in jeden Raum; sie zeigen den Bären nah, mit wenig Raum drumherum.

Danach `bun run frames --scenes`: vergleicht den Rand jedes Bildes (fast immer Hintergrund) mit dem ersten Bild
der Geschichte und listet, was nach neuem Ort, Zoom oder neuer Kamera aussieht. So neu gezeichnete Bilder
liegen bei 0–10 %. Ob alle Figuren da sind, sieht das Skript nicht – das zeigt nur ein Blick auf die Bilder
einer Geschichte nebeneinander. `bye` darf auffallen, dort wechselt der Ort.

## Jede Karte versteht man ohne Worte

Vor dem Erzeugen und danach jede Karte für sich allein anschauen, ohne Beschriftung, und fragen: Was zeigt sie?
Erzählt sie genau eine Sache? (Rückmeldung November 2026 zum wütenden Bären: Dass er das Auto wirft, sah man nicht;
er pustete zum umgefallenen Turm, als blase er ihn um; das Stampfen mit beiden Füßen war nicht zu erkennen.)
- **Die Handlung ist das Größte im Bild, im eindeutigen Moment:** Werfen – der Arm ausgestreckt, das Ding hat gerade
  die Pfote verlassen, nah an ihr, Bewegungslinien dazwischen (nicht irgendwo ein Spielzeug in der Luft). Stampfen –
  der Bär ganz bis zu den Füßen, beide Sohlen schlagen zugleich auf, Aufprall-Linien unter beiden; im zweiten Frame
  beide Füße oben.
- **Nichts liegt in der Richtung der Handlung:** Atem, Wurf, Tritt oder Stampfen gehen ins Leere, weg von allen Dingen
  und Figuren – sonst liest man, dass er es umpustet, trifft oder kaputt macht. Tief pusten: der Atem steigt nach oben.
  Der Anlass eines Gefühls ist darum am besten etwas, das keine Karte zu treffen scheint (statt des umgefallenen Turms
  ein Schuh, der nicht angeht). Atem geht nie zu einem Kuchen oder Essen: der Bär dreht sich vom Tisch weg und pustet
  nach oben („turned away from the table so that his back is to the cake … rises straight upwards into the empty air“)
  – neben dem Geburtstagskuchen sah „Tief pusten“ aus, als blase er die Kerzen aus oder spucke auf den Kuchen.
- **Eine gute Idee hilft sichtbar, im Gesicht:** Nach Pusten, Atmen, Umarmen schaut er erleichtert und froh – Augen
  sanft zu, ein Lächeln, kein rotes Gesicht mehr. Das wütende Gesicht haben nur das erste Bild und die nicht so guten
  Ideen. Das Modell übernimmt das rote Gesicht der Referenz („calm again“ kam rot zurück): im Prompt ausdrücklich
  „plain brown face, NO red or pink patches at all“.
- **Die Kleidung nennen, wenn sich die Haltung stark ändert:** Beim Stampfen kam der Bär ohne T-Shirt zurück. Im
  Prompt darum „dressed exactly as in the picture: light-blue t-shirt and dark blue-purple trousers“.

## Wer handelt, sieht man sofort

Jede Karte zeigt eindeutig, wer etwas tut: der Bär selbst (sagt „Stopp!“, geht weg, holt Hilfe),
das Kind für den Bären (nur Hände oder Arme vom Rand), oder der Bär geht zu jemandem, um sich trösten
zu lassen (man sieht ihn hingehen, nicht schon im Arm). Der erste Satz des Prompts sagt, wer handelt;
diese Figur ist vorn, groß und tut es deutlich, die anderen schauen hin oder reagieren. Regeln dazu in
`../CLAUDE.md` („Who acts must be plain“).

## So bleiben die Figuren gleich

Bildgeneratoren erfinden die Figuren sonst jedes Mal neu. Darum:
1. **Zuerst den Figurenbogen erzeugen** (Prompt unten). Nimm das beste Ergebnis.
2. **Den Figurenbogen bei jedem weiteren Bild mitgeben:**
   - ChatGPT: im selben Chat bleiben oder den Bogen jedes Mal anhängen
     („Use the attached character sheet“)
   - Midjourney: `--cref <URL des Bogens> --sref <URL des Bogens> --ar 4:3`
   - Firefly / andere: den Bogen als Stil- und Struktur-Referenz verwenden
3. **Jedem Prompt den Stilblock voranstellen.**

Prüfe jedes Bild mit der Frage: _Versteht ein Kind, das nicht lesen kann, was der
Bär da tut, und ob es gut oder schlecht ausgeht?_ Gesichter müssen das Gefühl deutlich
zeigen. Bei den „nicht so guten“ Bildern soll man die Handlung klar sehen, aber
sanft: keine Verletzungen, kein Blut.

### Stilblock (vor jeden Prompt)

```
Children's picture-book illustration for 2–4 year olds. Soft, flat, rounded
shapes with thick dark-purple outlines (#2a1e5c), bright friendly colours, gentle
shading. Simple, uncluttered background. The characters are large and fill the
frame; faces and body language are very expressive and readable from far away.
No text, no letters, no numbers, no speech bubbles, no frames. Landscape 4:3.
```

### Figuren (bei jedem Prompt mitgeben)

```
Characters (small animal children, toddler proportions, big round heads):
- The little bear: warm brown fur, light beige muzzle, round ears with beige
  inside, light-blue t-shirt, dark blue-purple trousers.
- The fox: orange fur, white muzzle, pointed ears, mint-green t-shirt,
  coral-red trousers.
- The bunny: white fur, long ears pink inside, yellow t-shirt, light-blue trousers.
- The teacher: a grown-up grey mouse, taller than the children, big round ears
  pink inside, round glasses, purple shirt with a white apron, kind face.
- The big bear: the little bear's grown-up, much taller, same warm brown fur and
  beige muzzle, green knitted sweater, kind face.
- The little hedgehog: a small hedgehog child, light-brown face, round dark-brown
  spikes, red t-shirt, yellow trousers.
- The raccoon: a small raccoon child, grey fur, a black mask round the eyes, a
  bushy tail with dark rings, orange-and-white striped t-shirt, brown trousers.
```

The raccoon is the one who pushes, kicks, takes or knocks over in a new story – never the fox or a bear, the app's
mascots (user decision, November 2026). The kindergarten pictures made before keep their fox until the user asks for
them to be redrawn.

### Figurenbogen (als Erstes)

```
Character sheet: the little bear, the fox, the bunny and the teacher standing
side by side, front view, neutral friendly faces, plain white background.
```
