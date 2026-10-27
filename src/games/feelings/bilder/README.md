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
- **Ein neuer Ort nur, wenn die Geschichte hingeht:** beim Abschied von der Tür ans Fenster ins Spielzimmer.

Prompt für jedes weitere Bild einer Geschichte (ohne Stilblock – den Stil bringt die Referenz mit):

```
bun run image src/games/feelings/bilder/push-2.webp "Redraw this exact picture as a later moment of the same story. Keep the place exactly as it is: the same background, sky, ground, trees, playground things, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. <Was sonst gleich bleibt, z. B. Exactly one small red toy car.> Only the characters' poses, faces and places change. In the picture, each exactly once: <Figuren mit Kurzbeschreibung>. Nobody else: no other children, no other grown-ups. Now this happens: <Handlung>. Gentle, no injuries, no blood. No text, no letters." --ref src/games/feelings/bilder/push-passiert.webp --aspect 4:3 --size 1200x900 --quality 65
```

Zu Hause: „Redraw this exact picture. Keep the room exactly as it is: the same walls, window, curtains, bed,
furniture, shelves, toys and rug at the same places, the same light and time of day, the same camera framing
(no zoom, no shift), the same colours and line style. The little bear is the only character; a child's hands
or arms may come in from the bottom edge, never a whole child, no child's face. Change only what happens: …“
mit `baer-…` als `--ref`. Karten, die bei mehreren Gefühlen vorkommen (`trost-hug`, `trost-teddy`), passen
nicht in jeden Raum; sie zeigen den Bären nah, mit wenig Raum drumherum.

