import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { DEFAULT_TEETH_SETTINGS, TEETH_SETTINGS_KEY, type BrushMinutes } from "./settings";
import { TeethPlay } from "./TeethPlay";

export function TeethGame() {
  const [settings, update] = useStoredSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);

  return (
    <GameShell
      title="Zähne putzen"
      emoji="🦷"
      settings={
        <>
          <SettingsGroup title="Putzzeit">
            <Choice<BrushMinutes>
              label="Dauer"
              value={settings.minutes}
              onChange={(minutes) => update({ minutes })}
              options={[
                { value: "1", label: "1 Minute" },
                { value: "2", label: "2 Minuten" },
                { value: "3", label: "3 Minuten" },
              ]}
            />
            <p className="setting-note">
              Gerät hinstellen und los: Niemand muss tippen. Jede Viertelzeit ist eine andere Ecke dran, dort verschwinden die
              Zuckermonster nach und nach. Der Bildschirm bleibt dabei an.
            </p>
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Ansagen vorlesen („Jetzt oben!“)" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Jetzt oben!" />}
            <Toggle label="Musik und Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle label="Ruhiger Modus (leiser, weniger Bewegung)" checked={settings.calm} onChange={(calm) => update({ calm })} />
          </SettingsGroup>
        </>
      }
    >
      <TeethPlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
