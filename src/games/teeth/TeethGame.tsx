import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { DEFAULT_TEETH_SETTINGS, TEETH_SETTINGS_KEY, type BrushMinutes } from "./settings";
import { KAI } from "./steps";
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
              Gerät hinstellen und los: Niemand muss tippen. Geputzt wird in sieben Schritten nach KAI ({KAI}). Das Bild zeigt jedes
              Mal, ob der Mund weit auf ist oder die Zähne zusammen sind und welche Zähne gerade dran sind; dort verschwinden die
              Zuckermonster nach und nach. Der Bildschirm bleibt dabei an.
            </p>
            <p className="setting-note">
              Mit Tastatur: <kbd>←</kbd> <kbd>→</kbd> springen zum vorigen oder nächsten Schritt, die <kbd>Leertaste</kbd> pausiert.
            </p>
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Ansagen vorlesen („Mund weit auf!“)" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Mund weit auf! Unten auf die Backenzähne." />}
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