Danach `bun run frames --scenes`: vergleicht den Rand jedes Bildes (fast immer Hintergrund) mit dem ersten Bild
der Geschichte und listet, was nach neuem Ort, Zoom oder neuer Kamera aussieht. So neu gezeichnete Bilder
liegen bei 0–10 %. Ob alle Figuren da sind, sieht das Skript nicht – das zeigt nur ein Blick auf die Bilder
einer Geschichte nebeneinander. `bye` darf auffallen, dort wechselt der Ort.

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
```

### Figurenbogen (als Erstes)

```
Character sheet: the little bear, the fox, the bunny and the teacher standing
side by side, front view, neutral friendly faces, plain white background.
```

## Im Kindergarten

Pro Geschichte: `…-passiert` (was passiert ist), `…-1` bis `…-3` (die guten
Schritte in dieser Reihenfolge), `…-nein` (die nicht so gute Idee neben Schritt 1) und `…-ende`
(alle fröhlich, das Bild am Schluss) – jeweils mit zweitem Frame `…-b`. Neben Schritt 2 und 3
stehen `…-nein-2` und `…-nein-3` (nur ein Frame; wie alle Bilder der Geschichte mit `…-passiert` als `--ref`, siehe „So bleibt die Szene gleich“).

Erwachsene (Erzieherin, großer Bär) sind erst im Bild, wenn ein Schritt sie holt oder ruft: kommt „Hilfe
holen“ erst noch, zeigen `…-passiert` und die Bilder davor nur die Kinder – sonst fragt man sich, warum
der Bär Hilfe holen soll, wenn sie schon danebensteht. Eine nicht so gute Idee zeigt dieselben Kinder wie die Szene davor.

### Nicht so gute Ideen bei Schritt 2 und 3

Vor jeden Prompt: Stilblock, Figuren und „This is the not-so-good idea: the action must be clearly
visible, but gentle – no injuries, no blood.“ und dazu den Rahmen aus „So bleibt die Szene gleich“.

| Datei          | Prompt                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `push-nein-2`  | Playground, grass, a tree. Only the little bear and the fox. The little bear throws a handful of sand at the fox; the fox covers his eyes and cries.                                                                           |
| `push-nein-3`  | Playground. No grown-ups. The little bear angrily stomps on the fox's toy bucket and flattens it. The fox stands next to it and cries.                                                                                         |
| `kick-nein-2`  | Playground. No grown-ups. The little bear pulls the fox's ear hard, angry face. The fox cries.                                                                                                                                 |
| `kick-nein-3`  | Playground. Only the little bear and the fox. The little bear has snatched the fox's green cap off his head and throws it away with a big arm swing; the cap flies towards a muddy puddle. The fox reaches after it and cries. |
| `grab-nein-2`  | Sandbox, a red toy tractor. The little bear hits the fox on the arm to get the tractor back, angry face. The fox cries and still holds the tractor.                                                                            |
| `grab-nein-3`  | Sandbox. The little bear holds the red toy tractor tight and points away with his other paw, sending the fox away. The fox walks off alone, sad, head down.                                                                    |
| `slide-nein-2` | Playground with a slide and ladder. The little bear lies on the ground at the ladder and screams in a big tantrum, kicking his legs. The bunny and the fox look at him, unhappy, covering their ears.                          |
| `slide-nein-3` | Playground with a slide. The little bear sits at the top of the slide and holds on tight, blocking it. The bunny and the fox wait below, sad and impatient.                                                                    |
| `want-nein-2`  | Outside. The little bear stands next to the bunny and screams loudly at him, angry, mouth wide open. The bunny holds the shiny red toy car and covers one ear, sad.                                                            |
| `want-nein-3`  | Outside. The little bear hugs both the shiny red toy car and the ball tightly to his chest and turns away. The bunny stands with empty paws and cries.                                                                         |
| `angry-nein-2` | Playroom, colourful blocks. The angry little bear kicks over the fox's own block tower; blocks fly. The fox cries.                                                                                                             |
| `angry-nein-3` | Playroom, colourful blocks. The angry little bear hits the fox with his paw. The fox holds his arm and cries.                                                                                                                  |

### Geschubst (`push`) – draußen auf dem Spielplatz, Wiese, ein Baum

| Datei           | Prompt                                                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `push-passiert` | The fox pushes the little bear with both paws. The bear stumbles backwards, sad face with tears. The fox looks angry.                                                                                       |
| `push-1`        | „Stopp! Nein!“ – The little bear stands firm and holds one paw up high towards the fox, palm out, a clear stop gesture. Serious, brave face, mouth open as if shouting "Stop!". The fox freezes, surprised. |
| `push-2`        | „Weggehen“ – The little bear walks away from the fox with calm steps, footprints in the grass behind him. Big distance between them; the fox stays small in the background.                                 |
| `push-3`        | „Hilfe holen“ – The little bear has run to the teacher and points back at the fox. The teacher bends down and listens kindly.                                                                               |
| `push-nein`     | „Zurückschubsen“ – The little bear pushes the fox back with both paws, angry face. The fox stumbles and cries. Nobody is happy.                                                                             |

### Getreten (`kick`) – draußen auf dem Spielplatz

| Datei           | Prompt                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `kick-passiert` | The fox kicks the little bear against the leg. The bear holds his leg and cries.                                                                                         |
| `kick-1`        | „Stopp!“ – The little bear holds one paw up high towards the fox, palm out, a clear stop gesture, brave face, shouting. The fox stops, one foot still lifted, surprised. |
| `kick-2`        | „Weggehen“ – The little bear walks away to the other side, footprints behind him, a big distance to the fox, calm face.                                                  |
| `kick-3`        | „Hilfe holen“ – The little bear waves and calls the teacher; the teacher comes over and talks to the fox, who looks down, sorry.                                         |
| `kick-nein`     | „Zurücktreten“ – The little bear kicks back at the fox, angry face. The fox cries. Both are unhappy.                                                                     |

### Weggenommen (`grab`) – im Sandkasten, ein roter Spielzeug-Traktor

| Datei           | Prompt                                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `grab-passiert` | In the sandbox the fox snatches the red toy tractor out of the little bear's paws. The bear reaches after it, sad.                                                             |
| `grab-1`        | „Das ist meins!“ – The little bear stands firm, one paw up in a stop gesture, the other pointing at the tractor the fox is holding. Brave, serious face. The fox is surprised. |
| `grab-2`        | „Zurück, bitte“ – The little bear holds out both open paws with a friendly asking face. The fox gives the tractor back, looking sorry.                                         |
| `grab-3`        | „Mitspielen?“ – The little bear and the fox sit together in the sandbox and play: the bear with the tractor, the fox with a bucket and spade. Both laugh.                      |
| `grab-nein`     | „Wegreißen“ – The little bear and the fox both pull hard at the tractor, a tug of war, both angry and shouting.                                                                |

### Rutsche voll (`slide`) – Spielplatz mit Rutsche und Leiter

| Datei            | Prompt                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slide-passiert` | The slide is full: the bunny sits at the top, the fox climbs the ladder. The little bear runs up and wants to slide right now, impatient and sad. |
| `slide-1`        | „Anstellen“ – The little bear stands in line at the bottom of the ladder, behind the fox, calm and patient.                                       |
| `slide-2`        | „Warten“ – The bunny slides down happily. The little bear waits at the ladder, patient, watching with a calm smile.                               |
| `slide-3`        | „Jetzt ich!“ – The little bear slides down the slide, laughing, arms up high. The bunny and the fox cheer at the bottom.                          |
| `slide-nein`     | „Vordrängeln“ – The little bear pushes past the fox on the ladder. The fox almost falls off the ladder, scared. Clearly dangerous.                |

