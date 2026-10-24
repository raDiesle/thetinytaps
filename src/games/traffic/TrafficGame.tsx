import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { TrafficPlay } from "./TrafficPlay";
import { DEFAULT_TRAFFIC_SETTINGS, TRAFFIC_SETTINGS_KEY } from "./settings";
import "./traffic.css";

export function TrafficGame() {
  const [settings, update] = useGameSettings(TRAFFIC_SETTINGS_KEY, DEFAULT_TRAFFIC_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Ampel und Zebrastreifen"
      emoji="🚦"
      settings={
        <SettingsGroup title="Spiel">
          <p className="setting-note">
            Jedes Antippen drückt den Knopf an der Ampel. Grün: Die Tiere gehen über den Zebrastreifen, die Autos warten. Rot: Die Tiere bleiben stehen, die
            Autos fahren. Tiere und Autos antippen geht auch.
          </p>
          <Toggle label="Die Ente vergisst manchmal zu gucken und wird zurückgerufen" checked={settings.duck} onChange={(duck) => update({ duck })} />
          {!device.touchOnly && <p className="setting-note">Mit der Tastatur: Jede Taste drückt den Knopf an der Ampel.</p>}
        </SettingsGroup>
      }
    >
      <TrafficPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
