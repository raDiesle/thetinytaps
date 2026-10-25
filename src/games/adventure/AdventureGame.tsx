import { GameShell } from "@/components/GameShell";
import { de } from "@/content/de";
import { useCommonSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { AdventurePlay } from "./AdventurePlay";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

/** The start screen: no options of its own, read aloud, sounds and music come from the home page. */
export function AdventureGame() {
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();
  const story = TREASURE_ISLAND;

  return (
    <GameShell
      title="Bewegungsabenteuer"
      emoji="🏝️"
      modes={[{ id: "normal", emoji: "🏝️", title: "Die Schatzinsel" }]}
      info={
        <>
          <p>
            Der kleine Fuchs Tapsi fährt auf der großen Meeresschildkröte Ole zur Schatzinsel. Er zeigt jede Bewegung vor, und das Kind macht sie vor dem
            Bildschirm mit: winken, angeln, paddeln, springen und mit dem Kopf an Sternkisten stoßen, trommeln, kurbeln, Kokosnüssen ausweichen, Spinnweben
            wegwedeln, die Schatztruhe am Seil heranziehen und am Ende Gold in die Luft werfen. Die Welt reagiert von selbst – es gibt keine Kamera und kein
            „falsch“.
          </p>
          <p>
            Am Fuchs leuchtet, worauf es bei der Bewegung ankommt (z.&nbsp;B. nur die Arme an der Kurbel), und eine dunkle Figur mit leuchtendem Rand macht jede
            Bewegung groß mit.
          </p>
          <p>Am besten auf einem großen Bildschirm, mit etwas Platz um das Kind herum (Arme ausbreiten, ein Schritt zur Seite). Niemand muss tippen.</p>
          <p>Vorlesen, Töne und Musik stellt ⚙️ auf der Startseite für alle Spiele ein.</p>
          {!touchOnly && (
            <p>
              Oben links: pausieren und zur vorigen oder nächsten Bewegung springen; ein Bild unten springt zu dieser Bewegung. Mit Tastatur: <kbd>←</kbd>{" "}
              <kbd>→</kbd> und die <kbd>Leertaste</kbd>.
            </p>
          )}
        </>
      }
    >
      <AdventurePlay story={story} speechLang={de.speechLang} settings={common} />
    </GameShell>
  );
}
