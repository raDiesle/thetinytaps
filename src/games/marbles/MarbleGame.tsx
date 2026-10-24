import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevels } from "./settings";

const MODES = [
  { id: "all", emoji: "🌈", title: "Alle nacheinander", featured: true },
  { id: "machine", emoji: "⚙️", title: "Große Maschine" },
  { id: "kitchen", emoji: "🍳", title: "Verrückte Küche" },
  { id: "garden", emoji: "🌻", title: "Im Garten" },
  { id: "topple", emoji: "📚", title: "Alles fällt um" },
  { id: "building", emoji: "🚧", title: "Baustelle" },
  { id: "circus", emoji: "🎪", title: "Zirkus" },
  { id: "track", emoji: "🎢", title: "Kugelbahn" },
  { id: "space", emoji: "🚀", title: "Raketenstart" },
];

export function MarbleGame() {
  const [settings, update] = useGameSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);
  // Older saves may hold a choice that is gone ("both", "machines"): those play all.
  const mode = MODES.some((m) => m.id === settings.levels) ? settings.levels : "all";

  return (
    <GameShell
      title="Kettenreaktion"
      emoji="🎳"
      modes={MODES}
      mode={mode}
      onMode={(levels) => update({ levels: levels as MarbleLevels })}
      settings={
        <>
          <p className="setting-note">Ein Tipp, und dann stößt eins das nächste an: Jedes Level läuft von selbst bis zum Ende, und das Bild fährt mit.</p>
          <SettingsGroup title="Kugelbahn">
            <Toggle
              label="Umbauen: Tippen auf einen der drei Plätze mit 🔧 wechselt das Teil"
              checked={settings.rebuild}
              onChange={(rebuild) => update({ rebuild })}
            />
            <p className="setting-note">
              Glocke, Trampolin, Trichter und Wasserrad gehen reihum; die nächste Kugel nimmt den neuen Weg. Ausgeschaltet bleibt die Bahn wie immer.
            </p>
          </SettingsGroup>
        </>
      }
    >
      <MarblePlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
