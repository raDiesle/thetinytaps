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

/** The small tags on the cards: which levels ride the lift in the house, which walk through the world. */
const LIFT = { de: "🛗 Aufzug", ru: "🛗 Лифт" };
const TRAIL = { de: "🚶 Laufen", ru: "🚶 Пешком" };

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
        { id: "hunger", emoji: "🥞", title: title("Pfannkuchen"), kind: t(LIFT) },
        { id: "gutenacht", emoji: "🌙", title: title("Gute Nacht"), kind: t(LIFT) },
        { id: "pfuetzen", emoji: "🌧️", title: title("Pfützen"), kind: t(LIFT) },
        { id: "drachen", emoji: "🪁", title: title("Der Drachen"), kind: t(TRAIL) },
        { id: "ball", emoji: "⚽", title: title("Der Ball rollt weg"), kind: t(TRAIL) },
        { id: "ballon", emoji: "🎈", title: title("Der Luftballon"), kind: t(TRAIL) },
        { id: "lok", emoji: "🚂", title: title("Die kleine Lok"), kind: t(TRAIL) },
      ]}
      mode={settings.story}
      onMode={(story) => update({ story })}
      info={
        <>
          <p>
            {t({
              de: "Kleine Bildergeschichten von etwa 5 Minuten. Im Haus zeigt eine Denkblase, was das Kind als Nächstes braucht, und es fährt mit dem Aufzug in diesen Stock. Draußen läuft es einem Ding hinterher, das weggeflogen oder weggerollt ist, sammelt unterwegs Sachen in den Rucksack und nimmt an jedem Hindernis das, was hilft.",
              ru: "Маленькие истории в картинках, около 5 минут каждая. В доме облачко мыслей показывает, что ребёнку нужно дальше, и он едет на лифте на этот этаж. На улице он бежит за вещью, которая улетела или укатилась, по дороге собирает вещи в рюкзак и у каждого препятствия берёт то, что помогает.",
            })}
          </p>
          <p>
            {t({
              de: "Am Ende spielt „Nochmal“ dieselbe Geschichte noch einmal, „Weiter“ die nächste.",
              ru: "В конце «Ещё раз» играет ту же историю снова, «Дальше» — следующую.",
            })}
          </p>
          {!device.touchOnly && (
            <p>
              {t({
                de: "Leuchtet der große Knopf, drückt ihn die Leertaste (oder jede andere Taste). Im Haus holen 1–4 den Aufzug, Pfeil hoch und runter fahren einen Stock weiter; draußen nehmen 1–3 ein Ding aus dem offenen Rucksack, und an einer Weggabelung wählen 1 und 2 den Weg. Am Ende geht jede Taste zur nächsten Geschichte.",
                ru: "Когда большая кнопка светится, её нажимает пробел (или любая другая клавиша). В доме клавиши 1–4 вызывают лифт, стрелки вверх и вниз везут на этаж выше или ниже; на улице 1–3 достают вещь из открытого рюкзака, а на развилке 1 и 2 выбирают дорогу. В конце любая клавиша ведёт к следующей истории.",
              })}
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
