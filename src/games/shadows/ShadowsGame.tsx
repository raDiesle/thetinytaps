import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY, type ChoiceCount, type ShadowTheme } from "./settings";
import "./shadows.css";

export function ShadowsGame() {
  const [settings, update] = useGameSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Schatten finden"
      emoji="👤"
      modes={[
        { id: "all", emoji: "🔀", title: "Gemischt" },
        { id: "animals", emoji: "🐘", title: "Tiere" },
        { id: "vehicles", emoji: "🚗", title: "Fahrzeuge" },
        { id: "food", emoji: "🍌", title: "Essen" },
        { id: "things", emoji: "☂️", title: "Dinge" },
      ]}
      mode={settings.theme}
      onMode={(theme) => update({ theme: theme as ShadowTheme })}
      level={
        <Choice<ChoiceCount>
          label="Zur Auswahl"
          value={settings.choices}
          onChange={(choices) => update({ choices })}
          options={[
            { value: "2", label: "2 Bilder" },
            { value: "3", label: "3 Bilder" },
            { value: "4", label: "4 Bilder" },
          ]}
        />
      }
      settings={
        <>
          <SettingsGroup title="Anzeige">
            <Toggle label="Namen zeigen (Elefant, Auto …)" checked={settings.names} onChange={(names) => update({ names })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle label="Schatten antippen reicht (sonst muss man das Bild ziehen)" checked={settings.tap} onChange={(tap) => update({ tap })} />
            {!device.touchOnly && <p className="setting-note">Mit der Tastatur: Pfeiltasten wählen ein Bild, Leertaste oder Enter nimmt es, 1–4 direkt.</p>}
          </SettingsGroup>
        </>
      }
    >
      <ShadowsPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
