import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { ElevatorPlay } from "./ElevatorPlay";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY, type ElevatorSettings } from "./settings";
import { TRAIL_LEVELS } from "./trail/levels";
import { TrailPlay } from "./trail/TrailPlay";
import "./elevator.css";

/** The small tags on the cards: which levels ride the lift in the house, which walk through the world. */
const LIFT = "🛗 Aufzug";
const TRAIL = "🚶 Laufen";

/** "Kleine Abenteuer": the lift stories in the house and the trail levels through the world. */
export function ElevatorGame() {
  const [settings, update] = useGameSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Kleine Abenteuer"
      emoji="🧭"
      modes={[
        { id: "hunger", emoji: "🥞", title: "Pfannkuchen", kind: LIFT },
        { id: "gutenacht", emoji: "🌙", title: "Gute Nacht", kind: LIFT },
        { id: "pfuetzen", emoji: "🌧️", title: "Pfützen", kind: LIFT },
        { id: "drachen", emoji: "🪁", title: "Der Drachen", kind: TRAIL },
        { id: "ball", emoji: "⚽", title: "Der Ball rollt weg", kind: TRAIL },
        { id: "ballon", emoji: "🎈", title: "Der Luftballon", kind: TRAIL },
        { id: "lok", emoji: "🚂", title: "Die kleine Lok", kind: TRAIL },
      ]}
      mode={settings.story}
      onMode={(story) => update({ story })}
      info={
        <>
          <p>
            Kleine Bildergeschichten von etwa 5 Minuten. Im Haus zeigt eine Denkblase, was das Kind als Nächstes braucht, und es fährt mit dem Aufzug in diesen
            Stock. Draußen läuft es einem Ding hinterher, das weggeflogen oder weggerollt ist, sammelt unterwegs Sachen in den Rucksack und nimmt an jedem
            Hindernis das, was hilft.
          </p>
          <p>Am Ende spielt „Nochmal“ dieselbe Geschichte noch einmal, „Weiter“ die nächste.</p>
          {!device.touchOnly && (
            <p>
              Leuchtet der große Knopf, drückt ihn die Leertaste (oder jede andere Taste). Im Haus holen 1–4 den Aufzug, Pfeil hoch und runter fahren einen
              Stock weiter; draußen nehmen 1–3 ein Ding aus dem offenen Rucksack, und an einer Weggabelung wählen 1 und 2 den Weg. Am Ende geht jede Taste zur
              nächsten Geschichte.
            </p>
          )}
        </>
      }
    >
      <Stories settings={settings} />
    </GameShell>
  );
}

/** Plays the story picked on the start screen, and after it the one „Nochmal“ or „Weiter“ starts. */
function Stories({ settings }: { settings: ElevatorSettings }) {
  const [run, setRun] = useState({ story: settings.story, n: 0 });
  const pick = (story: string) => setRun((r) => ({ story, n: r.n + 1 }));
  const level = TRAIL_LEVELS.find((l) => l.id === run.story);
  return level ? (
    <TrailPlay key={run.n} lang={de.speechLang} settings={settings} level={level} onPick={pick} />
  ) : (
    <ElevatorPlay key={run.n} lang={de.speechLang} settings={settings} story={run.story} onPick={pick} />
  );
}