### Haben wollen (`want`) – draußen, ein glänzendes rotes Spielzeugauto

| Datei           | Prompt                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `want-passiert` | The bunny plays happily with a shiny red toy car. The little bear watches and reaches out, longing to have it.                                     |
| `want-1`        | „Fragen“ – The little bear asks the bunny politely, paws together, friendly face, leaning forward a bit. The bunny listens, still holding the car. |
| `want-2`        | „Warten“ – Meanwhile the little bear plays with a ball and is content. The bunny still plays with the car.                                         |
| `want-3`        | „Tauschen“ – The bunny gives the car to the little bear and gets the ball. Both are happy.                                                         |
| `want-nein`     | „Wegnehmen“ – The little bear grabs the car out of the bunny's paws. The bunny cries.                                                              |

### Selbst wütend (`angry`) – drinnen im Spielzimmer, bunte Bauklötze

| Datei            | Prompt                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angry-passiert` | The fox has knocked over the little bear's tall tower of colourful blocks by accident; blocks are flying. The bear is furious: red face, fists clenched. The fox is startled. |
| `angry-1`        | „Stampfen“ – The little bear stomps hard on the floor with both feet, angry face, motion lines at his feet. Nobody else is touched.                                           |
| `angry-2`        | „Tief pusten“ – The little bear breathes in deeply and blows out slowly, cheeks round, eyes closed, a visible puff of air. He is getting calmer.                              |
| `angry-3`        | „Sagen“ – The little bear tells the fox how he feels, one paw on his chest. The fox looks sorry and starts to rebuild the tower with him.                                     |
| `angry-nein`     | „Schubsen“ – The angry little bear pushes the fox. The fox falls on the floor and cries.                                                                                      |

In den vier Geschichten unten haben diese Bilder nur einen Frame, weil im zweiten die Szene
sprang statt sich nur ein wenig zu bewegen: `bye-passiert`, `bye-3`, `bye-nein`,
`new-passiert`, `new-nein`, `new-ende`, `fall-3`, `fall-ende`, `stop-1`, `stop-nein`.
Die übrigen zweiten Frames dieser Geschichten waren als `--grid 1x2` entstanden und sprangen auch; sie sind
neu mit dem ersten Frame als Referenz gezeichnet (siehe oben, `bun run frames`).

### Abschied an der Tür (`bye`) – Eingang mit Garderobe, Tür und Fenster

| Datei          | Prompt                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bye-passiert` | The big bear has to go to work and says goodbye at the door. The little bear clings to the big bear's leg and cries, big tears.                                            |
| `bye-1`        | „Fest drücken“ – The big bear kneels down and the little bear hugs him tight goodbye, both with eyes closed, small hearts.                                                 |
| `bye-2`        | „Am Fenster winken“ – The little bear stands at the window inside and waves goodbye with a smile; outside, the big bear, small in the distance, walks away and waves back. |
| `bye-3`        | „Mitspielen“ – Playroom: the teacher sits on the floor with the little bear and the fox; they build a tower of blocks together. The little bear smiles again.              |
| `bye-nein`     | „Hinterherrennen“ – The little bear runs after the big bear out of the open door towards the street with cars; the teacher reaches after him, worried. Clearly dangerous.  |
| `bye-nein-2`   | The little bear hides alone under the coats on the hooks, only his sad face peeking out.                                                                                   |
| `bye-nein-3`   | Playroom. The little bear sits alone in a corner, sad and bored, while the teacher and the fox play blocks far away.                                                       |
| `bye-ende`     | Afternoon light. The big bear comes back to pick him up: the little bear runs into his open arms, both laugh happily.                                                      |

