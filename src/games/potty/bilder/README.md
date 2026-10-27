# Bilder für „Aufs Töpfchen“

Jeder Schritt der Geschichte ist ein Gemini-Bild (`/bild-erzeugen`), quer 16:9, 1376 × 768, WebP Qualität 65,
benannt `fox-<bild>.webp` (`fox-essen`, `fox-warten-zug`); `-b` dahinter ist der zweite Frame, der im Wechsel
überblendet (wie bei „Gefühle“). Welche Bilder es braucht, steht in `content.ts` (`STEPS[].picture`, `WAIT_SCENES`);
`potty.test.ts` meldet fehlende.

Alle Prompts erzeugt `prompts.py` (Stil, Figuren, was gleich bleibt, was passiert, die Bewegung der zweiten Frames):

```
python3 src/games/potty/bilder/prompts.py <stufe> fox > jobs.json && bun run image --jobs jobs.json
```

Die Stufen nacheinander, jede braucht die Bilder der vorigen als Referenz (`.image-raw/`):
1. `kitchen-first` – `essen`: legt Küche, Stil und Kind fest. Erst weiter, wenn es stimmt.
2. `kitchen` – `trinken`, `blase`, `bauch`, `rufen`, alle mit `essen` als einziger Referenz. In `rufen` kommen
   Mama (gelber Pulli, rote Blume am Ohr) und Papa (grüner Pulli, runde Brille) dazu, zusammen stehend.
3. `bath-first` – `bad`: das Badezimmer, mit `rufen` als Referenz für die drei Figuren.
4. `bath` – alle anderen Badbilder, mit `bad` als einziger Referenz.
5. `wait` – die Warte-Szenen (`warten-…`), mit `sitzen` als einziger Referenz: dort sitzt das Kind schon auf dem
   Töpfchen. Mit `bad` als Referenz blieb das Töpfchen leer in der Mitte stehen und das Kind saß daneben auf nichts.
   **Werden nicht mehr gezeigt:** jedes Bild war ein wenig anders gezeichnet, der Wechsel alle paar Sekunden ließ das
   Bad springen. Beim Warten bleibt `sitzen` stehen; was Tapsi denkt, kommt in eine Denkblase (`denken-…`, noch nicht
   gemacht, bis dahin ein Emoji), gezeichnet ohne Badezimmer.
6. `frames-kitchen`, `frames-bath`, `frames-wait` – die zweiten Frames, jeder mit seinem ersten als Referenz.
7. `play-first` – `spielen`: das Kinderzimmer (wenn nichts kam), ein neuer Raum wie das Bad, mit `rufen` als Referenz
   für die drei; die Tür steht nah der Mitte, Mama und Papa schauen dort herein. Danach `frames-play` für `spielen-b`:
   die erste Bewegung („noch ein Klotz auf den Turm“) kam fast gleich zurück, erst „Tapsi dreht den Kopf zur Tür,
   Mama winkt“ bewegte sich sichtbar – die Bewegung eines zweiten Frames muss groß genug sein, um sie zu sehen.
8. `moves` – die Bewegung vor einem Bild (`Step.moves`): `runter-1`, `runter-2` (Hose noch oben, an den Knien) vor
   `runter`, `sitzen-1` (steht vor dem Töpfchen) vor `sitzen`, jedes mit dem Endbild als einziger Referenz (aus
   `bilder/`, die Rohbilder der ersten Runde sind weg). Der Prompt muss sagen, was noch NICHT so ist, sonst zeichnet
   das Modell die Endpose. Ein Bild „halb hingesetzt“ gelang in drei Versuchen nicht (es saß immer schon) und fehlt.

Nur Tapsi geht aufs Töpfchen – jedes weitere Tier bräuchte alle rund 50 Bilder noch einmal. Ein anderes Tier nur,
wenn es ausdrücklich gewünscht ist.

Danach `bun run frames src/games/potty/bilder` (springt ein Frame?) und `bun run frames --scenes`-artig nebeneinander
anschauen: gleiches Bad, gleiche Eltern, niemand doppelt, das Töpfchen bleibt türkis in der Mitte.

Worauf achten: Hose runter zeigt nur Fell, das T-Shirt deckt den Bauch. Kaka im Töpfchen ist ein kleiner brauner
Kringel ohne Gesicht. Was zählt, steht in der Mitte – am Rand nur Wand und Boden, weil Handys oben und unten,
Tablets links und rechts abschneiden.
