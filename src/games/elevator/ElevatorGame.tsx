import { useState } from "react";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { ElevatorPlay } from "./ElevatorPlay";
import { titleIn } from "./phrases";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY, type ElevatorSettings } from "./settings";
import { TRAIL_LEVELS } from "./trail/levels";
import { TrailPlay } from "./trail/TrailPlay";
import "./elevator.css";

/** "Kleine Abenteuer": the lift stories in the house and the trail levels through the world. */
export function ElevatorGame() {
  const [settings, update] = useGameSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const device = useDevice();
  const t = useT();
  const { id: language } = useAppLanguage();
  // The story titles are German in the data and come in the app language from the phrasebook (`ru.ts`).
  const title = (german: string) => titleIn(german, language);

  return (
    <GameShell
      title={t({ de: "Kleine Abenteuer", ru: "Маленькие приключения" })}
      emoji="🧭"
      modes={[
        { id: "hunger", emoji: "🥞", title: title("Pfannkuchen") },
        { id: "gutenacht", emoji: "🌙", title: title("Gute Nacht") },
        { id: "pfuetzen", emoji: "🌧️", title: title("Pfützen") },
        { id: "drachen", emoji: "🪁", title: title("Der Drachen") },
        { id: "ball", emoji: "⚽", title: title("Der Ball rollt weg") },
        { id: "ballon", emoji: "🎈", title: title("Der Luftballon") },
        { id: "lok", emoji: "🚂", title: title("Die kleine Lok") },
      ]}
      mode={settings.story}
      onMode={(story) => update({ story })}
      settings={
        device.touchOnly ? undefined : (
          <p className="setting-note">
            {t({
              de: "Jede Geschichte dauert etwa 5 Minuten. Leuchtet der große Knopf, drückt ihn die Leertaste (oder jede andere Taste). Im Haus holen 1–4 den Aufzug, Pfeil hoch und runter fahren einen Stock weiter; draußen nehmen 1–3 ein Ding aus dem offenen Rucksack, und an einer Weggabelung wählen 1 und 2 den Weg. Am Ende geht jede Taste zur nächsten Geschichte.",
              ru: "Каждая история длится около 5 минут. Когда большая кнопка светится, её нажимает пробел (или любая другая клавиша). В доме клавиши 1–4 вызывают лифт, стрелки вверх и вниз везут на этаж выше или ниже; на улице 1–3 достают вещь из открытого рюкзака, а на развилке 1 и 2 выбирают дорогу. В конце любая клавиша ведёт к следующей истории.",
            })}
          </p>
        )
      }
    >
      <Stories settings={settings} />
    </GameShell>
  );
}

/** Plays the story picked on the start screen, and after it the one „Nochmal“ or „Weiter“ starts. */
function Stories({ settings }: { settings: ElevatorSettings }) {
  const language = useAppLanguage();
  const [run, setRun] = useState({ story: settings.story, n: 0 });
  const pick = (story: string) => setRun((r) => ({ story, n: r.n + 1 }));
  const level = TRAIL_LEVELS.find((l) => l.id === run.story);
  return level ? (
    <TrailPlay key={run.n} language={language} settings={settings} level={level} onPick={pick} />
  ) : (
    <ElevatorPlay key={run.n} language={language} settings={settings} story={run.story} onPick={pick} />
  );
}