### Neu im Kindergarten (`new`) – Spielzimmer, bunte Bauklötze

| Datei          | Prompt                                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new-passiert` | A new child, the little hedgehog, stands alone and shy at the door, looking down, paws together. The little bear and the fox play with blocks in the background and look at him. |
| `new-1`        | „Hallo sagen“ – The little bear walks up to the little hedgehog and waves hello with a big friendly smile. The hedgehog looks up, surprised and a bit shy.                       |
| `new-2`        | „Bauklötze zeigen“ – The little bear shows the little hedgehog the colourful blocks and holds one out to him. The hedgehog looks curious and smiles a little.                    |
| `new-3`        | „Mitspielen lassen“ – The little bear, the fox and the little hedgehog sit together on the floor and build a tower of blocks. All laugh.                                         |
| `new-nein`     | „Auslachen“ – The little bear points at the little hedgehog's spikes and laughs at him. The hedgehog is sad, head down, a tear.                                                  |
| `new-nein-2`   | The little bear hides all the blocks behind his back and turns away from the little hedgehog. The hedgehog stands with empty paws, sad.                                          |
| `new-nein-3`   | The little bear and the fox play together with their backs to the little hedgehog. The hedgehog sits alone, sad.                                                                 |
| `new-ende`     | The little bear, the fox and the little hedgehog stand next to their tall tower of blocks and cheer together, friends.                                                           |

### Hingefallen (`fall`) – Spielplatz, Wiese, ein Baum

| Datei           | Prompt                                                                                                                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fall-passiert` | No grown-ups. The little bear has fallen down while running: he sits on the grass and holds his knee, crying. A small red scrape on the knee, no blood. The fox, the bunny and the little hedgehog stand around him, worried.             |
| `fall-1`        | „Hilfe rufen“ – The little bear sits on the grass, holds his knee and calls out loud with one paw raised. The teacher comes running towards him.                                                                                          |
| `fall-2`        | „Pflaster drauf“ – The teacher kneels and puts a colourful plaster on the little bear's knee. The bear watches, calmer, sniffing.                                                                                                         |
| `fall-3`        | „Langsam weiterspielen“ – The fox helps the little bear up with his paw; the bear has a plaster on his knee. They roll a ball to each other, slowly and carefully.                                                                        |
| `fall-nein`     | „Strampeln und schreien“ – Same scene and children as `fall-passiert` (`--ref`), no grown-ups. The little bear lies on the grass in a big tantrum, kicking his legs and screaming; the fox, the bunny and the hedgehog look on, helpless. |
| `fall-nein-2`   | The little bear pulls the plaster off his knee and makes an ouch face. The teacher looks worried.                                                                                                                                         |
| `fall-nein-3`   | The little bear with a plaster on his knee runs wildly and fast again and is about to trip over a root. The fox looks worried.                                                                                                            |
| `fall-ende`     | The little bear proudly shows his colourful plaster on the knee and laughs; the fox and the teacher smile.                                                                                                                                |

