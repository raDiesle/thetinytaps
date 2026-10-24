# Bilder für „Gefühle“

Das Spiel besteht nur aus diesen Bildern, ohne gezeichnete Figuren und ohne Text:
ein großes Bild in der Mitte zeigt, was gerade passiert, darunter stehen die
Auswahl-Karten. Fehlt ein Bild, bleibt die Stelle leer.

- **Dateiname** genau wie in den Listen unten, z. B. `push-1.webp`
- **Format:** WebP, 1200 × 900 Pixel (4:3, quer), Qualität 65 – so bleibt jedes Bild unter ~60 KB.
- **Bewegung:** Ein zweites Bild mit `-b` dahinter (`push-1-b.webp`) ist der zweite
  Frame. Er zeigt dieselbe Szene mit einer kleinen Bewegung; in der Mitte blenden
  die Frames im Wechsel ineinander über, wie ein kleines GIF. Die Karten zeigen nur
  den ersten Frame.

Mit Gemini direkt aus dem Projekt (Key in `GEMINI_API_KEY`, Modell Nano Banana 2 Lite – das günstigste, 1K reicht):

```
yarn image src/games/feelings/bilder/push-1.webp "<Stilblock> <Figuren> <Prompt>" --aspect 4:3 --size 1200x900 --quality 65 --ref src/games/feelings/bilder/push-2.webp
```

Zweiter Frame: das erste Bild als Referenz mitgeben und nur die Bewegung beschreiben:

```
yarn image src/games/feelings/bilder/push-1-b.webp "Redraw this exact picture as the second frame of a tiny two-frame animation. Keep EVERYTHING identical: same characters, clothes, colours, background, camera framing, composition, line style and sizes. Change only this small movement: <Bewegung>. No text, no letters." --ref src/games/feelings/bilder/push-1.webp --aspect 4:3 --size 1200x900 --quality 65
```

## So bleiben die Figuren gleich

Bildgeneratoren erfinden die Figuren sonst jedes Mal neu. Darum:

1. **Zuerst den Figurenbogen erzeugen** (Prompt unten). Nimm das beste Ergebnis.
2. **Den Figurenbogen bei jedem weiteren Bild mitgeben:**
   - ChatGPT: im selben Chat bleiben oder den Bogen jedes Mal anhängen
     („Use the attached character sheet“)
   - Midjourney: `--cref <URL des Bogens> --sref <URL des Bogens> --ar 4:3`
   - Firefly / andere: den Bogen als Stil- und Struktur-Referenz verwenden
3. **Jedem Prompt den Stilblock voranstellen.**

