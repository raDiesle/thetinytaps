import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useDevice } from "@/lib/device";
import { useStoredSettings } from "@/lib/storage";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY, type ChoiceCount, type ShadowTheme } from "./settings";
import "./shadows.css";

export function ShadowsGame() {
  const [settings, update] = useStoredSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Schatten finden"
      emoji="👤"
      settings={
        <>
          <SettingsGroup title="Spielart">
            <Choice<ShadowTheme>
              label="Bilder"
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "all", label: "🔀 Gemischt" },
                { value: "animals", label: "🐘 Tiere" },
                { value: "vehicles", label: "🚗 Fahrzeuge" },
                { value: "food", label: "🍌 Essen" },
                { value: "things", label: "☂️ Dinge" },
              ]}
            />
            <Choice<ChoiceCount>
              label="Schatten zur Auswahl"
              value={settings.choices}
              onChange={(choices) => update({ choices })}
              options={[
                { value: "2", label: "2 Schatten" },
                { value: "3", label: "3 Schatten" },
                { value: "4", label: "4 Schatten" },
              ]}
            />
          </SettingsGroup>

          <SettingsGroup title="Anzeige">
            <Toggle label="Namen zeigen (Elefant, Auto …)" checked={settings.names} onChange={(names) => update({ names })} />
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Der Elefant sucht seinen Schatten." />}
            <Toggle label="Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Schatten antippen reicht (sonst muss man das Bild ziehen)"
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
            <Toggle
              label="Ruhiger Modus (leiser, weniger Bewegung)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
            />
            {!device.touchOnly && (
              <p className="setting-note">Mit der Tastatur: Pfeiltasten wählen einen Schatten, Leertaste oder Enter nimmt ihn, 1–4 direkt.</p>
            )}
          </SettingsGroup>
        </>
      }
    >
      <ShadowsPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