### Hört nicht auf (`stop`) – Spielplatz, Wiese, ein Baum

| Datei           | Prompt                                                                                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `stop-passiert` | The fox tickles the little bear and won't stop. The bear squirms away, not laughing anymore, unhappy face, pushing the fox's paws away. The fox laughs.                              |
| `stop-1`        | „Stopp!“ – The little bear stands firm and holds one paw up high towards the fox, palm out, a clear stop gesture, brave face, shouting. The fox stops, paws still raised, surprised. |
| `stop-2`        | „Fangen vorschlagen“ – The little bear points across the grass with a friendly face, asking the fox to play tag. The fox nods happily.                                               |
| `stop-3`        | „Fangen spielen“ – The little bear and the fox play tag on the grass: the fox runs away laughing, the bear runs after him, laughing.                                                 |
| `stop-nein`     | „Beißen“ – The little bear bites the fox's arm. The fox cries and pulls his arm away. Gentle, no injury.                                                                             |
| `stop-nein-2`   | The little bear tickles the fox wildly; the fox squirms away, unhappy, holding up one paw to stop him.                                                                               |
| `stop-nein-3`   | The little bear stomps away alone with crossed arms, sulking. The fox stands alone behind him, sad.                                                                                  |
| `stop-ende`     | The little bear and the fox, out of breath from playing, give each other a high five and laugh.                                                                                      |

### Das gute Ende (`…-ende`)

| Datei        | Prompt                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `push-ende`  | Playground. The little bear jumps for joy with both arms up; the fox smiles and waves, friends again; the teacher smiles proudly. |
| `kick-ende`  | Playground. The little bear jumps for joy; the fox smiles shyly and offers a high five; the teacher smiles proudly.               |
| `grab-ende`  | Sandbox. The little bear proudly holds up the red toy tractor and laughs; the fox claps and laughs too.                           |
| `slide-ende` | At the bottom of the slide the little bear, the fox and the bunny cheer together with paws up high.                               |
| `want-ende`  | The little bear drives the red toy car, the bunny holds the ball up high; both laugh and play together.                           |
| `angry-ende` | Playroom. The tower of blocks stands again; the little bear and the fox stand next to it, laughing proudly.                       |

## Zu Hause (den Bären trösten)

Nur der kleine Bär, in einem gemütlichen Kinderzimmer. Wer tröstet, ist das Kind
vor dem Bildschirm: zeige nur **Kinderhände oder -arme**, die von vorn ins Bild
kommen, nie ein ganzes Kind.

`baer-…` zeigt in der Mitte, wie es dem Bären am Anfang geht – in jeder der drei Runden wieder. Daneben
zwei Karten: links die nicht so gute Idee der Runde (`baer-…-nein` in Runde 1, `baer-…-nein-2`, `baer-…-nein-3`),
rechts die gute (`trost-…`, danach auch das Bild in der Mitte). `baer-…-gut` zeigt ihn am Ende wieder froh.
Alle mit zweitem Frame `…-b`, außer `trost-hug` und `baer-…-nein…` (mit `baer-…` als `--ref` erzeugt).

**Nur was im Bild ist:** Eine Karte nimmt, wirft oder macht nur kaputt, was im ersten Bild der Geschichte schon zu
sehen ist (`baer-sad`: Bauklötze auf dem Teppich, die Spielzeugkiste mit Teddy und Dino, Bücher im Regal, das Bett).
Hält der Bär dort keinen Teddy, kann ihn auch keine Karte wegnehmen – dann eine andere Idee wählen, statt das erste
Bild neu zu zeichnen. Mitbringen darf eine Karte etwas Neues (Teddy aus der Kiste geben, Licht anmachen).