Prüfe jedes Bild mit der Frage: *Versteht ein Kind, das nicht lesen kann, was der
Bär da tut, und ob es gut oder schlecht ausgeht?* Gesichter müssen das Gefühl deutlich
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
```

### Figurenbogen (als Erstes)

```
Character sheet: the little bear, the fox, the bunny and the teacher standing
side by side, front view, neutral friendly faces, plain white background.
```

## Im Kindergarten

Pro Geschichte: `…-passiert` (was passiert ist), `…-1` bis `…-3` (die guten
Schritte in dieser Reihenfolge), `…-nein` (die nicht so gute Idee) und `…-ende`
(alle fröhlich, das Bild am Schluss) – jeweils mit zweitem Frame `…-b`.

### Geschubst (`push`) – draußen auf dem Spielplatz, Wiese, ein Baum

| Datei | Prompt |
| --- | --- |
| `push-passiert` | The fox pushes the little bear with both paws. The bear stumbles backwards, sad face with tears. The fox looks angry. |
| `push-1` | „Stopp! Nein!“ – The little bear stands firm and holds one paw up high towards the fox, palm out, a clear stop gesture. Serious, brave face, mouth open as if shouting "Stop!". The fox freezes, surprised. |
| `push-2` | „Weggehen“ – The little bear walks away from the fox with calm steps, footprints in the grass behind him. Big distance between them; the fox stays small in the background. |
| `push-3` | „Hilfe holen“ – The little bear has run to the teacher and points back at the fox. The teacher bends down and listens kindly. |
| `push-nein` | „Zurückschubsen“ – The little bear pushes the fox back with both paws, angry face. The fox stumbles and cries. Nobody is happy. |

### Getreten (`kick`) – draußen auf dem Spielplatz

| Datei | Prompt |
| --- | --- |
| `kick-passiert` | The fox kicks the little bear against the leg. The bear holds his leg and cries. |
| `kick-1` | „Stopp!“ – The little bear holds one paw up high towards the fox, palm out, a clear stop gesture, brave face, shouting. The fox stops, one foot still lifted, surprised. |
| `kick-2` | „Weggehen“ – The little bear walks away to the other side, footprints behind him, a big distance to the fox, calm face. |
| `kick-3` | „Hilfe holen“ – The little bear waves and calls the teacher; the teacher comes over and talks to the fox, who looks down, sorry. |
| `kick-nein` | „Zurücktreten“ – The little bear kicks back at the fox, angry face. The fox cries. Both are unhappy. |

### Weggenommen (`grab`) – im Sandkasten, ein roter Spielzeug-Traktor

| Datei | Prompt |
| --- | --- |
| `grab-passiert` | In the sandbox the fox snatches the red toy tractor out of the little bear's paws. The bear reaches after it, sad. |
| `grab-1` | „Das ist meins!“ – The little bear stands firm, one paw up in a stop gesture, the other pointing at the tractor the fox is holding. Brave, serious face. The fox is surprised. |
| `grab-2` | „Zurück, bitte“ – The little bear holds out both open paws with a friendly asking face. The fox gives the tractor back, looking sorry. |
| `grab-3` | „Mitspielen?“ – The little bear and the fox sit together in the sandbox and play: the bear with the tractor, the fox with a bucket and spade. Both laugh. |
| `grab-nein` | „Wegreißen“ – The little bear and the fox both pull hard at the tractor, a tug of war, both angry and shouting. |

### Rutsche voll (`slide`) – Spielplatz mit Rutsche und Leiter

| Datei | Prompt |
| --- | --- |
| `slide-passiert` | The slide is full: the bunny sits at the top, the fox climbs the ladder. The little bear runs up and wants to slide right now, impatient and sad. |
| `slide-1` | „Anstellen“ – The little bear stands in line at the bottom of the ladder, behind the fox, calm and patient. |
| `slide-2` | „Warten“ – The bunny slides down happily. The little bear waits at the ladder, patient, watching with a calm smile. |
| `slide-3` | „Jetzt ich!“ – The little bear slides down the slide, laughing, arms up high. The bunny and the fox cheer at the bottom. |
| `slide-nein` | „Vordrängeln“ – The little bear pushes past the fox on the ladder. The fox almost falls off the ladder, scared. Clearly dangerous. |

### Haben wollen (`want`) – draußen, ein glänzendes rotes Spielzeugauto

| Datei | Prompt |
| --- | --- |
| `want-passiert` | The bunny plays happily with a shiny red toy car. The little bear watches and reaches out, longing to have it. |
| `want-1` | „Fragen“ – The little bear asks the bunny politely, paws together, friendly face, leaning forward a bit. The bunny listens, still holding the car. |
| `want-2` | „Warten“ – Meanwhile the little bear plays with a ball and is content. The bunny still plays with the car. |
| `want-3` | „Tauschen“ – The bunny gives the car to the little bear and gets the ball. Both are happy. |
| `want-nein` | „Wegnehmen“ – The little bear grabs the car out of the bunny's paws. The bunny cries. |

### Selbst wütend (`angry`) – drinnen im Spielzimmer, bunte Bauklötze

| Datei | Prompt |
| --- | --- |
| `angry-passiert` | The fox has knocked over the little bear's tall tower of colourful blocks by accident; blocks are flying. The bear is furious: red face, fists clenched. The fox is startled. |
| `angry-1` | „Stampfen“ – The little bear stomps hard on the floor with both feet, angry face, motion lines at his feet. Nobody else is touched. |
| `angry-2` | „Tief pusten“ – The little bear breathes in deeply and blows out slowly, cheeks round, eyes closed, a visible puff of air. He is getting calmer. |
| `angry-3` | „Sagen“ – The little bear tells the fox how he feels, one paw on his chest. The fox looks sorry and starts to rebuild the tower with him. |
| `angry-nein` | „Schubsen“ – The angry little bear pushes the fox. The fox falls on the floor and cries. |

### Das gute Ende (`…-ende`)

| Datei | Prompt |
| --- | --- |
| `push-ende` | Playground. The little bear jumps for joy with both arms up; the fox smiles and waves, friends again; the teacher smiles proudly. |
| `kick-ende` | Playground. The little bear jumps for joy; the fox smiles shyly and offers a high five; the teacher smiles proudly. |
| `grab-ende` | Sandbox. The little bear proudly holds up the red toy tractor and laughs; the fox claps and laughs too. |
| `slide-ende` | At the bottom of the slide the little bear, the fox and the bunny cheer together with paws up high. |
| `want-ende` | The little bear drives the red toy car, the bunny holds the ball up high; both laugh and play together. |
| `angry-ende` | Playroom. The tower of blocks stands again; the little bear and the fox stand next to it, laughing proudly. |

## Bär trösten

Nur der kleine Bär, in einem gemütlichen Kinderzimmer. Wer tröstet, ist das Kind
vor dem Bildschirm: zeige nur **Kinderhände oder -arme**, die von vorn ins Bild
kommen, nie ein ganzes Kind.

`baer-…` zeigt in der Mitte, wie es dem Bären am Anfang geht, `trost-…` sind die
Karten (und danach das Bild in der Mitte), `baer-…-gut` zeigt ihn am Ende wieder froh.
Alle mit zweitem Frame `…-b`.

| Datei | Prompt |
| --- | --- |
| `baer-sad` | The little bear sits on the floor and cries, big tears, shoulders down. |
| `baer-angry` | The little bear is angry: his block tower has fallen over next to him, red face, fists clenched. |
| `baer-tired` | Night, a moon in the window. The little bear yawns widely and rubs his eyes. |
| `baer-scared` | Night, a thunderstorm with lightning outside the window. The little bear hides behind a pillow, big scared eyes. |
| `trost-stroke` | A child's hand gently strokes the little bear's head. The bear smiles with closed eyes; small hearts. |
| `trost-hug` | A child's arms hug the little bear tight (seen from the viewer's side). The bear smiles happily. |
| `trost-teddy` | A child's hands give the little bear a small teddy. He hugs it and smiles. |
| `trost-stomp` | The little bear stomps with both feet to let the anger out, determined face, motion lines at his feet. He is alone. |
| `trost-blow` | The little bear breathes in deeply and blows out a big puff of air, cheeks round. |
| `trost-blanket` | The little bear lies in bed; a child's hands tuck him in with a pink striped blanket. Sleepy smile. |
| `trost-lullaby` | The little bear lies in bed, music notes float through the air, he is falling asleep with a smile. |
| `trost-hand` | A child's hand holds the little bear's paw. The bear looks calm and smiles a little. |
| `trost-light` | A lamp is switched on; warm light fills the dark room. The little bear is relieved and smiles. |
| `baer-sad-gut` | The little bear in his cosy room is happy again: he laughs, jumps up with both arms raised, small hearts float around him. |
| `baer-angry-gut` | The little bear is calm again: he sits relaxed next to a rebuilt tall tower of colourful blocks and smiles contentedly. |
| `baer-tired-gut` | Night, a moon in the window. The little bear sleeps peacefully in his bed under a pink striped blanket, holding a small teddy. |
| `baer-scared-gut` | The storm is over: a rainbow outside the window, the lamp is on. Only the little bear: he sits on his bed, laughs and waves. |
