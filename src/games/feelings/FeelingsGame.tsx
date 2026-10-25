import { GameShell, type GameMode } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { FeelingsPlay } from "./FeelingsPlay";
import { MOOD_ID } from "./mood";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import { STORIES } from "./stories";
import "./feelings.css";

/** "All in turn" comes first and across the whole row. */
const ALL: GameMode = { id: "all", emoji: "🌈", title: "Alle", featured: true };

/** Asks for the child's weather first, then the bear's story with that feeling. */
const MOOD: GameMode = { id: MOOD_ID, emoji: "🌦️", title: "Wie geht's dir?" };

const MODES = [ALL, MOOD, ...STORIES.map(({ id, emoji, title }) => ({ id, emoji, title }))];

/** The start screen: all stories in turn, or just one – the bear's feelings at home and the kindergarten stories side by side. */
export function FeelingsGame() {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);

  return (
    <GameShell
      title="Gefühle"
      emoji="🐻"
      modes={MODES}
      mode={settings.story}
      onMode={(story) => update({ story })}
      info={
        <>
          <p>
            Zu Hause ist der kleine Bär traurig, wütend, müde oder hat Angst. Drei Karten zeigen, was ihm hilft – umarmen, Hand halten, stampfen, Licht an …
            Sind alle drei getan, ist er wieder froh. Und an seinem Geburtstag freut er sich, und das Kind feiert mit: tanzen, Luftschlangen, umarmen.
          </p>
          <p>
            „Wie geht's dir?“ zeigt zuerst vier Wetterbilder: Sonne, Wolke, Regen, Gewitter. Das Kind tippt, was zu ihm passt – so erfahren Erwachsene nebenbei,
            wie es ihm geht. Der Bär sagt „Das kenne ich auch!“, und dann kommt seine Geschichte mit diesem Gefühl.
          </p>
          <p>
            Im Kindergarten: Jemand schubst, tritt oder nimmt etwas weg, die Rutsche ist voll, ein anderes Kind hat das tolle Spielzeug – oder der kleine Bär
            ist selbst wütend. Dazu Abschied an der Tür, jemand Neues in der Gruppe, hingefallen, und jemand hört nicht auf, obwohl der Bär nicht mehr will. Bei
            jedem Schritt tippt das Kind, was der Bär tun kann: laut „Stopp! Nein!“ sagen, weggehen, Hilfe holen, fragen, warten, tauschen.
          </p>
          <p>
            Links liegt immer eine nicht so gute Idee (z.&nbsp;B. zurückschubsen, Licht aus), daneben die guten, die beste zuerst. Tippt das Kind auf die nicht
            so gute, erscheint sie groß mit rotem Kreuz und es wird erklärt, warum. Die guten Ideen bekommen einen grünen Haken.
          </p>
          <p>Unter jedem Bild steht klein, was es zeigt – zum Mitlesen und Erzählen für Erwachsene. Kinder wählen nur nach dem Bild.</p>
          {!settings.speech && <p>Mit Vorlesen (auf der Startseite) wird die Geschichte erzählt, sonst erzählen Erwachsene sie anhand der Bilder.</p>}
        </>
      }
    >
      <FeelingsPlay settings={settings} />
    </GameShell>
  );
}
