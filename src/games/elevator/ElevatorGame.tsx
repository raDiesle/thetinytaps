import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useDevice } from "@/lib/device";
import { useStoredSettings } from "@/lib/storage";
import { ElevatorPlay } from "./ElevatorPlay";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY, type FloorCount } from "./settings";
import "./elevator.css";

export function ElevatorGame() {
  const [settings, update] = useStoredSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Aufzug"
      emoji="🛗"
      settings={
        <>
          <SettingsGroup title="Spielart">
            <Choice<FloorCount>
              label="Haus"
              value={settings.floors}
              onChange={(floors) => update({ floors })}
              options={[
                { value: "3", label: "🏠 3 Stockwerke" },
                { value: "5", label: "🏢 5 Stockwerke" },
              ]}
            />
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen (Stockwerk, nach oben / unten, wer ein- und aussteigt)" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Drei! Die Katze steigt aus." />}
            <Toggle label="Töne (Pling, Türen, Tiere)" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Ruhiger Modus (leiser, langsamer)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
            />
            {!device.touchOnly && (
              <p className="setting-note">
                Mit der Tastatur: 1–{settings.floors} holen den Aufzug, Pfeil hoch und runter fahren einen Stock weiter.
              </p>
            )}
          </SettingsGroup>
        </>
      }
    >
      <ElevatorPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
