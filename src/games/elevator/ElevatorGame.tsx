import { GameShell } from "@/components/GameShell";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { ElevatorPlay } from "./ElevatorPlay";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY, type FloorCount } from "./settings";
import "./elevator.css";

export function ElevatorGame() {
  const [settings, update] = useGameSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Aufzug"
      emoji="🛗"
      modes={[
        { id: "3", emoji: "🏠", title: "3 Stockwerke", text: "Drei große Knöpfe – für den Anfang." },
        { id: "5", emoji: "🏢", title: "5 Stockwerke", text: "Ein hohes Haus mit fünf Knöpfen." },
      ]}
      mode={settings.floors}
      onMode={(floors) => update({ floors: floors as FloorCount })}
      settings={
        device.touchOnly ? undefined : (
          <p className="setting-note">
            Mit der Tastatur: 1–{settings.floors} holen den Aufzug, Pfeil hoch und runter fahren einen Stock weiter.
          </p>
        )
      }
    >
      <ElevatorPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
