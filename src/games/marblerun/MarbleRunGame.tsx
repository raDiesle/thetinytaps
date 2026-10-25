import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { MarbleRunPlay } from "./MarbleRunPlay";
import { DEFAULT_MARBLE_RUN_SETTINGS, MARBLE_RUN_SETTINGS_KEY } from "./settings";

export function MarbleRunGame() {
  const [settings, update] = useGameSettings(MARBLE_RUN_SETTINGS_KEY, DEFAULT_MARBLE_RUN_SETTINGS);

  return (
    <GameShell
      title="Klingende Kugelbahn"
      emoji="🎢"
      settings={
        <>
          <p className="setting-note">
            Die Kugeln rollen die lange Bahn hinunter, über Xylophon, Wippe, Looping, Trommeln und Klangröhren bis in den Korb. Das Bild fährt mit.
          </p>
          <SettingsGroup title="Was rollt denn da?">
            <Toggle label="Oben liegen drei Dinge zur Wahl, ein Tipp lässt genau dieses los" checked={settings.pick} onChange={(pick) => update({ pick })} />
            <p className="setting-note">
              Murmel, Tennisball, Eisenkugel, Apfel und Seifenblase rollen jedes anders; am Computer lassen die Tasten 1, 2 und 3 sie los. Ausgeschaltet öffnet
              ein Tipp den Trichter, und sechs Kugeln rollen von selbst.
            </p>
          </SettingsGroup>
          <SettingsGroup title="Umbauen">
            <Toggle label="Tippen auf einen der sechs Plätze mit 🔧 wechselt das Teil" checked={settings.rebuild} onChange={(rebuild) => update({ rebuild })} />
            <p className="setting-note">
              Glocke, Trampolin, Trichter und Wasserrad gehen reihum; die nächste Kugel nimmt den neuen Weg. Am Computer baut die Leertaste die Bahn Schritt für
              Schritt um. Ausgeschaltet bleibt die Bahn wie immer.
            </p>
          </SettingsGroup>
        </>
      }
    >
      <MarbleRunPlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
