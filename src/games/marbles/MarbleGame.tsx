import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevels } from "./settings";

export function MarbleGame() {
  const [settings, update] = useStoredSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);

  return (
    <GameShell
      title="Kugelbahn"
      emoji="🎢"
      settings={
        <>
          <SettingsGroup title="Bahnen">
            <Choice<MarbleLevels>
              label="Spielen"
              value={settings.levels}
              onChange={(levels) => update({ levels })}
              options={[
                { value: "both", label: "Beide nacheinander" },
                { value: "track", label: "🎢 Nur Kugelbahn" },
                { value: "topple", label: "📚 Nur Alles fällt um" },
              ]}
            />
            <p className="setting-note">
              Kugelbahn: Jedes Tippen lässt oben eine Kugel los. Sie rollt über das Xylophon, läutet die Glocke, kreist im Trichter,
              fährt mit dem Schaufelrad und der Wippe und plumpst in den Korb – mehrere Kugeln dürfen gleichzeitig rollen. Ist der Korb
              voll, kommt die nächste Bahn.
            </p>
            <p className="setting-note">
              Alles fällt um: Buntstift, Bauklotz, Bücher, Flasche, Müslipackung … stehen in einer Reihe. Ein Tipp schubst das erste
              Ding an, und eins fällt nach dem anderen um, bis zur Trommel. Jedes Mal stehen andere Sachen da.
            </p>
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Töne (Xylophon, Glocke, Plumps)" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
            <Toggle label="Kurze Ansagen vorlesen („Der Korb ist voll!“)" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Tipp! Dann rollt die Kugel." />}
          </SettingsGroup>
        </>
      }
    >
      <MarblePlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