| Datei                | Prompt                                                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baer-sad`           | The little bear sits on the floor and cries, big tears, shoulders down.                                                                                           |
| `baer-angry`         | The little bear is angry: his block tower has fallen over next to him, red face, fists clenched.                                                                  |
| `baer-tired`         | Night, a moon in the window. The little bear yawns widely and rubs his eyes.                                                                                      |
| `baer-scared`        | Night, a thunderstorm with lightning outside the window. The little bear hides behind a pillow, big scared eyes.                                                  |
| `trost-stroke`       | A child's hand gently strokes the little bear's head. The bear smiles with closed eyes; small hearts.                                                             |
| `trost-hug`          | Side view: rainbow-sleeved arms from the left edge hug the bear; he hugs back, eyes closed, small hearts.                                                         |
| `trost-teddy`        | A child's hands give the little bear a small teddy. He hugs it and smiles.                                                                                        |
| `trost-stomp`        | The little bear stomps with both feet to let the anger out, determined face, motion lines at his feet. He is alone.                                               |
| `trost-blow`         | The little bear breathes in deeply and blows out a big puff of air, cheeks round.                                                                                 |
| `trost-blanket`      | The little bear lies in bed; a child's hands tuck him in with a pink striped blanket. Sleepy smile.                                                               |
| `trost-lullaby`      | The little bear lies in bed, music notes float through the air, he is falling asleep with a smile.                                                                |
| `trost-hand`         | A child's hand holds the little bear's paw. The bear looks calm and smiles a little.                                                                              |
| `trost-light`        | A lamp is switched on; warm light fills the dark room. The little bear is relieved and smiles.                                                                    |
| `baer-angry-nein`    | The angry little bear throws his toys across the room: a block and a toy car fly through the air, red face, shouting.                                             |
| `baer-tired-nein-2`  | Night. A child's hands bang loudly on a toy drum next to the bear's bed. The bear sits up wide awake, covers his ears, grumpy.                                    |
| `baer-scared-nein-3` | Night, thunderstorm. A child's finger switches the bedside lamp off. The bear sits in bed, clearly visible, clutching a pillow, very scared.                      |
| `baer-sad-gut`       | The little bear in his cosy room is happy again: he laughs, jumps up with both arms raised, small hearts float around him.                                        |
| `baer-angry-gut`     | The little bear is calm again: he sits relaxed next to a rebuilt tall tower of colourful blocks and smiles contentedly.                                           |
| `baer-tired-gut`     | Night, a moon in the window. The little bear sleeps peacefully in his bed under a pink striped blanket, holding a small teddy.                                    |
| `baer-scared-gut`    | The storm is over: a rainbow outside the window, the lamp is on. Only the little bear: he sits on his bed, laughs and waves.                                      |
| `baer-happy`         | Birthday in his cosy room: balloons, a birthday cake with candles on a little table. The little bear wears a party hat and beams with joy, clapping his paws.     |
| `trost-dance`        | Birthday party, balloons. A child's hands hold the little bear's paws from the front; they dance together, the bear in a party hat jumps and laughs, music notes. |
| `trost-streamers`    | Birthday party, balloons. Colourful paper streamers fly through the air from a child's hands at the front; the little bear in a party hat laughs with arms up.    |
| `baer-happy-nein-3`  | Birthday. A child's hands take the birthday cake away from the little bear. His smile is gone: he is sad and reaches after the cake.                              |
| `baer-happy-gut`     | A happy birthday party: the little bear in a party hat laughs and raises both arms; cake with candles, balloons, streamers and confetti everywhere.               |

`trost-hug` hat nur einen Frame: von vorn war die Umarmung nie zu erkennen. Darum von der Seite – das Kind steht links
knapp außerhalb, man sieht nur Ärmel und ein Stück Pulli, kein Gesicht; beide umarmen sich ganz fest.

## Wie geht's dir? (Wetterkarten)

Nur der kleine Bär draußen auf einer Wiese, über ihm ein Wetter, das zu seinem
Gefühl passt; Sonne und Wolken ohne Gesicht. Je zwei in einem Auftrag (`--grid 1x2`),
nur ein Frame, mit `baer-sad-gut` als `--ref` für den Bären.

| Datei             | Prompt                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `wetter-sonne`    | A big bright sun shines. The little bear is happy and dances, arms up, beaming.                                    |
| `wetter-wolke`    | A big grey cloud hangs above him. The little bear is tired and droopy, yawning, eyes half closed.                  |
| `wetter-regen`    | A small rain cloud right above him, rain falls on him. The little bear is sad, shoulders down, a tear.             |
| `wetter-gewitter` | A dark thunder cloud with lightning right above him. The little bear is angry: red face, fists clenched, stomping. |

## Geplant (noch nicht erzeugt)

Diese Bilder fragt das Spiel schon an; bis sie da sind, steht an ihrer Stelle ein Platzhalter mit dem Dateinamen
(die Beschriftung darunter sagt, was er zeigen soll). Erst anschauen, dann erzeugen: jedes mit dem Raum-Prompt von
„Zu Hause“ oben und dem Bild des Gefühls (`baer-…`) als einziger `--ref`, nur ein Frame. Ist ein Bild gemacht, wandert
seine Zeile in die Tabelle „Zu Hause“ (`feelings.test.ts` prüft beides).

Runde für Runde steht die nicht so gute Idee neben der guten, die sie besser macht:

| Datei                | Runde, daneben          | Prompt                                                                                                                                                                 |
| -------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baer-sad-nein`      | 1, Umarmen              | A child's hands push the sad little bear away; he tips backwards onto the rug and cries even harder, big tears. Gentle, no injuries.                                   |
| `baer-sad-nein-2`    | 2, Streicheln           | A child's hands take the green toy dinosaur out of the toy box and break it in two right in front of the little bear; he cries even harder, reaching after it.         |
| `baer-sad-nein-3`    | 3, Teddy geben          | A child's hands sweep away the wooden toy blocks from the rug next to the sad little bear and take them out of the picture; he cries even harder, reaching after them. |
| `baer-angry-nein-2`  | 2, Tief pusten          | The angry little bear screams very loudly next to his fallen tower, mouth wide open, red face, fists clenched, small shout lines around his head.                      |
| `baer-angry-nein-3`  | 3, Umarmen              | The angry little bear hits a child's hand that comes in from the bottom edge, red face; the hand pulls back. Gentle, no injuries.                                      |
| `baer-tired-nein`    | 1, Zudecken             | Night, a moon in the window. A child's hands pull the pink striped blanket off the little bear in his bed; he curls up, cold and grumpy.                               |
| `baer-tired-nein-3`  | 3, Teddy geben          | Night, a moon in the window. A child's hands hold a bright glowing tablet in front of the little bear in his bed; he is wide awake, eyes big.                          |
| `baer-scared-nein`   | 1, Umarmen              | Night, thunderstorm. A child's hand holds up a spooky monster hand puppet in front of the little bear in bed, „boo!“; he startles, very scared.                        |
| `baer-scared-nein-2` | 2, Hand halten          | Night, thunderstorm. The little bear sits alone in his bed clutching a pillow, very scared; the door of the room is just closing, nobody there.                        |
| `baer-happy-nein`    | 1, Mittanzen            | Birthday, balloons. A child's hand pops one of the bear's balloons with a pin, a small burst; the little bear in a party hat flinches, sad.                            |
| `baer-happy-nein-2`  | 2, Luftschlangen werfen | Birthday. A child's hands take a wrapped present away from the little bear in a party hat; his smile is gone, he reaches after it.                                     |
