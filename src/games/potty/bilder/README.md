# Bilder für „Aufs Töpfchen“

Jeder Schritt der Geschichte ist ein Gemini-Bild (`/bild-erzeugen`), quer 16:9, 1376 × 768, WebP Qualität 65,
benannt `fox-<bild>.webp` (`fox-essen`, `fox-warten-zug`); `-b` dahinter ist der zweite Frame, der im Wechsel
überblendet (wie bei „Gefühle“). Welche Bilder es braucht, steht in `content.ts` (`STEPS[].picture`, `WAIT_SCENES`);
`potty.test.ts` meldet fehlende.

Alle Prompts erzeugt `prompts.py` (Stil, Figuren, was gleich bleibt, was passiert, die Bewegung der zweiten Frames):

```
python3 src/games/potty/bilder/prompts.py <stufe> fox > jobs.json && yarn image --jobs jobs.json
```

Die Stufen nacheinander, jede braucht die Bilder der vorigen als Referenz (`.image-raw/`):
1. `kitchen-first` – `essen`: legt Küche, Stil und Kind fest. Erst weiter, wenn es stimmt.
2. `kitchen` – `trinken`, `blase`, `bauch`, `rufen`, alle mit `essen` als einziger Referenz. In `rufen` kommen
   Mama (gelber Pulli, rote Blume am Ohr) und Papa (grüner Pulli, runde Brille) dazu, zusammen stehend.
3. `bath-first` – `bad`: das Badezimmer, mit `rufen` als Referenz für die drei Figuren.
4. `bath` – alle anderen Badbilder, mit `bad` als einziger Referenz.
5. `wait` – die Warte-Szenen (`warten-…`), mit `sitzen` als einziger Referenz: dort sitzt das Kind schon auf dem
   Töpfchen. Mit `bad` als Referenz blieb das Töpfchen leer in der Mitte stehen und das Kind saß daneben auf nichts.
6. `frames-kitchen`, `frames-bath`, `frames-wait` – die zweiten Frames, jeder mit seinem ersten als Referenz.
7. `moves` – die Bewegung vor einem Bild (`Step.moves`): `runter-1`, `runter-2` (Hose noch oben, auf den Knien) vor
   `runter`, `sitzen-1`, `sitzen-2` (steht vor dem Töpfchen, setzt sich) vor `sitzen`, jedes mit dem Endbild als
   einziger Referenz (aus `bilder/`, die Rohbilder der ersten Runde sind weg).

## Geplant

Die vier Bilder von `moves` (Stufe 7): beim ersten Versuch am 27.10.2026 war das Gemini-Guthaben aufgebraucht.
Sind sie da, kommen sie als `moves: ["runter-1", "runter-2"]` an den Schritt `down` und `moves: ["sitzen-1", "sitzen-2"]`
an `sit` in `content.ts`.

Nur Tapsi geht aufs Töpfchen – jedes weitere Tier bräuchte alle rund 50 Bilder noch einmal. Ein anderes Tier nur,
wenn es ausdrücklich gewünscht ist.

Danach `yarn frames src/games/potty/bilder` (springt ein Frame?) und `yarn frames --scenes`-artig nebeneinander
anschauen: gleiches Bad, gleiche Eltern, niemand doppelt, das Töpfchen bleibt türkis in der Mitte.

Worauf achten: Hose runter zeigt nur Fell, das T-Shirt deckt den Bauch. Kaka im Töpfchen ist ein kleiner brauner
Kringel ohne Gesicht. Was zählt, steht in der Mitte – am Rand nur Wand und Boden, weil Handys oben und unten,
Tablets links und rechts abschneiden.
