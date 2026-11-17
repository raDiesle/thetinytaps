# Im Kindergarten

> Ausgelagert aus [`bilder/README.md`](../README.md): Stilblock, Figuren und die Regeln für jedes Bild stehen dort. „Oben“ meint hier auch die Abschnitte dort und die Dateien, die das Verzeichnis dort vor dieser nennt.

Pro Geschichte: `…-passiert` (was passiert ist), `…-1` bis `…-3` (die guten
Schritte in dieser Reihenfolge), `…-nein` (die nicht so gute Idee neben Schritt 1) und `…-ende`
(alle fröhlich, das Bild am Schluss) – jeweils mit zweitem Frame `…-b`. Neben Schritt 2 und 3
stehen `…-nein-2` und `…-nein-3` (nur ein Frame; wie alle Bilder der Geschichte mit `…-passiert` als `--ref`, siehe „So bleibt die Szene gleich“).

Erwachsene (Erzieherin, großer Bär) sind erst im Bild, wenn ein Schritt sie holt oder ruft: kommt „Hilfe
holen“ erst noch, zeigen `…-passiert` und die Bilder davor nur die Kinder – sonst fragt man sich, warum
der Bär Hilfe holen soll, wenn sie schon danebensteht. Eine nicht so gute Idee zeigt dieselben Kinder wie die Szene davor.

## Nicht so gute Ideen bei Schritt 2 und 3

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

## Geschubst (`push`) – draußen auf dem Spielplatz, Wiese, ein Baum

| Datei           | Prompt                                                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `push-passiert` | The fox pushes the little bear with both paws. The bear stumbles backwards, sad face with tears. The fox looks angry.                                                                                       |
| `push-1`        | „Stopp! Nein!“ – The little bear stands firm and holds one paw up high towards the fox, palm out, a clear stop gesture. Serious, brave face, mouth open as if shouting "Stop!". The fox freezes, surprised. |
| `push-2`        | „Weggehen“ – The little bear walks away from the fox with calm steps, footprints in the grass behind him. Big distance between them; the fox stays small in the background.                                 |
| `push-3`        | „Hilfe holen“ – The little bear has run to the teacher and points back at the fox. The teacher bends down and listens kindly.                                                                               |
| `push-nein`     | „Zurückschubsen“ – The little bear pushes the fox back with both paws, angry face. The fox stumbles and cries. Nobody is happy.                                                                             |

## Getreten (`kick`) – draußen auf dem Spielplatz

| Datei           | Prompt                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `kick-passiert` | The fox kicks the little bear against the leg. The bear holds his leg and cries.                                                                                         |
| `kick-1`        | „Stopp!“ – The little bear holds one paw up high towards the fox, palm out, a clear stop gesture, brave face, shouting. The fox stops, one foot still lifted, surprised. |
| `kick-2`        | „Weggehen“ – The little bear walks away to the other side, footprints behind him, a big distance to the fox, calm face.                                                  |
| `kick-3`        | „Hilfe holen“ – The little bear waves and calls the teacher; the teacher comes over and talks to the fox, who looks down, sorry.                                         |
| `kick-nein`     | „Zurücktreten“ – The little bear kicks back at the fox, angry face. The fox cries. Both are unhappy.                                                                     |

## Weggenommen (`grab`) – im Sandkasten, ein roter Spielzeug-Traktor

| Datei           | Prompt                                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `grab-passiert` | In the sandbox the fox snatches the red toy tractor out of the little bear's paws. The bear reaches after it, sad.                                                             |
| `grab-1`        | „Das ist meins!“ – The little bear stands firm, one paw up in a stop gesture, the other pointing at the tractor the fox is holding. Brave, serious face. The fox is surprised. |
| `grab-2`        | „Zurück, bitte“ – The little bear holds out both open paws with a friendly asking face. The fox gives the tractor back, looking sorry.                                         |
| `grab-3`        | „Mitspielen?“ – The little bear and the fox sit together in the sandbox and play: the bear with the tractor, the fox with a bucket and spade. Both laugh.                      |
| `grab-nein`     | „Wegreißen“ – The little bear and the fox both pull hard at the tractor, a tug of war, both angry and shouting.                                                                |

## Rutsche voll (`slide`) – Spielplatz mit Rutsche und Leiter

