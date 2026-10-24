import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useDevice } from "@/lib/device";
import { useStoredSettings } from "@/lib/storage";
import { ElevatorPlay } from "./ElevatorPlay";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY } from "./settings";
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
          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen (was das Kind denkt und tut)" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Mein Bauch knurrt! Ich habe Hunger." />}
            <Toggle label="Töne (Pling, Türen, Brutzeln, Platschen …)" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Ruhiger Modus (leiser, langsamer)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
            />
            {!device.touchOnly && (
              <p className="setting-note">
                Mit der Tastatur: 1–3 wählen eine Geschichte, 1–4 holen den Aufzug, Pfeil hoch und runter fahren einen Stock weiter.
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