| Datei            | Prompt                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slide-passiert` | The slide is full: the bunny sits at the top, the fox climbs the ladder. The little bear runs up and wants to slide right now, impatient and sad. |
| `slide-1`        | „Anstellen“ – The little bear stands in line at the bottom of the ladder, behind the fox, calm and patient.                                       |
| `slide-2`        | „Warten“ – The bunny slides down happily. The little bear waits at the ladder, patient, watching with a calm smile.                               |
| `slide-3`        | „Jetzt ich!“ – The little bear slides down the slide, laughing, arms up high. The bunny and the fox cheer at the bottom.                          |
| `slide-nein`     | „Vordrängeln“ – The little bear pushes past the fox on the ladder. The fox almost falls off the ladder, scared. Clearly dangerous.                |

## Haben wollen (`want`) – draußen, ein glänzendes rotes Spielzeugauto

| Datei           | Prompt                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `want-passiert` | The bunny plays happily with a shiny red toy car. The little bear watches and reaches out, longing to have it.                                     |
| `want-1`        | „Fragen“ – The little bear asks the bunny politely, paws together, friendly face, leaning forward a bit. The bunny listens, still holding the car. |
| `want-2`        | „Warten“ – Meanwhile the little bear plays with a ball and is content. The bunny still plays with the car.                                         |
| `want-3`        | „Tauschen“ – The bunny gives the car to the little bear and gets the ball. Both are happy.                                                         |
| `want-nein`     | „Wegnehmen“ – The little bear grabs the car out of the bunny's paws. The bunny cries.                                                              |

## Selbst wütend (`angry`) – drinnen im Spielzimmer, bunte Bauklötze

| Datei            | Prompt                                                                                                                                                                                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angry-passiert` | The fox has knocked over the little bear's tall tower of colourful blocks by accident; blocks are flying. The bear is furious: red face, fists clenched. The fox is startled.                                                                                           |
| `angry-1`        | „Stampfen“ – The little bear himself stomps, a little away from the others and the blocks, seen whole: he lands with BOTH feet flat on the floor at once, knees bent, impact lines and dust puffs under both feet; angry but determined. He touches nobody and nothing. |
| `angry-2`        | „Tief pusten“ – The little bear breathes out slowly and it makes him feel better: head tilted up, eyes softly closed, a relieved happy smile, no red face; a soft cloud of breath rises straight up into empty air, away from everybody and the blocks.                 |
| `angry-3`        | „Sagen“ – The little bear tells the fox how he feels, one paw on his chest. The fox looks sorry and starts to rebuild the tower with him.                                                                                                                               |
| `angry-nein`     | „Schubsen“ – The angry little bear pushes the fox. The fox falls on the floor and cries.                                                                                                                                                                                |

In den vier Geschichten unten haben diese Bilder nur einen Frame, weil im zweiten die Szene
sprang statt sich nur ein wenig zu bewegen: `bye-passiert`, `bye-3`, `bye-nein`,
`new-passiert`, `new-nein`, `new-ende`, `fall-3`, `fall-ende`, `stop-1`, `stop-nein`.
Die übrigen zweiten Frames dieser Geschichten waren als `--grid 1x2` entstanden und sprangen auch; sie sind
neu mit dem ersten Frame als Referenz gezeichnet (siehe oben, `bun run frames`).

## Abschied an der Tür (`bye`) – Eingang mit Garderobe, Tür und Fenster

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

## Neu im Kindergarten (`new`) – Spielzimmer, bunte Bauklötze

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

## Hingefallen (`fall`) – Spielplatz, Wiese, ein Baum

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

## Hört nicht auf (`stop`) – Spielplatz, Wiese, ein Baum

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

## Das gute Ende (`…-ende`)

| Datei        | Prompt                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `push-ende`  | Playground. The little bear jumps for joy with both arms up; the fox smiles and waves, friends again; the teacher smiles proudly. |
| `kick-ende`  | Playground. The little bear jumps for joy; the fox smiles shyly and offers a high five; the teacher smiles proudly.               |
| `grab-ende`  | Sandbox. The little bear proudly holds up the red toy tractor and laughs; the fox claps and laughs too.                           |
| `slide-ende` | At the bottom of the slide the little bear, the fox and the bunny cheer together with paws up high.                               |
| `want-ende`  | The little bear drives the red toy car, the bunny holds the ball up high; both laugh and play together.                           |
| `angry-ende` | Playroom. The tower of blocks stands again; the little bear and the fox stand next to it, laughing proudly.                       |
